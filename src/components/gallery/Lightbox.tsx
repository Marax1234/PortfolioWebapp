"use client"

import Image from "next/image"
import { useEffect, useCallback } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { usePortfolioStore } from "@/store/portfolio-store"
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Eye, 
  Calendar, 
  Tag,
  Download,
  Share2
} from "lucide-react"

export function Lightbox() {
  const {
    items,
    lightboxOpen,
    lightboxIndex,
    closeLightbox,
    nextImage,
    prevImage
  } = usePortfolioStore()

  const currentItem = items[lightboxIndex]

  // Keyboard navigation
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!lightboxOpen) return

    switch (event.key) {
      case 'Escape':
        closeLightbox()
        break
      case 'ArrowLeft':
        prevImage()
        break
      case 'ArrowRight':
        nextImage()
        break
    }
  }, [lightboxOpen, closeLightbox, prevImage, nextImage])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  // Touch gesture handling
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0]
    const startX = touch.clientX
    
    const handleTouchEnd = (endEvent: TouchEvent) => {
      const endTouch = endEvent.changedTouches[0]
      const deltaX = endTouch.clientX - startX
      const threshold = 50

      if (Math.abs(deltaX) > threshold) {
        if (deltaX > 0) {
          prevImage()
        } else {
          nextImage()
        }
      }
      
      document.removeEventListener('touchend', handleTouchEnd)
    }

    document.addEventListener('touchend', handleTouchEnd)
  }, [prevImage, nextImage])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('de-DE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const handleShare = async () => {
    if (navigator.share && currentItem) {
      try {
        await navigator.share({
          title: currentItem.title,
          text: currentItem.description,
          url: window.location.href
        })
      } catch {
        // Fallback to copy URL
        navigator.clipboard.writeText(window.location.href)
      }
    }
  }

  const handleDownload = () => {
    if (currentItem) {
      const link = document.createElement('a')
      link.href = currentItem.filePath
      link.download = `${currentItem.title}.jpg`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  if (!currentItem) return null

  const isVideo = currentItem.mediaType === 'VIDEO'
  const imageSrc = currentItem.filePath
  const metadata = currentItem.metadata as { 
    dimensions?: { width: number; height: number }
    camera?: string
    lens?: string
    settings?: string
    location?: string
  } || {}
  const dimensions = metadata.dimensions || { width: 1920, height: 1080 }

  return (
    <Dialog open={lightboxOpen} onOpenChange={closeLightbox}>
      <DialogContent className="max-w-screen-2xl w-full h-full p-0 bg-black/95 border-0">
        <div 
          className="relative w-full h-full flex items-center justify-center"
          onTouchStart={handleTouchStart}
        >
          {/* Header with controls */}
          <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/80 to-transparent p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-white">
                <h2 className="font-semibold text-lg">{currentItem.title}</h2>
                {currentItem.featured && (
                  <Badge variant="secondary" className="bg-yellow-500/90 text-white border-0">
                    Featured
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20"
                  onClick={handleShare}
                >
                  <Share2 className="h-5 w-5" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20"
                  onClick={handleDownload}
                >
                  <Download className="h-5 w-5" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20"
                  onClick={closeLightbox}
                >
                  <X className="h-6 w-6" />
                </Button>
              </div>
            </div>
          </div>

          {/* Navigation buttons */}
          {lightboxIndex > 0 && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 text-white hover:bg-white/20 h-12 w-12"
              onClick={prevImage}
            >
              <ChevronLeft className="h-8 w-8" />
            </Button>
          )}

          {lightboxIndex < items.length - 1 && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 text-white hover:bg-white/20 h-12 w-12"
              onClick={nextImage}
            >
              <ChevronRight className="h-8 w-8" />
            </Button>
          )}

          {/* Main content area */}
          <div className="relative w-full h-full flex items-center justify-center p-16">
            {isVideo ? (
              <video
                src={currentItem.filePath}
                controls
                className="max-w-full max-h-full object-contain"
                autoPlay
              />
            ) : (
              <Image
                src={imageSrc}
                alt={currentItem.title}
                width={dimensions.width}
                height={dimensions.height}
                className="max-w-full max-h-full object-contain"
                sizes="100vw"
                quality={95}
                priority
              />
            )}
          </div>

          {/* Bottom info panel */}
          <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/90 to-transparent p-6">
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: Description */}
                <div className="lg:col-span-2 text-white">
                  {currentItem.description && (
                    <p className="text-sm opacity-90 mb-4 leading-relaxed">
                      {currentItem.description}
                    </p>
                  )}
                  
                  <div className="flex flex-wrap items-center gap-3">
                    <Badge variant="secondary" className="bg-white/20 text-white border-0">
                      {currentItem.category?.name || 'Uncategorized'}
                    </Badge>
                    
                    <div className="flex items-center gap-1 text-xs opacity-75">
                      <Eye className="h-3 w-3" />
                      {currentItem.viewCount} views
                    </div>
                    
                    <div className="flex items-center gap-1 text-xs opacity-75">
                      <Calendar className="h-3 w-3" />
                      {currentItem.publishedAt && formatDate(currentItem.publishedAt)}
                    </div>
                    
                    <span className="text-xs opacity-60">
                      {lightboxIndex + 1} of {items.length}
                    </span>
                  </div>
                </div>

                {/* Right: Metadata & Tags */}
                <div className="text-white space-y-4">
                  {/* Tags */}
                  {Array.isArray(currentItem.tags) && currentItem.tags.length > 0 && (
                    <div>
                      <div className="flex items-center gap-1 mb-2">
                        <Tag className="h-3 w-3" />
                        <span className="text-xs font-medium">Tags</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {currentItem.tags.slice(0, 6).map((tag, index) => (
                          <Badge 
                            key={index} 
                            variant="outline" 
                            className="text-xs bg-white/10 text-white border-white/20"
                          >
                            {String(tag)}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Camera info */}
                  {metadata.camera && (
                    <div className="text-xs opacity-75 space-y-1">
                      <div>📷 {String(metadata.camera)}</div>
                      {metadata.lens && (
                        <div>🔍 {String(metadata.lens)}</div>
                      )}
                      {metadata.settings && (
                        <div>⚙️ {String(metadata.settings)}</div>
                      )}
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
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            {/* Could add loading spinner here if needed */}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}