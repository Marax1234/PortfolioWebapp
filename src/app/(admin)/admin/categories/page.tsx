'use client';

import { useEffect, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  AlertTriangle,
  Edit,
  Eye,
  EyeOff,
  Folder,
  Image as ImageIcon,
  Loader2,
  MoreVertical,
  PlusCircle,
  Save,
  Trash2,
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { DeleteConfirmationDialog } from '@/components/ui/delete-confirmation-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { PortfolioApi } from '@/lib/portfolio-api';
import type { Category } from '@/store/portfolio-store';

// Form validation schema
const categoryFormSchema = z.object({
  name: z
    .string()
    .min(1, 'Category name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters'),
  description: z
    .string()
    .max(200, 'Description must be less than 200 characters')
    .optional(),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .regex(
      /^[a-z0-9-]+$/,
      'Slug must contain only lowercase letters, numbers, and hyphens'
    ),
  isActive: z.boolean(),
  sortOrder: z.number().min(0),
});

type CategoryFormData = z.infer<typeof categoryFormSchema>;

interface ExtendedCategory extends Category {
  portfolioCount?: number;
}

export default function CategoryManagement() {
  const [categories, setCategories] = useState<ExtendedCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] =
    useState<ExtendedCategory | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] =
    useState<ExtendedCategory | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: '',
      description: '',
      slug: '',
      isActive: true,
      sortOrder: 0,
    },
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [categoriesData, portfolioResponse] = await Promise.all([
        PortfolioApi.fetchCategories(),
        PortfolioApi.fetchPortfolioItems({ limit: 1000 }), // Get all to count by category
      ]);

      // Count portfolio items per category
      const categoryCounts = portfolioResponse.items.reduce(
        (acc, item) => {
          if (item.category?.id) {
            acc[item.category.id] = (acc[item.category.id] || 0) + 1;
          }
          return acc;
        },
        {} as Record<string, number>
      );

      const categoriesWithCounts = categoriesData.map(category => ({
        ...category,
        portfolioCount: categoryCounts[category.id] || 0,
      }));

      setCategories(categoriesWithCounts);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to load categories'
      );
      console.error('Category management error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const generateSlug = (name: string): string => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .trim();
  };

  const handleNameChange = (name: string) => {
    form.setValue('name', name);
    if (!editingCategory) {
      // Auto-generate slug only when creating new category
      const slug = generateSlug(name);
      form.setValue('slug', slug);
    }
  };

  const openCreateDialog = () => {
    setEditingCategory(null);
    form.reset({
      name: '',
      description: '',
      slug: '',
      isActive: true,
      sortOrder: Math.max(...categories.map(c => c.sortOrder), -1) + 1,
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (category: ExtendedCategory) => {
    setEditingCategory(category);
    form.reset({
      name: category.name,
      description: category.description || '',
      slug: category.slug,
      isActive: category.isActive,
      sortOrder: category.sortOrder,
    });
    setIsDialogOpen(true);
  };

  const onSubmit = async (data: CategoryFormData) => {
    try {
      setIsSaving(true);
      setError(null);

      const categoryData = {
        name: data.name,
        description: data.description || null,
        slug: data.slug,
        isActive: data.isActive,
        sortOrder: data.sortOrder,
      };

      if (editingCategory) {
        console.log('Updating category:', editingCategory.id, categoryData);
        await PortfolioApi.updateCategory(editingCategory.id, categoryData);
      } else {
        console.log('Creating category:', categoryData);
        await PortfolioApi.createCategory(categoryData);
      }

      setIsDialogOpen(false);
      loadCategories();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save category');
      console.error('Save category error:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteClick = (category: ExtendedCategory) => {
    setCategoryToDelete(category);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!categoryToDelete) return;

    try {
      setIsDeleting(true);
      console.log('Deleting category:', categoryToDelete.id);
      await PortfolioApi.deleteCategory(categoryToDelete.id);

      setDeleteDialogOpen(false);
      setCategoryToDelete(null);
      loadCategories();
    } catch (error) {
      setError('Failed to delete category');
      console.error('Delete category error:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setCategoryToDelete(null);
  };

  const toggleCategoryStatus = async (category: ExtendedCategory) => {
    try {
      console.log('Toggling category status:', category.id, !category.isActive);
      await PortfolioApi.updateCategory(category.id, {
        isActive: !category.isActive,
      });

      loadCategories();
    } catch (error) {
      setError('Failed to update category status');
      console.error('Toggle category status error:', error);
    }
  };

  if (error && categories.length === 0) {
    return (
      <div className='space-y-6'>
        <h1 className='text-3xl font-bold'>Category Management</h1>
        <Alert variant='destructive'>
          <AlertTriangle className='h-4 w-4' />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button onClick={loadCategories}>Retry</Button>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-start justify-between'>
        <div>
          <h1 className='text-3xl font-bold text-slate-900'>
            Category Management
          </h1>
          <p className='mt-2 text-slate-600'>
            Organize your portfolio with categories
          </p>
        </div>
        <Button onClick={openCreateDialog}>
          <PlusCircle className='mr-2 h-4 w-4' />
          Create Category
        </Button>
      </div>

      {error && (
        <Alert variant='destructive'>
          <AlertTriangle className='h-4 w-4' />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Stats */}
      <div className='grid gap-4 md:grid-cols-4'>
        <Card>
          <CardContent className='p-4'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-slate-600'>
                  Total Categories
                </p>
                <p className='text-2xl font-bold'>{categories.length}</p>
              </div>
              <Folder className='h-8 w-8 text-slate-400' />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className='p-4'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-slate-600'>Active</p>
                <p className='text-2xl font-bold'>
                  {categories.filter(cat => cat.isActive).length}
                </p>
              </div>
              <Eye className='h-8 w-8 text-green-500' />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className='p-4'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-slate-600'>Inactive</p>
                <p className='text-2xl font-bold'>
                  {categories.filter(cat => !cat.isActive).length}
                </p>
              </div>
              <EyeOff className='h-8 w-8 text-slate-400' />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className='p-4'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-slate-600'>
                  Portfolio Items
                </p>
                <p className='text-2xl font-bold'>
                  {categories.reduce(
                    (sum, cat) => sum + (cat.portfolioCount || 0),
                    0
                  )}
                </p>
              </div>
              <ImageIcon className='h-8 w-8 text-blue-500' />
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
            <div className='space-y-4'>
              {[...Array(5)].map((_, i) => (
                <div key={i} className='animate-pulse'>
                  <div className='flex items-center space-x-4 rounded-lg border p-4'>
                    <div className='h-12 w-12 rounded bg-slate-200'></div>
                    <div className='flex-1 space-y-2'>
                      <div className='h-4 w-1/4 rounded bg-slate-200'></div>
                      <div className='h-3 w-1/2 rounded bg-slate-200'></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : categories.length === 0 ? (
            <div className='py-12 text-center'>
              <Folder className='mx-auto mb-4 h-12 w-12 text-slate-400' />
              <h3 className='mb-2 text-lg font-medium text-slate-900'>
                No categories yet
              </h3>
              <p className='mb-4 text-slate-600'>
                Create your first category to organize your portfolio
              </p>
              <Button onClick={openCreateDialog}>Create First Category</Button>
            </div>
          ) : (
            <div className='space-y-4'>
              {categories
                .sort((a, b) => a.sortOrder - b.sortOrder)
                .map(category => (
                  <div
                    key={category.id}
                    className='flex items-center space-x-4 rounded-lg border p-4 transition-colors hover:bg-slate-50'
                  >
                    {/* Icon */}
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-lg ${
                        category.isActive ? 'bg-blue-100' : 'bg-slate-100'
                      }`}
                    >
                      <Folder
                        className={`h-6 w-6 ${
                          category.isActive ? 'text-blue-600' : 'text-slate-400'
                        }`}
                      />
                    </div>

                    {/* Category Details */}
                    <div className='min-w-0 flex-1'>
                      <div className='mb-1 flex items-center space-x-2'>
                        <h3 className='text-sm font-medium text-slate-900'>
                          {category.name}
                        </h3>
                        <Badge
                          variant={category.isActive ? 'default' : 'secondary'}
                        >
                          {category.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      <div className='mb-1 flex items-center space-x-4 text-xs text-slate-500'>
                        <span>Slug: /{category.slug}</span>
                        <span>Order: {category.sortOrder}</span>
                        <span>{category.portfolioCount || 0} items</span>
                      </div>
                      {category.description && (
                        <p className='truncate text-xs text-slate-600'>
                          {category.description}
                        </p>
                      )}
                    </div>

                    {/* Actions */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant='ghost' size='sm'>
                          <MoreVertical className='h-4 w-4' />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align='end'>
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => openEditDialog(category)}
                        >
                          <Edit className='mr-2 h-4 w-4' />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => toggleCategoryStatus(category)}
                        >
                          {category.isActive ? (
                            <>
                              <EyeOff className='mr-2 h-4 w-4' />
                              Deactivate
                            </>
                          ) : (
                            <>
                              <Eye className='mr-2 h-4 w-4' />
                              Activate
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className='text-red-600'
                          onClick={() => handleDeleteClick(category)}
                        >
                          <Trash2 className='mr-2 h-4 w-4' />
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
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? 'Edit Category' : 'Create New Category'}
            </DialogTitle>
            <DialogDescription>
              {editingCategory
                ? 'Update the category details below.'
                : 'Add a new category to organize your portfolio.'}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category Name *</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder='e.g., Nature Photography'
                        onChange={e => handleNameChange(e.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='slug'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL Slug *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder='nature-photography' />
                    </FormControl>
                    <FormDescription>
                      Used in URLs. Only lowercase letters, numbers, and
                      hyphens.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='description'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder='Brief description of this category...'
                        rows={3}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className='grid grid-cols-2 gap-4'>
                <FormField
                  control={form.control}
                  name='sortOrder'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sort Order</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type='number'
                          min={0}
                          onChange={e =>
                            field.onChange(parseInt(e.target.value) || 0)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='isActive'
                  render={({ field }) => (
                    <FormItem className='flex flex-row items-center justify-between pt-6'>
                      <div className='space-y-0.5'>
                        <FormLabel>Active</FormLabel>
                      </div>
                      <FormControl>
                        <Button
                          type='button'
                          variant={field.value ? 'default' : 'outline'}
                          size='sm'
                          onClick={() => field.onChange(!field.value)}
                        >
                          {field.value ? (
                            <Eye className='h-4 w-4' />
                          ) : (
                            <EyeOff className='h-4 w-4' />
                          )}
                        </Button>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <div className='flex justify-end space-x-2 pt-4'>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => setIsDialogOpen(false)}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
                <Button type='submit' disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className='mr-2 h-4 w-4' />
                      {editingCategory ? 'Update' : 'Create'}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      {categoryToDelete && (
        <DeleteConfirmationDialog
          isOpen={deleteDialogOpen}
          onClose={handleDeleteCancel}
          onConfirm={handleDeleteConfirm}
          isLoading={isDeleting}
          title='Delete Category'
          description={
            <div className='space-y-2'>
              <p>
                You are about to delete{' '}
                <strong>&ldquo;{categoryToDelete.name}&rdquo;</strong>. This
                action cannot be undone.
              </p>
              <p className='text-sm text-slate-500 dark:text-slate-400'>
                This will permanently remove the category and all associated
                data.
              </p>
            </div>
          }
          itemName={categoryToDelete.name}
          warningMessage={
            (categoryToDelete.portfolioCount || 0) > 0
              ? `This category contains ${categoryToDelete.portfolioCount} portfolio items. Please move or delete them first before removing this category.`
              : undefined
          }
          disabled={(categoryToDelete.portfolioCount || 0) > 0}
          destructiveAction={
            (categoryToDelete.portfolioCount || 0) > 0
              ? 'Cannot Delete'
              : 'Delete Category'
          }
        />
      )}
    </div>
  );
}
