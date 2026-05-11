import { TransactionForm } from "@/components/transactions/transaction-form"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    useCreateTransaction,
    useUpdateTransaction,
} from "@/hooks/use-transactions"
import { getErrorMessage } from "@/lib/errors"
import type { Transaction, TransactionCreate } from "@/types/transaction"

interface TransactionDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    transaction?: Transaction
}

export function TransactionDialog({
    open,
    onOpenChange,
    transaction,
}: TransactionDialogProps) {
    const createMutation = useCreateTransaction()
    const updateMutation = useUpdateTransaction()
    const mutation = transaction ? updateMutation : createMutation

    function handleSubmit(data: TransactionCreate) {
        if (transaction) {
            updateMutation.mutate(
                { id: transaction.id, data },
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
                        {transaction ? "Edit transaction" : "New transaction"}
                    </DialogTitle>
                    <DialogDescription>
                        {transaction
                            ? "Update the details of this transaction"
                            : "Record an income or expense"}
                    </DialogDescription>
                </DialogHeader>
                <TransactionForm
                    transaction={transaction}
                    onSubmit={handleSubmit}
                    onCancel={() => onOpenChange(false)}
                    isSubmitting={mutation.isPending}
                    error={mutation.isError ? getErrorMessage(mutation.error) : undefined}
                />
            </DialogContent>
        </Dialog>
    )
}