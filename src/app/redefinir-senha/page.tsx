'use client'

import { Suspense, useMemo, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { CheckCircle2, Eye, EyeOff, LoaderCircle } from 'lucide-react'
import { AuthShell } from '@/components/auth/auth-shell'
import { AuthFormSkeleton } from '@/components/auth/auth-form-skeleton'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

function ResetPasswordForm() {
  const errorId = 'reset-password-error'
  const successId = 'reset-password-success'
  const passwordHintId = 'reset-password-hint'
  const searchParams = useSearchParams()
  const token = searchParams.get('token') || ''
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const hasToken = useMemo(() => Boolean(token), [token])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!hasToken) {
      setError('O link de redefinição esta incompleto ou invalido.')
      return
    }

    if (password !== confirmPassword) {
      setError('As senhas não conferem.')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Não foi possivel redefinir a senha.')
        setIsLoading(false)
        return
      }

      setSuccess(data.message || 'Senha redefinida com sucesso.')
      setPassword('')
      setConfirmPassword('')
      setIsLoading(false)
    } catch {
      setError('Erro ao redefinir a senha. Tente novamente.')
      setIsLoading(false)
    }
  }

  return (
    <AuthShell
      eyebrow="Nova senha"
      title="Defina sua nova senha"
      description="Escolha uma senha segura para voltar ao dashboard. O link de redefinição so pode ser usado uma vez."
      footer={
        <p className="text-sm text-muted-foreground">
          Lembrou da senha?{' '}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Voltar para o login
          </Link>
        </p>
      }
    >
      {!hasToken ? (
        <div
          role="alert"
          className="rounded-xl border border-destructive/25 bg-destructive/10 px-4 py-4 text-sm text-destructive"
        >
          Este link de redefinição esta invalido. Solicite um novo link em{' '}
          <Link href="/esqueci-senha" className="font-medium underline">
            Esqueci minha senha
          </Link>
          .
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
            <CheckCircle2 className="h-4 w-4" />
            Senha atualizada
          </div>
          <p className="leading-6 text-muted-foreground">{success}</p>
          <div className="mt-4">
            <Link
              href="/login"
              className="inline-flex h-9 w-full items-center justify-center rounded-lg bg-primary px-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              Ir para o login
            </Link>
          </div>
        </div>
      ) : (
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

          <div className="space-y-2">
            <Label htmlFor="password">Nova senha</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimo de 8 caracteres"
                required
                minLength={8}
                autoComplete="new-password"
                aria-invalid={Boolean(error)}
                aria-describedby={error ? errorId : passwordHintId}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar nova senha</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repita a nova senha"
                required
                minLength={8}
                autoComplete="new-password"
                aria-invalid={Boolean(error)}
                aria-describedby={error ? errorId : passwordHintId}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((value) => !value)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                aria-label={showConfirmPassword ? 'Ocultar confirmacao de senha' : 'Mostrar confirmacao de senha'}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <p id={passwordHintId} className="text-xs leading-5 text-muted-foreground">
            Escolha uma senha nova com pelo menos 8 caracteres.
          </p>

          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={isLoading || !hasToken}
            aria-busy={isLoading}
          >
            {isLoading ? (
              <>
                <LoaderCircle className="h-4 w-4 animate-spin" />
                Salvando nova senha...
              </>
            ) : (
              'Salvar nova senha'
            )}
          </Button>
        </form>
      )}
    </AuthShell>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<AuthFormSkeleton />}>
      <ResetPasswordForm />
    </Suspense>
  )
}
