"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

interface MasonryItem {
  id: string
  element: HTMLElement
  height: number
  aspectRatio: number
}

interface MasonryOptions {
  gap: number
  minColumnWidth: number
  maxColumns: number
  responsive: {
    [breakpoint: number]: {
      columns: number
      gap: number
    }
  }
}

interface MasonryLayout {
  containerRef: React.RefObject<HTMLDivElement>
  isLoading: boolean
  recalculate: () => void
  addItem: (element: HTMLElement, id: string) => void
  removeItem: (id: string) => void
}

const defaultOptions: MasonryOptions = {
  gap: 24,
  minColumnWidth: 280,
  maxColumns: 5,
  responsive: {
    640: { columns: 2, gap: 16 },    // sm
    1024: { columns: 3, gap: 20 },   // lg  
    1280: { columns: 4, gap: 24 },   // xl
    1920: { columns: 5, gap: 24 },   // 2xl
  }
}

export function useMasonry(options: Partial<MasonryOptions> = {}): MasonryLayout {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [items, setItems] = useState<Map<string, MasonryItem>>(new Map())
  
  const config = useMemo(() => ({ ...defaultOptions, ...options }), [options])

  const getResponsiveConfig = useCallback(() => {
    const width = window.innerWidth
    const breakpoints = Object.keys(config.responsive)
      .map(Number)
      .sort((a, b) => b - a)
    
    for (const breakpoint of breakpoints) {
      if (width >= breakpoint) {
        return config.responsive[breakpoint]
      }
    }
    
    // Fallback to calculating columns based on container width
    const containerWidth = containerRef.current?.offsetWidth || width
    const columns = Math.min(
      Math.max(1, Math.floor(containerWidth / config.minColumnWidth)),
      config.maxColumns
    )
    
    return { columns, gap: config.gap }
  }, [config])

  const calculateLayout = useCallback(() => {
    if (!containerRef.current || items.size === 0) return

    setIsLoading(true)
    const container = containerRef.current
    const { columns, gap } = getResponsiveConfig()
    
    // Calculate column width
    const containerWidth = container.offsetWidth
    const totalGapWidth = (columns - 1) * gap
    const columnWidth = (containerWidth - totalGapWidth) / columns
    
    // Initialize column heights
    const columnHeights = new Array(columns).fill(0)
    
    // Get all items sorted by their current order in DOM
    const itemElements = Array.from(container.children) as HTMLElement[]
    
    itemElements.forEach((element) => {
      if (!element.dataset.itemId) return
      
      const itemId = element.dataset.itemId
      const item = items.get(itemId)
      if (!item) return

      // Find the shortest column
      const shortestColumnIndex = columnHeights.indexOf(Math.min(...columnHeights))
      
      // Calculate position
      const x = shortestColumnIndex * (columnWidth + gap)
      const y = columnHeights[shortestColumnIndex]
      
      // Calculate height based on aspect ratio
      const imageHeight = columnWidth / item.aspectRatio
      const cardPadding = 80 // Approximate padding and content height
      const totalHeight = imageHeight + cardPadding
      
      // Apply transforms with smooth transition
      element.style.position = 'absolute'
      element.style.width = `${columnWidth}px`
      element.style.transform = `translate3d(${x}px, ${y}px, 0)`
      element.style.transition = 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
      
      // Update column height
      columnHeights[shortestColumnIndex] += totalHeight + gap
    })
    
    // Set container height
    const maxHeight = Math.max(...columnHeights) - gap
    container.style.height = `${maxHeight}px`
    container.style.position = 'relative'
    
    setIsLoading(false)
  }, [items, getResponsiveConfig])

  const addItem = useCallback((element: HTMLElement, id: string) => {
    // Get image element to determine aspect ratio
    const img = element.querySelector('img')
    if (!img) return

    const handleImageLoad = () => {
      const aspectRatio = img.naturalWidth / img.naturalHeight || 1.5
      const height = element.offsetHeight || 300
      
      setItems(prev => new Map(prev.set(id, {
        id,
        element,
        height,
        aspectRatio
      })))
    }

    if (img.complete) {
      handleImageLoad()
    } else {
      img.addEventListener('load', handleImageLoad, { once: true })
    }

    element.dataset.itemId = id
  }, [])

  const removeItem = useCallback((id: string) => {
    setItems(prev => {
      const newItems = new Map(prev)
      newItems.delete(id)
      return newItems
    })
  }, [])

  const recalculate = useCallback(() => {
    // Small delay to ensure DOM has updated
    setTimeout(calculateLayout, 10)
  }, [calculateLayout])

  // Recalculate layout when items change
  useEffect(() => {
    if (items.size > 0) {
      calculateLayout()
    }
  }, [items, calculateLayout])

  // Handle window resize
  useEffect(() => {
    let timeoutId: NodeJS.Timeout
    
    const handleResize = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(recalculate, 150)
    }

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      clearTimeout(timeoutId)
    }
  }, [recalculate])

  return {
    containerRef,
    isLoading,
    recalculate,
    addItem,
    removeItem
  }
}