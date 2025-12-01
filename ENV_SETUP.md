# Environment Variables Setup

## ❌ Current Issue

Your `.env` file has a **Prisma Postgres URL** instead of a **MongoDB URL**!

## ✅ Fix Required

Update your `.env` file with the correct MongoDB connection string:

```env
DATABASE_URL="mongodb+srv://23bcs037:2PNRnxkGdUPdjv4r@cluster0.q5kwrtg.mongodb.net/hey-attrangi?retryWrites=true&w=majority"
```

## 📝 Complete .env File Template

```env
# Database Connection (MongoDB)
DATABASE_URL="mongodb+srv://23bcs037:2PNRnxkGdUPdjv4r@cluster0.q5kwrtg.mongodb.net/hey-attrangi?retryWrites=true&w=majority"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-random-secret-min-32-chars"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Razorpay
RAZORPAY_KEY_ID="your-razorpay-key-id"
RAZORPAY_KEY_SECRET="your-razorpay-key-secret"
```

## 🚨 Important Notes

1. **MongoDB URL Format**: Must start with `mongodb://` or `mongodb+srv://`
2. **Current Issue**: Your DATABASE_URL starts with `prisma+postgres://` which is wrong
3. **Fix**: Replace it with the MongoDB connection string above

## 🔧 Steps to Fix

1. Open your `.env` file
2. Replace the DATABASE_URL line with:
   ```
   DATABASE_URL="mongodb+srv://23bcs037:2PNRnxkGdUPdjv4r@cluster0.q5kwrtg.mongodb.net/hey-attrangi?retryWrites=true&w=majority"
   ```
3. Save the file
4. Restart your dev server: `npm run dev`

