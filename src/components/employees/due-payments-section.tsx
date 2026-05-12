import { DollarSign } from "lucide-react"
import { useState } from "react"
import { Link } from "react-router-dom"

import { BulkPayDialog } from "@/components/employees/bulk-pay-dialog"
import { PayEmployeeDialog } from "@/components/employees/pay-employee-dialog"
import { PayFrequencyBadge } from "@/components/employees/pay-frequency-badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { useDueEmployees } from "@/hooks/use-employees"
import { cn } from "@/lib/utils"
import type { Employee } from "@/types/employee"

interface DuePaymentsSectionProps {
    variant: "page" | "widget"
    limit?: number
}

export function DuePaymentsSection({
    variant,
    limit = 5,
}: DuePaymentsSectionProps) {
    const dueQuery = useDueEmployees()
    const due = dueQuery.data ?? []

    const [payTarget, setPayTarget] = useState<Employee | undefined>(undefined)
    const [payOpen, setPayOpen] = useState(false)
    const [selected, setSelected] = useState<Set<number>>(new Set())
    const [bulkOpen, setBulkOpen] = useState(false)

    const visible = variant === "widget" ? due.slice(0, limit) : due

    // Don't render the page section at all when no one is due
    if (variant === "page" && due.length === 0) return null

    function openPay(emp: Employee) {
        setPayTarget(emp)
        setPayOpen(true)
    }

    function toggleSelect(id: number) {
        setSelected((prev) => {
            const next = new Set(prev)
            if (next.has(id)) next.delete(id)
            else next.add(id)
            return next
        })
    }

    function selectAll() {
        if (selected.size === due.length) {
            setSelected(new Set())
        } else {
            setSelected(new Set(due.map((e) => e.id)))
        }
    }

    const selectedEmployees = due.filter((e) => selected.has(e.id))

    return (
        <>
            <div
                className={cn(
                    "rounded-lg border",
                    variant === "page" && "mb-2",
                )}
            >
                {/* Header */}
                <div className="flex items-center justify-between border-b px-4 py-3">
                    <div className="flex items-center gap-2">
                        <h2 className="text-sm font-semibold">Due Payments</h2>
                        {due.length > 0 && (
                            <span className="rounded-full bg-rose-100 px-2 py-0.5 text-xs font-medium text-rose-700">
                                {due.length}
                            </span>
                        )}
                    </div>
                    {variant === "widget" && due.length > limit && (
                        <Link
                            to="/employees"
                            className="text-xs text-indigo-600 hover:underline"
                        >
                            View all ({due.length})
                        </Link>
                    )}
                    {variant === "page" && due.length > 1 && (
                        <div className="flex items-center gap-2">
                            <Checkbox
                                id="select-all"
                                checked={selected.size === due.length}
                                onCheckedChange={selectAll}
                            />
                            <label
                                htmlFor="select-all"
                                className="cursor-pointer text-xs text-slate-500"
                            >
                                Select all
                            </label>
                        </div>
                    )}
                </div>

                {/* Empty state (widget only — page variant hides whole section) */}
                {due.length === 0 && variant === "widget" && (
                    <p className="px-4 py-6 text-center text-sm text-slate-500">
                        Everyone is up to date 🎉
                    </p>
                )}

                {/* Rows */}
                {visible.map((emp) => (
                    <div
                        key={emp.id}
                        className="flex items-center gap-3 border-b px-4 py-3 last:border-b-0"
                    >
                        {variant === "page" && (
                            <Checkbox
                                checked={selected.has(emp.id)}
                                onCheckedChange={() => toggleSelect(emp.id)}
                                onClick={(e) => e.stopPropagation()}
                            />
                        )}

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-sm font-medium text-white">
                            {emp.first_name[0]}{emp.last_name[0]}
                        </div>

                        {/* Name + badge */}
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium">
                                {emp.full_name}
                            </p>
                            <div className="mt-0.5 flex flex-wrap items-center gap-2">
                                <PayFrequencyBadge
                                    frequency={emp.pay_frequency}
                                    config={emp.pay_day_config}
                                />
                                {emp.most_recent_pay_date && (
                                    <span className="text-xs text-slate-400">
                                        Due since{" "}
                                        {new Date(
                                            emp.most_recent_pay_date,
                                        ).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                        })}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Amount */}
                        <span className="hidden shrink-0 text-sm tabular-nums sm:block">
                            {emp.pay_amount != null ? (
                                <span className="font-medium">
                                    KES {Number(emp.pay_amount).toLocaleString()}
                                </span>
                            ) : (
                                <span className="italic text-slate-500">Variable</span>
                            )}
                        </span>

                        {/* Pay button */}
                        <Button
                            size="sm"
                            variant="outline"
                            className="shrink-0 border-rose-200 text-rose-700 hover:bg-rose-50"
                            onClick={() => openPay(emp)}
                        >
                            <DollarSign className="mr-1 h-3.5 w-3.5" />
                            Pay
                        </Button>
                    </div>
                ))}

                {/* Widget: "View all" footer when truncated */}
                {variant === "widget" && due.length > limit && (
                    <div className="border-t px-4 py-2 text-center">
                        <Link
                            to="/employees"
                            className="text-xs text-indigo-600 hover:underline"
                        >
                            View all {due.length} due employees →
                        </Link>
                    </div>
                )}
            </div>

            {/* Floating "Pay selected" button — page variant only */}
            {variant === "page" && selected.size > 0 && (
                <div className="sticky bottom-4 z-10 flex justify-center">
                    <Button
                        onClick={() => setBulkOpen(true)}
                        className="shadow-lg"
                    >
                        <DollarSign className="mr-2 h-4 w-4" />
                        Pay selected ({selected.size})
                    </Button>
                </div>
            )}

            <PayEmployeeDialog
                employee={payTarget}
                open={payOpen}
                onOpenChange={(o) => {
                    setPayOpen(o)
                    if (!o) setPayTarget(undefined)
                }}
            />

            <BulkPayDialog
                selectedEmployees={selectedEmployees}
                open={bulkOpen}
                onOpenChange={(o) => {
                    setBulkOpen(o)
                    if (!o) setSelected(new Set())
                }}
            />
        </>
    )
}
