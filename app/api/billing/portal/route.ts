/**
 * GET /api/billing/portal
 *
 * Returns the full entitlement record for the authenticated user.
 * Use this to check the current plan, expiry, and access status.
 *
 * Response:
 *   { has_access: boolean, plan?: string, expires_at?: string, wallet: string }
 */
import { auth } from '@/lib/auth'
import { getMainlayerClient } from '@/lib/mainlayer'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const url = new URL(req.url)
  const payerWallet =
    url.searchParams.get('wallet') ?? session.user.email ?? session.user.id

  if (!payerWallet) {
    return NextResponse.json({ error: 'No wallet address available' }, { status: 400 })
  }

  const resourceId = process.env.MAINLAYER_RESOURCE_ID
  if (!resourceId) {
    return NextResponse.json(
      { error: 'MAINLAYER_RESOURCE_ID is not configured' },
      { status: 500 },
    )
  }

  try {
    const entitlement = await getMainlayerClient().entitlements.check({
      resource_id: resourceId,
      payer_wallet: payerWallet,
    })

    return NextResponse.json({
      ...entitlement,
      wallet: payerWallet,
    })
  } catch (error) {
    console.error('[billing/portal] Mainlayer error:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve entitlement. Please try again.' },
      { status: 500 },
    )
  }
}
