# Google OAuth Setup Guide

## ⚠️ Important: Configure Google OAuth Callback URL

For authentication to work, you **MUST** configure the callback URL in your Google Cloud Console.

### Steps:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services** → **Credentials**
3. Find your OAuth 2.0 Client ID (the one you're using: `159670668168-fhsfqagnmvdld3jfcfu429r6hb09goe4.apps.googleusercontent.com`)
4. Click **Edit**
5. Under **Authorized redirect URIs**, add:
   ```
   http://localhost:3000/api/auth/callback/google
   ```
6. For production, also add:
   ```
   https://yourdomain.com/api/auth/callback/google
   ```
7. Click **Save**

### Current Configuration

- **Client ID**: `159670668168-fhsfqagnmvdld3jfcfu429r6hb09goe4.apps.googleusercontent.com`
- **Required Callback URL**: `http://localhost:3000/api/auth/callback/google`

## 🔍 Troubleshooting

If you're getting authentication errors:

1. **Check Environment Variables**:
   - Ensure `NEXTAUTH_URL="http://localhost:3000"` is in your `.env`
   - Verify `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are correct
   - Ensure `NEXTAUTH_SECRET` is set

2. **Verify Callback URL**:
   - The callback URL in Google Console MUST match exactly: `http://localhost:3000/api/auth/callback/google`
   - Check for typos (no trailing slash, correct protocol)

3. **Check Browser Console**:
   - Open browser DevTools (F12)
   - Check the Console and Network tabs for errors
   - Look for any redirect errors or CORS issues

4. **Check Server Logs**:
   - Look at your terminal where `npm run dev` is running
   - Check for any error messages about authentication

5. **Clear Cookies**:
   - Sometimes old session cookies can cause issues
   - Clear your browser cookies for `localhost:3000`

## ✅ Verification

After configuring the callback URL:

1. Restart your dev server (`npm run dev`)
2. Try signing in again
3. Check if you're redirected properly after Google authentication

