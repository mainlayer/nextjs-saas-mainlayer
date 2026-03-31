/**
 * POST /api/webhooks/mainlayer
 *
 * Handles webhook events from Mainlayer.
 *
 * Supported events:
 *   - payment.completed    — A payment was successfully processed
 *   - subscription.renewed — A subscription auto-renewed
 *   - subscription.cancelled — A subscription was cancelled
 *
 * Verify requests using the MAINLAYER_WEBHOOK_SECRET environment variable.
 * Set the webhook endpoint in your Mainlayer dashboard to:
 *   https://your-app.vercel.app/api/webhooks/mainlayer
 */
import { NextResponse } from 'next/server'
import { headers } from 'next/headers'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface WebhookEvent {
  event: 'payment.completed' | 'subscription.renewed' | 'subscription.cancelled' | string
  data: {
    payment_id?: string
    resource_id?: string
    payer_wallet?: string
    plan?: string
    amount?: number
    currency?: string
    expires_at?: string
    [key: string]: unknown
  }
  timestamp?: string
}

// ---------------------------------------------------------------------------
// Signature verification
// ---------------------------------------------------------------------------

async function verifySignature(
  payload: string,
  signature: string | null,
  secret: string,
): Promise<boolean> {
  if (!signature) return false

  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['verify'],
  )

  // Expected format: "sha256=<hex>"
  const [prefix, hexSig] = signature.split('=')
  if (prefix !== 'sha256' || !hexSig) return false

  const sigBytes = Buffer.from(hexSig, 'hex')

  return crypto.subtle.verify('HMAC', key, sigBytes, encoder.encode(payload))
}

// ---------------------------------------------------------------------------
// Event handlers
// ---------------------------------------------------------------------------

async function handlePaymentCompleted(data: WebhookEvent['data']) {
  // Grant access, update your database, send a welcome email, etc.
  console.log('[webhook] payment.completed', {
    payerWallet: data.payer_wallet,
    plan: data.plan,
    paymentId: data.payment_id,
  })

  // TODO: Update your database to reflect the new subscription
  // Example:
  //   await db.user.update({
  //     where: { email: data.payer_wallet },
  //     data: { plan: data.plan, subscriptionActive: true },
  //   })
}

async function handleSubscriptionRenewed(data: WebhookEvent['data']) {
  console.log('[webhook] subscription.renewed', {
    payerWallet: data.payer_wallet,
    plan: data.plan,
    expiresAt: data.expires_at,
  })

  // TODO: Update subscription expiry in your database
}

async function handleSubscriptionCancelled(data: WebhookEvent['data']) {
  console.log('[webhook] subscription.cancelled', {
    payerWallet: data.payer_wallet,
    plan: data.plan,
  })

  // TODO: Revoke access, send cancellation email, schedule cleanup, etc.
  // Example:
  //   await db.user.update({
  //     where: { email: data.payer_wallet },
  //     data: { subscriptionActive: false },
  //   })
}

// ---------------------------------------------------------------------------
// Route handler
// ---------------------------------------------------------------------------

export async function POST(req: Request) {
  const body = await req.text()
  const headersList = await headers()
  const signature = headersList.get('x-mainlayer-signature')
  const secret = process.env.MAINLAYER_WEBHOOK_SECRET

  // Verify signature if a secret is configured
  if (secret) {
    const isValid = await verifySignature(body, signature, secret)
    if (!isValid) {
      console.warn('[webhook] Invalid signature received')
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }
  } else {
    console.warn('[webhook] MAINLAYER_WEBHOOK_SECRET not set — skipping signature verification')
  }

  let event: WebhookEvent
  try {
    event = JSON.parse(body) as WebhookEvent
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 })
  }

  // Dispatch to the appropriate handler
  try {
    switch (event.event) {
      case 'payment.completed':
        await handlePaymentCompleted(event.data)
        break
      case 'subscription.renewed':
        await handleSubscriptionRenewed(event.data)
        break
      case 'subscription.cancelled':
        await handleSubscriptionCancelled(event.data)
        break
      default:
        // Log and ignore unknown events
        console.log(`[webhook] Unhandled event type: ${event.event}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error(`[webhook] Error handling ${event.event}:`, error)
    // Return 500 so Mainlayer retries the delivery
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 },
    )
  }
}
