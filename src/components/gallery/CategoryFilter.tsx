'use client';

import { useEffect } from 'react';

import {
  Filter,
  Grid,
  LayoutGrid,
  Search,
  SortAsc,
  SortDesc,
  Star,
  X,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { usePortfolioApi } from '@/lib/portfolio-api';
import { usePortfolioStore } from '@/store/portfolio-store';

interface CategoryFilterProps {
  className?: string;
  showSearch?: boolean;
  showSort?: boolean;
  showViewToggle?: boolean;
  compact?: boolean;
}

export function CategoryFilter({
  className = '',
  showSearch = true,
  showSort = true,
  showViewToggle = true,
  compact = false,
}: CategoryFilterProps) {
  const {
    categories,
    filters,
    searchQuery,
    view,
    pagination,
    setFilters,
    setSearchQuery,
    setView,
    resetFilters,
  } = usePortfolioStore();

  const { loadCategories, loadPortfolioItems } = usePortfolioApi();

  // Load categories on mount
  useEffect(() => {
    if (categories.length === 0) {
      loadCategories();
    }
  }, [loadCategories, categories.length]);

  // Reload items when filters change
  useEffect(() => {
    const timer = setTimeout(() => {
      loadPortfolioItems({
        ...filters,
        page: 1, // Reset to first page when filtering
      });
    }, 300); // Debounce search

    return () => clearTimeout(timer);
  }, [filters, loadPortfolioItems]);

  // Search with debounce
  useEffect(() => {
    if (searchQuery.trim() === '') return;

    const timer = setTimeout(() => {
      // In a real app, this would be a backend search
      loadPortfolioItems({
        ...filters,
        page: 1,
      });
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, filters, loadPortfolioItems]);

  const handleCategoryChange = (categorySlug: string) => {
    setFilters({
      category: categorySlug === 'all' ? undefined : categorySlug,
    });
  };

  const handleFeaturedToggle = () => {
    setFilters({
      featured: filters.featured === true ? undefined : true,
    });
  };

  const handleMediaTypeChange = (mediaType: string) => {
    setFilters({
      mediaType:
        mediaType === 'all' ? undefined : (mediaType as 'IMAGE' | 'VIDEO'),
    });
  };

  const handleSortChange = (orderBy: string, orderDirection?: string) => {
    if (orderBy === 'clear') {
      setFilters({
        orderBy: 'createdAt',
        orderDirection: 'desc',
      });
      return;
    }

    setFilters({
      orderBy: orderBy as 'createdAt' | 'publishedAt' | 'viewCount' | 'title',
      orderDirection:
        (orderDirection as 'asc' | 'desc') || filters.orderDirection,
    });
  };

  const hasActiveFilters =
    filters.category || filters.featured || filters.mediaType || searchQuery;

  return (
    <div className={`space-y-4 ${className}`}>
      {!compact && (
        <div className='flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center'>
          <div className='flex items-center gap-2'>
            <Filter className='text-muted-foreground h-5 w-5' />
            <h3 className='font-medium'>Filter Portfolio</h3>
            {pagination && (
              <Badge variant='secondary' className='ml-2'>
                {pagination.total} items
              </Badge>
            )}
          </div>

          {showViewToggle && (
            <div className='flex items-center gap-1 rounded-md border p-1'>
              <Button
                variant={view === 'grid' ? 'default' : 'ghost'}
                size='sm'
                onClick={() => setView('grid')}
                className='h-8 w-8 p-0'
              >
                <Grid className='h-4 w-4' />
              </Button>
              <Button
                variant={view === 'masonry' ? 'default' : 'ghost'}
                size='sm'
                onClick={() => setView('masonry')}
                className='h-8 w-8 p-0'
              >
                <LayoutGrid className='h-4 w-4' />
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Search Bar */}
      {showSearch && (
        <div className='relative'>
          <Search className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform' />
          <Input
            placeholder='Search portfolio items...'
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className='pr-4 pl-9'
          />
          {searchQuery && (
            <Button
              variant='ghost'
              size='sm'
              className='absolute top-1/2 right-1 h-6 w-6 -translate-y-1/2 transform p-0'
              onClick={() => setSearchQuery('')}
            >
              <X className='h-4 w-4' />
            </Button>
          )}
        </div>
      )}

      {/* Filter Controls */}
      <div className='flex flex-col gap-4 sm:flex-row'>
        {/* Category Filter */}
        <div className='flex-1'>
          <div className='flex flex-wrap gap-2'>
            <Button
              variant={!filters.category ? 'default' : 'outline'}
              size='sm'
              onClick={() => handleCategoryChange('all')}
            >
              All Categories
            </Button>
            {categories.map(category => (
              <Button
                key={category.id}
                variant={
                  filters.category === category.slug ? 'default' : 'outline'
                }
                size='sm'
                onClick={() => handleCategoryChange(category.slug)}
                className='relative'
              >
                {category.name}
                {category.portfolioItemCount > 0 && (
                  <Badge variant='secondary' className='ml-1 h-4 px-1 text-xs'>
                    {category.portfolioItemCount}
                  </Badge>
                )}
              </Button>
            ))}
          </div>
        </div>

        {/* Additional Filters */}
        <div className='flex flex-wrap gap-2'>
          {/* Featured Toggle */}
          <Button
            variant={filters.featured ? 'default' : 'outline'}
            size='sm'
            onClick={handleFeaturedToggle}
          >
            <Star className='mr-1 h-4 w-4' />
            Featured
          </Button>

          {/* Media Type Filter */}
          <Select
            value={filters.mediaType || 'all'}
            onValueChange={handleMediaTypeChange}
          >
            <SelectTrigger className='w-32'>
              <SelectValue placeholder='Media Type' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All Media</SelectItem>
              <SelectItem value='IMAGE'>Images</SelectItem>
              <SelectItem value='VIDEO'>Videos</SelectItem>
            </SelectContent>
          </Select>

          {/* Sort Options */}
          {showSort && (
            <Select
              value={`${filters.orderBy}-${filters.orderDirection}`}
              onValueChange={value => {
                if (value === 'clear') {
                  handleSortChange('clear');
                } else {
                  const [orderBy, orderDirection] = value.split('-');
                  handleSortChange(orderBy, orderDirection);
                }
              }}
            >
              <SelectTrigger className='w-40'>
                <SelectValue placeholder='Sort by' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='createdAt-desc'>
                  <div className='flex items-center'>
                    <SortDesc className='mr-2 h-4 w-4' />
                    Newest First
                  </div>
                </SelectItem>
                <SelectItem value='createdAt-asc'>
                  <div className='flex items-center'>
                    <SortAsc className='mr-2 h-4 w-4' />
                    Oldest First
                  </div>
                </SelectItem>
                <SelectItem value='title-asc'>A-Z</SelectItem>
                <SelectItem value='title-desc'>Z-A</SelectItem>
                <SelectItem value='viewCount-desc'>Most Popular</SelectItem>
                <SelectItem value='viewCount-asc'>Least Popular</SelectItem>
                <SelectItem value='publishedAt-desc'>
                  Recently Published
                </SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      {/* Active Filters & Clear */}
      {hasActiveFilters && (
        <div className='flex flex-wrap items-center gap-2 border-t pt-2'>
          <span className='text-muted-foreground text-sm'>Active filters:</span>

          {searchQuery && (
            <Badge variant='secondary' className='gap-1'>
              Search: &quot;{searchQuery}&quot;
              <X
                className='h-3 w-3 cursor-pointer'
                onClick={() => setSearchQuery('')}
              />
            </Badge>
          )}

          {filters.category && (
            <Badge variant='secondary' className='gap-1'>
              Category:{' '}
              {categories.find(c => c.slug === filters.category)?.name}
              <X
                className='h-3 w-3 cursor-pointer'
                onClick={() => setFilters({ category: undefined })}
              />
            </Badge>
          )}

          {filters.featured && (
            <Badge variant='secondary' className='gap-1'>
              Featured
              <X
                className='h-3 w-3 cursor-pointer'
                onClick={() => setFilters({ featured: undefined })}
              />
            </Badge>
          )}

          {filters.mediaType && (
            <Badge variant='secondary' className='gap-1'>
              {filters.mediaType}
              <X
                className='h-3 w-3 cursor-pointer'
                onClick={() => setFilters({ mediaType: undefined })}
              />
            </Badge>
          )}

          <Button
            variant='ghost'
            size='sm'
            onClick={resetFilters}
            className='ml-2'
          >
            Clear All
          </Button>
        </div>
      )}
    </div>
  );
}
