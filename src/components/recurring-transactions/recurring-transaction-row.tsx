import { Pencil, Trash2, TrendingDown, TrendingUp, Zap } from "lucide-react"
import { useState } from "react"

import { DeleteRecurringTransactionDialog } from "@/components/recurring-transactions/delete-recurring-transaction-dialog"
import { FrequencyBadge } from "@/components/recurring-transactions/frequency-badge"
import { MaterializeDialog } from "@/components/recurring-transactions/materialize-dialog"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { formatShortDate } from "@/lib/format"
import type { RecurringTransaction } from "@/types/recurring-transaction"

interface RecurringTransactionRowProps {
    template: RecurringTransaction
    onEdit: (t: RecurringTransaction) => void
}

export function RecurringTransactionRow({
    template,
    onEdit,
}: RecurringTransactionRowProps) {
    const [genOpen, setGenOpen] = useState(false)
    const [deleteOpen, setDeleteOpen] = useState(false)

    const isIncome = template.transaction_type === "income"
    const sign = isIncome ? "+" : "-"
    const amount = `${sign}KES ${Number(template.amount).toLocaleString(undefined, {
        minimumFractionDigits: 2,
    })}`

    return (
        <>
            <div className="flex items-center gap-4 border-b px-4 py-3 hover:bg-slate-50 last:border-b-0">
                {/* Type icon */}
                <div
                    className={cn(
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
                        isIncome
                            ? "bg-emerald-100 text-emerald-600"
                            : "bg-rose-100 text-rose-600",
                    )}
                >
                    {isIncome ? (
                        <TrendingUp className="h-4 w-4" />
                    ) : (
                        <TrendingDown className="h-4 w-4" />
                    )}
                </div>

                {/* Description + meta */}
                <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{template.description}</p>
                    <p className="truncate text-xs text-slate-500">
                        {template.category_name} · {template.account_name}
                    </p>
                </div>

                {/* Badge + next due */}
                <div className="hidden shrink-0 flex-col items-end gap-1 sm:flex">
                    <FrequencyBadge
                        frequency={template.frequency}
                        config={template.day_config}
                    />
                    {template.next_due_date && (
                        <span className="text-xs text-slate-400">
                            Next: {formatShortDate(template.next_due_date)}
                        </span>
                    )}
                </div>

                {/* Amount */}
                <span
                    className={cn(
                        "hidden shrink-0 text-sm font-semibold tabular-nums md:block",
                        isIncome ? "text-emerald-600" : "text-rose-600",
                    )}
                >
                    {amount}
                </span>

                {/* Status chips */}
                <div className="hidden shrink-0 flex-col items-end gap-1 md:flex">
                    {!template.is_active && (
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
                            Paused
                        </span>
                    )}
                    {template.is_active && template.is_due && (
                        <span className="rounded-full bg-rose-100 px-2 py-0.5 text-xs font-medium text-rose-700">
                            Due now
                        </span>
                    )}
                </div>

                {/* Actions */}
                <div className="flex shrink-0 gap-1">
                    {template.is_active && template.is_due && (
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setGenOpen(true)}
                            className="border-rose-200 text-rose-700 hover:bg-rose-50"
                            aria-label="Generate"
                        >
                            <Zap className="h-3.5 w-3.5 mr-1" />
                            Generate
                        </Button>
                    )}
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onEdit(template)}
                        aria-label="Edit"
                    >
                        <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setDeleteOpen(true)}
                        aria-label="Delete"
                        className="text-red-500 hover:text-red-600"
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <MaterializeDialog
                template={template}
                open={genOpen}
                onOpenChange={setGenOpen}
            />
            <DeleteRecurringTransactionDialog
                template={deleteOpen ? template : null}
                onClose={() => setDeleteOpen(false)}
            />
        </>
    )
}
