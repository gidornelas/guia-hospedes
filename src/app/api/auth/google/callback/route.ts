import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { createSessionPayload, upsertGoogleUser } from '@/lib/auth'
import { env } from '@/lib/env'
import { createSessionToken, setSessionCookie } from '@/lib/session'
import { verifyGoogleIdToken } from '@/lib/google-auth'

const GOOGLE_STATE_COOKIE = 'google-oauth-state'

function safeCallbackUrl(value?: string | null) {
  if (!value || !value.startsWith('/') || value.startsWith('//')) {
    return '/app'
  }

  return value
}

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code')
  const state = request.nextUrl.searchParams.get('state')
  const cookieStore = await cookies()
  const stateCookie = cookieStore.get(GOOGLE_STATE_COOKIE)?.value
  const loginUrl = new URL('/login', env.appUrl)

  if (!code || !state || !stateCookie) {
    loginUrl.searchParams.set('error', 'google_callback')
    return NextResponse.redirect(loginUrl)
  }

  let callbackUrl = '/app'

  try {
    const parsed = JSON.parse(stateCookie) as { state: string; callbackUrl?: string }
    callbackUrl = safeCallbackUrl(parsed.callbackUrl)

    if (parsed.state !== state) {
      loginUrl.searchParams.set('error', 'google_state')
      const response = NextResponse.redirect(loginUrl)
      response.cookies.delete(GOOGLE_STATE_COOKIE)
      return response
    }

    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: env.googleClientId,
        client_secret: env.googleClientSecret,
        redirect_uri: `${env.appUrl}/api/auth/google/callback`,
        grant_type: 'authorization_code',
      }),
    })

    if (!tokenResponse.ok) {
      throw new Error('Falha ao obter token do Google.')
    }

    const tokenData = (await tokenResponse.json()) as {
      access_token?: string
      id_token?: string
    }
    if (!tokenData.access_token) {
      throw new Error('Access token não retornado pelo Google.')
    }

    let profile: { id?: string; email?: string; name?: string; picture?: string }

    // Se houver id_token, valida assinatura, aud e iss antes de confiar nos dados
    if (tokenData.id_token && env.googleClientId) {
      const verified = await verifyGoogleIdToken(tokenData.id_token, env.googleClientId)
      profile = {
        id: verified.sub,
        email: verified.email,
        name: verified.name,
        picture: verified.picture,
      }
    } else {
      // Fallback: busca perfil via access_token (fluxo já seguro por si só)
      const profileResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: { Authorization: `Bearer ${tokenData.access_token}` },
      })

      if (!profileResponse.ok) {
        throw new Error('Falha ao carregar perfil do Google.')
      }

      profile = await profileResponse.json()
    }

    if (!profile.id || !profile.email || !profile.name) {
      throw new Error('Perfil do Google incompleto.')
    }

    const user = await upsertGoogleUser({
      googleId: profile.id,
      email: profile.email,
      name: profile.name,
      image: profile.picture || null,
    })

    const token = await createSessionToken(createSessionPayload(user), {
      rememberMe: true,
    })
    await setSessionCookie(token, { rememberMe: true })

    const response = NextResponse.redirect(new URL(callbackUrl, env.appUrl))
    response.cookies.delete(GOOGLE_STATE_COOKIE)
    return response
  } catch (error) {
    console.error('[GOOGLE AUTH ERROR]', error)
    loginUrl.searchParams.set('error', 'google_auth')
    const response = NextResponse.redirect(loginUrl)
    response.cookies.delete(GOOGLE_STATE_COOKIE)
    return response
  }
}
