import { Plus } from "lucide-react"
import { useMemo, useState } from "react"

import { DeleteTransactionDialog } from "@/components/transactions/delete-transaction-dialog"
import { TransactionDialog } from "@/components/transactions/transaction-dialog"
import {
    TransactionFilters,
    type TransactionFiltersState,
} from "@/components/transactions/transaction-filters"
import { TransactionList } from "@/components/transactions/transaction-list"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useCategories } from "@/hooks/use-categories"
import { useTransactions } from "@/hooks/use-transactions"
import type { Transaction } from "@/types/transaction"

const EMPTY_FILTERS: TransactionFiltersState = {
    startDate: "",
    endDate: "",
    categoryId: "",
}

export function TransactionsPage() {
    const [filters, setFilters] = useState<TransactionFiltersState>(EMPTY_FILTERS)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [editing, setEditing] = useState<Transaction | undefined>(undefined)
    const [deleting, setDeleting] = useState<Transaction | null>(null)

    const apiFilters = {
        start_date: filters.startDate || undefined,
        end_date: filters.endDate || undefined,
        category_id: filters.categoryId ? Number(filters.categoryId) : undefined,
    }

    const transactions = useTransactions(apiFilters)
    const categories = useCategories()

    const categoryMap = useMemo(() => {
        if (!categories.data) return new Map()
        return new Map(categories.data.map((c) => [c.id, c]))
    }, [categories.data])

    function handleCreate() {
        setEditing(undefined)
        setDialogOpen(true)
    }

    function handleEdit(t: Transaction) {
        setEditing(t)
        setDialogOpen(true)
    }

    function handleDialogChange(open: boolean) {
        setDialogOpen(open)
        if (!open) setEditing(undefined)
    }

    const hasActiveFilters =
        !!filters.startDate || !!filters.endDate || !!filters.categoryId

    return (
        <div className="space-y-6">
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
                    <p className="mt-1 text-sm text-slate-600">
                        View and manage your income and expenses
                    </p>
                </div>
                <Button onClick={handleCreate}>
                    <Plus className="mr-2 h-4 w-4" /> New transaction
                </Button>
            </div>

            <TransactionFilters
                filters={filters}
                onChange={setFilters}
                onClear={() => setFilters(EMPTY_FILTERS)}
            />

            {transactions.isLoading && (
                <p className="text-sm text-slate-600">Loading…</p>
            )}
            {transactions.error && (
                <p className="text-sm text-red-600">Failed to load transactions</p>
            )}

            {transactions.data && transactions.data.length === 0 && (
                <Card>
                    <CardContent className="flex flex-col items-center gap-3 py-16">
                        <p className="text-sm text-slate-600">
                            {hasActiveFilters
                                ? "No transactions match these filters"
                                : "You haven't recorded any transactions yet"}
                        </p>
                        <Button onClick={handleCreate} variant="outline">
                            <Plus className="mr-2 h-4 w-4" /> Add transaction
                        </Button>
                    </CardContent>
                </Card>
            )}

            {transactions.data && transactions.data.length > 0 && (
                <Card>
                    <CardContent className="p-0">
                        <TransactionList
                            transactions={transactions.data}
                            categoryMap={categoryMap}
                            onEdit={handleEdit}
                            onDelete={setDeleting}
                        />
                    </CardContent>
                </Card>
            )}

            <TransactionDialog
                open={dialogOpen}
                onOpenChange={handleDialogChange}
                transaction={editing}
            />

            <DeleteTransactionDialog
                transaction={deleting}
                onClose={() => setDeleting(null)}
            />
        </div>
    )
}