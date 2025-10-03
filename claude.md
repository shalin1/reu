# Technical Architecture Documentation

## Overview

This is a React + TypeScript SPA for browsing and searching "Reunion" files, with a Stripe-based subscription paywall. The architecture makes several unconventional choices that are worth documenting.

## Key Technical Decisions

### 1. Hybrid Serverless Architecture

**Choice:** Netlify Functions + Vite dev server with Express backend wrapped in `serverless-http`

**Implementation:**
- Frontend: Vite + React running on port 5173
- Backend: Express app in `netlify/functions/api.mjs` deployed as serverless function
- Local dev: `netlify dev` proxies to Vite and functions (exposed on port 8888)
- Redirects in `netlify.toml` route `/api/*` to `/.netlify/functions/api/:splat`

**Why it's weird:**
- Using Express in a serverless function is uncommon (most folks just use plain function handlers)
- The `serverless-http` wrapper converts Express to serverless-compatible handlers
- Dynamic `clientDomain` detection via request headers (src/api.ts:4, netlify/functions/api.mjs:17-19)

**Trade-offs:**
- ✅ Familiar Express API for developers
- ✅ Free hosting on Netlify
- ❌ Cold starts on serverless functions
- ❌ CORS middleware required for local dev (netlify/functions/api.mjs:10-14)

### 2. XLSX as a Database

**Choice:** Static XLSX file imported as a Vite asset, parsed client-side

**Implementation:**
- Hardcoded import: `src/data/dec 26.xlsx` (src/hooks/useFiles.ts:2)
- Vite config includes XLSX in `assetsInclude` (vite.config.ts:6)
- Client-side parsing with `xlsx` library (src/hooks/useFiles.ts:17-21)
- Multiple legacy XLSX files in `src/data/` directory from different dates

**Why it's weird:**
- The entire dataset ships to every client (~800KB)
- No server-side filtering or pagination
- Date-based filenames suggest manual data updates (`dec 26.xlsx`, `Nov 24.xlsx`, etc.)

**Trade-offs:**
- ✅ Zero database infrastructure/costs
- ✅ Works offline after initial load
- ✅ Simple deployment (just static assets)
- ❌ Can't scale beyond ~few MB of data
- ❌ No real-time updates
- ❌ Manual data refresh process

### 3. Dual User Storage System

**Choice:** Auth0 for authentication + Sanity CMS for user metadata

**Implementation:**
- Auth0: User identity, login/logout (src/components/Auth0ProviderLayout.tsx)
- Sanity: User records with `stripeCustomerId`, `name`, `email` (src/hooks/useAuth0UserWithSanity.ts:13-26)
- Auto-create Sanity user record on first login (src/hooks/useAuth0UserWithSanity.ts:20-26)

**Why it's weird:**
- Using a headless CMS (Sanity) as a user database
- Two separate systems for user data instead of one
- Manual syncing between Auth0 user and Sanity record

**Trade-offs:**
- ✅ Sanity provides nice content management UI for user data
- ✅ Can store additional structured data alongside users
- ✅ Auth0 handles complex auth flows
- ❌ Additional complexity/latency
- ❌ Need to keep systems in sync
- ❌ Two paid services instead of one

### 4. Stripe Subscription Paywall

**Choice:** Server-side Stripe checkout with two separate flows

**Implementation:**

**Standard Checkout** (`/order/checkout`):
- Immediate billing
- Route: `POST /api/create-checkout-session` (netlify/functions/api.mjs:76-98)
- Price ID: `price_1PRlXHJ2NmcQazwFOfSTsZ8F` ($125/year)

**VIP Checkout** (`/vip`):
- 30-day free trial with "payment if required" (netlify/functions/api.mjs:62)
- Route: `POST /api/vip` (netlify/functions/api.mjs:44-75)
- Price ID: `price_1PSLT5J2NmcQazwF41p9fYK9`
- Trial settings prevent charge without payment method (netlify/functions/api.mjs:55-59)

**Access Control:**
- Check subscription status before rendering main app (src/pages/ReunionSession.tsx:52-68)
- Redirect to `/order/checkout` if no active subscription (src/pages/ReunionSession.tsx:70-74)
- Environment variable `VITE_DISABLE_PAYWALL` for local testing (src/hooks/useAuth0UserWithSanity.ts:37)

**Stripe Customer Linking:**
- After successful checkout, Sanity user record updated with `stripeCustomerId` (src/pages/Success.tsx:22-32)
- Customer ID passed to subsequent checkout sessions to link subscriptions (netlify/functions/api.mjs:69-71, 92-94)

**Why it's weird:**
- Form POST to API endpoint (not using Stripe's React hooks)
- Two nearly identical checkout flows with subtle differences
- Manual customer ID management across systems

**Trade-offs:**
- ✅ Simple server-side implementation
- ✅ No PCI compliance burden (Stripe hosted checkout)
- ✅ VIP flow allows comped subscriptions
- ❌ Redirect flow (not embedded checkout)
- ❌ Code duplication between checkout flows
- ❌ Manual sync of customer IDs

### 5. Complex Search Implementation

**Choice:** Client-side fuzzy search with extensive custom logic

**Implementation:**
- Multi-word prefix matching (src/hooks/useSearch.ts:31-38)
- Hardcoded special cases for "Inherited", "Prepare", "who" (src/hooks/useSearch.ts:18-24)
- Character sanitization (strip `*`, convert `\r` to space) (src/hooks/useSearch.ts:12, 114)
- Custom sort algorithm with special file prioritization (src/hooks/useSearch.ts:42-103)
- URL-based search state via `query` param (src/hooks/useSearch.ts:10-12)

**Prioritization Rules:**
1. "OPENING ENTRY FORMS (EF)" → front (src/hooks/useSearch.ts:55-56)
2. "IMPLANT INDEX (II)" → front (src/hooks/useSearch.ts:63-64)
3. "opening: iself recognitions" → back (src/hooks/useSearch.ts:59-60)
4. Exact parenthetical matches → higher (src/hooks/useSearch.ts:72-85)
5. Full word matches → higher (src/hooks/useSearch.ts:87-100)
6. Alphabetical within same name (src/hooks/useSearch.ts:66-69)

**Why it's weird:**
- Domain-specific logic baked into search code
- Special string handling for clipboard pastes (src/hooks/useSearch.ts:111-112)
- No search library (Fuse.js, etc.) - all custom code

**Trade-offs:**
- ✅ Instant search (no backend latency)
- ✅ Custom UX tailored to specific use case
- ✅ Works offline
- ❌ Hard to maintain/extend
- ❌ Search logic not reusable
- ❌ No fuzzy matching/typo tolerance

### 6. State Management

**Choice:** Minimal state libraries with URL-based persistence

**Implementation:**
- React Query: Server state caching (Stripe subscriptions, Sanity data)
- URL Search Params: Search query + pagination (src/pages/ReunionSession.tsx:23-24)
- Local component state: Modals, UI toggles
- No Redux/Zustand/MobX

**Why it's smart:**
- URL params make search results shareable/bookmarkable
- React Query handles caching/refetching automatically
- Minimal abstraction overhead

### 7. Build Configuration

**Choice:** CommonJS module system with build-time environment variable injection

**Implementation:**
- `"type": "commonjs"` in package.json despite Vite preferring ESM
- Netlify Functions use ESM (`.mjs` extension)
- Build script manually passes env vars to Vite (package.json:7)
- Different env var handling for deploy previews (netlify.toml:8)

**Why it's weird:**
- Mixed module systems (CommonJS SPA + ESM functions)
- Env vars passed via shell instead of `.env` file processing
- Build script is 300+ character one-liner

**Trade-offs:**
- ✅ Works with both CommonJS and ESM dependencies
- ✅ Explicit env var handling
- ❌ Build command complexity
- ❌ Easy to miss env vars

## Data Flow

### Typical User Session

1. **Landing** → `Splash.tsx`
2. **Login** → Auth0 redirect → callback creates Sanity user record
3. **Subscription Check** → Query Stripe API for active subscription
4. **Paywall** → Redirect to `/order/checkout` if no subscription
5. **Checkout** → POST to `/api/create-checkout-session` → Stripe redirect
6. **Success** → Update Sanity user with `stripeCustomerId`
7. **Main App** → Load XLSX, parse 800 rows, render first file
8. **Search** → Filter/sort in-memory, update URL params
9. **Navigate** → Arrow keys/buttons change `page` param

### Data Sources

```
┌─────────────┐
│   Auth0     │ → User identity, email
└─────────────┘
      ↓
┌─────────────┐
│   Sanity    │ → User metadata, stripeCustomerId, file descriptions
└─────────────┘
      ↓
┌─────────────┐
│   Stripe    │ → Subscription status, customer data
└─────────────┘
      ↓
┌─────────────┐
│ dec 26.xlsx │ → File list (800 rows)
└─────────────┘
```

## Environment Variables

### Required

- `VITE_AUTH0_DOMAIN` - Auth0 tenant domain
- `VITE_AUTH0_CLIENT_ID` - Auth0 application ID
- `STRIPE_SECRET_KEY` - Stripe API key (server-side)
- `STRIPE_PUBLISHABLE_KEY` - Stripe public key (client-side)
- `VITE_SANITY_STUDIO_PROJECT_ID` - Sanity project ID
- `VITE_SANITY_STUDIO_TOKEN` - Sanity API token

### Optional

- `VITE_CLIENT_DOMAIN` - Override client URL (for deploy previews)
- `VITE_DISABLE_PAYWALL` - Skip subscription check (local dev)
- `VITE_SKIP_LOGIN` - Bypass Auth0 (testing only)
- `VITE_STRIPE_PRICE_ID` - Stripe price ID (unclear usage)
- `NODE_VERSION` - Node.js version (Netlify build)

## Quirks & Gotchas

### 1. Hardcoded Data File

The app only loads `/src/data/dec 26.xlsx`. To update data, you must:
1. Replace the file
2. Update the import in `src/hooks/useFiles.ts:2`
3. Rebuild and redeploy

### 2. CORS in Development

Local API calls require the Express CORS middleware (netlify/functions/api.mjs:10-14). In production, Netlify's redirect rules handle this transparently.

### 3. Manual Customer ID Sync

When users check out, the Stripe customer ID must be manually saved to Sanity (src/pages/Success.tsx:27-30). If this fails, subsequent checkouts create duplicate customers.

### 4. Search Edge Cases

The search has special handling for:
- `IMPLANT\rIndex` (clipboard paste artifact) → converts to "implant index"
- Leading/trailing `*` → stripped
- `\n` → converted to space

### 5. Module System Confusion

The frontend is CommonJS (package.json `"type": "commonjs"`), but:
- Vite prefers ESM
- Netlify Functions are ESM (`.mjs`)
- This _mostly_ works due to bundler magic

### 6. Subscription Check Race Condition

On the main app page, there's a complex loading state check (src/pages/ReunionSession.tsx:75) that coordinates:
- Auth0 loading state
- Sanity user fetch
- Stripe subscription query
- XLSX data loading
- Sanity file descriptions

If any of these fail silently, the user might get stuck on "Loading..."

## Potential Improvements

### Short-term
1. Extract hardcoded price IDs to environment variables
2. Consolidate duplicate checkout flows
3. Add error boundaries for failed API calls
4. Move search logic to a testable utility function

### Long-term
1. Migrate to a real database (Postgres, MongoDB)
2. Server-side search/pagination
3. Automated data sync pipeline
4. Unified user storage (Auth0 + metadata in one place)
5. Replace Express serverless with edge functions

## Testing Locally

```bash
# Start both Vite and Netlify Functions
npm run dev

# Access at http://localhost:8888 (NOT 5173)
# Port 5173 is Vite direct (no API routes)
```

### Bypass Paywall

Set in `.env`:
```bash
VITE_DISABLE_PAYWALL=true
```

### Bypass Auth

Set in `.env`:
```bash
VITE_SKIP_LOGIN=true
```

## Deployment

Netlify automatically:
1. Runs `npm run build` (compiles TS, bundles Vite, injects env vars)
2. Deploys `dist/` as static site
3. Deploys `netlify/functions/` as serverless functions
4. Applies redirect rules from `netlify.toml`

Deploy previews get custom `VITE_CLIENT_DOMAIN` via `netlify.toml:8`.
