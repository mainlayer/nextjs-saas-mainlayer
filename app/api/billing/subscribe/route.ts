/**
 * POST /api/billing/subscribe
 *
 * Creates a Mainlayer payment session for the authenticated user.
 * Returns a payment_url to redirect the user to.
 *
 * Request body:
 *   { walletAddress: string, planId?: string }
 *
 * Response:
 *   { payment_url: string, payment_id: string }
 */
import { auth } from '@/lib/auth'
import { createSubscription } from '@/lib/mainlayer'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  // Require authentication
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: { walletAddress?: string; planId?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  // Use the provided wallet address, or fall back to user email
  const payerWallet = body.walletAddress ?? session.user.email
  if (!payerWallet) {
    return NextResponse.json(
      { error: 'No payer wallet or email address available' },
      { status: 400 },
    )
  }

  try {
    const payment = await createSubscription(payerWallet, body.planId)
    return NextResponse.json(payment)
  } catch (error) {
    console.error('[billing/subscribe] Mainlayer error:', error)
    return NextResponse.json(
      { error: 'Failed to create payment session. Please try again.' },
      { status: 500 },
    )
  }
}
