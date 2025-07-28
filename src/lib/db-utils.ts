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
   * Get all portfolio items for admin (includes DRAFT, REVIEW, etc.)
   */
  static async getAllItems({
    page = 1,
    limit = 12,
    category,
    status,
    featured,
    orderBy = 'createdAt',
    orderDirection = 'desc'
  }: {
    page?: number
    limit?: number
    category?: string
    status?: 'DRAFT' | 'REVIEW' | 'PUBLISHED' | 'ARCHIVED'
    featured?: boolean
    orderBy?: 'createdAt' | 'publishedAt' | 'viewCount' | 'title'
    orderDirection?: 'asc' | 'desc'
  } = {}) {
    const skip = (page - 1) * limit

    const where: Prisma.PortfolioItemWhereInput = {
      ...(status && { status }),
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
   * Get single portfolio item by ID for admin (any status)
   */
  static async getByIdForAdmin(id: string) {
    const item = await prisma.portfolioItem.findUnique({
      where: { id },
      include: {
        category: true
      }
    })

    return item
  }

  /**
   * Update portfolio item
   */
  static async updatePortfolioItem(id: string, data: Partial<{
    title: string
    description: string | null
    categoryId: string | null
    status: 'DRAFT' | 'REVIEW' | 'PUBLISHED' | 'ARCHIVED'
    featured: boolean
    tags: string
    metadata: string
    mediaType: string
    filePath: string
    thumbnailPath: string | null
  }>) {
    // Add updatedAt timestamp
    const updateData = {
      ...data,
      updatedAt: new Date().toISOString(),
      // If status is being changed to PUBLISHED and publishedAt is null, set it
      ...(data.status === 'PUBLISHED' && { publishedAt: new Date().toISOString() })
    }

    const updatedItem = await prisma.portfolioItem.update({
      where: { id },
      data: updateData,
      include: {
        category: true
      }
    })

    return updatedItem
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

  /**
   * Get analytics dashboard data
   */
  static async getDashboardAnalytics({
    startDate,
    endDate
  }: {
    startDate?: Date
    endDate?: Date
  } = {}) {
    const defaultStartDate = startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 30 days ago
    const defaultEndDate = endDate || new Date()

    // Analytics events in date range
    const analyticsEvents = await prisma.analyticsEvent.findMany({
      where: {
        timestamp: {
          gte: defaultStartDate,
          lte: defaultEndDate
        }
      },
      orderBy: { timestamp: 'desc' }
    })

    // Portfolio items statistics
    const [
      totalPortfolioItems,
      publishedItems,
      featuredItems,
      totalViews,
      topViewedItems,
      categories,
      recentItems
    ] = await Promise.all([
      // Total portfolio items
      prisma.portfolioItem.count(),
      
      // Published items
      prisma.portfolioItem.count({
        where: { status: 'PUBLISHED' }
      }),
      
      // Featured items
      prisma.portfolioItem.count({
        where: { 
          status: 'PUBLISHED',
          featured: true 
        }
      }),
      
      // Total views across all items
      prisma.portfolioItem.aggregate({
        _sum: { viewCount: true },
        where: { status: 'PUBLISHED' }
      }),
      
      // Top viewed items
      prisma.portfolioItem.findMany({
        where: { status: 'PUBLISHED' },
        include: { category: true },
        orderBy: { viewCount: 'desc' },
        take: 5
      }),
      
      // Categories with item counts
      prisma.category.findMany({
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
      }),
      
      // Recent items
      prisma.portfolioItem.findMany({
        where: { 
          status: 'PUBLISHED',
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
          }
        },
        include: { category: true },
        orderBy: { createdAt: 'desc' },
        take: 10
      })
    ])

    // Process analytics events
    const pageViews = analyticsEvents.filter(event => event.eventType === 'page_view')
    const uniqueVisitors = new Set(analyticsEvents.map(event => event.sessionId || event.ipAddress).filter(Boolean)).size
    
    // Traffic sources analysis
    const trafficSources = analyticsEvents.reduce((acc, event) => {
      const referrer = event.referrer || 'Direct'
      let domain = 'Direct'
      
      if (referrer !== 'Direct') {
        try {
          domain = new URL(referrer).hostname
        } catch {
          domain = referrer.length > 50 ? referrer.substring(0, 50) + '...' : referrer
        }
      }
      
      acc[domain] = (acc[domain] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Popular pages (for future use)
    // const popularPages = pageViews.reduce((acc, event) => {
    //   const page = event.pageUrl || 'Unknown'
    //   acc[page] = (acc[page] || 0) + 1
    //   return acc
    // }, {} as Record<string, number>)

    // Category performance - get actual view counts per category
    const categoryPerformance = await Promise.all(
      categories.map(async (category) => {
        const categoryViews = await prisma.portfolioItem.aggregate({
          _sum: { viewCount: true },
          where: {
            categoryId: category.id,
            status: 'PUBLISHED'
          }
        })
        
        return {
          id: category.id,
          name: category.name,
          slug: category.slug,
          itemCount: category._count.portfolioItems,
          totalViews: categoryViews._sum.viewCount || 0
        }
      })
    )
    

    return {
      overview: {
        totalViews: totalViews._sum.viewCount || 0,
        uniqueVisitors,
        pageViews: pageViews.length,
        totalPortfolioItems,
        publishedItems,
        featuredItems,
        totalCategories: categories.length
      },
      topContent: topViewedItems.map(item => ({
        id: item.id,
        title: item.title,
        viewCount: item.viewCount,
        category: item.category?.name || 'Uncategorized',
        thumbnail: item.thumbnailPath
      })),
      trafficSources: Object.entries(trafficSources)
        .map(([source, count]) => ({ source, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10),
      categoryPerformance: categoryPerformance.sort((a, b) => b.totalViews - a.totalViews),
      recentActivity: recentItems.map(item => ({
        id: item.id,
        title: item.title,
        action: 'published',
        timestamp: item.createdAt,
        category: item.category?.name || 'Uncategorized'
      })),
      timeRangeStats: {
        startDate: defaultStartDate,
        endDate: defaultEndDate,
        totalEvents: analyticsEvents.length,
        dailyViews: this.groupEventsByDay(pageViews, defaultStartDate, defaultEndDate)
      }
    }
  }

  /**
   * Group events by day for trend analysis
   */
  private static groupEventsByDay(events: { timestamp: Date }[], startDate: Date, endDate: Date) {
    const days: Record<string, number> = {}
    
    // Initialize all days in range with 0
    const currentDate = new Date(startDate)
    while (currentDate <= endDate) {
      const dateString = currentDate.toISOString().split('T')[0]
      days[dateString] = 0
      currentDate.setDate(currentDate.getDate() + 1)
    }
    
    // Count events per day
    events.forEach(event => {
      const dateString = event.timestamp.toISOString().split('T')[0]
      if (days.hasOwnProperty(dateString)) {
        days[dateString]++
      }
    })
    
    
    // Return with 'value' instead of 'count' for frontend compatibility
    return Object.entries(days).map(([date, count]) => ({ date, value: count }))
  }

  /**
   * Get analytics for specific time period
   */
  static async getAnalyticsForPeriod(days: number) {
    const endDate = new Date()
    const startDate = new Date(endDate.getTime() - days * 24 * 60 * 60 * 1000)
    
    return this.getDashboardAnalytics({ startDate, endDate })
  }

  /**
   * Get user engagement metrics
   */
  static async getUserEngagementMetrics() {
    const [
      totalSessions
      // averageSessionDuration,
      // bounceRate,
      // returningVisitors
    ] = await Promise.all([
      // Total unique sessions
      prisma.analyticsEvent.findMany({
        select: { sessionId: true },
        distinct: ['sessionId'],
        where: { sessionId: { not: null } }
      })
      
      // TODO: Implement more sophisticated session tracking
      // Promise.resolve(0), // averageSessionDuration placeholder
      // Promise.resolve(0), // bounceRate placeholder  
      // Promise.resolve(0), // returningVisitors placeholder
    ])

    return {
      totalSessions: totalSessions.length,
      averageSessionDuration: 0, // Would need proper session tracking
      bounceRate: 0, // Would need proper calculation
      returningVisitors: 0 // Would need proper calculation
    }
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