# Local Testing Guide - Stripe Subscription Flow

This guide walks through testing the entire subscription flow locally with Stripe test mode.

## Prerequisites

1. Stripe account (free)
2. Stripe CLI installed: `brew install stripe/stripe-cli/stripe`
3. Local dev server running: `npm run dev`

## Setup Test Environment

### 1. Get Stripe Test API Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys)
2. Make sure you're in **Test Mode** (toggle in top right)
3. Copy your test keys:
   - **Publishable key**: `pk_test_...`
   - **Secret key**: `sk_test_...`

### 2. Update Local .env

```bash
# Use TEST keys for local development
STRIPE_PUBLISHABLE_KEY=pk_test_51xxxxxxxxxxxxx
STRIPE_SECRET_KEY=sk_test_51xxxxxxxxxxxxx

# For webhook testing (we'll get this in step 3)
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx

# Other required vars
VITE_AUTH0_DOMAIN=your-tenant.auth0.com
VITE_AUTH0_CLIENT_ID=xxxxxxxxxxxxx
VITE_SANITY_STUDIO_PROJECT_ID=xxxxx
VITE_SANITY_STUDIO_TOKEN=skxxxxxxxxxxxxx
VITE_CLIENT_DOMAIN=http://localhost:8888
CLIENT_DOMAIN=http://localhost:8888

# Optional: disable paywall while testing
VITE_DISABLE_PAYWALL=true
```

### 3. Set Up Local Webhook Listener

The Stripe CLI forwards webhook events from Stripe to your local server:

```bash
# Login to Stripe CLI (opens browser)
stripe login

# Start listening for webhooks
stripe listen --forward-to http://localhost:8888/.netlify/functions/stripe-webhook

# This will output a webhook signing secret like:
# > Ready! Your webhook signing secret is whsec_xxxxxxxxxxxxx
```

Copy the `whsec_xxxxxxxxxxxxx` value and add to your `.env`:
```bash
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
```

**Important:** Restart your dev server after adding the webhook secret!

```bash
# Kill the dev server (Ctrl+C in the terminal running npm run dev)
# Then restart
npm run dev
```

## Testing Scenarios

### Scenario 1: Happy Path - Complete Flow

**Goal:** User signs up, pays, gets access

**Steps:**

1. **Start local dev server**
   ```bash
   npm run dev
   ```
   Open http://localhost:8888

2. **In separate terminal, start Stripe webhook listener**
   ```bash
   stripe listen --forward-to http://localhost:8888/.netlify/functions/stripe-webhook
   ```
   Look for output: `Ready! You are using Stripe API Version [...]`

3. **Sign up/Login via Auth0**
   - Click login button
   - Create new test account or use existing
   - You should be redirected back to app

4. **Navigate to /session**
   - Should redirect to `/order/checkout` (no subscription yet)

5. **Complete checkout**
   - Click "Checkout" button
   - Redirects to Stripe checkout page
   - Use test card: `4242 4242 4242 4242`
   - Expiry: Any future date (e.g., 12/25)
   - CVC: Any 3 digits (e.g., 123)
   - Name: Test User
   - Click "Subscribe"

6. **Watch the webhook listener terminal**
   You should see:
   ```
   --> checkout.session.completed [evt_xxxxx]
   <-- [200] POST http://localhost:8888/.netlify/functions/stripe-webhook
   ```

7. **You'll be redirected to /order/success**
   - Should see success message
   - Should see green banner "✓ Your account has been successfully linked!"
   - Check browser console for any errors

8. **Click "Click to continue"**
   - Should navigate to `/session`
   - Should see the main app (file browser)
   - Should NOT redirect back to checkout

9. **Verify in Sanity Studio**
   - Open your Sanity Studio
   - Find your user record
   - Should have `stripeCustomerId` field populated
   - Should have `subscriptionStatus` = "trialing" or "active"

**Expected Results:**
- ✅ Webhook received and processed (200 response)
- ✅ Sanity user updated with Stripe customer ID
- ✅ User can access main app
- ✅ No paywall redirect

---

### Scenario 2: Redirect Failure - Webhook Saves the Day

**Goal:** Simulate user closing tab after payment, webhook still links account

**Steps:**

1. Start dev server and webhook listener (same as Scenario 1)

2. Login and navigate to checkout

3. Complete checkout with test card

4. **IMMEDIATELY close the tab** when you see Stripe's success screen
   - Don't wait for redirect back to your app

5. **Check webhook listener**
   - Should still see `checkout.session.completed` event
   - Should see 200 response from webhook handler

6. **Wait 5-10 seconds**

7. **Open http://localhost:8888 in new tab**
   - Login again
   - Navigate to `/session`
   - Should be able to access app WITHOUT being redirected to checkout

8. **Check Sanity**
   - User should have `stripeCustomerId` even though they never visited success page

**Expected Results:**
- ✅ Webhook processed despite no redirect
- ✅ User account linked automatically
- ✅ User can access app when they return

---

### Scenario 3: Grace Period - New User Access

**Goal:** Verify grace period prevents false paywall redirects

**Steps:**

1. Create completely new user (new email in Auth0)

2. Login but DON'T complete checkout

3. Navigate to `/session`

4. Open browser console and check for message:
   ```
   User in grace period, waiting for webhook sync...
   ```

5. Should NOT be redirected to checkout immediately (grace period is 5 minutes)

6. Wait a few seconds, refresh page

7. After ~5 minutes, refresh again - should then redirect to checkout

**Expected Results:**
- ✅ Grace period prevents immediate redirect for new users
- ✅ Console shows grace period message
- ✅ Eventually redirects after grace period expires

---

### Scenario 4: Manual Recovery - Link Existing Subscription

**Goal:** Test the recovery endpoint for stuck users

**Steps:**

1. Complete a checkout to create a Stripe subscription (Scenario 1)

2. **Manually break the link** in Sanity:
   - Open Sanity Studio
   - Find your user record
   - Delete the `stripeCustomerId` field
   - Save

3. Navigate to `/session`
   - Should be redirected to checkout (no customer ID)

4. **Call recovery endpoint via browser console:**
   ```javascript
   fetch('/api/link-subscription', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({
       email: 'your-test-email@example.com',  // Your Auth0 email
       sanityUserId: 'user-sanity-id-here'    // Get from Sanity Studio
     })
   })
   .then(r => r.json())
   .then(console.log)
   ```

5. Should return:
   ```json
   {
     "customerId": "cus_xxxxx",
     "customerName": "Test User",
     "subscription": { ... }
   }
   ```

6. **Manually update Sanity** with the returned customer ID
   (In production, you'd build a UI for this)

7. Refresh `/session` - should now have access

**Expected Results:**
- ✅ Recovery endpoint finds existing subscription by email
- ✅ Returns customer data
- ✅ Can manually link account

---

### Scenario 5: Multiple Subscriptions / Duplicate Customer Prevention

**Goal:** Verify metadata prevents duplicate customers

**Steps:**

1. Complete checkout once (creates Stripe customer)

2. Check Sanity - user has `stripeCustomerId`

3. Delete the `stripeCustomerId` from Sanity (simulate broken link)

4. Start checkout AGAIN

5. Complete checkout with same email

6. Check webhook listener - should see customer linking

7. Check Stripe Dashboard:
   - Go to Customers
   - Search for your email
   - Should only see ONE customer (not duplicates)

**Expected Results:**
- ✅ Checkout reuses existing customer by email
- ✅ No duplicate customers created
- ✅ Webhook re-links the existing customer

---

## Useful Test Cards

Stripe provides test cards for different scenarios:

| Card Number | Scenario |
|-------------|----------|
| `4242 4242 4242 4242` | Success (default) |
| `4000 0025 0000 3155` | Requires authentication (3D Secure) |
| `4000 0000 0000 9995` | Declined (insufficient funds) |
| `4000 0000 0000 0002` | Declined (generic decline) |
| `4000 0000 0000 0341` | Charge succeeds, but dispute created |

All test cards:
- Expiry: Any future date
- CVC: Any 3 digits
- ZIP: Any 5 digits

[Full list of test cards](https://stripe.com/docs/testing#cards)

---

## Debugging

### Webhook Not Receiving Events

**Check:**
1. Is `stripe listen` still running?
2. Is the webhook endpoint URL correct?
3. Is `STRIPE_WEBHOOK_SECRET` set in `.env`?
4. Did you restart dev server after adding secret?

**View logs:**
```bash
# In webhook listener terminal, you'll see all events
stripe listen --forward-to http://localhost:8888/.netlify/functions/stripe-webhook --print-json
```

### Signature Verification Failed

**Common causes:**
1. Using production webhook secret with test mode (or vice versa)
2. Webhook secret from Dashboard instead of CLI
3. Not restarting dev server after changing secret

**Fix:**
```bash
# Get fresh secret from Stripe CLI
stripe listen --forward-to http://localhost:8888/.netlify/functions/stripe-webhook

# Copy the new whsec_xxxxx
# Update .env
# Restart npm run dev
```

### Sanity Not Updating

**Check:**
1. Are Sanity credentials correct in `.env`?
2. Is user's email in Sanity matching Stripe customer email?
3. Check Netlify function logs:
   ```bash
   netlify functions:log stripe-webhook
   ```

**Debug the webhook:**
Add console.logs to `netlify/functions/stripe-webhook.mjs`:
```javascript
console.log('Customer:', customer.id, customer.email)
console.log('Looking for Sanity user with email:', customer.email)
console.log('Found Sanity user:', sanityUser)
```

### Can't Access App After Checkout

**Checklist:**
1. Check browser console for errors
2. Verify webhook was received (check `stripe listen` output)
3. Check Sanity - does user have `stripeCustomerId`?
4. Is `VITE_DISABLE_PAYWALL` set to `true`? (for testing)
5. Are you in the 5-minute grace period? (check console for message)

**Force access for testing:**
Set in `.env`:
```bash
VITE_DISABLE_PAYWALL=true
```
Restart dev server.

---

## Triggering Specific Webhook Events

You can manually trigger webhook events for testing:

```bash
# Trigger subscription created
stripe trigger customer.subscription.created

# Trigger successful payment
stripe trigger invoice.paid

# Trigger failed payment
stripe trigger invoice.payment_failed

# Trigger subscription canceled
stripe trigger customer.subscription.deleted
```

Each command creates a test object in Stripe and sends the webhook.

---

## Monitoring During Tests

Keep these windows open:

1. **Terminal 1**: `npm run dev` (your app)
2. **Terminal 2**: `stripe listen --forward-to ...` (webhook listener)
3. **Browser 1**: http://localhost:8888 (your app)
4. **Browser 2**: https://dashboard.stripe.com/test/events (Stripe events)
5. **Browser 3**: Your Sanity Studio (user data)
6. **Browser DevTools**: Console (check for errors/logs)

---

## Clean Up Test Data

After testing, clean up:

### Delete Test Subscriptions
```bash
# List all test subscriptions
stripe subscriptions list --limit 10

# Cancel a subscription
stripe subscriptions cancel sub_xxxxx
```

### Delete Test Customers
```bash
# List customers
stripe customers list --limit 10

# Delete customer
stripe customers delete cus_xxxxx
```

### Or use Stripe Dashboard
1. Go to [Test Mode Dashboard](https://dashboard.stripe.com/test/customers)
2. Delete customers/subscriptions manually

### Clean Sanity Test Users
1. Open Sanity Studio
2. Delete test user records
3. Or mark them for testing

---

## Success Criteria

After running all scenarios, you should have verified:

- ✅ Checkout flow completes successfully
- ✅ Webhook receives events and responds 200 OK
- ✅ Sanity user records are updated automatically
- ✅ Users can access app after subscribing
- ✅ Webhook handles redirect failures gracefully
- ✅ Grace period prevents false paywall redirects
- ✅ Recovery endpoint can link orphaned subscriptions
- ✅ No duplicate Stripe customers created
- ✅ Error handling shows clear messages to users

---

## Next: Production Testing

Once local testing passes, test on Netlify preview deployment:

1. Push to a branch
2. Netlify creates preview deploy
3. Set up webhook pointing to preview URL
4. Test full flow in preview environment
5. Monitor Netlify function logs

See `WEBHOOK_SETUP.md` for production deployment steps.
