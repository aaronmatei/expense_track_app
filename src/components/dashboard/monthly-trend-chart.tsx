import {
    Bar,
    BarChart,
    CartesianGrid,
    Legend,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useMonthlySummary } from "@/hooks/use-transactions"
import { formatCompact, formatCurrency, getCurrentYearMonth } from "@/lib/format"
import type { MonthSummary } from "@/types/transaction"

const SHORT_MONTHS = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
]

interface ChartRow {
    label: string
    income: number
    expenses: number
}

function buildLast6(
    currentYear: number,
    currentMonth: number,
    currentData: MonthSummary[],
    prevData: MonthSummary[],
): ChartRow[] {
    const rows: ChartRow[] = []
    for (let i = 5; i >= 0; i--) {
        let m = currentMonth - i
        let y = currentYear
        if (m <= 0) { m += 12; y -= 1 }
        const source = y === currentYear ? currentData : prevData
        const entry = source.find((d) => d.year === y && d.month === m)
        const label =
            y === currentYear
                ? SHORT_MONTHS[m - 1]
                : `${SHORT_MONTHS[m - 1]} '${String(y).slice(2)}`
        rows.push({
            label,
            income: entry ? Number(entry.income) : 0,
            expenses: entry ? Number(entry.expenses) : 0,
        })
    }
    return rows
}

function ChartTooltip({ active, payload, label }: any) {
    if (!active || !payload?.length) return null
    return (
        <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-md">
            <p className="mb-2 text-xs font-semibold text-slate-700">{label}</p>
            {payload.map((entry: any) => (
                <div key={entry.dataKey} className="flex items-center gap-3 text-xs">
                    <span
                        className="h-2 w-2 shrink-0 rounded-full"
                        style={{ backgroundColor: entry.fill }}
                    />
                    <span className="capitalize text-slate-600">{entry.dataKey}</span>
                    <span className="ml-auto font-semibold tabular-nums">
                        {formatCurrency(entry.value)}
                    </span>
                </div>
            ))}
        </div>
    )
}

export function MonthlyTrendChart() {
    const { year: currentYear, month: currentMonth } = getCurrentYearMonth()
    const needsPrevYear = currentMonth < 6
    const currentData = useMonthlySummary(currentYear)
    const prevData = useMonthlySummary(currentYear - 1, needsPrevYear)

    const isLoading = currentData.isLoading || (needsPrevYear && prevData.isLoading)

    const rows = buildLast6(
        currentYear,
        currentMonth,
        currentData.data ?? [],
        prevData.data ?? [],
    )
    const isEmpty = rows.every((r) => r.income === 0 && r.expenses === 0)

    return (
        <Card>
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Income vs expenses</CardTitle>
                    <span className="text-xs text-slate-500">Last 6 months</span>
                </div>
            </CardHeader>
            <CardContent>
                {isLoading && (
                    <div className="h-[280px] animate-pulse rounded-lg bg-slate-100" />
                )}
                {!isLoading && isEmpty && (
                    <div className="flex h-[280px] items-center justify-center">
                        <p className="text-sm text-slate-500">No data yet</p>
                    </div>
                )}
                {!isLoading && !isEmpty && (
                    <ResponsiveContainer width="100%" height={280}>
                        <BarChart
                            data={rows}
                            barGap={4}
                            margin={{ top: 8, right: 8, bottom: 0, left: 0 }}
                        >
                            <CartesianGrid vertical={false} stroke="#e2e8f0" />
                            <XAxis
                                dataKey="label"
                                axisLine={false}
                                tickLine={false}
                                fontSize={12}
                                tick={{ fill: "#64748b" }}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                fontSize={12}
                                tick={{ fill: "#64748b" }}
                                tickFormatter={formatCompact}
                                width={60}
                            />
                            <Tooltip
                                content={<ChartTooltip />}
                                cursor={{ fill: "#f8fafc" }}
                            />
                            <Legend
                                verticalAlign="top"
                                align="right"
                                iconType="circle"
                                iconSize={8}
                                wrapperStyle={{ fontSize: 12, paddingBottom: 8 }}
                                formatter={(value) => (
                                    <span style={{ color: "#64748b", textTransform: "capitalize" }}>
                                        {value}
                                    </span>
                                )}
                            />
                            <Bar
                                dataKey="income"
                                fill="#10b981"
                                radius={[4, 4, 0, 0]}
                                maxBarSize={32}
                            />
                            <Bar
                                dataKey="expenses"
                                fill="#f43f5e"
                                radius={[4, 4, 0, 0]}
                                maxBarSize={32}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </CardContent>
        </Card>
    )
}
