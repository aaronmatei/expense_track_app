import { Plus, TrendingDown, TrendingUp } from "lucide-react"
import { useState } from "react"

import { BudgetCard } from "@/components/budgets/budget-card"
import { BudgetDialog } from "@/components/budgets/budget-dialog"
import { DeleteBudgetDialog } from "@/components/budgets/delete-budget-dialog"
import { MonthNavigator } from "@/components/budgets/month-navigator"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { useBudgetsSummary } from "@/hooks/use-budgets"
import { cn } from "@/lib/utils"
import type { Budget, BudgetWithSpending } from "@/types/budget"

const fmt = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" })

function currentYearMonth() {
    const now = new Date()
    return { year: now.getFullYear(), month: now.getMonth() + 1 }
}

export function BudgetsPage() {
    const { year: initYear, month: initMonth } = currentYearMonth()
    const [year, setYear] = useState(initYear)
    const [month, setMonth] = useState(initMonth)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [editing, setEditing] = useState<Budget | undefined>(undefined)
    const [deleting, setDeleting] = useState<BudgetWithSpending | null>(null)

    const summary = useBudgetsSummary(year, month)
    const items = summary.data ?? []

    const totalBudget = items.reduce((sum, b) => sum + Number(b.amount), 0)
    const totalSpent = items.reduce((sum, b) => sum + Number(b.spent), 0)
    const totalRemaining = totalBudget - totalSpent
    const overallPct = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0
    const overCount = items.filter((b) => b.is_over_budget).length

    function handleCreate() {
        setEditing(undefined)
        setDialogOpen(true)
    }

    function handleEdit(budget: BudgetWithSpending) {
        setEditing(budget)
        setDialogOpen(true)
    }

    function handleDialogChange(open: boolean) {
        setDialogOpen(open)
        if (!open) setEditing(undefined)
    }

    return (
        <div className="space-y-6">
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Budgets</h1>
                    <p className="mt-1 text-sm text-slate-600">
                        Manage your spending limits
                    </p>
                </div>
                <Button onClick={handleCreate}>
                    <Plus className="mr-2 h-4 w-4" /> New budget
                </Button>
            </div>

            <MonthNavigator
                year={year}
                month={month}
                onChange={(y, m) => { setYear(y); setMonth(m) }}
            />

            <div className="grid gap-4 sm:grid-cols-3">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600">
                            Total budget
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold tracking-tight tabular-nums">
                            {fmt.format(totalBudget)}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                            {items.length} {items.length === 1 ? "budget" : "budgets"} active
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600">
                            Total spent
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold tracking-tight tabular-nums">
                            {fmt.format(totalSpent)}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                            {fmt.format(totalRemaining)} remaining · {overallPct}% used
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600">
                            Budget health
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p
                            className={cn(
                                "text-3xl font-bold tracking-tight",
                                overCount === 0 ? "text-emerald-600" : "text-rose-600",
                            )}
                        >
                            {overCount === 0 ? "On track" : `${overCount} over`}
                        </p>
                        <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                            {overCount === 0 ? (
                                <>
                                    <TrendingUp className="h-3 w-3 text-emerald-600" />
                                    All budgets within limits
                                </>
                            ) : (
                                <>
                                    <TrendingDown className="h-3 w-3 text-rose-600" />
                                    {overCount}{" "}
                                    {overCount === 1 ? "budget" : "budgets"} exceeded
                                </>
                            )}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {summary.isLoading && (
                <p className="text-sm text-slate-600">Loading…</p>
            )}
            {summary.error && (
                <p className="text-sm text-red-600">Failed to load budgets</p>
            )}

            {summary.data && items.length === 0 && (
                <Card>
                    <CardContent className="flex flex-col items-center gap-3 py-16">
                        <p className="text-sm text-slate-600">
                            No budgets set for this month
                        </p>
                        <Button onClick={handleCreate} variant="outline">
                            <Plus className="mr-2 h-4 w-4" /> Add your first budget
                        </Button>
                    </CardContent>
                </Card>
            )}

            {items.length > 0 && (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {items.map((b) => (
                        <BudgetCard
                            key={b.id}
                            budget={b}
                            onEdit={handleEdit}
                            onDelete={setDeleting}
                        />
                    ))}
                </div>
            )}

            <BudgetDialog
                open={dialogOpen}
                onOpenChange={handleDialogChange}
                budget={editing}
            />

            <DeleteBudgetDialog
                budget={deleting}
                onClose={() => setDeleting(null)}
            />
        </div>
    )
}
