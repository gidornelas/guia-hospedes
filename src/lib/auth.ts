import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { z } from 'zod'
import bcrypt from 'bcryptjs'

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

// Usuários de demonstração para desenvolvimento
const DEMO_USERS = [
  {
    id: '1',
    name: 'João Silva',
    email: 'joao@guiahospedes.com',
    password: '$2a$10$abcdefghijklmnopqrstuv', // senha123 hash
    role: 'ADMIN',
    organizationId: 'org-1',
    organizationName: 'GuiaHóspedes',
    image: null,
  },
  {
    id: '2',
    name: 'Maria Santos',
    email: 'maria@exemplo.com',
    password: '$2a$10$abcdefghijklmnopqrstuv',
    role: 'MANAGER',
    organizationId: 'org-1',
    organizationName: 'GuiaHóspedes',
    image: null,
  },
  {
    id: '3',
    name: 'Carlos Lima',
    email: 'carlos@exemplo.com',
    password: '$2a$10$abcdefghijklmnopqrstuv',
    role: 'HOST',
    organizationId: 'org-2',
    organizationName: 'Host Premium',
    image: null,
  },
]

// Hash real da senha "senha123" para comparação
const SENHA123_HASH = '$2a$10$K8XpVjDRxL8P3jCJqXJVvOQE8T7xYxjxNxEePGJqFVQyxbJXmV9Cm'

export const {
  handlers,
  auth,
  signIn,
  signOut,
} = NextAuth({
  trustHost: true,
  secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'E-mail', type: 'email' },
        password: { label: 'Senha', type: 'password' },
      },
      async authorize(credentials) {
        const parsed = credentialsSchema.safeParse(credentials)
        if (!parsed.success) return null

        const { email, password } = parsed.data

        // Tenta buscar do banco primeiro (se disponível)
        try {
          const { db } = await import('./db')
          const user = await db.user.findUnique({
            where: { email },
            include: { organization: true },
          })

          if (user) {
            const isValid = await bcrypt.compare(password, user.password)
            if (isValid) {
              return {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                organizationId: user.organizationId,
                organizationName: user.organization.name,
                image: user.image,
              }
            }
          }
        } catch {
          // Banco não disponível, usa usuários de demo
        }

        // Fallback para usuários de demonstração
        const demoUser = DEMO_USERS.find((u) => u.email === email)
        if (!demoUser) return null

        // Verifica a senha hardcoded para demo
        const isDemoValid = password === 'senha123'
        if (!isDemoValid) return null

        return {
          id: demoUser.id,
          name: demoUser.name,
          email: demoUser.email,
          role: demoUser.role,
          organizationId: demoUser.organizationId,
          organizationName: demoUser.organizationName,
          image: demoUser.image,
        }
      },
    }),
  ],
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
        token.organizationId = user.organizationId
        token.organizationName = user.organizationName
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        session.user.organizationId = token.organizationId as string
        session.user.organizationName = token.organizationName as string
      }
      return session
    },
  },
})
