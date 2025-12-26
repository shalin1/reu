# Subscription Flow Fix - Summary of Changes

## Problem Statement

Users completing Stripe checkout sometimes didn't get linked to their subscriptions because:
1. The redirect from Stripe back to the app could fail (tab closed, network issue, timeout)
2. The Success page was the only place linking happened
3. If the Success page didn't load or the Sanity update failed, users were stuck
4. Resulted in `VITE_DISABLE_PAYWALL` being enabled for a year to bypass the broken flow

## Solution Overview

Implement Stripe webhooks as the authoritative source for subscription status, making the redirect flow optional rather than critical.

## Changes Made

### 1. New Webhook Endpoint (`netlify/functions/stripe-webhook.mjs`)

**What it does:**
- Receives events from Stripe when subscription state changes
- Verifies webhook signature for security
- Finds Sanity users by Stripe customer email
- Automatically links `stripeCustomerId` when subscriptions are created/updated
- Handles subscription lifecycle events (created, updated, deleted, payment success/failure)

**Key features:**
- Smart user matching: tries `stripeCustomerId` first, falls back to email
- Handles `checkout.session.completed` event for immediate linking
- Tracks subscription status in Sanity (`active`, `trialing`, `canceled`)
- Includes comprehensive logging for debugging

### 2. Enhanced Checkout Flow

**Files modified:**
- `netlify/functions/api.mjs` (both `/create-checkout-session` and `/vip` endpoints)
- `src/pages/Checkout.tsx`
- `src/pages/Vip.tsx`

**Improvements:**
- Added `customer_email` to checkout session when no existing customer
- Added metadata: `sanityUserId` and `userEmail` to link sessions back to Sanity users
- Hidden form fields now pass user context to backend
- Better customer deduplication (reuses existing customer if email matches)

### 3. Subscription Recovery Endpoint

**New route:** `POST /api/link-subscription`

**Purpose:**
- Manual recovery for users stuck without linked subscriptions
- Searches Stripe by email for active subscriptions
- Returns customer data for manual account linking

**Use case:**
```javascript
// Frontend can call this if user reports "I paid but can't access"
POST /api/link-subscription
{
  email: "user@example.com",
  sanityUserId: "user-sanity-id"
}
```

### 4. Improved Success Page (`src/pages/Success.tsx`)

**Enhancements:**
- Added proper error handling with try/catch
- Shows clear success/error states to user
- Added retry logic (3 retries with 1s delay)
- Better error messages explaining webhooks will sync automatically
- Visual feedback (green success banner, yellow warning banner)
- Doesn't block user from continuing even if update fails

**Error message example:**
> "Your payment was successful, but we had trouble linking your account. Please contact support or try continuing to the app."

### 5. Grace Period for New Users (`src/pages/ReunionSession.tsx`)

**Problem:**
Webhooks might take a few seconds to process after checkout

**Solution:**
- Users created within last 5 minutes don't get redirected to paywall immediately
- Gives webhooks time to sync in background
- Prevents false paywall redirects for legitimate new subscribers

**Implementation:**
```typescript
const userCreatedAt = new Date(sanityUser._createdAt).getTime()
const gracePeriodMs = 5 * 60 * 1000 // 5 minutes
const inGracePeriod = now - userCreatedAt < gracePeriodMs

if (inGracePeriod) {
  console.log('User in grace period, waiting for webhook sync...')
  return // Don't redirect yet
}
```

### 6. Documentation

**Created files:**
- `WEBHOOK_SETUP.md` - Complete setup guide for Stripe webhooks
- `SUBSCRIPTION_FIX_SUMMARY.md` - This file

**Updated files:**
- `.env.example` - Added `STRIPE_WEBHOOK_SECRET`

## Architecture Changes

### Before (Fragile)
```
User → Checkout → Stripe → Redirect → Success Page → Update Sanity → Access Granted
                              ↑
                        If this fails, user is stuck
```

### After (Robust)
```
User → Checkout → Stripe → Webhook → Update Sanity → Access Granted
                      ↓
                   Redirect → Success Page (optional, for UX)
```

## Data Flow

### Happy Path (New Flow)
1. User clicks checkout on `/order/checkout`
2. Form submits with: `priceId`, `stripeCustomerId` (if exists), `sanityUserId`, `userEmail`
3. Backend creates Stripe checkout session with metadata
4. User redirected to Stripe, completes payment
5. **Stripe sends webhook** `checkout.session.completed` to our server
6. Webhook handler:
   - Verifies signature
   - Finds Sanity user by email
   - Updates `stripeCustomerId`, `subscriptionStatus`, etc.
7. User redirected to Success page (may happen before or after webhook)
8. Success page fetches subscription details (retry logic if webhook hasn't processed yet)
9. Success page shows confirmation, user clicks continue
10. Main app checks subscription status - user has access ✅

### Recovery Path (If Redirect Fails)
1. User clicks checkout, pays, closes tab immediately
2. Stripe still sends webhook
3. Webhook updates Sanity in background
4. User logs in later
5. Main app sees `stripeCustomerId` and active subscription - access granted ✅

### Edge Case (Everything Fails)
1. User pays but webhook fails AND redirect fails
2. User stuck at paywall
3. Admin can call `POST /api/link-subscription` with user's email
4. Returns Stripe customer data
5. Manually update Sanity user record

## Testing Checklist

- [ ] Deploy webhook endpoint to Netlify
- [ ] Configure webhook in Stripe dashboard
- [ ] Add `STRIPE_WEBHOOK_SECRET` to Netlify env vars
- [ ] Test with Stripe CLI locally
- [ ] Test full checkout flow in preview deployment
- [ ] Verify webhook events in Stripe dashboard
- [ ] Check Netlify function logs for webhook processing
- [ ] Verify Sanity records are updated
- [ ] Test "tab close after payment" scenario
- [ ] Verify grace period prevents false paywall redirects
- [ ] Monitor for a week before removing `VITE_DISABLE_PAYWALL`

## Migration Plan

### Phase 1: Deploy (Week 1)
1. Deploy all changes to production
2. Set up webhook in Stripe dashboard
3. Keep `VITE_DISABLE_PAYWALL=true` enabled
4. Monitor webhook delivery and success rates

### Phase 2: Test (Week 2)
1. Test with real checkouts
2. Verify new users get linked automatically
3. Check Netlify function logs daily
4. Fix any issues that arise

### Phase 3: Enable Paywall (Week 3+)
1. Remove `VITE_DISABLE_PAYWALL` from Netlify env vars
2. Monitor for false paywall redirects
3. Use grace period and webhook recovery to handle edge cases

## Rollback Plan

If webhooks cause issues:

1. Re-enable `VITE_DISABLE_PAYWALL=true`
2. Disable webhook in Stripe dashboard (don't delete, just disable)
3. Investigate logs and fix issues
4. Re-enable webhook and test again

## Monitoring

### Webhook Health
- **Stripe Dashboard**: Developers → Webhooks → Success rate
- **Netlify Logs**: Functions → stripe-webhook

### User Issues
- Check if user has `stripeCustomerId` in Sanity
- Check Stripe dashboard for customer by email
- Check webhook delivery logs for that customer's events

### Key Metrics
- Webhook success rate (aim for >99%)
- Time between checkout and Sanity update (should be <10 seconds)
- Number of false paywall redirects (should be near zero with grace period)

## Future Improvements

1. **Admin dashboard** - UI to manually link stuck users
2. **Automated recovery** - Periodic job to find and link orphaned subscriptions
3. **Better observability** - Dedicated monitoring dashboard
4. **Customer portal** - Let users manage subscriptions via Stripe portal
5. **Idempotency** - Track webhook event IDs to prevent duplicate processing

## Notes for Zep

This codebase had some interesting quirks:
- Using XLSX as a database (hardcoded `dec 26.xlsx`)
- Sanity CMS for user storage instead of Auth0 custom claims
- Express in serverless functions
- Form POST to API instead of fetch/axios

The webhook implementation works within these constraints. If you want to refactor further, consider:
- Moving to a real database (Postgres/MongoDB)
- Using Auth0 Actions to add Stripe customer ID to user metadata
- Migrating to standard REST API instead of Express in functions
- Adding comprehensive error tracking (Sentry)

Good luck with the pairing session! 🚀
