"use client"

import { useEffect, useCallback, useRef } from "react"
import { usePortfolioStore } from "@/store/portfolio-store"
import { usePortfolioApi } from "@/lib/portfolio-api"
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
  const observerRef = useRef<IntersectionObserver | null>(null)
  const loadMoreRef = useRef<HTMLDivElement>(null)

  // Initial load
  useEffect(() => {
    if (items.length === 0) {
      loadPortfolioItems()
    }
  }, [loadPortfolioItems, items.length])

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

  const getGridClassName = () => {
    if (view === 'masonry') {
      return "columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6"
    }
    return "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
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
      {isLoading && items.length === 0 && (
        <div className="text-center py-12">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">Loading portfolio items...</p>
        </div>
      )}

      {/* Portfolio Grid */}
      {items.length > 0 && (
        <div className={getGridClassName()}>
          {items.map((item, index) => (
            <div
              key={item.id}
              className={view === 'masonry' ? 'break-inside-avoid' : ''}
            >
              <PortfolioCard
                item={item}
                onClick={() => handleItemClick(index, item.id)}
              />
            </div>
          ))}
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