import { NextRequest, NextResponse } from 'next/server'
import { authenticateUser, createSessionPayload } from '@/lib/auth'
import { createSessionToken, setSessionCookie } from '@/lib/session'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const email = String(body.email || '')
    const password = String(body.password || '')
    const rememberMe = Boolean(body.rememberMe)

    if (!email || !password) {
      return NextResponse.json(
        { error: 'E-mail e senha sao obrigatorios.' },
        { status: 400 },
      )
    }

    let user
    try {
      user = await authenticateUser(email, password)
    } catch (error) {
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Falha ao autenticar.' },
        { status: 400 },
      )
    }

    if (!user) {
      return NextResponse.json(
        { error: 'E-mail ou senha incorretos.' },
        { status: 401 },
      )
    }

    const token = await createSessionToken(createSessionPayload(user), { rememberMe })
    await setSessionCookie(token, { rememberMe })

    return NextResponse.json({
      success: true,
      user: { name: user.name, email: user.email },
    })
  } catch (error) {
    console.error('[LOGIN ERROR]', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor.' },
      { status: 500 },
    )
  }
}
