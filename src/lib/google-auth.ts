/**
 * Validação do Google ID Token usando JWKS.
 * Se o token for válido, retorna o payload.
 * Se não for válido, lança erro.
 */
import { jwtVerify, createRemoteJWKSet } from 'jose'

const GOOGLE_ISSUERS = ['https://accounts.google.com', 'accounts.google.com']
const GOOGLE_JWKS_URI = new URL('https://www.googleapis.com/oauth2/v3/certs')

export async function verifyGoogleIdToken(idToken: string, clientId: string) {
  const JWKS = createRemoteJWKSet(GOOGLE_JWKS_URI)

  const { payload } = await jwtVerify(idToken, JWKS, {
    issuer: GOOGLE_ISSUERS,
    audience: clientId,
    clockTolerance: 60,
  })

  return payload as {
    sub: string
    email: string
    name: string
    picture?: string
    aud: string
    iss: string
    exp: number
    iat: number
  }
}
