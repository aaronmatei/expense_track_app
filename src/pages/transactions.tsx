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
import { useAccounts } from "@/hooks/use-accounts"
import { formatCurrency } from "@/lib/format"
import { cn } from "@/lib/utils"
import { useCategories } from "@/hooks/use-categories"
import { useTransactions } from "@/hooks/use-transactions"
import type { Transaction } from "@/types/transaction"

const EMPTY_FILTERS: TransactionFiltersState = {
    startDate: "",
    endDate: "",
    categoryIds: [],
    accountId: "",
    type: "all",
    employeeId: null,
}

export function TransactionsPage() {
    const [filters, setFilters] = useState<TransactionFiltersState>(EMPTY_FILTERS)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [editing, setEditing] = useState<Transaction | undefined>(undefined)
    const [deleting, setDeleting] = useState<Transaction | null>(null)

    // Server-side filters (date, category, account — sent to the API)
    const apiFilters = {
        start_date: filters.startDate || undefined,
        end_date: filters.endDate || undefined,
        category_ids: filters.categoryIds.length ? filters.categoryIds : undefined,
        account_id: filters.accountId ? Number(filters.accountId) : undefined,
        employee_id: filters.employeeId ?? undefined,
    }

    const transactions = useTransactions(apiFilters)
    const categories = useCategories()
    const accounts = useAccounts()

    const categoryMap = useMemo(() => {
        if (!categories.data) return new Map()
        return new Map(categories.data.map((c) => [c.id, c]))
    }, [categories.data])

    const accountMap = useMemo(() => {
        if (!accounts.data) return new Map()
        return new Map(accounts.data.map((a) => [a.id, a]))
    }, [accounts.data])

    // Client-side type filter (applied after the fetch)
    const visibleTransactions = useMemo(() => {
        if (!transactions.data) return undefined
        if (filters.type === "all") return transactions.data
        return transactions.data.filter((t) => {
            const category = categoryMap.get(t.category_id)
            return category?.type === filters.type
        })
    }, [transactions.data, filters.type, categoryMap])

    const stats = useMemo(() => {
        if (!visibleTransactions) return { income: 0, expenses: 0, net: 0, count: 0 }
        let income = 0
        let expenses = 0
        for (const t of visibleTransactions) {
            const category = categoryMap.get(t.category_id)
            if (category?.type === "income") income += Number(t.amount)
            else expenses += Number(t.amount)
        }
        return { income, expenses, net: income - expenses, count: visibleTransactions.length }
    }, [visibleTransactions, categoryMap])

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
        !!filters.startDate ||
        !!filters.endDate ||
        filters.categoryIds.length > 0 ||
        !!filters.accountId ||
        filters.type !== "all" ||
        filters.employeeId !== null

    return (
        <div className="space-y-6">
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
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
                totalCount={visibleTransactions?.length}
            />

            {visibleTransactions && visibleTransactions.length > 0 && (
                <div className="flex flex-wrap items-center gap-x-8 gap-y-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 text-sm">
                    <div className="flex items-center gap-1.5">
                        <span className="text-slate-500 dark:text-slate-400">Income</span>
                        <span className="font-semibold tabular-nums text-emerald-600 dark:text-emerald-400">
                            +{formatCurrency(stats.income)}
                        </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="text-slate-500 dark:text-slate-400">Expenses</span>
                        <span className="font-semibold tabular-nums text-rose-600 dark:text-rose-400">
                            -{formatCurrency(stats.expenses)}
                        </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="text-slate-500 dark:text-slate-400">Net</span>
                        <span
                            className={cn(
                                "font-semibold tabular-nums",
                                stats.net > 0
                                    ? "text-emerald-600 dark:text-emerald-400"
                                    : stats.net < 0
                                        ? "text-rose-600 dark:text-rose-400"
                                        : "text-slate-700 dark:text-slate-300",
                            )}
                        >
                            {stats.net > 0 && "+"}{formatCurrency(stats.net)}
                        </span>
                    </div>
                    <div className="ml-auto text-slate-500 dark:text-slate-400">
                        {stats.count} {stats.count === 1 ? "transaction" : "transactions"}
                    </div>
                </div>
            )}

            {transactions.isLoading && (
                <p className="text-sm text-slate-600 dark:text-slate-300">Loading…</p>
            )}
            {transactions.error && (
                <p className="text-sm text-red-600">Failed to load transactions</p>
            )}

            {visibleTransactions && visibleTransactions.length === 0 && (
                <Card>
                    <CardContent className="flex flex-col items-center gap-3 py-16">
                        <p className="text-sm text-slate-600 dark:text-slate-300">
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

            {visibleTransactions && visibleTransactions.length > 0 && (
                <Card>
                    <CardContent className="p-0">
                        <TransactionList
                            transactions={visibleTransactions}
                            categoryMap={categoryMap}
                            accountMap={accountMap}
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