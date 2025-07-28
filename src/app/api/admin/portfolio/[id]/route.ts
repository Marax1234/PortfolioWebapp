/**
 * Admin Portfolio Item API Endpoints
 * GET /api/admin/portfolio/[id] - Fetch single portfolio item (any status)
 * PUT /api/admin/portfolio/[id] - Update portfolio item
 */

import { NextRequest, NextResponse } from 'next/server'
import { PortfolioQueries } from '@/lib/db-utils'
import { Logger, LogCategory, LogLevel } from '@/lib/logger'
import { getRequestContext } from '@/lib/middleware/logging'
import { ErrorHandler } from '@/lib/error-handler'
import { z } from 'zod'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const context = getRequestContext(request)
  const startTime = Date.now()
  const portfolioId = params.id

  try {
    Logger.databaseLog({
      level: LogLevel.INFO,
      category: LogCategory.DATABASE,
      message: 'Fetching admin portfolio item by ID',
      requestId: context.requestId,
      operation: 'READ',
      table: 'PortfolioItem',
      queryTime: 0,
      metadata: {
        portfolioId
      }
    })

    const item = await PortfolioQueries.getByIdForAdmin(portfolioId)

    const dbQueryTime = Date.now() - startTime

    if (!item) {
      Logger.apiLog({
        level: LogLevel.INFO,
        category: LogCategory.API,
        message: 'Admin portfolio item not found',
        requestId: context.requestId,
        method: context.method,
        url: context.url,
        ip: context.ip,
        userAgent: context.userAgent,
        statusCode: 404,
        responseTime: dbQueryTime,
        metadata: {
          portfolioId,
          dbQueryTime
        }
      })

      const error = ErrorHandler.createNotFoundError('Portfolio item not found', { id: portfolioId })
      return ErrorHandler.handleError(error, {
        ...context,
        route: '/api/admin/portfolio/[id]',
        operation: 'fetch_admin_portfolio_item',
        inputData: { id: portfolioId }
      })
    }

    const totalResponseTime = Date.now() - startTime

    Logger.apiLog({
      level: LogLevel.INFO,
      category: LogCategory.API,
      message: 'Admin portfolio item fetched successfully',
      requestId: context.requestId,
      method: context.method,
      url: context.url,
      ip: context.ip,
      userAgent: context.userAgent,
      statusCode: 200,
      responseTime: totalResponseTime,
      metadata: {
        portfolioId: item.id,
        title: item.title,
        status: item.status,
        dbQueryTime
      }
    })

    // Parse JSON fields
    const itemWithParsedFields = {
      ...item,
      tags: JSON.parse(item.tags || '[]'),
      metadata: JSON.parse(item.metadata || '{}')
    }

    const response = NextResponse.json({
      success: true,
      data: itemWithParsedFields
    })

    response.headers.set('x-request-id', context.requestId)
    return response

  } catch (error) {
    const totalResponseTime = Date.now() - startTime

    Logger.errorLog({
      level: LogLevel.ERROR,
      category: LogCategory.ERROR,
      message: 'Error fetching admin portfolio item',
      requestId: context.requestId,
      error: {
        name: error instanceof Error ? error.name : 'UnknownError',
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      },
      context: {
        route: '/api/admin/portfolio/[id]',
        operation: 'fetch_admin_portfolio_item',
        inputData: { id: portfolioId },
        metadata: {
          responseTime: totalResponseTime,
          ip: context.ip,
          userAgent: context.userAgent
        }
      }
    })

    return ErrorHandler.handleError(error, {
      ...context,
      route: '/api/admin/portfolio/[id]',
      operation: 'fetch_admin_portfolio_item',
      inputData: { id: portfolioId }
    })
  }
}

// Update validation schema
const updatePortfolioSchema = z.object({
  title: z.string().min(1).max(100).optional(),
  description: z.string().max(500).nullable().optional(),
  categoryId: z.string().nullable().optional(),
  status: z.enum(['DRAFT', 'REVIEW', 'PUBLISHED', 'ARCHIVED']).optional(),
  featured: z.boolean().optional(),
  tags: z.string().optional(), // JSON string
  metadata: z.string().optional(), // JSON string
  mediaType: z.string().optional(),
  filePath: z.string().optional(),
  thumbnailPath: z.string().nullable().optional()
})

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const context = getRequestContext(request)
  const startTime = Date.now()
  const portfolioId = params.id

  try {
    Logger.apiLog({
      level: LogLevel.INFO,
      category: LogCategory.API,
      message: 'Portfolio item update request',
      requestId: context.requestId,
      method: context.method,
      url: context.url,
      ip: context.ip,
      userAgent: context.userAgent,
      statusCode: 0,
      responseTime: 0,
      metadata: {
        portfolioId,
        timestamp: new Date().toISOString()
      }
    })

    // Parse request body
    const body = await request.json()
    console.log('Update request body:', JSON.stringify(body, null, 2))

    // Validate request data
    const validationResult = updatePortfolioSchema.safeParse(body)
    if (!validationResult.success) {
      const errorDetails = validationResult.error?.errors || []
      const errors = errorDetails.map(err => 
        `${err.path.join('.')}: ${err.message}`
      ).join(', ')
      
      const error = ErrorHandler.createValidationError(`Invalid update data: ${errors}`, {
        validationErrors: errorDetails
      })
      
      return ErrorHandler.handleError(error, {
        ...context,
        route: '/api/admin/portfolio/[id]',
        operation: 'validation',
        inputData: body
      })
    }

    const updateData = validationResult.data

    Logger.databaseLog({
      level: LogLevel.INFO,
      category: LogCategory.DATABASE,
      message: 'Updating portfolio item',
      requestId: context.requestId,
      operation: 'UPDATE',
      table: 'PortfolioItem',
      queryTime: 0,
      metadata: {
        portfolioId,
        fieldsToUpdate: Object.keys(updateData)
      }
    })

    const updatedItem = await PortfolioQueries.updatePortfolioItem(portfolioId, updateData)

    const totalResponseTime = Date.now() - startTime

    Logger.apiLog({
      level: LogLevel.INFO,
      category: LogCategory.API,
      message: 'Portfolio item updated successfully',
      requestId: context.requestId,
      method: context.method,
      url: context.url,
      ip: context.ip,
      userAgent: context.userAgent,
      statusCode: 200,
      responseTime: totalResponseTime,
      metadata: {
        portfolioId: updatedItem.id,
        title: updatedItem.title,
        status: updatedItem.status
      }
    })

    // Parse JSON fields
    const itemWithParsedFields = {
      ...updatedItem,
      tags: JSON.parse(updatedItem.tags || '[]'),
      metadata: JSON.parse(updatedItem.metadata || '{}')
    }

    const response = NextResponse.json({
      success: true,
      data: itemWithParsedFields
    })

    response.headers.set('x-request-id', context.requestId)
    return response

  } catch (error) {
    const totalResponseTime = Date.now() - startTime

    Logger.errorLog({
      level: LogLevel.ERROR,
      category: LogCategory.ERROR,
      message: 'Error updating portfolio item',
      requestId: context.requestId,
      error: {
        name: error instanceof Error ? error.name : 'UnknownError',
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      },
      context: {
        route: '/api/admin/portfolio/[id]',
        operation: 'update_portfolio_item',
        inputData: { id: portfolioId },
        metadata: {
          responseTime: totalResponseTime,
          ip: context.ip,
          userAgent: context.userAgent
        }
      }
    })

    return ErrorHandler.handleError(error, {
      ...context,
      route: '/api/admin/portfolio/[id]',
      operation: 'update_portfolio_item',
      inputData: { id: portfolioId }
    })
  }
}