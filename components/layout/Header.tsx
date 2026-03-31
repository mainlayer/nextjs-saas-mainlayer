import Link from 'next/link'
import { auth } from '@/lib/auth'
import { APP_NAME, ROUTES } from '@/lib/constants'

/**
 * Marketing site header.
 * Shows login/dashboard links based on auth state.
 */
export async function Header() {
  const session = await auth()
  const isLoggedIn = !!session?.user

  return (
    <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="mx-auto max-w-5xl px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href={ROUTES.home} className="text-xl font-bold text-gray-900">
          {APP_NAME}
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href={ROUTES.pricing} className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
            Pricing
          </Link>
        </nav>

        {/* Auth buttons */}
        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <Link
              href={ROUTES.dashboard}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                href={ROUTES.login}
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                Sign in
              </Link>
              <Link
                href={ROUTES.register}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
              >
                Get started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
