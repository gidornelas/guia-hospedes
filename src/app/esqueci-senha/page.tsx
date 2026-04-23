'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, LoaderCircle, MailCheck } from 'lucide-react'
import { AuthShell } from '@/components/auth/auth-shell'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function ForgotPasswordPage() {
  const errorId = 'forgot-password-error'
  const successId = 'forgot-password-success'
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccess('')
    setPreviewUrl(null)

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Nao foi possivel enviar o link de redefinicao.')
        setIsLoading(false)
        return
      }

      setSuccess(data.message || 'Se a conta existir, enviaremos um link para o seu e-mail.')
      setPreviewUrl(data.previewUrl || null)
      setIsLoading(false)
    } catch {
      setError('Erro ao enviar o link. Tente novamente.')
      setIsLoading(false)
    }
  }

  return (
    <AuthShell
      eyebrow="Recuperar acesso"
      title="Esqueceu sua senha?"
      description="Informe o e-mail da sua conta. Se ele existir, enviaremos um link para redefinir a senha com seguranca."
      footer={
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para o login
        </Link>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {error ? (
          <div
            id={errorId}
            role="alert"
            className="rounded-xl border border-destructive/25 bg-destructive/10 px-4 py-3 text-sm text-destructive"
          >
            {error}
          </div>
        ) : null}

        {success ? (
          <div
            id={successId}
            role="status"
            aria-live="polite"
            className="rounded-xl border border-primary/20 bg-primary/10 px-4 py-4 text-sm text-foreground"
          >
            <div className="mb-2 flex items-center gap-2 font-medium text-primary">
              <MailCheck className="h-4 w-4" />
              Link de redefinicao solicitado
            </div>
            <p className="leading-6 text-muted-foreground">{success}</p>
            {previewUrl ? (
              <p className="mt-3 leading-6 text-muted-foreground">
                Como o SMTP ainda nao esta configurado neste ambiente, voce pode abrir o link de desenvolvimento aqui:{' '}
                <a href={previewUrl} className="font-medium text-primary hover:underline">
                  redefinir senha
                </a>
              </p>
            ) : null}
          </div>
        ) : null}

        <div className="space-y-2">
          <Label htmlFor="email">E-mail</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="voce@empresa.com"
            autoComplete="email"
            aria-invalid={Boolean(error)}
            aria-describedby={error ? errorId : success ? successId : undefined}
            required
          />
        </div>

        <Button type="submit" size="lg" className="w-full" disabled={isLoading} aria-busy={isLoading}>
          {isLoading ? (
            <>
              <LoaderCircle className="h-4 w-4 animate-spin" />
              Enviando link...
            </>
          ) : (
            'Enviar link de redefinicao'
          )}
        </Button>
      </form>
    </AuthShell>
  )
}
