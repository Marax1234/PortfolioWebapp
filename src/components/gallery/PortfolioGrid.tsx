'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { Filter, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useMasonry } from '@/hooks/useMasonry';
import { usePortfolioApi } from '@/lib/portfolio-api';
import { usePortfolioStore } from '@/store/portfolio-store';

import { Lightbox } from './Lightbox';
import { PortfolioCard } from './PortfolioCard';

interface PortfolioGridProps {
  className?: string;
  enableInfiniteScroll?: boolean;
  showViewToggle?: boolean;
  showFilters?: boolean;
}

export function PortfolioGrid({
  className = '',
  enableInfiniteScroll = true,
}: PortfolioGridProps) {
  const {
    items,
    isLoading,
    isLoadingMore,
    error,
    pagination,
    lightboxOpen,
    openLightbox,
    incrementViewCount,
  } = usePortfolioStore();

  // Force masonry view for clean layout
  const view = 'masonry';

  const { loadPortfolioItems, loadMoreItems } = usePortfolioApi();
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Masonry layout hook with minimal gaps - max 4 columns
  const {
    containerRef,
    isLoading: isMasonryLoading,
    addItem,
    recalculate,
  } = useMasonry({
    gap: 12,
    minColumnWidth: 320,
    maxColumns: 4,
    responsive: {
      640: { columns: 1, gap: 8 }, // sm - single column on mobile
      768: { columns: 2, gap: 10 }, // md - two columns on tablet
      1024: { columns: 3, gap: 12 }, // lg - three columns
      1280: { columns: 4, gap: 12 }, // xl - max 4 columns on desktop
      1536: { columns: 4, gap: 12 }, // 2xl - keep 4 columns max
    },
  });

  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Initial load - simplified and more reliable
  useEffect(() => {
    loadPortfolioItems().finally(() => {
      setIsInitialLoad(false);
    });
  }, [loadPortfolioItems]);

  // Recalculate masonry when items change or view changes
  useEffect(() => {
    if (items.length > 0 && view === 'masonry') {
      // Small delay to ensure DOM is updated
      const timeout = setTimeout(() => {
        recalculate();
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [items, view, recalculate]);

  // Handle view mode changes
  useEffect(() => {
    if (view === 'masonry') {
      recalculate();
    }
  }, [view, recalculate]);

  // Infinite scroll setup
  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && !isLoadingMore && pagination?.hasNext) {
        loadMoreItems();
      }
    },
    [isLoadingMore, pagination?.hasNext, loadMoreItems]
  );

  useEffect(() => {
    if (!enableInfiniteScroll || !loadMoreRef.current) return;

    observerRef.current = new IntersectionObserver(handleIntersection, {
      threshold: 0.1,
      rootMargin: '100px',
    });

    observerRef.current.observe(loadMoreRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [handleIntersection, enableInfiniteScroll]);

  const handleItemClick = useCallback(
    (index: number, itemId: string) => {
      incrementViewCount(itemId);
      openLightbox(index);
    },
    [incrementViewCount, openLightbox]
  );

  const handleItemMount = useCallback(
    (element: HTMLElement, id: string) => {
      if (view === 'masonry') {
        addItem(element, id);
      }
    },
    [addItem, view]
  );

  if (error) {
    return (
      <div className='py-12 text-center'>
        <p className='text-muted-foreground mb-4'>{error}</p>
        <Button onClick={() => loadPortfolioItems()} variant='outline'>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      {/* Loading State */}
      {(isLoading && items.length === 0) ||
        (isInitialLoad && (
          <div className='py-12 text-center'>
            <Loader2 className='text-muted-foreground mx-auto mb-4 h-8 w-8 animate-spin' />
            <p className='text-muted-foreground'>Loading portfolio items...</p>
          </div>
        ))}

      {/* Masonry Loading Overlay */}
      {view === 'masonry' && isMasonryLoading && items.length > 0 && (
        <div className='bg-background/80 absolute inset-0 z-10 flex items-center justify-center backdrop-blur-sm'>
          <div className='text-muted-foreground flex items-center gap-2'>
            <Loader2 className='h-4 w-4 animate-spin' />
            <span className='text-sm'>Organizing layout...</span>
          </div>
        </div>
      )}

      {/* Portfolio Grid - Masonry Layout */}
      {items.length > 0 && (
        <div className='relative'>
          <div
            ref={containerRef}
            className='columns-1 gap-3 md:columns-2 lg:columns-3 xl:columns-4'
          >
            {items.map((item, index) => (
              <div
                key={`portfolio-item-${item.id}-${index}`}
                className={`mb-3 w-full break-inside-avoid transition-all duration-300 ease-out ${isInitialLoad ? 'translate-y-4 opacity-0' : 'translate-y-0 opacity-100'} hover:z-10 hover:scale-[1.01]`}
                style={
                  !isInitialLoad
                    ? {
                        transitionDelay: `${Math.min(index * 30, 800)}ms`,
                      }
                    : undefined
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
        <div ref={loadMoreRef} className='py-8 text-center'>
          {isLoadingMore && (
            <Loader2 className='text-muted-foreground mx-auto h-6 w-6 animate-spin' />
          )}
        </div>
      )}

      {/* Load More Button (fallback) */}
      {!enableInfiniteScroll && pagination?.hasNext && (
        <div className='py-8 text-center'>
          <Button
            onClick={loadMoreItems}
            disabled={isLoadingMore}
            variant='outline'
          >
            {isLoadingMore && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
            Load More
          </Button>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !isInitialLoad && items.length === 0 && (
        <div className='py-12 text-center'>
          <Filter className='text-muted-foreground mx-auto mb-4 h-12 w-12' />
          <p className='text-muted-foreground mb-2'>No portfolio items found</p>
          <p className='text-muted-foreground text-sm'>
            Try adjusting your filters or check back later.
          </p>
          {process.env.NODE_ENV === 'development' && (
            <div className='mx-auto mt-4 max-w-md rounded bg-gray-100 p-4 text-left text-xs'>
              <strong>Debug Info:</strong>
              <br />
              Items: {items.length}
              <br />
              Loading: {isLoading.toString()}
              <br />
              Initial Load: {isInitialLoad.toString()}
              <br />
              Error: {error || 'none'}
              <br />
              Pagination:{' '}
              {pagination
                ? `Page ${pagination.page}/${pagination.totalPages}`
                : 'none'}
            </div>
          )}
        </div>
      )}

      {/* Lightbox */}
      {lightboxOpen && <Lightbox />}
    </div>
  );
}
