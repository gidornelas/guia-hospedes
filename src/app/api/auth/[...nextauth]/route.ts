import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ status: 'auth endpoint - NextAuth temporarily disabled for debugging' })
}

export async function POST() {
  return NextResponse.json({ status: 'auth endpoint - NextAuth temporarily disabled for debugging' })
}
