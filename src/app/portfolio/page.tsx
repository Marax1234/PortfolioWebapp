"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { PortfolioGrid } from "@/components/gallery/PortfolioGrid"
import type { PortfolioItem } from "@/components/gallery/PortfolioGrid"

// Mock portfolio data - In a real app, this would come from a database/API
const portfolioItems: PortfolioItem[] = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=600&h=900&fit=crop",
    alt: "Elegant Wedding Ceremony",
    category: "Wedding",
    title: "Elegant Wedding Ceremony",
    description: "A beautiful outdoor wedding ceremony captured in golden hour light",
    width: 600,
    height: 900,
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=600&h=400&fit=crop",
    alt: "Corporate Portrait Session",
    category: "Portrait",
    title: "Corporate Portrait Session",
    description: "Professional headshots for corporate executives",
    width: 600,
    height: 400,
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&h=800&fit=crop",
    alt: "Conference Event",
    category: "Event",
    title: "Conference Event",
    description: "Corporate conference documentation and networking event",
    width: 600,
    height: 800,
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=600&h=600&fit=crop",
    alt: "Product Photography",
    category: "Commercial",
    title: "Product Photography",
    description: "High-end product photography for e-commerce brand",
    width: 600,
    height: 600,
  },
  {
    id: 5,
    src: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=600&h=750&fit=crop",
    alt: "Wedding Reception Dance",
    category: "Wedding",
    title: "Wedding Reception Dance",
    description: "Capturing the joy and celebration of the wedding reception",
    width: 600,
    height: 750,
  },
  {
    id: 6,
    src: "https://images.unsplash.com/photo-1554080353-a576cf803bda?w=600&h=400&fit=crop",
    alt: "Professional Headshot",
    category: "Portrait",
    title: "Professional Headshot",
    description: "Studio portrait for professional use",
    width: 600,
    height: 400,
  },
  {
    id: 7,
    src: "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=800&fit=crop",
    alt: "Wedding Preparation",
    category: "Wedding",
    title: "Wedding Preparation",
    description: "Behind the scenes moments before the ceremony",
    width: 600,
    height: 800,
  },
  {
    id: 8,
    src: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=600&h=900&fit=crop",
    alt: "Business Meeting",
    category: "Commercial",
    title: "Business Meeting",
    description: "Corporate meeting and team collaboration session",
    width: 600,
    height: 900,
  },
  {
    id: 9,
    src: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=600&h=400&fit=crop",
    alt: "Outdoor Event",
    category: "Event",
    title: "Outdoor Event",
    description: "Large outdoor corporate event and celebration",
    width: 600,
    height: 400,
  },
  {
    id: 10,
    src: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600&h=750&fit=crop",
    alt: "Creative Portrait",
    category: "Portrait",
    title: "Creative Portrait",
    description: "Artistic portrait session with creative lighting",
    width: 600,
    height: 750,
  },
  {
    id: 11,
    src: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=600&h=800&fit=crop",
    alt: "Romantic Wedding Moment",
    category: "Wedding",
    title: "Romantic Wedding Moment",
    description: "Intimate moment between bride and groom",
    width: 600,
    height: 800,
  },
  {
    id: 12,
    src: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=600&fit=crop",
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