import {
    CircleDollarSign,
    TrendingDown,
    TrendingUp,
    Wallet,
} from "lucide-react"

import { BudgetOverview } from "@/components/dashboard/budget-overview"
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
            ? "text-slate-900"
            : net > 0
              ? "text-emerald-600"
              : net < 0
                ? "text-rose-600"
                : "text-slate-900"

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="mt-1 text-sm text-slate-600">
                    Welcome back, {me.data?.full_name || me.data?.email}
                </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Total balance"
                    value={balance}
                    icon={Wallet}
                    iconColor="text-indigo-600"
                    iconBg="bg-indigo-50"
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
                    iconColor="text-emerald-600"
                    iconBg="bg-emerald-50"
                    valueClassName="text-emerald-600"
                />
                <StatCard
                    title="Expenses this month"
                    value={expenses}
                    icon={TrendingDown}
                    iconColor="text-rose-600"
                    iconBg="bg-rose-50"
                    valueClassName="text-rose-600"
                />
                <StatCard
                    title="Net this month"
                    value={netFormatted}
                    icon={CircleDollarSign}
                    iconColor="text-indigo-600"
                    iconBg="bg-indigo-50"
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
                    <RecentTransactions />
                </div>
                <div className="lg:col-span-1">
                    <BudgetOverview />
                </div>
            </div>
        </div>
    )
}
