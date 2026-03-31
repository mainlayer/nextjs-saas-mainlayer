/**
 * SubscriptionStatus
 *
 * Full-width card displayed at the top of the /billing page.
 * Shows the current plan, status badge, renewal date, and a cancel/manage note.
 */
import { CheckCircle2, XCircle, Calendar } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getPlanById } from '@/lib/plans'

interface SubscriptionStatusProps {
  isSubscribed: boolean
  planId: string
  expiresAt?: string
  payerWallet: string
}

export function SubscriptionStatus({
  isSubscribed,
  planId,
  expiresAt,
}: SubscriptionStatusProps) {
  const plan = getPlanById(planId)

  const formattedExpiry = expiresAt
    ? new Date(expiresAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null

  return (
    <div
      className={cn(
        'rounded-xl p-6 ring-1',
        isSubscribed
          ? 'bg-blue-50 ring-blue-100'
          : 'bg-gray-50 ring-gray-200',
      )}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left: plan info */}
        <div className="flex items-center gap-4">
          <div
            className={cn(
              'flex h-12 w-12 shrink-0 items-center justify-center rounded-full',
              isSubscribed ? 'bg-blue-100' : 'bg-gray-200',
            )}
          >
            {isSubscribed ? (
              <CheckCircle2 className="h-6 w-6 text-blue-600" />
            ) : (
              <XCircle className="h-6 w-6 text-gray-400" />
            )}
          </div>

          <div>
            <p className="font-semibold text-gray-900">
              {plan?.name ?? 'Unknown'} plan
            </p>
            <p className="text-sm text-gray-500">
              {isSubscribed
                ? 'Your subscription is active.'
                : 'You are on the free tier. Upgrade to unlock more features.'}
            </p>
            {formattedExpiry && (
              <p className="mt-1 flex items-center gap-1.5 text-xs text-gray-500">
                <Calendar className="h-3.5 w-3.5" />
                Renews {formattedExpiry}
              </p>
            )}
          </div>
        </div>

        {/* Right: status badge */}
        <span
          className={cn(
            'self-start sm:self-auto inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1',
            isSubscribed
              ? 'bg-green-50 text-green-700 ring-green-200'
              : 'bg-gray-100 text-gray-600 ring-gray-200',
          )}
        >
          {isSubscribed ? 'Active' : 'Free'}
        </span>
      </div>
    </div>
  )
}
