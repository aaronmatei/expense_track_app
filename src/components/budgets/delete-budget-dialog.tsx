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
import { useDeleteBudget } from "@/hooks/use-budgets"
import type { BudgetWithSpending } from "@/types/budget"

interface DeleteBudgetDialogProps {
    budget: BudgetWithSpending | null
    onClose: () => void
}

export function DeleteBudgetDialog({
    budget,
    onClose,
}: DeleteBudgetDialogProps) {
    const deleteMutation = useDeleteBudget()

    function handleDelete() {
        if (!budget) return
        deleteMutation.mutate(budget.id, { onSuccess: () => onClose() })
    }

    return (
        <AlertDialog open={!!budget} onOpenChange={(open) => !open && onClose()}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete budget?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This permanently deletes the{" "}
                        <strong>{budget?.category_name}</strong> budget. Your
                        transaction history will not be affected.
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
