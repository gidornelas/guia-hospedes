import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

const COOKIE_NAME = 'session-token'
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30 // 30 dias

function getSecret() {
  const secret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET
  if (!secret) {
    throw new Error('AUTH_SECRET ou NEXTAUTH_SECRET deve estar configurado')
  }
  return new TextEncoder().encode(secret)
}

export interface SessionPayload {
  id: string
  email: string
  name: string | null
  role: string
  organizationId: string
  organizationName: string
  image: string | null
}

export async function createSessionToken(payload: SessionPayload): Promise<string> {
  return new SignJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(getSecret())
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret(), {
      clockTolerance: 60,
    })
    return payload as unknown as SessionPayload
  } catch {
    return null
  }
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  if (!token) return null
  return verifySessionToken(token)
}

export async function setSessionCookie(token: string) {
  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: COOKIE_MAX_AGE,
    path: '/',
  })
}

export async function deleteSessionCookie() {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
}
