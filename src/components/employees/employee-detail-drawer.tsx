import { Eye, EyeOff } from "lucide-react"
import { useState } from "react"

import { EmployeeDialog } from "@/components/employees/employee-dialog"
import { PayFrequencyBadge } from "@/components/employees/pay-frequency-badge"
import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { useAccounts } from "@/hooks/use-accounts"
import { useCategories } from "@/hooks/use-categories"
import { useTransactions } from "@/hooks/use-transactions"
import { formatDate } from "@/lib/format"
import { cn } from "@/lib/utils"
import type { Employee } from "@/types/employee"

function MaskedField({ value }: { value: string | null }) {
    const [visible, setVisible] = useState(false)
    if (!value) return <span className="text-slate-400">—</span>
    return (
        <span className="inline-flex items-center gap-1">
            {visible ? (
                value
            ) : (
                <span className="tracking-widest">{"•".repeat(Math.min(value.length, 10))}</span>
            )}
            <button
                type="button"
                onClick={() => setVisible((v) => !v)}
                className="ml-1 text-slate-400 hover:text-slate-600 dark:text-slate-300"
            >
                {visible ? (
                    <EyeOff className="h-3 w-3" />
                ) : (
                    <Eye className="h-3 w-3" />
                )}
            </button>
        </span>
    )
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                {label}
            </p>
            <p className="mt-0.5 text-sm text-slate-700 dark:text-slate-300">
                {value ?? <span className="text-slate-400">—</span>}
            </p>
        </div>
    )
}

interface EmployeeDetailDrawerProps {
    employee: Employee | undefined
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function EmployeeDetailDrawer({
    employee,
    open,
    onOpenChange,
}: EmployeeDetailDrawerProps) {
    const [editOpen, setEditOpen] = useState(false)

    const accounts = useAccounts()
    const categories = useCategories()

    const transactions = useTransactions(
        employee ? { employee_id: employee.id, limit: 50 } : {},
    )

    const defaultAccount = accounts.data?.find(
        (a) => a.id === employee?.default_account_id,
    )
    const defaultCategory = categories.data?.find(
        (c) => c.id === employee?.default_category_id,
    )

    if (!employee) return null

    return (
        <>
            <Sheet open={open} onOpenChange={onOpenChange}>
                <SheetContent side="right" className="w-[600px] max-w-full overflow-y-auto">
                    <SheetHeader className="mb-4">
                        <div className="flex items-start gap-3">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-sm font-bold text-white">
                                {employee.full_name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .slice(0, 2)
                                    .join("")
                                    .toUpperCase()}
                            </div>
                            <div>
                                <SheetTitle className="text-lg">
                                    {employee.full_name}
                                </SheetTitle>
                                {employee.position && (
                                    <p className="text-sm text-slate-500 dark:text-slate-400">
                                        {employee.position}
                                    </p>
                                )}
                                <span
                                    className={cn(
                                        "mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium",
                                        employee.is_active
                                            ? "bg-emerald-100 text-emerald-700 dark:text-emerald-400"
                                            : "bg-slate-100 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400",
                                    )}
                                >
                                    {employee.is_active ? "Active" : "Inactive"}
                                </span>
                            </div>
                        </div>
                    </SheetHeader>

                    {/* Summary info */}
                    <div className="mb-4 grid grid-cols-2 gap-3 rounded-lg border bg-slate-50 dark:bg-slate-800/50 p-4">
                        <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                Pay schedule
                            </p>
                            <div className="mt-1 flex flex-col gap-1">
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
                        </div>
                        <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                Default account
                            </p>
                            <p className="mt-1 text-sm">
                                {defaultAccount?.name ?? (
                                    <span className="text-slate-400">—</span>
                                )}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                Default category
                            </p>
                            <p className="mt-1 text-sm">
                                {defaultCategory?.name ?? (
                                    <span className="text-slate-400">—</span>
                                )}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                Start date
                            </p>
                            <p className="mt-1 text-sm">
                                {formatDate(employee.start_date)}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                Last paid
                            </p>
                            <p className="mt-1 text-sm">
                                {employee.last_paid_date
                                    ? formatDate(employee.last_paid_date)
                                    : <span className="text-slate-400">Never</span>}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                Next pay date
                            </p>
                            <p className="mt-1 text-sm">
                                {employee.next_pay_date ? (
                                    <span className={employee.is_due_for_pay ? "font-semibold text-rose-600 dark:text-rose-400" : ""}>
                                        {formatDate(employee.next_pay_date)}
                                        {employee.is_due_for_pay && " (Due)"}
                                    </span>
                                ) : (
                                    <span className="text-slate-400">—</span>
                                )}
                            </p>
                        </div>
                    </div>

                    <Tabs defaultValue="personal">
                        <TabsList className="w-full">
                            <TabsTrigger value="personal" className="flex-1">
                                Personal
                            </TabsTrigger>
                            <TabsTrigger value="banking" className="flex-1">
                                Banking
                            </TabsTrigger>
                            <TabsTrigger value="history" className="flex-1">
                                Payment history
                            </TabsTrigger>
                        </TabsList>

                        {/* Personal tab */}
                        <TabsContent value="personal" className="mt-4 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <InfoRow
                                    label="Date of birth"
                                    value={
                                        employee.date_of_birth
                                            ? formatDate(employee.date_of_birth)
                                            : null
                                    }
                                />
                                <InfoRow
                                    label="Gender"
                                    value={
                                        employee.gender
                                            ? employee.gender.charAt(0).toUpperCase() +
                                              employee.gender.slice(1)
                                            : null
                                    }
                                />
                                <InfoRow label="Email" value={employee.email} />
                                <InfoRow label="Phone" value={employee.phone} />
                                <InfoRow
                                    label="Employment type"
                                    value={
                                        employee.employment_type
                                            .charAt(0)
                                            .toUpperCase() +
                                        employee.employment_type.slice(1)
                                    }
                                />
                                <InfoRow
                                    label="Emergency contact"
                                    value={employee.emergency_contact_name}
                                />
                                <InfoRow
                                    label="Emergency phone"
                                    value={employee.emergency_contact_phone}
                                />
                            </div>
                            {employee.address && (
                                <div>
                                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                        Address
                                    </p>
                                    <p className="mt-0.5 text-sm text-slate-700 dark:text-slate-300">
                                        {employee.address}
                                    </p>
                                </div>
                            )}
                            {employee.notes && (
                                <div>
                                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                        Notes
                                    </p>
                                    <p className="mt-0.5 whitespace-pre-wrap text-sm text-slate-700 dark:text-slate-300">
                                        {employee.notes}
                                    </p>
                                </div>
                            )}
                        </TabsContent>

                        {/* Banking tab */}
                        <TabsContent value="banking" className="mt-4 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <InfoRow label="Bank name" value={employee.bank_name} />
                                <InfoRow label="Bank branch" value={employee.bank_branch} />
                                <div>
                                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                        Account number
                                    </p>
                                    <p className="mt-0.5 text-sm">
                                        <MaskedField
                                            value={employee.bank_account_number}
                                        />
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                        KRA PIN
                                    </p>
                                    <p className="mt-0.5 text-sm">
                                        <MaskedField value={employee.kra_pin} />
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                        National ID
                                    </p>
                                    <p className="mt-0.5 text-sm">
                                        <MaskedField value={employee.national_id} />
                                    </p>
                                </div>
                                <InfoRow
                                    label="NHIF number"
                                    value={employee.nhif_number}
                                />
                                <InfoRow
                                    label="NSSF number"
                                    value={employee.nssf_number}
                                />
                            </div>
                        </TabsContent>

                        {/* Payment history tab */}
                        <TabsContent value="history" className="mt-4">
                            {transactions.isLoading && (
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    Loading…
                                </p>
                            )}
                            {!transactions.isLoading &&
                                transactions.data?.length === 0 && (
                                    <div className="py-8 text-center">
                                        <p className="text-sm text-slate-500 dark:text-slate-400">
                                            No payments yet
                                        </p>
                                    </div>
                                )}
                            {transactions.data &&
                                transactions.data.length > 0 && (
                                    <div className="space-y-1">
                                        {transactions.data.map((tx) => (
                                            <div
                                                key={tx.id}
                                                className="flex items-center justify-between rounded-md px-2 py-2 text-sm hover:bg-slate-50"
                                            >
                                                <div>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                                        {tx.transaction_date}
                                                    </p>
                                                    <p className="text-slate-700 dark:text-slate-300">
                                                        {tx.description ?? "Payment"}
                                                    </p>
                                                </div>
                                                <span className="font-medium tabular-nums text-rose-600 dark:text-rose-400">
                                                    KES{" "}
                                                    {Number(tx.amount).toLocaleString()}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                        </TabsContent>
                    </Tabs>

                    {/* Footer */}
                    <div className="mt-6 flex justify-end gap-2 border-t pt-4">
                        <Button
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                        >
                            Close
                        </Button>
                        <Button onClick={() => setEditOpen(true)}>Edit</Button>
                    </div>
                </SheetContent>
            </Sheet>

            <EmployeeDialog
                open={editOpen}
                onOpenChange={setEditOpen}
                employee={employee}
            />
        </>
    )
}
