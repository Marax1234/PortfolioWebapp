"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { PortfolioGrid } from "@/components/gallery/PortfolioGrid"
import type { PortfolioItem } from "@/components/gallery/PortfolioGrid"

// Mock portfolio data - In a real app, this would come from a database/API
const portfolioItems: PortfolioItem[] = [
  {
    id: 1,
    src: "/images/portfolio/portfolio-1.jpg",
    alt: "Mountain Landscape",
    category: "Nature",
    title: "Mountain Landscape",
    description: "Majestic mountain peaks captured during golden hour with dramatic lighting",
    width: 600,
    height: 900,
  },
  {
    id: 2,
    src: "/images/portfolio/portfolio-2.jpg",
    alt: "European Travel Adventure",
    category: "Travel",
    title: "European Travel Adventure",
    description: "Capturing the essence of European architecture and culture",
    width: 600,
    height: 400,
  },
  {
    id: 3,
    src: "/images/portfolio/portfolio-3.jpg",
    alt: "Conference Event",
    category: "Event",
    title: "Conference Event",
    description: "Corporate conference documentation and networking event",
    width: 600,
    height: 800,
  },
  {
    id: 4,
    src: "/images/portfolio/portfolio-4.jpg",
    alt: "Corporate Imagefilm",
    category: "Videography",
    title: "Corporate Imagefilm",
    description: "Professional corporate video production for brand storytelling",
    width: 600,
    height: 600,
  },
  {
    id: 5,
    src: "/images/portfolio/portfolio-5.jpg",
    alt: "Forest Wilderness",
    category: "Nature",
    title: "Forest Wilderness",
    description: "Deep forest exploration showcasing nature's untouched beauty",
    width: 600,
    height: 750,
  },
  {
    id: 6,
    src: "/images/portfolio/portfolio-6.jpg",
    alt: "City Travel Photography",
    category: "Travel",
    title: "City Travel Photography",
    description: "Urban exploration and street photography from recent travels",
    width: 600,
    height: 400,
  },
  {
    id: 7,
    src: "/images/portfolio/portfolio-7.jpg",
    alt: "Wildlife Photography",
    category: "Nature",
    title: "Wildlife Photography",
    description: "Intimate wildlife moments captured in their natural habitat",
    width: 600,
    height: 800,
  },
  {
    id: 8,
    src: "/images/portfolio/portfolio-8.jpg",
    alt: "Social Media Content",
    category: "Videography",
    title: "Social Media Content",
    description: "Creative video content for social media marketing campaigns",
    width: 600,
    height: 900,
  },
  {
    id: 9,
    src: "/images/portfolio/portfolio-9.jpg",
    alt: "Outdoor Event",
    category: "Event",
    title: "Outdoor Event",
    description: "Large outdoor corporate event and celebration",
    width: 600,
    height: 400,
  },
  {
    id: 10,
    src: "/images/portfolio/portfolio-10.jpg",
    alt: "Adventure Travel",
    category: "Travel",
    title: "Adventure Travel",
    description: "Documenting thrilling adventures and breathtaking destinations",
    width: 600,
    height: 750,
  },
  {
    id: 11,
    src: "/images/portfolio/portfolio-11.jpg",
    alt: "Sunset Nature Scene",
    category: "Nature",
    title: "Sunset Nature Scene",
    description: "Breathtaking sunset over natural landscapes",
    width: 600,
    height: 800,
  },
  {
    id: 12,
    src: "/images/portfolio/portfolio-12.jpg",
    alt: "Brand Video Production",
    category: "Videography",
    title: "Brand Video Production",
    description: "Professional brand storytelling through cinematic video production",
    width: 600,
    height: 600,
  },
]

const categories = [
  { id: "all", label: "All Work", count: portfolioItems.length },
  { id: "nature", label: "Nature", count: portfolioItems.filter(item => item.category === "Nature").length },
  { id: "travel", label: "Travel", count: portfolioItems.filter(item => item.category === "Travel").length },
  { id: "event", label: "Events", count: portfolioItems.filter(item => item.category === "Event").length },
  { id: "videography", label: "Videography", count: portfolioItems.filter(item => item.category === "Videography").length },
]

export default function PortfolioPage() {
  const [selectedCategory, setSelectedCategory] = useState("all")

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Portfolio</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            A collection of my photography and videography work spanning nature, travel, events, and corporate projects. 
            Each image and video tells a unique story captured through creative vision and passion for visual storytelling.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              onClick={() => setSelectedCategory(category.id)}
              className="transition-all duration-200"
            >
              {category.label}
              <span className="ml-2 text-xs opacity-70">({category.count})</span>
            </Button>
          ))}
        </div>

        {/* Portfolio Grid */}
        <PortfolioGrid 
          items={portfolioItems} 
          selectedCategory={selectedCategory}
        />

        {/* Load More Button (placeholder for future pagination) */}
        <div className="text-center mt-12">
          <p className="text-muted-foreground text-sm">
            Showing all {selectedCategory === "all" 
              ? portfolioItems.length 
              : portfolioItems.filter(item => item.category.toLowerCase() === selectedCategory.toLowerCase()).length
            } images
          </p>
        </div>
      </div>
    </div>
  )
}