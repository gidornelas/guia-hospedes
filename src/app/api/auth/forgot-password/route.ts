import { NextRequest, NextResponse } from 'next/server'
import { createPasswordResetToken } from '@/lib/auth'
import { sendPasswordResetEmail } from '@/lib/mailer'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const email = String(body.email || '')

    if (!email) {
      return NextResponse.json(
        { error: 'Informe seu e-mail.' },
        { status: 400 },
      )
    }

    const resetData = await createPasswordResetToken(email)

    if (!resetData) {
      return NextResponse.json({
        success: true,
        message:
          'Se existir uma conta com este e-mail, voce recebera um link para redefinir a senha.',
      })
    }

    const result = await sendPasswordResetEmail({
      to: resetData.user.email,
      name: resetData.user.name,
      resetUrl: resetData.resetUrl,
    })

    return NextResponse.json({
      success: true,
      message:
        'Se existir uma conta com este e-mail, voce recebera um link para redefinir a senha.',
      previewUrl: result.previewUrl,
    })
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Erro ao iniciar redefinicao de senha.',
      },
      { status: 400 },
    )
  }
}
