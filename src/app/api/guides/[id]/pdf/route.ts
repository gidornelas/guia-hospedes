import { NextResponse } from 'next/server'
import { renderToBuffer } from '@react-pdf/renderer'
import { db } from '@/lib/db'
import { GuidePdfDocument } from '@/components/pdf/guide-pdf'
import { getLocaleFromSearchParams } from '@/lib/i18n'

export const dynamic = 'force-dynamic'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const { searchParams } = new URL(request.url)
  const locale = getLocaleFromSearchParams(searchParams)

  const property = await db.property.findUnique({
    where: { id },
    include: {
      checkIn: true,
      checkOut: true,
      wifi: true,
      rules: true,
      devices: true,
      contacts: true,
      recommendations: true,
      links: true,
      organization: true,
      guide: true,
    },
  })

  if (!property || !property.guide) {
    return NextResponse.json(
      { error: 'Guia não encontrado' },
      { status: 404 }
    )
  }

  const pdf = await renderToBuffer(
    GuidePdfDocument({
      property,
      organizationName: property.organization.name,
      locale,
    })
  )

  return new NextResponse(new Uint8Array(pdf), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="guia-${property.slug}-${locale}.pdf"`,
    },
  })
}
