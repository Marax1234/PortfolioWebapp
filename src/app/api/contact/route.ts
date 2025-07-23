/**
 * Contact API Endpoint
 * POST /api/contact - Handle contact form submissions
 */

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { Logger, LogCategory, LogLevel } from '@/lib/logger'
import { getRequestContext } from '@/lib/middleware/logging'
import { ErrorHandler } from '@/lib/error-handler'

// Contact form validation schema
const contactSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  email: z.string().email('Valid email is required'),
  subject: z.string().min(1, 'Subject is required').max(200, 'Subject too long'),
  message: z.string().min(10, 'Message must be at least 10 characters').max(2000, 'Message too long'),
  category: z.enum(['GENERAL', 'BOOKING', 'COLLABORATION', 'TECHNICAL']).optional().default('GENERAL'),
  phone: z.string().optional(),
  company: z.string().optional(),
  budget: z.string().optional(),
  timeline: z.string().optional()
})

type ContactFormData = z.infer<typeof contactSchema>

// Simple rate limiting store (in production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT_MAX = 5 // Max 5 submissions per hour per IP
const RATE_LIMIT_WINDOW = 60 * 60 * 1000 // 1 hour in milliseconds

export async function POST(request: NextRequest) {
  const context = getRequestContext(request)
  const startTime = Date.now()

  try {
    // Log incoming contact form submission
    Logger.apiLog({
      level: LogLevel.INFO,
      category: LogCategory.API,
      message: `Contact form submission request`,
      requestId: context.requestId,
      method: context.method,
      url: context.url,
      ip: context.ip,
      userAgent: context.userAgent,
      statusCode: 0,
      responseTime: 0,
      metadata: {
        timestamp: new Date().toISOString()
      }
    })

    // Rate limiting check
    const now = Date.now()
    const clientId = context.ip
    const rateLimitEntry = rateLimitStore.get(clientId)

    if (rateLimitEntry) {
      if (now < rateLimitEntry.resetTime) {
        if (rateLimitEntry.count >= RATE_LIMIT_MAX) {
          // Log rate limiting
          Logger.securityLog({
            level: LogLevel.WARN,
            category: LogCategory.SECURITY,
            message: `Contact form rate limit exceeded`,
            eventType: 'RATE_LIMITED',
            severity: 'MEDIUM',
            requestId: context.requestId,
            ip: context.ip,
            userAgent: context.userAgent,
            details: {
              attempts: rateLimitEntry.count,
              windowEnd: new Date(rateLimitEntry.resetTime).toISOString(),
              rateLimitWindow: RATE_LIMIT_WINDOW / 1000 / 60 + ' minutes'
            }
          })

          const error = ErrorHandler.createRateLimitError('Too many contact form submissions. Please try again later.')
          return ErrorHandler.handleError(error, {
            ...context,
            route: '/api/contact',
            operation: 'rate_limiting'
          })
        }
        rateLimitEntry.count++
      } else {
        // Reset the window
        rateLimitStore.set(clientId, { count: 1, resetTime: now + RATE_LIMIT_WINDOW })
      }
    } else {
      // First submission from this IP
      rateLimitStore.set(clientId, { count: 1, resetTime: now + RATE_LIMIT_WINDOW })
    }

    // Parse and validate request body
    let body: any
    try {
      body = await request.json()
    } catch (parseError) {
      const error = ErrorHandler.createValidationError('Invalid JSON in request body')
      return ErrorHandler.handleError(error, {
        ...context,
        route: '/api/contact',
        operation: 'json_parsing',
        inputData: { parseError: String(parseError) }
      })
    }

    // Validate form data
    let validatedData: ContactFormData
    try {
      validatedData = contactSchema.parse(body)
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        Logger.apiLog({
          level: LogLevel.WARN,
          category: LogCategory.API,
          message: `Contact form validation failed`,
          requestId: context.requestId,
          method: context.method,
          url: context.url,
          ip: context.ip,
          userAgent: context.userAgent,
          statusCode: 400,
          responseTime: Date.now() - startTime,
          metadata: {
            validationErrors: validationError.errors,
            submittedFields: Object.keys(body)
          }
        })

        return ErrorHandler.handleError(validationError, {
          ...context,
          route: '/api/contact',
          operation: 'form_validation',
          inputData: { submittedFields: Object.keys(body) }
        })
      }
      throw validationError
    }

    // Log successful validation
    Logger.debug('Contact form data validated successfully', {
      requestId: context.requestId,
      category: validatedData.category,
      hasPhone: !!validatedData.phone,
      hasCompany: !!validatedData.company,
      hasBudget: !!validatedData.budget,
      hasTimeline: !!validatedData.timeline,
      messageLength: validatedData.message.length
    })

    // Spam detection (basic implementation)
    const spamScore = await detectSpam(validatedData, context)
    if (spamScore > 0.7) {
      Logger.securityLog({
        level: LogLevel.WARN,
        category: LogCategory.SECURITY,
        message: `Potential spam contact form submission detected`,
        eventType: 'SUSPICIOUS_ACTIVITY',
        severity: 'MEDIUM',
        requestId: context.requestId,
        ip: context.ip,
        userAgent: context.userAgent,
        details: {
          spamScore,
          email: validatedData.email,
          spamIndicators: getSpamIndicators(validatedData)
        }
      })
    }

    // Simulate saving to database (replace with actual implementation)
    const dbStartTime = Date.now()
    const inquiryId = `inq_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    Logger.databaseLog({
      level: LogLevel.INFO,
      category: LogCategory.DATABASE,
      message: 'Saving contact form submission',
      requestId: context.requestId,
      operation: 'CREATE',
      table: 'Inquiry',
      queryTime: 0,
      metadata: {
        category: validatedData.category,
        email: validatedData.email,
        spamScore
      }
    })

    // Simulate database save delay
    await new Promise(resolve => setTimeout(resolve, 50))
    const dbQueryTime = Date.now() - dbStartTime

    Logger.databaseLog({
      level: LogLevel.INFO,
      category: LogCategory.DATABASE,
      message: 'Contact form submission saved successfully',
      requestId: context.requestId,
      operation: 'CREATE',
      table: 'Inquiry',
      queryTime: dbQueryTime,
      rowsAffected: 1,
      metadata: {
        inquiryId,
        category: validatedData.category,
        email: validatedData.email
      }
    })

    // Simulate email notification (replace with actual implementation)
    const emailStartTime = Date.now()
    try {
      await simulateEmailSending(validatedData, inquiryId, context.requestId)
      const emailTime = Date.now() - emailStartTime

      Logger.info('Contact form notification email sent', {
        requestId: context.requestId,
        inquiryId,
        email: validatedData.email,
        emailSendTime: emailTime
      })

    } catch (emailError) {
      Logger.errorLog({
        level: LogLevel.ERROR,
        category: LogCategory.ERROR,
        message: 'Failed to send contact form notification email',
        requestId: context.requestId,
        error: {
          name: emailError instanceof Error ? emailError.name : 'EmailError',
          message: emailError instanceof Error ? emailError.message : String(emailError),
          stack: emailError instanceof Error ? emailError.stack : undefined
        },
        context: {
          operation: 'email_notification',
          inquiryId,
          email: validatedData.email
        }
      })
      // Don't fail the request if email fails
    }

    const totalResponseTime = Date.now() - startTime

    // Log successful submission
    Logger.apiLog({
      level: LogLevel.INFO,
      category: LogCategory.API,
      message: `Contact form submission successful`,
      requestId: context.requestId,
      method: context.method,
      url: context.url,
      ip: context.ip,
      userAgent: context.userAgent,
      statusCode: 201,
      responseTime: totalResponseTime,
      metadata: {
        inquiryId,
        category: validatedData.category,
        email: validatedData.email,
        dbQueryTime,
        spamScore,
        messageLength: validatedData.message.length
      }
    })

    const response = NextResponse.json({
      success: true,
      message: 'Thank you for your message. We will get back to you soon!',
      inquiryId,
      timestamp: new Date().toISOString()
    }, { status: 201 })

    response.headers.set('x-request-id', context.requestId)
    return response

  } catch (error) {
    const totalResponseTime = Date.now() - startTime

    Logger.errorLog({
      level: LogLevel.ERROR,
      category: LogCategory.ERROR,
      message: 'Error processing contact form submission',
      requestId: context.requestId,
      error: {
        name: error instanceof Error ? error.name : 'UnknownError',
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      },
      context: {
        route: '/api/contact',
        operation: 'contact_form_submission',
        metadata: {
          responseTime: totalResponseTime,
          ip: context.ip,
          userAgent: context.userAgent
        }
      }
    })

    return ErrorHandler.handleError(error, {
      ...context,
      route: '/api/contact',
      operation: 'contact_form_submission'
    })
  }
}

/**
 * Basic spam detection algorithm
 */
async function detectSpam(data: ContactFormData, context: any): Promise<number> {
  let spamScore = 0

  // Check for suspicious patterns
  const suspiciousPatterns = [
    /crypto|bitcoin|investment|loan|mortgage|viagra|cialis/i,
    /click here|urgent|act now|limited time/i,
    /make money|work from home|get rich/i
  ]

  const text = `${data.name} ${data.email} ${data.subject} ${data.message}`.toLowerCase()
  
  suspiciousPatterns.forEach(pattern => {
    if (pattern.test(text)) {
      spamScore += 0.3
    }
  })

  // Check email domain
  const emailDomain = data.email.split('@')[1]
  const suspiciousDomains = ['tempmail.com', '10minutemail.com', 'guerrillamail.com']
  if (suspiciousDomains.includes(emailDomain)) {
    spamScore += 0.4
  }

  // Check message length ratio
  if (data.message.length < 20) {
    spamScore += 0.2
  }

  // URL count in message
  const urlCount = (data.message.match(/https?:\/\/\S+/g) || []).length
  if (urlCount > 2) {
    spamScore += 0.3
  }

  return Math.min(spamScore, 1.0)
}

/**
 * Get spam indicators for logging
 */
function getSpamIndicators(data: ContactFormData): string[] {
  const indicators: string[] = []
  
  const text = `${data.name} ${data.email} ${data.subject} ${data.message}`.toLowerCase()
  
  if (/crypto|bitcoin|investment/i.test(text)) indicators.push('financial_keywords')
  if (/click here|urgent|act now/i.test(text)) indicators.push('urgency_keywords')
  if (data.message.length < 20) indicators.push('short_message')
  if ((data.message.match(/https?:\/\/\S+/g) || []).length > 2) indicators.push('multiple_urls')
  
  const emailDomain = data.email.split('@')[1]
  const suspiciousDomains = ['tempmail.com', '10minutemail.com', 'guerrillamail.com']
  if (suspiciousDomains.includes(emailDomain)) indicators.push('suspicious_email_domain')

  return indicators
}

/**
 * Simulate email sending (replace with actual implementation)
 */
async function simulateEmailSending(data: ContactFormData, inquiryId: string, requestId: string): Promise<void> {
  // Simulate email API delay
  await new Promise(resolve => setTimeout(resolve, 100))
  
  // Simulate occasional email failures for testing
  if (Math.random() < 0.05) { // 5% failure rate
    throw new Error('Email service temporarily unavailable')
  }
  
  Logger.info('Email notification sent successfully', {
    requestId,
    inquiryId,
    to: 'admin@portfolio.com',
    subject: `New contact form submission: ${data.subject}`,
    category: data.category
  })
}