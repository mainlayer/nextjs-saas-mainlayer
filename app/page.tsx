import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { APP_NAME, APP_DESCRIPTION, ROUTES } from '@/lib/constants'
import { ArrowRight, Zap, Shield, BarChart3, Globe, Layers, Headphones } from 'lucide-react'

const features = [
  {
    icon: Zap,
    title: 'Ship in minutes',
    description:
      'Clone, configure two environment variables, and deploy. Everything else — auth, billing, dashboard — is ready.',
  },
  {
    icon: Shield,
    title: 'Secure by default',
    description:
      'Route-level auth middleware protects every dashboard page. Mainlayer entitlement checks gate paid features.',
  },
  {
    icon: BarChart3,
    title: 'Built-in analytics',
    description:
      'Track API calls, active users, and revenue trends from day one with the included dashboard components.',
  },
  {
    icon: Globe,
    title: 'Global payments',
    description:
      'Mainlayer handles payments infrastructure so you can accept revenue without building billing from scratch.',
  },
  {
    icon: Layers,
    title: 'Modular architecture',
    description:
      'Every layer — auth, billing, UI — is cleanly separated. Swap components or providers without touching the rest.',
  },
  {
    icon: Headphones,
    title: 'Flexible plans',
    description:
      'Free, Pro, and Enterprise tiers are pre-wired. Add or remove plans by editing a single config file.',
  },
]

const steps = [
  { step: '1', title: 'Clone the repo', description: 'One command gets you a full Next.js 15 project.' },
  {
    step: '2',
    title: 'Set env variables',
    description: 'Add your MAINLAYER_API_KEY and GitHub OAuth credentials to .env.local.',
  },
  {
    step: '3',
    title: 'Deploy',
    description: 'Push to Vercel or run npm run dev. Your SaaS is live with billing enabled.',
  },
]

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden bg-white py-24 px-4 text-center">
          {/* Subtle gradient blob */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-blue-50 to-transparent"
          />

          <div className="relative mx-auto max-w-3xl">
            <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 ring-1 ring-blue-100 mb-6">
              Powered by Mainlayer &mdash; billing infrastructure for SaaS
            </span>

            <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 sm:text-6xl">
              Launch your SaaS{' '}
              <span className="text-blue-600">this afternoon</span>
            </h1>

            <p className="mt-6 text-xl text-gray-600">
              {APP_DESCRIPTION}. Batteries-included Next.js 15 starter with auth,
              subscription billing, and a full dashboard — zero boilerplate.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href={ROUTES.register}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-blue-200 hover:bg-blue-700 transition-colors"
              >
                Get started free
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href={ROUTES.pricing}
                className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-7 py-3.5 text-base font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                See pricing
              </Link>
            </div>

            <p className="mt-4 text-sm text-gray-500">
              Free plan available &mdash; no credit card required
            </p>
          </div>
        </section>

        {/* Features */}
        <section className="py-24 px-4 bg-gray-50">
          <div className="mx-auto max-w-5xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900">Everything you need to ship</h2>
              <p className="mt-3 text-gray-600">
                Stop reinventing auth and billing. Start building the features your customers care about.
              </p>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => {
                const Icon = feature.icon
                return (
                  <div
                    key={feature.title}
                    className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100"
                  >
                    <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                      <Icon className="h-5 w-5 text-blue-600" />
                    </div>
                    <h3 className="mb-2 text-base font-semibold text-gray-900">{feature.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-24 px-4 bg-white">
          <div className="mx-auto max-w-4xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900">Up and running in three steps</h2>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {steps.map((item) => (
                <div key={item.step} className="text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white font-bold text-lg">
                    {item.step}
                  </div>
                  <h3 className="mb-2 font-semibold text-gray-900">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 px-4 bg-blue-600">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-white">Ready to launch?</h2>
            <p className="mt-3 text-blue-100">
              {APP_NAME} is open-source and free to clone. Start on the Free plan and upgrade
              when you&apos;re ready.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href={ROUTES.register}
                className="inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 text-base font-semibold text-blue-600 hover:bg-blue-50 transition-colors"
              >
                Create free account
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href={ROUTES.pricing}
                className="inline-flex items-center rounded-xl border border-blue-400 px-7 py-3.5 text-base font-semibold text-white hover:bg-blue-700 transition-colors"
              >
                View plans
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white py-8 px-4">
        <div className="mx-auto max-w-5xl flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <span>
            &copy; {new Date().getFullYear()} {APP_NAME}. Built with{' '}
            <a
              href="https://mainlayer.fr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Mainlayer
            </a>
            .
          </span>
          <nav className="flex gap-6">
            <Link href={ROUTES.pricing} className="hover:text-gray-900 transition-colors">
              Pricing
            </Link>
            <Link href={ROUTES.login} className="hover:text-gray-900 transition-colors">
              Sign in
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}
