/**
 * Winston Logger Configuration
 * Provides structured logging with environment-based log levels
 * Supports request tracking, performance monitoring, and security events
 */

import winston from 'winston'
import { v4 as uuidv4 } from 'uuid'

/**
 * Log levels hierarchy (highest to lowest priority)
 */
export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn', 
  INFO = 'info',
  DEBUG = 'debug'
}

/**
 * Log categories for better filtering and monitoring
 */
export enum LogCategory {
  AUTH = 'auth',
  API = 'api',
  DATABASE = 'database',
  SECURITY = 'security',
  PERFORMANCE = 'performance',
  ERROR = 'error',
  SYSTEM = 'system'
}

/**
 * Base log entry interface
 */
export interface BaseLogEntry {
  timestamp: string
  level: LogLevel
  category: LogCategory
  message: string
  requestId?: string
  userId?: string
  sessionId?: string
  ip?: string
  userAgent?: string
  method?: string
  url?: string
  statusCode?: number
  responseTime?: number
  metadata?: Record<string, unknown>
}

/**
 * Security event types for audit logging
 */
export interface SecurityLogEntry extends BaseLogEntry {
  category: LogCategory.SECURITY
  eventType: 'LOGIN_SUCCESS' | 'LOGIN_FAILURE' | 'UNAUTHORIZED_ACCESS' | 'PERMISSION_DENIED' | 'SUSPICIOUS_ACTIVITY'
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  details?: {
    attempts?: number
    blockedReason?: string
    riskScore?: number
  }
}

/**
 * Performance monitoring log entry
 */
export interface PerformanceLogEntry extends BaseLogEntry {
  category: LogCategory.PERFORMANCE
  metrics: {
    responseTime: number
    memoryUsage?: number
    cpuUsage?: number
    dbQueryTime?: number
    dbQueryCount?: number
  }
}

/**
 * Database operation log entry
 */
export interface DatabaseLogEntry extends BaseLogEntry {
  category: LogCategory.DATABASE
  operation: 'CREATE' | 'READ' | 'UPDATE' | 'DELETE'
  table: string
  queryTime: number
  rowsAffected?: number
}

/**
 * API request/response log entry
 */
export interface ApiLogEntry extends BaseLogEntry {
  category: LogCategory.API
  method: string
  url: string
  statusCode: number
  responseTime: number
  requestSize?: number
  responseSize?: number
  cached?: boolean
}

/**
 * Error log entry with stack trace and context
 */
export interface ErrorLogEntry extends BaseLogEntry {
  category: LogCategory.ERROR
  error: {
    name: string
    message: string
    stack?: string
    code?: string | number
  }
  context?: {
    route?: string
    operation?: string
    inputData?: Record<string, unknown>
  }
}

/**
 * Winston logger configuration
 */
const createLogger = () => {
  const isProduction = process.env.NODE_ENV === 'production'
  const logLevel = process.env.LOG_LEVEL || (isProduction ? LogLevel.INFO : LogLevel.DEBUG)

  // Custom JSON formatter for structured logging
  const jsonFormatter = winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss.SSS'
    }),
    winston.format.errors({ stack: true }),
    winston.format.metadata({
      fillExcept: ['message', 'level', 'timestamp', 'label']
    }),
    winston.format.json()
  )

  // Console formatter for development
  const consoleFormatter = winston.format.combine(
    winston.format.timestamp({
      format: 'HH:mm:ss.SSS'
    }),
    winston.format.errors({ stack: true }),
    winston.format.colorize(),
    winston.format.printf(({ timestamp, level, message, category, requestId, ...meta }) => {
      const metaStr = Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''
      const reqId = requestId ? `[${requestId.slice(0, 8)}]` : ''
      const cat = category ? `[${category.toUpperCase()}]` : ''
      return `${timestamp} ${level} ${cat}${reqId} ${message} ${metaStr}`
    })
  )

  // Create transports based on environment
  const transports: winston.transport[] = []

  // Console transport for development
  if (!isProduction) {
    transports.push(
      new winston.transports.Console({
        level: logLevel,
        format: consoleFormatter
      })
    )
  }

  // File transports for production
  if (isProduction) {
    // All logs
    transports.push(
      new winston.transports.File({
        filename: 'logs/combined.log',
        level: logLevel,
        format: jsonFormatter,
        maxsize: 50 * 1024 * 1024, // 50MB
        maxFiles: 5,
        tailable: true
      })
    )

    // Error logs only
    transports.push(
      new winston.transports.File({
        filename: 'logs/error.log',
        level: LogLevel.ERROR,
        format: jsonFormatter,
        maxsize: 10 * 1024 * 1024, // 10MB
        maxFiles: 10,
        tailable: true
      })
    )

    // Security logs only
    transports.push(
      new winston.transports.File({
        filename: 'logs/security.log',
        level: LogLevel.INFO,
        format: jsonFormatter,
        maxsize: 20 * 1024 * 1024, // 20MB
        maxFiles: 10,
        tailable: true,
        // Filter for security category only
        filter: (info) => info.category === LogCategory.SECURITY
      })
    )
  }

  return winston.createLogger({
    level: logLevel,
    format: jsonFormatter,
    defaultMeta: {
      service: 'portfolio-webapp',
      environment: process.env.NODE_ENV || 'development',
      version: process.env.npm_package_version || '0.1.0'
    },
    transports,
    // Handle uncaught exceptions and rejections
    exceptionHandlers: [
      new winston.transports.File({ 
        filename: isProduction ? 'logs/exceptions.log' : '/dev/null'
      })
    ],
    rejectionHandlers: [
      new winston.transports.File({ 
        filename: isProduction ? 'logs/rejections.log' : '/dev/null'
      })
    ],
    exitOnError: false
  })
}

// Create singleton logger instance
export const logger = createLogger()

/**
 * Logger utility class with structured logging methods
 */
export class Logger {
  /**
   * Generate unique request ID for tracking
   */
  static generateRequestId(): string {
    return uuidv4()
  }

  /**
   * Log API request/response
   */
  static apiLog(entry: Omit<ApiLogEntry, 'timestamp'>) {
    logger.info(entry.message, {
      ...entry,
      timestamp: new Date().toISOString()
    })
  }

  /**
   * Log security events with severity levels
   */
  static securityLog(entry: Omit<SecurityLogEntry, 'timestamp'>) {
    const logLevel = entry.severity === 'CRITICAL' || entry.severity === 'HIGH' 
      ? LogLevel.ERROR 
      : LogLevel.WARN

    logger.log(logLevel, entry.message, {
      ...entry,
      timestamp: new Date().toISOString()
    })
  }

  /**
   * Log performance metrics
   */
  static performanceLog(entry: Omit<PerformanceLogEntry, 'timestamp'>) {
    logger.info(entry.message, {
      ...entry,
      timestamp: new Date().toISOString()
    })
  }

  /**
   * Log database operations
   */
  static databaseLog(entry: Omit<DatabaseLogEntry, 'timestamp'>) {
    logger.info(entry.message, {
      ...entry,
      timestamp: new Date().toISOString()
    })
  }

  /**
   * Log errors with context and stack traces
   */
  static errorLog(entry: Omit<ErrorLogEntry, 'timestamp'>) {
    logger.error(entry.message, {
      ...entry,
      timestamp: new Date().toISOString()
    })
  }

  /**
   * Log general information
   */
  static info(message: string, metadata?: Record<string, any>) {
    logger.info(message, {
      category: LogCategory.SYSTEM,
      timestamp: new Date().toISOString(),
      ...metadata
    })
  }

  /**
   * Log warnings
   */
  static warn(message: string, metadata?: Record<string, any>) {
    logger.warn(message, {
      category: LogCategory.SYSTEM,
      timestamp: new Date().toISOString(),
      ...metadata
    })
  }

  /**
   * Log debug information (development only)
   */
  static debug(message: string, metadata?: Record<string, any>) {
    logger.debug(message, {
      category: LogCategory.SYSTEM,
      timestamp: new Date().toISOString(),
      ...metadata
    })
  }

  /**
   * Log general errors
   */
  static error(message: string, error?: Error | unknown, metadata?: Record<string, any>) {
    const errorDetails = error instanceof Error ? {
      name: error.name,
      message: error.message,
      stack: error.stack
    } : { message: String(error) }

    logger.error(message, {
      category: LogCategory.ERROR,
      error: errorDetails,
      timestamp: new Date().toISOString(),
      ...metadata
    })
  }
}

// Export default logger instance
export default logger