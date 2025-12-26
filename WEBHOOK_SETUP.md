# Stripe Webhook Setup Guide

This guide explains how to set up Stripe webhooks to fix the subscription linking issue.

## The Problem

Previously, users who completed Stripe checkout but didn't make it back to the success page (tab closed, network issue, etc.) would be stuck unable to access the app, even though they had paid. This is because the `stripeCustomerId` was only saved to Sanity via the redirect flow.

## The Solution

Webhooks make Stripe the source of truth. When subscription events happen in Stripe, Stripe sends webhooks to our server, which updates Sanity directly. This means:

1. User doesn't need to complete the redirect for their account to be linked
2. Subscription status updates automatically when renewals/cancellations occur
3. More reliable system overall

## Setup Instructions

### 1. Add Environment Variable

Add to your `.env` file and Netlify environment variables:

```bash
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
```

You'll get this value in step 3 below.

### 2. Deploy the Webhook Endpoint

The webhook endpoint is already in the codebase at `netlify/functions/stripe-webhook.mjs`.

Deploy to Netlify:
```bash
git push origin main
```

The webhook will be available at:
- **Production:** `https://yoursite.netlify.app/.netlify/functions/stripe-webhook`
- **Testing:** `https://deploy-preview-XXX--yoursite.netlify.app/.netlify/functions/stripe-webhook`

### 3. Configure Webhook in Stripe Dashboard

1. Log in to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Go to **Developers → Webhooks**
3. Click **Add endpoint**
4. Enter endpoint URL: `https://yoursite.netlify.app/.netlify/functions/stripe-webhook`
5. Select events to listen for:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.paid`
   - `invoice.payment_failed`

6. Click **Add endpoint**
7. Click on the newly created webhook
8. Click **Reveal** next to "Signing secret"
9. Copy the value (starts with `whsec_`)
10. Add to `.env` as `STRIPE_WEBHOOK_SECRET=whsec_xxxxx`
11. Add to Netlify environment variables:
    - Go to Netlify dashboard → Site settings → Environment variables
    - Add `STRIPE_WEBHOOK_SECRET` with the webhook secret value
12. Trigger a redeploy in Netlify for env var to take effect

### 4. Test the Webhook

#### Option A: Use Stripe CLI for Local Testing

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Forward webhook events to local dev server
stripe listen --forward-to http://localhost:8888/.netlify/functions/stripe-webhook

# In another terminal, trigger test event
stripe trigger customer.subscription.created
```

#### Option B: Test in Stripe Dashboard

1. Go to Stripe Dashboard → Developers → Webhooks
2. Click on your webhook
3. Click **Send test webhook**
4. Select `customer.subscription.created`
5. Click **Send test webhook**
6. Check response - should see `200 OK`

### 5. Verify It's Working

After a user completes checkout:

1. Check Netlify function logs:
   - Netlify dashboard → Functions → stripe-webhook
   - Should see `Received webhook: checkout.session.completed`
   - Should see `Updating Sanity user [id] with subscription [id]`

2. Check Sanity Studio:
   - Open user record
   - Should see `stripeCustomerId` populated
   - Should see `subscriptionStatus` = "active" or "trialing"

3. Check Stripe Dashboard:
   - Should see successful webhook deliveries
   - Green checkmarks next to webhook events

## How It Works

### Flow Diagram

```
User → Stripe Checkout → Pays
                            ↓
                    Stripe creates subscription
                            ↓
                    Stripe sends webhook to your server
                            ↓
                    Webhook handler:
                    1. Verifies signature
                    2. Finds Sanity user by email
                    3. Updates stripeCustomerId
                            ↓
                    User can now access app (even if they never returned from Stripe)
```

### Events Handled

- **`checkout.session.completed`**: When user completes checkout
- **`customer.subscription.created`**: When subscription is created
- **`customer.subscription.updated`**: When subscription changes (e.g., plan upgrade)
- **`customer.subscription.deleted`**: When subscription is canceled
- **`invoice.paid`**: When recurring payment succeeds
- **`invoice.payment_failed`**: When recurring payment fails

### Webhook Security

The webhook verifies Stripe's signature using `STRIPE_WEBHOOK_SECRET` to ensure the request actually came from Stripe. Never skip this verification in production!

## Monitoring

### Check Webhook Health

1. **Stripe Dashboard**
   - Developers → Webhooks → Your webhook
   - Shows success/failure rate
   - Click individual events to see request/response

2. **Netlify Function Logs**
   ```bash
   # Or view in Netlify dashboard
   netlify functions:logs stripe-webhook
   ```

3. **Sanity Logs**
   - Check if user records are being updated
   - Look for `stripeCustomerId` and `subscriptionStatus` fields

### Common Issues

#### Webhook Returns 400 "Invalid signature"
- Check `STRIPE_WEBHOOK_SECRET` matches the one in Stripe dashboard
- Make sure you didn't copy the API key instead of webhook secret
- Verify environment variable is deployed (redeploy after adding env var)

#### Webhook Returns 404
- Endpoint URL might be wrong
- Should be: `https://yoursite.netlify.app/.netlify/functions/stripe-webhook`
- NOT: `https://yoursite.netlify.app/api/stripe-webhook`

#### User not getting linked
- Check Netlify function logs for errors
- Verify email in Stripe customer matches email in Sanity user
- Check if webhook is being sent at all in Stripe dashboard

## Removing VITE_DISABLE_PAYWALL

Once webhooks are working:

1. Monitor for a week to ensure stability
2. Check that new users are getting linked automatically
3. Remove `VITE_DISABLE_PAYWALL` from:
   - `.env` file
   - Netlify environment variables
4. Redeploy

The paywall will now work correctly because webhooks guarantee account linking!

## Support

If webhook events are failing:
1. Check Netlify function logs
2. Check Stripe webhook delivery logs
3. Verify all environment variables are set correctly
4. Test with Stripe CLI locally first
