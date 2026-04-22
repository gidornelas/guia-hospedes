import { NextRequest, NextResponse } from 'next/server'
import { resetPassword } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const token = String(body.token || '')
    const password = String(body.password || '')

    await resetPassword(token, password)

    return NextResponse.json({
      success: true,
      message: 'Senha redefinida com sucesso.',
    })
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Erro ao redefinir senha.',
      },
      { status: 400 },
    )
  }
}
