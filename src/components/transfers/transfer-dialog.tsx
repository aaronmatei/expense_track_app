import { TransferForm } from "@/components/transfers/transfer-form"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { useCreateTransfer, useUpdateTransfer } from "@/hooks/use-transfers"
import { getErrorMessage } from "@/lib/errors"
import type { Transfer, TransferCreate } from "@/types/transfer"

interface TransferDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    transfer?: Transfer
}

export function TransferDialog({
    open,
    onOpenChange,
    transfer,
}: TransferDialogProps) {
    const createMutation = useCreateTransfer()
    const updateMutation = useUpdateTransfer()
    const mutation = transfer ? updateMutation : createMutation

    function handleSubmit(data: TransferCreate) {
        if (transfer) {
            updateMutation.mutate(
                { id: transfer.id, data },
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
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>
                        {transfer ? "Edit transfer" : "New transfer"}
                    </DialogTitle>
                    <DialogDescription>
                        {transfer
                            ? "Update the details of this transfer."
                            : "Move money between your accounts."}
                    </DialogDescription>
                </DialogHeader>
                <TransferForm
                    initialValues={transfer}
                    onSubmit={handleSubmit}
                    onCancel={() => onOpenChange(false)}
                    isSubmitting={mutation.isPending}
                    errorMessage={
                        mutation.isError
                            ? getErrorMessage(mutation.error)
                            : undefined
                    }
                />
            </DialogContent>
        </Dialog>
    )
}
