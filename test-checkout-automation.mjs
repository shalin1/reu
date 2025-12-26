#!/usr/bin/env node

/**
 * Automated end-to-end checkout test using Playwright
 * Tests the full subscription flow: login → checkout → payment → webhook → access
 */

import { chromium } from 'playwright'

const BASE_URL = 'http://localhost:8888'
const TEST_EMAIL = `test-${Date.now()}@example.com`

console.log('🎭 Starting Automated Checkout Test\n')
console.log(`📧 Test email: ${TEST_EMAIL}\n`)

const browser = await chromium.launch({
  headless: false, // Show browser so you can see what's happening
  slowMo: 500, // Slow down actions for visibility
})

const context = await browser.newContext()
const page = await context.newPage()

try {
  console.log('1️⃣  Navigating to app...')
  await page.goto(BASE_URL)
  await page.waitForTimeout(2000)

  console.log('2️⃣  Looking for login button...')

  // Check if we need to login (look for login button)
  const loginButton = await page.locator('button:has-text("Log in"), button:has-text("Login"), a:has-text("Log in"), a:has-text("Login")').first()

  if (await loginButton.isVisible().catch(() => false)) {
    console.log('   Found login button - clicking...')
    await loginButton.click()
    await page.waitForTimeout(3000)

    console.log('   Waiting for Auth0 page...')
    await page.waitForTimeout(2000)

    // Look for "Sign up" tab/link on Auth0
    const signupTab = page.locator('a:has-text("Sign up"), button:has-text("Sign up"), [data-action-button-signup]').first()

    if (await signupTab.isVisible().catch(() => false)) {
      console.log('   Clicking "Sign up" tab...')
      await signupTab.click()
      await page.waitForTimeout(2000)
    }

    console.log('   Filling signup form...')

    // Fill in email
    const emailInput = page.locator('input[type="email"], input[name="email"], input[name="username"]').first()
    await emailInput.waitFor({ state: 'visible', timeout: 10000 })
    await emailInput.fill(TEST_EMAIL)
    console.log(`   ✓ Email: ${TEST_EMAIL}`)

    // Fill in password (Auth0 typically requires 8+ chars with complexity)
    const passwordInput = page.locator('input[type="password"], input[name="password"]').first()
    await passwordInput.fill('TestPassword123!')
    console.log('   ✓ Password: TestPassword123!')

    await page.waitForTimeout(1000)

    // Click submit/continue button
    const submitBtn = page.locator('button[type="submit"], button:has-text("Continue"), button:has-text("Sign up")').first()
    await submitBtn.click()
    console.log('   ✓ Submitting signup form...')

    // Wait for redirect back from Auth0 (URL should contain localhost:8888 without auth0 domain)
    console.log('   Waiting for redirect back to app...\n')
    await page.waitForURL(url => url.href.includes('localhost:8888') && !url.href.includes('auth0'), {
      timeout: 30000
    })

    console.log('✅ Signup complete! Redirected to app\n')
    await page.waitForTimeout(3000)
  } else {
    console.log('   Already logged in!\n')
  }

  console.log('3️⃣  Navigating to /session (should redirect to checkout)...')
  await page.goto(`${BASE_URL}/session`)
  await page.waitForTimeout(3000)

  // Verify we're on checkout page
  await page.waitForURL('**/order/checkout', { timeout: 10000 })
  console.log('✅ Redirected to checkout page\n')

  console.log('4️⃣  Submitting checkout form...')

  // Find and click the checkout button
  const checkoutButton = await page.locator('button[type="submit"], input[type="submit"], button:has-text("Checkout")').first()
  await checkoutButton.click()

  console.log('   Waiting for Stripe checkout page to load...')

  // Wait for Stripe checkout page (URL will be checkout.stripe.com)
  await page.waitForURL(url => url.href.includes('checkout.stripe.com'), {
    timeout: 30000
  })

  console.log('✅ Stripe checkout page loaded!\n')

  console.log('5️⃣  Filling out Stripe payment form...')

  // Wait for Stripe form to be ready
  await page.waitForTimeout(3000)

  // Fill in email
  const emailField = page.locator('input[type="email"]').first()
  if (await emailField.isVisible()) {
    await emailField.fill(TEST_EMAIL)
    console.log(`   ✓ Email: ${TEST_EMAIL}`)
  }

  // Fill in card number (may be in iframe)
  try {
    // Try to find card input - Stripe uses iframes
    await page.frameLocator('iframe[name*="card"]').locator('input[name="number"]').fill('4242424242424242')
    console.log('   ✓ Card: 4242 4242 4242 4242')
  } catch (e) {
    // Fallback: try direct input
    await page.locator('input[placeholder*="Card number"], input[name="cardnumber"]').fill('4242424242424242')
    console.log('   ✓ Card: 4242 4242 4242 4242 (fallback)')
  }

  // Fill in expiry
  try {
    await page.frameLocator('iframe[name*="card"]').locator('input[name="expiry"]').fill('1225')
    console.log('   ✓ Expiry: 12/25')
  } catch (e) {
    await page.locator('input[placeholder*="MM"], input[name="exp-date"]').fill('1225')
    console.log('   ✓ Expiry: 12/25 (fallback)')
  }

  // Fill in CVC
  try {
    await page.frameLocator('iframe[name*="card"]').locator('input[name="cvc"]').fill('123')
    console.log('   ✓ CVC: 123')
  } catch (e) {
    await page.locator('input[placeholder*="CVC"], input[name="cvc"]').fill('123')
    console.log('   ✓ CVC: 123 (fallback)')
  }

  // Fill in name
  const nameField = page.locator('input[name="name"], input[placeholder*="name" i]').first()
  if (await nameField.isVisible()) {
    await nameField.fill('Test User')
    console.log('   ✓ Name: Test User')
  }

  await page.waitForTimeout(2000)

  console.log('\n6️⃣  Submitting payment...')

  // Find and click submit button
  const submitButton = page.locator('button[type="submit"]:visible').first()
  await submitButton.click()

  console.log('   ⏳ Processing payment (this may take 10-30 seconds)...')

  // Wait for redirect back to our app (success page)
  await page.waitForURL(url => url.href.includes('localhost:8888'), {
    timeout: 60000 // Wait up to 1 minute for payment processing
  })

  console.log('✅ Payment processed! Redirected back to app\n')
  await page.waitForTimeout(3000)

  console.log('7️⃣  Verifying success page...')
  const currentUrl = page.url()
  console.log(`   Current URL: ${currentUrl}`)

  if (currentUrl.includes('/order/success')) {
    console.log('✅ On success page!\n')

    // Look for success message
    const successMessage = await page.locator('text=/success|linked|thank you/i').first().textContent().catch(() => null)
    if (successMessage) {
      console.log(`   Success message: "${successMessage}"\n`)
    }
  }

  console.log('8️⃣  Navigating to /session to verify access...')
  await page.goto(`${BASE_URL}/session`)
  await page.waitForTimeout(3000)

  const finalUrl = page.url()
  console.log(`   Final URL: ${finalUrl}`)

  if (finalUrl.includes('/session')) {
    console.log('\n🎉 SUCCESS! User has access to /session')
    console.log('✅ The subscription flow works end-to-end!\n')
  } else if (finalUrl.includes('/checkout')) {
    console.log('\n❌ FAILURE: Redirected back to checkout')
    console.log('   The webhook may not have processed correctly\n')
  }

  console.log('📊 Test completed. Check webhook listener for events.\n')
  console.log('Press any key to close browser...')

  // Keep browser open for inspection
  await page.waitForTimeout(5000)

} catch (error) {
  console.error('\n❌ Test failed with error:')
  console.error(error.message)
  console.error('\nStack trace:')
  console.error(error.stack)
} finally {
  await browser.close()
  console.log('\n✅ Browser closed')
}
