import type { Metadata } from 'next'
import { Header } from '@/components/layout/Header'
import { PricingCard } from '@/components/billing/PricingCard'
import { ALL_PLANS } from '@/lib/plans'

export const metadata: Metadata = {
  title: 'Pricing',
  description: 'Simple, transparent pricing. Start free and upgrade as you grow.',
}

const faqs = [
  {
    q: 'How does billing work?',
    a: 'Billing is handled by Mainlayer. When you subscribe, you\'ll be redirected to a secure payment page. Your subscription is active immediately after payment.',
  },
  {
    q: 'Can I cancel anytime?',
    a: 'Yes. Cancel your subscription at any time from the billing settings page. You\'ll retain access until the end of your billing period.',
  },
  {
    q: 'Is there a free trial?',
    a: 'The Free plan is free forever with no credit card required. Pro and Enterprise plans can be evaluated with a 14-day trial.',
  },
  {
    q: 'What payment methods are accepted?',
    a: 'Mainlayer accepts all major credit cards, and additional payment methods depending on your region.',
  },
]

export default function PricingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Header */}
        <section className="py-20 px-4 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
            Simple, transparent pricing
          </h1>
          <p className="mt-4 text-xl text-gray-600 max-w-xl mx-auto">
            Start free. Upgrade when you need more. No surprises.
          </p>
        </section>

        {/* Pricing cards */}
        <section className="pb-24 px-4">
          <div className="mx-auto max-w-5xl">
            <div className="grid gap-8 md:grid-cols-3 items-stretch">
              {ALL_PLANS.map((plan) => (
                <PricingCard key={plan.id} plan={plan} />
              ))}
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="border-t bg-gray-50 py-24 px-4">
          <div className="mx-auto max-w-2xl">
            <h2 className="text-center text-2xl font-bold text-gray-900 mb-12">
              Frequently asked questions
            </h2>
            <dl className="space-y-8">
              {faqs.map((faq) => (
                <div key={faq.q}>
                  <dt className="font-semibold text-gray-900 mb-2">{faq.q}</dt>
                  <dd className="text-gray-600">{faq.a}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      </main>
    </div>
  )
}
