import { NextResponse } from 'next/server'
import { deleteSessionCookie } from '@/lib/session'
import { withCors, handleCorsPreflight } from '@/lib/cors'

export async function OPTIONS() {
  return handleCorsPreflight()
}

export async function POST() {
  await deleteSessionCookie()
  return withCors(NextResponse.json({ success: true }))
}
