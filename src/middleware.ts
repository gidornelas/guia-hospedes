import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

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

  // Verificar cookie de sessão (Auth.js v5)
  const hasSession =
    request.cookies.has('authjs.session-token') ||
    request.cookies.has('__Host-authjs.session-token') ||
    request.cookies.has('__Secure-authjs.session-token') ||
    // Fallback para cookie legado (NextAuth v4)
    request.cookies.has('next-auth.session-token') ||
    request.cookies.has('__Secure-next-auth.session-token')

  // Se não estiver autenticado e tentar acessar rota protegida
  if (!hasSession && !isPublicRoute) {
    // Garante URL absoluta com protocolo (necessário atrás de proxies como Railway)
    let baseUrl = request.url
    if (!baseUrl.startsWith('http')) {
      const host = request.headers.get('host') || 'localhost'
      const protocol = request.headers.get('x-forwarded-proto') || 'https'
      baseUrl = `${protocol}://${host}${pathname}`
    }
    const loginUrl = new URL('/login', baseUrl)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
