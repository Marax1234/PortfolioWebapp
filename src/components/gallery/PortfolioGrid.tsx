"use client"

import { useEffect, useCallback, useRef, useState } from "react"
import { usePortfolioStore } from "@/store/portfolio-store"
import { usePortfolioApi } from "@/lib/portfolio-api"
import { useMasonry } from "@/hooks/useMasonry"
import { Button } from "@/components/ui/button"
import { Loader2, Filter } from "lucide-react"
import { PortfolioCard } from "./PortfolioCard"
import { Lightbox } from "./Lightbox"

interface PortfolioGridProps {
  className?: string
  enableInfiniteScroll?: boolean
  showViewToggle?: boolean
  showFilters?: boolean
}

export function PortfolioGrid({ 
  className = "",
  enableInfiniteScroll = true
}: PortfolioGridProps) {
  const {
    items,
    isLoading,
    isLoadingMore,
    error,
    pagination,
    lightboxOpen,
    openLightbox,
    incrementViewCount
  } = usePortfolioStore()
  
  // Force masonry view for clean layout
  const view = 'masonry'

  const { loadPortfolioItems, loadMoreItems } = usePortfolioApi()
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  
  
  // Masonry layout hook with minimal gaps
  const { containerRef, isLoading: isMasonryLoading, addItem, recalculate } = useMasonry({
    gap: 8,
    minColumnWidth: 250,
    maxColumns: 5,
    responsive: {
      640: { columns: 2, gap: 6 },     // sm - two columns on mobile
      768: { columns: 3, gap: 8 },     // md
      1024: { columns: 4, gap: 8 },    // lg  
      1280: { columns: 5, gap: 10 },   // xl
      1536: { columns: 6, gap: 12 },   // 2xl
    }
  })

  const observerRef = useRef<IntersectionObserver | null>(null)
  const loadMoreRef = useRef<HTMLDivElement>(null)

  // Initial load - simplified and more reliable
  useEffect(() => {
    loadPortfolioItems().finally(() => {
      setIsInitialLoad(false)
    })
  }, [loadPortfolioItems])

  // Recalculate masonry when items change or view changes
  useEffect(() => {
    if (items.length > 0 && view === 'masonry') {
      // Small delay to ensure DOM is updated
      const timeout = setTimeout(() => {
        recalculate()
      }, 100)
      return () => clearTimeout(timeout)
    }
  }, [items, view, recalculate])

  // Handle view mode changes
  useEffect(() => {
    if (view === 'masonry') {
      recalculate()
    }
  }, [view, recalculate])

  // Infinite scroll setup
  const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
    const [entry] = entries
    if (entry.isIntersecting && !isLoadingMore && pagination?.hasNext) {
      loadMoreItems()
    }
  }, [isLoadingMore, pagination?.hasNext, loadMoreItems])

  useEffect(() => {
    if (!enableInfiniteScroll || !loadMoreRef.current) return

    observerRef.current = new IntersectionObserver(handleIntersection, {
      threshold: 0.1,
      rootMargin: '100px'
    })

    observerRef.current.observe(loadMoreRef.current)

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [handleIntersection, enableInfiniteScroll])

  const handleItemClick = useCallback((index: number, itemId: string) => {
    incrementViewCount(itemId)
    openLightbox(index)
  }, [incrementViewCount, openLightbox])

  const handleItemMount = useCallback((element: HTMLElement, id: string) => {
    if (view === 'masonry') {
      addItem(element, id)
    }
  }, [addItem, view])


  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">{error}</p>
        <Button onClick={() => loadPortfolioItems()} variant="outline">
          Try Again
        </Button>
      </div>
    )
  }

  
  return (
    <div className={`${className}`}>

      {/* Loading State */}
      {(isLoading && items.length === 0) || isInitialLoad && (
        <div className="text-center py-12">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">Loading portfolio items...</p>
        </div>
      )}

      {/* Masonry Loading Overlay */}
      {view === 'masonry' && isMasonryLoading && items.length > 0 && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-10">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">Organizing layout...</span>
          </div>
        </div>
      )}


      {/* Portfolio Grid - Masonry Layout */}
      {items.length > 0 && (
        <div className="relative">
          <div 
            ref={containerRef}
            className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 xl:columns-6 gap-2"
          >
            {items.map((item, index) => (
              <div
                key={`portfolio-item-${item.id}-${index}`}
                className={`
                  break-inside-avoid mb-2 w-full
                  transition-all duration-300 ease-out
                  ${isInitialLoad ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}
                  hover:scale-[1.01] hover:z-10
                `}
                style={
                  !isInitialLoad ? { 
                    transitionDelay: `${Math.min(index * 30, 800)}ms` 
                  } : undefined
                }
              >
                <PortfolioCard
                  item={item}
                  onClick={() => handleItemClick(index, item.id)}
                  onMount={handleItemMount}
                  adaptiveHeight={true}
                  priority={index < 8}
                  variableHeight={true}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Load More Trigger (for Infinite Scroll) */}
      {enableInfiniteScroll && pagination?.hasNext && (
        <div ref={loadMoreRef} className="text-center py-8">
          {isLoadingMore && (
            <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
          )}
        </div>
      )}

      {/* Load More Button (fallback) */}
      {!enableInfiniteScroll && pagination?.hasNext && (
        <div className="text-center py-8">
          <Button
            onClick={loadMoreItems}
            disabled={isLoadingMore}
            variant="outline"
          >
            {isLoadingMore && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            Load More
          </Button>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !isInitialLoad && items.length === 0 && (
        <div className="text-center py-12">
          <Filter className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground mb-2">No portfolio items found</p>
          <p className="text-sm text-muted-foreground">
            Try adjusting your filters or check back later.
          </p>
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-4 p-4 bg-gray-100 rounded text-xs text-left max-w-md mx-auto">
              <strong>Debug Info:</strong><br/>
              Items: {items.length}<br/>
              Loading: {isLoading.toString()}<br/>
              Initial Load: {isInitialLoad.toString()}<br/>
              Error: {error || 'none'}<br/>
              Pagination: {pagination ? `Page ${pagination.page}/${pagination.totalPages}` : 'none'}
            </div>
          )}
        </div>
      )}

      {/* Lightbox */}
      {lightboxOpen && <Lightbox />}
    </div>
  )
}