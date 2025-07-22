"use client"

import Image from "next/image"
import { useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { X, ChevronLeft, ChevronRight } from "lucide-react"

export interface PortfolioItem {
  id: number
  src: string
  alt: string
  category: string
  title: string
  description?: string
  width: number
  height: number
}

interface PortfolioGridProps {
  items: PortfolioItem[]
  selectedCategory?: string
}

export function PortfolioGrid({ items, selectedCategory = "all" }: PortfolioGridProps) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  // Filter items based on selected category
  const filteredItems = selectedCategory === "all" 
    ? items 
    : items.filter(item => item.category.toLowerCase() === selectedCategory.toLowerCase())

  const openLightbox = (index: number) => {
    setSelectedImage(index)
    setIsOpen(true)
  }

  const closeLightbox = () => {
    setIsOpen(false)
    setSelectedImage(null)
  }

  const goToPrevious = () => {
    if (selectedImage !== null && selectedImage > 0) {
      setSelectedImage(selectedImage - 1)
    }
  }

  const goToNext = () => {
    if (selectedImage !== null && selectedImage < filteredItems.length - 1) {
      setSelectedImage(selectedImage + 1)
    }
  }

  const currentItem = selectedImage !== null ? filteredItems[selectedImage] : null

  return (
    <>
      {/* Masonry Grid */}
      <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
        {filteredItems.map((item, index) => (
          <div 
            key={item.id} 
            className="break-inside-avoid group cursor-pointer"
            onClick={() => openLightbox(index)}
          >
            <div className="relative overflow-hidden rounded-lg bg-muted/30 hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1">
              <Image
                src={item.src}
                alt={item.alt}
                width={item.width}
                height={item.height}
                className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300" />
              <div className="absolute bottom-4 left-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <h3 className="font-semibold text-sm mb-1">{item.title}</h3>
                <p className="text-xs bg-white/20 px-2 py-1 rounded backdrop-blur-sm inline-block">
                  {item.category}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-screen-lg w-full h-full sm:h-auto p-0 bg-black/95 border-0">
          {currentItem && (
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Close button */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 z-10 text-white hover:bg-white/20"
                onClick={closeLightbox}
              >
                <X className="h-6 w-6" />
                <span className="sr-only">Close</span>
              </Button>

              {/* Previous button */}
              {selectedImage !== null && selectedImage > 0 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 text-white hover:bg-white/20"
                  onClick={goToPrevious}
                >
                  <ChevronLeft className="h-8 w-8" />
                  <span className="sr-only">Previous image</span>
                </Button>
              )}

              {/* Next button */}
              {selectedImage !== null && selectedImage < filteredItems.length - 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 text-white hover:bg-white/20"
                  onClick={goToNext}
                >
                  <ChevronRight className="h-8 w-8" />
                  <span className="sr-only">Next image</span>
                </Button>
              )}

              {/* Image */}
              <div className="relative w-full h-full flex items-center justify-center p-4 sm:p-8">
                <Image
                  src={currentItem.src}
                  alt={currentItem.alt}
                  width={currentItem.width}
                  height={currentItem.height}
                  className="max-w-full max-h-full object-contain"
                  sizes="100vw"
                />
              </div>

              {/* Image info */}
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="font-semibold text-lg mb-1">{currentItem.title}</h3>
                {currentItem.description && (
                  <p className="text-sm opacity-80 mb-2">{currentItem.description}</p>
                )}
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-white/20 px-2 py-1 rounded backdrop-blur-sm">
                    {currentItem.category}
                  </span>
                  <span className="text-xs opacity-60">
                    {selectedImage !== null && `${selectedImage + 1} of ${filteredItems.length}`}
                  </span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}