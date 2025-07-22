/**
 * Portfolio API Client - Frontend API Utilities
 * Interagiert mit Backend API Endpunkten
 */

import { PortfolioItem, Category, PaginationInfo } from '@/store/portfolio-store'

interface ApiResponse<T> {
  success: boolean
  data: T
  error?: string
}

interface PortfolioApiResponse extends ApiResponse<PortfolioItem[]> {
  pagination?: PaginationInfo
}

type SinglePortfolioApiResponse = ApiResponse<{
  item: PortfolioItem
  relatedItems: PortfolioItem[]
}>

type CategoriesApiResponse = ApiResponse<Category[]>

export interface FetchPortfolioParams {
  page?: number
  limit?: number
  category?: string
  featured?: boolean
  orderBy?: 'createdAt' | 'publishedAt' | 'viewCount' | 'title'
  orderDirection?: 'asc' | 'desc'
}

/**
 * Base API configuration
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

/**
 * Generic API fetch utility
 */
async function apiRequest<T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`
  
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(
        errorData.error || `HTTP ${response.status}: ${response.statusText}`
      )
    }

    return await response.json()
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Network error occurred')
  }
}

/**
 * Portfolio API Client
 */
export class PortfolioApi {
  /**
   * Fetch portfolio items with pagination and filtering
   */
  static async fetchPortfolioItems(
    params: FetchPortfolioParams = {}
  ): Promise<{ items: PortfolioItem[]; pagination: PaginationInfo }> {
    const searchParams = new URLSearchParams()
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value))
      }
    })

    const endpoint = `/api/portfolio${searchParams.toString() ? `?${searchParams.toString()}` : ''}`
    const response: PortfolioApiResponse = await apiRequest(endpoint)
    
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch portfolio items')
    }

    // Parse JSON strings in tags and metadata
    const processedItems = response.data.map(item => ({
      ...item,
      tags: typeof item.tags === 'string' ? JSON.parse(item.tags) : item.tags,
      metadata: typeof item.metadata === 'string' ? JSON.parse(item.metadata) : item.metadata
    }))

    return {
      items: processedItems,
      pagination: response.pagination || {
        page: 1,
        limit: 12,
        total: processedItems.length,
        totalPages: 1,
        hasNext: false,
        hasPrev: false
      }
    }
  }

  /**
   * Fetch single portfolio item by ID
   */
  static async fetchPortfolioItem(
    id: string
  ): Promise<{ item: PortfolioItem; relatedItems: PortfolioItem[] }> {
    const endpoint = `/api/portfolio/${id}`
    const response: SinglePortfolioApiResponse = await apiRequest(endpoint)
    
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch portfolio item')
    }

    // Process JSON fields
    const processItem = (item: PortfolioItem) => ({
      ...item,
      tags: typeof item.tags === 'string' ? JSON.parse(item.tags) : item.tags,
      metadata: typeof item.metadata === 'string' ? JSON.parse(item.metadata) : item.metadata
    })

    return {
      item: processItem(response.data.item),
      relatedItems: response.data.relatedItems.map(processItem)
    }
  }

  /**
   * Fetch all categories
   */
  static async fetchCategories(): Promise<Category[]> {
    const endpoint = '/api/categories'
    const response: CategoriesApiResponse = await apiRequest(endpoint)
    
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch categories')
    }

    return response.data
  }

  /**
   * Fetch featured portfolio items
   */
  static async fetchFeaturedItems(limit: number = 6): Promise<PortfolioItem[]> {
    const { items } = await this.fetchPortfolioItems({ 
      featured: true, 
      limit,
      orderBy: 'createdAt',
      orderDirection: 'desc'
    })
    return items
  }

  /**
   * Search portfolio items (frontend filtering)
   */
  static async searchPortfolioItems(
    query: string,
    params: FetchPortfolioParams = {}
  ): Promise<{ items: PortfolioItem[]; pagination: PaginationInfo }> {
    // For now, fetch all items and filter on frontend
    // In production, this should be implemented as backend search
    const { items, pagination } = await this.fetchPortfolioItems({
      ...params,
      limit: 100 // Fetch more items for search
    })

    const filteredItems = items.filter(item => 
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.description?.toLowerCase().includes(query.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    )

    return {
      items: filteredItems,
      pagination: {
        ...pagination,
        total: filteredItems.length,
        totalPages: Math.ceil(filteredItems.length / (params.limit || 12))
      }
    }
  }
}

/**
 * React Hooks für API Calls
 */
import { useCallback } from 'react'
import { usePortfolioStore } from '@/store/portfolio-store'

export function usePortfolioApi() {
  const {
    setItems,
    addItems,
    setCategories,
    setSelectedItem,
    setPagination,
    setLoading,
    setLoadingMore,
    setError,
    clearError,
    filters,
    pagination
  } = usePortfolioStore()

  const loadPortfolioItems = useCallback(async (
    params: FetchPortfolioParams = {},
    append: boolean = false
  ) => {
    try {
      if (!append) {
        setLoading(true)
      } else {
        setLoadingMore(true)
      }
      clearError()

      const response = await PortfolioApi.fetchPortfolioItems({
        ...filters,
        ...params
      })

      if (append) {
        addItems(response.items)
      } else {
        setItems(response.items)
      }
      
      setPagination(response.pagination)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load portfolio items')
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [filters, setItems, addItems, setPagination, setLoading, setLoadingMore, setError, clearError])

  const loadCategories = useCallback(async () => {
    try {
      clearError()
      const categories = await PortfolioApi.fetchCategories()
      setCategories(categories)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load categories')
    }
  }, [setCategories, setError, clearError])

  const loadPortfolioItem = useCallback(async (id: string) => {
    try {
      setLoading(true)
      clearError()
      const { item, relatedItems } = await PortfolioApi.fetchPortfolioItem(id)
      setSelectedItem(item)
      return { item, relatedItems }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load portfolio item')
      return null
    } finally {
      setLoading(false)
    }
  }, [setSelectedItem, setLoading, setError, clearError])

  const loadMoreItems = useCallback(async () => {
    if (!pagination?.hasNext) return
    
    await loadPortfolioItems({
      page: pagination.page + 1,
      limit: pagination.limit
    }, true)
  }, [pagination, loadPortfolioItems])

  return {
    loadPortfolioItems,
    loadCategories,
    loadPortfolioItem,
    loadMoreItems
  }
}