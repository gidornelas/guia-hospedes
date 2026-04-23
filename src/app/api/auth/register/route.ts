import { NextRequest, NextResponse } from 'next/server'
import { registerUser } from '@/lib/auth'
import { withCors, handleCorsPreflight } from '@/lib/cors'
import { rateLimit } from '@/lib/rate-limit'

export async function OPTIONS() {
  return handleCorsPreflight()
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? request.headers.get('x-real-ip') ?? 'unknown'
    const limit = rateLimit(`register:${ip}`, { limit: 5, windowMs: 60_000 })
    if (!limit.success) {
      return withCors(NextResponse.json(
        { error: 'Muitas tentativas de cadastro. Tente novamente em alguns minutos.' },
        { status: 429 },
      ))
    }

    const body = await request.json()
    const name = String(body.name || '')
    const email = String(body.email || '')
    const password = String(body.password || '')
    const organizationName = String(body.organizationName || '')

    await registerUser({
      name,
      email,
      password,
      organizationName,
    })

    return withCors(NextResponse.json({
      success: true,
      message: 'Conta criada com sucesso. Faça login para continuar.',
    }))
  } catch (error) {
    return withCors(NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erro ao criar conta.' },
      { status: 400 },
    ))
  }
}
