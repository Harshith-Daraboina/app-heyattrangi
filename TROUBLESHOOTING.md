# Authentication Troubleshooting Guide

## ETIMEDOUT Error Fix

If you're seeing `ETIMEDOUT` or "Configuration error" when trying to sign in with Google, this is a **network connectivity issue**. Follow these steps:

### Step 1: Check Network Connectivity

Test if you can reach Google's OAuth servers:

```bash
# Test DNS resolution
nslookup oauth2.googleapis.com

# Test HTTPS connectivity
curl -I https://oauth2.googleapis.com/token

# Test from Node.js
node -e "fetch('https://oauth2.googleapis.com/token').then(r => console.log('OK')).catch(e => console.error('Error:', e.message))"
```

### Step 2: Check Firewall/Proxy Settings

If you're behind a corporate firewall or using a proxy:

1. **Check if a proxy is needed:**
   ```bash
   echo $HTTP_PROXY
   echo $HTTPS_PROXY
   ```

2. **If using a proxy, configure Node.js:**
   ```bash
   export HTTP_PROXY=http://your-proxy:port
   export HTTPS_PROXY=http://your-proxy:port
   ```

3. **Or configure npm to use proxy:**
   ```bash
   npm config set proxy http://your-proxy:port
   npm config set https-proxy http://your-proxy:port
   ```

### Step 3: Check Google OAuth Callback URL

Ensure the callback URL is configured in Google Cloud Console:
- Go to [Google Cloud Console](https://console.cloud.google.com/)
- Navigate to **APIs & Services** → **Credentials**
- Find your OAuth 2.0 Client ID
- Under **Authorized redirect URIs**, ensure this is added:
  ```
  http://localhost:3000/api/auth/callback/google
  ```

### Step 4: Verify Environment Variables

Check your `.env` file has all required variables:

```bash
cat .env | grep -E "NEXTAUTH|GOOGLE"
```

Should show:
- `NEXTAUTH_URL="http://localhost:3000"`
- `NEXTAUTH_SECRET="..."`
- `GOOGLE_CLIENT_ID="..."`
- `GOOGLE_CLIENT_SECRET="..."`

### Step 5: Test Connectivity from Your Network

The timeout might be due to:
- Slow/unstable internet connection
- Firewall blocking outbound HTTPS to Google APIs
- VPN issues
- ISP blocking or throttling

**Solutions:**

1. **Try a different network** (mobile hotspot, different WiFi)
2. **Disable VPN** if you're using one
3. **Check firewall rules** - ensure port 443 (HTTPS) outbound is allowed
4. **Contact IT/Network admin** if on corporate network

### Step 6: Increase Timeout (Temporary Workaround)

If network is slow, you can try increasing Node.js timeout by creating a custom fetch implementation. However, this is not recommended as a permanent solution.

### Step 7: Verify Google OAuth Credentials

Double-check your credentials are correct:

1. Go to Google Cloud Console
2. Verify the Client ID matches your `.env` file
3. Ensure the Client Secret is correct (regenerate if needed)
4. Make sure the OAuth consent screen is properly configured

## Common Issues

### Issue: "Configuration Error"
**Solution:** Usually means timeout or network issue. Check Steps 1-5 above.

### Issue: "Access Denied"
**Solution:** User canceled authorization or OAuth consent screen not configured.

### Issue: "OAuthAccountNotLinked"
**Solution:** Email already exists with different provider. Need to link accounts.

## Still Having Issues?

1. Check the terminal/console logs for detailed error messages
2. Check browser DevTools (F12) → Network tab for failed requests
3. Verify your internet connection is stable
4. Try signing in from a different browser or device
5. Clear browser cookies and try again

