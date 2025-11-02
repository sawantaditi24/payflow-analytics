# PayFlow Analytics Dashboard

A real-time payment analytics dashboard built with Next.js, TypeScript, and Stripe API integration.

## Features

- 🚀 **Real-time Transaction Monitoring** - Live transaction feed with Stripe webhooks
- 📊 **Interactive Analytics** - Revenue trends, payment methods, and success rates
- 🛡️ **Fraud Detection** - Simulated fraud alerts and monitoring
- 💳 **Test Transaction Creator** - Create test payments using Stripe test mode
- 📱 **Responsive Design** - Beautiful, modern UI that works on all devices

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Charts**: Recharts for data visualization
- **Payments**: Stripe API integration
- **Icons**: Lucide React
- **Deployment**: Vercel (recommended)

## Setup Instructions

### 1. Clone and Install

```bash
git clone <your-repo>
cd payflow-analytics
npm install
```

### 2. Stripe Configuration

1. **Create a Stripe Account** (free):
   - Go to [stripe.com](https://stripe.com) and sign up
   - No business verification needed for test mode

2. **Get API Keys**:
   - Go to [Stripe Dashboard > API Keys](https://dashboard.stripe.com/test/apikeys)
   - Copy your test keys

3. **Update Environment Variables**:
   ```bash
   # Replace with your actual test keys
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
   STRIPE_SECRET_KEY=sk_test_your_key_here
   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
   ```

### 3. Run the Application

```bash
npm run dev
```

Visit `http://localhost:3000` to see your dashboard!

## Demo Features

### For GHC Conference Presentation:

1. **Real Stripe Integration**:
   - Uses actual Stripe test API
   - Real webhook handling
   - Production-ready code patterns

2. **Live Demo Capabilities**:
   - Create test transactions in real-time
   - See live data updates
   - Interactive fraud detection simulation

3. **Talking Points**:
   - "I integrated Stripe's payment APIs and webhooks"
   - "Built a real-time dashboard for transaction monitoring"
   - "Implemented fraud detection with rule-based algorithms"
   - "Created a responsive, production-ready interface"

## API Endpoints

- `GET /api/transactions` - Fetch recent transactions from Stripe
- `POST /api/test-transaction` - Create a test transaction
- `POST /api/webhooks/stripe` - Handle Stripe webhooks

## Deployment

### Deploy to Vercel:

1. Push to GitHub
2. Connect to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

## Test Card Numbers (Stripe Test Mode)

- `4242 4242 4242 4242` - Successful payment
- `4000 0000 0000 0002` - Declined payment
- `4000 0000 0000 9995` - Insufficient funds

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── transactions/route.ts
│   │   ├── test-transaction/route.ts
│   │   └── webhooks/stripe/route.ts
│   └── page.tsx
├── components/
│   ├── Dashboard.tsx
│   ├── Sidebar.tsx
│   ├── Header.tsx
│   ├── TransactionFeed.tsx
│   ├── AnalyticsCharts.tsx
│   ├── MetricsCards.tsx
│   ├── FraudDetection.tsx
│   └── TestTransactionCreator.tsx
└── lib/
    ├── stripe.ts
    └── stripe-utils.ts
```

## Next Steps

- Add more advanced fraud detection algorithms
- Implement user authentication
- Add export functionality for reports
- Integrate with additional payment processors

---

**Perfect for showcasing your skills to finance companies at GHC!** 🎯