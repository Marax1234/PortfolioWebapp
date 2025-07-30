/**
 * Enhanced Error Handler with Structured Logging
 * Provides consistent error handling and logging across all API routes
 */
import { NextResponse } from 'next/server';

import { Prisma } from '@prisma/client';
import { ZodError } from 'zod';

import { LogCategory, LogLevel, Logger } from './logger';

/**
 * Standard error response interface
 */
export interface ErrorResponse {
  success: false;
  error: string;
  code?: string;
  details?: Record<string, any>;
  requestId?: string;
  timestamp: string;
}

/**
 * Application error types
 */
export enum ErrorType {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR = 'AUTHORIZATION_ERROR',
  NOT_FOUND_ERROR = 'NOT_FOUND_ERROR',
  CONFLICT_ERROR = 'CONFLICT_ERROR',
  RATE_LIMIT_ERROR = 'RATE_LIMIT_ERROR',
  DATABASE_ERROR = 'DATABASE_ERROR',
  EXTERNAL_SERVICE_ERROR = 'EXTERNAL_SERVICE_ERROR',
  FILE_UPLOAD_ERROR = 'FILE_UPLOAD_ERROR',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
}

/**
 * Custom application error class
 */
export class AppError extends Error {
  public readonly type: ErrorType;
  public readonly statusCode: number;
  public readonly code?: string;
  public readonly details?: Record<string, any>;
  public readonly isOperational: boolean;

  constructor(
    message: string,
    type: ErrorType,
    statusCode: number = 500,
    code?: string,
    details?: Record<string, any>,
    isOperational: boolean = true
  ) {
    super(message);
    this.name = 'AppError';
    this.type = type;
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.isOperational = isOperational;

    // Capture stack trace
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Error context for logging
 */
export interface ErrorContext {
  requestId?: string;
  userId?: string;
  ip?: string;
  userAgent?: string;
  method?: string;
  url?: string;
  route?: string;
  operation?: string;
  inputData?: Record<string, any>;
  metadata?: Record<string, any>;
}

/**
 * Enhanced error handler class
 */
export class ErrorHandler {
  /**
   * Handle and log errors with appropriate response
   */
  static async handleError(
    error: unknown,
    context?: ErrorContext
  ): Promise<NextResponse<ErrorResponse>> {
    const errorInfo = this.analyzeError(error);
    const requestId = context?.requestId || Logger.generateRequestId();

    // Log the error with full context
    Logger.errorLog({
      level: LogLevel.ERROR,
      category: LogCategory.ERROR,
      message: `${errorInfo.type}: ${errorInfo.message}`,
      requestId,
      userId: context?.userId,
      ip: context?.ip,
      userAgent: context?.userAgent,
      method: context?.method,
      url: context?.url,
      error: {
        name: errorInfo.name,
        message: errorInfo.message,
        stack: errorInfo.stack,
        code: errorInfo.code,
      },
      context: {
        route: context?.route,
        operation: context?.operation,
        inputData: this.sanitizeInputData(context?.inputData),
        metadata: context?.metadata,
      },
    });

    // Create standardized error response
    const errorResponse: ErrorResponse = {
      success: false,
      error: errorInfo.publicMessage,
      code: errorInfo.code,
      details: errorInfo.publicDetails,
      requestId,
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(errorResponse, {
      status: errorInfo.statusCode,
      headers: {
        'x-request-id': requestId,
        'content-type': 'application/json',
      },
    });
  }

  /**
   * Analyze error and extract relevant information
   */
  private static analyzeError(error: unknown): {
    name: string;
    message: string;
    stack?: string;
    type: ErrorType;
    statusCode: number;
    code?: string;
    publicMessage: string;
    publicDetails?: Record<string, any>;
  } {
    // Handle custom AppError
    if (error instanceof AppError) {
      return {
        name: error.name,
        message: error.message,
        stack: error.stack,
        type: error.type,
        statusCode: error.statusCode,
        code: error.code,
        publicMessage: error.message,
        publicDetails: error.details,
      };
    }

    // Handle Zod validation errors
    if (error instanceof ZodError) {
      const details = (error.errors || []).reduce(
        (acc, err) => {
          acc[err.path.join('.')] = err.message;
          return acc;
        },
        {} as Record<string, string>
      );

      return {
        name: 'ZodError',
        message: 'Validation failed',
        stack: error.stack,
        type: ErrorType.VALIDATION_ERROR,
        statusCode: 400,
        code: 'VALIDATION_FAILED',
        publicMessage: 'Request validation failed',
        publicDetails: { fields: details },
      };
    }

    // Handle Prisma errors
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return this.handlePrismaError(error);
    }

    if (error instanceof Prisma.PrismaClientUnknownRequestError) {
      return {
        name: 'PrismaClientUnknownRequestError',
        message: 'Unknown database error occurred',
        stack: error.stack,
        type: ErrorType.DATABASE_ERROR,
        statusCode: 500,
        code: 'DATABASE_UNKNOWN_ERROR',
        publicMessage: 'Database operation failed',
      };
    }

    if (error instanceof Prisma.PrismaClientRustPanicError) {
      return {
        name: 'PrismaClientRustPanicError',
        message: 'Database engine panic',
        stack: error.stack,
        type: ErrorType.DATABASE_ERROR,
        statusCode: 500,
        code: 'DATABASE_ENGINE_ERROR',
        publicMessage: 'Database service error',
      };
    }

    if (error instanceof Prisma.PrismaClientInitializationError) {
      return {
        name: 'PrismaClientInitializationError',
        message: 'Database connection failed',
        stack: error.stack,
        type: ErrorType.DATABASE_ERROR,
        statusCode: 503,
        code: 'DATABASE_CONNECTION_ERROR',
        publicMessage: 'Database service unavailable',
      };
    }

    if (error instanceof Prisma.PrismaClientValidationError) {
      return {
        name: 'PrismaClientValidationError',
        message: 'Database query validation failed',
        stack: error.stack,
        type: ErrorType.VALIDATION_ERROR,
        statusCode: 400,
        code: 'DATABASE_VALIDATION_ERROR',
        publicMessage: 'Invalid database operation',
      };
    }

    // Handle standard JavaScript errors
    if (error instanceof Error) {
      return {
        name: error.name,
        message: error.message,
        stack: error.stack,
        type: ErrorType.INTERNAL_ERROR,
        statusCode: 500,
        code: 'INTERNAL_SERVER_ERROR',
        publicMessage: 'Internal server error occurred',
      };
    }

    // Handle unknown error types
    return {
      name: 'UnknownError',
      message: String(error),
      type: ErrorType.INTERNAL_ERROR,
      statusCode: 500,
      code: 'UNKNOWN_ERROR',
      publicMessage: 'An unexpected error occurred',
    };
  }

  /**
   * Handle Prisma-specific errors with detailed mapping
   */
  private static handlePrismaError(
    error: Prisma.PrismaClientKnownRequestError
  ): {
    name: string;
    message: string;
    stack?: string;
    type: ErrorType;
    statusCode: number;
    code: string;
    publicMessage: string;
    publicDetails?: Record<string, any>;
  } {
    const code = error.code;
    const meta = error.meta as Record<string, any> | undefined;

    switch (code) {
      case 'P2002': // Unique constraint violation
        const field = meta?.target || 'field';
        return {
          name: 'PrismaUniqueConstraintError',
          message: `Unique constraint violation on ${field}`,
          stack: error.stack,
          type: ErrorType.CONFLICT_ERROR,
          statusCode: 409,
          code: 'UNIQUE_CONSTRAINT_VIOLATION',
          publicMessage: `A record with this ${field} already exists`,
          publicDetails: { field },
        };

      case 'P2025': // Record not found
        return {
          name: 'PrismaRecordNotFoundError',
          message: 'Record not found',
          stack: error.stack,
          type: ErrorType.NOT_FOUND_ERROR,
          statusCode: 404,
          code: 'RECORD_NOT_FOUND',
          publicMessage: 'The requested resource was not found',
        };

      case 'P2003': // Foreign key constraint violation
        return {
          name: 'PrismaForeignKeyError',
          message: 'Foreign key constraint violation',
          stack: error.stack,
          type: ErrorType.VALIDATION_ERROR,
          statusCode: 400,
          code: 'FOREIGN_KEY_CONSTRAINT',
          publicMessage: 'Invalid reference to related record',
        };

      case 'P2014': // Required relation violation
        return {
          name: 'PrismaRequiredRelationError',
          message: 'Required relation missing',
          stack: error.stack,
          type: ErrorType.VALIDATION_ERROR,
          statusCode: 400,
          code: 'REQUIRED_RELATION_MISSING',
          publicMessage: 'Required related record is missing',
        };

      case 'P2011': // Null constraint violation
        const nullField = meta?.target || 'field';
        return {
          name: 'PrismaNullConstraintError',
          message: `Null constraint violation on ${nullField}`,
          stack: error.stack,
          type: ErrorType.VALIDATION_ERROR,
          statusCode: 400,
          code: 'NULL_CONSTRAINT_VIOLATION',
          publicMessage: `${nullField} is required`,
        };

      case 'P2034': // Transaction conflict
        return {
          name: 'PrismaTransactionError',
          message: 'Transaction conflict',
          stack: error.stack,
          type: ErrorType.CONFLICT_ERROR,
          statusCode: 409,
          code: 'TRANSACTION_CONFLICT',
          publicMessage: 'Operation conflicts with concurrent changes',
        };

      default:
        return {
          name: 'PrismaKnownRequestError',
          message: `Database error: ${code}`,
          stack: error.stack,
          type: ErrorType.DATABASE_ERROR,
          statusCode: 500,
          code: `PRISMA_${code}`,
          publicMessage: 'Database operation failed',
        };
    }
  }

  /**
   * Sanitize input data for logging (remove sensitive information)
   */
  private static sanitizeInputData(
    data?: Record<string, any>
  ): Record<string, any> | undefined {
    if (!data) return undefined;

    const sensitiveFields = [
      'password',
      'token',
      'secret',
      'key',
      'authorization',
      'cookie',
      'session',
      'csrf',
      'api_key',
      'access_token',
      'refresh_token',
      'private_key',
      'credit_card',
      'ssn',
    ];

    const sanitized = { ...data };

    const sanitizeValue = (value: any, key: string): any => {
      if (typeof value === 'string') {
        const lowerKey = key.toLowerCase();
        if (sensitiveFields.some(field => lowerKey.includes(field))) {
          return '[REDACTED]';
        }
        return value;
      }

      if (Array.isArray(value)) {
        return value.map((item, index) =>
          sanitizeValue(item, `${key}[${index}]`)
        );
      }

      if (value && typeof value === 'object') {
        const sanitizedObj: Record<string, any> = {};
        Object.keys(value).forEach(nestedKey => {
          sanitizedObj[nestedKey] = sanitizeValue(value[nestedKey], nestedKey);
        });
        return sanitizedObj;
      }

      return value;
    };

    Object.keys(sanitized).forEach(key => {
      sanitized[key] = sanitizeValue(sanitized[key], key);
    });

    return sanitized;
  }

  /**
   * Create common application errors
   */
  static createValidationError(
    message: string,
    details?: Record<string, any>
  ): AppError {
    return new AppError(
      message,
      ErrorType.VALIDATION_ERROR,
      400,
      'VALIDATION_ERROR',
      details
    );
  }

  static createNotFoundError(resource: string): AppError {
    return new AppError(
      `${resource} not found`,
      ErrorType.NOT_FOUND_ERROR,
      404,
      'NOT_FOUND'
    );
  }

  static createUnauthorizedError(
    message: string = 'Authentication required'
  ): AppError {
    return new AppError(
      message,
      ErrorType.AUTHENTICATION_ERROR,
      401,
      'UNAUTHORIZED'
    );
  }

  static createForbiddenError(message: string = 'Access denied'): AppError {
    return new AppError(
      message,
      ErrorType.AUTHORIZATION_ERROR,
      403,
      'FORBIDDEN'
    );
  }

  static createConflictError(
    message: string,
    details?: Record<string, any>
  ): AppError {
    return new AppError(
      message,
      ErrorType.CONFLICT_ERROR,
      409,
      'CONFLICT',
      details
    );
  }

  static createRateLimitError(message: string = 'Too many requests'): AppError {
    return new AppError(
      message,
      ErrorType.RATE_LIMIT_ERROR,
      429,
      'RATE_LIMITED'
    );
  }

  static createFileUploadError(
    message: string,
    details?: Record<string, any>
  ): AppError {
    return new AppError(
      message,
      ErrorType.FILE_UPLOAD_ERROR,
      400,
      'FILE_UPLOAD_ERROR',
      details
    );
  }
}

/**
 * Async error wrapper for API route handlers
 */
export function withErrorHandler<T extends any[], R>(
  handler: (...args: T) => Promise<R>,
  context?: Partial<ErrorContext>
) {
  return async (...args: T): Promise<R | NextResponse<ErrorResponse>> => {
    try {
      return await handler(...args);
    } catch (error) {
      return ErrorHandler.handleError(error, context as ErrorContext);
    }
  };
}

export default ErrorHandler;
