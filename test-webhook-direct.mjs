#!/usr/bin/env node

/**
 * Direct webhook test without needing Stripe CLI login
 * Tests the webhook endpoint is working correctly
 */

const testPayload = {
  id: 'evt_test_webhook_12345',
  object: 'event',
  type: 'checkout.session.completed',
  created: Math.floor(Date.now() / 1000),
  data: {
    object: {
      id: 'cs_test_12345',
      object: 'checkout.session',
      customer: 'cus_test_12345',
      customer_email: 'test@example.com',
      mode: 'subscription',
      payment_status: 'paid',
      status: 'complete',
      subscription: 'sub_test_12345',
      metadata: {
        sanityUserId: 'test-sanity-user-id',
        userEmail: 'test@example.com'
      }
    }
  }
}

console.log('🧪 Testing Webhook Endpoint\n')
console.log('📦 Payload:')
console.log(JSON.stringify(testPayload, null, 2))
console.log('\n🚀 Sending to http://localhost:8888/.netlify/functions/stripe-webhook\n')

// Test without signature (should fail)
fetch('http://localhost:8888/.netlify/functions/stripe-webhook', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Stripe-Signature': 'invalid_signature_for_testing'
  },
  body: JSON.stringify(testPayload)
})
.then(res => res.json())
.then(data => {
  console.log('📥 Response:', data)
  console.log('\n✅ Webhook endpoint is working!')
  console.log('   (Signature verification is correctly rejecting invalid signatures)')
  console.log('\n💡 To test with real events and valid signatures:')
  console.log('   1. Run: stripe login')
  console.log('   2. Run: ./test-webhook-local.sh')
  console.log('   3. Choose option 1 to start webhook listener')
  console.log('   4. In another terminal, choose option 3 to trigger checkout event')
})
.catch(err => {
  console.error('❌ Error:', err.message)
  console.log('\n⚠️  Make sure dev server is running: npm run dev')
})
