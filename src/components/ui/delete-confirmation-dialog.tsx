"use client"

import { ReactNode } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Loader2 } from "lucide-react"

interface DeleteConfirmationDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description: string | ReactNode
  itemName?: string
  isLoading?: boolean
  destructiveAction?: string
  cancelAction?: string
  disabled?: boolean
  warningMessage?: string
}

export function DeleteConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  itemName,
  isLoading = false,
  destructiveAction = "Delete",
  cancelAction = "Cancel",
  disabled = false,
  warningMessage
}: DeleteConfirmationDialogProps) {
  const handleConfirm = () => {
    if (!disabled && !isLoading) {
      onConfirm()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-left">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                {title}
              </DialogTitle>
            </div>
          </div>
          <DialogDescription className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            {typeof description === 'string' ? (
              <span>{description}</span>
            ) : (
              description
            )}
          </DialogDescription>
          
          {itemName && (
            <div className="mt-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                Item to delete:
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400 font-mono">
                &ldquo;{itemName}&rdquo;
              </p>
            </div>
          )}

          {warningMessage && (
            <div className="mt-3 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  {warningMessage}
                </p>
              </div>
            </div>
          )}
        </DialogHeader>

        <DialogFooter className="flex-col-reverse sm:flex-row gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            {cancelAction}
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={disabled || isLoading}
            className="w-full sm:w-auto bg-red-600 hover:bg-red-700 focus-visible:ring-red-600 dark:bg-red-600 dark:hover:bg-red-700"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Deleting...
              </>
            ) : (
              destructiveAction
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Convenience hook for common delete scenarios
export function useDeleteConfirmation() {
  const createDeleteDialog = (options: {
    itemType: string
    itemName: string
    onConfirm: () => void
    hasRelatedItems?: boolean
    relatedItemsCount?: number
    relatedItemsType?: string
  }) => {
    const {
      itemType,
      itemName,
      onConfirm,
      hasRelatedItems = false,
      relatedItemsCount = 0,
      relatedItemsType = "items"
    } = options

    const title = `Delete ${itemType}`
    
    const description = hasRelatedItems ? (
      <div className="space-y-2">
        <p>
          You are about to delete <strong>&ldquo;{itemName}&rdquo;</strong>. This action cannot be undone.
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          This will permanently remove the {itemType.toLowerCase()} and all associated data.
        </p>
      </div>
    ) : (
      <div className="space-y-2">
        <p>
          You are about to delete <strong>&ldquo;{itemName}&rdquo;</strong>. This action cannot be undone.
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          This will permanently remove the {itemType.toLowerCase()} and all associated data.
        </p>
      </div>
    )

    const warningMessage = hasRelatedItems
      ? `This ${itemType.toLowerCase()} contains ${relatedItemsCount} ${relatedItemsType}. Please move or delete them first before removing this ${itemType.toLowerCase()}.`
      : undefined

    return {
      title,
      description,
      itemName,
      onConfirm,
      warningMessage,
      disabled: hasRelatedItems,
      destructiveAction: hasRelatedItems ? "Cannot Delete" : `Delete ${itemType}`
    }
  }

  return { createDeleteDialog }
}