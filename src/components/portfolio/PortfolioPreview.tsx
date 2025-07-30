'use client';

import { useEffect, useState } from 'react';

import Link from 'next/link';

import { ArrowRight, Loader2 } from 'lucide-react';

import { Lightbox } from '@/components/gallery/Lightbox';
import { PortfolioCard } from '@/components/gallery/PortfolioCard';
import { Button } from '@/components/ui/button';
import { PortfolioApi } from '@/lib/portfolio-api';
import { usePortfolioStore } from '@/store/portfolio-store';
import type { PortfolioItem } from '@/store/portfolio-store';

interface PortfolioPreviewProps {
  maxItems?: number;
  showTitle?: boolean;
  showDescription?: boolean;
}

export function PortfolioPreview({
  maxItems = 6,
  showTitle = true,
  showDescription = true,
}: PortfolioPreviewProps) {
  const [featuredItems, setFeaturedItems] = useState<PortfolioItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { lightboxOpen, openLightbox, incrementViewCount, setItems } =
    usePortfolioStore();

  useEffect(() => {
    async function loadFeaturedItems() {
      try {
        setIsLoading(true);
        setError(null);
        const items = await PortfolioApi.fetchFeaturedItems(maxItems);
        setFeaturedItems(items);
        // Update the store with featured items for lightbox functionality
        setItems(items);
      } catch (err) {
        console.error('Error loading featured items:', err);
        setError('Failed to load portfolio items');
      } finally {
        setIsLoading(false);
      }
    }

    loadFeaturedItems();
  }, [maxItems, setItems]);

  const handleItemClick = (index: number, itemId: string) => {
    incrementViewCount(itemId);
    openLightbox(index);
  };

  if (isLoading) {
    return (
      <section className='bg-muted/30 py-16 md:py-24'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center'>
            <Loader2 className='text-muted-foreground mx-auto mb-4 h-8 w-8 animate-spin' />
            <p className='text-muted-foreground'>Loading portfolio...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className='bg-muted/30 py-16 md:py-24'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center'>
            <p className='text-muted-foreground mb-4'>{error}</p>
            <Button onClick={() => window.location.reload()} variant='outline'>
              Try Again
            </Button>
          </div>
        </div>
      </section>
    );
  }

  if (featuredItems.length === 0) {
    return (
      <section className='bg-muted/30 py-16 md:py-24'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center'>
            <p className='text-muted-foreground mb-4'>
              No featured portfolio items available
            </p>
            <Button asChild variant='outline'>
              <Link href='/portfolio'>
                View All Portfolio
                <ArrowRight className='ml-2 h-4 w-4' />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className='bg-muted/30 py-16 md:py-24'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
        {showTitle && (
          <div className='mb-12 text-center'>
            <h2 className='mb-4 text-3xl font-bold md:text-4xl'>Recent Work</h2>
            {showDescription && (
              <p className='text-muted-foreground mx-auto max-w-2xl text-lg'>
                A glimpse into my latest photography projects across travel,
                events, and nature.
              </p>
            )}
          </div>
        )}

        {/* Portfolio Grid with staggered animation */}
        <div className='mb-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
          {featuredItems.map((item, index) => (
            <div
              key={item.id}
              className='animate-fade-in-up translate-y-8 opacity-0'
              style={{
                animationDelay: `${index * 100}ms`,
                animationFillMode: 'forwards',
              }}
            >
              <PortfolioCard
                item={item}
                onClick={() => handleItemClick(index, item.id)}
                priority={index < 3} // Prioritize first 3 images for loading
                adaptiveHeight={false} // Keep standard grid for preview
              />
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className='text-center'>
          <Button asChild size='lg' variant='outline'>
            <Link href='/portfolio'>
              View Full Portfolio
              <ArrowRight className='ml-2 h-4 w-4' />
            </Link>
          </Button>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && <Lightbox />}
    </section>
  );
}
