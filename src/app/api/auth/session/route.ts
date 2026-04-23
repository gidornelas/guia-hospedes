import { NextResponse } from 'next/server'
import { getSession } from '@/lib/session'
import { withCors, handleCorsPreflight } from '@/lib/cors'

export async function OPTIONS() {
  return handleCorsPreflight()
}

export async function GET() {
  const session = await getSession()
  if (!session) {
    return withCors(NextResponse.json({ user: null }))
  }
  return withCors(NextResponse.json({
    user: {
      name: session.name,
      email: session.email,
      image: session.image,
    },
  }))
}
