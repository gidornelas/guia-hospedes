import { NextRequest, NextResponse } from 'next/server'
import { createPasswordResetToken } from '@/lib/auth'
import { sendPasswordResetEmail } from '@/lib/mailer'
import { withCors, handleCorsPreflight } from '@/lib/cors'
import { rateLimit } from '@/lib/rate-limit'

export async function OPTIONS() {
  return handleCorsPreflight()
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? request.headers.get('x-real-ip') ?? 'unknown'
    const limit = rateLimit(`forgot-password:${ip}`, { limit: 3, windowMs: 60_000 })
    if (!limit.success) {
      return withCors(NextResponse.json(
        { error: 'Muitas tentativas. Tente novamente em alguns minutos.' },
        { status: 429 },
      ))
    }

    const body = await request.json()
    const email = String(body.email || '')

    if (!email) {
      return withCors(NextResponse.json(
        { error: 'Informe seu e-mail.' },
        { status: 400 },
      ))
    }

    const resetData = await createPasswordResetToken(email)

    if (!resetData) {
      return withCors(NextResponse.json({
        success: true,
        message:
          'Se existir uma conta com este e-mail, você receberá um link para redefinir a senha.',
      }))
    }

    const result = await sendPasswordResetEmail({
      to: resetData.user.email,
      name: resetData.user.name,
      resetUrl: resetData.resetUrl,
    })

    return withCors(NextResponse.json({
      success: true,
      message:
        'Se existir uma conta com este e-mail, você receberá um link para redefinir a senha.',
      previewUrl: result.previewUrl,
    }))
  } catch (error) {
    return withCors(NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Erro ao iniciar redefinição de senha.',
      },
      { status: 400 },
    ))
  }
}
