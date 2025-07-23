"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
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
  Upload,
  AlertTriangle,
  Loader2,
  Star,
  Image as ImageIcon,
  Video
} from "lucide-react"
import { PortfolioApi } from "@/lib/portfolio-api"
import type { Category } from "@/store/portfolio-store"

// Form validation schema
const createPortfolioFormSchema = z.object({
  title: z.string()
    .min(1, "Title is required")
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be less than 100 characters"),
  description: z.string()
    .max(500, "Description must be less than 500 characters")
    .optional(),
  categoryId: z.string(),
  status: z.enum(['DRAFT', 'REVIEW', 'PUBLISHED', 'ARCHIVED']).default('DRAFT'),
  featured: z.boolean().default(false),
  mediaType: z.enum(['IMAGE', 'VIDEO']),
  filePath: z.string().min(1, "File is required"),
  tags: z.string().transform((str) => {
    try {
      return str.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
    } catch {
      return []
    }
  }),
  metadata: z.object({
    photographer: z.string().optional(),
    location: z.string().optional(),
    camera: z.string().optional(),
    lens: z.string().optional(),
    settings: z.string().optional(),
    shootDate: z.string().optional(),
  }).optional(),
})

type CreatePortfolioFormData = z.infer<typeof createPortfolioFormSchema>

export default function CreatePortfolioItem() {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const form = useForm<CreatePortfolioFormData>({
    resolver: zodResolver(createPortfolioFormSchema),
    defaultValues: {
      title: "",
      description: "",
      categoryId: "none",
      status: "DRAFT",
      featured: false,
      mediaType: "IMAGE",
      filePath: "",
      tags: "",
      metadata: {
        photographer: "Kilian Siebert",
        location: "",
        camera: "",
        lens: "",
        settings: "",
        shootDate: "",
      },
    },
  })

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const categoriesData = await PortfolioApi.fetchCategories()
      setCategories(categoriesData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load categories')
      console.error('Load categories error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      setIsUploading(true)
      setError(null)

      // Validate file type
      const isImage = file.type.startsWith('image/')
      const isVideo = file.type.startsWith('video/')
      
      if (!isImage && !isVideo) {
        throw new Error('Please select an image or video file')
      }

      // Set media type based on file
      form.setValue('mediaType', isImage ? 'IMAGE' : 'VIDEO')

      // Create preview URL
      const previewUrl = URL.createObjectURL(file)
      setPreviewUrl(previewUrl)

      // In a real app, you would upload the file to your storage service
      // For now, we'll simulate the upload and use a placeholder path
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const simulatedPath = `/images/portfolio/uploaded-${Date.now()}.${file.name.split('.').pop()}`
      form.setValue('filePath', simulatedPath)

      // Auto-generate title from filename if empty
      if (!form.getValues('title')) {
        const titleFromFile = file.name
          .replace(/\.[^/.]+$/, '') // Remove extension
          .replace(/[_-]/g, ' ') // Replace underscores/hyphens with spaces
          .replace(/\b\w/g, l => l.toUpperCase()) // Capitalize words
        form.setValue('title', titleFromFile)
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload file')
      console.error('Upload error:', err)
    } finally {
      setIsUploading(false)
    }
  }

  const onSubmit = async (data: CreatePortfolioFormData) => {
    try {
      setIsSaving(true)
      setError(null)

      // Transform form data for API
      const portfolioData = {
        title: data.title,
        description: data.description || null,
        mediaType: data.mediaType,
        filePath: data.filePath,
        thumbnailPath: data.mediaType === 'IMAGE' ? data.filePath : null,
        categoryId: data.categoryId === 'none' ? null : data.categoryId,
        status: data.status,
        featured: data.featured,
        tags: JSON.stringify(data.tags),
        metadata: JSON.stringify(data.metadata),
        sortOrder: 0,
        viewCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      console.log('Creating portfolio item:', portfolioData)
      
      // TODO: Implement actual API call
      // const newItem = await PortfolioApi.createPortfolioItem(portfolioData)
      
      // For now, just simulate success
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      router.push('/admin/portfolio')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create portfolio item')
      console.error('Create error:', err)
    } finally {
      setIsSaving(false)
    }
  }

  const mediaType = form.watch('mediaType')
  const filePath = form.watch('filePath')

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
            <h1 className="text-3xl font-bold text-slate-900">Create Portfolio Item</h1>
            <p className="text-slate-600 mt-1">
              Add a new item to your portfolio
            </p>
          </div>
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
                {/* File Upload */}
                <Card>
                  <CardHeader>
                    <CardTitle>Upload Media</CardTitle>
                    <CardDescription>
                      Upload an image or video for your portfolio
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-slate-400 transition-colors">
                        <input
                          type="file"
                          id="file-upload"
                          accept="image/*,video/*"
                          onChange={handleFileUpload}
                          className="hidden"
                          disabled={isUploading}
                        />
                        <label
                          htmlFor="file-upload"
                          className="cursor-pointer flex flex-col items-center space-y-4"
                        >
                          {isUploading ? (
                            <>
                              <Loader2 className="w-8 h-8 text-slate-400 animate-spin" />
                              <p className="text-sm text-slate-600">Uploading...</p>
                            </>
                          ) : (
                            <>
                              <Upload className="w-8 h-8 text-slate-400" />
                              <div>
                                <p className="text-sm font-medium text-slate-900">
                                  Click to upload or drag and drop
                                </p>
                                <p className="text-xs text-slate-500">
                                  Images (PNG, JPG, GIF) or Videos (MP4, MOV) up to 10MB
                                </p>
                              </div>
                            </>
                          )}
                        </label>
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="filePath"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input {...field} type="hidden" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Basic Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                    <CardDescription>
                      Add details about your portfolio item
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
                              {...field} 
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
                  <Button type="submit" disabled={isSaving || !filePath}>
                    {isSaving ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Create Portfolio Item
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Preview */}
                <Card>
                  <CardHeader>
                    <CardTitle>Preview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-square bg-slate-100 rounded-lg overflow-hidden">
                      {previewUrl ? (
                        mediaType === 'IMAGE' ? (
                          <img 
                            src={previewUrl} 
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <video 
                            src={previewUrl}
                            className="w-full h-full object-cover"
                            controls={false}
                            muted
                          />
                        )
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="text-center">
                            {mediaType === 'IMAGE' ? (
                              <ImageIcon className="w-12 h-12 text-slate-400 mx-auto mb-2" />
                            ) : (
                              <Video className="w-12 h-12 text-slate-400 mx-auto mb-2" />
                            )}
                            <p className="text-sm text-slate-500">No media uploaded</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Portfolio Settings */}
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