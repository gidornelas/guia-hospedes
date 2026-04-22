import nodemailer from 'nodemailer'
import { env } from '@/lib/env'

function hasSmtpConfig() {
  return Boolean(env.smtpHost && env.smtpPort && env.smtpUser && env.smtpPass)
}

export async function sendPasswordResetEmail({
  to,
  name,
  resetUrl,
}: {
  to: string
  name: string
  resetUrl: string
}) {
  if (!hasSmtpConfig()) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('SMTP não configurado para envio de e-mails.')
    }

    console.log('[PASSWORD RESET URL]', resetUrl)
    return { previewUrl: resetUrl }
  }

  const transporter = nodemailer.createTransport({
    host: env.smtpHost,
    port: Number(env.smtpPort),
    secure: Number(env.smtpPort) === 465,
    auth: {
      user: env.smtpUser,
      pass: env.smtpPass,
    },
  })

  await transporter.sendMail({
    from: env.emailFrom,
    to,
    subject: 'Redefina sua senha no GuiaHóspedes',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; color: #1f2937;">
        <h2 style="margin-bottom: 16px;">Redefinição de senha</h2>
        <p>Olá, ${name}.</p>
        <p>Recebemos um pedido para redefinir sua senha no GuiaHóspedes.</p>
        <p>
          <a href="${resetUrl}" style="display: inline-block; margin-top: 12px; margin-bottom: 12px; background: #b6465f; color: white; text-decoration: none; padding: 12px 18px; border-radius: 10px;">
            Redefinir senha
          </a>
        </p>
        <p>Se o botão não funcionar, use este link:</p>
        <p style="word-break: break-all;">${resetUrl}</p>
        <p>Este link expira em 1 hora.</p>
      </div>
    `,
  })

  return { previewUrl: null }
}
