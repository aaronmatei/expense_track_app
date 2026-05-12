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
import { useDeleteRecurringTransaction } from "@/hooks/use-recurring-transactions"
import { getErrorMessage } from "@/lib/errors"
import type { RecurringTransaction } from "@/types/recurring-transaction"

interface DeleteRecurringTransactionDialogProps {
    template: RecurringTransaction | null
    onClose: () => void
}

export function DeleteRecurringTransactionDialog({
    template,
    onClose,
}: DeleteRecurringTransactionDialogProps) {
    const deleteMutation = useDeleteRecurringTransaction()

    function handleDelete() {
        if (!template) return
        deleteMutation.mutate(template.id, { onSuccess: () => onClose() })
    }

    return (
        <AlertDialog open={!!template} onOpenChange={(open) => !open && onClose()}>
            <AlertDialogContent className="max-w-md">
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete "{template?.description}"?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Past transactions made from this template will remain; future
                        occurrences stop. This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                {deleteMutation.isError && (
                    <p className="text-sm text-rose-600">
                        {getErrorMessage(deleteMutation.error)}
                    </p>
                )}
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
