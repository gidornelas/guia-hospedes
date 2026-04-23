import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const property = await db.property.findUnique({
      where: { id, deletedAt: null },
      include: {
        checkIn: true,
        checkOut: true,
        wifi: true,
        rules: true,
        devices: true,
        contacts: true,
        recommendations: true,
        links: true,
        guide: true,
      },
    })

    if (!property) {
      return NextResponse.json({ error: 'Imóvel não encontrado' }, { status: 404 })
    }

    return NextResponse.json(property)
  } catch (error) {
    console.error('Erro ao buscar imóvel:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
