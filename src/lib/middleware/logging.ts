/**
 * Request Logging Middleware
 * Captures request/response data with performance metrics and request tracking
 */
import { NextRequest, NextResponse } from 'next/server';

import { LogCategory, LogLevel, Logger } from '../logger';

/**
 * Request context interface for tracking across the request lifecycle
 */
export interface RequestContext {
  requestId: string;
  startTime: number;
  ip: string;
  userAgent: string;
  method: string;
  url: string;
  pathname: string;
  searchParams: Record<string, string>;
  userId?: string;
  sessionId?: string;
  size?: number;
}

/**
 * Request logging utility for Next.js API routes and middleware
 */
export class RequestLogger {
  /**
   * Create request context from Next.js request
   */
  static createContext(request: NextRequest): RequestContext {
    const requestId = Logger.generateRequestId();
    const url = new URL(request.url);

    // Extract search params as object
    const searchParams: Record<string, string> = {};
    url.searchParams.forEach((value, key) => {
      searchParams[key] = value;
    });

    // Get client IP (considering various proxy headers)
    const ip = this.getClientIP(request);

    return {
      requestId,
      startTime: Date.now(),
      ip,
      userAgent: request.headers.get('user-agent') || 'unknown',
      method: request.method,
      url: request.url,
      pathname: url.pathname,
      searchParams,
      size: this.getRequestSize(request),
    };
  }

  /**
   * Extract client IP address considering proxy headers
   */
  private static getClientIP(request: NextRequest): string {
    // Check various headers that might contain the real IP
    const headers = [
      'x-forwarded-for',
      'x-real-ip',
      'x-client-ip',
      'cf-connecting-ip', // Cloudflare
      'true-client-ip', // Cloudflare Enterprise
      'x-cluster-client-ip',
    ];

    for (const header of headers) {
      const value = request.headers.get(header);
      if (value) {
        // x-forwarded-for can contain multiple IPs, take the first one
        const ip = value.split(',')[0].trim();
        if (this.isValidIP(ip)) {
          return ip;
        }
      }
    }

    // Fallback to connection remote address or unknown
    return request.ip || 'unknown';
  }

  /**
   * Basic IP validation
   */
  private static isValidIP(ip: string): boolean {
    const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
    const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
    return ipv4Regex.test(ip) || ipv6Regex.test(ip);
  }

  /**
   * Estimate request size from headers and body
   */
  private static getRequestSize(request: NextRequest): number {
    const contentLength = request.headers.get('content-length');
    if (contentLength) {
      return parseInt(contentLength, 10);
    }

    // Fallback: estimate from headers
    let size = 0;
    request.headers.forEach((value, key) => {
      size += key.length + value.length + 4; // +4 for ': ' and '\r\n'
    });

    return size;
  }

  /**
   * Log incoming request
   */
  static logRequest(context: RequestContext) {
    const { requestId, method, pathname, ip, userAgent, searchParams, size } =
      context;

    Logger.apiLog({
      level: LogLevel.INFO,
      category: LogCategory.API,
      message: `${method} ${pathname} - Incoming request`,
      requestId,
      method,
      url: context.url,
      ip,
      userAgent,
      statusCode: 0, // Not yet available
      responseTime: 0, // Not yet available
      metadata: {
        searchParams:
          Object.keys(searchParams).length > 0 ? searchParams : undefined,
        requestSize: size,
        timestamp: new Date().toISOString(),
      },
    });
  }

  /**
   * Log outgoing response with performance metrics
   */
  static logResponse(
    context: RequestContext,
    response: NextResponse,
    error?: Error
  ) {
    const endTime = Date.now();
    const responseTime = endTime - context.startTime;
    const statusCode = response.status;

    // Determine log level based on status code
    let level = LogLevel.INFO;
    if (statusCode >= 400 && statusCode < 500) {
      level = LogLevel.WARN;
    } else if (statusCode >= 500) {
      level = LogLevel.ERROR;
    }

    // Get response size
    const responseSize = this.getResponseSize(response);

    Logger.apiLog({
      level,
      category: LogCategory.API,
      message: `${context.method} ${context.pathname} - ${statusCode} ${this.getStatusText(statusCode)}`,
      requestId: context.requestId,
      userId: context.userId,
      sessionId: context.sessionId,
      ip: context.ip,
      userAgent: context.userAgent,
      method: context.method,
      url: context.url,
      statusCode,
      responseTime,
      metadata: {
        responseSize,
        requestSize: context.size,
        error: error
          ? {
              name: error.name,
              message: error.message,
              stack: error.stack,
            }
          : undefined,
        performance: {
          slow: responseTime > 1000, // Flag slow requests
          category: this.getPerformanceCategory(responseTime),
        },
      },
    });

    // Log performance metrics for monitoring
    if (responseTime > 500) {
      // Log performance for requests > 500ms
      Logger.performanceLog({
        level: LogLevel.INFO,
        category: LogCategory.PERFORMANCE,
        message: `Slow request detected: ${context.method} ${context.pathname}`,
        requestId: context.requestId,
        metrics: {
          responseTime,
          memoryUsage: this.getMemoryUsage(),
          dbQueryTime: 0, // Will be populated by DB logging
          dbQueryCount: 0, // Will be populated by DB logging
        },
      });
    }
  }

  /**
   * Get response size from headers
   */
  private static getResponseSize(response: NextResponse): number {
    const contentLength = response.headers.get('content-length');
    if (contentLength) {
      return parseInt(contentLength, 10);
    }
    return 0;
  }

  /**
   * Get HTTP status text
   */
  private static getStatusText(statusCode: number): string {
    const statusTexts: { [key: number]: string } = {
      200: 'OK',
      201: 'Created',
      204: 'No Content',
      400: 'Bad Request',
      401: 'Unauthorized',
      403: 'Forbidden',
      404: 'Not Found',
      422: 'Unprocessable Entity',
      429: 'Too Many Requests',
      500: 'Internal Server Error',
      502: 'Bad Gateway',
      503: 'Service Unavailable',
    };
    return statusTexts[statusCode] || 'Unknown';
  }

  /**
   * Categorize response time performance
   */
  private static getPerformanceCategory(responseTime: number): string {
    if (responseTime < 100) return 'excellent';
    if (responseTime < 300) return 'good';
    if (responseTime < 1000) return 'acceptable';
    if (responseTime < 3000) return 'slow';
    return 'critical';
  }

  /**
   * Get current memory usage
   */
  private static getMemoryUsage(): number {
    if (typeof process !== 'undefined' && process.memoryUsage) {
      return process.memoryUsage().heapUsed;
    }
    return 0;
  }

  /**
   * Log security events during request processing
   */
  static logSecurityEvent(
    context: RequestContext,
    eventType:
      | 'UNAUTHORIZED_ACCESS'
      | 'PERMISSION_DENIED'
      | 'SUSPICIOUS_ACTIVITY'
      | 'RATE_LIMITED',
    details?: Record<string, any>
  ) {
    const severity = eventType === 'SUSPICIOUS_ACTIVITY' ? 'HIGH' : 'MEDIUM';

    Logger.securityLog({
      level: LogLevel.WARN,
      category: LogCategory.SECURITY,
      message: `Security event: ${eventType} for ${context.method} ${context.pathname}`,
      eventType,
      severity,
      requestId: context.requestId,
      ip: context.ip,
      userAgent: context.userAgent,
      method: context.method,
      url: context.url,
      details: {
        ...details,
        timestamp: new Date().toISOString(),
      },
    });
  }

  /**
   * Create a wrapped API handler with automatic request/response logging
   */
  static withLogging<T extends any[], R>(
    handler: (...args: T) => Promise<NextResponse>,
    options?: {
      skipRequestLog?: boolean;
      skipResponseLog?: boolean;
      logBody?: boolean;
    }
  ) {
    return async (
      request: NextRequest,
      ...args: any[]
    ): Promise<NextResponse> => {
      const context = this.createContext(request);

      // Add request ID to headers for downstream services
      const headers = new Headers();
      headers.set('x-request-id', context.requestId);

      if (!options?.skipRequestLog) {
        this.logRequest(context);
      }

      let response: NextResponse;
      let error: Error | undefined;

      try {
        // Call the original handler
        response = await handler(request, ...args);

        // Add request ID to response headers
        response.headers.set('x-request-id', context.requestId);
      } catch (err) {
        error = err instanceof Error ? err : new Error(String(err));

        // Create error response
        response = NextResponse.json(
          {
            success: false,
            error: 'Internal server error',
            requestId: context.requestId,
          },
          {
            status: 500,
            headers: { 'x-request-id': context.requestId },
          }
        );
      }

      if (!options?.skipResponseLog) {
        this.logResponse(context, response, error);
      }

      return response;
    };
  }
}

/**
 * Middleware function to add request ID to all requests
 */
export function addRequestId(request: NextRequest): NextResponse {
  const requestId = Logger.generateRequestId();
  const response = NextResponse.next();

  // Add request ID to response headers
  response.headers.set('x-request-id', requestId);

  return response;
}

/**
 * Extract request context from Next.js request for use in API routes
 */
export function getRequestContext(request: NextRequest): RequestContext {
  return RequestLogger.createContext(request);
}

export default RequestLogger;
