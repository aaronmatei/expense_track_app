import {
    CircleDollarSign,
    TrendingDown,
    TrendingUp,
    Wallet,
} from "lucide-react"

import { BudgetOverview } from "@/components/dashboard/budget-overview"
import { CategoryBreakdownChart } from "@/components/dashboard/category-breakdown-chart"
import { DueNowWidget } from "@/components/dashboard/due-now-widget"
import { MonthlyTrendChart } from "@/components/dashboard/monthly-trend-chart"
import { RecentTransactions } from "@/components/dashboard/recent-transactions"
import { StatCard } from "@/components/dashboard/stat-card"
import { useAccountsSummary } from "@/hooks/use-accounts"
import { useMe } from "@/hooks/use-me"
import { useTransactionsSummary } from "@/hooks/use-transactions"
import { formatCurrency, getCurrentMonthRange } from "@/lib/format"

const { start, end } = getCurrentMonthRange()

export function DashboardPage() {
    const me = useMe()
    const accountsSummary = useAccountsSummary()
    const txSummary = useTransactionsSummary(start, end)

    const balance = accountsSummary.data
        ? formatCurrency(accountsSummary.data.total_balance)
        : "—"
    const income = txSummary.data ? formatCurrency(txSummary.data.total_income) : "—"
    const expenses = txSummary.data
        ? formatCurrency(txSummary.data.total_expenses)
        : "—"

    const net = txSummary.data ? Number(txSummary.data.net) : null
    const netFormatted = txSummary.data
        ? (net! > 0 ? "+" : "") + formatCurrency(txSummary.data.net)
        : "—"
    const netValueClass =
        net === null
            ? "text-slate-900 dark:text-slate-100"
            : net > 0
              ? "text-emerald-600 dark:text-emerald-400"
              : net < 0
                ? "text-rose-600 dark:text-rose-400"
                : "text-slate-900 dark:text-slate-100"

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                    Welcome back, {me.data?.full_name || me.data?.email}
                </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Total balance"
                    value={balance}
                    icon={Wallet}
                    iconColor="text-indigo-600 dark:text-indigo-400"
                    iconBg="bg-indigo-50 dark:bg-indigo-950/30"
                    caption={
                        accountsSummary.data
                            ? `Across ${accountsSummary.data.account_count} ${accountsSummary.data.account_count === 1 ? "account" : "accounts"}`
                            : undefined
                    }
                />
                <StatCard
                    title="Income this month"
                    value={income}
                    icon={TrendingUp}
                    iconColor="text-emerald-600 dark:text-emerald-400"
                    iconBg="bg-emerald-50 dark:bg-emerald-950/30"
                    valueClassName="text-emerald-600 dark:text-emerald-400"
                />
                <StatCard
                    title="Expenses this month"
                    value={expenses}
                    icon={TrendingDown}
                    iconColor="text-rose-600 dark:text-rose-400"
                    iconBg="bg-rose-50 dark:bg-rose-950/30"
                    valueClassName="text-rose-600 dark:text-rose-400"
                />
                <StatCard
                    title="Net this month"
                    value={netFormatted}
                    icon={CircleDollarSign}
                    iconColor="text-indigo-600 dark:text-indigo-400"
                    iconBg="bg-indigo-50 dark:bg-indigo-950/30"
                    valueClassName={netValueClass}
                    caption={
                        txSummary.data
                            ? `${txSummary.data.transaction_count} ${txSummary.data.transaction_count === 1 ? "transaction" : "transactions"}`
                            : undefined
                    }
                />
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <MonthlyTrendChart />
                </div>
                <div className="lg:col-span-1">
                    <CategoryBreakdownChart />
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <RecentTransactions />
                </div>
                <div className="lg:col-span-1">
                    <BudgetOverview />
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <DueNowWidget />
                </div>
            </div>
        </div>
    )
}
