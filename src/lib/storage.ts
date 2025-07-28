/**
 * File Storage Utilities
 * Handles file upload, storage, and management for portfolio items
 */

import { promises as fs } from 'fs'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

export interface StorageConfig {
  maxFileSize: number // in bytes
  allowedImageTypes: string[]
  allowedVideoTypes: string[]
  uploadDir: string
  publicDir: string
}

export const DEFAULT_STORAGE_CONFIG: StorageConfig = {
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedImageTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif'],
  allowedVideoTypes: ['video/mp4', 'video/quicktime', 'video/x-msvideo'],
  uploadDir: 'uploads/portfolio',
  publicDir: path.join(process.cwd(), 'public/uploads/portfolio')
}

export interface FileMetadata {
  originalName: string
  fileName: string
  mimeType: string
  size: number
  width?: number
  height?: number
  aspectRatio?: number
}

export interface ProcessedFile {
  original: FileMetadata
  thumbnail?: FileMetadata
  webp?: FileMetadata
  avif?: FileMetadata
  publicPath: string
  thumbnailPath?: string
  webpPath?: string
  avifPath?: string
  mediaType?: 'IMAGE' | 'VIDEO'
}

export class StorageManager {
  private config: StorageConfig

  constructor(config: Partial<StorageConfig> = {}) {
    this.config = { ...DEFAULT_STORAGE_CONFIG, ...config }
  }

  /**
   * Initialize storage directories
   */
  async initializeDirectories(): Promise<void> {
    console.log('Initializing storage directories with config:', this.config)
    
    const directories = [
      this.config.publicDir,
      path.join(this.config.publicDir, 'originals'),
      path.join(this.config.publicDir, 'thumbnails'),
      path.join(this.config.publicDir, 'webp'),
      path.join(this.config.publicDir, 'avif'),
      path.join(this.config.publicDir, 'temp')
    ]

    console.log('Creating directories:', directories)

    for (const dir of directories) {
      try {
        await fs.access(dir)
        console.log('Directory exists:', dir)
      } catch {
        console.log('Creating directory:', dir)
        await fs.mkdir(dir, { recursive: true })
      }
    }
  }

  /**
   * Validate file type and size
   */
  validateFile(file: File): { isValid: boolean; error?: string } {
    // Check file size
    if (file.size > this.config.maxFileSize) {
      return {
        isValid: false,
        error: `File size exceeds maximum allowed size of ${Math.round(this.config.maxFileSize / 1024 / 1024)}MB`
      }
    }

    // Check file type
    const isImage = this.config.allowedImageTypes.includes(file.type)
    const isVideo = this.config.allowedVideoTypes.includes(file.type)

    if (!isImage && !isVideo) {
      return {
        isValid: false,
        error: `Unsupported file type. Allowed types: ${[
          ...this.config.allowedImageTypes,
          ...this.config.allowedVideoTypes
        ].join(', ')}`
      }
    }

    return { isValid: true }
  }

  /**
   * Generate unique file name with timestamp
   */
  generateFileName(originalName: string, suffix?: string): string {
    const ext = path.extname(originalName).toLowerCase()
    const baseName = path.basename(originalName, ext)
      .replace(/[^a-zA-Z0-9-_]/g, '_')
      .toLowerCase()
    
    const timestamp = Date.now()
    const uuid = uuidv4().split('-')[0] // Short UUID
    const suffixPart = suffix ? `_${suffix}` : ''
    
    return `${baseName}_${timestamp}_${uuid}${suffixPart}${ext}`
  }

  /**
   * Save file buffer to disk
   */
  async saveFile(
    buffer: Buffer, 
    fileName: string, 
    subDir: 'originals' | 'thumbnails' | 'webp' | 'avif' | 'temp' = 'originals'
  ): Promise<string> {
    const filePath = path.join(this.config.publicDir, subDir, fileName)
    console.log('Saving file:', { fileName, subDir, filePath, bufferSize: buffer.length })
    
    try {
      await fs.writeFile(filePath, buffer)
      console.log('File saved successfully:', filePath)
      return filePath
    } catch (error) {
      console.error('Failed to save file:', { filePath, error })
      throw error
    }
  }

  /**
   * Get public URL for a file
   */
  getPublicUrl(fileName: string, subDir: 'originals' | 'thumbnails' | 'webp' | 'avif' = 'originals'): string {
    return `/${this.config.uploadDir}/${subDir}/${fileName}`
  }

  /**
   * Delete file from storage
   */
  async deleteFile(filePath: string): Promise<void> {
    try {
      await fs.unlink(filePath)
    } catch (error) {
      // File doesn't exist or permission error - log but don't throw
      console.warn(`Failed to delete file ${filePath}:`, error)
    }
  }

  /**
   * Delete all variants of a file (original, thumbnail, webp, avif)
   */
  async deleteFileVariants(baseName: string): Promise<void> {
    const variants = [
      path.join(this.config.publicDir, 'originals', baseName),
      path.join(this.config.publicDir, 'thumbnails', baseName),
      path.join(this.config.publicDir, 'webp', baseName.replace(/\.[^.]+$/, '.webp')),
      path.join(this.config.publicDir, 'avif', baseName.replace(/\.[^.]+$/, '.avif'))
    ]

    await Promise.allSettled(variants.map(variant => this.deleteFile(variant)))
  }

  /**
   * Get file metadata from buffer
   */
  async getFileMetadata(buffer: Buffer, originalName: string, mimeType: string): Promise<FileMetadata> {
    let width: number | undefined
    let height: number | undefined
    let aspectRatio: number | undefined

    // For images, we'll get dimensions in the image processing step
    // For now, just return basic metadata
    return {
      originalName,
      fileName: this.generateFileName(originalName),
      mimeType,
      size: buffer.length,
      width,
      height,
      aspectRatio
    }
  }

  /**
   * Clean up temporary files older than specified hours
   */
  async cleanupTempFiles(hoursOld: number = 24): Promise<void> {
    const tempDir = path.join(this.config.publicDir, 'temp')
    const cutoffTime = Date.now() - (hoursOld * 60 * 60 * 1000)

    try {
      const files = await fs.readdir(tempDir)
      
      for (const file of files) {
        const filePath = path.join(tempDir, file)
        const stats = await fs.stat(filePath)
        
        if (stats.mtime.getTime() < cutoffTime) {
          await this.deleteFile(filePath)
        }
      }
    } catch (error) {
      console.warn('Failed to cleanup temp files:', error)
    }
  }

  /**
   * Get storage usage statistics
   */
  async getStorageStats(): Promise<{
    totalFiles: number
    totalSize: number
    byType: Record<string, { count: number; size: number }>
  }> {
    const stats = {
      totalFiles: 0,
      totalSize: 0,
      byType: {} as Record<string, { count: number; size: number }>
    }

    const dirs = ['originals', 'thumbnails', 'webp', 'avif']
    
    for (const dir of dirs) {
      const dirPath = path.join(this.config.publicDir, dir)
      
      try {
        const files = await fs.readdir(dirPath)
        
        for (const file of files) {
          const filePath = path.join(dirPath, file)
          const fileStat = await fs.stat(filePath)
          
          stats.totalFiles++
          stats.totalSize += fileStat.size
          
          if (!stats.byType[dir]) {
            stats.byType[dir] = { count: 0, size: 0 }
          }
          
          stats.byType[dir].count++
          stats.byType[dir].size += fileStat.size
        }
      } catch (error) {
        // Directory doesn't exist or permission error
        continue
      }
    }

    return stats
  }
}

// Global storage manager instance
export const storageManager = new StorageManager()

// Initialize directories on module load
storageManager.initializeDirectories().catch(console.error)

export default StorageManager