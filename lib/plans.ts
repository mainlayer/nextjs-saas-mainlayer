/**
 * Mainlayer plan definitions
 *
 * Each paid plan maps to a Mainlayer resource_id.
 * Create your resources in the Mainlayer dashboard and paste the IDs here
 * (or set them as environment variables).
 *
 * Docs: https://docs.mainlayer.xyz
 */

export interface Plan {
  id: string
  name: string
  description: string
  price: number
  priceLabel: string
  billingPeriod: string
  /** Mainlayer resource_id for this plan. Undefined for the free tier. */
  mainlayerResourceId?: string
  /** Mainlayer plan_id passed to POST /pay. Undefined for the free tier. */
  mainlayerPlanId?: string
  features: readonly string[]
  cta: string
  highlighted: boolean
  badge?: string
}

export const PLAN_FREE: Plan = {
  id: 'free',
  name: 'Free',
  description: 'Everything you need to get started — no credit card required.',
  price: 0,
  priceLabel: '$0',
  billingPeriod: 'forever',
  features: [
    'Up to 3 projects',
    '5 GB storage',
    'Community support',
    'Basic analytics',
  ],
  cta: 'Get started free',
  highlighted: false,
}

export const PLAN_PRO: Plan = {
  id: 'pro',
  name: 'Pro',
  description: 'For professionals and growing teams who need more power.',
  price: 29,
  priceLabel: '$29',
  billingPeriod: 'per month',
  mainlayerResourceId: process.env.MAINLAYER_PRO_RESOURCE_ID ?? process.env.MAINLAYER_RESOURCE_ID,
  mainlayerPlanId: process.env.MAINLAYER_PRO_PLAN_ID ?? 'plan_pro',
  features: [
    'Unlimited projects',
    '100 GB storage',
    'Priority email support',
    'Advanced analytics',
    'Team collaboration',
    'Custom integrations',
    'API access',
  ],
  cta: 'Upgrade to Pro',
  highlighted: true,
  badge: 'Most popular',
}

export const PLAN_ENTERPRISE: Plan = {
  id: 'enterprise',
  name: 'Enterprise',
  description: 'For large organisations with custom requirements and compliance needs.',
  price: 99,
  priceLabel: '$99',
  billingPeriod: 'per month',
  mainlayerResourceId: process.env.MAINLAYER_ENTERPRISE_RESOURCE_ID ?? process.env.MAINLAYER_RESOURCE_ID,
  mainlayerPlanId: process.env.MAINLAYER_ENTERPRISE_PLAN_ID ?? 'plan_enterprise',
  features: [
    'Everything in Pro',
    'Unlimited storage',
    'Dedicated Slack support',
    '99.9% uptime SLA',
    'Custom contracts & invoicing',
    'SSO / SAML',
    'On-premise deployment option',
  ],
  cta: 'Upgrade to Enterprise',
  highlighted: false,
}

export const ALL_PLANS: readonly Plan[] = [PLAN_FREE, PLAN_PRO, PLAN_ENTERPRISE] as const

export type PlanId = 'free' | 'pro' | 'enterprise'

export function getPlanById(id: string): Plan | undefined {
  return ALL_PLANS.find((p) => p.id === id)
}
