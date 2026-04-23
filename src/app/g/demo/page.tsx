import { redirect } from 'next/navigation'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

export default async function DemoPage() {
  const guide = await db.guide.findFirst({
    where: { status: 'PUBLISHED', property: { deletedAt: null } },
    orderBy: { updatedAt: 'desc' },
    select: { slug: true },
  })

  if (!guide) {
    redirect('/')
  }

  // Remove o prefixo 'guia-' do slug
  const publicSlug = guide.slug.replace(/^guia-/, '')
  redirect(`/g/${publicSlug}`)
}
