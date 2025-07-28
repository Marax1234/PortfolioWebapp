/**
 * Database Utility Functions for Kilian Siebert Portfolio
 * Type-safe query helpers and common operations
 */

import { Prisma } from '@prisma/client'
import { prisma } from './db'

/**
 * Type definitions for API responses
 */
export type PortfolioItemWithCategory = Prisma.PortfolioItemGetPayload<{
  include: { category: true }
}>

export type CategoryWithCount = Prisma.CategoryGetPayload<{
  include: { _count: { select: { portfolioItems: true } } }
}>

export type UserSafe = Omit<Prisma.UserGetPayload<Record<string, never>>, 'passwordHash' | 'verificationToken' | 'resetToken'>

/**
 * Portfolio Item Queries
 */
export class PortfolioQueries {
  /**
   * Get all published portfolio items with pagination
   */
  static async getPublishedItems({
    page = 1,
    limit = 12,
    category,
    featured,
    orderBy = 'createdAt',
    orderDirection = 'desc'
  }: {
    page?: number
    limit?: number
    category?: string
    featured?: boolean
    orderBy?: 'createdAt' | 'publishedAt' | 'viewCount' | 'title'
    orderDirection?: 'asc' | 'desc'
  } = {}) {
    const skip = (page - 1) * limit

    const where: Prisma.PortfolioItemWhereInput = {
      status: 'PUBLISHED',
      ...(category && { category: { slug: category } }),
      ...(featured !== undefined && { featured })
    }

    const [items, total] = await Promise.all([
      prisma.portfolioItem.findMany({
        where,
        include: {
          category: true
        },
        orderBy: { [orderBy]: orderDirection },
        skip,
        take: limit
      }),
      prisma.portfolioItem.count({ where })
    ])

    return {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    }
  }

  /**
   * Get single portfolio item by ID
   */
  static async getById(id: string) {
    const item = await prisma.portfolioItem.findFirst({
      where: {
        id,
        status: 'PUBLISHED'
      },
      include: {
        category: true
      }
    })

    if (item) {
      // Increment view count
      await prisma.portfolioItem.update({
        where: { id },
        data: { viewCount: { increment: 1 } }
      })
    }

    return item
  }

  /**
   * Get featured portfolio items
   */
  static async getFeaturedItems(limit = 6) {
    return prisma.portfolioItem.findMany({
      where: {
        status: 'PUBLISHED',
        featured: true
      },
      include: {
        category: true
      },
      orderBy: { createdAt: 'desc' },
      take: limit
    })
  }

  /**
   * Get related items by category
   */
  static async getRelatedItems(itemId: string, categoryId: string, limit = 4) {
    return prisma.portfolioItem.findMany({
      where: {
        status: 'PUBLISHED',
        categoryId,
        id: { not: itemId }
      },
      include: {
        category: true
      },
      orderBy: { createdAt: 'desc' },
      take: limit
    })
  }

  /**
   * Create new portfolio item
   */
  static async createPortfolioItem(data: {
    title: string
    description?: string | null
    mediaType: 'IMAGE' | 'VIDEO'
    filePath: string
    thumbnailPath?: string | null
    categoryId?: string | null
    tags?: string
    metadata?: string
    status?: 'DRAFT' | 'REVIEW' | 'PUBLISHED' | 'ARCHIVED'
    featured?: boolean
    sortOrder?: number
    viewCount?: number
    createdAt: string
    updatedAt: string
    publishedAt?: string | null
  }) {
    return prisma.portfolioItem.create({
      data: {
        title: data.title,
        description: data.description,
        mediaType: data.mediaType,
        filePath: data.filePath,
        thumbnailPath: data.thumbnailPath,
        categoryId: data.categoryId,
        tags: data.tags || '[]',
        metadata: data.metadata || '{}',
        status: data.status ?? 'DRAFT',
        featured: data.featured ?? false,
        sortOrder: data.sortOrder ?? 0,
        viewCount: data.viewCount ?? 0,
        createdAt: new Date(data.createdAt),
        updatedAt: new Date(data.updatedAt),
        publishedAt: data.publishedAt ? new Date(data.publishedAt) : null
      },
      include: {
        category: true
      }
    })
  }
}

/**
 * Category Queries
 */
export class CategoryQueries {
  /**
   * Get all active categories with item counts
   */
  static async getActiveWithCounts() {
    return prisma.category.findMany({
      where: { isActive: true },
      include: {
        _count: {
          select: {
            portfolioItems: {
              where: { status: 'PUBLISHED' }
            }
          }
        }
      },
      orderBy: { sortOrder: 'asc' }
    })
  }

  /**
   * Get all categories (including inactive) with item counts - for admin
   */
  static async getAllWithCounts() {
    return prisma.category.findMany({
      include: {
        _count: {
          select: {
            portfolioItems: true
          }
        }
      },
      orderBy: { sortOrder: 'asc' }
    })
  }

  /**
   * Get category by slug
   */
  static async getBySlug(slug: string) {
    return prisma.category.findFirst({
      where: { slug, isActive: true },
      include: {
        _count: {
          select: {
            portfolioItems: {
              where: { status: 'PUBLISHED' }
            }
          }
        }
      }
    })
  }

  /**
   * Get category by ID
   */
  static async getById(id: string) {
    return prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            portfolioItems: true
          }
        }
      }
    })
  }

  /**
   * Create new category
   */
  static async create(data: {
    name: string
    slug: string
    description?: string | null
    isActive?: boolean
    sortOrder?: number
  }) {
    return prisma.category.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        isActive: data.isActive ?? true,
        sortOrder: data.sortOrder ?? 0,
      },
      include: {
        _count: {
          select: {
            portfolioItems: true
          }
        }
      }
    })
  }

  /**
   * Update category
   */
  static async update(id: string, data: {
    name?: string
    slug?: string
    description?: string | null
    isActive?: boolean
    sortOrder?: number
  }) {
    return prisma.category.update({
      where: { id },
      data,
      include: {
        _count: {
          select: {
            portfolioItems: true
          }
        }
      }
    })
  }

  /**
   * Delete category (only if no portfolio items)
   */
  static async delete(id: string) {
    // First check if category has portfolio items
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            portfolioItems: true
          }
        }
      }
    })

    if (!category) {
      throw new Error('Category not found')
    }

    if (category._count.portfolioItems > 0) {
      throw new Error(`Cannot delete category with ${category._count.portfolioItems} portfolio items`)
    }

    return prisma.category.delete({
      where: { id }
    })
  }
}

/**
 * User Queries (Safe, without sensitive data)
 */
export class UserQueries {
  /**
   * Get user by email (safe version)
   */
  static async getByEmailSafe(email: string): Promise<UserSafe | null> {
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) return null

    // Remove sensitive fields
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, verificationToken, resetToken, ...safeUser } = user
    return safeUser
  }
}

/**
 * Analytics Queries
 */
export class AnalyticsQueries {
  /**
   * Track page view
   */
  static async trackPageView({
    pageUrl,
    userAgent,
    referrer,
    sessionId,
    userId
  }: {
    pageUrl: string
    userAgent?: string
    referrer?: string
    sessionId?: string
    userId?: string
  }) {
    return prisma.analyticsEvent.create({
      data: {
        eventType: 'page_view',
        eventData: JSON.stringify({ pageUrl }),
        userAgent,
        referrer,
        sessionId,
        userId,
        pageUrl
      }
    })
  }

  /**
   * Get popular portfolio items
   */
  static async getPopularItems(limit = 10) {
    return prisma.portfolioItem.findMany({
      where: { status: 'PUBLISHED' },
      include: { category: true },
      orderBy: { viewCount: 'desc' },
      take: limit
    })
  }
}

/**
 * General utility functions
 */

/**
 * Handle Prisma errors with user-friendly messages
 */
export const handlePrismaError = (error: unknown) => {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        return { error: 'A record with this data already exists', code: 409 }
      case 'P2025':
        return { error: 'Record not found', code: 404 }
      case 'P2003':
        return { error: 'Foreign key constraint failed', code: 400 }
      default:
        return { error: 'Database error occurred', code: 500 }
    }
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    return { error: 'Invalid data provided', code: 400 }
  }

  return { error: 'Internal server error', code: 500 }
}

/**
 * Validate database connection on startup
 */
export const validateDatabaseConnection = async () => {
  try {
    await prisma.$connect()
    console.log('✅ Database connected successfully')
    return true
  } catch (error) {
    console.error('❌ Failed to connect to database:', error)
    return false
  }
}