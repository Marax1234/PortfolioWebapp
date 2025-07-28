"use client"

import { PortfolioGrid } from "@/components/gallery/PortfolioGrid"
import { CategoryFilter } from "@/components/gallery/CategoryFilter"

export default function PortfolioPage() {
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Portfolio</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            A collection of my photography and videography work spanning nature, travel, events, and corporate projects. 
            Each image and video tells a unique story captured through creative vision and passion for visual storytelling.
          </p>
        </div>

        {/* Category Filters */}
        <div className="mb-8">
          <CategoryFilter 
            showSearch={true}
            showSort={true}
            showViewToggle={true}
            compact={false}
          />
        </div>

        {/* Portfolio Grid */}
        <PortfolioGrid 
          enableInfiniteScroll={true}
          showViewToggle={false} // Already shown in CategoryFilter
          showFilters={false} // Already shown in CategoryFilter
        />
      </div>
    </div>
  )
}