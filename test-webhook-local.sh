#!/bin/bash

# Local Webhook Testing Script
# This script helps you test the Stripe webhook locally

echo "🧪 Stripe Webhook Local Testing Helper"
echo "======================================="
echo ""

# Check if dev server is running
if ! curl -s http://localhost:8888 > /dev/null 2>&1; then
    echo "❌ Dev server not running on http://localhost:8888"
    echo "   Please run 'npm run dev' in another terminal first"
    exit 1
fi

echo "✅ Dev server is running"
echo ""

# Check if Stripe CLI is logged in
if ! stripe --version > /dev/null 2>&1; then
    echo "❌ Stripe CLI not installed or not in PATH"
    echo "   Please run: brew install stripe/stripe-cli/stripe"
    exit 1
fi

echo "✅ Stripe CLI is installed"
echo ""

echo "📋 Test Options:"
echo "================"
echo ""
echo "1. Start webhook listener (listens for real webhook events)"
echo "2. Trigger test event: customer.subscription.created"
echo "3. Trigger test event: checkout.session.completed"
echo "4. Trigger test event: invoice.paid"
echo "5. View recent Stripe events"
echo "6. Test webhook endpoint directly (mock payload)"
echo ""

read -p "Choose option (1-6): " choice

case $choice in
    1)
        # Check login for Stripe CLI commands
        if ! stripe config --list > /dev/null 2>&1; then
            echo ""
            echo "❌ Not logged into Stripe CLI"
            echo "   Please run: stripe login"
            exit 1
        fi
        echo ""
        echo "🎧 Starting webhook listener..."
        echo "This will forward Stripe webhook events to your local server"
        echo ""
        echo "In another terminal, you can:"
        echo "  - Complete a test checkout in your browser"
        echo "  - Or run this script again and choose option 2, 3, or 4"
        echo ""
        echo "Press Ctrl+C to stop listening"
        echo ""
        stripe listen --forward-to http://localhost:8888/.netlify/functions/stripe-webhook
        ;;

    2)
        if ! stripe config --list > /dev/null 2>&1; then
            echo ""
            echo "❌ Not logged into Stripe CLI for this option"
            echo "   Please run: stripe login"
            exit 1
        fi
        echo ""
        echo "🚀 Triggering customer.subscription.created event..."
        stripe trigger customer.subscription.created
        echo ""
        echo "✅ Event triggered! Check your webhook listener terminal for the webhook."
        ;;

    3)
        if ! stripe config --list > /dev/null 2>&1; then
            echo ""
            echo "❌ Not logged into Stripe CLI for this option"
            echo "   Please run: stripe login"
            exit 1
        fi
        echo ""
        echo "🚀 Triggering checkout.session.completed event..."
        stripe trigger checkout.session.completed
        echo ""
        echo "✅ Event triggered! Check your webhook listener terminal for the webhook."
        ;;

    4)
        if ! stripe config --list > /dev/null 2>&1; then
            echo ""
            echo "❌ Not logged into Stripe CLI for this option"
            echo "   Please run: stripe login"
            exit 1
        fi
        echo ""
        echo "🚀 Triggering invoice.paid event..."
        stripe trigger invoice.paid
        echo ""
        echo "✅ Event triggered! Check your webhook listener terminal for the webhook."
        ;;

    5)
        if ! stripe config --list > /dev/null 2>&1; then
            echo ""
            echo "❌ Not logged into Stripe CLI for this option"
            echo "   Please run: stripe login"
            exit 1
        fi
        echo ""
        echo "📊 Recent Stripe Events:"
        echo "======================="
        stripe events list --limit 10
        ;;

    6)
        echo ""
        echo "🧪 Testing webhook endpoint with mock payload..."
        echo ""

        # Create a minimal test payload
        cat > /tmp/test-webhook.json << 'EOF'
{
  "id": "evt_test_webhook",
  "object": "event",
  "type": "customer.subscription.created",
  "data": {
    "object": {
      "id": "sub_test123",
      "customer": "cus_test123",
      "status": "active",
      "current_period_start": 1234567890,
      "current_period_end": 1234567890
    }
  }
}
EOF

        echo "Sending test payload to webhook endpoint..."
        echo ""

        # This will fail signature verification but tests basic endpoint availability
        curl -X POST http://localhost:8888/.netlify/functions/stripe-webhook \
          -H "Content-Type: application/json" \
          -H "Stripe-Signature: test" \
          -d @/tmp/test-webhook.json

        echo ""
        echo ""
        echo "⚠️  Note: This test will fail signature verification (expected)"
        echo "   To test with real signature verification, use options 1-4"
        ;;

    *)
        echo "Invalid option"
        exit 1
        ;;
esac
