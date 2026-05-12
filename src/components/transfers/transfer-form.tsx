import { ArrowDown } from "lucide-react"
import { useEffect, useState, type FormEvent } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useAccounts } from "@/hooks/use-accounts"
import type { AccountType } from "@/types/account"
import type { Transfer, TransferCreate } from "@/types/transfer"

const STRICT_BALANCE_TYPES: AccountType[] = [
    "checking",
    "savings",
    "cash",
    "investment",
    "other",
]

function today(): string {
    return new Date().toISOString().split("T")[0]
}

function accountLabel(name: string, currency: string, balance: string): string {
    return `${name} · ${currency} ${Number(balance).toLocaleString()}`
}

interface TransferFormProps {
    initialValues?: Transfer
    onSubmit: (data: TransferCreate) => void
    isSubmitting?: boolean
    errorMessage?: string
    onCancel: () => void
}

export function TransferForm({
    initialValues,
    onSubmit,
    isSubmitting,
    errorMessage,
    onCancel,
}: TransferFormProps) {
    const { data: accounts = [] } = useAccounts()

    const [fromAccountId, setFromAccountId] = useState(
        initialValues ? String(initialValues.from_account_id) : "",
    )
    const [toAccountId, setToAccountId] = useState(
        initialValues ? String(initialValues.to_account_id) : "",
    )
    const [amount, setAmount] = useState(initialValues?.amount ?? "")
    const [transferDate, setTransferDate] = useState(
        initialValues?.transfer_date ?? today(),
    )
    const [description, setDescription] = useState(
        initialValues?.description ?? "",
    )

    useEffect(() => {
        setFromAccountId(initialValues ? String(initialValues.from_account_id) : "")
        setToAccountId(initialValues ? String(initialValues.to_account_id) : "")
        setAmount(initialValues?.amount ?? "")
        setTransferDate(initialValues?.transfer_date ?? today())
        setDescription(initialValues?.description ?? "")
    }, [initialValues])

    const fromAccount = accounts.find((a) => a.id === Number(fromAccountId))

    const toAccountOptions = fromAccount
        ? accounts.filter(
              (a) =>
                  a.currency === fromAccount.currency &&
                  a.id !== fromAccount.id,
          )
        : []

    // Clear to-account when from changes to avoid stale selection
    function handleFromChange(v: string) {
        setFromAccountId(v)
        setToAccountId("")
    }

    const amountNum = parseFloat(amount || "0")
    const projectedBalance = fromAccount
        ? parseFloat(fromAccount.current_balance) - amountNum
        : null

    const showOverdrawWarning =
        fromAccount != null &&
        STRICT_BALANCE_TYPES.includes(fromAccount.account_type) &&
        amountNum > 0 &&
        projectedBalance !== null &&
        projectedBalance < 0

    function handleSubmit(e: FormEvent) {
        e.preventDefault()
        if (!fromAccountId || !toAccountId || !amount || !transferDate) return
        if (fromAccountId === toAccountId) return
        if (amountNum <= 0) return

        onSubmit({
            from_account_id: Number(fromAccountId),
            to_account_id: Number(toAccountId),
            amount,
            transfer_date: transferDate,
            description: description.trim() || null,
        })
    }

    const canSubmit =
        !!fromAccountId &&
        !!toAccountId &&
        fromAccountId !== toAccountId &&
        amountNum > 0 &&
        !!transferDate

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* From / To accounts — stacked layout */}
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="from_account">
                        From account <span className="text-rose-500">*</span>
                    </Label>
                    <Select value={fromAccountId} onValueChange={handleFromChange}>
                        <SelectTrigger id="from_account" className="h-10 border-slate-300 dark:border-slate-700">
                            <SelectValue placeholder="Select source account" />
                        </SelectTrigger>
                        <SelectContent>
                            {accounts.map((a) => (
                                <SelectItem key={a.id} value={String(a.id)}>
                                    {accountLabel(a.name, a.currency, a.current_balance)}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex items-center gap-2 text-slate-400 dark:text-slate-600">
                    <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
                    <ArrowDown className="h-3 w-3 shrink-0" />
                    <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="to_account">
                        To account <span className="text-rose-500">*</span>
                    </Label>
                    <Select
                        value={toAccountId}
                        onValueChange={setToAccountId}
                        disabled={!fromAccountId}
                    >
                        <SelectTrigger id="to_account" className="h-10 border-slate-300 dark:border-slate-700">
                            <SelectValue
                                placeholder={
                                    fromAccountId
                                        ? "Select destination account"
                                        : "Pick source account first"
                                }
                            />
                        </SelectTrigger>
                        <SelectContent>
                            {toAccountOptions.map((a) => (
                                <SelectItem key={a.id} value={String(a.id)}>
                                    {accountLabel(a.name, a.currency, a.current_balance)}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {fromAccount && (
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Showing only {fromAccount.currency} accounts (matching the source).
                        </p>
                    )}
                </div>
            </div>

            {/* Amount */}
            <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <div className="relative">
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-500 dark:text-slate-400">
                        {fromAccount?.currency ?? "KES"}
                    </span>
                    <Input
                        id="amount"
                        type="number"
                        step="0.01"
                        min="0.01"
                        className="pl-12"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        required
                    />
                </div>
                {showOverdrawWarning && projectedBalance !== null && (
                    <p className="text-xs text-amber-600 dark:text-amber-400">
                        ⚠ This would push {fromAccount!.name} to{" "}
                        {fromAccount!.currency}{" "}
                        {projectedBalance.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        })}
                    </p>
                )}
            </div>

            {/* Transfer date */}
            <div className="space-y-2">
                <Label htmlFor="transfer_date">Transfer date</Label>
                <Input
                    id="transfer_date"
                    type="date"
                    value={transferDate}
                    onChange={(e) => setTransferDate(e.target.value)}
                    required
                />
            </div>

            {/* Description */}
            <div className="space-y-2">
                <Label htmlFor="description">Description (optional)</Label>
                <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="e.g. Monthly savings transfer"
                    rows={2}
                    className="max-h-20 resize-none"
                />
            </div>

            {errorMessage && (
                <p className="text-sm text-red-600">{errorMessage}</p>
            )}

            <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={onCancel}>
                    Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting || !canSubmit}>
                    {isSubmitting
                        ? "Saving…"
                        : initialValues
                          ? "Update transfer"
                          : "Create transfer"}
                </Button>
            </div>
        </form>
    )
}
