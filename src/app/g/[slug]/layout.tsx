import { Metadata } from 'next'
import { LanguageProvider } from '@/components/shared/language-provider'

export const metadata: Metadata = {
  robots: { index: true, follow: true },
}

export default function GuideLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <LanguageProvider>{children}</LanguageProvider>
}
