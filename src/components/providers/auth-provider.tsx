"use client"

import { SessionProvider } from "next-auth/react"
import { ReactNode } from "react"

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  return (
    <SessionProvider
      // Refetch session every 5 minutes
      refetchInterval={5 * 60}
      // Refetch session when window gains focus
      refetchOnWindowFocus={true}
      // Refetch session when user comes back online
      refetchWhenOffline={false}
    >
      {children}
    </SessionProvider>
  )
}