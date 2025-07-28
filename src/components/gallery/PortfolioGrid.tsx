"use client"

import { useEffect, useCallback, useRef, useState } from "react"
import { usePortfolioStore } from "@/store/portfolio-store"
import { usePortfolioApi } from "@/lib/portfolio-api"
import { useMasonry } from "@/hooks/useMasonry"
import { Button } from "@/components/ui/button"
import { Loader2, Grid, LayoutGrid, Filter } from "lucide-react"
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
  enableInfiniteScroll = true,
  showViewToggle = true,
  showFilters: _showFilters = true
}: PortfolioGridProps) {
  const {
    items,
    isLoading,
    isLoadingMore,
    error,
    view,
    pagination,
    lightboxOpen,
    setView,
    openLightbox,
    incrementViewCount
  } = usePortfolioStore()

  const { loadPortfolioItems, loadMoreItems } = usePortfolioApi()
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  
  // Masonry layout hook
  const { containerRef, isLoading: isMasonryLoading, addItem, recalculate } = useMasonry({
    gap: 24,
    minColumnWidth: 280,
    maxColumns: 5,
    responsive: {
      640: { columns: 1, gap: 16 },    // sm - single column on mobile
      768: { columns: 2, gap: 20 },    // md
      1024: { columns: 3, gap: 24 },   // lg  
      1280: { columns: 4, gap: 28 },   // xl
      1536: { columns: 5, gap: 32 },   // 2xl
    }
  })

  const observerRef = useRef<IntersectionObserver | null>(null)
  const loadMoreRef = useRef<HTMLDivElement>(null)

  // Initial load
  useEffect(() => {
    if (items.length === 0) {
      loadPortfolioItems().finally(() => setIsInitialLoad(false))
    } else {
      setIsInitialLoad(false)
    }
  }, [loadPortfolioItems, items.length])

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

  const getGridClassName = () => {
    if (view === 'masonry') {
      return "masonry-container" // Custom class for masonry layout
    }
    return "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6"
  }

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
    <div className={`space-y-6 ${className}`}>
      {/* Header with View Toggle */}
      {showViewToggle && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {pagination ? `${pagination.total} items` : `${items.length} items`}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={view === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setView('grid')}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={view === 'masonry' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setView('masonry')}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

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

      {/* Portfolio Grid */}
      {items.length > 0 && (
        <div className="relative">
          <div 
            ref={view === 'masonry' ? containerRef : null}
            className={`
              ${getGridClassName()} 
              ${view === 'masonry' ? 'min-h-[400px]' : ''} 
              transition-all duration-500 ease-out
            `}
          >
            {items.map((item, index) => (
              <div
                key={`${item.id}-${view}`} // Key change triggers re-mount for smooth transition
                className={`
                  ${view === 'masonry' ? 'masonry-item' : ''} 
                  transition-all duration-500 ease-out
                  ${isInitialLoad ? 'opacity-0 translate-y-4 scale-95' : 'opacity-100 translate-y-0 scale-100'}
                  hover:scale-[1.02] hover:z-10
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
                  adaptiveHeight={view === 'masonry'}
                  priority={index < 6} // Prioritize first 6 images
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
      {!isLoading && items.length === 0 && (
        <div className="text-center py-12">
          <Filter className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground mb-2">No portfolio items found</p>
          <p className="text-sm text-muted-foreground">
            Try adjusting your filters or check back later.
          </p>
        </div>
      )}

      {/* Lightbox */}
      {lightboxOpen && <Lightbox />}
    </div>
  )
}