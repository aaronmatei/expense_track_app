import { X } from "lucide-react"
import { useState } from "react"

import { PayFrequencyBadge } from "@/components/employees/pay-frequency-badge"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useAccounts } from "@/hooks/use-accounts"
import { usePayEmployeesBulk } from "@/hooks/use-employees"
import { getErrorMessage } from "@/lib/errors"
import type { BulkPayError, BulkPayResponse, Employee } from "@/types/employee"

function todayISO(): string {
    return new Date().toISOString().split("T")[0]
}

interface RowState {
    employeeId: number
    amount: string
    accountId: string
}

function buildRowState(employees: Employee[]): RowState[] {
    return employees.map((e) => ({
        employeeId: e.id,
        amount: e.pay_amount ?? "",
        accountId:
            e.default_account_id != null ? String(e.default_account_id) : "",
    }))
}

interface BulkPayDialogProps {
    selectedEmployees: Employee[]
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function BulkPayDialog({
    selectedEmployees,
    open,
    onOpenChange,
}: BulkPayDialogProps) {
    const accounts = useAccounts()
    const payBulkMutation = usePayEmployeesBulk()

    const [date, setDate] = useState(todayISO())
    const [overrideDescription, setOverrideDescription] = useState("")
    const [rows, setRows] = useState<RowState[]>(() =>
        buildRowState(selectedEmployees),
    )
    const [result, setResult] = useState<BulkPayResponse | null>(null)

    // Reset rows when employees change (dialog re-opens)
    if (rows.length !== selectedEmployees.length && result === null) {
        setRows(buildRowState(selectedEmployees))
    }

    function removeRow(employeeId: number) {
        setRows((prev) => prev.filter((r) => r.employeeId !== employeeId))
    }

    function updateRow(employeeId: number, patch: Partial<Omit<RowState, "employeeId">>) {
        setRows((prev) =>
            prev.map((r) => (r.employeeId === employeeId ? { ...r, ...patch } : r)),
        )
    }

    const employeeMap = new Map(selectedEmployees.map((e) => [e.id, e]))
    const total = rows.reduce((sum, r) => sum + Number(r.amount || 0), 0)

    function handleSubmit() {
        payBulkMutation.mutate(
            {
                payments: rows.map((r) => ({
                    employee_id: r.employeeId,
                    amount: r.amount,
                    transaction_date: date,
                    account_id: r.accountId ? Number(r.accountId) : undefined,
                    description: overrideDescription.trim() || undefined,
                })),
            },
            {
                onSuccess: (data) => {
                    setResult(data)
                },
            },
        )
    }

    function handleClose() {
        setResult(null)
        setDate(todayISO())
        setOverrideDescription("")
        setRows(buildRowState(selectedEmployees))
        payBulkMutation.reset()
        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        Pay {rows.length} {rows.length === 1 ? "employee" : "employees"}
                    </DialogTitle>
                    <DialogDescription>
                        Review and confirm the bulk payment
                    </DialogDescription>
                </DialogHeader>

                {/* Results view */}
                {result && (
                    <div className="space-y-3">
                        {result.successful.length > 0 && (
                            <div className="rounded-md bg-emerald-50 px-4 py-3">
                                <p className="text-sm font-medium text-emerald-800">
                                    Successfully paid {result.successful.length}{" "}
                                    {result.successful.length === 1
                                        ? "employee"
                                        : "employees"}
                                </p>
                                <p className="mt-0.5 text-xs text-emerald-700">
                                    {result.successful
                                        .map((tx) => {
                                            const emp = employeeMap.get(tx.employee_id ?? -1)
                                            return emp?.full_name ?? `#${tx.employee_id}`
                                        })
                                        .join(", ")}
                                </p>
                            </div>
                        )}
                        {result.failed.length > 0 && (
                            <div className="rounded-md bg-rose-50 px-4 py-3">
                                <p className="text-sm font-medium text-rose-800">
                                    Failed: {result.failed.length}
                                </p>
                                <ul className="mt-1 space-y-0.5 text-xs text-rose-700">
                                    {result.failed.map((f: BulkPayError) => (
                                        <li key={f.employee_id}>
                                            <span className="font-medium">
                                                {employeeMap.get(f.employee_id)?.full_name ??
                                                    `#${f.employee_id}`}
                                            </span>
                                            : {f.error}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        <div className="flex justify-end pt-2">
                            <Button onClick={handleClose}>Close</Button>
                        </div>
                    </div>
                )}

                {!result && (
                    <>
                        {payBulkMutation.isError && (
                            <p className="rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700">
                                {getErrorMessage(payBulkMutation.error)}
                            </p>
                        )}

                        {/* Global date + description */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="bulk_date">Payment date</Label>
                                <Input
                                    id="bulk_date"
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="bulk_description">
                                    Description override (optional)
                                </Label>
                                <Input
                                    id="bulk_description"
                                    value={overrideDescription}
                                    onChange={(e) =>
                                        setOverrideDescription(e.target.value)
                                    }
                                    placeholder="Leave blank to use default per employee"
                                />
                            </div>
                        </div>

                        {/* Per-employee rows */}
                        <div className="max-h-64 overflow-y-auto rounded-md border">
                            <table className="w-full text-sm">
                                <thead className="border-b bg-slate-50 text-xs text-slate-500">
                                    <tr>
                                        <th className="px-3 py-2 text-left">
                                            Employee
                                        </th>
                                        <th className="px-3 py-2 text-left">
                                            Amount (KES)
                                        </th>
                                        <th className="px-3 py-2 text-left">
                                            Account
                                        </th>
                                        <th className="w-8" />
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {rows.map((row) => {
                                        const emp = employeeMap.get(row.employeeId)
                                        if (!emp) return null
                                        return (
                                            <tr key={row.employeeId} className={!row.amount ? "bg-amber-50" : undefined}>
                                                <td className="px-3 py-2">
                                                    <p className="font-medium">
                                                        {emp.full_name}
                                                    </p>
                                                    <div className="mt-0.5">
                                                        <PayFrequencyBadge
                                                            frequency={emp.pay_frequency}
                                                            config={emp.pay_day_config}
                                                        />
                                                    </div>
                                                </td>
                                                <td className="px-3 py-2">
                                                    <Input
                                                        type="number"
                                                        min="0.01"
                                                        step="0.01"
                                                        value={row.amount}
                                                        onChange={(e) =>
                                                            updateRow(
                                                                row.employeeId,
                                                                { amount: e.target.value },
                                                            )
                                                        }
                                                        className={`h-8 w-32 ${!row.amount ? "border-amber-300" : ""}`}
                                                    />
                                                </td>
                                                <td className="px-3 py-2">
                                                    <Select
                                                        value={row.accountId}
                                                        onValueChange={(v) =>
                                                            updateRow(
                                                                row.employeeId,
                                                                { accountId: v },
                                                            )
                                                        }
                                                    >
                                                        <SelectTrigger className="h-8 w-36">
                                                            <SelectValue placeholder="Account" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {accounts.data?.map((a) => (
                                                                <SelectItem
                                                                    key={a.id}
                                                                    value={String(a.id)}
                                                                >
                                                                    {a.name}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </td>
                                                <td className="pr-2">
                                                    <Button
                                                        type="button"
                                                        size="icon"
                                                        variant="ghost"
                                                        className="h-7 w-7 text-slate-400 hover:text-red-500"
                                                        onClick={() =>
                                                            removeRow(row.employeeId)
                                                        }
                                                    >
                                                        <X className="h-3.5 w-3.5" />
                                                    </Button>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between border-t pt-4">
                            <div>
                                <p className="text-xs text-slate-500">Total</p>
                                <p className="text-lg font-bold tabular-nums">
                                    KES {total.toLocaleString(undefined, {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    })}
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleClose}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="button"
                                    disabled={
                                        payBulkMutation.isPending ||
                                        rows.length === 0 ||
                                        rows.some((r) => !r.accountId || !r.amount)
                                    }
                                    onClick={handleSubmit}
                                >
                                    {payBulkMutation.isPending
                                        ? "Paying…"
                                        : `Pay ${rows.length} ${rows.length === 1 ? "employee" : "employees"}`}
                                </Button>
                            </div>
                        </div>
                    </>
                )}
            </DialogContent>
        </Dialog>
    )
}
