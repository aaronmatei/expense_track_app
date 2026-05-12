import { Link } from "react-router-dom"

import { CategoryIcon } from "@/components/category-icon"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useBudgetsSummary } from "@/hooks/use-budgets"
import { useCategories } from "@/hooks/use-categories"
import { formatCurrency, getCurrentYearMonth } from "@/lib/format"

function indicatorColor(pct: number): string {
    if (pct > 100) return "bg-rose-500"
    if (pct >= 80) return "bg-amber-500"
    return "bg-emerald-500"
}

export function BudgetOverview() {
    const { year, month } = getCurrentYearMonth()
    const summary = useBudgetsSummary(year, month)
    const categories = useCategories()
    const categoryMap = new Map(categories.data?.map((c) => [c.id, c]) ?? [])

    const sorted = [...(summary.data ?? [])]
        .sort((a, b) => {
            if (a.is_over_budget !== b.is_over_budget) {
                return a.is_over_budget ? -1 : 1
            }
            return b.percentage_used - a.percentage_used
        })
        .slice(0, 4)

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="text-base">Budgets this month</CardTitle>
                <Link
                    to="/budgets"
                    className="text-xs text-indigo-600 hover:underline"
                >
                    Manage
                </Link>
            </CardHeader>
            <CardContent>
                {summary.isLoading && (
                    <p className="text-sm text-slate-600">Loading…</p>
                )}
                {summary.data && summary.data.length === 0 && (
                    <div className="py-6 text-center">
                        <p className="text-sm text-slate-500">No budgets set yet</p>
                        <Link
                            to="/budgets"
                            className="mt-2 inline-block text-xs text-indigo-600 hover:underline"
                        >
                            Set up a budget
                        </Link>
                    </div>
                )}
                {sorted.length > 0 && (
                    <div className="space-y-4">
                        {sorted.map((b) => {
                            const category = categoryMap.get(b.category_id)
                            const pct = b.percentage_used
                            return (
                                <div key={b.id}>
                                    <div className="flex items-center gap-2">
                                        <div
                                            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-sm text-white"
                                            style={{
                                                backgroundColor: category?.color ?? "#94a3b8",
                                            }}
                                        >
                                            <CategoryIcon icon={category?.icon} className="text-sm" fallback={b.category_name[0]?.toUpperCase()} />
                                        </div>
                                        <span className="min-w-0 flex-1 truncate text-sm font-medium">
                                            {b.category_name}
                                        </span>
                                        <span className="shrink-0 text-xs tabular-nums text-slate-600">
                                            {formatCurrency(b.spent)} /{" "}
                                            {formatCurrency(b.amount)}
                                        </span>
                                    </div>
                                    <div className="mt-1.5">
                                        <Progress
                                            value={Math.min(pct, 100)}
                                            className="h-1.5"
                                            indicatorClassName={indicatorColor(pct)}
                                        />
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
