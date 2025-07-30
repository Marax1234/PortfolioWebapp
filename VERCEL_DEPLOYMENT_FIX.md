# Fix for Vercel Authentication Configuration Error

## Problem
The website shows "Configuration Error" because `NEXTAUTH_URL` is set to `localhost:3000` but the app is deployed on Vercel with a different URL.

## Solution Steps

### 1. Go to your Vercel Dashboard
1. Visit [vercel.com](https://vercel.com) and login
2. Go to your `PortfolioWebapp` project
3. Click on "Settings" tab
4. Click on "Environment Variables" in the sidebar

### 2. Add/Update these Environment Variables

**Important**: Set these in Vercel Dashboard (not in code):

```
NEXTAUTH_URL = https://portfolio-webapp-h7taen5g7-maxs-projects-c66479e3.vercel.app
NEXTAUTH_SECRET = BtrqTFChpx032f8xaOOMlG8g2kyXGbAkmeJYVrW/MHc=
NODE_ENV = production
DATABASE_URL = file:./dev.db
```

**Note**: Replace the NEXTAUTH_URL with your actual Vercel deployment URL.

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

### 4. Redeploy the Application
1. After adding environment variables, trigger a new deployment
2. Go to "Deployments" tab in Vercel
3. Click "Redeploy" on the latest deployment
4. Or push a new commit to trigger automatic deployment

### 5. Test the Fix
After redeployment:
- ✅ Regular visitors should be able to browse the website without authentication
- ✅ Public pages (/, /portfolio, /contact, /about) should work normally  
- ✅ Only /admin routes should require login
- ✅ Admin login should work with: `kilian@example.com` / `AdminPass123!`

## Why this fixes the issue
- NextAuth.js validates that the current URL matches `NEXTAUTH_URL`
- When they don't match, it redirects ALL users to the error page
- Setting the correct production URL allows NextAuth.js to work properly
- Your middleware will then handle route protection correctly

## Security Note
The admin credentials (`kilian@example.com` / `AdminPass123!`) are set during the build process. Change these in production for security.