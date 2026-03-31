/**
 * PricingTable
 *
 * Renders all three pricing tiers side-by-side.
 * This is the primary billing UI used on both the marketing pricing page
 * and the in-app /billing page.
 *
 * Usage:
 *   <PricingTable />                                         // marketing (no session)
 *   <PricingTable currentPlanId="free" payerWallet={email} /> // dashboard
 */
import { ALL_PLANS } from '@/lib/plans'
import { PricingCard } from '@/components/billing/PricingCard'

interface PricingTableProps {
  /** The user's current plan id — used to highlight the active plan */
  currentPlanId?: string
  /** The user's identifier passed to the Mainlayer checkout flow */
  payerWallet?: string
}

export function PricingTable({ currentPlanId, payerWallet }: PricingTableProps) {
  return (
    <div className="grid gap-8 md:grid-cols-3 items-stretch">
      {ALL_PLANS.map((plan) => (
        <PricingCard
          key={plan.id}
          plan={plan}
          currentPlanId={currentPlanId}
          payerWallet={payerWallet}
        />
      ))}
    </div>
  )
}
