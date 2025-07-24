/**
 * Categories API Endpoint
 * GET /api/categories - Fetch all active categories with portfolio item counts
 */

import { NextRequest, NextResponse } from 'next/server'
import { CategoryQueries } from '@/lib/db-utils'
import { Logger, LogCategory, LogLevel } from '@/lib/logger'
import { getRequestContext } from '@/lib/middleware/logging'
import { ErrorHandler } from '@/lib/error-handler'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { z } from 'zod'

// Validation schema for category creation/update
const categorySchema = z.object({
  name: z.string().min(2).max(50),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  description: z.string().max(200).optional().nullable(),
  isActive: z.boolean().optional(),
  sortOrder: z.number().min(0).optional(),
})

export async function GET(request: NextRequest) {
  const context = getRequestContext(request)
  const startTime = Date.now()

  try {
    // Log incoming request
    Logger.apiLog({
      level: LogLevel.INFO,
      category: LogCategory.API,
      message: `Categories fetch request`,
      requestId: context.requestId,
      method: context.method,
      url: context.url,
      ip: context.ip,
      userAgent: context.userAgent,
      statusCode: 0,
      responseTime: 0,
      metadata: {
        timestamp: new Date().toISOString()
      }
    })

    // Log database query start
    const dbStartTime = Date.now()
    Logger.databaseLog({
      level: LogLevel.INFO,
      category: LogCategory.DATABASE,
      message: 'Fetching active categories with portfolio counts',
      requestId: context.requestId,
      operation: 'READ',
      table: 'Category',
      queryTime: 0,
      metadata: {
        includesCounts: true
      }
    })

    // Check if admin context to fetch all categories
    const session = await getServerSession(authOptions)
    const isAdmin = session?.user?.role === 'ADMIN'
    
    // Fetch categories based on user role
    const categories = isAdmin 
      ? await CategoryQueries.getAllWithCounts()
      : await CategoryQueries.getActiveWithCounts()
    const dbQueryTime = Date.now() - dbStartTime
    const totalResponseTime = Date.now() - startTime

    // Transform category data
    const transformedCategories = categories.map(category => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      coverImage: category.coverImage,
      sortOrder: category.sortOrder,
      isActive: category.isActive,
      portfolioItemCount: category._count.portfolioItems,
      createdAt: category.createdAt
    }))

    // Log database query completion
    Logger.databaseLog({
      level: LogLevel.INFO,
      category: LogCategory.DATABASE,
      message: 'Categories fetched successfully',
      requestId: context.requestId,
      operation: 'READ',
      table: 'Category',
      queryTime: dbQueryTime,
      rowsAffected: categories.length,
      metadata: {
        activeCategories: categories.length,
        totalPortfolioItems: categories.reduce((sum, cat) => sum + cat._count.portfolioItems, 0)
      }
    })

    // Log successful response
    Logger.apiLog({
      level: LogLevel.INFO,
      category: LogCategory.API,
      message: `Categories fetched successfully`,
      requestId: context.requestId,
      method: context.method,
      url: context.url,
      ip: context.ip,
      userAgent: context.userAgent,
      statusCode: 200,
      responseTime: totalResponseTime,
      metadata: {
        categoriesReturned: categories.length,
        dbQueryTime,
        cached: false,
        averageItemsPerCategory: categories.length > 0 
          ? Math.round(categories.reduce((sum, cat) => sum + cat._count.portfolioItems, 0) / categories.length)
          : 0
      }
    })

    // Log performance if query is slow
    if (totalResponseTime > 500) {
      Logger.performanceLog({
        level: LogLevel.WARN,
        category: LogCategory.PERFORMANCE,
        message: `Slow categories query detected`,
        requestId: context.requestId,
        metrics: {
          responseTime: totalResponseTime,
          dbQueryTime,
          dbQueryCount: 1,
          memoryUsage: process.memoryUsage().heapUsed
        },
        metadata: {
          categoriesCount: categories.length
        }
      })
    }

    const response = NextResponse.json({
      success: true,
      data: transformedCategories
    })

    // Add request ID to response headers
    response.headers.set('x-request-id', context.requestId)
    
    return response

  } catch (error) {
    const totalResponseTime = Date.now() - startTime

    // Log the error with context
    Logger.errorLog({
      level: LogLevel.ERROR,
      category: LogCategory.ERROR,
      message: 'Error fetching categories',
      requestId: context.requestId,
      error: {
        name: error instanceof Error ? error.name : 'UnknownError',
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      },
      context: {
        route: '/api/categories',
        operation: 'fetch_categories',
        metadata: {
          responseTime: totalResponseTime,
          ip: context.ip,
          userAgent: context.userAgent
        }
      }
    })

    return ErrorHandler.handleError(error, {
      ...context,
      route: '/api/categories',
      operation: 'fetch_categories'
    })
  }
}

export async function POST(request: NextRequest) {
  const context = getRequestContext(request)
  const startTime = Date.now()

  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = categorySchema.parse(body)

    Logger.apiLog({
      level: LogLevel.INFO,
      category: LogCategory.API,
      message: 'Creating new category',
      requestId: context.requestId,
      method: context.method,
      url: context.url,
      ip: context.ip,
      userAgent: context.userAgent,
      statusCode: 0,
      responseTime: 0,
      metadata: {
        categoryName: validatedData.name,
        userId: session.user?.id
      }
    })

    const category = await CategoryQueries.create({
      name: validatedData.name,
      slug: validatedData.slug,
      description: validatedData.description,
      isActive: validatedData.isActive ?? true,
      sortOrder: validatedData.sortOrder ?? 0,
    })

    const totalResponseTime = Date.now() - startTime

    Logger.apiLog({
      level: LogLevel.INFO,
      category: LogCategory.API,
      message: 'Category created successfully',
      requestId: context.requestId,
      method: context.method,
      url: context.url,
      ip: context.ip,
      userAgent: context.userAgent,
      statusCode: 201,
      responseTime: totalResponseTime,
      metadata: {
        categoryId: category.id,
        categoryName: category.name
      }
    })

    const response = NextResponse.json({
      success: true,
      data: category
    }, { status: 201 })

    response.headers.set('x-request-id', context.requestId)
    return response

  } catch (error) {
    const totalResponseTime = Date.now() - startTime

    Logger.errorLog({
      level: LogLevel.ERROR,
      category: LogCategory.ERROR,
      message: 'Error creating category',
      requestId: context.requestId,
      error: {
        name: error instanceof Error ? error.name : 'UnknownError',
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      },
      context: {
        route: '/api/categories',
        operation: 'create_category',
        metadata: {
          responseTime: totalResponseTime,
          ip: context.ip,
          userAgent: context.userAgent
        }
      }
    })

    return ErrorHandler.handleError(error, {
      ...context,
      route: '/api/categories',
      operation: 'create_category'
    })
  }
}