import type { Metadata } from 'next'
import { auth } from '@/lib/auth'
import { getMainlayerClient } from '@/lib/mainlayer'
import { PLANS } from '@/lib/constants'
import { PricingTable } from '@/components/pricing-table'
import { SubscriptionStatus } from '@/components/subscription-status'
import { CreditCard } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Billing',
  description: 'Manage your subscription and billing.',
}

export default async function BillingPage() {
  const session = await auth()
  const user = session!.user!
  const payerWallet = user.email ?? user.id ?? ''

  // Fetch entitlement from Mainlayer
  let hasAccess = false
  let currentPlan: string | undefined
  let expiresAt: string | undefined

  if (payerWallet) {
    try {
      const resourceId = process.env.MAINLAYER_RESOURCE_ID
      if (resourceId) {
        const result = await getMainlayerClient().entitlements.check({
          resource_id: resourceId,
          payer_wallet: payerWallet,
        })
        hasAccess = result.has_access
        currentPlan = result.plan
        expiresAt = result.expires_at
      }
    } catch {
      // Non-fatal: show free plan UI if the check fails
    }
  }

  // Map Mainlayer plan id to display plan
  const activePlanId = hasAccess
    ? (currentPlan === PLANS.enterprise.mainlayerPlanId ? 'enterprise' : 'pro')
    : 'free'

  return (
    <div className="space-y-10">
      {/* Page header */}
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold text-gray-900">
          <CreditCard className="h-6 w-6" />
          Billing
        </h1>
        <p className="mt-1 text-gray-600">
          Manage your subscription and upgrade or downgrade at any time.
        </p>
      </div>

      {/* Current subscription status */}
      <SubscriptionStatus
        isSubscribed={hasAccess}
        planId={activePlanId}
        expiresAt={expiresAt}
        payerWallet={payerWallet}
      />

      {/* Pricing table */}
      <div>
        <h2 className="mb-6 text-lg font-semibold text-gray-900">
          {hasAccess ? 'Change your plan' : 'Upgrade your plan'}
        </h2>
        <PricingTable currentPlanId={activePlanId} payerWallet={payerWallet} />
      </div>

      {/* Billing FAQ */}
      <div className="rounded-xl bg-gray-50 p-6 text-sm text-gray-600 space-y-3">
        <p className="font-medium text-gray-900">Billing questions?</p>
        <p>
          Billing is managed securely by Mainlayer. Your payment details are never stored
          on our servers.
        </p>
        <p>
          To update your payment method or cancel your subscription, use the upgrade/downgrade
          options above. Changes take effect immediately.
        </p>
      </div>
    </div>
  )
}
