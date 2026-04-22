import { NextRequest, NextResponse } from 'next/server'
import { createSessionPayload, registerUser } from '@/lib/auth'
import { createSessionToken, setSessionCookie } from '@/lib/session'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const name = String(body.name || '')
    const email = String(body.email || '')
    const password = String(body.password || '')
    const organizationName = String(body.organizationName || '')

    const user = await registerUser({
      name,
      email,
      password,
      organizationName,
    })

    const token = await createSessionToken(createSessionPayload(user), {
      rememberMe: true,
    })
    await setSessionCookie(token, { rememberMe: true })

    return NextResponse.json({
      success: true,
      user: { name: user.name, email: user.email },
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erro ao criar conta.' },
      { status: 400 },
    )
  }
}
