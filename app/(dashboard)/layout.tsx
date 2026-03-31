import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { Sidebar } from '@/components/dashboard/Sidebar'
import { ROUTES } from '@/lib/constants'

/**
 * Dashboard layout — requires authenticated session.
 * All routes inside (dashboard) are protected.
 */
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  // Redirect unauthenticated users to login
  if (!session?.user) {
    redirect(ROUTES.login)
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar user={session.user} />
      <main className="flex-1 overflow-auto">
        <div className="mx-auto max-w-5xl px-6 py-8">{children}</div>
      </main>
    </div>
  )
}
