import { Plus } from "lucide-react"
import { useState } from "react"

import { AccountCard } from "@/components/accounts/account-card"
import { AccountDialog } from "@/components/accounts/account-dialog"
import { ACCOUNT_TYPE_META } from "@/components/accounts/account-type-info"
import { DeleteAccountDialog } from "@/components/accounts/delete-account-dialog"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { useAccounts, useAccountsSummary } from "@/hooks/use-accounts"
import type { Account } from "@/types/account"

function formatUSD(amount: string | number): string {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(Number(amount))
}

export function AccountsPage() {
    const accounts = useAccounts()
    const summary = useAccountsSummary()
    const [dialogOpen, setDialogOpen] = useState(false)
    const [editing, setEditing] = useState<Account | undefined>(undefined)
    const [deleting, setDeleting] = useState<Account | null>(null)

    function handleCreate() {
        setEditing(undefined)
        setDialogOpen(true)
    }

    function handleEdit(account: Account) {
        setEditing(account)
        setDialogOpen(true)
    }

    function handleDialogChange(open: boolean) {
        setDialogOpen(open)
        if (!open) setEditing(undefined)
    }

    return (
        <div className="space-y-6">
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Accounts</h1>
                    <p className="mt-1 text-sm text-slate-600">
                        Manage your bank accounts, credit cards, and cash
                    </p>
                </div>
                <Button onClick={handleCreate}>
                    <Plus className="mr-2 h-4 w-4" /> New account
                </Button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600">
                            Total balance
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold tracking-tight tabular-nums">
                            {summary.data ? formatUSD(summary.data.total_balance) : "—"}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                            Across accounts marked "Include in total"
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600">
                            Number of accounts
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold tracking-tight">
                            {summary.data?.account_count ?? "—"}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                            {summary.data && summary.data.breakdown.length > 0
                                ? `${summary.data.breakdown.length} different types`
                                : "Across all your accounts"}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600">
                            By type
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {summary.data && summary.data.breakdown.length > 0 ? (
                            <div className="space-y-1">
                                {summary.data.breakdown.slice(0, 4).map((b) => (
                                    <div
                                        key={b.account_type}
                                        className="flex items-center justify-between text-xs"
                                    >
                                        <span className="text-slate-600">
                                            {ACCOUNT_TYPE_META[b.account_type].label}
                                        </span>
                                        <span className="font-medium tabular-nums">
                                            {b.count}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-slate-500">No accounts yet</p>
                        )}
                    </CardContent>
                </Card>
            </div>

            {accounts.isLoading && (
                <p className="text-sm text-slate-600">Loading…</p>
            )}
            {accounts.error && (
                <p className="text-sm text-red-600">Failed to load accounts</p>
            )}

            {accounts.data && accounts.data.length === 0 && (
                <Card>
                    <CardContent className="flex flex-col items-center gap-3 py-16">
                        <p className="text-sm text-slate-600">
                            You haven't added any accounts yet
                        </p>
                        <Button onClick={handleCreate} variant="outline">
                            <Plus className="mr-2 h-4 w-4" /> Add your first account
                        </Button>
                    </CardContent>
                </Card>
            )}

            {accounts.data && accounts.data.length > 0 && (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {accounts.data.map((account) => (
                        <AccountCard
                            key={account.id}
                            account={account}
                            onEdit={handleEdit}
                            onDelete={setDeleting}
                        />
                    ))}
                </div>
            )}

            <AccountDialog
                open={dialogOpen}
                onOpenChange={handleDialogChange}
                account={editing}
            />

            <DeleteAccountDialog
                account={deleting}
                onClose={() => setDeleting(null)}
            />
        </div>
    )
}