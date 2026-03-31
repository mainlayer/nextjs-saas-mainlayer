'use client'

/**
 * UpgradeModal
 *
 * A modal dialog that presents the pricing table and initiates the Mainlayer
 * checkout flow. Use this to gate features behind a paid plan without
 * navigating away from the current page.
 *
 * Usage:
 *   <UpgradeModal payerWallet={email} trigger={<Button>Upgrade</Button>} />
 */
import { useState } from 'react'
import { Loader2, Zap } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog'
import { ALL_PLANS } from '@/lib/plans'
import type { Plan } from '@/lib/plans'
import { cn } from '@/lib/utils'
import { CheckCircle2 } from 'lucide-react'

interface UpgradeModalProps {
  /** The user's wallet / email address passed to Mainlayer checkout */
  payerWallet: string
  /** The element that opens the modal */
  trigger: React.ReactNode
  /** Optional: pre-select a plan when the modal opens */
  defaultPlanId?: string
}

function PlanOption({
  plan,
  selected,
  onSelect,
}: {
  plan: Plan
  selected: boolean
  onSelect: () => void
}) {
  if (plan.id === 'free') return null

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        'w-full rounded-xl border-2 p-4 text-left transition-colors',
        selected ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-gray-300',
      )}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="font-semibold text-gray-900">{plan.name}</span>
        <div className="flex items-center gap-1">
          <span className="text-xl font-bold text-gray-900">{plan.priceLabel}</span>
          <span className="text-xs text-gray-500">/{plan.billingPeriod}</span>
        </div>
      </div>
      <ul className="space-y-1">
        {plan.features.slice(0, 4).map((f) => (
          <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
            <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-green-500" />
            {f}
          </li>
        ))}
      </ul>
    </button>
  )
}

export function UpgradeModal({ payerWallet, trigger, defaultPlanId = 'pro' }: UpgradeModalProps) {
  const paidPlans = ALL_PLANS.filter((p) => p.id !== 'free')
  const [selectedPlanId, setSelectedPlanId] = useState(defaultPlanId)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const selectedPlan = paidPlans.find((p) => p.id === selectedPlanId) ?? paidPlans[0]

  async function handleUpgrade() {
    if (!selectedPlan?.mainlayerPlanId || !payerWallet) return

    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/billing/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletAddress: payerWallet,
          planId: selectedPlan.mainlayerPlanId,
        }),
      })

      if (!res.ok) {
        const data = (await res.json()) as { error?: string }
        throw new Error(data.error ?? 'Failed to start checkout')
      }

      const data = (await res.json()) as { payment_url?: string }
      if (data.payment_url) {
        window.location.href = data.payment_url
      } else {
        throw new Error('No payment URL returned from Mainlayer')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-blue-600" />
            Upgrade your plan
          </DialogTitle>
          <DialogDescription>
            Choose a plan and you&apos;ll be redirected to a secure checkout.
          </DialogDescription>
        </DialogHeader>

        {/* Plan selection */}
        <div className="mt-2 space-y-3">
          {paidPlans.map((plan) => (
            <PlanOption
              key={plan.id}
              plan={plan}
              selected={selectedPlanId === plan.id}
              onSelect={() => setSelectedPlanId(plan.id)}
            />
          ))}
        </div>

        {/* Error */}
        {error && <p className="text-sm text-red-600">{error}</p>}

        {/* Footer */}
        <div className="mt-4 flex flex-col gap-3">
          <button
            type="button"
            onClick={handleUpgrade}
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition-colors disabled:opacity-70"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading
              ? 'Redirecting to checkout…'
              : `Upgrade to ${selectedPlan?.name} — ${selectedPlan?.priceLabel}/mo`}
          </button>
          <p className="text-center text-xs text-gray-500">
            Secure payment via Mainlayer. Cancel anytime.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
