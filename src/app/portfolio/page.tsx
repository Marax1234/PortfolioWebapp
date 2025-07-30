'use client';

import { PortfolioGrid } from '@/components/gallery/PortfolioGrid';
import { SimpleCategoryFilter } from '@/components/gallery/SimpleCategoryFilter';

export default function PortfolioPage() {
  return (
    <div className='min-h-screen py-8'>
      <div className='container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 xl:max-w-[1400px] xl:px-12 2xl:max-w-[1600px]'>
        {/* Header */}
        <div className='mb-8 text-center'>
          <h1 className='mb-4 text-4xl font-bold md:text-5xl'>Portfolio</h1>
          <p className='text-muted-foreground mx-auto mb-8 max-w-2xl text-lg'>
            A collection of my photography and videography work spanning nature,
            travel, events, and corporate projects. Each image and video tells a
            unique story captured through creative vision and passion for visual
            storytelling.
          </p>
        </div>

        {/* Simple Category Filters */}
        <div className='mb-8'>
          <SimpleCategoryFilter />
        </div>

        {/* Portfolio Grid */}
        <PortfolioGrid enableInfiniteScroll={true} />
      </div>
    </div>
  );
}
