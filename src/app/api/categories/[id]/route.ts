/**
 * Category by ID API Endpoint
 * PUT /api/categories/[id] - Update category
 * DELETE /api/categories/[id] - Delete category
 */

import { NextRequest, NextResponse } from 'next/server'
import { CategoryQueries } from '@/lib/db-utils'
import { Logger, LogCategory, LogLevel } from '@/lib/logger'
import { getRequestContext } from '@/lib/middleware/logging'
import { ErrorHandler } from '@/lib/error-handler'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { z } from 'zod'

// Validation schema for category update
const categoryUpdateSchema = z.object({
  name: z.string().min(2).max(50).optional(),
  slug: z.string().regex(/^[a-z0-9-]+$/).optional(),
  description: z.string().max(200).optional().nullable(),
  isActive: z.boolean().optional(),
  sortOrder: z.number().min(0).optional(),
})

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    const validatedData = categoryUpdateSchema.parse(body)

    Logger.apiLog({
      level: LogLevel.INFO,
      category: LogCategory.API,
      message: 'Updating category',
      requestId: context.requestId,
      method: context.method,
      url: context.url,
      ip: context.ip,
      userAgent: context.userAgent,
      statusCode: 0,
      responseTime: 0,
      metadata: {
        categoryId: params.id,
        userId: session.user?.id
      }
    })

    const category = await CategoryQueries.update(params.id, validatedData)

    const totalResponseTime = Date.now() - startTime

    Logger.apiLog({
      level: LogLevel.INFO,
      category: LogCategory.API,
      message: 'Category updated successfully',
      requestId: context.requestId,
      method: context.method,
      url: context.url,
      ip: context.ip,
      userAgent: context.userAgent,
      statusCode: 200,
      responseTime: totalResponseTime,
      metadata: {
        categoryId: category.id,
        categoryName: category.name
      }
    })

    const response = NextResponse.json({
      success: true,
      data: category
    })

    response.headers.set('x-request-id', context.requestId)
    return response

  } catch (error) {
    const totalResponseTime = Date.now() - startTime

    Logger.errorLog({
      level: LogLevel.ERROR,
      category: LogCategory.ERROR,
      message: 'Error updating category',
      requestId: context.requestId,
      error: {
        name: error instanceof Error ? error.name : 'UnknownError',
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      },
      context: {
        route: `/api/categories/${params.id}`,
        operation: 'update_category',
        metadata: {
          responseTime: totalResponseTime,
          ip: context.ip,
          userAgent: context.userAgent
        }
      }
    })

    return ErrorHandler.handleError(error, {
      ...context,
      route: `/api/categories/${params.id}`,
      operation: 'update_category'
    })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    Logger.apiLog({
      level: LogLevel.INFO,
      category: LogCategory.API,
      message: 'Deleting category',
      requestId: context.requestId,
      method: context.method,
      url: context.url,
      ip: context.ip,
      userAgent: context.userAgent,
      statusCode: 0,
      responseTime: 0,
      metadata: {
        categoryId: params.id,
        userId: session.user?.id
      }
    })

    await CategoryQueries.delete(params.id)

    const totalResponseTime = Date.now() - startTime

    Logger.apiLog({
      level: LogLevel.INFO,
      category: LogCategory.API,
      message: 'Category deleted successfully',
      requestId: context.requestId,
      method: context.method,
      url: context.url,
      ip: context.ip,
      userAgent: context.userAgent,
      statusCode: 200,
      responseTime: totalResponseTime,
      metadata: {
        categoryId: params.id
      }
    })

    const response = NextResponse.json({
      success: true,
      message: 'Category deleted successfully'
    })

    response.headers.set('x-request-id', context.requestId)
    return response

  } catch (error) {
    const totalResponseTime = Date.now() - startTime

    Logger.errorLog({
      level: LogLevel.ERROR,
      category: LogCategory.ERROR,
      message: 'Error deleting category',
      requestId: context.requestId,
      error: {
        name: error instanceof Error ? error.name : 'UnknownError',
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      },
      context: {
        route: `/api/categories/${params.id}`,
        operation: 'delete_category',
        metadata: {
          responseTime: totalResponseTime,
          ip: context.ip,
          userAgent: context.userAgent
        }
      }
    })

    return ErrorHandler.handleError(error, {
      ...context,
      route: `/api/categories/${params.id}`,
      operation: 'delete_category'
    })
  }
}