import { Pencil, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useCategories } from "@/hooks/use-categories"
import { cn } from "@/lib/utils"
import type { BudgetWithSpending } from "@/types/budget"

const fmt = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" })

const PERIOD_LABELS: Record<string, string> = {
    monthly: "Monthly",
    weekly: "Weekly",
    yearly: "Yearly",
}

interface BudgetCardProps {
    budget: BudgetWithSpending
    onEdit: (budget: BudgetWithSpending) => void
    onDelete: (budget: BudgetWithSpending) => void
}

export function BudgetCard({ budget, onEdit, onDelete }: BudgetCardProps) {
    const categories = useCategories()
    const categoryMap = new Map(categories.data?.map((c) => [c.id, c]) ?? [])
    const category = categoryMap.get(budget.category_id)

    const pct = budget.percentage_used
    const barValue = Math.min(pct, 100)
    const indicatorColor =
        pct > 100
            ? "bg-rose-500"
            : pct >= 80
              ? "bg-amber-500"
              : "bg-emerald-500"

    return (
        <Card className="group">
            <CardContent className="p-5">
                <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                        <div
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-lg text-white"
                            style={{ backgroundColor: category?.color ?? "#94a3b8" }}
                        >
                            {category?.icon || budget.category_name[0]?.toUpperCase()}
                        </div>
                        <div className="min-w-0">
                            <p className="truncate font-semibold">
                                {budget.category_name}
                            </p>
                            <p className="text-xs text-slate-500">
                                {PERIOD_LABELS[budget.period]}
                            </p>
                        </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-1">
                        <p className="text-sm font-medium tabular-nums text-slate-700">
                            <span>{fmt.format(Number(budget.spent))}</span>
                            <span className="text-slate-400"> / </span>
                            <span>{fmt.format(Number(budget.amount))}</span>
                        </p>
                        <div className="flex opacity-0 transition-opacity group-hover:opacity-100">
                            <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => onEdit(budget)}
                                aria-label="Edit"
                            >
                                <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => onDelete(budget)}
                                aria-label="Delete"
                            >
                                <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="mt-4">
                    <Progress
                        value={barValue}
                        className="h-2"
                        indicatorClassName={indicatorColor}
                    />
                </div>

                <div className="mt-2 flex items-center justify-between text-xs">
                    <span className="text-slate-500">{Math.round(pct)}% used</span>
                    <span
                        className={cn(
                            "font-medium tabular-nums",
                            budget.is_over_budget
                                ? "text-rose-600"
                                : "text-slate-600",
                        )}
                    >
                        {budget.is_over_budget
                            ? `${fmt.format(Math.abs(Number(budget.remaining)))} over budget`
                            : `${fmt.format(Number(budget.remaining))} remaining`}
                    </span>
                </div>
            </CardContent>
        </Card>
    )
}
