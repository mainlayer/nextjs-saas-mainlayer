import type { Metadata } from 'next'
import { auth } from '@/lib/auth'
import { checkSubscription } from '@/lib/mainlayer'
import { StatsCard } from '@/components/dashboard/StatsCard'
import { BillingStatus } from '@/components/billing/BillingStatus'
import { ROUTES } from '@/lib/constants'
import Link from 'next/link'
import { ArrowRight, FolderOpen, Users, Activity } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Dashboard',
}

export default async function DashboardPage() {
  const session = await auth()
  const user = session!.user!

  // Check subscription status — use email as the payer wallet identifier
  // Replace with your preferred identifier (wallet address, user ID, etc.)
  const payerWallet = user.email ?? user.id ?? ''
  const isSubscribed = payerWallet ? await checkSubscription(payerWallet).catch(() => false) : false

  const firstName = user.name?.split(' ')[0] ?? 'there'

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {firstName}
        </h1>
        <p className="mt-1 text-gray-600">Here&apos;s what&apos;s happening with your account.</p>
      </div>

      {/* Subscription banner */}
      {!isSubscribed && (
        <div className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold">Upgrade to Pro</h2>
              <p className="mt-1 text-blue-100 text-sm">
                Unlock unlimited projects, advanced analytics, and priority support.
              </p>
            </div>
            <Link
              href={ROUTES.pricing}
              className="shrink-0 inline-flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-blue-600 hover:bg-blue-50 transition-colors"
            >
              View plans
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatsCard
          title="Projects"
          value="3"
          subtitle="of 3 on Free plan"
          icon={FolderOpen}
          trend={null}
        />
        <StatsCard
          title="Team members"
          value="1"
          subtitle="Just you"
          icon={Users}
          trend={null}
        />
        <StatsCard
          title="API calls"
          value="1,204"
          subtitle="This month"
          icon={Activity}
          trend={{ value: 12, direction: 'up' }}
        />
      </div>

      {/* Billing status */}
      <div className="grid gap-6 md:grid-cols-2">
        <BillingStatus
          isSubscribed={isSubscribed}
          payerWallet={payerWallet}
          planName={isSubscribed ? 'Pro' : 'Free'}
        />

        {/* Quick actions */}
        <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Quick actions</h2>
          <ul className="space-y-3">
            {[
              { label: 'Create a new project', href: '#' },
              { label: 'Invite a team member', href: '#' },
              { label: 'View API documentation', href: '#' },
              { label: 'Manage billing', href: ROUTES.settings },
            ].map((action) => (
              <li key={action.label}>
                <Link
                  href={action.href}
                  className="flex items-center justify-between text-sm text-gray-700 hover:text-blue-600 transition-colors group"
                >
                  {action.label}
                  <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
