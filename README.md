# Next.js SaaS Starter — Mainlayer Billing

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyourorg%2Fnextjs-saas-mainlayer&env=MAINLAYER_API_KEY,MAINLAYER_RESOURCE_ID,AUTH_SECRET,GITHUB_CLIENT_ID,GITHUB_CLIENT_SECRET&envDescription=See%20.env.example%20for%20all%20required%20variables&project-name=my-saas&repository-name=my-saas)

A production-ready Next.js 15 SaaS starter with **Mainlayer** payment infrastructure. Everything you need to launch: auth, 3-tier pricing, subscriptions, billing portal, usage dashboard, and webhooks. Clone → configure → run.

---

## What's included

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Auth | NextAuth v5 with GitHub + Google OAuth |
| Billing | Mainlayer — `POST /pay` checkout, `GET /entitlements/check` gating |
| UI | Tailwind CSS + shadcn/ui components |
| Middleware | Route-level auth + Mainlayer entitlement checks |
| Database | Prisma ORM + SQLite (prod: PostgreSQL) |
| Webhooks | `payment.completed`, `subscription.renewed`, `subscription.cancelled` |
| Testing | Jest unit tests for billing logic |

### Routes

**Public**
- `/` — Marketing landing page with feature highlights
- `/pricing` — Three-tier pricing table (Free, Pro, Enterprise)
- `/login` — OAuth sign-in
- `/register` — OAuth sign-up

**Protected** (auth required)
- `/dashboard` — Main app dashboard with subscription status & usage stats
- `/dashboard/billing` — Billing management (plan, invoice history, portal)
- `/dashboard/settings` — Account and subscription settings

**API**
- `POST /api/billing/subscribe` — Initiate checkout
- `GET /api/billing/status` — Check subscription status
- `GET /api/billing/portal` — Redirect to billing portal
- `POST /api/webhooks/mainlayer` — Webhook receiver (verify signature + dispatch)

---

## Quickstart (5 minutes)

### 1. Clone & install

```bash
git clone https://github.com/yourorg/nextjs-saas-mainlayer.git
cd nextjs-saas-mainlayer
npm install
```

### 2. Set environment variables

```bash
cp .env.example .env.local
```

Fill in the required values. **Minimum** for a working SaaS:

#### Mainlayer (required)

Get your free API key at [mainlayer.fr](https://mainlayer.fr).

```env
MAINLAYER_API_KEY=ml_live_xxxxxxxxxxxxxxxxxxxx
MAINLAYER_RESOURCE_ID=res_xxxxxxxxxxxxxxxxxxxx
MAINLAYER_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxx
```

#### NextAuth (required)

```bash
# Generate a random secret
openssl rand -base64 32
```

```env
AUTH_SECRET=<paste output here>
```

#### GitHub OAuth (required for GitHub sign-in)

1. [Create a GitHub OAuth App](https://github.com/settings/developers)
2. Set **Authorization callback URL** to `http://localhost:3000/api/auth/callback/github`

```env
GITHUB_CLIENT_ID=your_client_id
GITHUB_CLIENT_SECRET=your_client_secret
```

### 3. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and sign in. You now have a fully working SaaS with auth, billing, and a dashboard.

---

## Project structure

```
nextjs-saas-mainlayer/
├── app/
│   ├── page.tsx                        # Landing page
│   ├── layout.tsx                      # Root layout
│   ├── (auth)/
│   │   ├── login/page.tsx              # Sign-in page
│   │   └── register/page.tsx           # Sign-up page
│   ├── (dashboard)/
│   │   ├── layout.tsx                  # Authenticated shell
│   │   ├── dashboard/page.tsx          # Main dashboard
│   │   ├── billing/page.tsx            # Billing management
│   │   └── settings/page.tsx           # Account settings
│   ├── (marketing)/
│   │   └── pricing/page.tsx            # Public pricing page
│   └── api/
│       ├── auth/[...nextauth]/route.ts # NextAuth handler
│       ├── billing/
│       │   ├── subscribe/route.ts      # POST — start checkout
│       │   ├── portal/route.ts         # GET — entitlement status
│       │   └── status/route.ts         # GET — has_access check
│       └── webhooks/mainlayer/route.ts # Webhook receiver
├── components/
│   ├── ui/                             # shadcn/ui primitives
│   ├── billing/
│   │   ├── BillingStatus.tsx           # Dashboard billing card
│   │   └── PricingCard.tsx             # Single plan card
│   ├── dashboard/
│   │   ├── Sidebar.tsx
│   │   └── StatsCard.tsx
│   ├── layout/
│   │   └── Header.tsx
│   ├── pricing-table.tsx               # Full 3-tier pricing grid
│   ├── subscription-status.tsx         # Billing page status banner
│   └── upgrade-modal.tsx               # In-app upgrade dialog
├── lib/
│   ├── mainlayer.ts                    # Mainlayer API client
│   ├── plans.ts                        # Plan definitions
│   ├── auth.ts                         # NextAuth config
│   ├── constants.ts                    # App-wide constants & plan copy
│   └── utils.ts                        # Tailwind helpers
├── middleware.ts                        # Auth + entitlement middleware
└── .env.example
```

---

## Mainlayer integration

### How billing works

1. User clicks **Upgrade** on the pricing page or in the upgrade modal
2. The app calls `POST /api/billing/subscribe` with the user's email and plan ID
3. That route calls `POST https://api.mainlayer.fr/pay` and returns a `payment_url`
4. The user is redirected to the Mainlayer-hosted checkout page
5. On success, Mainlayer fires a `payment.completed` webhook to `/api/webhooks/mainlayer`
6. Subsequent `GET /api/billing/portal` calls hit `GET /entitlements/check` to confirm access

### Customising plans

Edit `lib/plans.ts` to add, remove, or rename plans. Each paid plan needs:

- `mainlayerResourceId` — the Mainlayer resource that represents this plan
- `mainlayerPlanId` — the plan ID passed to `POST /pay`

Create these in your Mainlayer dashboard and set them as environment variables:

```env
MAINLAYER_PRO_RESOURCE_ID=res_...
MAINLAYER_PRO_PLAN_ID=plan_...
```

### Webhooks

Set your webhook endpoint in the Mainlayer dashboard:

```
https://your-app.vercel.app/api/webhooks/mainlayer
```

Copy the signing secret into `.env.local`:

```env
MAINLAYER_WEBHOOK_SECRET=whsec_...
```

The webhook handler in `app/api/webhooks/mainlayer/route.ts` verifies the HMAC-SHA256
signature and dispatches each event to a typed handler. Add your database logic there.

### Feature gating with middleware

To gate a specific route behind a paid plan, add it to `PAID_ROUTES` in `middleware.ts`:

```ts
const PAID_ROUTES = [
  '/dashboard/analytics',
  '/dashboard/team',
]
```

Users without an active Mainlayer entitlement will be redirected to `/billing`.

---

---

## Testing

Run the test suite to verify billing logic:

```bash
npm test
```

Tests cover:
- Subscription creation and updates
- Webhook signature verification
- Entitlement checks
- Plan transitions (free → paid, paid → downgrade)

---

## Deploying to Vercel

1. Click **Deploy** at the top of this README, or use `vercel` CLI
2. Connect your GitHub repo
3. Add all environment variables from `.env.example` in the Vercel dashboard
4. Update GitHub OAuth callback URL to `https://your-app.vercel.app/api/auth/callback/github`
5. Register webhook with Mainlayer: `https://your-app.vercel.app/api/webhooks/mainlayer`

The SaaS will be live at your Vercel URL with full billing enabled.

---

## Customizing plans

Edit `lib/plans.ts` to change pricing, features, or add tiers:

```typescript
export const PLAN_PRO: Plan = {
  id: 'pro',
  name: 'Pro',
  price: 29,
  priceLabel: '$29',
  billingPeriod: 'per month',
  mainlayerResourceId: process.env.MAINLAYER_PRO_RESOURCE_ID,
  mainlayerPlanId: 'plan_pro',
  features: [
    'Unlimited projects',
    '100 GB storage',
    'Priority support',
    // Add your features here
  ],
  cta: 'Upgrade to Pro',
  highlighted: true,
  badge: 'Most popular',
}
```

Create the corresponding resources in [Mainlayer dashboard](https://mainlayer.fr/dashboard), then add env vars:

```env
MAINLAYER_PRO_PLAN_ID=plan_pro
MAINLAYER_ENTERPRISE_PLAN_ID=plan_enterprise
```

---

## Billing logic walkthrough

### Free plan
- No Mainlayer API call needed
- Users gain immediate access to all "free" routes
- Can upgrade anytime from `/billing`

### Paid plans (Pro, Enterprise)
1. User clicks "Upgrade" → `POST /api/billing/subscribe`
2. Backend calls `POST https://api.mainlayer.fr/pay`
3. Mainlayer returns `payment_url` → user is redirected
4. User completes payment on Mainlayer
5. Mainlayer fires webhook to `POST /api/webhooks/mainlayer`
6. Webhook verifies HMAC-SHA256 signature and updates local subscription state
7. Next `GET /api/billing/status` check confirms access

### Feature gating
Routes that require a paid plan are listed in `middleware.ts`:

```typescript
const PAID_ROUTES = [
  '/dashboard/analytics',
  '/dashboard/team',
]
```

Users without an active Mainlayer entitlement are redirected to `/billing`.

---

## Available scripts

```bash
npm run dev          # Start dev server on :3000
npm run build        # Production build
npm run start        # Start production server
npm run lint         # ESLint
npm run type-check   # TypeScript type checking
npm test             # Run Jest tests
```

---

## Production checklist

- [ ] Set a strong `AUTH_SECRET` (use `openssl rand -base64 32`)
- [ ] Configure `NEXTAUTH_URL` for your production domain
- [ ] Add `MAINLAYER_WEBHOOK_SECRET` from your Mainlayer dashboard
- [ ] Update `NEXT_PUBLIC_SITE_URL` to your domain
- [ ] Test webhook delivery with Mainlayer's webhook tester
- [ ] Set up email notifications for billing events (optional)
- [ ] Configure CORS properly for frontend requests
- [ ] Review and test all three plan transitions (free → pro, pro → enterprise, etc.)

---

## Troubleshooting

**"Unauthorized" when signing in**
- Check `AUTH_SECRET` is set and matches across all instances
- Verify GitHub OAuth credentials in `.env.local`

**"No Mainlayer API key" error**
- Ensure `MAINLAYER_API_KEY` is set in `.env.local`
- Check it's not wrapped in quotes or has extra spaces

**Webhook not firing**
- Verify webhook URL is registered in [Mainlayer dashboard](https://docs.mainlayer.fr/webhooks)
- Check `MAINLAYER_WEBHOOK_SECRET` matches your registered endpoint
- Use Mainlayer's webhook tester to debug

**Plan not updating after payment**
- Check webhook logs in `/api/webhooks/mainlayer` response
- Verify payment actually completed on Mainlayer
- Try clicking "Refresh entitlements" from the dashboard

---

## Support

- **Mainlayer docs**: https://docs.mainlayer.fr
- **Mainlayer API**: https://api.mainlayer.fr
- **Next.js docs**: https://nextjs.org/docs
- **NextAuth docs**: https://authjs.dev
