import Link from 'next/link'
import { CheckCircle2, ArrowRight } from 'lucide-react'
import { PLANS } from '@/lib/constants'
import { ROUTES } from '@/lib/constants'

interface BillingStatusProps {
  isSubscribed: boolean
  payerWallet: string
  planName?: string
}

/**
 * A compact billing status card used on the main dashboard.
 * Shows the active plan and an upgrade CTA if on the free tier.
 */
export function BillingStatus({ isSubscribed, planName = 'Free' }: BillingStatusProps) {
  const plan = isSubscribed ? PLANS.pro : PLANS.free

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
      <h2 className="text-base font-semibold text-gray-900 mb-4">Your plan</h2>

      <div className="flex items-center gap-3 mb-4">
        <div
          className={`inline-flex h-10 w-10 items-center justify-center rounded-full ${
            isSubscribed ? 'bg-blue-50' : 'bg-gray-100'
          }`}
        >
          <CheckCircle2
            className={`h-5 w-5 ${isSubscribed ? 'text-blue-600' : 'text-gray-400'}`}
          />
        </div>
        <div>
          <p className="font-semibold text-gray-900">{planName}</p>
          <p className="text-sm text-gray-500">
            {isSubscribed ? 'Active subscription' : 'Free tier'}
          </p>
        </div>

        {isSubscribed && (
          <span className="ml-auto inline-flex items-center rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700 ring-1 ring-green-100">
            Active
          </span>
        )}
      </div>

      {/* Feature summary */}
      <ul className="mb-5 space-y-1.5">
        {plan.features.slice(0, 3).map((feature) => (
          <li key={feature} className="flex items-center gap-2 text-sm text-gray-600">
            <CheckCircle2 className="h-3.5 w-3.5 text-gray-400 shrink-0" />
            {feature}
          </li>
        ))}
        {plan.features.length > 3 && (
          <li className="text-xs text-gray-400">+ {plan.features.length - 3} more features</li>
        )}
      </ul>

      {!isSubscribed ? (
        <Link
          href={ROUTES.billing}
          className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
        >
          Upgrade to Pro
          <ArrowRight className="h-4 w-4" />
        </Link>
      ) : (
        <Link
          href="/billing"
          className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Manage billing
          <ArrowRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  )
}
