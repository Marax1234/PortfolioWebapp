/**
 * Admin Inquiries API Endpoint
 * GET /api/admin/inquiries - Fetch all inquiries for admin
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { Logger, LogCategory, LogLevel } from '@/lib/logger'
import { getRequestContext } from '@/lib/middleware/logging'
import { ErrorHandler } from '@/lib/error-handler'

export async function GET(request: NextRequest) {
  const context = getRequestContext(request)
  const startTime = Date.now()

  try {
    // Verify admin session
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
      return ErrorHandler.handleError(
        ErrorHandler.createAuthenticationError('Admin access required'),
        { ...context, route: '/api/admin/inquiries', operation: 'authentication' }
      )
    }

    Logger.apiLog({
      level: LogLevel.INFO,
      category: LogCategory.API,
      message: 'Admin inquiries fetch request',
      requestId: context.requestId,
      method: context.method,
      url: context.url,
      ip: context.ip,
      userAgent: context.userAgent,
      statusCode: 0,
      responseTime: 0,
      metadata: {
        adminUserId: session.user.id,
        timestamp: new Date().toISOString()
      }
    })

    // Fetch all inquiries with sorting
    const dbStartTime = Date.now()
    const inquiries = await prisma.inquiry.findMany({
      orderBy: [
        { status: 'asc' }, // NEW first
        { priority: 'desc' }, // URGENT first
        { createdAt: 'desc' } // Latest first
      ]
    })
    const dbQueryTime = Date.now() - dbStartTime

    Logger.databaseLog({
      level: LogLevel.INFO,
      category: LogCategory.DATABASE,
      message: 'Admin inquiries fetched successfully',
      requestId: context.requestId,
      operation: 'READ',
      table: 'Inquiry',
      queryTime: dbQueryTime,
      rowsAffected: inquiries.length,
      metadata: {
        adminUserId: session.user.id,
        inquiryCount: inquiries.length
      }
    })

    const totalResponseTime = Date.now() - startTime

    Logger.apiLog({
      level: LogLevel.INFO,
      category: LogCategory.API,
      message: 'Admin inquiries fetched successfully',
      requestId: context.requestId,
      method: context.method,
      url: context.url,
      ip: context.ip,
      userAgent: context.userAgent,
      statusCode: 200,
      responseTime: totalResponseTime,
      metadata: {
        adminUserId: session.user.id,
        inquiryCount: inquiries.length,
        dbQueryTime
      }
    })

    const response = NextResponse.json({
      success: true,
      inquiries,
      total: inquiries.length,
      timestamp: new Date().toISOString()
    })

    response.headers.set('x-request-id', context.requestId)
    return response

  } catch (error) {
    const totalResponseTime = Date.now() - startTime

    Logger.errorLog({
      level: LogLevel.ERROR,
      category: LogCategory.ERROR,
      message: 'Error fetching admin inquiries',
      requestId: context.requestId,
      error: {
        name: error instanceof Error ? error.name : 'UnknownError',
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      },
      context: {
        route: '/api/admin/inquiries',
        operation: 'fetch_inquiries',
        metadata: {
          responseTime: totalResponseTime,
          ip: context.ip,
          userAgent: context.userAgent
        }
      }
    })

    return ErrorHandler.handleError(error, {
      ...context,
      route: '/api/admin/inquiries',
      operation: 'fetch_inquiries'
    })
  }
}