import { X } from "lucide-react"
import { useState } from "react"

import { FrequencyBadge } from "@/components/recurring-transactions/frequency-badge"
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
import { useMaterializeBulk } from "@/hooks/use-recurring-transactions"
import { getErrorMessage } from "@/lib/errors"
import type { BulkMaterializeResponse, RecurringTransaction } from "@/types/recurring-transaction"

function todayISO(): string {
    return new Date().toISOString().split("T")[0]
}

interface RowState {
    rtId: number
    amount: string
}

function buildRows(templates: RecurringTransaction[]): RowState[] {
    return templates.map((t) => ({ rtId: t.id, amount: t.amount }))
}

interface BulkMaterializeDialogProps {
    templates: RecurringTransaction[]
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function BulkMaterializeDialog({
    templates,
    open,
    onOpenChange,
}: BulkMaterializeDialogProps) {
    const bulkMutation = useMaterializeBulk()
    const [date, setDate] = useState(todayISO())
    const [rows, setRows] = useState<RowState[]>(() => buildRows(templates))
    const [result, setResult] = useState<BulkMaterializeResponse | null>(null)

    if (rows.length !== templates.length && result === null) {
        setRows(buildRows(templates))
    }

    const templateMap = new Map(templates.map((t) => [t.id, t]))
    const total = rows.reduce((sum, r) => sum + Number(r.amount || 0), 0)

    function removeRow(rtId: number) {
        setRows((prev) => prev.filter((r) => r.rtId !== rtId))
    }

    function updateAmount(rtId: number, amount: string) {
        setRows((prev) =>
            prev.map((r) => (r.rtId === rtId ? { ...r, amount } : r)),
        )
    }

    function handleSubmit() {
        bulkMutation.mutate(
            rows.map((r) => ({
                recurring_transaction_id: r.rtId,
                amount: r.amount || undefined,
                transaction_date: date,
            })),
            { onSuccess: (data) => setResult(data) },
        )
    }

    function handleClose() {
        setResult(null)
        setDate(todayISO())
        setRows(buildRows(templates))
        bulkMutation.reset()
        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        Generate {rows.length} {rows.length === 1 ? "transaction" : "transactions"}
                    </DialogTitle>
                    <DialogDescription>
                        Review and confirm bulk generation
                    </DialogDescription>
                </DialogHeader>

                {/* Results view */}
                {result && (
                    <div className="space-y-3">
                        {result.successful.length > 0 && (
                            <div className="rounded-md bg-emerald-50 px-4 py-3">
                                <p className="text-sm font-medium text-emerald-800">
                                    Generated {result.successful.length}{" "}
                                    {result.successful.length === 1 ? "transaction" : "transactions"}
                                </p>
                                <p className="mt-0.5 text-xs text-emerald-700">
                                    {result.successful
                                        .map((tx) => {
                                            const t = templateMap.get(tx.recurring_transaction_id ?? -1)
                                            return t?.description ?? `#${tx.recurring_transaction_id}`
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
                                    {result.failed.map((f) => (
                                        <li key={f.recurring_transaction_id}>
                                            <span className="font-medium">
                                                {templateMap.get(f.recurring_transaction_id)?.description ??
                                                    `#${f.recurring_transaction_id}`}
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
                        {bulkMutation.isError && (
                            <p className="rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700">
                                {getErrorMessage(bulkMutation.error)}
                            </p>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="bulk_mat_date">Transaction date</Label>
                            <Input
                                id="bulk_mat_date"
                                type="date"
                                className="w-48"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                            />
                        </div>

                        <div className="max-h-64 overflow-y-auto rounded-md border">
                            <table className="w-full text-sm">
                                <thead className="border-b bg-slate-50 text-xs text-slate-500">
                                    <tr>
                                        <th className="px-3 py-2 text-left">Template</th>
                                        <th className="px-3 py-2 text-left">Amount (KES)</th>
                                        <th className="w-8" />
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {rows.map((row) => {
                                        const t = templateMap.get(row.rtId)
                                        if (!t) return null
                                        return (
                                            <tr
                                                key={row.rtId}
                                                className={!row.amount ? "bg-amber-50" : undefined}
                                            >
                                                <td className="px-3 py-2">
                                                    <p className="font-medium">{t.description}</p>
                                                    <div className="mt-0.5">
                                                        <FrequencyBadge
                                                            frequency={t.frequency}
                                                            config={t.day_config}
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
                                                            updateAmount(row.rtId, e.target.value)
                                                        }
                                                        className={`h-8 w-32 ${!row.amount ? "border-amber-300" : ""}`}
                                                    />
                                                </td>
                                                <td className="pr-2">
                                                    <Button
                                                        type="button"
                                                        size="icon"
                                                        variant="ghost"
                                                        className="h-7 w-7 text-slate-400 hover:text-red-500"
                                                        onClick={() => removeRow(row.rtId)}
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

                        <div className="flex items-center justify-between border-t pt-4">
                            <div>
                                <p className="text-xs text-slate-500">Total</p>
                                <p className="text-lg font-bold tabular-nums">
                                    KES{" "}
                                    {total.toLocaleString(undefined, {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    })}
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <Button type="button" variant="outline" onClick={handleClose}>
                                    Cancel
                                </Button>
                                <Button
                                    type="button"
                                    disabled={
                                        bulkMutation.isPending ||
                                        rows.length === 0 ||
                                        rows.some((r) => !r.amount)
                                    }
                                    onClick={handleSubmit}
                                >
                                    {bulkMutation.isPending
                                        ? "Generating…"
                                        : `Generate ${rows.length}`}
                                </Button>
                            </div>
                        </div>
                    </>
                )}
            </DialogContent>
        </Dialog>
    )
}
