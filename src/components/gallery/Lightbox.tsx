'use client';

import { useCallback, useEffect, useState } from 'react';

import Image from 'next/image';

import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  Share2,
  Tag,
  X,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { usePortfolioStore } from '@/store/portfolio-store';

export function Lightbox() {
  const {
    items,
    lightboxOpen,
    lightboxIndex,
    closeLightbox,
    nextImage,
    prevImage,
  } = usePortfolioStore();

  const currentItem = items[lightboxIndex];
  const [imageDimensions, setImageDimensions] = useState({
    width: 0,
    height: 0,
  });
  const [imageLoaded, setImageLoaded] = useState(false);

  // Reset image loaded state when item changes
  useEffect(() => {
    setImageLoaded(false);
    setImageDimensions({ width: 0, height: 0 });
  }, [lightboxIndex]);

  // Handle image load to get actual dimensions
  const handleImageLoad = useCallback(
    (event: React.SyntheticEvent<HTMLImageElement>) => {
      const img = event.currentTarget;
      setImageDimensions({
        width: img.naturalWidth,
        height: img.naturalHeight,
      });
      setImageLoaded(true);
    },
    []
  );

  // Calculate dialog size based on image aspect ratio
  const calculateDialogSize = useCallback(() => {
    if (!imageLoaded || !imageDimensions.width || !imageDimensions.height) {
      return { width: '85vw', height: '85vh' };
    }

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const maxWidth = viewportWidth * 0.85;
    const maxHeight = viewportHeight * 0.85;

    // Reserve space for UI elements
    const headerHeight = 80;
    const footerHeight = 150;
    const padding = 32;
    const availableHeight = maxHeight - headerHeight - footerHeight - padding;
    const availableWidth = maxWidth - padding;

    const imageAspectRatio = imageDimensions.width / imageDimensions.height;

    let imageWidth, imageHeight;

    // Calculate image size that fits within available space
    if (availableWidth / availableHeight > imageAspectRatio) {
      // Available space is wider than image ratio
      imageHeight = availableHeight;
      imageWidth = availableHeight * imageAspectRatio;
    } else {
      // Available space is taller than image ratio
      imageWidth = availableWidth;
      imageHeight = availableWidth / imageAspectRatio;
    }

    // Calculate total dialog size including UI elements
    const dialogWidth = Math.min(imageWidth + padding, maxWidth);
    const dialogHeight = Math.min(
      imageHeight + headerHeight + footerHeight + padding,
      maxHeight
    );

    return {
      width: `${dialogWidth}px`,
      height: `${dialogHeight}px`,
    };
  }, [imageLoaded, imageDimensions]);

  const dialogSize = calculateDialogSize();

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!lightboxOpen) return;

      switch (event.key) {
        case 'Escape':
          closeLightbox();
          break;
        case 'ArrowLeft':
          prevImage();
          break;
        case 'ArrowRight':
          nextImage();
          break;
      }
    },
    [lightboxOpen, closeLightbox, prevImage, nextImage]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Touch gesture handling
  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      const touch = e.touches[0];
      const startX = touch.clientX;

      const handleTouchEnd = (endEvent: TouchEvent) => {
        const endTouch = endEvent.changedTouches[0];
        const deltaX = endTouch.clientX - startX;
        const threshold = 50;

        if (Math.abs(deltaX) > threshold) {
          if (deltaX > 0) {
            prevImage();
          } else {
            nextImage();
          }
        }

        document.removeEventListener('touchend', handleTouchEnd);
      };

      document.addEventListener('touchend', handleTouchEnd);
    },
    [prevImage, nextImage]
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('de-DE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleShare = async () => {
    if (navigator.share && currentItem) {
      try {
        await navigator.share({
          title: currentItem.title,
          text: currentItem.description,
          url: window.location.href,
        });
      } catch {
        // Fallback to copy URL
        navigator.clipboard.writeText(window.location.href);
      }
    }
  };

  const handleDownload = () => {
    if (currentItem) {
      const link = document.createElement('a');
      link.href = currentItem.filePath;
      link.download = `${currentItem.title}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (!currentItem) return null;

  const isVideo = currentItem.mediaType === 'VIDEO';
  const imageSrc = currentItem.filePath;
  const metadata =
    (currentItem.metadata as {
      dimensions?: { width: number; height: number };
      camera?: string;
      lens?: string;
      settings?: string;
      location?: string;
    }) || {};
  const dimensions = metadata.dimensions || { width: 1920, height: 1080 };

  return (
    <Dialog open={lightboxOpen} onOpenChange={closeLightbox}>
      <DialogContent
        className='max-w-none overflow-hidden border-0 bg-black/95 p-0'
        style={{
          width: dialogSize.width,
          height: dialogSize.height,
          maxWidth: '90vw',
          maxHeight: '90vh',
        }}
      >
        <DialogTitle className='sr-only'>{currentItem.title}</DialogTitle>
        <div
          className='relative flex h-full w-full flex-col'
          onTouchStart={handleTouchStart}
        >
          {/* Header with controls */}
          <div className='flex-shrink-0 bg-gradient-to-b from-black/80 to-transparent p-3'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-2 text-white'>
                <h2 className='truncate text-base font-semibold'>
                  {currentItem.title}
                </h2>
                {currentItem.featured && (
                  <Badge
                    variant='secondary'
                    className='border-0 bg-yellow-500/90 text-xs text-white'
                  >
                    Featured
                  </Badge>
                )}
              </div>

              <div className='flex items-center gap-1'>
                <Button
                  variant='ghost'
                  size='icon'
                  className='h-8 w-8 text-white hover:bg-white/20'
                  onClick={handleShare}
                >
                  <Share2 className='h-4 w-4' />
                </Button>

                <Button
                  variant='ghost'
                  size='icon'
                  className='h-8 w-8 text-white hover:bg-white/20'
                  onClick={handleDownload}
                >
                  <Download className='h-4 w-4' />
                </Button>

                <Button
                  variant='ghost'
                  size='icon'
                  className='h-8 w-8 text-white hover:bg-white/20'
                  onClick={closeLightbox}
                >
                  <X className='h-5 w-5' />
                </Button>
              </div>
            </div>
          </div>

          {/* Navigation buttons */}
          {lightboxIndex > 0 && (
            <Button
              variant='ghost'
              size='icon'
              className='absolute top-1/2 left-4 z-10 h-12 w-12 -translate-y-1/2 transform text-white hover:bg-white/20'
              onClick={prevImage}
            >
              <ChevronLeft className='h-8 w-8' />
            </Button>
          )}

          {lightboxIndex < items.length - 1 && (
            <Button
              variant='ghost'
              size='icon'
              className='absolute top-1/2 right-4 z-10 h-12 w-12 -translate-y-1/2 transform text-white hover:bg-white/20'
              onClick={nextImage}
            >
              <ChevronRight className='h-8 w-8' />
            </Button>
          )}

          {/* Main content area */}
          <div className='relative flex min-h-0 flex-1 items-center justify-center px-4'>
            {isVideo ? (
              <video
                src={currentItem.filePath}
                controls
                className='max-h-full max-w-full object-contain'
                autoPlay
              />
            ) : (
              <Image
                src={imageSrc}
                alt={currentItem.title}
                width={dimensions.width}
                height={dimensions.height}
                className='max-h-full max-w-full object-contain'
                sizes='100vw'
                quality={95}
                priority
                onLoad={handleImageLoad}
              />
            )}
          </div>

          {/* Bottom info panel */}
          <div className='flex-shrink-0 bg-gradient-to-t from-black/90 to-transparent p-4'>
            <div className='w-full'>
              <div className='grid grid-cols-1 gap-4 lg:grid-cols-3'>
                {/* Left: Description */}
                <div className='text-white lg:col-span-2'>
                  {currentItem.description && (
                    <p className='mb-3 line-clamp-2 text-xs leading-relaxed opacity-90'>
                      {currentItem.description}
                    </p>
                  )}

                  <div className='flex flex-wrap items-center gap-2'>
                    <Badge
                      variant='secondary'
                      className='border-0 bg-white/20 text-xs text-white'
                    >
                      {currentItem.category?.name || 'Uncategorized'}
                    </Badge>

                    <div className='flex items-center gap-1 text-xs opacity-75'>
                      <Eye className='h-3 w-3' />
                      {currentItem.viewCount}
                    </div>

                    <div className='flex items-center gap-1 text-xs opacity-75'>
                      <Calendar className='h-3 w-3' />
                      {currentItem.publishedAt &&
                        formatDate(currentItem.publishedAt)}
                    </div>

                    <span className='text-xs opacity-60'>
                      {lightboxIndex + 1}/{items.length}
                    </span>
                  </div>
                </div>

                {/* Right: Metadata & Tags */}
                <div className='space-y-2 text-white'>
                  {/* Tags */}
                  {Array.isArray(currentItem.tags) &&
                    currentItem.tags.length > 0 && (
                      <div>
                        <div className='mb-1 flex items-center gap-1'>
                          <Tag className='h-3 w-3' />
                          <span className='text-xs font-medium'>Tags</span>
                        </div>
                        <div className='flex flex-wrap gap-1'>
                          {currentItem.tags.slice(0, 4).map((tag, index) => (
                            <Badge
                              key={index}
                              variant='outline'
                              className='border-white/20 bg-white/10 text-xs text-white'
                            >
                              {String(tag)}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                  {/* Camera info */}
                  {metadata.camera && (
                    <div className='space-y-0.5 text-xs opacity-75'>
                      <div>📷 {String(metadata.camera)}</div>
                      {metadata.location && (
                        <div>📍 {String(metadata.location)}</div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Loading indicator for next/prev preload */}
          <div className='pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform'>
            {/* Could add loading spinner here if needed */}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
