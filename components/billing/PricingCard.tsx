'use client'

import { useState } from 'react'
import { CheckCircle2, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Plan } from '@/lib/plans'

interface PricingCardProps {
  plan: Plan
  /** The user's current active plan id, if known */
  currentPlanId?: string
  /** The payer wallet (email or user id) used to initiate the subscription */
  payerWallet?: string
}

/**
 * A single pricing tier card.
 * Calls POST /api/billing/subscribe and redirects to the Mainlayer payment URL.
 */
export function PricingCard({ plan, currentPlanId, payerWallet }: PricingCardProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isCurrentPlan = currentPlanId === plan.id
  const isFree = plan.id === 'free'

  async function handleSubscribe() {
    if (isFree || isCurrentPlan || !payerWallet) return

    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/billing/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletAddress: payerWallet,
          planId: plan.mainlayerPlanId,
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
        throw new Error('No payment URL returned')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className={cn(
        'relative flex flex-col rounded-2xl p-8 shadow-sm ring-1 transition-shadow hover:shadow-md',
        plan.highlighted
          ? 'bg-blue-600 text-white ring-blue-600'
          : 'bg-white text-gray-900 ring-gray-200',
      )}
    >
      {/* Popular badge */}
      {plan.badge && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="inline-flex items-center rounded-full bg-amber-400 px-3 py-1 text-xs font-semibold text-amber-900">
            {plan.badge}
          </span>
        </div>
      )}

      {/* Plan name & description */}
      <div className="mb-6">
        <h3 className={cn('text-lg font-bold', plan.highlighted ? 'text-white' : 'text-gray-900')}>
          {plan.name}
        </h3>
        <p
          className={cn(
            'mt-1 text-sm',
            plan.highlighted ? 'text-blue-100' : 'text-gray-500',
          )}
        >
          {plan.description}
        </p>
      </div>

      {/* Price */}
      <div className="mb-8">
        <div className="flex items-end gap-1">
          <span
            className={cn(
              'text-4xl font-extrabold tracking-tight',
              plan.highlighted ? 'text-white' : 'text-gray-900',
            )}
          >
            {plan.priceLabel}
          </span>
          {plan.price > 0 && (
            <span
              className={cn(
                'mb-1 text-sm',
                plan.highlighted ? 'text-blue-200' : 'text-gray-500',
              )}
            >
              /{plan.billingPeriod}
            </span>
          )}
        </div>
        {plan.price === 0 && (
          <span className={cn('text-sm', plan.highlighted ? 'text-blue-200' : 'text-gray-500')}>
            {plan.billingPeriod}
          </span>
        )}
      </div>

      {/* Features */}
      <ul className="mb-8 flex-1 space-y-3">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2.5 text-sm">
            <CheckCircle2
              className={cn(
                'mt-0.5 h-4 w-4 shrink-0',
                plan.highlighted ? 'text-blue-200' : 'text-green-500',
              )}
            />
            <span className={plan.highlighted ? 'text-blue-50' : 'text-gray-700'}>{feature}</span>
          </li>
        ))}
      </ul>

      {/* Error */}
      {error && (
        <p className={cn('mb-3 text-xs', plan.highlighted ? 'text-red-200' : 'text-red-600')}>
          {error}
        </p>
      )}

      {/* CTA button */}
      {isCurrentPlan ? (
        <div
          className={cn(
            'flex items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold',
            plan.highlighted
              ? 'bg-blue-500 text-blue-100'
              : 'bg-gray-100 text-gray-500',
          )}
        >
          Current plan
        </div>
      ) : isFree ? (
        <a
          href="/register"
          className={cn(
            'flex items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold transition-colors',
            plan.highlighted
              ? 'bg-white text-blue-600 hover:bg-blue-50'
              : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50',
          )}
        >
          {plan.cta}
        </a>
      ) : (
        <button
          type="button"
          onClick={handleSubscribe}
          disabled={loading}
          className={cn(
            'flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-colors disabled:opacity-70',
            plan.highlighted
              ? 'bg-white text-blue-600 hover:bg-blue-50'
              : 'bg-blue-600 text-white hover:bg-blue-700',
          )}
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {loading ? 'Redirecting…' : plan.cta}
        </button>
      )}
    </div>
  )
}
