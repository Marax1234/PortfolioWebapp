'use client';

import { useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { usePortfolioApi } from '@/lib/portfolio-api';
import { usePortfolioStore } from '@/store/portfolio-store';

interface SimpleCategoryFilterProps {
  className?: string;
}

export function SimpleCategoryFilter({
  className = '',
}: SimpleCategoryFilterProps) {
  const { categories, filters, setFilters } = usePortfolioStore();
  const searchParams = useSearchParams();
  const router = useRouter();
  const initializedFromUrl = useRef(false);
  const lastUrlCategory = useRef<string | null>(null);

  const { loadCategories, loadPortfolioItems } = usePortfolioApi();

  // Load categories on mount
  useEffect(() => {
    if (categories.length === 0) {
      loadCategories();
    }
  }, [loadCategories, categories.length]);

  // Initialize and sync from URL parameters
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    
    // Only update if this is different from what we last processed
    if (categoryParam !== lastUrlCategory.current) {
      lastUrlCategory.current = categoryParam;
      
      setFilters({
        category: categoryParam || undefined,
      });
      
      if (!initializedFromUrl.current) {
        initializedFromUrl.current = true;
      }
    }
  }, [searchParams, setFilters]);

  // Reload items when filters change
  useEffect(() => {
    if (initializedFromUrl.current) {
      loadPortfolioItems({
        ...filters,
        page: 1,
      });
    }
  }, [filters, loadPortfolioItems]);

  const handleCategoryChange = (categorySlug: string) => {
    const newCategory = categorySlug === 'all' ? undefined : categorySlug;
    
    // Skip if same category
    if (newCategory === filters.category) {
      return;
    }
    
    // Update URL first - this will trigger the useEffect which will update filters
    const params = new URLSearchParams();
    if (newCategory) {
      params.set('category', newCategory);
    }
    const newUrl = params.toString() ? `?${params.toString()}` : '';
    
    // Update the tracking ref to prevent double updates
    lastUrlCategory.current = newCategory;
    
    // Update filter and URL together
    setFilters({
      category: newCategory,
    });
    router.replace(`/portfolio${newUrl}`);
  };

  return (
    <div
      className={`flex flex-wrap items-center justify-center gap-3 ${className}`}
    >
      <Button
        variant={!filters.category ? 'default' : 'outline'}
        size='lg'
        onClick={() => handleCategoryChange('all')}
        className='rounded-full px-6 py-2 text-sm font-medium transition-all duration-200 hover:scale-105'
      >
        All Work
        {!filters.category && categories.length > 0 && (
          <Badge
            variant='secondary'
            className='ml-2 border-0 bg-white/20 px-2 py-0.5 text-xs text-white'
          >
            {categories.reduce(
              (total, cat) => total + (cat.portfolioItemCount || 0),
              0
            )}
          </Badge>
        )}
      </Button>

      {categories
        .filter(
          category => category.isActive && category.portfolioItemCount > 0
        )
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map(category => (
          <Button
            key={category.id}
            variant={filters.category === category.slug ? 'default' : 'outline'}
            size='lg'
            onClick={() => handleCategoryChange(category.slug)}
            className='rounded-full px-6 py-2 text-sm font-medium transition-all duration-200 hover:scale-105'
          >
            {category.name}
            {filters.category === category.slug && (
              <Badge
                variant='secondary'
                className='ml-2 border-0 bg-white/20 px-2 py-0.5 text-xs text-white'
              >
                {category.portfolioItemCount}
              </Badge>
            )}
          </Button>
        ))}
    </div>
  );
}
