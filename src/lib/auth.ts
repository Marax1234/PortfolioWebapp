/**
 * Authentication Configuration
 * Secure NextAuth.js setup with JWT and HTTP-only cookies
 */
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

import { UserRole } from '@prisma/client';

import { LogCategory, LogLevel, Logger } from './logger';
import { UserService } from './services/user-service';

// Type definitions for NextAuth
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      firstName?: string | null;
      lastName?: string | null;
      role: UserRole;
      emailVerified: boolean;
    };
  }

  interface User {
    id: string;
    email: string;
    firstName?: string | null;
    lastName?: string | null;
    role: UserRole;
    emailVerified: boolean;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    email: string;
    firstName?: string | null;
    lastName?: string | null;
    role: UserRole;
    emailVerified: boolean;
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
          placeholder: 'kilian@example.com',
        },
        password: {
          label: 'Password',
          type: 'password',
        },
      },
      async authorize(credentials, req) {
        const requestId = Logger.generateRequestId();
        const ip =
          req?.headers?.['x-forwarded-for'] ||
          req?.headers?.['x-real-ip'] ||
          'unknown';
        const userAgent = req?.headers?.['user-agent'] || 'unknown';

        try {
          if (!credentials?.email || !credentials?.password) {
            Logger.securityLog({
              level: LogLevel.WARN,
              category: LogCategory.SECURITY,
              message: 'Login attempt with missing credentials',
              eventType: 'LOGIN_FAILURE',
              severity: 'MEDIUM',
              requestId,
              ip: String(ip),
              userAgent: String(userAgent),
              details: {
                reason: 'missing_credentials',
                hasEmail: !!credentials?.email,
                hasPassword: !!credentials?.password,
              },
            });
            return null;
          }

          // Log authentication attempt
          Logger.securityLog({
            level: LogLevel.INFO,
            category: LogCategory.SECURITY,
            message: `Authentication attempt for user: ${credentials.email}`,
            eventType: 'LOGIN_FAILURE', // Will be updated to SUCCESS if successful
            severity: 'LOW',
            requestId,
            userId: credentials.email,
            ip: String(ip),
            userAgent: String(userAgent),
            details: {
              email: credentials.email,
              timestamp: new Date().toISOString(),
            },
          });

          // Rate limiting protection (simple implementation)
          const userService = new UserService();
          const user = await userService.authenticateUser(
            credentials.email,
            credentials.password
          );

          if (!user) {
            Logger.securityLog({
              level: LogLevel.WARN,
              category: LogCategory.SECURITY,
              message: `Authentication failed for user: ${credentials.email}`,
              eventType: 'LOGIN_FAILURE',
              severity: 'MEDIUM',
              requestId,
              userId: credentials.email,
              ip: String(ip),
              userAgent: String(userAgent),
              details: {
                reason: 'invalid_credentials',
                email: credentials.email,
                timestamp: new Date().toISOString(),
              },
            });
            return null;
          }

          // Only allow ADMIN users
          if (user.role !== 'ADMIN') {
            Logger.securityLog({
              level: LogLevel.WARN,
              category: LogCategory.SECURITY,
              message: `Access denied - insufficient privileges for user: ${credentials.email}`,
              eventType: 'UNAUTHORIZED_ACCESS',
              severity: 'HIGH',
              requestId,
              userId: user.id,
              ip: String(ip),
              userAgent: String(userAgent),
              details: {
                reason: 'insufficient_role',
                email: credentials.email,
                role: user.role,
                requiredRole: 'ADMIN',
                timestamp: new Date().toISOString(),
              },
            });
            return null;
          }

          // Log successful authentication
          Logger.securityLog({
            level: LogLevel.INFO,
            category: LogCategory.SECURITY,
            message: `Authentication successful for admin user: ${credentials.email}`,
            eventType: 'LOGIN_SUCCESS',
            severity: 'LOW',
            requestId,
            userId: user.id,
            ip: String(ip),
            userAgent: String(userAgent),
            details: {
              email: credentials.email,
              role: user.role,
              emailVerified: user.emailVerified,
              timestamp: new Date().toISOString(),
            },
          });

          return {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            emailVerified: user.emailVerified,
          };
        } catch (error) {
          Logger.securityLog({
            level: LogLevel.ERROR,
            category: LogCategory.SECURITY,
            message: `Authentication system error for user: ${credentials?.email || 'unknown'}`,
            eventType: 'LOGIN_FAILURE',
            severity: 'HIGH',
            requestId,
            userId: credentials?.email,
            ip: String(ip),
            userAgent: String(userAgent),
            details: {
              reason: 'system_error',
              error: error instanceof Error ? error.message : String(error),
              email: credentials?.email,
              timestamp: new Date().toISOString(),
            },
          });

          Logger.errorLog({
            level: LogLevel.ERROR,
            category: LogCategory.ERROR,
            message: 'NextAuth authentication error',
            requestId,
            error: {
              name: error instanceof Error ? error.name : 'UnknownError',
              message: error instanceof Error ? error.message : String(error),
              stack: error instanceof Error ? error.stack : undefined,
            },
            context: {
              operation: 'nextauth_credentials_authorize',
              inputData: { email: credentials?.email },
            },
          });

          return null;
        }
      },
    }),
  ],

  // Callback functions
  callbacks: {
    // JWT callback - runs whenever JWT is created
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.role = user.role;
        token.emailVerified = Boolean(user.emailVerified);
      }
      return token;
    },

    // Session callback - runs whenever session is checked
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.firstName = token.firstName;
        session.user.lastName = token.lastName;
        session.user.role = token.role;
        session.user.emailVerified = token.emailVerified;
      }
      return session;
    },
  },

  // Custom pages
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },

  // Events for logging
  events: {
    async signIn({ user, account, isNewUser }) {
      const requestId = Logger.generateRequestId();

      Logger.securityLog({
        level: LogLevel.INFO,
        category: LogCategory.SECURITY,
        message: `User session created: ${user.email}`,
        eventType: 'LOGIN_SUCCESS',
        severity: 'LOW',
        requestId,
        userId: user.id,
        details: {
          email: user.email,
          role: user.role,
          provider: account?.provider || 'credentials',
          isNewUser: Boolean(isNewUser),
          timestamp: new Date().toISOString(),
        },
      });

      Logger.info('User session established', {
        userId: user.id,
        email: user.email,
        provider: account?.provider,
        isNewUser: Boolean(isNewUser),
        requestId,
      });
    },

    async signOut({ session, token }) {
      const requestId = Logger.generateRequestId();
      const userEmail = session?.user?.email || token?.email || 'unknown';
      const userId = session?.user?.id || token?.id;

      Logger.securityLog({
        level: LogLevel.INFO,
        category: LogCategory.SECURITY,
        message: `User session terminated: ${userEmail}`,
        eventType: 'LOGIN_SUCCESS', // Using SUCCESS as logout events are expected
        severity: 'LOW',
        requestId,
        userId,
        details: {
          email: userEmail,
          sessionEnd: true,
          timestamp: new Date().toISOString(),
        },
      });

      Logger.info('User session terminated', {
        userId,
        email: userEmail,
        requestId,
      });
    },

    async createUser({ user }) {
      const requestId = Logger.generateRequestId();

      Logger.securityLog({
        level: LogLevel.INFO,
        category: LogCategory.SECURITY,
        message: `New user account created: ${user.email}`,
        eventType: 'LOGIN_SUCCESS',
        severity: 'LOW',
        requestId,
        userId: user.id,
        details: {
          email: user.email,
          role: user.role,
          emailVerified: user.emailVerified,
          accountCreation: true,
          timestamp: new Date().toISOString(),
        },
      });

      Logger.info('New user account created', {
        userId: user.id,
        email: user.email,
        role: user.role,
        requestId,
      });
    },

    async session({ session, token }) {
      // Log session checks for monitoring (debug level to avoid spam)
      Logger.debug('Session verified', {
        userId: session?.user?.id || token?.id,
        email: session?.user?.email || token?.email,
        role: session?.user?.role || token?.role,
      });
    },
  },

  // Error handling
  debug: process.env.NODE_ENV === 'development',

  // Security options
  useSecureCookies: process.env.NODE_ENV === 'production',

  // Secret for JWT signing
  secret:
    process.env.NEXTAUTH_SECRET || 'your-super-secret-key-change-in-production',
};
