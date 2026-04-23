'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
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

export default function RegisterPage() {
  const formErrorId = 'register-form-error'
  const passwordHintId = 'register-password-hint'
  const [name, setName] = useState('')
  const [organizationName, setOrganizationName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const callbackUrl = useMemo(() => {
    if (typeof window === 'undefined') {
      return '/app'
    }

    return safeCallbackUrl(new URLSearchParams(window.location.search).get('callbackUrl'))
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('As senhas nao conferem.')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          password,
          organizationName,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Nao foi possivel criar sua conta.')
        setIsLoading(false)
        return
      }

      window.location.href = callbackUrl
    } catch {
      setError('Erro ao criar a conta. Tente novamente.')
      setIsLoading(false)
    }
  }

  return (
    <AuthShell
      eyebrow="Criar conta"
      title="Cadastre sua conta real"
      description="Crie seu acesso para entrar no dashboard, publicar guias e gerenciar sua operacao sem depender de usuarios de demonstracao."
      footer={
        <p className="text-sm text-muted-foreground">
          Ja tem conta?{' '}
          <Link
            href={`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`}
            className="font-medium text-primary hover:underline"
          >
            Entrar
          </Link>
        </p>
      }
    >
      <div className="space-y-4">
        <Button
          type="button"
          variant="outline"
          size="lg"
          className="w-full justify-center gap-2"
          aria-label="Continuar com Google"
          onClick={() => {
            window.location.href = `/api/auth/google?callbackUrl=${encodeURIComponent(callbackUrl)}`
          }}
        >
          <Chrome className="h-4 w-4" />
          Continuar com Google
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
        {error ? (
          <div
            id={formErrorId}
            role="alert"
            className="rounded-xl border border-destructive/25 bg-destructive/10 px-4 py-3 text-sm text-destructive"
          >
            {error}
          </div>
        ) : null}

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="name">Nome completo</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Seu nome"
              autoComplete="name"
              aria-invalid={Boolean(error)}
              aria-describedby={error ? formErrorId : undefined}
              required
            />
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="organizationName">Nome da operacao ou empresa</Label>
            <Input
              id="organizationName"
              value={organizationName}
              onChange={(e) => setOrganizationName(e.target.value)}
              placeholder="Opcional"
            />
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="voce@empresa.com"
              autoComplete="email"
              aria-invalid={Boolean(error)}
              aria-describedby={error ? formErrorId : undefined}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
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
                aria-describedby={error ? formErrorId : passwordHintId}
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
            <Label htmlFor="confirmPassword">Confirmar senha</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repita a senha"
                required
                minLength={8}
                autoComplete="new-password"
                aria-invalid={Boolean(error)}
                aria-describedby={error ? formErrorId : passwordHintId}
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
        </div>
        <p id={passwordHintId} className="text-xs leading-5 text-muted-foreground">
          Use pelo menos 8 caracteres e combine letras, numeros e simbolos se puder.
        </p>

        <Button type="submit" size="lg" className="w-full" disabled={isLoading} aria-busy={isLoading}>
          {isLoading ? (
            <>
              <LoaderCircle className="h-4 w-4 animate-spin" />
              Criando conta...
            </>
          ) : (
            'Criar conta'
          )}
        </Button>
      </form>
    </AuthShell>
  )
}
