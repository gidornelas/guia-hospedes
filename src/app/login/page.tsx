'use client'

import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { BookOpen, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/app'

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'E-mail ou senha incorretos')
        setIsLoading(false)
        return
      }

      // Login bem-sucedido, redireciona
      window.location.href = callbackUrl
    } catch {
      setError('Erro ao conectar com o servidor')
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="email">E-mail</Label>
        <Input
          id="email"
          type="email"
          placeholder="seu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Senha</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Sua senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Entrando...' : 'Entrar'}
      </Button>
    </form>
  )
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="border-b border-border px-4 py-4">
        <div className="mx-auto max-w-7xl">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <BookOpen className="h-4 w-4" />
            </div>
            <span className="font-heading text-xl font-semibold">GuiaHóspedes</span>
          </Link>
        </div>
      </header>

      {/* Form */}
      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="font-heading text-2xl font-bold tracking-tight">
              Bem-vindo de volta
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Entre na sua conta para gerenciar seus imóveis
            </p>
          </div>

          <Suspense fallback={<div className="text-center">Carregando...</div>}>
            <LoginForm />
          </Suspense>

          <div className="rounded-lg bg-muted p-4 text-sm text-muted-foreground">
            <p className="font-medium text-foreground mb-2">Dados de demonstração:</p>
            <p>Admin: joao@guiahospedes.com / senha123</p>
            <p>Manager: maria@exemplo.com / senha123</p>
            <p>Host: carlos@exemplo.com / senha123</p>
          </div>
        </div>
      </div>
    </div>
  )
}
