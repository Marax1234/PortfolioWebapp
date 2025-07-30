/**
 * Single Portfolio Item API Endpoint
 * GET /api/portfolio/[id] - Fetch single portfolio item by ID
 */
import { NextRequest, NextResponse } from 'next/server';

import { PortfolioQueries } from '@/lib/db-utils';
import { ErrorHandler } from '@/lib/error-handler';
import { LogCategory, LogLevel, Logger } from '@/lib/logger';
import { getRequestContext } from '@/lib/middleware/logging';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const context = getRequestContext(request);
  const startTime = Date.now();
  let portfolioId: string | undefined;

  try {
    const { id } = await params;
    portfolioId = id;

    // Log incoming request
    Logger.apiLog({
      level: LogLevel.INFO,
      category: LogCategory.API,
      message: `Portfolio item fetch request`,
      requestId: context.requestId,
      method: context.method,
      url: context.url,
      ip: context.ip,
      userAgent: context.userAgent,
      statusCode: 0,
      responseTime: 0,
      metadata: {
        portfolioId: id,
        timestamp: new Date().toISOString(),
      },
    });

    // Validate ID parameter
    if (!id || typeof id !== 'string') {
      const error = ErrorHandler.createValidationError(
        'Valid portfolio item ID is required',
        { id }
      );
      return ErrorHandler.handleError(error, {
        ...context,
        route: '/api/portfolio/[id]',
        operation: 'validation',
        inputData: { id },
      });
    }

    // Log database query start
    const dbStartTime = Date.now();
    Logger.databaseLog({
      level: LogLevel.INFO,
      category: LogCategory.DATABASE,
      message: 'Fetching portfolio item by ID',
      requestId: context.requestId,
      operation: 'READ',
      table: 'PortfolioItem',
      queryTime: 0,
      metadata: {
        portfolioId: id,
      },
    });

    // Fetch portfolio item by ID
    const portfolioItem = await PortfolioQueries.getById(id);
    const dbQueryTime = Date.now() - dbStartTime;

    if (!portfolioItem) {
      // Log not found
      Logger.apiLog({
        level: LogLevel.WARN,
        category: LogCategory.API,
        message: `Portfolio item not found`,
        requestId: context.requestId,
        method: context.method,
        url: context.url,
        ip: context.ip,
        userAgent: context.userAgent,
        statusCode: 404,
        responseTime: Date.now() - startTime,
        metadata: {
          portfolioId: id,
          dbQueryTime,
        },
      });

      const error = ErrorHandler.createNotFoundError('Portfolio item');
      return ErrorHandler.handleError(error, {
        ...context,
        route: '/api/portfolio/[id]',
        operation: 'fetch_portfolio_item',
        inputData: { id },
      });
    }

    // Log successful item fetch
    Logger.databaseLog({
      level: LogLevel.INFO,
      category: LogCategory.DATABASE,
      message: 'Portfolio item fetched successfully',
      requestId: context.requestId,
      operation: 'READ',
      table: 'PortfolioItem',
      queryTime: dbQueryTime,
      rowsAffected: 1,
      metadata: {
        portfolioId: id,
        categoryId: portfolioItem.categoryId,
        status: portfolioItem.status,
      },
    });

    // Get related items if category exists
    let relatedItems: any[] = [];
    let relatedQueryTime = 0;

    if (portfolioItem.categoryId) {
      const relatedStartTime = Date.now();

      Logger.databaseLog({
        level: LogLevel.INFO,
        category: LogCategory.DATABASE,
        message: 'Fetching related portfolio items',
        requestId: context.requestId,
        operation: 'READ',
        table: 'PortfolioItem',
        queryTime: 0,
        metadata: {
          portfolioId: id,
          categoryId: portfolioItem.categoryId,
          limit: 4,
        },
      });

      relatedItems = await PortfolioQueries.getRelatedItems(
        portfolioItem.id,
        portfolioItem.categoryId,
        4
      );

      relatedQueryTime = Date.now() - relatedStartTime;

      Logger.databaseLog({
        level: LogLevel.INFO,
        category: LogCategory.DATABASE,
        message: 'Related portfolio items fetched',
        requestId: context.requestId,
        operation: 'READ',
        table: 'PortfolioItem',
        queryTime: relatedQueryTime,
        rowsAffected: relatedItems.length,
        metadata: {
          portfolioId: id,
          categoryId: portfolioItem.categoryId,
          relatedCount: relatedItems.length,
        },
      });
    }

    const totalResponseTime = Date.now() - startTime;
    const totalDbTime = dbQueryTime + relatedQueryTime;

    // Log successful response
    Logger.apiLog({
      level: LogLevel.INFO,
      category: LogCategory.API,
      message: `Portfolio item fetched successfully`,
      requestId: context.requestId,
      method: context.method,
      url: context.url,
      ip: context.ip,
      userAgent: context.userAgent,
      statusCode: 200,
      responseTime: totalResponseTime,
      metadata: {
        portfolioId: id,
        categoryId: portfolioItem.categoryId,
        relatedItemsCount: relatedItems.length,
        dbQueryTime: totalDbTime,
        cached: false,
      },
    });

    // Log performance if query is slow
    if (totalResponseTime > 500) {
      Logger.performanceLog({
        level: LogLevel.WARN,
        category: LogCategory.PERFORMANCE,
        message: `Slow portfolio item query detected`,
        requestId: context.requestId,
        metrics: {
          responseTime: totalResponseTime,
          dbQueryTime: totalDbTime,
          dbQueryCount: portfolioItem.categoryId ? 2 : 1,
          memoryUsage: process.memoryUsage().heapUsed,
        },
        metadata: {
          portfolioId: id,
          hasCategory: !!portfolioItem.categoryId,
          relatedItemsCount: relatedItems.length,
        },
      });
    }

    const response = NextResponse.json({
      success: true,
      data: {
        item: portfolioItem,
        relatedItems,
      },
    });

    // Add request ID to response headers
    response.headers.set('x-request-id', context.requestId);

    return response;
  } catch (error) {
    const totalResponseTime = Date.now() - startTime;

    // Log the error with context
    Logger.errorLog({
      level: LogLevel.ERROR,
      category: LogCategory.ERROR,
      message: 'Error fetching portfolio item',
      requestId: context.requestId,
      error: {
        name: error instanceof Error ? error.name : 'UnknownError',
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      },
      context: {
        route: '/api/portfolio/[id]',
        operation: 'fetch_portfolio_item',
        inputData: { id: portfolioId },
        metadata: {
          responseTime: totalResponseTime,
          ip: context.ip,
          userAgent: context.userAgent,
        },
      },
    });

    return ErrorHandler.handleError(error, {
      ...context,
      route: '/api/portfolio/[id]',
      operation: 'fetch_portfolio_item',
      inputData: { id: portfolioId },
    });
  }
}
