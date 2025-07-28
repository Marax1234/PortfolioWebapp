/**
 * Next.js Middleware for Authentication and Route Protection
 * Protects admin routes and handles authentication redirects
 */

import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const isAuth = !!token
    const isAuthPage = req.nextUrl.pathname.startsWith('/auth')
    const isAdminPage = req.nextUrl.pathname.startsWith('/admin')
    const isApiAuthRoute = req.nextUrl.pathname.startsWith('/api/auth')

    // Allow API auth routes
    if (isApiAuthRoute) {
      return NextResponse.next()
    }

    // Redirect authenticated users away from auth pages
    if (isAuthPage && isAuth) {
      const callbackUrl = req.nextUrl.searchParams.get('callbackUrl')
      const redirectUrl = callbackUrl || '/admin'
      return NextResponse.redirect(new URL(redirectUrl, req.url))
    }

    // Protect admin routes
    if (isAdminPage) {
      if (!isAuth) {
        // Not authenticated - redirect to sign in with callback
        const signInUrl = new URL('/auth/signin', req.url)
        signInUrl.searchParams.set('callbackUrl', req.nextUrl.pathname + req.nextUrl.search)
        return NextResponse.redirect(signInUrl)
      }

      // Check if user is admin
      if (token?.role !== 'ADMIN') {
        // Authenticated but not admin - redirect to access denied
        const errorUrl = new URL('/auth/error', req.url)
        errorUrl.searchParams.set('error', 'AccessDenied')
        return NextResponse.redirect(errorUrl)
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      // This callback is called before the middleware function
      authorized: ({ token, req }) => {
        const isAuthPage = req.nextUrl.pathname.startsWith('/auth')
        const isAdminPage = req.nextUrl.pathname.startsWith('/admin')

        // Allow unauthenticated access to auth pages
        if (isAuthPage) {
          return true
        }

        // Admin pages require authentication
        if (isAdminPage) {
          return !!token
        }

        // Allow access to all other pages
        return true
      },
    },
    pages: {
      signIn: '/auth/signin',
      error: '/auth/error',
    }
  }
)

// Configure which routes use this middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (except /api/auth)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files (images, etc.)
     */
    '/((?!api(?!/auth)|_next/static|_next/image|favicon.ico|images|videos|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    '/admin/:path*',
    '/auth/:path*',
  ],
}