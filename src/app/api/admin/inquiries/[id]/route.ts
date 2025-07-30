/**
 * Admin Inquiry Management API Endpoint
 * PATCH /api/admin/inquiries/[id] - Update inquiry status
 */
import { getServerSession } from 'next-auth/next';
import { NextRequest, NextResponse } from 'next/server';

import { z } from 'zod';

import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { ErrorHandler } from '@/lib/error-handler';
import { LogCategory, LogLevel, Logger } from '@/lib/logger';
import { getRequestContext } from '@/lib/middleware/logging';

// Update inquiry validation schema
const updateInquirySchema = z.object({
  status: z.enum(['NEW', 'IN_PROGRESS', 'RESOLVED', 'CLOSED']).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
  assignedTo: z.string().optional(),
});

type UpdateInquiryData = z.infer<typeof updateInquirySchema>;

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const context = getRequestContext(request);
  const startTime = Date.now();
  const inquiryId = params.id;

  try {
    // Verify admin session
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return ErrorHandler.handleError(
        ErrorHandler.createAuthenticationError('Admin access required'),
        {
          ...context,
          route: `/api/admin/inquiries/${inquiryId}`,
          operation: 'authentication',
        }
      );
    }

    Logger.apiLog({
      level: LogLevel.INFO,
      category: LogCategory.API,
      message: 'Admin inquiry update request',
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
    let body: any;
    try {
      body = await request.json();
    } catch (parseError) {
      const error = ErrorHandler.createValidationError(
        'Invalid JSON in request body'
      );
      return ErrorHandler.handleError(error, {
        ...context,
        route: `/api/admin/inquiries/${inquiryId}`,
        operation: 'json_parsing',
      });
    }

    // Validate update data
    let updateData: UpdateInquiryData;
    try {
      updateData = updateInquirySchema.parse(body);
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        Logger.apiLog({
          level: LogLevel.WARN,
          category: LogCategory.API,
          message: 'Admin inquiry update validation failed',
          requestId: context.requestId,
          method: context.method,
          url: context.url,
          ip: context.ip,
          userAgent: context.userAgent,
          statusCode: 400,
          responseTime: Date.now() - startTime,
          metadata: {
            validationErrors: validationError.errors,
            submittedFields: Object.keys(body),
            inquiryId,
          },
        });

        return ErrorHandler.handleError(validationError, {
          ...context,
          route: `/api/admin/inquiries/${inquiryId}`,
          operation: 'validation',
        });
      }
      throw validationError;
    }

    // Check if inquiry exists
    const existingInquiry = await prisma.inquiry.findUnique({
      where: { id: inquiryId },
    });

    if (!existingInquiry) {
      return ErrorHandler.handleError(
        ErrorHandler.createNotFoundError('Inquiry not found'),
        {
          ...context,
          route: `/api/admin/inquiries/${inquiryId}`,
          operation: 'inquiry_lookup',
        }
      );
    }

    // Update inquiry
    const dbStartTime = Date.now();
    const updatedInquiry = await prisma.inquiry.update({
      where: { id: inquiryId },
      data: {
        ...updateData,
        updatedAt: new Date(),
        ...(updateData.status === 'RESOLVED' && { resolvedAt: new Date() }),
      },
    });
    const dbQueryTime = Date.now() - dbStartTime;

    Logger.databaseLog({
      level: LogLevel.INFO,
      category: LogCategory.DATABASE,
      message: 'Inquiry updated successfully',
      requestId: context.requestId,
      operation: 'UPDATE',
      table: 'Inquiry',
      queryTime: dbQueryTime,
      rowsAffected: 1,
      metadata: {
        inquiryId,
        adminUserId: session.user.id,
        oldStatus: existingInquiry.status,
        newStatus: updateData.status,
        changes: Object.keys(updateData),
      },
    });

    const totalResponseTime = Date.now() - startTime;

    Logger.apiLog({
      level: LogLevel.INFO,
      category: LogCategory.API,
      message: 'Admin inquiry updated successfully',
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
        oldStatus: existingInquiry.status,
        newStatus: updateData.status,
        dbQueryTime,
      },
    });

    const response = NextResponse.json({
      success: true,
      inquiry: updatedInquiry,
      message: 'Inquiry updated successfully',
      timestamp: new Date().toISOString(),
    });

    response.headers.set('x-request-id', context.requestId);
    return response;
  } catch (error) {
    const totalResponseTime = Date.now() - startTime;

    Logger.errorLog({
      level: LogLevel.ERROR,
      category: LogCategory.ERROR,
      message: 'Error updating admin inquiry',
      requestId: context.requestId,
      error: {
        name: error instanceof Error ? error.name : 'UnknownError',
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      },
      context: {
        route: `/api/admin/inquiries/${inquiryId}`,
        operation: 'update_inquiry',
        metadata: {
          responseTime: totalResponseTime,
          inquiryId,
          ip: context.ip,
          userAgent: context.userAgent,
        },
      },
    });

    return ErrorHandler.handleError(error, {
      ...context,
      route: `/api/admin/inquiries/${inquiryId}`,
      operation: 'update_inquiry',
    });
  }
}
