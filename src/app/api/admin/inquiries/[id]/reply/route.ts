/**
 * Admin Inquiry Reply API Endpoint
 * POST /api/admin/inquiries/[id]/reply - Send reply to inquiry
 */
import { getServerSession } from 'next-auth/next';
import { NextRequest, NextResponse } from 'next/server';

import { z } from 'zod';

import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { sendCustomReply } from '@/lib/email';
import { ErrorHandler } from '@/lib/error-handler';
import { LogCategory, LogLevel, Logger } from '@/lib/logger';
import { getRequestContext } from '@/lib/middleware/logging';

// Reply validation schema
const replySchema = z.object({
  message: z
    .string()
    .min(1, 'Reply message is required')
    .max(5000, 'Reply message too long'),
});

type ReplyData = z.infer<typeof replySchema>;

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const context = getRequestContext(request);
  const startTime = Date.now();
  const inquiryId = id;

  try {
    // Verify admin session
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return ErrorHandler.handleError(
        ErrorHandler.createAuthenticationError('Admin access required'),
        {
          ...context,
          route: `/api/admin/inquiries/${inquiryId}/reply`,
          operation: 'authentication',
        }
      );
    }

    Logger.apiLog({
      level: LogLevel.INFO,
      category: LogCategory.API,
      message: 'Admin inquiry reply request',
      requestId: context.requestId,
      method: context.method,
      url: context.url,
      ip: context.ip,
      userAgent: context.userAgent,
      statusCode: 0,
      responseTime: 0,
      metadata: {
        adminUserId: session.user.id,
        inquiryId,
        timestamp: new Date().toISOString(),
      },
    });

    // Parse and validate request body
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      const error = ErrorHandler.createValidationError(
        'Invalid JSON in request body'
      );
      return ErrorHandler.handleError(error, {
        ...context,
        route: `/api/admin/inquiries/${inquiryId}/reply`,
        operation: 'json_parsing',
      });
    }

    // Validate reply data
    let replyData: ReplyData;
    try {
      replyData = replySchema.parse(body);
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        return ErrorHandler.handleError(validationError, {
          ...context,
          route: `/api/admin/inquiries/${inquiryId}/reply`,
          operation: 'validation',
        });
      }
      throw validationError;
    }

    // Get inquiry details
    const inquiry = await prisma.inquiry.findUnique({
      where: { id: inquiryId },
    });

    if (!inquiry) {
      return ErrorHandler.handleError(
        ErrorHandler.createNotFoundError('Inquiry not found'),
        {
          ...context,
          route: `/api/admin/inquiries/${inquiryId}/reply`,
          operation: 'inquiry_lookup',
        }
      );
    }

    // Send email reply
    const emailStartTime = Date.now();
    try {
      // Transform inquiry for email function
      const emailInquiry = {
        id: inquiry.id,
        name: inquiry.name,
        email: inquiry.email,
        subject: inquiry.subject,
        category: inquiry.category,
        message: inquiry.message,
        createdAt: inquiry.createdAt,
        budgetRange: inquiry.budgetRange,
        eventDate: inquiry.eventDate ? inquiry.eventDate.toISOString() : null,
      };
      await sendCustomReply(emailInquiry, replyData.message);
      const emailTime = Date.now() - emailStartTime;

      Logger.info('Inquiry reply email sent successfully', {
        requestId: context.requestId,
        inquiryId,
        customerEmail: inquiry.email,
        emailSendTime: emailTime,
        adminUserId: session.user.id,
      });
    } catch (emailError) {
      Logger.errorLog({
        level: LogLevel.ERROR,
        category: LogCategory.ERROR,
        message: 'Failed to send inquiry reply email',
        requestId: context.requestId,
        error: {
          name: emailError instanceof Error ? emailError.name : 'EmailError',
          message:
            emailError instanceof Error
              ? emailError.message
              : String(emailError),
          stack: emailError instanceof Error ? emailError.stack : undefined,
        },
        context: {
          operation: 'email_reply',
        },
      });

      return ErrorHandler.handleError(
        ErrorHandler.createExternalServiceError('Failed to send reply email'),
        {
          ...context,
          route: `/api/admin/inquiries/${inquiryId}/reply`,
          operation: 'email_send',
        }
      );
    }

    // Update inquiry status to RESOLVED
    const dbStartTime = Date.now();
    const updatedInquiry = await prisma.inquiry.update({
      where: { id: inquiryId },
      data: {
        status: 'RESOLVED',
        resolvedAt: new Date(),
        updatedAt: new Date(),
        assignedTo: session.user.id,
      },
    });
    const dbQueryTime = Date.now() - dbStartTime;

    Logger.databaseLog({
      level: LogLevel.INFO,
      category: LogCategory.DATABASE,
      message: 'Inquiry marked as resolved after reply',
      requestId: context.requestId,
      operation: 'UPDATE',
      table: 'Inquiry',
      queryTime: dbQueryTime,
      rowsAffected: 1,
      metadata: {
        inquiryId,
        adminUserId: session.user.id,
        oldStatus: inquiry.status,
        newStatus: 'RESOLVED',
      },
    });

    const totalResponseTime = Date.now() - startTime;

    Logger.apiLog({
      level: LogLevel.INFO,
      category: LogCategory.API,
      message: 'Admin inquiry reply sent successfully',
      requestId: context.requestId,
      method: context.method,
      url: context.url,
      ip: context.ip,
      userAgent: context.userAgent,
      statusCode: 200,
      responseTime: totalResponseTime,
      metadata: {
        adminUserId: session.user.id,
        inquiryId,
        customerEmail: inquiry.email,
        dbQueryTime,
        replyLength: replyData.message.length,
      },
    });

    const response = NextResponse.json({
      success: true,
      inquiry: updatedInquiry,
      message: 'Reply sent successfully and inquiry marked as resolved',
      timestamp: new Date().toISOString(),
    });

    response.headers.set('x-request-id', context.requestId);
    return response;
  } catch (error) {
    const totalResponseTime = Date.now() - startTime;

    Logger.errorLog({
      level: LogLevel.ERROR,
      category: LogCategory.ERROR,
      message: 'Error sending inquiry reply',
      requestId: context.requestId,
      responseTime: totalResponseTime,
      error: {
        name: error instanceof Error ? error.name : 'UnknownError',
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      },
      context: {
        route: `/api/admin/inquiries/${inquiryId}/reply`,
        operation: 'send_reply',
      },
    });

    return ErrorHandler.handleError(error, {
      ...context,
      route: `/api/admin/inquiries/${inquiryId}/reply`,
      operation: 'send_reply',
    });
  }
}
