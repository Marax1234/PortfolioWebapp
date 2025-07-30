/**
 * Admin Portfolio API Endpoints
 * GET /api/admin/portfolio - Fetch ALL portfolio items (including DRAFT, REVIEW, etc.)
 */
import { NextRequest, NextResponse } from 'next/server';

import { PortfolioQueries } from '@/lib/db-utils';
import { ErrorHandler } from '@/lib/error-handler';
import { LogCategory, LogLevel, Logger } from '@/lib/logger';
import { RequestLogger, getRequestContext } from '@/lib/middleware/logging';

export async function GET(request: NextRequest) {
  const context = getRequestContext(request);
  const startTime = Date.now();

  try {
    // Log incoming request
    Logger.apiLog({
      level: LogLevel.INFO,
      category: LogCategory.API,
      message: `Admin portfolio items fetch request`,
      requestId: context.requestId,
      method: context.method,
      url: context.url,
      ip: context.ip,
      userAgent: context.userAgent,
      statusCode: 0,
      responseTime: 0,
      metadata: {
        searchParams: context.searchParams,
        timestamp: new Date().toISOString(),
      },
    });

    const { searchParams } = new URL(request.url);

    // Parse query parameters
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '12'), 50); // Max 50 items per page
    const category = searchParams.get('category') || undefined;
    const status =
      (searchParams.get('status') as
        | 'DRAFT'
        | 'REVIEW'
        | 'PUBLISHED'
        | 'ARCHIVED') || undefined;
    const featured = searchParams.get('featured') === 'true' ? true : undefined;
    const orderBy =
      (searchParams.get('orderBy') as
        | 'createdAt'
        | 'publishedAt'
        | 'viewCount'
        | 'title') || 'createdAt';
    const orderDirection =
      (searchParams.get('orderDirection') as 'asc' | 'desc') || 'desc';

    // Log parsed parameters
    Logger.debug('Parsed admin portfolio query parameters', {
      requestId: context.requestId,
      page,
      limit,
      category,
      status,
      featured,
      orderBy,
      orderDirection,
    });

    // Validate parameters
    if (page < 1) {
      const error = ErrorHandler.createValidationError(
        'Page must be greater than 0',
        { page }
      );
      return ErrorHandler.handleError(error, {
        ...context,
        route: '/api/admin/portfolio',
        operation: 'validation',
        inputData: {
          page,
          limit,
          category,
          status,
          featured,
          orderBy,
          orderDirection,
        },
      });
    }

    if (limit < 1) {
      const error = ErrorHandler.createValidationError(
        'Limit must be greater than 0',
        { limit }
      );
      return ErrorHandler.handleError(error, {
        ...context,
        route: '/api/admin/portfolio',
        operation: 'validation',
        inputData: {
          page,
          limit,
          category,
          status,
          featured,
          orderBy,
          orderDirection,
        },
      });
    }

    // Log database query start
    const dbStartTime = Date.now();
    Logger.databaseLog({
      level: LogLevel.INFO,
      category: LogCategory.DATABASE,
      message: 'Fetching admin portfolio items',
      requestId: context.requestId,
      operation: 'READ',
      table: 'PortfolioItem',
      queryTime: 0,
      metadata: {
        filters: {
          page,
          limit,
          category,
          status,
          featured,
          orderBy,
          orderDirection,
        },
      },
    });

    // Fetch ALL portfolio items (not just published)
    const result = await PortfolioQueries.getAllItems({
      page,
      limit,
      category,
      status,
      featured,
      orderBy,
      orderDirection,
    });

    const dbQueryTime = Date.now() - dbStartTime;
    const totalResponseTime = Date.now() - startTime;

    // Log database query completion
    Logger.databaseLog({
      level: LogLevel.INFO,
      category: LogCategory.DATABASE,
      message: 'Admin portfolio items fetched successfully',
      requestId: context.requestId,
      operation: 'READ',
      table: 'PortfolioItem',
      queryTime: dbQueryTime,
      rowsAffected: result.items.length,
      metadata: {
        totalItems: result.pagination.total,
        pagesRemaining: result.pagination.totalPages - page,
      },
    });

    // Log successful response
    Logger.apiLog({
      level: LogLevel.INFO,
      category: LogCategory.API,
      message: `Admin portfolio items fetched successfully`,
      requestId: context.requestId,
      method: context.method,
      url: context.url,
      ip: context.ip,
      userAgent: context.userAgent,
      statusCode: 200,
      responseTime: totalResponseTime,
      metadata: {
        itemsReturned: result.items.length,
        totalItems: result.pagination.total,
        currentPage: page,
        dbQueryTime,
        cached: false,
      },
    });

    const response = NextResponse.json({
      success: true,
      data: result.items,
      pagination: result.pagination,
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
      message: 'Error fetching admin portfolio items',
      requestId: context.requestId,
      error: {
        name: error instanceof Error ? error.name : 'UnknownError',
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      },
      context: {
        route: '/api/admin/portfolio',
        operation: 'fetch_admin_portfolio_items',
        inputData: context.searchParams,
        metadata: {
          responseTime: totalResponseTime,
          ip: context.ip,
          userAgent: context.userAgent,
        },
      },
    });

    return ErrorHandler.handleError(error, {
      ...context,
      route: '/api/admin/portfolio',
      operation: 'fetch_admin_portfolio_items',
      inputData: context.searchParams,
    });
  }
}
