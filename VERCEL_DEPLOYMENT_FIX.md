# Fix for Vercel Deployment Errors

## Problem

The website shows CORS errors and 500 Internal Server Errors because:

1. API calls try to reach `localhost:3000` from production ✅ **FIXED**
2. `NEXTAUTH_URL` doesn't match the deployment URL ✅ **FIXED**  
3. SQLite database doesn't work properly on Vercel ✅ **FIXED**

## Solution Steps

### 1. Create Vercel Postgres Database

1. Visit [vercel.com](https://vercel.com) and login
2. Go to your `PortfolioWebapp` project
3. Click on "Storage" tab
4. Click "Create Database"
5. Select "Postgres"
6. Choose a region (same as your deployment)
7. Click "Create"

**Note**: This automatically adds the `DATABASE_URL` environment variable!

### 2. Set Additional Environment Variables

Go to Settings > Environment Variables and add:

```
NEXTAUTH_SECRET = BtrqTFChpx032f8xaOOMlG8g2kyXGbAkmeJYVrW/MHc=
NODE_ENV = production
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

### 3. Commit and Deploy

Push your changes to GitHub to trigger a new deployment:

```bash
git add .
git commit -m "Fix: Production-ready Vercel Postgres with migrations and conditional seeding"
git push
```

### 4. Test the Fix

After redeployment:

- ✅ Regular visitors should be able to browse the website without authentication
- ✅ Public pages (/, /portfolio, /contact, /about) should work normally
- ✅ API calls work correctly (no more CORS or 500 errors)
- ✅ Database queries return proper data
- ✅ Only /admin routes should require login
- ✅ Admin login should work with: `kilian@example.com` / `AdminPass123!`

## What this fixes

**CORS Issue Fixed:**
- API calls now use relative URLs instead of hardcoded localhost
- Works automatically with any domain (preview deployments, production, custom domains)

**Database Issue Fixed:**
- Switched from SQLite to Vercel Postgres for production reliability
- Uses `prisma migrate deploy` instead of `db push` for safe schema updates
- Added `vercel-build` script for proper deployment sequence
- Conditional seeding prevents data loss in existing databases
- Versioned migrations allow rollbacks and safer updates

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

**Production-Ready Database:**

- ✅ Prisma migrations for safe schema updates
- ✅ Conditional seeding prevents data overwrites
- ✅ Proper error handling in production
- ✅ Rollback capability for database changes

## Security Note

The admin credentials (`kilian@example.com` / `AdminPass123!`) are set during the build process.
Change these in production for security.
