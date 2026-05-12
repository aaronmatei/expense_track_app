import { ArrowRight } from "lucide-react"

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
import { useDeleteTransfer } from "@/hooks/use-transfers"
import { formatCurrency, formatShortDate } from "@/lib/format"
import type { Transfer } from "@/types/transfer"

interface DeleteTransferDialogProps {
    transfer: Transfer | null
    onClose: () => void
}

export function DeleteTransferDialog({
    transfer,
    onClose,
}: DeleteTransferDialogProps) {
    const deleteMutation = useDeleteTransfer()

    function handleDelete() {
        if (!transfer) return
        deleteMutation.mutate(transfer.id, { onSuccess: () => onClose() })
    }

    return (
        <AlertDialog open={!!transfer} onOpenChange={(open) => !open && onClose()}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete transfer?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Deleting this transfer will reverse both account balances. This
                        cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                {transfer && (
                    <div className="flex items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-sm">
                        <span className="font-medium text-slate-900">
                            {transfer.from_account_name}
                        </span>
                        <ArrowRight className="h-4 w-4 shrink-0 text-slate-400" />
                        <span className="font-medium text-slate-900">
                            {transfer.to_account_name}
                        </span>
                        <span className="ml-auto tabular-nums text-slate-700">
                            {formatCurrency(parseFloat(transfer.amount))}
                        </span>
                        <span className="text-slate-500">
                            · {formatShortDate(transfer.transfer_date)}
                        </span>
                    </div>
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
