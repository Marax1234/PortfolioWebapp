"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
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
import { FormHint } from "@/components/ui/form-hint"
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
  AlertTriangle,
  Loader2,
  Star,
  Image as ImageIcon,
  Video
} from "lucide-react"
import { PortfolioApi } from "@/lib/portfolio-api"
import { FileUpload, type UploadedFile } from "@/components/ui/file-upload"
import type { ProcessedFile } from "@/lib/storage"
import type { Category } from "@/store/portfolio-store"

// Form validation schema
const createPortfolioFormSchema = z.object({
  title: z.string()
    .min(1, "Titel ist erforderlich")
    .min(3, "Titel muss mindestens 3 Zeichen lang sein")
    .max(100, "Titel darf maximal 100 Zeichen lang sein"),
  description: z.string()
    .max(500, "Beschreibung darf maximal 500 Zeichen lang sein")
    .optional(),
  categoryId: z.string()
    .min(1, "Bitte wählen Sie eine Kategorie aus"),
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
.refine((data) => data.categoryId !== "none", {
  message: "Bitte wählen Sie eine Kategorie aus",
  path: ["categoryId"]
})

type CreatePortfolioFormData = z.infer<typeof createPortfolioFormSchema>

export default function CreatePortfolioItem() {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [processedFiles, setProcessedFiles] = useState<ProcessedFile[]>([])
  const [hasUploadedFiles, setHasUploadedFiles] = useState(false)

  const form = useForm<CreatePortfolioFormData>({
    resolver: zodResolver(createPortfolioFormSchema),
    defaultValues: {
      title: "",
      description: "",
      categoryId: "none",
      status: "DRAFT",
      featured: false,
      tags: [],
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

  const handleFilesChange = async (files: UploadedFile[]) => {
    // Auto-generate title from first file if empty
    if (files.length > 0 && !form.getValues('title')) {
      const firstFile = files[0]
      const titleFromFile = firstFile.name
        .replace(/\.[^/.]+$/, '') // Remove extension
        .replace(/[_-]/g, ' ') // Replace underscores/hyphens with spaces
        .replace(/\b\w/g, l => l.toUpperCase()) // Capitalize words
      form.setValue('title', titleFromFile)
    }

    // Auto-upload files when they are selected
    if (files.length > 0) {
      await handleFileUpload(files)
    }
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
      setHasUploadedFiles(true)

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

  const onSubmit = async (formData: CreatePortfolioFormData) => {
    try {
      setIsSaving(true)
      setError(null)

      // Validate that we have processed files
      if (processedFiles.length === 0) {
        setError('Bitte laden Sie mindestens eine Datei hoch, bevor Sie das Portfolio-Element erstellen.')
        setIsSaving(false)
        return
      }

      // Create portfolio items for each processed file
      const createdItems = []
      
      for (let i = 0; i < processedFiles.length; i++) {
        const processedFile = processedFiles[i]
        
        // Create title for this item (use form title for first item, or generate for others)
        const itemTitle = i === 0 
          ? formData.title 
          : `${formData.title} ${i + 1}`

        const portfolioData = {
          title: itemTitle,
          description: formData.description || null,
          mediaType: processedFile.mediaType,
          filePath: processedFile.publicPath,
          thumbnailPath: processedFile.thumbnailPath || null,
          webpPath: processedFile.webpPath || null,
          avifPath: processedFile.avifPath || null,
          categoryId: formData.categoryId === 'none' ? null : formData.categoryId,
          status: formData.status,
          featured: formData.featured && i === 0, // Only first item can be featured
          tags: formData.tags,
          metadata: {
            ...formData.metadata,
            originalFileName: processedFile.original.originalName,
            fileSize: processedFile.original.size,
            dimensions: processedFile.original.width && processedFile.original.height 
              ? { width: processedFile.original.width, height: processedFile.original.height }
              : null
          },
          sortOrder: i
        }

        console.log('Creating portfolio item:', portfolioData)

        // Create portfolio item via API
        const response = await fetch('/api/portfolio', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(portfolioData)
        })

        if (!response.ok) {
          throw new Error(`Failed to create portfolio item: ${response.statusText}`)
        }

        const result = await response.json()
        if (!result.success) {
          throw new Error(result.error || 'Failed to create portfolio item')
        }

        createdItems.push(result.data)
      }

      console.log(`Successfully created ${createdItems.length} portfolio items`)
      router.push('/admin/portfolio')
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create portfolio items')
      console.error('Create error:', err)
    } finally {
      setIsSaving(false)
    }
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
                    <CardTitle>Medien hochladen *</CardTitle>
                    <CardDescription>
                      Laden Sie Bilder oder Videos für Ihr Portfolio hoch. Sie können mehrere Dateien gleichzeitig hochladen.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <FileUpload
                      maxFiles={10}
                      maxFileSize={10 * 1024 * 1024} // 10MB
                      allowedTypes={[
                        'image/jpeg',
                        'image/png', 
                        'image/webp',
                        'image/gif',
                        'video/mp4',
                        'video/quicktime'
                      ]}
                      multiple={true}
                      onFilesChange={handleFilesChange}
                      disabled={isUploading || isSaving}
                      uploadText="Klicken Sie zum Hochladen oder ziehen Sie Dateien hierher"
                      dragText="Ziehen Sie Dateien hierher zum Hochladen"
                      dropText="Dateien hier ablegen"
                    />
                    {!hasUploadedFiles && (
                      <FormHint>
                        <strong>Hinweis:</strong> Sie müssen mindestens eine Datei hochladen, bevor Sie das Portfolio-Element erstellen können.
                      </FormHint>
                    )}
                  </CardContent>
                </Card>

                {/* Basic Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Grundinformationen</CardTitle>
                    <CardDescription>
                      Fügen Sie Details zu Ihrem Portfolio-Element hinzu
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Titel *</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              placeholder="Portfolio-Element Titel eingeben" 
                              className={!field.value ? "border-red-300" : ""}
                            />
                          </FormControl>
                          <FormDescription>
                            3-100 Zeichen. Beschreibender Name für Ihr Portfolio-Element
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
                          <FormLabel>Beschreibung</FormLabel>
                          <FormControl>
                            <Textarea 
                              {...field} 
                              placeholder="Beschreiben Sie Ihr Portfolio-Element..."
                              rows={4}
                            />
                          </FormControl>
                          <FormDescription>
                            Optionale Beschreibung (max. 500 Zeichen) die mit Ihrem Portfolio-Element angezeigt wird
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
                          <FormLabel>Schlagwörter</FormLabel>
                          <FormControl>
                            <Input 
                              value={Array.isArray(field.value) ? field.value.join(', ') : ''}
                              onChange={(e) => {
                                const tags = e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
                                field.onChange(tags)
                              }}
                              placeholder="natur, landschaft, fotografie (kommagetrennt)"
                            />
                          </FormControl>
                          <FormDescription>
                            Fügen Sie Tags hinzu (durch Kommas getrennt) um Ihren Inhalt zu organisieren
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
                          <FormLabel>Kategorie *</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value || ""}
                          >
                            <FormControl>
                              <SelectTrigger className={!field.value || field.value === "none" ? "border-red-300" : ""}>
                                <SelectValue placeholder="Kategorie auswählen" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="none" disabled>Kategorie auswählen</SelectItem>
                              {categories.map(category => (
                                <SelectItem key={category.id} value={category.id}>
                                  {category.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Wählen Sie eine Kategorie für Ihr Portfolio-Element aus
                          </FormDescription>
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
                  <Button type="submit" disabled={isSaving || !hasUploadedFiles}>
                    {isSaving ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Create Portfolio {processedFiles.length > 1 ? 'Items' : 'Item'}
                        {processedFiles.length > 0 && ` (${processedFiles.length})`}
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
                    <CardTitle>Processed Files</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {processedFiles.length > 0 ? (
                      <div className="space-y-3">
                        {processedFiles.map((file, index) => (
                          <div key={index} className="border rounded-lg p-3">
                            <div className="aspect-square bg-slate-100 rounded-lg overflow-hidden mb-2">
                              {file.mediaType === 'IMAGE' ? (
                                <Image 
                                  src={file.publicPath} 
                                  alt="Preview"
                                  width={300}
                                  height={300}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Video className="w-8 h-8 text-slate-400" />
                                </div>
                              )}
                            </div>
                            <div className="text-xs text-slate-600 space-y-1">
                              <p><strong>Type:</strong> {file.mediaType}</p>
                              <p><strong>Size:</strong> {Math.round(file.original.size / 1024)}KB</p>
                              {file.original.width && file.original.height && (
                                <p><strong>Dimensions:</strong> {file.original.width}x{file.original.height}</p>
                              )}
                              <div className="flex flex-wrap gap-1 mt-2">
                                {file.thumbnailPath && (
                                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">Thumbnail</span>
                                )}
                                {file.webpPath && (
                                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">WebP</span>
                                )}
                                {file.avifPath && (
                                  <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs">AVIF</span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="aspect-square bg-slate-100 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <ImageIcon className="w-12 h-12 text-slate-400 mx-auto mb-2" />
                          <p className="text-sm text-slate-500">No files processed yet</p>
                        </div>
                      </div>
                    )}
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