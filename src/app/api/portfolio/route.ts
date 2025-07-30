/**
 * Portfolio API Endpoints
 * GET /api/portfolio - Fetch portfolio items with filtering and pagination
 */
import { NextRequest, NextResponse } from 'next/server';

import { z } from 'zod';

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
      message: `Portfolio items fetch request`,
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
    Logger.debug('Parsed portfolio query parameters', {
      requestId: context.requestId,
      page,
      limit,
      category,
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
        route: '/api/portfolio',
        operation: 'validation',
        inputData: { page, limit, category, featured, orderBy, orderDirection },
      });
    }

    if (limit < 1) {
      const error = ErrorHandler.createValidationError(
        'Limit must be greater than 0',
        { limit }
      );
      return ErrorHandler.handleError(error, {
        ...context,
        route: '/api/portfolio',
        operation: 'validation',
        inputData: { page, limit, category, featured, orderBy, orderDirection },
      });
    }

    // Log database query start
    const dbStartTime = Date.now();
    Logger.databaseLog({
      level: LogLevel.INFO,
      category: LogCategory.DATABASE,
      message: 'Fetching portfolio items',
      requestId: context.requestId,
      operation: 'READ',
      table: 'PortfolioItem',
      queryTime: 0,
      metadata: {
        filters: { page, limit, category, featured, orderBy, orderDirection },
      },
    });

    // Fetch portfolio items
    const result = await PortfolioQueries.getPublishedItems({
      page,
      limit,
      category,
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
      message: 'Portfolio items fetched successfully',
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
      message: `Portfolio items fetched successfully`,
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

    // Log performance if query is slow
    if (totalResponseTime > 1000) {
      Logger.performanceLog({
        level: LogLevel.WARN,
        category: LogCategory.PERFORMANCE,
        message: `Slow portfolio query detected`,
        requestId: context.requestId,
        metrics: {
          responseTime: totalResponseTime,
          dbQueryTime,
          dbQueryCount: 1,
          memoryUsage: process.memoryUsage().heapUsed,
        },
        metadata: {
          filters: { page, limit, category, featured, orderBy, orderDirection },
          itemCount: result.items.length,
        },
      });
    }

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
      message: 'Error fetching portfolio items',
      requestId: context.requestId,
      error: {
        name: error instanceof Error ? error.name : 'UnknownError',
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      },
      context: {
        route: '/api/portfolio',
        operation: 'fetch_portfolio_items',
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
      route: '/api/portfolio',
      operation: 'fetch_portfolio_items',
      inputData: context.searchParams,
    });
  }
}

// Portfolio item creation validation schema
const createPortfolioSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().max(500).nullable().optional(),
  mediaType: z.enum(['IMAGE', 'VIDEO']),
  filePath: z.string().min(1),
  thumbnailPath: z.string().nullable().optional(),
  webpPath: z.string().nullable().optional(),
  avifPath: z.string().nullable().optional(),
  categoryId: z.string().nullable().optional(),
  status: z.enum(['DRAFT', 'REVIEW', 'PUBLISHED', 'ARCHIVED']).default('DRAFT'),
  featured: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
  metadata: z.any().nullable().optional(),
  sortOrder: z.number().default(0),
});

export async function POST(request: NextRequest) {
  const context = getRequestContext(request);
  const startTime = Date.now();

  try {
    Logger.apiLog({
      level: LogLevel.INFO,
      category: LogCategory.API,
      message: 'Portfolio item creation request',
      requestId: context.requestId,
      method: context.method,
      url: context.url,
      ip: context.ip,
      userAgent: context.userAgent,
      statusCode: 0,
      responseTime: 0,
      metadata: {
        timestamp: new Date().toISOString(),
      },
    });

    // Parse request body
    const body = await request.json();
    console.log('Received request body:', JSON.stringify(body, null, 2));

    // Validate request data
    try {
      const validationResult = createPortfolioSchema.safeParse(body);
      console.log('Validation result:', {
        success: validationResult.success,
        error: validationResult.error,
        errorType: validationResult.error?.constructor?.name,
        issues: validationResult.error?.issues,
        errors: validationResult.error?.errors,
      });
    } catch (zodError) {
      console.log('Zod parsing threw error:', zodError);
      throw zodError;
    }

    // Run validation again for actual use
    const validationResult = createPortfolioSchema.safeParse(body);

    if (!validationResult.success) {
      const errorDetails = validationResult.error?.errors || [];
      const errors = errorDetails
        .map(err => `${err.path.join('.')}: ${err.message}`)
        .join(', ');

      console.log('Validation failed:', { errors: errorDetails, body });

      const error = ErrorHandler.createValidationError(
        `Invalid portfolio data: ${errors}`,
        {
          validationErrors: errorDetails,
        }
      );

      return ErrorHandler.handleError(error, {
        ...context,
        route: '/api/portfolio',
        operation: 'validation',
        inputData: body,
      });
    }

    const portfolioData = validationResult.data;

    Logger.debug('Creating portfolio item', {
      requestId: context.requestId,
      title: portfolioData.title,
      mediaType: portfolioData.mediaType,
      categoryId: portfolioData.categoryId,
      status: portfolioData.status,
    });

    // Log database operation start
    const dbStartTime = Date.now();
    Logger.databaseLog({
      level: LogLevel.INFO,
      category: LogCategory.DATABASE,
      message: 'Creating portfolio item',
      requestId: context.requestId,
      operation: 'CREATE',
      table: 'PortfolioItem',
      queryTime: 0,
      metadata: {
        title: portfolioData.title,
        mediaType: portfolioData.mediaType,
      },
    });

    // Create portfolio item in database
    const newItem = await PortfolioQueries.createPortfolioItem({
      title: portfolioData.title,
      description: portfolioData.description || null,
      mediaType: portfolioData.mediaType,
      filePath: portfolioData.filePath,
      thumbnailPath: portfolioData.thumbnailPath || null,
      categoryId: portfolioData.categoryId || null,
      status: portfolioData.status,
      featured: portfolioData.featured,
      tags: JSON.stringify(portfolioData.tags),
      metadata: JSON.stringify(portfolioData.metadata || {}),
      sortOrder: portfolioData.sortOrder,
      viewCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      publishedAt:
        portfolioData.status === 'PUBLISHED' ? new Date().toISOString() : null,
    });

    const dbQueryTime = Date.now() - dbStartTime;

    Logger.databaseLog({
      level: LogLevel.INFO,
      category: LogCategory.DATABASE,
      message: 'Portfolio item created successfully',
      requestId: context.requestId,
      operation: 'CREATE',
      table: 'PortfolioItem',
      queryTime: dbQueryTime,
      rowsAffected: 1,
      metadata: {
        portfolioId: newItem.id,
        title: newItem.title,
        status: newItem.status,
      },
    });

    const totalResponseTime = Date.now() - startTime;

    Logger.apiLog({
      level: LogLevel.INFO,
      category: LogCategory.API,
      message: 'Portfolio item created successfully',
      requestId: context.requestId,
      method: context.method,
      url: context.url,
      ip: context.ip,
      userAgent: context.userAgent,
      statusCode: 201,
      responseTime: totalResponseTime,
      metadata: {
        portfolioId: newItem.id,
        title: newItem.title,
        mediaType: newItem.mediaType,
        dbQueryTime,
      },
    });

    const response = NextResponse.json(
      {
        success: true,
        data: {
          ...newItem,
          tags: JSON.parse(newItem.tags),
          metadata: JSON.parse(newItem.metadata || '{}'),
        },
      },
      { status: 201 }
    );

    response.headers.set('x-request-id', context.requestId);
    return response;
  } catch (error) {
    const totalResponseTime = Date.now() - startTime;

    Logger.errorLog({
      level: LogLevel.ERROR,
      category: LogCategory.ERROR,
      message: 'Error creating portfolio item',
      requestId: context.requestId,
      error: {
        name: error instanceof Error ? error.name : 'UnknownError',
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      },
      context: {
        route: '/api/portfolio',
        operation: 'create_portfolio_item',
        inputData: request.body,
        metadata: {
          responseTime: totalResponseTime,
          ip: context.ip,
          userAgent: context.userAgent,
        },
      },
    });

    return ErrorHandler.handleError(error, {
      ...context,
      route: '/api/portfolio',
      operation: 'create_portfolio_item',
    });
  }
}
