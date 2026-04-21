import { handlers } from '@/lib/auth'
import { NextRequest } from 'next/server'

function fixRequestUrl(request: NextRequest): NextRequest {
  // Railway proxy pode passar URL sem protocolo
  const url = request.url
  if (!url.startsWith('http')) {
    const host = request.headers.get('host') || 'localhost'
    const protocol = request.headers.get('x-forwarded-proto') || 'https'
    const fixedUrl = `${protocol}://${host}${request.nextUrl.pathname}${request.nextUrl.search}`
    // @ts-ignore - patch url for NextAuth compatibility
    request.url = fixedUrl
  }
  return request
}

async function GET(request: NextRequest) {
  return handlers.GET(fixRequestUrl(request))
}

async function POST(request: NextRequest) {
  return handlers.POST(fixRequestUrl(request))
}

export { GET, POST }
