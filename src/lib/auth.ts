import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import { UserRole } from '@prisma/client'
import { db } from '@/lib/db'
import { env } from '@/lib/env'
import type { SessionPayload } from '@/lib/session'

interface RegisterUserInput {
  name: string
  email: string
  password: string
  organizationName?: string
}

interface GoogleProfileInput {
  email: string
  name: string
  image?: string | null
  googleId: string
}

function slugify(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48)
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase()
}

async function generateUniqueOrganizationSlug(baseName: string) {
  const base = slugify(baseName) || 'organizacao'
  let slug = base
  let counter = 1

  while (await db.organization.findUnique({ where: { slug } })) {
    counter += 1
    slug = `${base}-${counter}`
  }

  return slug
}

async function createOrganizationForUser(name: string, organizationName?: string) {
  const cleanName = organizationName?.trim() || `Hospedagem de ${name.split(' ')[0]}`
  const slug = await generateUniqueOrganizationSlug(cleanName)

  return db.organization.create({
    data: {
      name: cleanName,
      slug,
      brandSettings: JSON.stringify({
        primaryColor: '#B6465F',
        font: 'DM Sans',
      }),
    },
  })
}

export function createSessionPayload(user: {
  id: string
  email: string
  name: string | null
  role: UserRole | string
  organizationId: string
  image: string | null
  organization: { name: string }
}): SessionPayload {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    organizationId: user.organizationId,
    organizationName: user.organization.name,
    image: user.image,
  }
}

export async function registerUser(input: RegisterUserInput) {
  const name = input.name.trim()
  const email = normalizeEmail(input.email)
  const password = input.password

  if (name.length < 2) {
    throw new Error('Informe seu nome completo.')
  }

  if (!email) {
    throw new Error('Informe um e-mail válido.')
  }

  if (password.length < 8) {
    throw new Error('A senha deve ter pelo menos 8 caracteres.')
  }

  const existingUser = await db.user.findUnique({ where: { email } })
  if (existingUser) {
    throw new Error('Já existe uma conta com este e-mail.')
  }

  const organization = await createOrganizationForUser(name, input.organizationName)
  const hashedPassword = await bcrypt.hash(password, 10)

  return db.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: UserRole.ADMIN,
      organizationId: organization.id,
      emailVerifiedAt: new Date(),
    },
    include: { organization: true },
  })
}

export async function authenticateUser(email: string, password: string) {
  const normalizedEmail = normalizeEmail(email)

  const user = await db.user.findUnique({
    where: { email: normalizedEmail },
    include: { organization: true },
  })

  if (!user) return null
  if (!user.password) {
    throw new Error('Esta conta usa login social. Entre com Google ou redefina sua senha.')
  }

  const isValid = await bcrypt.compare(password, user.password)
  if (!isValid) return null

  return user
}

export async function upsertGoogleUser(profile: GoogleProfileInput) {
  const email = normalizeEmail(profile.email)

  const existingByGoogle = await db.user.findUnique({
    where: { googleId: profile.googleId },
    include: { organization: true },
  })

  if (existingByGoogle) {
    return db.user.update({
      where: { id: existingByGoogle.id },
      data: {
        name: profile.name,
        email,
        image: profile.image || existingByGoogle.image,
        emailVerifiedAt: new Date(),
      },
      include: { organization: true },
    })
  }

  const existingByEmail = await db.user.findUnique({
    where: { email },
    include: { organization: true },
  })

  if (existingByEmail) {
    return db.user.update({
      where: { id: existingByEmail.id },
      data: {
        googleId: profile.googleId,
        image: profile.image || existingByEmail.image,
        emailVerifiedAt: new Date(),
      },
      include: { organization: true },
    })
  }

  const organization = await createOrganizationForUser(profile.name)

  return db.user.create({
    data: {
      name: profile.name,
      email,
      googleId: profile.googleId,
      image: profile.image || null,
      role: UserRole.ADMIN,
      organizationId: organization.id,
      emailVerifiedAt: new Date(),
    },
    include: { organization: true },
  })
}

export async function createPasswordResetToken(email: string) {
  const normalizedEmail = normalizeEmail(email)
  const user = await db.user.findUnique({ where: { email: normalizedEmail } })

  if (!user) return null

  await db.passwordResetToken.deleteMany({
    where: { userId: user.id },
  })

  const plainToken = crypto.randomBytes(32).toString('hex')
  const tokenHash = crypto.createHash('sha256').update(plainToken).digest('hex')
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60)

  await db.passwordResetToken.create({
    data: {
      userId: user.id,
      tokenHash,
      expiresAt,
    },
  })

  return {
    token: plainToken,
    resetUrl: `${env.appUrl}/redefinir-senha?token=${plainToken}`,
    user,
  }
}

export async function resetPassword(token: string, newPassword: string) {
  if (!token) {
    throw new Error('Token inválido.')
  }

  if (newPassword.length < 8) {
    throw new Error('A nova senha deve ter pelo menos 8 caracteres.')
  }

  const tokenHash = crypto.createHash('sha256').update(token).digest('hex')

  const resetToken = await db.passwordResetToken.findUnique({
    where: { tokenHash },
    include: { user: true },
  })

  if (!resetToken || resetToken.usedAt || resetToken.expiresAt < new Date()) {
    throw new Error('Este link de redefinição é inválido ou expirou.')
  }

  const passwordHash = await bcrypt.hash(newPassword, 10)

  await db.$transaction([
    db.user.update({
      where: { id: resetToken.userId },
      data: {
        password: passwordHash,
        emailVerifiedAt: resetToken.user.emailVerifiedAt || new Date(),
      },
    }),
    db.passwordResetToken.update({
      where: { id: resetToken.id },
      data: { usedAt: new Date() },
    }),
  ])

  return true
}
