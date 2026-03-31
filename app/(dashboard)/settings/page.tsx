import type { Metadata } from 'next'
import { auth, signOut } from '@/lib/auth'
import { checkSubscription } from '@/lib/mainlayer'
import { ROUTES } from '@/lib/constants'
import Link from 'next/link'
import { User, CreditCard, LogOut, ExternalLink } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Settings',
}

export default async function SettingsPage() {
  const session = await auth()
  const user = session!.user!

  const payerWallet = user.email ?? user.id ?? ''
  const isSubscribed = payerWallet ? await checkSubscription(payerWallet).catch(() => false) : false

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="mt-1 text-gray-600">Manage your account and billing preferences.</p>
      </div>

      {/* Profile section */}
      <section className="rounded-xl bg-white shadow-sm ring-1 ring-gray-100 overflow-hidden">
        <div className="border-b px-6 py-4">
          <h2 className="flex items-center gap-2 text-base font-semibold text-gray-900">
            <User className="h-4 w-4" />
            Profile
          </h2>
        </div>
        <div className="px-6 py-5 space-y-4">
          <div className="flex items-center gap-4">
            {user.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.image}
                alt={user.name ?? 'User avatar'}
                className="h-16 w-16 rounded-full object-cover"
              />
            ) : (
              <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-xl font-bold text-blue-600">
                  {user.name?.[0] ?? user.email?.[0] ?? '?'}
                </span>
              </div>
            )}
            <div>
              <p className="font-semibold text-gray-900">{user.name ?? 'No name set'}</p>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 text-sm">
            <div>
              <dt className="text-gray-500 mb-1">Name</dt>
              <dd className="font-medium text-gray-900">{user.name ?? '—'}</dd>
            </div>
            <div>
              <dt className="text-gray-500 mb-1">Email</dt>
              <dd className="font-medium text-gray-900">{user.email}</dd>
            </div>
          </div>
        </div>
      </section>

      {/* Billing section */}
      <section className="rounded-xl bg-white shadow-sm ring-1 ring-gray-100 overflow-hidden">
        <div className="border-b px-6 py-4">
          <h2 className="flex items-center gap-2 text-base font-semibold text-gray-900">
            <CreditCard className="h-4 w-4" />
            Billing
          </h2>
        </div>
        <div className="px-6 py-5 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">
                Current plan:{' '}
                <span className={isSubscribed ? 'text-blue-600' : 'text-gray-500'}>
                  {isSubscribed ? 'Pro' : 'Free'}
                </span>
              </p>
              <p className="mt-0.5 text-sm text-gray-500">
                {isSubscribed
                  ? 'You have access to all Pro features.'
                  : 'Upgrade to unlock all features.'}
              </p>
            </div>
            {isSubscribed ? (
              <span className="inline-flex items-center rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700 ring-1 ring-green-100">
                Active
              </span>
            ) : (
              <Link
                href={ROUTES.pricing}
                className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
              >
                Upgrade
                <ExternalLink className="h-3.5 w-3.5" />
              </Link>
            )}
          </div>

          {isSubscribed && (
            <div className="rounded-lg bg-gray-50 px-4 py-3 text-sm text-gray-600">
              Billing is managed by Mainlayer. To cancel or update your payment method,
              contact support or visit the Mainlayer customer portal.
            </div>
          )}
        </div>
      </section>

      {/* Danger zone */}
      <section className="rounded-xl bg-white shadow-sm ring-1 ring-gray-100 overflow-hidden">
        <div className="border-b px-6 py-4">
          <h2 className="text-base font-semibold text-gray-900">Account</h2>
        </div>
        <div className="px-6 py-5">
          <form
            action={async () => {
              'use server'
              await signOut({ redirectTo: ROUTES.home })
            }}
          >
            <button
              type="submit"
              className="flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </form>
        </div>
      </section>
    </div>
  )
}
