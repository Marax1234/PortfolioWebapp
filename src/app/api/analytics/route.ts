/**
 * Analytics API Endpoints
 * GET /api/analytics - Fetch analytics dashboard data with admin authentication
 */
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

import { authOptions } from '@/lib/auth';
import { AnalyticsQueries } from '@/lib/db-utils';
import { ErrorHandler } from '@/lib/error-handler';
import { LogCategory, LogLevel, Logger } from '@/lib/logger';
import { getRequestContext } from '@/lib/middleware/logging';

export async function GET(request: NextRequest) {
  const context = getRequestContext(request);
  const startTime = Date.now();

  try {
    // Check admin authentication
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      Logger.securityLog({
        level: LogLevel.WARN,
        category: LogCategory.SECURITY,
        message: 'Unauthorized analytics access attempt',
        eventType: 'UNAUTHORIZED_ACCESS',
        severity: 'HIGH',
        requestId: context.requestId,
        userId: session?.user?.id,
        ip: context.ip,
        userAgent: context.userAgent,
        details: {
          route: '/api/analytics',
          hasSession: !!session,
          userRole: session?.user?.role || 'none',
          timestamp: new Date().toISOString(),
        },
      });

      return NextResponse.json(
        { success: false, error: 'Unauthorized access' },
        { status: 401 }
      );
    }

    // Log incoming request
    Logger.apiLog({
      level: LogLevel.INFO,
      category: LogCategory.API,
      message: `Analytics data fetch request`,
      requestId: context.requestId,
      method: context.method,
      url: context.url,
      ip: context.ip,
      userAgent: context.userAgent,
      statusCode: 0,
      responseTime: 0,
      metadata: {
        adminUser: session.user.email,
        searchParams: context.searchParams,
        timestamp: new Date().toISOString(),
      },
    });

    const { searchParams } = new URL(request.url);

    // Parse query parameters
    const period = searchParams.get('period');
    const startDateParam = searchParams.get('startDate');
    const endDateParam = searchParams.get('endDate');

    // Validate and parse dates
    let startDate: Date | undefined;
    let endDate: Date | undefined;

    if (startDateParam) {
      startDate = new Date(startDateParam);
      if (isNaN(startDate.getTime())) {
        const error = ErrorHandler.createValidationError(
          'Invalid startDate format',
          { startDate: startDateParam }
        );
        return ErrorHandler.handleError(error, {
          ...context,
          route: '/api/analytics',
          operation: 'validation',
          inputData: {
            startDate: startDateParam,
            endDate: endDateParam,
            period,
          },
        });
      }
    }

    if (endDateParam) {
      endDate = new Date(endDateParam);
      if (isNaN(endDate.getTime())) {
        const error = ErrorHandler.createValidationError(
          'Invalid endDate format',
          { endDate: endDateParam }
        );
        return ErrorHandler.handleError(error, {
          ...context,
          route: '/api/analytics',
          operation: 'validation',
          inputData: {
            startDate: startDateParam,
            endDate: endDateParam,
            period,
          },
        });
      }
    }

    // Handle period-based queries
    if (period && !startDate && !endDate) {
      const periodDays = {
        '7d': 7,
        '30d': 30,
        '90d': 90,
        '1y': 365,
      }[period];

      if (!periodDays) {
        const error = ErrorHandler.createValidationError(
          'Invalid period value',
          { period }
        );
        return ErrorHandler.handleError(error, {
          ...context,
          route: '/api/analytics',
          operation: 'validation',
          inputData: { period },
        });
      }

      endDate = new Date();
      startDate = new Date(
        endDate.getTime() - periodDays * 24 * 60 * 60 * 1000
      );
    }

    // Log database query start
    const dbStartTime = Date.now();
    Logger.databaseLog({
      level: LogLevel.INFO,
      category: LogCategory.DATABASE,
      message: 'Fetching analytics dashboard data',
      requestId: context.requestId,
      operation: 'READ',
      table: 'AnalyticsEvent, PortfolioItem, Category',
      queryTime: 0,
      metadata: {
        filters: {
          startDate: startDate?.toISOString(),
          endDate: endDate?.toISOString(),
          period,
        },
      },
    });

    // Fetch analytics data
    const analyticsData = await AnalyticsQueries.getDashboardAnalytics({
      startDate,
      endDate,
    });

    const dbQueryTime = Date.now() - dbStartTime;
    const totalResponseTime = Date.now() - startTime;

    // Log database query completion
    Logger.databaseLog({
      level: LogLevel.INFO,
      category: LogCategory.DATABASE,
      message: 'Analytics dashboard data fetched successfully',
      requestId: context.requestId,
      operation: 'READ',
      table: 'AnalyticsEvent, PortfolioItem, Category',
      queryTime: dbQueryTime,
      rowsAffected: analyticsData.timeRangeStats.totalEvents,
      metadata: {
        totalViews: analyticsData.overview.totalViews,
        uniqueVisitors: analyticsData.overview.uniqueVisitors,
        topContentCount: analyticsData.topContent.length,
        trafficSourcesCount: analyticsData.trafficSources.length,
      },
    });

    // Log successful response
    Logger.apiLog({
      level: LogLevel.INFO,
      category: LogCategory.API,
      message: `Analytics dashboard data fetched successfully`,
      requestId: context.requestId,
      method: context.method,
      url: context.url,
      ip: context.ip,
      userAgent: context.userAgent,
      statusCode: 200,
      responseTime: totalResponseTime,
      metadata: {
        adminUser: session.user.email,
        dataPoints: {
          totalViews: analyticsData.overview.totalViews,
          uniqueVisitors: analyticsData.overview.uniqueVisitors,
          portfolioItems: analyticsData.overview.totalPortfolioItems,
          categories: analyticsData.overview.totalCategories,
        },
        timeRange: {
          startDate: analyticsData.timeRangeStats.startDate,
          endDate: analyticsData.timeRangeStats.endDate,
          totalEvents: analyticsData.timeRangeStats.totalEvents,
        },
        dbQueryTime,
        cached: false,
      },
    });

    const response = NextResponse.json({
      success: true,
      data: analyticsData,
    });

    // Add request ID to response headers for client tracking
    response.headers.set('x-request-id', context.requestId);

    return response;
  } catch (error) {
    const totalResponseTime = Date.now() - startTime;

    // Log the error with context
    Logger.errorLog({
      level: LogLevel.ERROR,
      category: LogCategory.ERROR,
      message: 'Error fetching analytics data',
      requestId: context.requestId,
      responseTime: totalResponseTime,
      error: {
        name: error instanceof Error ? error.name : 'UnknownError',
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      },
      context: {
        route: '/api/analytics',
        operation: 'fetch_analytics_data',
        inputData: context.searchParams,
      },
    });

    return ErrorHandler.handleError(error, {
      ...context,
      route: '/api/analytics',
      operation: 'fetch_analytics_data',
      inputData: context.searchParams,
    });
  }
}
