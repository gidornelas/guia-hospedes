import { NextResponse } from 'next/server'

/**
 * Adiciona headers CORS a uma resposta Next.js.
 * Útil para API routes que podem ser chamadas de domínios diferentes em produção.
 */
export function withCors(response: NextResponse): NextResponse {
  response.headers.set('Access-Control-Allow-Origin', '*')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  return response
}

export function handleCorsPreflight(): NextResponse {
  return withCors(new NextResponse(null, { status: 204 }))
}
