// =============================================================================
// Mainlayer Plan Configuration
// Update these values after creating your plans in the Mainlayer dashboard
// =============================================================================

export const PLANS = {
  free: {
    id: 'free',
    name: 'Free',
    description: 'Perfect for getting started',
    price: 0,
    priceLabel: '$0',
    billingPeriod: 'forever',
    features: [
      'Up to 3 projects',
      '5 GB storage',
      'Community support',
      'Basic analytics',
    ],
    cta: 'Get started',
    highlighted: false,
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    description: 'For professionals and growing teams',
    price: 29,
    priceLabel: '$29',
    billingPeriod: 'per month',
    // Set this to your actual Mainlayer plan ID
    mainlayerPlanId: process.env.MAINLAYER_PRO_PLAN_ID ?? 'plan_pro',
    features: [
      'Unlimited projects',
      '100 GB storage',
      'Priority support',
      'Advanced analytics',
      'Team collaboration',
      'Custom integrations',
    ],
    cta: 'Upgrade to Pro',
    highlighted: true,
  },
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'For large organizations with custom needs',
    price: 99,
    priceLabel: '$99',
    billingPeriod: 'per month',
    // Set this to your actual Mainlayer plan ID
    mainlayerPlanId: process.env.MAINLAYER_ENTERPRISE_PLAN_ID ?? 'plan_enterprise',
    features: [
      'Everything in Pro',
      'Unlimited storage',
      'Dedicated support',
      'SLA guarantee',
      'Custom contracts',
      'On-premise option',
    ],
    cta: 'Contact sales',
    highlighted: false,
  },
} as const

export type PlanId = keyof typeof PLANS

export const APP_NAME = 'MySaaS'
export const APP_DESCRIPTION = 'The modern SaaS platform powered by Mainlayer'

export const ROUTES = {
  home: '/',
  pricing: '/pricing',
  login: '/login',
  register: '/register',
  dashboard: '/dashboard',
  billing: '/billing',
  settings: '/settings',
} as const
