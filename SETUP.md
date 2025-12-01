# Quick Setup Guide

## Step-by-Step Setup

### 1. Clone and Install

```bash
cd hey-attrangi-app
npm install
```

### 2. Configure Environment

Create `.env` file with your MongoDB connection string:

```env
DATABASE_URL="mongodb+srv://23bcs037:2PNRnxkGdUPdjv4r@cluster0.q5kwrtg.mongodb.net/hey-attrangi?retryWrites=true&w=majority"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-here-min-32-chars"
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
RAZORPAY_KEY_ID=""
RAZORPAY_KEY_SECRET=""
```

### 3. Generate Prisma Client

```bash
npx prisma generate
```

### 4. Push Database Schema

```bash
npx prisma db push
```

### 5. Start Development Server

```bash
npm run dev
```

## Getting API Keys

### Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`

### Razorpay
1. Sign up at [Razorpay](https://razorpay.com/)
2. Get your API keys from Dashboard → Settings → API Keys
3. Use Test keys for development

### NextAuth Secret
Generate a random secret:
```bash
openssl rand -base64 32
```

## First User Setup

1. Visit `http://localhost:3000/auth/signin`
2. Select your role (Patient, Caregiver, Doctor, or Admin)
3. Sign in with Google
4. Complete onboarding form
5. For doctors: Wait for admin approval (or approve yourself if admin)

## Common Issues

### MongoDB Connection Error
- Check your connection string format
- Ensure your IP is whitelisted in MongoDB Atlas
- Verify username/password are correct

### Prisma Client Not Generated
```bash
rm -rf node_modules/.prisma
npx prisma generate
```

### NextAuth Redirect Error
- Ensure `NEXTAUTH_URL` matches your dev server URL
- Check Google OAuth redirect URI in Google Console

