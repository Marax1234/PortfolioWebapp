"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  PlusCircle,
  Search,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Star,
  Image as ImageIcon,
  Video,
  Calendar,
  AlertTriangle
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { PortfolioApi } from "@/lib/portfolio-api"
import type { PortfolioItem, Category } from "@/store/portfolio-store"

interface PortfolioItemWithCategory extends PortfolioItem {
  category?: Category
}

export default function PortfolioManagement() {
  const router = useRouter()
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItemWithCategory[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Filters
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("createdAt")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Load portfolio items and categories in parallel - use admin API for all items
      const [portfolioResponse, categoriesData] = await Promise.all([
        fetch(`/api/admin/portfolio?orderBy=${sortBy}&orderDirection=${sortOrder}&limit=100`)
          .then(res => res.json())
          .then(data => ({ items: data.data, pagination: data.pagination })),
        PortfolioApi.fetchCategories()
      ])

      // Map PortfolioItem[] to PortfolioItemWithCategory[] with proper category typing
      const itemsWithCategory: PortfolioItemWithCategory[] = portfolioResponse.items.map((item: PortfolioItem) => ({
        ...item,
        category: item.category ? {
          ...item.category,
          sortOrder: 0, // Default values for missing Category properties
          portfolioItemCount: 0,
          isActive: true,
          coverImage: undefined
        } : undefined
      }))
      setPortfolioItems(itemsWithCategory)
      setCategories(categoriesData)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load data')
      console.error('Portfolio management error:', error)
    } finally {
      setIsLoading(false)
    }
  }, [sortBy, sortOrder])

  // Load data
  useEffect(() => {
    loadData()
  }, [loadData])

  // Filter and sort portfolio items
  const filteredItems = portfolioItems
    .filter(item => {
      const matchesSearch = !searchQuery || 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesStatus = statusFilter === "all" || item.status === statusFilter
      const matchesCategory = categoryFilter === "all" || item.category?.id === categoryFilter
      
      return matchesSearch && matchesStatus && matchesCategory
    })

  const getCategoryName = (categoryId: string | null) => {
    if (!categoryId) return "Uncategorized"
    return categories.find(cat => cat.id === categoryId)?.name || "Unknown"
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PUBLISHED': return 'bg-green-100 text-green-800'
      case 'DRAFT': return 'bg-yellow-100 text-yellow-800'
      case 'REVIEW': return 'bg-blue-100 text-blue-800'
      case 'ARCHIVED': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('de-DE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this portfolio item?')) return
    
    try {
      // Implement delete API call here
      console.log('Delete item:', id)
      // await PortfolioApi.deletePortfolioItem(id)
      // loadData()
    } catch (error) {
      setError('Failed to delete portfolio item')
      console.error('Delete error:', error)
    }
  }

  const toggleFeatured = async (id: string, currentFeatured: boolean) => {
    try {
      // Implement update API call here
      console.log('Toggle featured:', id, !currentFeatured)
      // await PortfolioApi.updatePortfolioItem(id, { featured: !currentFeatured })
      // loadData()
    } catch (error) {
      setError('Failed to update portfolio item')
      console.error('Update error:', error)
    }
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Portfolio Management</h1>
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button onClick={loadData}>Retry</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Portfolio Management</h1>
          <p className="text-slate-600 mt-2">
            Manage your portfolio items, categories, and content
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/portfolio/create">
            <PlusCircle className="w-4 h-4 mr-2" />
            Create New Item
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filters & Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                placeholder="Search portfolio items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="PUBLISHED">Published</SelectItem>
                <SelectItem value="DRAFT">Draft</SelectItem>
                <SelectItem value="REVIEW">Review</SelectItem>
                <SelectItem value="ARCHIVED">Archived</SelectItem>
              </SelectContent>
            </Select>

            {/* Category Filter */}
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort By */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt">Created Date</SelectItem>
                <SelectItem value="updatedAt">Updated Date</SelectItem>
                <SelectItem value="publishedAt">Published Date</SelectItem>
                <SelectItem value="title">Title</SelectItem>
                <SelectItem value="viewCount">View Count</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort Order */}
            <Select value={sortOrder} onValueChange={(value) => setSortOrder(value as "asc" | "desc")}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desc">Newest First</SelectItem>
                <SelectItem value="asc">Oldest First</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Items</p>
                <p className="text-2xl font-bold">{portfolioItems.length}</p>
              </div>
              <ImageIcon className="w-8 h-8 text-slate-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Published</p>
                <p className="text-2xl font-bold">
                  {portfolioItems.filter(item => item.status === 'PUBLISHED').length}
                </p>
              </div>
              <Eye className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Drafts</p>
                <p className="text-2xl font-bold">
                  {portfolioItems.filter(item => item.status === 'DRAFT').length}
                </p>
              </div>
              <Edit className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Featured</p>
                <p className="text-2xl font-bold">
                  {portfolioItems.filter(item => item.featured).length}
                </p>
              </div>
              <Star className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Portfolio Items List */}
      <Card>
        <CardHeader>
          <CardTitle>
            Portfolio Items ({filteredItems.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="flex items-center space-x-4 p-4 border rounded-lg">
                    <div className="w-16 h-16 bg-slate-200 rounded"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-slate-200 rounded w-1/4"></div>
                      <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-12">
              <ImageIcon className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">No portfolio items found</h3>
              <p className="text-slate-600 mb-4">
                {searchQuery || statusFilter !== "all" || categoryFilter !== "all"
                  ? "Try adjusting your filters"
                  : "Get started by creating your first portfolio item"}
              </p>
              {(!searchQuery && statusFilter === "all" && categoryFilter === "all") && (
                <Button asChild>
                  <Link href="/admin/portfolio/create">Create First Item</Link>
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredItems.map(item => (
                <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-slate-50 transition-colors">
                  {/* Thumbnail */}
                  <div className="relative w-16 h-16 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
                    {item.thumbnailPath ? (
                      <Image 
                        src={item.thumbnailPath} 
                        alt={item.title}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        {item.mediaType === 'VIDEO' ? (
                          <Video className="w-6 h-6 text-slate-400" />
                        ) : (
                          <ImageIcon className="w-6 h-6 text-slate-400" />
                        )}
                      </div>
                    )}
                  </div>

                  {/* Item Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="text-sm font-medium text-slate-900 truncate">
                        {item.title}
                      </h3>
                      {item.featured && (
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      )}
                    </div>
                    <div className="flex items-center space-x-4 text-xs text-slate-500">
                      <span>
                        <Calendar className="w-3 h-3 inline mr-1" />
                        {formatDate(item.createdAt)}
                      </span>
                      <span>{getCategoryName(item.category?.id || null)}</span>
                      <span>{item.viewCount} views</span>
                    </div>
                    {item.description && (
                      <p className="text-xs text-slate-600 mt-1 truncate">
                        {item.description}
                      </p>
                    )}
                  </div>

                  {/* Status Badge */}
                  <Badge className={getStatusColor(item.status)}>
                    {item.status}
                  </Badge>

                  {/* Media Type Icon */}
                  <div className="flex-shrink-0">
                    {item.mediaType === 'VIDEO' ? (
                      <Video className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ImageIcon className="w-4 h-4 text-slate-400" />
                    )}
                  </div>

                  {/* Actions */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => router.push(`/portfolio/${item.id}`)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => router.push(`/admin/portfolio/${item.id}/edit`)}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => toggleFeatured(item.id, item.featured)}
                      >
                        <Star className="w-4 h-4 mr-2" />
                        {item.featured ? 'Remove from Featured' : 'Add to Featured'}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => handleDelete(item.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}