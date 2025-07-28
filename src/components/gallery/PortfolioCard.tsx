"use client"

import Image from "next/image"
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Eye, Play, Heart } from "lucide-react"
import type { PortfolioItem } from "@/store/portfolio-store"

interface PortfolioCardProps {
  item: PortfolioItem
  onClick: () => void
  priority?: boolean
  className?: string
}

function generateBlurDataURL(width: number = 10, height: number = 10): string {
  // Simple blur placeholder - in production, generate actual blur placeholders
  const canvas = typeof window !== 'undefined' ? document.createElement('canvas') : null
  if (!canvas) return ''
  
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) return ''
  
  ctx.fillStyle = '#f3f4f6'
  ctx.fillRect(0, 0, width, height)
  
  return canvas.toDataURL()
}

export function PortfolioCard({ 
  item, 
  onClick, 
  priority = false,
  className = ""
}: PortfolioCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)

  const imageSrc = item.thumbnailPath || item.filePath
  const categoryName = item.category?.name || 'Uncategorized'
  const isVideo = item.mediaType === 'VIDEO'

  // Extract dimensions from metadata or use defaults
  const metadata = item.metadata as { dimensions?: { width: number; height: number } } || {}
  const dimensions = metadata.dimensions || { width: 800, height: 600 }
  
  return (
    <Card 
      className={`group overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1 ${className}`}
      onClick={onClick}
    >
      <CardContent className="p-0">
        <div className="relative overflow-hidden bg-muted/30">
          {!imageError ? (
            <Image
              src={imageSrc}
              alt={item.title}
              width={dimensions.width}
              height={dimensions.height}
              className={`w-full h-auto object-cover transition-all duration-300 group-hover:scale-110 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              sizes="(
                max-width: 640px) 100vw, 
                (max-width: 1024px) 50vw, 
                (max-width: 1280px) 33vw, 
                25vw
              "
              priority={priority}
              placeholder="blur"
              blurDataURL={generateBlurDataURL()}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
              quality={85}
            />
          ) : (
            <div className="w-full aspect-[4/3] bg-muted flex items-center justify-center">
              <p className="text-muted-foreground text-sm">Image not found</p>
            </div>
          )}
          
          {/* Loading skeleton */}
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 bg-muted animate-pulse" />
          )}

          {/* Media type indicator */}
          {isVideo && (
            <div className="absolute top-2 right-2">
              <Badge variant="secondary" className="bg-black/70 text-white border-0">
                <Play className="h-3 w-3 mr-1" />
                Video
              </Badge>
            </div>
          )}

          {/* Featured indicator */}
          {item.featured && (
            <div className="absolute top-2 left-2">
              <Badge variant="secondary" className="bg-yellow-500/90 text-white border-0">
                <Heart className="h-3 w-3 mr-1" />
                Featured
              </Badge>
            </div>
          )}

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300" />
          
          {/* Content overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black/80 to-transparent">
            <h3 className="font-semibold text-sm mb-1 line-clamp-1">{item.title}</h3>
            
            {item.description && (
              <p className="text-xs opacity-90 mb-2 line-clamp-2">{item.description}</p>
            )}
            
            <div className="flex items-center justify-between">
              <Badge variant="secondary" className="bg-white/20 text-white border-0 backdrop-blur-sm">
                {categoryName}
              </Badge>
              
              {item.viewCount > 0 && (
                <div className="flex items-center gap-1 text-xs opacity-75">
                  <Eye className="h-3 w-3" />
                  {item.viewCount}
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}