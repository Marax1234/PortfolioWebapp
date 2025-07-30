# Fix for Vercel Deployment Errors

## Problem

The website shows CORS errors and "Configuration Error" because:

1. API calls try to reach `localhost:3000` from production
2. `NEXTAUTH_URL` doesn't match the deployment URL

## Solution Steps

### 1. Go to your Vercel Dashboard

1. Visit [vercel.com](https://vercel.com) and login
2. Go to your `PortfolioWebapp` project
3. Click on "Settings" tab
4. Click on "Environment Variables" in the sidebar

### 2. Add these Environment Variables

**Important**: Set these in Vercel Dashboard (not in code):

```
NEXTAUTH_SECRET = BtrqTFChpx032f8xaOOMlG8g2kyXGbAkmeJYVrW/MHc=
NODE_ENV = production
DATABASE_URL = file:./dev.db
```

**Note**: You do NOT need to set `NEXTAUTH_URL` or `NEXT_PUBLIC_SITE_URL` anymore! The app now
automatically uses Vercel's system variable `VERCEL_URL` which updates with each deployment.

### 3. Optional: Email Configuration (if you want contact form emails)

```
ADMIN_EMAIL = mhiller2005@gmail.com
SMTP_HOST = smtp.gmail.com
SMTP_PORT = 587
SMTP_SECURE = false
SMTP_USER = your-email@gmail.com
SMTP_PASSWORD = your-app-password
EMAIL_FROM = your-email@gmail.com
```

### 3. Redeploy the Application

1. After adding environment variables, trigger a new deployment
2. Go to "Deployments" tab in Vercel
3. Click "Redeploy" on the latest deployment
4. Or push a new commit to trigger automatic deployment

### 4. Test the Fix

After redeployment:

- ✅ Regular visitors should be able to browse the website without authentication
- ✅ Public pages (/, /portfolio, /contact, /about) should work normally
- ✅ API calls work correctly (no more CORS errors)
- ✅ Only /admin routes should require login
- ✅ Admin login should work with: `kilian@example.com` / `AdminPass123!`

## Why this fixes the issue

**CORS Issue Fixed:**

- API calls now use relative URLs instead of hardcoded localhost
- Works automatically with any domain (preview deployments, production, custom domains)

**NextAuth Configuration Fixed:**

- NextAuth.js automatically detects the correct URL using Vercel's system variables
- No manual URL updates needed for each deployment
- Works with preview deployments and production deployments

## Additional Benefits

**Automatic URL Detection:**

- ✅ Works with every new deployment (no manual updates)
- ✅ Works with preview deployments for testing
- ✅ Ready for custom domains when you add them later
- ✅ No hardcoded URLs that can break

**Environment Variables Simplified:**

- ❌ No more `NEXTAUTH_URL` to update manually
- ❌ No more `NEXT_PUBLIC_SITE_URL` to maintain
- ✅ Uses Vercel's automatic `VERCEL_URL` system variable

## Security Note

The admin credentials (`kilian@example.com` / `AdminPass123!`) are set during the build process.
Change these in production for security.
