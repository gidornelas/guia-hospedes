import { NextRequest, NextResponse } from 'next/server'
import { resetPassword } from '@/lib/auth'
import { withCors, handleCorsPreflight } from '@/lib/cors'
import { rateLimit } from '@/lib/rate-limit'

export async function OPTIONS() {
  return handleCorsPreflight()
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? request.headers.get('x-real-ip') ?? 'unknown'
    const limit = rateLimit(`reset-password:${ip}`, { limit: 5, windowMs: 60_000 })
    if (!limit.success) {
      return withCors(NextResponse.json(
        { error: 'Muitas tentativas. Tente novamente em alguns minutos.' },
        { status: 429 },
      ))
    }

    const body = await request.json()
    const token = String(body.token || '')
    const password = String(body.password || '')

    await resetPassword(token, password)

    return withCors(NextResponse.json({
      success: true,
      message: 'Senha redefinida com sucesso.',
    }))
  } catch (error) {
    return withCors(NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Erro ao redefinir senha.',
      },
      { status: 400 },
    ))
  }
}
