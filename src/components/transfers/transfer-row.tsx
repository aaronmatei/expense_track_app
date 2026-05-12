import { ArrowRight, Pencil, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { formatCurrency, formatShortDate } from "@/lib/format"
import type { Transfer } from "@/types/transfer"

interface TransferRowProps {
    transfer: Transfer
    onEdit: () => void
    onDelete: () => void
}

export function TransferRow({ transfer, onEdit, onDelete }: TransferRowProps) {
    return (
        <div className="flex items-center gap-4 border-b px-4 py-3 last:border-b-0 hover:bg-slate-50">
            {/* Date */}
            <div className="w-24 shrink-0 text-sm text-slate-500 dark:text-slate-400">
                {formatShortDate(transfer.transfer_date)}
            </div>

            {/* From → To */}
            <div className="flex flex-1 items-center gap-2 text-sm">
                <span className="font-medium text-slate-900 dark:text-slate-100">
                    {transfer.from_account_name}
                </span>
                <ArrowRight className="h-4 w-4 shrink-0 text-slate-400" />
                <span className="font-medium text-slate-900 dark:text-slate-100">
                    {transfer.to_account_name}
                </span>
            </div>

            {/* Description */}
            <div className="hidden flex-1 truncate text-sm text-slate-500 dark:text-slate-400 md:block">
                {transfer.description || "—"}
            </div>

            {/* Amount */}
            <div className="w-32 shrink-0 text-right font-medium tabular-nums text-slate-900 dark:text-slate-100">
                {formatCurrency(parseFloat(transfer.amount))}
            </div>

            {/* Actions */}
            <div className="flex shrink-0 gap-1">
                <Button variant="ghost" size="icon" onClick={onEdit}>
                    <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={onDelete}>
                    <Trash2 className="h-4 w-4 text-rose-600 dark:text-rose-400" />
                </Button>
            </div>
        </div>
    )
}
