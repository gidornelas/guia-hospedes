import { NextRequest, NextResponse } from 'next/server'
import { authenticateUser, createSessionPayload } from '@/lib/auth'
import { createSessionToken, setSessionCookie } from '@/lib/session'
import { withCors, handleCorsPreflight } from '@/lib/cors'
import { rateLimit } from '@/lib/rate-limit'

export async function OPTIONS() {
  return handleCorsPreflight()
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? request.headers.get('x-real-ip') ?? 'unknown'
    const limit = rateLimit(`login:${ip}`, { limit: 10, windowMs: 60_000 })
    if (!limit.success) {
      return withCors(NextResponse.json(
        { error: 'Muitas tentativas. Tente novamente em alguns minutos.' },
        { status: 429 },
      ))
    }

    const body = await request.json()
    const email = String(body.email || '')
    const password = String(body.password || '')
    const rememberMe = Boolean(body.rememberMe)

    if (!email || !password) {
      return withCors(NextResponse.json(
        { error: 'E-mail e senha são obrigatórios.' },
        { status: 400 },
      ))
    }

    let user
    try {
      user = await authenticateUser(email, password)
    } catch (error) {
      return withCors(NextResponse.json(
        { error: error instanceof Error ? error.message : 'Falha ao autenticar.' },
        { status: 400 },
      ))
    }

    if (!user) {
      return withCors(NextResponse.json(
        { error: 'E-mail ou senha incorretos.' },
        { status: 401 },
      ))
    }

    const token = await createSessionToken(createSessionPayload(user), { rememberMe })
    await setSessionCookie(token, { rememberMe })

    return withCors(NextResponse.json({
      success: true,
      user: { name: user.name, email: user.email },
    }))
  } catch (error) {
    console.error('[LOGIN ERROR]', error)
    return withCors(NextResponse.json(
      { error: 'Erro interno do servidor.' },
      { status: 500 },
    ))
  }
}
