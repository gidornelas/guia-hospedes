import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifySessionToken } from '@/lib/session'
import { ensureValidUrl } from '@/lib/utils'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // DEBUG: logar URL recebida para diagnosticar problema no Railway
  if (process.env.NODE_ENV === 'production') {
    console.error('[MIDDLEWARE DEBUG] request.url:', request.url)
    console.error('[MIDDLEWARE DEBUG] request.nextUrl:', request.nextUrl.toString())
  }

  // Rotas públicas
  const publicRoutes = ['/', '/precos', '/contato', '/login']
  const isPublicRoute = publicRoutes.includes(pathname) || pathname.startsWith('/g/')

  // API routes públicas
  if (pathname.startsWith('/api/')) {
    return NextResponse.next()
  }

  // Assets estáticos
  if (pathname.startsWith('/_next/') || pathname.startsWith('/static/')) {
    return NextResponse.next()
  }

  // Verificar cookie de sessão manual
  const token = request.cookies.get('session-token')?.value
  const session = token ? await verifySessionToken(token) : null

  // Se não estiver autenticado e tentar acessar rota protegida
  if (!session && !isPublicRoute) {
    const baseUrl = ensureValidUrl(request.url)
    const loginUrl = new URL('/login', baseUrl)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
