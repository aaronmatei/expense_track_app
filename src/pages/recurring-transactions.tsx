import { ChevronDown, Plus } from "lucide-react"
import { useMemo, useState } from "react"

import { DeleteRecurringTransactionDialog } from "@/components/recurring-transactions/delete-recurring-transaction-dialog"
import { DueRecurringSection } from "@/components/recurring-transactions/due-recurring-section"
import { RecurringTransactionDialog } from "@/components/recurring-transactions/recurring-transaction-dialog"
import { RecurringTransactionRow } from "@/components/recurring-transactions/recurring-transaction-row"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useRecurringTransactions } from "@/hooks/use-recurring-transactions"
import type { RecurringTransaction } from "@/types/recurring-transaction"

type StatusFilter = "all" | "active" | "paused"
type TypeFilter = "all" | "income" | "expense"

export function RecurringTransactionsPage() {
    const query = useRecurringTransactions()
    const templates = query.data ?? []

    const [dialogOpen, setDialogOpen] = useState(false)
    const [editing, setEditing] = useState<RecurringTransaction | undefined>(undefined)
    const [deleting, setDeleting] = useState<RecurringTransaction | null>(null)

    const [statusFilter, setStatusFilter] = useState<StatusFilter>("all")
    const [typeFilter, setTypeFilter] = useState<TypeFilter>("all")

    const activeTemplates = useMemo(
        () =>
            templates.filter((t) => {
                if (statusFilter === "active" && !t.is_active) return false
                if (statusFilter === "paused" && t.is_active) return false
                if (typeFilter !== "all" && t.transaction_type !== typeFilter) return false
                return true
            }),
        [templates, statusFilter, typeFilter],
    )

    const active = activeTemplates.filter((t) => t.is_active)
    const paused = activeTemplates.filter((t) => !t.is_active)

    function handleCreate() {
        setEditing(undefined)
        setDialogOpen(true)
    }

    function handleEdit(t: RecurringTransaction) {
        setEditing(t)
        setDialogOpen(true)
    }

    function handleDialogChange(open: boolean) {
        setDialogOpen(open)
        if (!open) setEditing(undefined)
    }

    return (
        <div className="space-y-6 pb-16">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Recurring Transactions
                    </h1>
                    <p className="mt-1 text-sm text-slate-600">
                        Templates that generate transactions when you click Generate
                    </p>
                </div>
                <Button onClick={handleCreate}>
                    <Plus className="mr-2 h-4 w-4" /> New recurring transaction
                </Button>
            </div>

            {/* Filters */}
            <div className="flex gap-3">
                <Select
                    value={statusFilter}
                    onValueChange={(v) => setStatusFilter(v as StatusFilter)}
                >
                    <SelectTrigger className="w-36">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All statuses</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="paused">Paused</SelectItem>
                    </SelectContent>
                </Select>
                <Select
                    value={typeFilter}
                    onValueChange={(v) => setTypeFilter(v as TypeFilter)}
                >
                    <SelectTrigger className="w-36">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All types</SelectItem>
                        <SelectItem value="income">Income</SelectItem>
                        <SelectItem value="expense">Expense</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Due now section */}
            <DueRecurringSection variant="page" />

            {/* Loading / error */}
            {query.isLoading && (
                <p className="text-sm text-slate-600">Loading…</p>
            )}
            {query.error && (
                <p className="text-sm text-red-600">Failed to load recurring transactions</p>
            )}

            {/* Active list */}
            {!query.isLoading && templates.length === 0 && (
                <Card>
                    <CardContent className="flex flex-col items-center gap-3 py-16">
                        <p className="text-sm text-slate-600">
                            No recurring transactions yet
                        </p>
                        <Button onClick={handleCreate} variant="outline">
                            <Plus className="mr-2 h-4 w-4" /> Create your first template
                        </Button>
                    </CardContent>
                </Card>
            )}

            {active.length > 0 && (
                <div className="rounded-lg border">
                    {active.map((t) => (
                        <RecurringTransactionRow
                            key={t.id}
                            template={t}
                            onEdit={handleEdit}
                        />
                    ))}
                </div>
            )}

            {!query.isLoading && templates.length > 0 && active.length === 0 && statusFilter !== "paused" && (
                <Card>
                    <CardContent className="py-10 text-center">
                        <p className="text-sm text-slate-500">
                            No active templates match your filters
                        </p>
                    </CardContent>
                </Card>
            )}

            {/* Paused section */}
            {paused.length > 0 && (
                <details className="group rounded-lg border">
                    <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3">
                        <span className="text-sm font-medium text-slate-600">
                            Paused ({paused.length})
                        </span>
                        <ChevronDown className="h-4 w-4 text-slate-400 transition-transform group-open:rotate-180" />
                    </summary>
                    <div className="border-t">
                        {paused.map((t) => (
                            <RecurringTransactionRow
                                key={t.id}
                                template={t}
                                onEdit={handleEdit}
                            />
                        ))}
                    </div>
                </details>
            )}

            <RecurringTransactionDialog
                open={dialogOpen}
                onOpenChange={handleDialogChange}
                template={editing}
            />

            <DeleteRecurringTransactionDialog
                template={deleting}
                onClose={() => setDeleting(null)}
            />
        </div>
    )
}
