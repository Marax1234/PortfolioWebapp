'use client';

import React, { useCallback, useRef, useState } from 'react';

import {
  AlertCircle,
  CheckCircle,
  FileText,
  Image as ImageIcon,
  Loader2,
  Upload,
  Video,
  X,
} from 'lucide-react';

import { Alert, AlertDescription } from './alert';
import { Button } from './button';
import { Card, CardContent } from './card';
import { Progress } from './progress';

export interface UploadedFile extends File {
  id: string;
  preview?: string;
  progress?: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  error?: string;
  uploadedUrl?: string;
}

export interface FileUploadProps {
  accept?: string;
  maxFiles?: number;
  maxFileSize?: number; // in bytes
  allowedTypes?: string[];
  multiple?: boolean;
  className?: string;
  onFilesChange?: (files: UploadedFile[]) => void;
  onUpload?: (files: UploadedFile[]) => Promise<void>;
  disabled?: boolean;
  uploadText?: string;
  dragText?: string;
  dropText?: string;
}

const DEFAULT_ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'video/mp4',
  'video/quicktime',
];

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const getFileIcon = (type: string) => {
  if (type.startsWith('image/')) return <ImageIcon className='h-4 w-4' />;
  if (type.startsWith('video/')) return <Video className='h-4 w-4' />;
  return <FileText className='h-4 w-4' />;
};

export function FileUpload({
  accept = 'image/*,video/*',
  maxFiles = 10,
  maxFileSize = 10 * 1024 * 1024, // 10MB
  allowedTypes = DEFAULT_ALLOWED_TYPES,
  multiple = true,
  className = '',
  onFilesChange,
  onUpload,
  disabled = false,
  uploadText = 'Click to upload or drag and drop',
  dragText = 'Drag files here to upload',
  dropText = 'Drop files here',
}: FileUploadProps) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const createUploadedFile = useCallback((file: File): UploadedFile => {
    const uploadedFile = file as UploadedFile;
    uploadedFile.id = `${file.name}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    uploadedFile.progress = 0;
    uploadedFile.status = 'pending';

    // Create preview for images
    if (file.type.startsWith('image/')) {
      uploadedFile.preview = URL.createObjectURL(file);
    }

    return uploadedFile;
  }, []);

  const validateFile = useCallback(
    (file: File): { isValid: boolean; error?: string } => {
      // Check file size
      if (file.size > maxFileSize) {
        return {
          isValid: false,
          error: `File size exceeds ${formatFileSize(maxFileSize)}`,
        };
      }

      // Check file type
      if (!allowedTypes.includes(file.type)) {
        return {
          isValid: false,
          error: `File type ${file.type} is not allowed`,
        };
      }

      return { isValid: true };
    },
    [maxFileSize, allowedTypes]
  );

  const addFiles = useCallback(
    (newFiles: FileList | File[]) => {
      const fileArray = Array.from(newFiles);
      const validFiles: UploadedFile[] = [];
      const errors: string[] = [];

      // Check max files limit
      if (files.length + fileArray.length > maxFiles) {
        setError(`Maximum ${maxFiles} files allowed`);
        return;
      }

      fileArray.forEach(file => {
        const validation = validateFile(file);
        if (validation.isValid) {
          validFiles.push(createUploadedFile(file));
        } else {
          errors.push(`${file.name}: ${validation.error}`);
        }
      });

      if (errors.length > 0) {
        setError(errors.join(', '));
      } else {
        setError(null);
      }

      if (validFiles.length > 0) {
        const updatedFiles = [...files, ...validFiles];
        setFiles(updatedFiles);
        onFilesChange?.(updatedFiles);
      }
    },
    [files, maxFiles, validateFile, createUploadedFile, onFilesChange]
  );

  const removeFile = useCallback(
    (fileId: string) => {
      const updatedFiles = files.filter(file => {
        if (file.id === fileId) {
          // Revoke preview URL to prevent memory leaks
          if (file.preview) {
            URL.revokeObjectURL(file.preview);
          }
          return false;
        }
        return true;
      });
      setFiles(updatedFiles);
      onFilesChange?.(updatedFiles);
    },
    [files, onFilesChange]
  );

  const updateFileStatus = useCallback(
    (fileId: string, updates: Partial<UploadedFile>) => {
      setFiles(prev =>
        prev.map(file => (file.id === fileId ? { ...file, ...updates } : file))
      );
    },
    []
  );

  const handleFileInput = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = event.target.files;
      if (selectedFiles && selectedFiles.length > 0) {
        addFiles(selectedFiles);
      }
      // Reset input value to allow selecting the same file again
      event.target.value = '';
    },
    [addFiles]
  );

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      setIsDragOver(false);

      const droppedFiles = event.dataTransfer.files;
      if (droppedFiles.length > 0) {
        addFiles(droppedFiles);
      }
    },
    [addFiles]
  );

  const handleUpload = useCallback(async () => {
    if (!onUpload || files.length === 0) return;

    setIsUploading(true);
    setError(null);

    try {
      // Mark all files as uploading
      files.forEach(file => {
        updateFileStatus(file.id, { status: 'uploading', progress: 0 });
      });

      await onUpload(files);

      // Mark all files as completed
      files.forEach(file => {
        updateFileStatus(file.id, { status: 'completed', progress: 100 });
      });
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Upload failed');

      // Mark all files as error
      files.forEach(file => {
        updateFileStatus(file.id, {
          status: 'error',
          error: 'Upload failed',
        });
      });
    } finally {
      setIsUploading(false);
    }
  }, [files, onUpload, updateFileStatus]);

  const clearAll = useCallback(() => {
    files.forEach(file => {
      if (file.preview) {
        URL.revokeObjectURL(file.preview);
      }
    });
    setFiles([]);
    setError(null);
    onFilesChange?.([]);
  }, [files, onFilesChange]);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <div
        className={`cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
          isDragOver
            ? 'border-blue-400 bg-blue-50'
            : 'border-slate-300 hover:border-slate-400'
        } ${disabled ? 'cursor-not-allowed opacity-50' : ''} `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !disabled && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type='file'
          accept={accept}
          multiple={multiple}
          onChange={handleFileInput}
          className='hidden'
          disabled={disabled}
        />

        <div className='flex flex-col items-center space-y-4'>
          <Upload
            className={`h-8 w-8 ${isDragOver ? 'text-blue-500' : 'text-slate-400'}`}
          />
          <div>
            <p className='text-sm font-medium text-slate-900'>
              {isDragOver ? dropText : uploadText}
            </p>
            <p className='mt-1 text-xs text-slate-500'>
              {allowedTypes.includes('image/jpeg') && 'Images'}
              {allowedTypes.includes('video/mp4') &&
                (allowedTypes.includes('image/jpeg')
                  ? ' and Videos'
                  : 'Videos')}{' '}
              up to {formatFileSize(maxFileSize)}
            </p>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <Alert variant='destructive'>
          <AlertCircle className='h-4 w-4' />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* File List */}
      {files.length > 0 && (
        <Card>
          <CardContent className='p-4'>
            <div className='mb-4 flex items-center justify-between'>
              <h3 className='text-sm font-medium'>
                Selected Files ({files.length}/{maxFiles})
              </h3>
              <div className='flex items-center space-x-2'>
                {onUpload && (
                  <Button
                    size='sm'
                    onClick={handleUpload}
                    disabled={isUploading || disabled}
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className='mr-2 h-4 w-4' />
                        Upload All
                      </>
                    )}
                  </Button>
                )}
                <Button
                  size='sm'
                  variant='outline'
                  onClick={clearAll}
                  disabled={isUploading}
                >
                  Clear All
                </Button>
              </div>
            </div>

            <div className='space-y-3'>
              {files.map(file => (
                <div
                  key={file.id}
                  className='flex items-center space-x-3 rounded-lg border p-3'
                >
                  {/* Preview */}
                  <div className='flex-shrink-0'>
                    {file.preview ? (
                      <img
                        src={file.preview}
                        alt={file.name}
                        className='h-12 w-12 rounded object-cover'
                      />
                    ) : (
                      <div className='flex h-12 w-12 items-center justify-center rounded bg-slate-100'>
                        {getFileIcon(file.type)}
                      </div>
                    )}
                  </div>

                  {/* File Info */}
                  <div className='min-w-0 flex-1'>
                    <p className='truncate text-sm font-medium text-slate-900'>
                      {file.name}
                    </p>
                    <p className='text-xs text-slate-500'>
                      {formatFileSize(file.size)}
                    </p>

                    {/* Progress Bar */}
                    {file.status === 'uploading' &&
                      typeof file.progress === 'number' && (
                        <Progress value={file.progress} className='mt-2 h-1' />
                      )}

                    {/* Error Message */}
                    {file.status === 'error' && file.error && (
                      <p className='mt-1 text-xs text-red-600'>{file.error}</p>
                    )}
                  </div>

                  {/* Status Icon */}
                  <div className='flex-shrink-0'>
                    {file.status === 'uploading' && (
                      <Loader2 className='h-4 w-4 animate-spin text-blue-500' />
                    )}
                    {file.status === 'completed' && (
                      <CheckCircle className='h-4 w-4 text-green-500' />
                    )}
                    {file.status === 'error' && (
                      <AlertCircle className='h-4 w-4 text-red-500' />
                    )}
                    {file.status === 'pending' && (
                      <Button
                        size='sm'
                        variant='ghost'
                        onClick={() => removeFile(file.id)}
                        disabled={isUploading}
                      >
                        <X className='h-4 w-4' />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
