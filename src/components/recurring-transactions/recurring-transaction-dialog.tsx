import { RecurringTransactionForm } from "@/components/recurring-transactions/recurring-transaction-form"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    useCreateRecurringTransaction,
    useUpdateRecurringTransaction,
} from "@/hooks/use-recurring-transactions"
import { getErrorMessage } from "@/lib/errors"
import type { RecurringTransaction, RecurringTransactionCreate } from "@/types/recurring-transaction"

interface RecurringTransactionDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    template?: RecurringTransaction
}

export function RecurringTransactionDialog({
    open,
    onOpenChange,
    template,
}: RecurringTransactionDialogProps) {
    const createMutation = useCreateRecurringTransaction()
    const updateMutation = useUpdateRecurringTransaction()
    const mutation = template ? updateMutation : createMutation

    function handleSubmit(payload: RecurringTransactionCreate) {
        if (template) {
            updateMutation.mutate(
                { id: template.id, data: payload },
                { onSuccess: () => onOpenChange(false) },
            )
        } else {
            createMutation.mutate(payload, {
                onSuccess: () => onOpenChange(false),
            })
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto overflow-x-hidden p-0">
                <DialogHeader className="border-b border-slate-200 bg-slate-50/60 px-6 py-4">
                    <DialogTitle>
                        {template ? "Edit recurring template" : "New recurring transaction"}
                    </DialogTitle>
                    <DialogDescription>
                        {template
                            ? "Update this recurring transaction template."
                            : "Set up a template that generates transactions automatically."}
                    </DialogDescription>
                </DialogHeader>
                <RecurringTransactionForm
                    template={template}
                    onSubmit={handleSubmit}
                    isSubmitting={mutation.isPending}
                    errorMessage={mutation.isError ? getErrorMessage(mutation.error) : undefined}
                />
            </DialogContent>
        </Dialog>
    )
}
