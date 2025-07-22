"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  PlusCircle,
  MoreVertical,
  Edit,
  Trash2,
  AlertTriangle,
  Loader2,
  Save,
  Folder,
  Image as ImageIcon,
  Eye,
  EyeOff
} from "lucide-react"
import { PortfolioApi } from "@/lib/portfolio-api"
import type { Category } from "@/store/portfolio-store"

// Form validation schema
const categoryFormSchema = z.object({
  name: z.string()
    .min(1, "Category name is required")
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters"),
  description: z.string()
    .max(200, "Description must be less than 200 characters")
    .optional(),
  slug: z.string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
  isActive: z.boolean().default(true),
  sortOrder: z.number().min(0).default(0),
})

type CategoryFormData = z.infer<typeof categoryFormSchema>

interface ExtendedCategory extends Category {
  portfolioCount?: number
}

export default function CategoryManagement() {
  const [categories, setCategories] = useState<ExtendedCategory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: "",
      description: "",
      slug: "",
      isActive: true,
      sortOrder: 0,
    },
  })

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const [categoriesData, portfolioResponse] = await Promise.all([
        PortfolioApi.fetchCategories(),
        PortfolioApi.fetchPortfolioItems({ limit: 1000 }) // Get all to count by category
      ])

      // Count portfolio items per category
      const categoryCounts = portfolioResponse.items.reduce((acc, item) => {
        if (item.categoryId) {
          acc[item.categoryId] = (acc[item.categoryId] || 0) + 1
        }
        return acc
      }, {} as Record<string, number>)

      const categoriesWithCounts = categoriesData.map(category => ({
        ...category,
        portfolioCount: categoryCounts[category.id] || 0
      }))

      setCategories(categoriesWithCounts)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load categories')
      console.error('Category management error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const generateSlug = (name: string): string => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .trim()
  }

  const handleNameChange = (name: string) => {
    form.setValue('name', name)
    if (!editingCategory) {
      // Auto-generate slug only when creating new category
      const slug = generateSlug(name)
      form.setValue('slug', slug)
    }
  }

  const openCreateDialog = () => {
    setEditingCategory(null)
    form.reset({
      name: "",
      description: "",
      slug: "",
      isActive: true,
      sortOrder: Math.max(...categories.map(c => c.sortOrder), -1) + 1,
    })
    setIsDialogOpen(true)
  }

  const openEditDialog = (category: Category) => {
    setEditingCategory(category)
    form.reset({
      name: category.name,
      description: category.description || "",
      slug: category.slug,
      isActive: category.isActive,
      sortOrder: category.sortOrder,
    })
    setIsDialogOpen(true)
  }

  const onSubmit = async (data: CategoryFormData) => {
    try {
      setIsSaving(true)
      setError(null)

      const categoryData = {
        name: data.name,
        description: data.description || null,
        slug: data.slug,
        isActive: data.isActive,
        sortOrder: data.sortOrder,
      }

      if (editingCategory) {
        console.log('Updating category:', editingCategory.id, categoryData)
        // await PortfolioApi.updateCategory(editingCategory.id, categoryData)
      } else {
        console.log('Creating category:', categoryData)
        // await PortfolioApi.createCategory(categoryData)
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      setIsDialogOpen(false)
      loadCategories()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save category')
      console.error('Save category error:', err)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (category: Category) => {
    const portfolioCount = categories.find(c => c.id === category.id)?.portfolioCount || 0
    
    if (portfolioCount > 0) {
      alert(`Cannot delete category "${category.name}" because it contains ${portfolioCount} portfolio items. Please move or delete the items first.`)
      return
    }

    if (!confirm(`Are you sure you want to delete the category "${category.name}"?`)) return

    try {
      console.log('Deleting category:', category.id)
      // await PortfolioApi.deleteCategory(category.id)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      loadCategories()
    } catch (err) {
      setError('Failed to delete category')
    }
  }

  const toggleCategoryStatus = async (category: Category) => {
    try {
      console.log('Toggling category status:', category.id, !category.isActive)
      // await PortfolioApi.updateCategory(category.id, { isActive: !category.isActive })
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      loadCategories()
    } catch (err) {
      setError('Failed to update category status')
    }
  }

  if (error && categories.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Category Management</h1>
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button onClick={loadCategories}>Retry</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Category Management</h1>
          <p className="text-slate-600 mt-2">
            Organize your portfolio with categories
          </p>
        </div>
        <Button onClick={openCreateDialog}>
          <PlusCircle className="w-4 h-4 mr-2" />
          Create Category
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Categories</p>
                <p className="text-2xl font-bold">{categories.length}</p>
              </div>
              <Folder className="w-8 h-8 text-slate-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Active</p>
                <p className="text-2xl font-bold">
                  {categories.filter(cat => cat.isActive).length}
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
                <p className="text-sm font-medium text-slate-600">Inactive</p>
                <p className="text-2xl font-bold">
                  {categories.filter(cat => !cat.isActive).length}
                </p>
              </div>
              <EyeOff className="w-8 h-8 text-slate-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Portfolio Items</p>
                <p className="text-2xl font-bold">
                  {categories.reduce((sum, cat) => sum + (cat.portfolioCount || 0), 0)}
                </p>
              </div>
              <ImageIcon className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Categories List */}
      <Card>
        <CardHeader>
          <CardTitle>Categories</CardTitle>
          <CardDescription>
            Manage your portfolio categories and organization
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="flex items-center space-x-4 p-4 border rounded-lg">
                    <div className="w-12 h-12 bg-slate-200 rounded"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-slate-200 rounded w-1/4"></div>
                      <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-12">
              <Folder className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">No categories yet</h3>
              <p className="text-slate-600 mb-4">
                Create your first category to organize your portfolio
              </p>
              <Button onClick={openCreateDialog}>Create First Category</Button>
            </div>
          ) : (
            <div className="space-y-4">
              {categories
                .sort((a, b) => a.sortOrder - b.sortOrder)
                .map((category, index) => (
                <div key={category.id} className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-slate-50 transition-colors">
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    category.isActive ? 'bg-blue-100' : 'bg-slate-100'
                  }`}>
                    <Folder className={`w-6 h-6 ${
                      category.isActive ? 'text-blue-600' : 'text-slate-400'
                    }`} />
                  </div>

                  {/* Category Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="text-sm font-medium text-slate-900">
                        {category.name}
                      </h3>
                      <Badge variant={category.isActive ? "default" : "secondary"}>
                        {category.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-4 text-xs text-slate-500 mb-1">
                      <span>Slug: /{category.slug}</span>
                      <span>Order: {category.sortOrder}</span>
                      <span>{category.portfolioCount || 0} items</span>
                    </div>
                    {category.description && (
                      <p className="text-xs text-slate-600 truncate">
                        {category.description}
                      </p>
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
                        onClick={() => openEditDialog(category)}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => toggleCategoryStatus(category)}
                      >
                        {category.isActive ? (
                          <>
                            <EyeOff className="w-4 h-4 mr-2" />
                            Deactivate
                          </>
                        ) : (
                          <>
                            <Eye className="w-4 h-4 mr-2" />
                            Activate
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => handleDelete(category)}
                        disabled={(category.portfolioCount || 0) > 0}
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

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? 'Edit Category' : 'Create New Category'}
            </DialogTitle>
            <DialogDescription>
              {editingCategory 
                ? 'Update the category details below.'
                : 'Add a new category to organize your portfolio.'
              }
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category Name *</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="e.g., Nature Photography"
                        onChange={(e) => handleNameChange(e.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL Slug *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="nature-photography" />
                    </FormControl>
                    <FormDescription>
                      Used in URLs. Only lowercase letters, numbers, and hyphens.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        placeholder="Brief description of this category..."
                        rows={3}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="sortOrder"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sort Order</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          type="number" 
                          min={0}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between pt-6">
                      <div className="space-y-0.5">
                        <FormLabel>Active</FormLabel>
                      </div>
                      <FormControl>
                        <Button
                          type="button"
                          variant={field.value ? "default" : "outline"}
                          size="sm"
                          onClick={() => field.onChange(!field.value)}
                        >
                          {field.value ? (
                            <Eye className="w-4 h-4" />
                          ) : (
                            <EyeOff className="w-4 h-4" />
                          )}
                        </Button>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      {editingCategory ? 'Update' : 'Create'}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  )
}