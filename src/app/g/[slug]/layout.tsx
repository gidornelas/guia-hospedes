import { Metadata } from 'next'
import { LanguageProvider } from '@/components/shared/language-provider'
import { getGuideIdBySlug } from '@/lib/guide-utils'

interface LayoutProps {
  children: React.ReactNode
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
  const { slug } = await params
  const guide = await getGuideIdBySlug(slug)

  if (!guide || guide.status !== 'PUBLISHED') {
    return {
      title: 'Guia do Hóspede',
      robots: { index: false, follow: false },
    }
  }

  return {
    title: `Guia do Hóspede · GuiaHóspedes`,
    description: 'Seu guia digital com todas as informações da hospedagem.',
    openGraph: {
      title: 'Guia do Hóspede',
      description: 'Seu guia digital com todas as informações da hospedagem.',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Guia do Hóspede',
      description: 'Seu guia digital com todas as informações da hospedagem.',
    },
    robots: { index: true, follow: true },
  }
}

export default async function GuideLayout({
  children,
}: LayoutProps) {
  return <LanguageProvider>{children}</LanguageProvider>
}
