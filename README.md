# GlitchFixed Frontend MVP

React + Vite storefront wired to existing AWS API Gateway/Lambda backend, Cognito auth, PostgreSQL, and Stripe checkout.

## Routes
- `/` product listing
- `/cart` cart review
- `/checkout` create order + launch Stripe checkout
- `/success?orderId=...` fetch order and items
- `/orders` authenticated order history
- `/account` sign in/out and user details

## Required environment
Create `.env` from `.env.example`:

```bash
cp .env.example .env
```

Set:
- `VITE_API_BASE_URL` - existing HTTP API base URL.

Amplify config:
- Preferred: keep your existing `src/aws-exports.js` in place.
- If you already have Amplify configured elsewhere, this app will use it.

## Local run
```bash
npm install
npm run dev
```

## Build for deployment
```bash
npm run build
npm run preview
```

Deploy `dist/` to your CloudFront/S3 origin.

## End-to-end checkout flow
1. Add products on `/`.
2. Review cart on `/cart`.
3. Click checkout on `/checkout`.
4. Authenticated users create order and redirect to Stripe.
5. After Stripe return, `/success?orderId=...` loads order status and items.
6. `/orders` shows history.
