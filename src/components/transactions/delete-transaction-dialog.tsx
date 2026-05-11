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
import { useDeleteTransaction } from "@/hooks/use-transactions"
import type { Transaction } from "@/types/transaction"

interface DeleteTransactionDialogProps {
    transaction: Transaction | null
    onClose: () => void
}

export function DeleteTransactionDialog({
    transaction,
    onClose,
}: DeleteTransactionDialogProps) {
    const deleteMutation = useDeleteTransaction()

    function handleDelete() {
        if (!transaction) return
        deleteMutation.mutate(transaction.id, { onSuccess: () => onClose() })
    }

    return (
        <AlertDialog
            open={!!transaction}
            onOpenChange={(open) => !open && onClose()}
        >
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete transaction?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This permanently deletes this transaction. This action cannot be
                        undone.
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