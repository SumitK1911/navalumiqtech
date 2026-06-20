# Payment Integration Setup Guide

## Overview
This system integrates Esewa and Khalti payment gateways for handling client subscription payments.

## Step 1: Get Merchant Credentials

### Esewa Setup
1. Go to **https://merchant.esewa.com.np**
2. Register/Login as a merchant
3. Get your credentials:
   - **Merchant Code** (6-digit code)
   - **API Key**

### Khalti Setup
1. Go to **https://khalti.com/business**
2. Create a business account
3. Get your credentials:
   - **Public Key**
   - **Secret Key**

## Step 2: Environment Variables

Add these to your `.env.local` file:

```env
# Esewa Configuration
ESEWA_MERCHANT_CODE=your_6_digit_code_here
ESEWA_API_KEY=your_esewa_api_key_here

# Khalti Configuration
KHALTI_PUBLIC_KEY=your_khalti_public_key_here
KHALTI_SECRET_KEY=your_khalti_secret_key_here

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000  # or your production URL
```

## Step 3: Install Dependencies

Add axios for HTTP requests:

```bash
npm install axios
npm install uuid
```

Update `package.json` with:
```json
"dependencies": {
  "axios": "^1.6.0",
  "uuid": "^9.0.0"
}
```

## Step 4: Update Database Schema

Run Prisma migration to add the Payment table:

```bash
npx prisma migrate dev --name add_payment_system
npx prisma generate
```

## Step 5: Test Payment Flow

### Test Esewa
1. Navigate to client portal
2. Click "Pay with Esewa" button
3. You'll be redirected to Esewa gateway
4. Use Esewa test credentials to complete payment
5. You'll be redirected back to `/client-portal?paymentSuccess=true`

### Test Khalti
1. Navigate to client portal
2. Click "Pay with Khalti" button
3. You'll be redirected to Khalti gateway
4. Use Khalti test credentials to complete payment
5. You'll be redirected back to `/client-portal?paymentSuccess=true`

## Payment Flow Diagram

```
User clicks Pay Button
        ↓
Frontend calls POST /api/payments
        ↓
Backend creates Payment record (status: pending)
        ↓
Frontend redirected to Payment Gateway (Esewa/Khalti)
        ↓
User completes payment on gateway
        ↓
Gateway redirects to /api/payments/verify
        ↓
Backend verifies payment with gateway
        ↓
If verified:
  - Update Payment status to "completed"
  - Update User subscription
  - Redirect to /client-portal?paymentSuccess=true
Else:
  - Update Payment status to "failed"
  - Redirect to /client-portal?paymentFailed=true
```

## Files Created/Modified

### New Files:
- `src/backend/services/payment.service.ts` - Payment service classes
- `src/app/api/payments/route.ts` - Payment initiation endpoint
- `src/app/api/payments/verify/route.ts` - Payment verification endpoint
- `prisma/migrations/20260605000000_add_payment_system/migration.sql` - Database migration

### Modified Files:
- `prisma/schema.prisma` - Added Payment model and defaultPaymentMethod to User
- `src/app/client-portal/ClientPaymentMethod.tsx` - Updated with actual payment processing
- `src/app/client-portal/page.tsx` - Passes credentials to payment component

## Webhook Setup (Optional for Production)

For production, set up webhooks to handle payments initiated outside your app:

### Esewa Webhook
- Endpoint: `POST /api/webhooks/esewa`
- Listen for transaction status updates

### Khalti Webhook
- Endpoint: `POST /api/webhooks/khalti`
- Listen for payment completion events

## Troubleshooting

### Payment shows pending but doesn't complete
- Check if credentials in `.env.local` are correct
- Verify payment gateway API is accessible
- Check browser console for errors

### User not getting updated subscription
- Ensure payment verification is successful
- Check database for Payment record with correct status
- Verify User email matches payment userEmail

### Redirect URL not working
- Ensure `NEXT_PUBLIC_APP_URL` is set correctly in `.env.local`
- Check that your domain is whitelisted in payment gateway settings

## Security Notes

⚠️ **Important:**
- Never commit `.env.local` to version control
- Store sensitive keys in environment variables only
- Always verify payments on the backend, never trust client-side data
- Use HTTPS in production (required by payment gateways)
- Implement rate limiting on payment endpoints
- Log all payment transactions for auditing
