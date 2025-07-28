"use client"

import { PortfolioGrid } from "@/components/gallery/PortfolioGrid"
import { SimpleCategoryFilter } from "@/components/gallery/SimpleCategoryFilter"

export default function PortfolioPage() {
  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 max-w-7xl xl:max-w-[1400px] 2xl:max-w-[1600px]">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Portfolio</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
            A collection of my photography and videography work spanning nature, travel, 
            events, and corporate projects. Each image and video tells a unique story captured 
            through creative vision and passion for visual storytelling.
          </p>
        </div>

        {/* Simple Category Filters */}
        <div className="mb-8">
          <SimpleCategoryFilter />
        </div>

        {/* Portfolio Grid */}
        <PortfolioGrid 
          enableInfiniteScroll={true}
        />
      </div>
    </div>
  )
}