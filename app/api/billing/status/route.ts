/**
 * GET /api/billing/status
 *
 * Returns the subscription status for the authenticated user.
 * Optionally accepts ?wallet=<address> to check a specific wallet.
 *
 * Response:
 *   { has_access: boolean, plan?: string }
 */
import { auth } from '@/lib/auth'
import { checkSubscription } from '@/lib/mainlayer'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  // Require authentication
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Determine which wallet/address to check
  const url = new URL(req.url)
  const payerWallet =
    url.searchParams.get('wallet') ?? session.user.email ?? session.user.id

  if (!payerWallet) {
    return NextResponse.json({ error: 'No wallet address available' }, { status: 400 })
  }

  try {
    const hasAccess = await checkSubscription(payerWallet)
    return NextResponse.json({
      has_access: hasAccess,
      wallet: payerWallet,
    })
  } catch (error) {
    console.error('[billing/status] Mainlayer error:', error)
    return NextResponse.json(
      { error: 'Failed to check subscription status.' },
      { status: 500 },
    )
  }
}
