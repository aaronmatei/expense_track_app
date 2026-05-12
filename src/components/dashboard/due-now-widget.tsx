import { DollarSign, Zap } from "lucide-react"
import { useState } from "react"
import { Link } from "react-router-dom"

import { PayEmployeeDialog } from "@/components/employees/pay-employee-dialog"
import { PayFrequencyBadge } from "@/components/employees/pay-frequency-badge"
import { FrequencyBadge } from "@/components/recurring-transactions/frequency-badge"
import { MaterializeDialog } from "@/components/recurring-transactions/materialize-dialog"
import { Button } from "@/components/ui/button"
import { useDueEmployees } from "@/hooks/use-employees"
import { useDueRecurring } from "@/hooks/use-recurring-transactions"
import { formatShortDate } from "@/lib/format"
import { cn } from "@/lib/utils"
import type { Employee } from "@/types/employee"
import type { RecurringTransaction } from "@/types/recurring-transaction"

const PAYROLL_LIMIT = 3
const RECURRING_LIMIT = 3

export function DueNowWidget() {
    const dueEmpQuery = useDueEmployees()
    const dueRecurQuery = useDueRecurring()

    const payable = (dueEmpQuery.data ?? []).filter(
        (e) => e.pay_amount != null && e.pay_amount !== "",
    )
    const due = dueRecurQuery.data ?? []

    const totalCount = payable.length + due.length

    const [payTarget, setPayTarget] = useState<Employee | undefined>(undefined)
    const [payOpen, setPayOpen] = useState(false)
    const [genTarget, setGenTarget] = useState<RecurringTransaction | undefined>(undefined)
    const [genOpen, setGenOpen] = useState(false)

    const visiblePayable = payable.slice(0, PAYROLL_LIMIT)
    const visibleDue = due.slice(0, RECURRING_LIMIT)
    const hasMorePayable = payable.length > PAYROLL_LIMIT
    const hasMoreDue = due.length > RECURRING_LIMIT

    return (
        <>
            <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 px-4 py-3">
                    <div className="flex items-center gap-2">
                        <h2 className="text-sm font-semibold">Due Now</h2>
                        {totalCount > 0 && (
                            <span className="rounded-full bg-rose-100 dark:bg-rose-950/40 px-2 py-0.5 text-xs font-medium text-rose-700 dark:text-rose-400">
                                {totalCount}
                            </span>
                        )}
                    </div>
                    {totalCount > 0 && (
                        <div className="flex items-center gap-3">
                            {payable.length > 0 && (
                                <Link
                                    to="/employees"
                                    className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
                                >
                                    Employees
                                </Link>
                            )}
                            {due.length > 0 && (
                                <Link
                                    to="/recurring-transactions"
                                    className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
                                >
                                    Recurring
                                </Link>
                            )}
                        </div>
                    )}
                </div>

                {/* Empty state */}
                {totalCount === 0 && (
                    <p className="px-4 py-6 text-center text-sm text-slate-500 dark:text-slate-400">
                        All caught up 🎉
                    </p>
                )}

                {/* Payroll section */}
                {visiblePayable.length > 0 && (
                    <>
                        {due.length > 0 && (
                            <div className="border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 px-4 py-1.5">
                                <span className="text-[11px] font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
                                    Payroll
                                </span>
                            </div>
                        )}
                        {visiblePayable.map((emp) => (
                            <div
                                key={`emp-${emp.id}`}
                                className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 px-4 py-3 last:border-b-0"
                            >
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-xs font-medium text-white">
                                    {emp.first_name[0]}{emp.last_name[0]}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-medium">{emp.full_name}</p>
                                    <div className="mt-0.5">
                                        <PayFrequencyBadge
                                            frequency={emp.pay_frequency}
                                            config={emp.pay_day_config}
                                        />
                                    </div>
                                </div>
                                <span className="hidden shrink-0 text-sm font-medium tabular-nums sm:block">
                                    KES {Number(emp.pay_amount).toLocaleString()}
                                </span>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="shrink-0 border-rose-200 dark:border-rose-800/50 text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                                    onClick={() => {
                                        setPayTarget(emp)
                                        setPayOpen(true)
                                    }}
                                >
                                    <DollarSign className="mr-1 h-3.5 w-3.5" />
                                    Pay
                                </Button>
                            </div>
                        ))}
                        {hasMorePayable && (
                            <div className="border-b border-slate-100 dark:border-slate-800 px-4 py-2 text-center">
                                <Link
                                    to="/employees"
                                    className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
                                >
                                    +{payable.length - PAYROLL_LIMIT} more employees →
                                </Link>
                            </div>
                        )}
                    </>
                )}

                {/* Recurring section */}
                {visibleDue.length > 0 && (
                    <>
                        {payable.length > 0 && (
                            <div className="border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 px-4 py-1.5">
                                <span className="text-[11px] font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
                                    Recurring
                                </span>
                            </div>
                        )}
                        {visibleDue.map((t) => {
                            const isIncome = t.transaction_type === "income"
                            return (
                                <div
                                    key={`rt-${t.id}`}
                                    className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 px-4 py-3 last:border-b-0"
                                >
                                    <div
                                        className={cn(
                                            "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
                                            isIncome
                                                ? "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400"
                                                : "bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400",
                                        )}
                                    >
                                        <Zap className="h-4 w-4" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-medium">{t.description}</p>
                                        <div className="mt-0.5 flex flex-wrap items-center gap-2">
                                            <FrequencyBadge
                                                frequency={t.frequency}
                                                config={t.day_config}
                                            />
                                            {t.next_due_date && (
                                                <span className="text-xs text-slate-400">
                                                    Due {formatShortDate(t.next_due_date)}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <span
                                        className={cn(
                                            "hidden shrink-0 text-sm font-medium tabular-nums sm:block",
                                            isIncome
                                                ? "text-emerald-600 dark:text-emerald-400"
                                                : "text-rose-600 dark:text-rose-400",
                                        )}
                                    >
                                        {isIncome ? "+" : "-"}KES{" "}
                                        {Number(t.amount).toLocaleString(undefined, {
                                            minimumFractionDigits: 2,
                                        })}
                                    </span>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="shrink-0 border-rose-200 dark:border-rose-800/50 text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                                        onClick={() => {
                                            setGenTarget(t)
                                            setGenOpen(true)
                                        }}
                                    >
                                        <Zap className="mr-1 h-3.5 w-3.5" />
                                        Generate
                                    </Button>
                                </div>
                            )
                        })}
                        {hasMoreDue && (
                            <div className="border-t border-slate-100 dark:border-slate-800 px-4 py-2 text-center">
                                <Link
                                    to="/recurring-transactions"
                                    className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
                                >
                                    +{due.length - RECURRING_LIMIT} more recurring →
                                </Link>
                            </div>
                        )}
                    </>
                )}
            </div>

            <PayEmployeeDialog
                employee={payTarget}
                open={payOpen}
                onOpenChange={(o) => {
                    setPayOpen(o)
                    if (!o) setPayTarget(undefined)
                }}
            />

            <MaterializeDialog
                template={genTarget}
                open={genOpen}
                onOpenChange={(o) => {
                    setGenOpen(o)
                    if (!o) setGenTarget(undefined)
                }}
            />
        </>
    )
}
