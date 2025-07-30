/**
 * Image Processing Pipeline with Sharp
 * Handles image optimization, resizing, format conversion, and thumbnail generation
 */
import sharp from 'sharp';

import {
  FileMetadata,
  ProcessedFile,
  StorageManager,
  storageManager,
} from './storage';

export interface ImageProcessingOptions {
  quality?: number;
  maxWidth?: number;
  maxHeight?: number;
  thumbnailSize?: number;
  generateWebP?: boolean;
  generateAVIF?: boolean;
  preserveMetadata?: boolean;
}

export interface ImageDimensions {
  width: number;
  height: number;
  aspectRatio: number;
}

export const DEFAULT_PROCESSING_OPTIONS: ImageProcessingOptions = {
  quality: 85,
  maxWidth: 2400,
  maxHeight: 2400,
  thumbnailSize: 400,
  generateWebP: true,
  generateAVIF: true,
  preserveMetadata: false,
};

export class ImageProcessor {
  private storage: StorageManager;
  private options: ImageProcessingOptions;

  constructor(
    storage: StorageManager,
    options: Partial<ImageProcessingOptions> = {}
  ) {
    this.storage = storage;
    this.options = { ...DEFAULT_PROCESSING_OPTIONS, ...options };
  }

  /**
   * Get image dimensions and metadata from buffer
   */
  async getImageInfo(
    buffer: Buffer
  ): Promise<ImageDimensions & { format: string; hasAlpha: boolean }> {
    const image = sharp(buffer);
    const metadata = await image.metadata();

    if (!metadata.width || !metadata.height) {
      throw new Error('Unable to determine image dimensions');
    }

    return {
      width: metadata.width,
      height: metadata.height,
      aspectRatio: metadata.width / metadata.height,
      format: metadata.format || 'unknown',
      hasAlpha: metadata.hasAlpha || false,
    };
  }

  /**
   * Optimize image while preserving aspect ratio
   */
  async optimizeImage(
    buffer: Buffer,
    options?: Partial<ImageProcessingOptions>
  ): Promise<Buffer> {
    const opts = { ...this.options, ...options };
    let image = sharp(buffer);

    // Get original dimensions
    const metadata = await image.metadata();
    if (!metadata.width || !metadata.height) {
      throw new Error('Unable to determine image dimensions');
    }

    // Resize if needed
    if (metadata.width > opts.maxWidth! || metadata.height > opts.maxHeight!) {
      image = image.resize(opts.maxWidth, opts.maxHeight, {
        fit: 'inside',
        withoutEnlargement: true,
      });
    }

    // Remove metadata unless explicitly preserved
    if (!opts.preserveMetadata) {
      image = image.rotate(); // Auto-rotate based on EXIF and remove EXIF data
    }

    // Optimize based on format
    if (metadata.format === 'jpeg') {
      image = image.jpeg({
        quality: opts.quality,
        progressive: true,
        mozjpeg: true,
      });
    } else if (metadata.format === 'png') {
      image = image.png({
        quality: opts.quality,
        progressive: true,
        compressionLevel: 9,
        palette: true,
      });
    } else if (metadata.format === 'webp') {
      image = image.webp({
        quality: opts.quality,
        effort: 6,
      });
    }

    return await image.toBuffer();
  }

  /**
   * Generate thumbnail
   */
  async generateThumbnail(buffer: Buffer, size?: number): Promise<Buffer> {
    const thumbnailSize = size || this.options.thumbnailSize!;

    return await sharp(buffer)
      .resize(thumbnailSize, thumbnailSize, {
        fit: 'cover',
        position: 'center',
      })
      .jpeg({
        quality: 80,
        progressive: true,
      })
      .toBuffer();
  }

  /**
   * Convert image to WebP format
   */
  async convertToWebP(buffer: Buffer, quality?: number): Promise<Buffer> {
    return await sharp(buffer)
      .webp({
        quality: quality || this.options.quality,
        effort: 6,
      })
      .toBuffer();
  }

  /**
   * Convert image to AVIF format
   */
  async convertToAVIF(buffer: Buffer, quality?: number): Promise<Buffer> {
    return await sharp(buffer)
      .avif({
        quality: quality || this.options.quality,
        effort: 4,
      })
      .toBuffer();
  }

  /**
   * Process single image file - creates optimized version, thumbnail, and format variants
   */
  async processImage(
    buffer: Buffer,
    originalName: string,
    mimeType: string,
    options?: Partial<ImageProcessingOptions>
  ): Promise<ProcessedFile> {
    const opts = { ...this.options, ...options };

    // Get image info
    const imageInfo = await this.getImageInfo(buffer);

    // Generate file names
    const baseName = this.storage.generateFileName(originalName);
    const baseNameWithoutExt = baseName.replace(/\.[^.]+$/, '');

    // Process original image (optimize)
    const optimizedBuffer = await this.optimizeImage(buffer, opts);
    const originalPath = await this.storage.saveFile(
      optimizedBuffer,
      baseName,
      'originals'
    );

    const result: ProcessedFile = {
      original: {
        originalName,
        fileName: baseName,
        mimeType,
        size: optimizedBuffer.length,
        width: imageInfo.width,
        height: imageInfo.height,
        aspectRatio: imageInfo.aspectRatio,
      },
      publicPath: this.storage.getPublicUrl(baseName, 'originals'),
    };

    // Generate thumbnail
    try {
      const thumbnailBuffer = await this.generateThumbnail(optimizedBuffer);
      const thumbnailName = `${baseNameWithoutExt}_thumb.jpg`;
      await this.storage.saveFile(thumbnailBuffer, thumbnailName, 'thumbnails');

      result.thumbnail = {
        originalName: `${originalName}_thumbnail`,
        fileName: thumbnailName,
        mimeType: 'image/jpeg',
        size: thumbnailBuffer.length,
        width: opts.thumbnailSize,
        height: opts.thumbnailSize,
        aspectRatio: 1,
      };
      result.thumbnailPath = this.storage.getPublicUrl(
        thumbnailName,
        'thumbnails'
      );
    } catch (error) {
      console.warn('Failed to generate thumbnail:', error);
    }

    // Generate WebP version
    if (opts.generateWebP) {
      try {
        const webpBuffer = await this.convertToWebP(optimizedBuffer);
        const webpName = `${baseNameWithoutExt}.webp`;
        await this.storage.saveFile(webpBuffer, webpName, 'webp');

        result.webp = {
          originalName: `${originalName}.webp`,
          fileName: webpName,
          mimeType: 'image/webp',
          size: webpBuffer.length,
          width: imageInfo.width,
          height: imageInfo.height,
          aspectRatio: imageInfo.aspectRatio,
        };
        result.webpPath = this.storage.getPublicUrl(webpName, 'webp');
      } catch (error) {
        console.warn('Failed to generate WebP:', error);
      }
    }

    // Generate AVIF version
    if (opts.generateAVIF) {
      try {
        const avifBuffer = await this.convertToAVIF(optimizedBuffer);
        const avifName = `${baseNameWithoutExt}.avif`;
        await this.storage.saveFile(avifBuffer, avifName, 'avif');

        result.avif = {
          originalName: `${originalName}.avif`,
          fileName: avifName,
          mimeType: 'image/avif',
          size: avifBuffer.length,
          width: imageInfo.width,
          height: imageInfo.height,
          aspectRatio: imageInfo.aspectRatio,
        };
        result.avifPath = this.storage.getPublicUrl(avifName, 'avif');
      } catch (error) {
        console.warn('Failed to generate AVIF:', error);
      }
    }

    return result;
  }

  /**
   * Process multiple images in parallel
   */
  async processImages(
    files: Array<{ buffer: Buffer; originalName: string; mimeType: string }>,
    options?: Partial<ImageProcessingOptions>
  ): Promise<ProcessedFile[]> {
    const results = await Promise.allSettled(
      files.map(file =>
        this.processImage(
          file.buffer,
          file.originalName,
          file.mimeType,
          options
        )
      )
    );

    const processedFiles: ProcessedFile[] = [];
    const errors: string[] = [];

    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        processedFiles.push(result.value);
      } else {
        errors.push(
          `Failed to process ${files[index].originalName}: ${result.reason.message}`
        );
      }
    });

    if (errors.length > 0) {
      console.warn('Image processing errors:', errors);
    }

    return processedFiles;
  }

  /**
   * Generate responsive image sizes for a single image
   */
  async generateResponsiveSizes(
    buffer: Buffer,
    originalName: string,
    sizes: number[] = [400, 800, 1200, 1600]
  ): Promise<Array<{ size: number; buffer: Buffer; fileName: string }>> {
    const results: Array<{ size: number; buffer: Buffer; fileName: string }> =
      [];
    const baseNameWithoutExt = this.storage
      .generateFileName(originalName)
      .replace(/\.[^.]+$/, '');

    for (const size of sizes) {
      try {
        const resizedBuffer = await sharp(buffer)
          .resize(size, null, {
            fit: 'inside',
            withoutEnlargement: true,
          })
          .jpeg({ quality: 85, progressive: true })
          .toBuffer();

        results.push({
          size,
          buffer: resizedBuffer,
          fileName: `${baseNameWithoutExt}_${size}w.jpg`,
        });
      } catch (error) {
        console.warn(`Failed to generate ${size}px version:`, error);
      }
    }

    return results;
  }

  /**
   * Extract dominant colors from image
   */
  async extractDominantColors(
    buffer: Buffer,
    count: number = 5
  ): Promise<string[]> {
    try {
      const { dominant } = await sharp(buffer)
        .resize(100, 100, { fit: 'cover' })
        .raw()
        .toBuffer({ resolveWithObject: true });

      // This is a simplified implementation
      // In a real app, you might want to use a more sophisticated color extraction library
      const r = dominant.r || 0;
      const g = dominant.g || 0;
      const b = dominant.b || 0;

      return [`rgb(${r}, ${g}, ${b})`];
    } catch (error) {
      console.warn('Failed to extract colors:', error);
      return [];
    }
  }

  /**
   * Cleanup processed files for a given base name
   */
  async cleanupProcessedFiles(baseName: string): Promise<void> {
    await this.storage.deleteFileVariants(baseName);
  }
}

// Global image processor instance
export const imageProcessor = new ImageProcessor(storageManager);

export default ImageProcessor;
