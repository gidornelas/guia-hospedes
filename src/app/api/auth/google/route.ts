import crypto from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { env } from '@/lib/env'

const GOOGLE_STATE_COOKIE = 'google-oauth-state'

function safeCallbackUrl(value?: string | null) {
  if (!value || !value.startsWith('/') || value.startsWith('//')) {
    return '/app'
  }

  return value
}

export async function GET(request: NextRequest) {
  const callbackUrl = safeCallbackUrl(request.nextUrl.searchParams.get('callbackUrl'))

  if (!env.googleClientId || !env.googleClientSecret) {
    const loginUrl = new URL('/login', env.appUrl)
    loginUrl.searchParams.set('error', 'google_not_configured')
    return NextResponse.redirect(loginUrl)
  }

  const state = crypto.randomBytes(20).toString('hex')
  const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth')
  authUrl.searchParams.set('client_id', env.googleClientId)
  authUrl.searchParams.set('redirect_uri', `${env.appUrl}/api/auth/google/callback`)
  authUrl.searchParams.set('response_type', 'code')
  authUrl.searchParams.set('scope', 'openid email profile')
  authUrl.searchParams.set('state', state)
  authUrl.searchParams.set('prompt', 'select_account')

  const response = NextResponse.redirect(authUrl)
  response.cookies.set(
    GOOGLE_STATE_COOKIE,
    JSON.stringify({ state, callbackUrl }),
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 10,
      path: '/',
    },
  )

  return response
}
