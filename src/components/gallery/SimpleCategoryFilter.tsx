"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { usePortfolioStore } from "@/store/portfolio-store"
import { usePortfolioApi } from "@/lib/portfolio-api"

interface SimpleCategoryFilterProps {
  className?: string
}

export function SimpleCategoryFilter({ className = "" }: SimpleCategoryFilterProps) {
  const {
    categories,
    filters,
    setFilters,
  } = usePortfolioStore()

  const { loadCategories, loadPortfolioItems } = usePortfolioApi()

  // Load categories on mount
  useEffect(() => {
    if (categories.length === 0) {
      loadCategories()
    }
  }, [loadCategories, categories.length])

  // Reload items when filters change
  useEffect(() => {
    loadPortfolioItems({ 
      ...filters, 
      page: 1 
    })
  }, [filters, loadPortfolioItems])

  const handleCategoryChange = (categorySlug: string) => {
    setFilters({ 
      category: categorySlug === 'all' ? undefined : categorySlug 
    })
  }

  return (
    <div className={`flex flex-wrap items-center justify-center gap-3 ${className}`}>
      <Button
        variant={!filters.category ? 'default' : 'outline'}
        size="lg"
        onClick={() => handleCategoryChange('all')}
        className="rounded-full px-6 py-2 text-sm font-medium transition-all duration-200 hover:scale-105"
      >
        All Work
        {!filters.category && categories.length > 0 && (
          <Badge 
            variant="secondary" 
            className="ml-2 bg-white/20 text-white border-0 text-xs px-2 py-0.5"
          >
            {categories.reduce((total, cat) => total + (cat.portfolioItemCount || 0), 0)}
          </Badge>
        )}
      </Button>
      
      {categories
        .filter(category => category.isActive && category.portfolioItemCount > 0)
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map((category) => (
        <Button
          key={category.id}
          variant={filters.category === category.slug ? 'default' : 'outline'}
          size="lg"
          onClick={() => handleCategoryChange(category.slug)}
          className="rounded-full px-6 py-2 text-sm font-medium transition-all duration-200 hover:scale-105"
        >
          {category.name}
          {filters.category === category.slug && (
            <Badge 
              variant="secondary" 
              className="ml-2 bg-white/20 text-white border-0 text-xs px-2 py-0.5"
            >
              {category.portfolioItemCount}
            </Badge>
          )}
        </Button>
      ))}
    </div>
  )
}