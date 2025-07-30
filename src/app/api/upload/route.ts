/**
 * File Upload API Endpoint
 * POST /api/upload - Handle file uploads with processing
 */
import { NextRequest, NextResponse } from 'next/server';

import { ErrorHandler } from '@/lib/error-handler';
import { imageProcessor } from '@/lib/image-processor';
import { LogCategory, LogLevel, Logger } from '@/lib/logger';
import { getRequestContext } from '@/lib/middleware/logging';
import { storageManager } from '@/lib/storage';

// const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_FILES = 10;

export async function POST(request: NextRequest) {
  const context = getRequestContext(request);
  const startTime = Date.now();

  try {
    Logger.apiLog({
      level: LogLevel.INFO,
      category: LogCategory.API,
      message: 'File upload request received',
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

    // Parse multipart form data
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      const error = ErrorHandler.createValidationError('No files provided');
      return ErrorHandler.handleError(error, {
        ...context,
        route: '/api/upload',
        operation: 'validation',
      });
    }

    if (files.length > MAX_FILES) {
      const error = ErrorHandler.createValidationError(
        `Maximum ${MAX_FILES} files allowed`
      );
      return ErrorHandler.handleError(error, {
        ...context,
        route: '/api/upload',
        operation: 'validation',
      });
    }

    Logger.debug('Processing upload files', {
      requestId: context.requestId,
      fileCount: files.length,
      fileSizes: files.map(f => f.size),
      fileTypes: files.map(f => f.type),
    });

    const processedFiles = [];
    const errors = [];

    // Process each file
    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      try {
        // Validate file
        const validation = storageManager.validateFile(file);
        if (!validation.isValid) {
          errors.push({
            fileName: file.name,
            error: validation.error,
          });
          continue;
        }

        // Convert File to Buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Determine if it's an image or video
        const isImage = file.type.startsWith('image/');
        const isVideo = file.type.startsWith('video/');

        let processedFile;

        if (isImage) {
          // Process image with Sharp
          Logger.debug('Processing image file', {
            requestId: context.requestId,
            fileName: file.name,
            fileSize: file.size,
            mimeType: file.type,
          });

          processedFile = await imageProcessor.processImage(
            buffer,
            file.name,
            file.type
          );
        } else if (isVideo) {
          // For videos, just store the original file
          Logger.debug('Processing video file', {
            requestId: context.requestId,
            fileName: file.name,
            fileSize: file.size,
            mimeType: file.type,
          });

          const fileName = storageManager.generateFileName(file.name);
          await storageManager.saveFile(buffer, fileName, 'originals');

          processedFile = {
            original: {
              originalName: file.name,
              fileName,
              mimeType: file.type,
              size: buffer.length,
            },
            publicPath: storageManager.getPublicUrl(fileName, 'originals'),
          };
        } else {
          errors.push({
            fileName: file.name,
            error: 'Unsupported file type',
          });
          continue;
        }

        processedFiles.push({
          ...processedFile,
          mediaType: isImage ? 'IMAGE' : 'VIDEO',
        });

        Logger.debug('File processed successfully', {
          requestId: context.requestId,
          fileName: file.name,
          originalSize: file.size,
          processedSize: processedFile.original.size,
          hasThumb: !!processedFile.thumbnail,
          hasWebP: !!processedFile.webp,
          hasAVIF: !!processedFile.avif,
        });
      } catch (error) {
        Logger.errorLog({
          level: LogLevel.ERROR,
          category: LogCategory.ERROR,
          message: 'File processing error',
          requestId: context.requestId,
          error: {
            name: error instanceof Error ? error.name : 'ProcessingError',
            message: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,
          },
          context: {
            fileName: file.name,
            fileSize: file.size,
            mimeType: file.type,
          },
        });

        errors.push({
          fileName: file.name,
          error: error instanceof Error ? error.message : 'Processing failed',
        });
      }
    }

    const totalResponseTime = Date.now() - startTime;

    // Log processing results
    Logger.apiLog({
      level: LogLevel.INFO,
      category: LogCategory.API,
      message: 'File upload processing completed',
      requestId: context.requestId,
      method: context.method,
      url: context.url,
      ip: context.ip,
      userAgent: context.userAgent,
      statusCode: 200,
      responseTime: totalResponseTime,
      metadata: {
        totalFiles: files.length,
        processedFiles: processedFiles.length,
        errorCount: errors.length,
        totalProcessingTime: totalResponseTime,
      },
    });

    // Return results
    return NextResponse.json({
      success: true,
      data: {
        processedFiles,
        errors,
        summary: {
          total: files.length,
          processed: processedFiles.length,
          failed: errors.length,
        },
      },
    });
  } catch (error) {
    const totalResponseTime = Date.now() - startTime;

    Logger.errorLog({
      level: LogLevel.ERROR,
      category: LogCategory.ERROR,
      message: 'Upload API error',
      requestId: context.requestId,
      error: {
        name: error instanceof Error ? error.name : 'UnknownError',
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      },
      context: {
        route: '/api/upload',
        operation: 'file_upload',
        responseTime: totalResponseTime,
        ip: context.ip,
        userAgent: context.userAgent,
      },
    });

    return ErrorHandler.handleError(error, {
      ...context,
      route: '/api/upload',
      operation: 'file_upload',
    });
  }
}
