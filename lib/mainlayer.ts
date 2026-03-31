/**
 * Mainlayer client wrapper
 *
 * Mainlayer is the billing infrastructure for this SaaS application.
 * It handles subscriptions, payments, and access entitlements.
 *
 * Docs: https://docs.mainlayer.xyz
 */

// =============================================================================
// Types
// =============================================================================

export interface EntitlementResult {
  has_access: boolean
  plan?: string
  expires_at?: string
}

export interface PaymentResult {
  payment_url: string
  payment_id: string
  resource_id: string
  payer_wallet: string
}

export interface MainlayerClientOptions {
  apiKey: string
  baseUrl?: string
}

// =============================================================================
// Low-level HTTP client
// This wraps the Mainlayer REST API directly so the template works
// even before the @mainlayer/sdk package is available on npm.
// Swap this out for `import Mainlayer from '@mainlayer/sdk'` once released.
// =============================================================================

class MainlayerClient {
  private readonly apiKey: string
  private readonly baseUrl: string

  constructor(options: MainlayerClientOptions) {
    this.apiKey = options.apiKey
    this.baseUrl = options.baseUrl ?? 'https://api.mainlayer.xyz'
  }

  private async request<T>(
    method: string,
    path: string,
    body?: Record<string, unknown>,
  ): Promise<T> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: body ? JSON.stringify(body) : undefined,
      // Opt out of Next.js caching for billing calls — always fresh
      cache: 'no-store',
    })

    if (!res.ok) {
      const error = await res.text()
      throw new Error(`Mainlayer API error (${res.status}): ${error}`)
    }

    return res.json() as Promise<T>
  }

  // ---------------------------------------------------------------------------
  // Entitlements
  // ---------------------------------------------------------------------------

  entitlements = {
    /**
     * Check whether a payer wallet/address has access to a resource.
     * Use this to gate features behind an active subscription.
     */
    check: (params: { resource_id: string; payer_wallet: string }) =>
      this.request<EntitlementResult>(
        'GET',
        `/entitlements/check?resource_id=${encodeURIComponent(params.resource_id)}&payer_wallet=${encodeURIComponent(params.payer_wallet)}`,
      ),
  }

  // ---------------------------------------------------------------------------
  // Payments
  // ---------------------------------------------------------------------------

  payments = {
    /**
     * Initiate a payment / subscription for a resource.
     * Returns a payment_url that you redirect the user to.
     */
    create: (params: { resource_id: string; payer_wallet: string; plan_id?: string }) =>
      this.request<PaymentResult>('POST', '/pay', params),
  }

  // ---------------------------------------------------------------------------
  // Analytics
  // ---------------------------------------------------------------------------

  analytics = {
    /**
     * Fetch revenue analytics for your resource.
     */
    get: () => this.request<Record<string, unknown>>('GET', '/analytics'),
  }
}

// =============================================================================
// Singleton client
// =============================================================================

function createMainlayerClient() {
  const apiKey = process.env.MAINLAYER_API_KEY
  if (!apiKey) {
    throw new Error(
      'MAINLAYER_API_KEY environment variable is not set. ' +
        'Add it to your .env.local file.',
    )
  }
  return new MainlayerClient({ apiKey })
}

// Lazy singleton — only instantiated when first called (server-side only)
let _client: MainlayerClient | null = null

export function getMainlayerClient(): MainlayerClient {
  if (!_client) {
    _client = createMainlayerClient()
  }
  return _client
}

// =============================================================================
// Convenience helpers used across the app
// =============================================================================

/**
 * Check whether a user (identified by their wallet/email address) has an
 * active subscription to this SaaS product.
 *
 * @param payerWallet - The user's identifier (wallet address or email)
 * @returns true if the user has access, false otherwise
 */
export async function checkSubscription(payerWallet: string): Promise<boolean> {
  const resourceId = process.env.MAINLAYER_RESOURCE_ID
  if (!resourceId) {
    throw new Error('MAINLAYER_RESOURCE_ID environment variable is not set.')
  }

  const result = await getMainlayerClient().entitlements.check({
    resource_id: resourceId,
    payer_wallet: payerWallet,
  })

  return result.has_access
}

/**
 * Create a subscription payment session for a user.
 * Returns a payment_url that you redirect the user to.
 *
 * @param payerWallet - The user's identifier
 * @param planId - Optional specific plan ID
 */
export async function createSubscription(
  payerWallet: string,
  planId?: string,
): Promise<PaymentResult> {
  const resourceId = process.env.MAINLAYER_RESOURCE_ID
  if (!resourceId) {
    throw new Error('MAINLAYER_RESOURCE_ID environment variable is not set.')
  }

  return getMainlayerClient().payments.create({
    resource_id: resourceId,
    payer_wallet: payerWallet,
    ...(planId ? { plan_id: planId } : {}),
  })
}
