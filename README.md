# Next.js SaaS Starter — Mainlayer Billing

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyourorg%2Fnextjs-saas-mainlayer&env=MAINLAYER_API_KEY,MAINLAYER_RESOURCE_ID,AUTH_SECRET,GITHUB_CLIENT_ID,GITHUB_CLIENT_SECRET&envDescription=See%20.env.example%20for%20all%20required%20variables&project-name=my-saas&repository-name=my-saas)

A production-ready Next.js 15 SaaS starter wired to **Mainlayer** — payment infrastructure for modern apps. Clone it, set two env vars, and you have a fully working SaaS with auth, subscription billing, and an app dashboard.

---

## What's included

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Auth | NextAuth v5 with GitHub + Google OAuth |
| Billing | Mainlayer — `POST /pay` checkout, `GET /entitlements/check` gating |
| UI | Tailwind CSS + shadcn/ui components |
| Middleware | Route-level auth + Mainlayer entitlement checks |
| Webhooks | `payment.completed`, `subscription.renewed`, `subscription.cancelled` |

### Pages

- `/` — Marketing landing page
- `/pricing` — Three-tier pricing table
- `/login` — OAuth sign-in
- `/register` — OAuth sign-up
- `/dashboard` — Main app dashboard with subscription status
- `/billing` — Full billing management page
- `/settings` — Account and billing settings

---

## Quickstart

### 1. Clone

```bash
git clone https://github.com/yourorg/nextjs-saas-mainlayer.git
cd nextjs-saas-mainlayer
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env.local
```

Open `.env.local` and fill in the required values:

#### Mainlayer (required)

1. Sign up at [mainlayer.fr](https://mainlayer.fr)
2. Create a **Resource** in the dashboard — this represents your SaaS product
3. Copy the **API key** and **resource ID**

```env
MAINLAYER_API_KEY=ml_live_xxxxxxxxxxxxxxxxxxxx
MAINLAYER_RESOURCE_ID=res_xxxxxxxxxxxxxxxxxxxx
```

#### NextAuth (required)

Generate a random secret:

```bash
openssl rand -base64 32
```

```env
AUTH_SECRET=<paste output here>
```

#### GitHub OAuth (required for GitHub sign-in)

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Create a new OAuth App
3. Set **Authorization callback URL** to `http://localhost:3000/api/auth/callback/github`

```env
GITHUB_CLIENT_ID=your_client_id
GITHUB_CLIENT_SECRET=your_client_secret
```

### 3. Run locally

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000).

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

## Deploying to Vercel

1. Click the **Deploy** button at the top of this README
2. Connect your GitHub repo
3. Add environment variables in the Vercel dashboard (see `.env.example`)
4. Set the **Authorization callback URL** on your GitHub OAuth app to:
   `https://your-app.vercel.app/api/auth/callback/github`
5. Update `MAINLAYER_WEBHOOK_SECRET` with the endpoint registered in the Mainlayer dashboard

---

## Available scripts

```bash
npm run dev          # Start development server
npm run build        # Production build
npm run start        # Start production server
npm run lint         # ESLint
npm run type-check   # TypeScript type checking
```

---

## Customisation

| What | Where |
|------|-------|
| App name & description | `lib/constants.ts` → `APP_NAME`, `APP_DESCRIPTION` |
| Plan features & pricing copy | `lib/constants.ts` → `PLANS` |
| Mainlayer plan IDs | `lib/plans.ts` + environment variables |
| Auth providers | `lib/auth.ts` |
| Paid route list | `middleware.ts` → `PAID_ROUTES` |
| Landing page content | `app/page.tsx` |
| Dashboard stats | `app/(dashboard)/dashboard/page.tsx` |

---

## Support

- **Mainlayer docs**: [docs.mainlayer.fr](https://docs.mainlayer.fr)
- **Next.js docs**: [nextjs.org/docs](https://nextjs.org/docs)
- **NextAuth docs**: [authjs.dev](https://authjs.dev)
