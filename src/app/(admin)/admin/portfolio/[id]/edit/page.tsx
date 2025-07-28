"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter, useParams } from "next/navigation"
import Image from "next/image"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
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
  Save,
  ArrowLeft,
  Eye,
  Upload,
  AlertTriangle,
  Loader2,
  Star
} from "lucide-react"
import { PortfolioApi } from "@/lib/portfolio-api"
import { FileUpload, type UploadedFile } from "@/components/ui/file-upload"
import type { ProcessedFile } from "@/lib/storage"
import type { PortfolioItem, Category } from "@/store/portfolio-store"

// Form validation schema
const portfolioFormSchema = z.object({
  title: z.string()
    .min(1, "Title is required")
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be less than 100 characters"),
  description: z.string()
    .max(500, "Description must be less than 500 characters")
    .optional(),
  categoryId: z.string(),
  status: z.enum(['DRAFT', 'REVIEW', 'PUBLISHED', 'ARCHIVED']),
  featured: z.boolean(),
  tags: z.array(z.string()),
  metadata: z.object({
    photographer: z.string().optional(),
    location: z.string().optional(),
    camera: z.string().optional(),
    lens: z.string().optional(),
    settings: z.string().optional(),
    shootDate: z.string().optional(),
  }).optional(),
})

type PortfolioFormData = z.infer<typeof portfolioFormSchema>

export default function EditPortfolioItem() {
  const router = useRouter()
  const params = useParams()
  const itemId = params.id as string

  const [categories, setCategories] = useState<Category[]>([])
  const [portfolioItem, setPortfolioItem] = useState<PortfolioItem | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [processedFiles, setProcessedFiles] = useState<ProcessedFile[]>([])
  const [showReplaceMedia, setShowReplaceMedia] = useState(false)

  const form = useForm<PortfolioFormData>({
    resolver: zodResolver(portfolioFormSchema),
    defaultValues: {
      title: "",
      description: "",
      categoryId: "",
      status: "DRAFT",
      featured: false,
      tags: [],
      metadata: {
        photographer: "",
        location: "",
        camera: "",
        lens: "",
        settings: "",
        shootDate: "",
      },
    },
  })

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      const [itemResponse, categoriesData] = await Promise.all([
        fetch(`/api/admin/portfolio/${itemId}`)
          .then(res => res.json())
          .then(data => ({ item: data.data, relatedItems: [] })),
        PortfolioApi.fetchCategories()
      ])

      const item = itemResponse.item
      setPortfolioItem(item)
      setCategories(categoriesData)

      // Populate form with existing data
      form.reset({
        title: item.title,
        description: item.description || "",
        categoryId: item.category?.id || 'none',
        status: item.status as 'DRAFT' | 'REVIEW' | 'PUBLISHED' | 'ARCHIVED',
        featured: item.featured,
        tags: Array.isArray(item.tags) ? item.tags : [],
        metadata: {
          photographer: (item.metadata?.photographer as string) || "",
          location: (item.metadata?.location as string) || "",
          camera: (item.metadata?.camera as string) || "",
          lens: (item.metadata?.lens as string) || "",
          settings: (item.metadata?.settings as string) || "",
          shootDate: (item.metadata?.shootDate as string) || "",
        },
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load portfolio item')
      console.error('Edit portfolio error:', err)
    } finally {
      setIsLoading(false)
    }
  }, [itemId, form])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleFilesChange = (_files: UploadedFile[]) => {
    // Files are handled by the upload function
  }

  const handleFileUpload = async (files: UploadedFile[]) => {
    if (files.length === 0) return

    try {
      setIsUploading(true)
      setError(null)

      // Create FormData for file upload
      const formData = new FormData()
      files.forEach(file => {
        formData.append('files', file)
      })

      // Upload files to processing API
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`)
      }

      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.error || 'Upload failed')
      }

      setProcessedFiles(result.data.processedFiles)

      // Mark files as completed
      files.forEach(file => {
        file.status = 'completed'
        file.progress = 100
      })

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload files')
      console.error('Upload error:', err)
      
      // Mark files as error
      files.forEach(file => {
        file.status = 'error'
        file.error = 'Upload failed'
      })
    } finally {
      setIsUploading(false)
    }
  }

  const onSubmit = async (data: PortfolioFormData) => {
    try {
      setIsSaving(true)
      setError(null)

      // Transform form data for API
      const updateData: Record<string, string | number | boolean | null> = {
        title: data.title,
        description: data.description || null,
        categoryId: data.categoryId === 'none' ? null : data.categoryId,
        status: data.status,
        featured: data.featured,
        tags: JSON.stringify(data.tags),
        metadata: JSON.stringify(data.metadata),
        updatedAt: new Date().toISOString(),
      }

      // If new media was uploaded, update the media paths
      if (processedFiles.length > 0) {
        const newFile = processedFiles[0] // Use first file for replacement
        updateData.mediaType = newFile.mediaType || 'IMAGE'
        updateData.filePath = newFile.publicPath
        updateData.thumbnailPath = newFile.thumbnailPath || null
        // Add webp and avif paths if available (would need to extend API schema)
      }

      console.log('Updating portfolio item:', updateData)
      
      // Call the admin update API
      const response = await fetch(`/api/admin/portfolio/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      })

      if (!response.ok) {
        throw new Error(`Update failed: ${response.statusText}`)
      }

      const result = await response.json()
      if (!result.success) {
        throw new Error(result.error || 'Update failed')
      }
      
      router.push('/admin/portfolio')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update portfolio item')
      console.error('Save error:', err)
    } finally {
      setIsSaving(false)
    }
  }

  const handlePreview = () => {
    if (portfolioItem) {
      window.open(`/portfolio/${portfolioItem.id}`, '_blank')
    }
  }

  if (error && !portfolioItem) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold">Edit Portfolio Item</h1>
        </div>
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
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Edit Portfolio Item</h1>
            {portfolioItem && (
              <p className="text-slate-600 mt-1">
                Editing: {portfolioItem.title}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {portfolioItem && (
            <Button variant="outline" onClick={handlePreview}>
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
          )}
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 space-y-6">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-slate-200 rounded w-1/3"></div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="h-4 bg-slate-200 rounded"></div>
                  <div className="h-10 bg-slate-200 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
          <Card className="animate-pulse">
            <CardContent className="p-4">
              <div className="h-40 bg-slate-200 rounded"></div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-3">
              {/* Main Content */}
              <div className="md:col-span-2 space-y-6">
                {/* Basic Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                    <CardDescription>
                      Edit the basic details of your portfolio item
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title *</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Enter portfolio item title" />
                          </FormControl>
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
                              placeholder="Describe your portfolio item..."
                              rows={4}
                            />
                          </FormControl>
                          <FormDescription>
                            Optional description that will be shown with your portfolio item
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="tags"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tags</FormLabel>
                          <FormControl>
                            <Input 
                              value={Array.isArray(field.value) ? field.value.join(', ') : ''}
                              onChange={(e) => {
                                const tags = e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
                                field.onChange(tags)
                              }}
                              placeholder="nature, landscape, photography (comma separated)"
                            />
                          </FormControl>
                          <FormDescription>
                            Add tags separated by commas to help organize your content
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                {/* Category & Status */}
                <Card>
                  <CardHeader>
                    <CardTitle>Organization</CardTitle>
                    <CardDescription>
                      Organize and set the status of your portfolio item
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="categoryId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value || ""}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="none">No Category</SelectItem>
                              {categories.map(category => (
                                <SelectItem key={category.id} value={category.id}>
                                  {category.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="DRAFT">Draft</SelectItem>
                              <SelectItem value="REVIEW">Review</SelectItem>
                              <SelectItem value="PUBLISHED">Published</SelectItem>
                              <SelectItem value="ARCHIVED">Archived</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                {/* Metadata */}
                <Card>
                  <CardHeader>
                    <CardTitle>Photography Metadata</CardTitle>
                    <CardDescription>
                      Optional technical details about the shot
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="metadata.photographer"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Photographer</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Photographer name" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="metadata.location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Where was this taken?" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="metadata.camera"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Camera</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Camera model" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="metadata.lens"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Lens</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Lens used" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="metadata.settings"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Settings</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="f/2.8, 1/500s, ISO 100" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="metadata.shootDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Shoot Date</FormLabel>
                          <FormControl>
                            <Input {...field} type="date" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex items-center justify-end space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
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
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Image Preview */}
                {portfolioItem && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Current Media</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="aspect-square bg-slate-100 rounded-lg overflow-hidden">
                        {portfolioItem.thumbnailPath ? (
                          <Image 
                            src={portfolioItem.thumbnailPath} 
                            alt={portfolioItem.title}
                            width={300}
                            height={300}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Upload className="w-8 h-8 text-slate-400" />
                          </div>
                        )}
                      </div>
                      <div className="mt-3 space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-600">Type:</span>
                          <Badge variant="outline">
                            {portfolioItem.mediaType}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-600">Views:</span>
                          <span>{portfolioItem.viewCount}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-600">Created:</span>
                          <span>{new Date(portfolioItem.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      
                      {/* Replace Media Button */}
                      <div className="mt-4">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setShowReplaceMedia(!showReplaceMedia)}
                          disabled={isUploading || isSaving}
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Replace Media
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Replace Media Upload */}
                {showReplaceMedia && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Replace Media</CardTitle>
                      <CardDescription>
                        Upload a new file to replace the current media
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <FileUpload
                        maxFiles={1}
                        maxFileSize={10 * 1024 * 1024} // 10MB
                        allowedTypes={[
                          'image/jpeg',
                          'image/png', 
                          'image/webp',
                          'image/gif',
                          'video/mp4',
                          'video/quicktime'
                        ]}
                        multiple={false}
                        onFilesChange={handleFilesChange}
                        onUpload={handleFileUpload}
                        disabled={isUploading || isSaving}
                        uploadText="Click to upload replacement file"
                      />
                      
                      {processedFiles.length > 0 && (
                        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                          <p className="text-sm text-green-800">
                            New media processed successfully! The file will be updated when you save changes.
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Featured Toggle */}
                <Card>
                  <CardHeader>
                    <CardTitle>Portfolio Settings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <FormField
                      control={form.control}
                      name="featured"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between">
                          <div className="space-y-0.5">
                            <FormLabel>Featured Item</FormLabel>
                            <FormDescription className="text-xs">
                              Show this item prominently on your portfolio
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Button
                              type="button"
                              variant={field.value ? "default" : "outline"}
                              size="sm"
                              onClick={() => field.onChange(!field.value)}
                            >
                              <Star className={`w-4 h-4 ${field.value ? 'fill-current' : ''}`} />
                            </Button>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </div>
            </div>
          </form>
        </Form>
      )}
    </div>
  )
}