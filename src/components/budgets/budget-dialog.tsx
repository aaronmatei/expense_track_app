import { BudgetForm } from "@/components/budgets/budget-form"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { useCreateBudget, useUpdateBudget } from "@/hooks/use-budgets"
import { getErrorMessage } from "@/lib/errors"
import type { Budget, BudgetCreate } from "@/types/budget"

interface BudgetDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    budget?: Budget
}

export function BudgetDialog({
    open,
    onOpenChange,
    budget,
}: BudgetDialogProps) {
    const createMutation = useCreateBudget()
    const updateMutation = useUpdateBudget()
    const mutation = budget ? updateMutation : createMutation

    function handleSubmit(data: BudgetCreate) {
        if (budget) {
            const { category_id: _id, ...rest } = data
            updateMutation.mutate(
                { id: budget.id, data: rest },
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
                        {budget ? "Edit budget" : "New budget"}
                    </DialogTitle>
                    <DialogDescription>
                        {budget
                            ? "Update the spending limit for this category"
                            : "Set a spending limit for a category"}
                    </DialogDescription>
                </DialogHeader>
                <BudgetForm
                    budget={budget}
                    onSubmit={handleSubmit}
                    onCancel={() => onOpenChange(false)}
                    isSubmitting={mutation.isPending}
                    error={
                        mutation.isError ? getErrorMessage(mutation.error) : undefined
                    }
                />
            </DialogContent>
        </Dialog>
    )
}
