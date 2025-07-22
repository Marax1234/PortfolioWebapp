"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, ReactNode } from "react"
import { Loader2 } from "lucide-react"

interface SessionCheckProps {
  children: ReactNode
  requireAdmin?: boolean
  redirectTo?: string
  fallback?: ReactNode
}

/**
 * Component that checks user session and redirects if not authenticated
 */
export function SessionCheck({ 
  children, 
  requireAdmin = false, 
  redirectTo = "/auth/signin",
  fallback 
}: SessionCheckProps) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "loading") return // Still loading

    // Not authenticated - redirect to sign in
    if (status === "unauthenticated") {
      const currentUrl = window.location.pathname + window.location.search
      const redirectUrl = `${redirectTo}?callbackUrl=${encodeURIComponent(currentUrl)}`
      router.push(redirectUrl)
      return
    }

    // Authenticated but not admin when admin required
    if (requireAdmin && session?.user?.role !== 'ADMIN') {
      router.push('/auth/error?error=AccessDenied')
      return
    }
  }, [status, session, router, requireAdmin, redirectTo])

  // Show loading state
  if (status === "loading") {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    )
  }

  // Not authenticated
  if (status === "unauthenticated") {
    return null // Will redirect
  }

  // Not admin when admin required
  if (requireAdmin && session?.user?.role !== 'ADMIN') {
    return null // Will redirect
  }

  // Authenticated and authorized
  return <>{children}</>
}

/**
 * Hook to get current user session with type safety
 */
export function useCurrentUser() {
  const { data: session, status } = useSession()
  
  return {
    user: session?.user,
    isLoading: status === "loading",
    isAuthenticated: status === "authenticated",
    isAdmin: session?.user?.role === 'ADMIN'
  }
}

/**
 * Component that only shows children if user is authenticated
 */
export function AuthOnly({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useCurrentUser()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-4">
        <Loader2 className="h-4 w-4 animate-spin" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}

/**
 * Component that only shows children if user is admin
 */
export function AdminOnly({ children }: { children: ReactNode }) {
  const { isAdmin, isLoading } = useCurrentUser()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-4">
        <Loader2 className="h-4 w-4 animate-spin" />
      </div>
    )
  }

  if (!isAdmin) {
    return null
  }

  return <>{children}</>
}

/**
 * Component that shows children only if user is NOT authenticated
 */
export function GuestOnly({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useCurrentUser()

  if (isLoading) {
    return null
  }

  if (isAuthenticated) {
    return null
  }

  return <>{children}</>
}