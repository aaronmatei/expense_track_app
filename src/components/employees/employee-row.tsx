import { DollarSign, Pencil, Trash2 } from "lucide-react"
import { useState } from "react"

import { PayEmployeeDialog } from "@/components/employees/pay-employee-dialog"
import { PayFrequencyBadge } from "@/components/employees/pay-frequency-badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { Employee } from "@/types/employee"

function getInitials(name: string): string {
    return name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
}

interface EmployeeRowProps {
    employee: Employee
    onEdit: (employee: Employee) => void
    onDelete: (employee: Employee) => void
    onSelect: (employee: Employee) => void
}

export function EmployeeRow({
    employee,
    onEdit,
    onDelete,
    onSelect,
}: EmployeeRowProps) {
    const [payOpen, setPayOpen] = useState(false)

    return (
        <>
            <div
                className="flex cursor-pointer items-center gap-4 border-b px-4 py-3 hover:bg-slate-50"
                onClick={() => onSelect(employee)}
            >
                {/* Avatar */}
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-sm font-semibold text-white">
                    {getInitials(employee.full_name)}
                </div>

                {/* Name + position */}
                <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{employee.full_name}</p>
                    {employee.position && (
                        <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                            {employee.position}
                        </p>
                    )}
                </div>

                {/* Pay schedule + amount */}
                <div className="hidden shrink-0 flex-col items-end gap-1 sm:flex">
                    <PayFrequencyBadge
                        frequency={employee.pay_frequency}
                        config={employee.pay_day_config}
                    />
                    {employee.pay_amount != null ? (
                        <span className="text-sm font-medium tabular-nums">
                            KES {Number(employee.pay_amount).toLocaleString()}
                        </span>
                    ) : (
                        <span className="text-sm italic text-slate-500 dark:text-slate-400">N/A</span>
                    )}
                </div>

                {/* Status */}
                <div className="hidden shrink-0 flex-col items-end gap-1 md:flex">
                    <span
                        className={cn(
                            "rounded-full px-2 py-0.5 text-xs font-medium",
                            employee.is_active
                                ? "bg-emerald-100 text-emerald-700 dark:text-emerald-400"
                                : "bg-slate-100 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400",
                        )}
                    >
                        {employee.is_active ? "Active" : "Inactive"}
                    </span>
                    {employee.is_active && employee.is_due_for_pay && (
                        <span className="rounded-full bg-rose-100 px-2 py-0.5 text-xs font-medium text-rose-700 dark:text-rose-400">
                            Due now
                        </span>
                    )}
                </div>

                {/* Actions */}
                <div
                    className="flex shrink-0 gap-1"
                    onClick={(e) => e.stopPropagation()}
                >
                    {employee.is_active && employee.is_due_for_pay && (
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setPayOpen(true)}
                            className="border-rose-200 dark:border-rose-800/50 text-rose-700 dark:text-rose-400 hover:bg-rose-50"
                            aria-label="Mark paid"
                        >
                            <DollarSign className="h-4 w-4" />
                        </Button>
                    )}
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onEdit(employee)}
                        aria-label="Edit employee"
                    >
                        <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onDelete(employee)}
                        aria-label="Delete employee"
                        className="text-red-500 hover:text-red-600"
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <PayEmployeeDialog
                employee={employee}
                open={payOpen}
                onOpenChange={setPayOpen}
            />
        </>
    )
}
