'use client'

import { Suspense, useMemo, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Chrome, Eye, EyeOff, LoaderCircle } from 'lucide-react'
import { AuthShell } from '@/components/auth/auth-shell'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

function safeCallbackUrl(value?: string | null) {
  if (!value || !value.startsWith('/') || value.startsWith('//')) {
    return '/app'
  }

  return value
}

function getFriendlyErrorMessage(error: string | null) {
  switch (error) {
    case 'google_not_configured':
      return 'O login com Google ainda nao foi configurado neste ambiente.'
    case 'google_callback':
    case 'google_state':
    case 'google_auth':
      return 'Nao foi possivel concluir a autenticacao com Google. Tente novamente.'
    default:
      return ''
  }
}

function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formError, setFormError] = useState('')
  const searchParams = useSearchParams()
  const callbackUrl = safeCallbackUrl(searchParams.get('callbackUrl'))
  const queryError = useMemo(
    () => getFriendlyErrorMessage(searchParams.get('error')),
    [searchParams],
  )

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setFormError('')

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, rememberMe }),
      })

      const data = await response.json()

      if (!response.ok) {
        setFormError(data.error || 'E-mail ou senha incorretos')
        setIsLoading(false)
        return
      }

      window.location.href = callbackUrl
    } catch {
      setFormError('Erro ao conectar com o servidor')
      setIsLoading(false)
    }
  }

  return (
    <>
      <div className="space-y-4">
        <Button
          type="button"
          variant="outline"
          size="lg"
          className="w-full justify-center gap-2"
          onClick={() => {
            window.location.href = `/api/auth/google?callbackUrl=${encodeURIComponent(callbackUrl)}`
          }}
        >
          <Chrome className="h-4 w-4" />
          Entrar com Google
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border/70" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-background px-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">
              ou com e-mail e senha
            </span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {queryError ? (
          <div className="rounded-xl border border-destructive/25 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {queryError}
          </div>
        ) : null}

        {formError ? (
          <div className="rounded-xl border border-destructive/25 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {formError}
          </div>
        ) : null}

        <div className="space-y-2">
          <Label htmlFor="email">E-mail</Label>
          <Input
            id="email"
            type="email"
            placeholder="voce@empresa.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between gap-3">
            <Label htmlFor="password">Senha</Label>
            <Link href="/esqueci-senha" className="text-sm font-medium text-primary hover:underline">
              Esqueci a senha
            </Link>
          </div>

          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <label className="flex items-center gap-3 rounded-xl border border-border/70 bg-muted/35 px-3 py-3 text-sm text-foreground">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
          />
          <span>Manter conectado neste dispositivo</span>
        </label>

        <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <LoaderCircle className="h-4 w-4 animate-spin" />
              Entrando...
            </>
          ) : (
            'Entrar'
          )}
        </Button>
      </form>
    </>
  )
}

export default function LoginPage() {
  return (
    <AuthShell
      eyebrow="Entrar"
      title="Acesse sua conta"
      description="Entre com e-mail e senha ou use seu Google para abrir o dashboard e continuar a operacao da sua hospedagem."
      footer={
        <p className="text-sm text-muted-foreground">
          Ainda nao tem conta?{' '}
          <Link href="/cadastro" className="font-medium text-primary hover:underline">
            Criar conta
          </Link>
        </p>
      }
    >
      <Suspense fallback={<div className="text-center text-sm text-muted-foreground">Carregando...</div>}>
        <LoginForm />
      </Suspense>
    </AuthShell>
  )
}
