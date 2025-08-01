"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Eye, Play, Heart } from "lucide-react"
import type { PortfolioItem } from "@/store/portfolio-store"

interface PortfolioCardProps {
  item: PortfolioItem
  onClick: () => void
  priority?: boolean
  className?: string
  onMount?: (element: HTMLElement, id: string) => void
  adaptiveHeight?: boolean
  variableHeight?: boolean
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
  className = "",
  onMount,
  adaptiveHeight = false,
  variableHeight = false
}: PortfolioCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  const imageSrc = item.thumbnailPath || item.filePath
  const categoryName = item.category?.name || 'Uncategorized'
  const isVideo = item.mediaType === 'VIDEO'

  // Extract dimensions from metadata or use defaults with variable height
  const metadata = item.metadata as { dimensions?: { width: number; height: number } } || {}
  
  // Create variable heights for masonry effect
  const getVariableHeight = (id: string) => {
    const hash = id.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0)
      return a & a
    }, 0)
    
    const variants = [
      { width: 400, height: 280 },  // Short landscape
      { width: 400, height: 360 },  // Medium
      { width: 400, height: 520 },  // Tall portrait  
      { width: 400, height: 420 },  // Medium-tall
      { width: 400, height: 320 },  // Short-medium
      { width: 400, height: 480 },  // Tall
    ]
    
    return variants[Math.abs(hash) % variants.length]
  }
  
  const dimensions = variableHeight ? getVariableHeight(item.id) : (metadata.dimensions || { width: 800, height: 600 })
  const aspectRatio = dimensions.width / dimensions.height

  // Register with masonry layout when mounted
  useEffect(() => {
    if (cardRef.current && onMount) {
      onMount(cardRef.current, item.id)
    }
  }, [item.id, onMount])
  
  return (
    <div 
      ref={cardRef}
      className={`group overflow-hidden cursor-pointer transition-all duration-300 ease-out transform-gpu rounded-lg ${
        isHovered 
          ? 'shadow-xl' 
          : 'shadow-sm hover:shadow-md'
      } ${className}`}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ height: 'auto' }}
    >
      <div className="relative overflow-hidden rounded-lg bg-gray-100">
        <div 
          className="relative"
          style={{ 
            height: variableHeight ? `${dimensions.height}px` : 'auto',
            aspectRatio: !variableHeight ? aspectRatio : undefined
          }}
        >
          {!imageError ? (
            <Image
              src={imageSrc}
              alt={item.title}
              fill={variableHeight}
              width={!variableHeight ? dimensions.width : undefined}
              height={!variableHeight ? dimensions.height : undefined}
              className={`w-full h-full transition-all duration-500 ease-out ${
                variableHeight ? 'object-cover' : 'object-cover'
              } ${
                imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
              } ${
                isHovered ? 'scale-105' : 'scale-100'
              }`}
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, (max-width: 1536px) 20vw, 16vw"
              priority={priority}
              placeholder="blur"
              blurDataURL={generateBlurDataURL()}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
              quality={90}
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <p className="text-gray-500 text-sm">Image not found</p>
            </div>
          )}
          
          {/* Loading skeleton with shimmer effect */}
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 bg-gradient-to-r from-muted via-muted/50 to-muted animate-pulse">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
            </div>
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

          {/* Hover overlay with smooth gradient */}
          <div className={`absolute inset-0 transition-all duration-500 ease-out ${
            isHovered ? 'bg-black/40' : 'bg-black/0'
          }`} />
          
          {/* Content overlay with staggered animation */}
          <div className={`absolute bottom-0 left-0 right-0 p-4 text-white transition-all duration-500 ease-out ${
            isHovered ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
          } bg-gradient-to-t from-black/90 via-black/60 to-transparent`}>
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
      </div>
    </div>
  )
}