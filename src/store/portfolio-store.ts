/**
 * Portfolio Store - State Management für Portfolio Gallery
 * Implementiert nach SDD 8.2.3 State Management Patterns
 */
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface PortfolioItem {
  id: string;
  title: string;
  description?: string;
  mediaType: 'IMAGE' | 'VIDEO';
  filePath: string;
  thumbnailPath?: string;
  tags: string[];
  metadata: Record<string, unknown>;
  status: string;
  featured: boolean;
  viewCount: number;
  createdAt: string;
  publishedAt?: string;
  category?: {
    id: string;
    name: string;
    slug: string;
    description?: string;
  };
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  coverImage?: string;
  sortOrder: number;
  portfolioItemCount: number;
  isActive: boolean;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

interface PortfolioFilters {
  category?: string;
  featured?: boolean;
  mediaType?: 'IMAGE' | 'VIDEO';
  orderBy?: 'createdAt' | 'publishedAt' | 'viewCount' | 'title';
  orderDirection?: 'asc' | 'desc';
}

interface PortfolioState {
  // Data
  items: PortfolioItem[];
  categories: Category[];
  selectedItem: PortfolioItem | null;

  // Pagination
  pagination: PaginationInfo | null;

  // Filters & Search
  filters: PortfolioFilters;
  searchQuery: string;

  // UI States
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;
  view: 'grid' | 'masonry';

  // Lightbox
  lightboxOpen: boolean;
  lightboxIndex: number;

  // Actions
  setItems: (items: PortfolioItem[]) => void;
  addItems: (items: PortfolioItem[]) => void;
  setCategories: (categories: Category[]) => void;
  setSelectedItem: (item: PortfolioItem | null) => void;
  setPagination: (pagination: PaginationInfo) => void;
  setFilters: (filters: Partial<PortfolioFilters>) => void;
  setSearchQuery: (query: string) => void;
  setLoading: (loading: boolean) => void;
  setLoadingMore: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setView: (view: 'grid' | 'masonry') => void;

  // Lightbox Actions
  openLightbox: (index: number) => void;
  closeLightbox: () => void;
  nextImage: () => void;
  prevImage: () => void;

  // Utility Actions
  resetFilters: () => void;
  clearError: () => void;
  incrementViewCount: (itemId: string) => void;
}

const initialFilters: PortfolioFilters = {
  orderBy: 'createdAt',
  orderDirection: 'desc',
};

export const usePortfolioStore = create<PortfolioState>()(
  devtools(
    (set, get) => ({
      // Initial State
      items: [],
      categories: [],
      selectedItem: null,
      pagination: null,
      filters: initialFilters,
      searchQuery: '',
      isLoading: false,
      isLoadingMore: false,
      error: null,
      view: 'masonry',
      lightboxOpen: false,
      lightboxIndex: 0,

      // Data Actions
      setItems: items => set({ items }, false, 'setItems'),

      addItems: newItems =>
        set(
          state => {
            // Prevent duplicates by filtering out items that already exist
            const existingIds = new Set(state.items.map(item => item.id));
            const uniqueNewItems = newItems.filter(
              item => !existingIds.has(item.id)
            );
            return {
              items: [...state.items, ...uniqueNewItems],
            };
          },
          false,
          'addItems'
        ),

      setCategories: categories => set({ categories }, false, 'setCategories'),

      setSelectedItem: item =>
        set({ selectedItem: item }, false, 'setSelectedItem'),

      setPagination: pagination => set({ pagination }, false, 'setPagination'),

      // Filter Actions
      setFilters: newFilters =>
        set(
          state => ({
            filters: { ...state.filters, ...newFilters },
          }),
          false,
          'setFilters'
        ),

      setSearchQuery: query =>
        set({ searchQuery: query }, false, 'setSearchQuery'),

      // UI State Actions
      setLoading: loading => set({ isLoading: loading }, false, 'setLoading'),

      setLoadingMore: loading =>
        set({ isLoadingMore: loading }, false, 'setLoadingMore'),

      setError: error => set({ error }, false, 'setError'),

      setView: view => set({ view }, false, 'setView'),

      // Lightbox Actions
      openLightbox: index =>
        set(
          { lightboxOpen: true, lightboxIndex: index },
          false,
          'openLightbox'
        ),

      closeLightbox: () =>
        set({ lightboxOpen: false, lightboxIndex: 0 }, false, 'closeLightbox'),

      nextImage: () => {
        const { items, lightboxIndex } = get();
        const nextIndex =
          lightboxIndex < items.length - 1 ? lightboxIndex + 1 : 0;
        set({ lightboxIndex: nextIndex }, false, 'nextImage');
      },

      prevImage: () => {
        const { items, lightboxIndex } = get();
        const prevIndex =
          lightboxIndex > 0 ? lightboxIndex - 1 : items.length - 1;
        set({ lightboxIndex: prevIndex }, false, 'prevImage');
      },

      // Utility Actions
      resetFilters: () =>
        set(
          {
            filters: initialFilters,
            searchQuery: '',
          },
          false,
          'resetFilters'
        ),

      clearError: () => set({ error: null }, false, 'clearError'),

      incrementViewCount: itemId =>
        set(
          state => ({
            items: state.items.map(item =>
              item.id === itemId
                ? { ...item, viewCount: item.viewCount + 1 }
                : item
            ),
          }),
          false,
          'incrementViewCount'
        ),
    }),
    {
      name: 'portfolio-store',
    }
  )
);
