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
    alt: "Elegant Wedding Ceremony",
    category: "Wedding",
    title: "Elegant Wedding Ceremony",
    description: "A beautiful outdoor wedding ceremony captured in golden hour light",
    width: 600,
    height: 900,
  },
  {
    id: 2,
    src: "/images/portfolio/portfolio-2.jpg",
    alt: "Corporate Portrait Session",
    category: "Portrait",
    title: "Corporate Portrait Session",
    description: "Professional headshots for corporate executives",
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
    alt: "Product Photography",
    category: "Commercial",
    title: "Product Photography",
    description: "High-end product photography for e-commerce brand",
    width: 600,
    height: 600,
  },
  {
    id: 5,
    src: "/images/portfolio/portfolio-5.jpg",
    alt: "Wedding Reception Dance",
    category: "Wedding",
    title: "Wedding Reception Dance",
    description: "Capturing the joy and celebration of the wedding reception",
    width: 600,
    height: 750,
  },
  {
    id: 6,
    src: "/images/portfolio/portfolio-6.jpg",
    alt: "Professional Headshot",
    category: "Portrait",
    title: "Professional Headshot",
    description: "Studio portrait for professional use",
    width: 600,
    height: 400,
  },
  {
    id: 7,
    src: "/images/portfolio/portfolio-7.jpg",
    alt: "Wedding Preparation",
    category: "Wedding",
    title: "Wedding Preparation",
    description: "Behind the scenes moments before the ceremony",
    width: 600,
    height: 800,
  },
  {
    id: 8,
    src: "/images/portfolio/portfolio-8.jpg",
    alt: "Business Meeting",
    category: "Commercial",
    title: "Business Meeting",
    description: "Corporate meeting and team collaboration session",
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
    alt: "Creative Portrait",
    category: "Portrait",
    title: "Creative Portrait",
    description: "Artistic portrait session with creative lighting",
    width: 600,
    height: 750,
  },
  {
    id: 11,
    src: "/images/portfolio/portfolio-11.jpg",
    alt: "Romantic Wedding Moment",
    category: "Wedding",
    title: "Romantic Wedding Moment",
    description: "Intimate moment between bride and groom",
    width: 600,
    height: 800,
  },
  {
    id: 12,
    src: "/images/portfolio/portfolio-12.jpg",
    alt: "Architecture Photography",
    category: "Commercial",
    title: "Architecture Photography",
    description: "Commercial architecture and interior design photography",
    width: 600,
    height: 600,
  },
]

const categories = [
  { id: "all", label: "All Work", count: portfolioItems.length },
  { id: "wedding", label: "Weddings", count: portfolioItems.filter(item => item.category === "Wedding").length },
  { id: "portrait", label: "Portraits", count: portfolioItems.filter(item => item.category === "Portrait").length },
  { id: "event", label: "Events", count: portfolioItems.filter(item => item.category === "Event").length },
  { id: "commercial", label: "Commercial", count: portfolioItems.filter(item => item.category === "Commercial").length },
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
            A collection of my photography work spanning weddings, portraits, events, and commercial projects. 
            Each image tells a unique story captured through creative vision and technical expertise.
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