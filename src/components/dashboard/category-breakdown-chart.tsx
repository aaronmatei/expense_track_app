import { Plus } from "lucide-react"
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"
import { Link } from "react-router-dom"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useCategories } from "@/hooks/use-categories"
import { useCategorySummary } from "@/hooks/use-transactions"
import { formatCurrency, getCurrentMonthRange } from "@/lib/format"

const FALLBACK_PALETTE = [
    "#6366f1", "#10b981", "#f59e0b", "#f43f5e", "#a855f7", "#06b6d4",
]
const OTHER_COLOR = "#94a3b8"

interface Slice {
    name: string
    value: number
    color: string
}

function ChartTooltip({ active, payload }: any) {
    if (!active || !payload?.length) return null
    const { name, value, payload: p } = payload[0]
    return (
        <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-md">
            <div className="flex items-center gap-2 text-xs">
                <span
                    className="h-2 w-2 shrink-0 rounded-full"
                    style={{ backgroundColor: p.color }}
                />
                <span className="font-medium text-slate-700">{name}</span>
            </div>
            <p className="mt-1 text-sm font-bold tabular-nums text-slate-900">
                {formatCurrency(value)}
            </p>
        </div>
    )
}

const { start, end } = getCurrentMonthRange()

export function CategoryBreakdownChart() {
    const summary = useCategorySummary(start, end)
    const categories = useCategories()
    const categoryMap = new Map(categories.data?.map((c) => [c.id, c]) ?? [])

    const expenses = (summary.data ?? [])
        .filter((s) => s.type === "expense")
        .sort((a, b) => Number(b.total) - Number(a.total))

    const top5 = expenses.slice(0, 5)
    const rest = expenses.slice(5)

    const slices: Slice[] = [
        ...top5.map((s, i) => ({
            name: s.category_name,
            value: Number(s.total),
            color:
                categoryMap.get(s.category_id)?.color ??
                FALLBACK_PALETTE[i % FALLBACK_PALETTE.length],
        })),
        ...(rest.length > 0
            ? [{
                name: "Other",
                value: rest.reduce((sum, s) => sum + Number(s.total), 0),
                color: OTHER_COLOR,
              }]
            : []),
    ]

    const total = slices.reduce((sum, s) => sum + s.value, 0)
    const isEmpty = slices.length === 0

    return (
        <Card>
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Spending by category</CardTitle>
                    <span className="text-xs text-slate-500">This month</span>
                </div>
            </CardHeader>
            <CardContent>
                {summary.isLoading && (
                    <div className="h-[280px] animate-pulse rounded-lg bg-slate-100" />
                )}
                {!summary.isLoading && isEmpty && (
                    <div className="flex h-[280px] flex-col items-center justify-center gap-3">
                        <p className="text-sm text-slate-500">No expenses this month yet</p>
                        <Link
                            to="/transactions"
                            className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50"
                        >
                            <Plus className="h-3.5 w-3.5" />
                            Add transaction
                        </Link>
                    </div>
                )}
                {!summary.isLoading && !isEmpty && (
                    <>
                        <div className="relative">
                            <ResponsiveContainer width="100%" height={220}>
                                <PieChart>
                                    <Pie
                                        data={slices}
                                        dataKey="value"
                                        nameKey="name"
                                        innerRadius={70}
                                        outerRadius={110}
                                        paddingAngle={2}
                                        strokeWidth={0}
                                    >
                                        {slices.map((s, i) => (
                                            <Cell key={i} fill={s.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<ChartTooltip />} />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                                <p className="text-lg font-bold tabular-nums text-slate-900">
                                    {formatCurrency(total)}
                                </p>
                                <p className="text-xs text-slate-400">This month</p>
                            </div>
                        </div>
                        <div className="mt-2 space-y-2">
                            {slices.map((s) => (
                                <div key={s.name} className="flex items-center gap-2">
                                    <span
                                        className="h-2.5 w-2.5 shrink-0 rounded-full"
                                        style={{ backgroundColor: s.color }}
                                    />
                                    <span className="min-w-0 flex-1 truncate text-xs text-slate-600">
                                        {s.name}
                                    </span>
                                    <span className="shrink-0 text-xs font-medium tabular-nums text-slate-900">
                                        {formatCurrency(s.value)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    )
}
