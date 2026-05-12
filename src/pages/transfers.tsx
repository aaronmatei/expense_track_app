import { Plus } from "lucide-react"
import { useState } from "react"

import { DeleteTransferDialog } from "@/components/transfers/delete-transfer-dialog"
import { TransferDialog } from "@/components/transfers/transfer-dialog"
import { TransferRow } from "@/components/transfers/transfer-row"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
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
import { useTransfers } from "@/hooks/use-transfers"
import { formatCurrency } from "@/lib/format"
import type { Transfer, TransferFilters } from "@/types/transfer"

const EMPTY_FILTERS: TransferFilters = {}

export function TransfersPage() {
    const [filters, setFilters] = useState<TransferFilters>(EMPTY_FILTERS)
    const [accountFilter, setAccountFilter] = useState("")

    const [dialogOpen, setDialogOpen] = useState(false)
    const [editing, setEditing] = useState<Transfer | undefined>(undefined)
    const [deleting, setDeleting] = useState<Transfer | null>(null)

    const apiFilters: TransferFilters = {
        start_date: filters.start_date || undefined,
        end_date: filters.end_date || undefined,
        account_id: accountFilter ? Number(accountFilter) : undefined,
    }

    const transfersQuery = useTransfers(apiFilters)
    const transfers = transfersQuery.data ?? []

    const { data: accounts = [] } = useAccounts()

    const hasActiveFilters =
        !!filters.start_date || !!filters.end_date || !!accountFilter

    function handleCreate() {
        setEditing(undefined)
        setDialogOpen(true)
    }

    function handleEdit(t: Transfer) {
        setEditing(t)
        setDialogOpen(true)
    }

    function handleDialogChange(open: boolean) {
        setDialogOpen(open)
        if (!open) setEditing(undefined)
    }

    function handleClearFilters() {
        setFilters(EMPTY_FILTERS)
        setAccountFilter("")
    }

    const totalTransferred = transfers.reduce(
        (sum, t) => sum + parseFloat(t.amount),
        0,
    )

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Transfers</h1>
                    <p className="mt-1 text-sm text-slate-600">
                        Move money between your accounts
                    </p>
                </div>
                <Button onClick={handleCreate}>
                    <Plus className="mr-2 h-4 w-4" />
                    New transfer
                </Button>
            </div>

            {/* Filter bar */}
            <div className="flex flex-wrap items-end gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3">
                <div className="space-y-1">
                    <Label className="text-xs text-slate-500">From date</Label>
                    <Input
                        type="date"
                        className="h-8 w-36 text-sm"
                        value={filters.start_date ?? ""}
                        onChange={(e) =>
                            setFilters((f) => ({ ...f, start_date: e.target.value || undefined }))
                        }
                    />
                </div>
                <div className="space-y-1">
                    <Label className="text-xs text-slate-500">To date</Label>
                    <Input
                        type="date"
                        className="h-8 w-36 text-sm"
                        value={filters.end_date ?? ""}
                        onChange={(e) =>
                            setFilters((f) => ({ ...f, end_date: e.target.value || undefined }))
                        }
                    />
                </div>
                <div className="space-y-1">
                    <Label className="text-xs text-slate-500">Account</Label>
                    <Select
                        value={accountFilter}
                        onValueChange={setAccountFilter}
                    >
                        <SelectTrigger className="h-8 w-48 text-sm">
                            <SelectValue placeholder="All accounts" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="">All accounts</SelectItem>
                            {accounts.map((a) => (
                                <SelectItem key={a.id} value={String(a.id)}>
                                    {a.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                {hasActiveFilters && (
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 text-slate-500"
                        onClick={handleClearFilters}
                    >
                        Clear
                    </Button>
                )}
            </div>

            {/* Summary strip */}
            {transfers.length > 0 && (
                <div className="flex items-center gap-6 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm">
                    <span className="text-slate-500">
                        {transfers.length}{" "}
                        {transfers.length === 1 ? "transfer" : "transfers"}
                    </span>
                    <span className="text-slate-500">
                        Total transferred:{" "}
                        <span className="font-semibold tabular-nums text-slate-700">
                            {formatCurrency(totalTransferred)}
                        </span>
                    </span>
                </div>
            )}

            {/* Loading / error */}
            {transfersQuery.isLoading && (
                <p className="text-sm text-slate-600">Loading…</p>
            )}
            {transfersQuery.isError && (
                <p className="text-sm text-red-600">Failed to load transfers</p>
            )}

            {/* Empty state */}
            {!transfersQuery.isLoading && transfers.length === 0 && (
                <Card>
                    <CardContent className="flex flex-col items-center gap-3 py-16">
                        <p className="text-sm text-slate-600">
                            {hasActiveFilters
                                ? "No transfers match these filters"
                                : "No transfers yet. Move money between your accounts to track them."}
                        </p>
                        {!hasActiveFilters && (
                            <Button variant="outline" onClick={handleCreate}>
                                <Plus className="mr-2 h-4 w-4" />
                                New transfer
                            </Button>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Transfer list */}
            {transfers.length > 0 && (
                <Card>
                    <CardContent className="p-0">
                        {transfers.map((t) => (
                            <TransferRow
                                key={t.id}
                                transfer={t}
                                onEdit={() => handleEdit(t)}
                                onDelete={() => setDeleting(t)}
                            />
                        ))}
                    </CardContent>
                </Card>
            )}

            <TransferDialog
                open={dialogOpen}
                onOpenChange={handleDialogChange}
                transfer={editing}
            />

            <DeleteTransferDialog
                transfer={deleting}
                onClose={() => setDeleting(null)}
            />
        </div>
    )
}
