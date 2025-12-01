# Quick Fix for ETIMEDOUT Authentication Error

## 🔍 What's Happening

The error `ETIMEDOUT` means your server cannot reach Google's OAuth token endpoint in time. This is a **network connectivity issue**.

## ✅ Quick Solutions (Try in Order)

### Solution 1: Check Your Network Connection
```bash
# Test connectivity to Google OAuth
curl -v https://oauth2.googleapis.com/token 2>&1 | grep -i "connected\|timeout"

# If you see timeout, your network might be blocking Google APIs
```

### Solution 2: Disable VPN/Firewall Temporarily
- If you're using a VPN, **temporarily disable it** and try again
- If you're behind a corporate firewall, ask your IT admin to whitelist:
  - `oauth2.googleapis.com`
  - `accounts.google.com`
  - Port 443 (HTTPS)

### Solution 3: Use Mobile Hotspot
Try connecting to a mobile hotspot to rule out network issues:
1. Create a mobile hotspot on your phone
2. Connect your computer to it
3. Try signing in again

### Solution 4: Check Proxy Settings
If you're behind a proxy, configure it:
```bash
# Check if proxy is set
env | grep -i proxy

# If proxy is needed, configure it for Node.js
export HTTP_PROXY=http://your-proxy:port
export HTTPS_PROXY=http://your-proxy:port
npm run dev
```

### Solution 5: Verify Google OAuth Settings
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. **APIs & Services** → **Credentials**
3. Click on your OAuth 2.0 Client ID
4. Under **Authorized redirect URIs**, ensure you have:
   ```
   http://localhost:3000/api/auth/callback/google
   ```
5. Click **Save**

### Solution 6: Clear Cache and Restart
```bash
# Stop your dev server (Ctrl+C)
# Clear Next.js cache
rm -rf .next

# Restart
npm run dev
```

## 🎯 Most Likely Fix

Based on the error, try these in order:

1. **Check your internet connection** - Make sure it's stable
2. **Try a different network** - Mobile hotspot or different WiFi
3. **Disable VPN** - If you're using one
4. **Check firewall** - Make sure it's not blocking Google APIs
5. **Restart your router** - Sometimes network issues resolve with a restart

## 📝 Still Not Working?

The issue is likely at the network level. Check:
- Is your internet connection stable?
- Are you on a restricted network (corporate/university)?
- Is a firewall blocking outbound HTTPS to Google?
- Try from a different location/network

The authentication code itself is working - the problem is the network cannot reach Google's servers in time.

