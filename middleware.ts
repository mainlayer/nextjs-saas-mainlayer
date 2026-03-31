/**
 * Next.js middleware
 *
 * Responsibilities:
 * 1. Protect dashboard routes — redirect unauthenticated users to /login
 * 2. Check Mainlayer entitlement for billing-gated routes — redirect to /billing if no active plan
 */
import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Routes that require an active paid subscription
const PAID_ROUTES = [
  // Add paths that require a paid plan, e.g.:
  // '/dashboard/pro-feature',
] as const

export default auth(async (req: NextRequest & { auth?: { user?: { email?: string | null; id?: string } } | null }) => {
  const { pathname } = req.nextUrl
  const session = req.auth

  // -------------------------------------------------------------------------
  // 1. Authentication guard — protect all /dashboard/* routes
  // -------------------------------------------------------------------------
  const isDashboardRoute = pathname.startsWith('/dashboard') || pathname.startsWith('/billing') || pathname.startsWith('/settings')

  if (isDashboardRoute && !session?.user) {
    const loginUrl = new URL('/login', req.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // -------------------------------------------------------------------------
  // 2. Entitlement guard — check Mainlayer for paid routes
  // -------------------------------------------------------------------------
  const isPaidRoute = PAID_ROUTES.some((route) => pathname.startsWith(route))

  if (isPaidRoute && session?.user) {
    const payerWallet = session.user.email ?? session.user.id
    const resourceId = process.env.MAINLAYER_RESOURCE_ID
    const apiKey = process.env.MAINLAYER_API_KEY

    if (payerWallet && resourceId && apiKey) {
      try {
        const entitlementUrl = new URL('https://api.mainlayer.fr/entitlements/check')
        entitlementUrl.searchParams.set('resource_id', resourceId)
        entitlementUrl.searchParams.set('payer_wallet', payerWallet)

        const res = await fetch(entitlementUrl.toString(), {
          headers: { Authorization: `Bearer ${apiKey}` },
          // Keep middleware fast — short timeout
          signal: AbortSignal.timeout(3000),
        })

        if (res.ok) {
          const data = (await res.json()) as { has_access?: boolean }
          if (!data.has_access) {
            // No active subscription — redirect to billing page
            return NextResponse.redirect(new URL('/billing', req.url))
          }
        }
      } catch (err) {
        // Network error or timeout — fail open to avoid blocking legitimate users
        console.warn('[middleware] Mainlayer entitlement check failed:', err)
      }
    }
  }

  return NextResponse.next()
})

export const config = {
  // Run middleware on dashboard and API routes, skip static assets
  matcher: [
    '/dashboard/:path*',
    '/billing/:path*',
    '/settings/:path*',
    '/api/billing/:path*',
  ],
}
