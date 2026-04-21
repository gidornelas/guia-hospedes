import { Sidebar, MobileMenuButton } from '@/components/dashboard/sidebar'
import { Topbar } from '@/components/dashboard/topbar'
import { getSession } from '@/lib/session'
import { redirect } from 'next/navigation'

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()

  if (!session) {
    redirect('/login')
  }

  return (
    <div className="flex min-h-screen bg-background">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        Pular para o conteúdo principal
      </a>
      <Sidebar />
      <div className="flex flex-1 flex-col lg:pl-64 transition-all duration-300">
        <Topbar />
        <main id="main-content" className="flex-1 p-4 sm:p-6" tabIndex={-1}>
          {children}
        </main>
      </div>
    </div>
  )
}
