import { Link } from "react-router-dom"

import { CategoryIcon } from "@/components/category-icon"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useCategories } from "@/hooks/use-categories"
import { useTransactions } from "@/hooks/use-transactions"
import { formatShortDate } from "@/lib/format"
import { cn } from "@/lib/utils"

export function RecentTransactions() {
    const transactions = useTransactions({ limit: 8 })
    const categories = useCategories()
    const categoryMap = new Map(categories.data?.map((c) => [c.id, c]) ?? [])

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="text-base">Recent activity</CardTitle>
                <Link
                    to="/transactions"
                    className="text-xs text-indigo-600 hover:underline"
                >
                    View all
                </Link>
            </CardHeader>
            <CardContent className="p-0">
                {transactions.isLoading && (
                    <p className="px-6 py-4 text-sm text-slate-600">Loading…</p>
                )}
                {transactions.data && transactions.data.length === 0 && (
                    <p className="px-6 py-8 text-center text-sm text-slate-500">
                        No transactions yet
                    </p>
                )}
                {transactions.data && transactions.data.length > 0 && (
                    <div className="divide-y divide-slate-100">
                        {transactions.data.map((t) => {
                            const category = categoryMap.get(t.category_id)
                            const isIncome = category?.type === "income"
                            return (
                                <div
                                    key={t.id}
                                    className="flex items-center gap-3 px-6 py-3"
                                >
                                    <div
                                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-sm text-white"
                                        style={{
                                            backgroundColor: category?.color ?? "#94a3b8",
                                        }}
                                    >
                                        <CategoryIcon icon={category?.icon} className="text-sm" fallback={category?.name[0]?.toUpperCase() ?? "?"} />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-medium">
                                            {category?.name ?? "Unknown"}
                                        </p>
                                        {t.description && (
                                            <p className="truncate text-xs text-slate-500">
                                                {t.description}
                                            </p>
                                        )}
                                    </div>
                                    <div className="shrink-0 text-right">
                                        <p
                                            className={cn(
                                                "text-sm font-semibold tabular-nums",
                                                isIncome
                                                    ? "text-emerald-600"
                                                    : "text-rose-600",
                                            )}
                                        >
                                            {isIncome ? "+" : "-"}
                                            {new Intl.NumberFormat("en-US", {
                                                style: "currency",
                                                currency: "USD",
                                            }).format(Number(t.amount))}
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            {formatShortDate(t.transaction_date)}
                                        </p>
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
