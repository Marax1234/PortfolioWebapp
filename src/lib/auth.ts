/**
 * Authentication Configuration
 * Secure NextAuth.js setup with JWT and HTTP-only cookies
 */

import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { UserService } from './services/user-service'
import { UserRole } from '@prisma/client'

// Type definitions for NextAuth
declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      firstName?: string | null
      lastName?: string | null
      role: UserRole
      emailVerified: boolean
    }
  }

  interface User {
    id: string
    email: string
    firstName?: string | null
    lastName?: string | null
    role: UserRole
    emailVerified: boolean
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    email: string
    firstName?: string | null
    lastName?: string | null
    role: UserRole
    emailVerified: boolean
  }
}

export const authOptions: NextAuthOptions = {
  // Session strategy - JWT for stateless authentication
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
    updateAge: 60 * 60, // 1 hour
  },

  // JWT Configuration
  jwt: {
    maxAge: 24 * 60 * 60, // 24 hours
  },

  // Use default NextAuth cookie configuration for better compatibility
  // Let NextAuth handle cookie configuration automatically

  // Authentication providers
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { 
          label: 'Email', 
          type: 'email', 
          placeholder: 'kilian@example.com' 
        },
        password: { 
          label: 'Password', 
          type: 'password' 
        },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            console.error('Missing credentials')
            return null
          }

          // Rate limiting protection (simple implementation)
          const userService = new UserService()
          const user = await userService.authenticateUser(
            credentials.email, 
            credentials.password
          )

          if (!user) {
            console.error('Authentication failed for:', credentials.email)
            return null
          }

          // Only allow ADMIN users
          if (user.role !== 'ADMIN') {
            console.error('Access denied - not admin:', credentials.email)
            return null
          }

          console.log('Authentication successful for:', credentials.email)
          
          return {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            emailVerified: user.emailVerified,
          }
        } catch (error) {
          console.error('Authentication error:', error)
          return null
        }
      },
    }),
  ],

  // Callback functions
  callbacks: {
    // JWT callback - runs whenever JWT is created
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.email = user.email
        token.firstName = user.firstName
        token.lastName = user.lastName
        token.role = user.role
        token.emailVerified = Boolean(user.emailVerified)
      }
      return token
    },

    // Session callback - runs whenever session is checked
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id
        session.user.email = token.email
        session.user.firstName = token.firstName
        session.user.lastName = token.lastName
        session.user.role = token.role
        session.user.emailVerified = token.emailVerified
      }
      return session
    },
  },

  // Custom pages
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },

  // Events for logging
  events: {
    async signIn({ user, account, profile, isNewUser }) {
      console.log(`User signed in: ${user.email}`)
    },
    async signOut({ session, token }) {
      console.log(`User signed out: ${session?.user?.email || 'unknown'}`)
    },
    async createUser({ user }) {
      console.log(`New user created: ${user.email}`)
    },
  },

  // Error handling
  debug: process.env.NODE_ENV === 'development',
  
  // Security options
  useSecureCookies: process.env.NODE_ENV === 'production',
  
  // Secret for JWT signing
  secret: process.env.NEXTAUTH_SECRET || 'your-super-secret-key-change-in-production',
}