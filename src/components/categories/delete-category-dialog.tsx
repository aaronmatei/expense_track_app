import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useDeleteCategory } from "@/hooks/use-categories"
import type { Category } from "@/types/category"

interface DeleteCategoryDialogProps {
    category: Category | null
    onClose: () => void
}

export function DeleteCategoryDialog({
    category,
    onClose,
}: DeleteCategoryDialogProps) {
    const deleteMutation = useDeleteCategory()

    function handleDelete() {
        if (!category) return
        deleteMutation.mutate(category.id, { onSuccess: () => onClose() })
    }

    return (
        <AlertDialog open={!!category} onOpenChange={(open) => !open && onClose()}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete category?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This permanently deletes <strong>{category?.name}</strong>. Any
                        existing transactions in this category will keep their reference but
                        you won't see this category in lists anymore.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDelete}
                        disabled={deleteMutation.isPending}
                        className="bg-red-600 hover:bg-red-700"
                    >
                        {deleteMutation.isPending ? "Deleting…" : "Delete"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}