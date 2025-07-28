/**
 * User Service - Secure User Authentication and Management
 * Implements Repository Pattern with bcrypt password hashing
 */

import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/db'
import { UserRole, User } from '@prisma/client'

// Salt rounds for bcrypt (12 is secure but not too slow)
const SALT_ROUNDS = 12

export interface CreateUserData {
  email: string
  password: string
  firstName?: string
  lastName?: string
  role?: UserRole
}

export interface SafeUser {
  id: string
  email: string
  firstName?: string | null
  lastName?: string | null
  role: UserRole
  emailVerified: boolean
  createdAt: Date
  updatedAt: Date
  lastLogin?: Date | null
}

export class UserService {
  /**
   * Authenticate user with email and password
   */
  async authenticateUser(email: string, password: string): Promise<SafeUser | null> {
    try {
      // Input validation
      if (!email || !password) {
        throw new Error('Email and password are required')
      }

      if (!this.isValidEmail(email)) {
        throw new Error('Invalid email format')
      }

      // Find user by email
      const user = await prisma.user.findUnique({
        where: { email: email.toLowerCase().trim() }
      })

      if (!user || !user.passwordHash) {
        // Use constant-time delay to prevent timing attacks
        await this.constantTimeDelay()
        return null
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.passwordHash)
      
      if (!isPasswordValid) {
        return null
      }

      // Update last login timestamp
      await this.updateLastLogin(user.id)

      // Return safe user object (no password hash)
      return this.toSafeUser(user)
    } catch (error) {
      console.error('Authentication error:', error)
      return null
    }
  }

  /**
   * Create new user with hashed password
   */
  async createUser(userData: CreateUserData): Promise<SafeUser | null> {
    try {
      // Input validation
      if (!userData.email || !userData.password) {
        throw new Error('Email and password are required')
      }

      if (!this.isValidEmail(userData.email)) {
        throw new Error('Invalid email format')
      }

      if (!this.isValidPassword(userData.password)) {
        throw new Error('Password does not meet security requirements')
      }

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: userData.email.toLowerCase().trim() }
      })

      if (existingUser) {
        throw new Error('User already exists')
      }

      // Hash password
      const passwordHash = await bcrypt.hash(userData.password, SALT_ROUNDS)

      // Create user
      const user = await prisma.user.create({
        data: {
          email: userData.email.toLowerCase().trim(),
          passwordHash,
          firstName: userData.firstName?.trim() || null,
          lastName: userData.lastName?.trim() || null,
          role: userData.role || 'VISITOR',
          emailVerified: false,
        }
      })

      return this.toSafeUser(user)
    } catch (error) {
      console.error('Create user error:', error)
      return null
    }
  }

  /**
   * Update user password
   */
  async updatePassword(userId: string, newPassword: string): Promise<boolean> {
    try {
      if (!this.isValidPassword(newPassword)) {
        throw new Error('Password does not meet security requirements')
      }

      const passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS)

      await prisma.user.update({
        where: { id: userId },
        data: { 
          passwordHash,
          updatedAt: new Date()
        }
      })

      return true
    } catch (error) {
      console.error('Update password error:', error)
      return false
    }
  }

  /**
   * Get user by ID (safe version without password)
   */
  async getUserById(id: string): Promise<SafeUser | null> {
    try {
      const user = await prisma.user.findUnique({
        where: { id }
      })

      if (!user) {
        return null
      }

      return this.toSafeUser(user)
    } catch (error) {
      console.error('Get user by ID error:', error)
      return null
    }
  }

  /**
   * Get user by email (safe version without password)
   */
  async getUserByEmail(email: string): Promise<SafeUser | null> {
    try {
      const user = await prisma.user.findUnique({
        where: { email: email.toLowerCase().trim() }
      })

      if (!user) {
        return null
      }

      return this.toSafeUser(user)
    } catch (error) {
      console.error('Get user by email error:', error)
      return null
    }
  }

  /**
   * Verify user email
   */
  async verifyEmail(userId: string): Promise<boolean> {
    try {
      await prisma.user.update({
        where: { id: userId },
        data: { 
          emailVerified: true,
          updatedAt: new Date()
        }
      })

      return true
    } catch (error) {
      console.error('Verify email error:', error)
      return false
    }
  }

  /**
   * Update last login timestamp
   */
  private async updateLastLogin(userId: string): Promise<void> {
    try {
      await prisma.user.update({
        where: { id: userId },
        data: { 
          lastLogin: new Date(),
          updatedAt: new Date()
        }
      })
    } catch (error) {
      console.error('Update last login error:', error)
      // Non-critical error, don't throw
    }
  }

  /**
   * Convert User to SafeUser (remove sensitive data)
   */
  private toSafeUser(user: User): SafeUser {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      lastLogin: user.lastLogin,
    }
  }

  /**
   * Email validation
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  /**
   * Password validation - enforce security requirements
   */
  private isValidPassword(password: string): boolean {
    // At least 8 characters, at least one uppercase, one lowercase, one number
    const minLength = password.length >= 8
    const hasUppercase = /[A-Z]/.test(password)
    const hasLowercase = /[a-z]/.test(password)
    const hasNumber = /\d/.test(password)
    
    return minLength && hasUppercase && hasLowercase && hasNumber
  }

  /**
   * Constant-time delay to prevent timing attacks
   */
  private async constantTimeDelay(): Promise<void> {
    // Simulate the time it takes to hash and compare a password
    await bcrypt.compare('dummy', '$2a$12$dummy.hash.to.prevent.timing.attacks')
  }
}