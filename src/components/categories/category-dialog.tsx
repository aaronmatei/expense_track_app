import { CategoryForm } from "@/components/categories/category-form"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { useCreateCategory, useUpdateCategory } from "@/hooks/use-categories"
import { getErrorMessage } from "@/lib/errors"
import type { Category, CategoryCreate } from "@/types/category"

interface CategoryDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    category?: Category // undefined = create mode, defined = edit mode
}

export function CategoryDialog({
    open,
    onOpenChange,
    category,
}: CategoryDialogProps) {
    const createMutation = useCreateCategory()
    const updateMutation = useUpdateCategory()
    const mutation = category ? updateMutation : createMutation

    function handleSubmit(data: CategoryCreate) {
        if (category) {
            updateMutation.mutate(
                { id: category.id, data },
                { onSuccess: () => onOpenChange(false) },
            )
        } else {
            createMutation.mutate(data, {
                onSuccess: () => onOpenChange(false),
            })
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {category ? "Edit category" : "New category"}
                    </DialogTitle>
                    <DialogDescription>
                        {category
                            ? "Update the details of this category"
                            : "Add a category to organize your transactions"}
                    </DialogDescription>
                </DialogHeader>
                <CategoryForm
                    category={category}
                    onSubmit={handleSubmit}
                    onCancel={() => onOpenChange(false)}
                    isSubmitting={mutation.isPending}
                    error={mutation.isError ? getErrorMessage(mutation.error) : undefined}
                />
            </DialogContent>
        </Dialog>
    )
}