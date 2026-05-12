import { useEffect, useState, type FormEvent } from "react"

import { CategoryIcon } from "@/components/category-icon"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useAccounts } from "@/hooks/use-accounts"
import { useCategories } from "@/hooks/use-categories"
import { formatCurrency } from "@/lib/format"
import type { Transaction, TransactionCreate } from "@/types/transaction"

function todayISO(): string {
    return new Date().toISOString().split("T")[0]
}

interface TransactionFormProps {
    transaction?: Transaction
    onSubmit: (data: TransactionCreate) => void
    onCancel: () => void
    isSubmitting?: boolean
    error?: string
}

export function TransactionForm({
    transaction,
    onSubmit,
    onCancel,
    isSubmitting,
    error,
}: TransactionFormProps) {
    const categories = useCategories()
    const accounts = useAccounts()
    const [amount, setAmount] = useState(transaction?.amount ?? "")
    const [description, setDescription] = useState(transaction?.description ?? "")
    const [transactionDate, setTransactionDate] = useState(
        transaction?.transaction_date ?? todayISO(),
    )
    const [categoryId, setCategoryId] = useState<string>(
        transaction?.category_id ? String(transaction.category_id) : "",
    )
    const [accountId, setAccountId] = useState<string>(
        transaction?.account_id ? String(transaction.account_id) : "",
    )

    // Reset all fields when switching between create / edit
    useEffect(() => {
        setAmount(transaction?.amount ?? "")
        setDescription(transaction?.description ?? "")
        setTransactionDate(transaction?.transaction_date ?? todayISO())
        setCategoryId(transaction?.category_id ? String(transaction.category_id) : "")
        setAccountId(transaction?.account_id ? String(transaction.account_id) : "")
    }, [transaction])

    // Auto-select default account for new transactions once accounts load
    useEffect(() => {
        if (transaction) return
        if (!accounts.data?.length) return
        setAccountId((prev) => {
            if (prev) return prev
            const checking = accounts.data!.find((a) => a.account_type === "checking")
            const first = accounts.data![0]
            return String((checking ?? first).id)
        })
    }, [accounts.data, transaction])

    function handleSubmit(e: FormEvent) {
        e.preventDefault()
        if (!categoryId || !accountId) return
        onSubmit({
            amount: amount || "0",
            description: description.trim() || null,
            transaction_date: transactionDate,
            category_id: Number(categoryId),
            account_id: Number(accountId),
        })
    }

    const income = categories.data?.filter((c) => c.type === "income") ?? []
    const expenses = categories.data?.filter((c) => c.type === "expense") ?? []
    const noCategories = categories.data && categories.data.length === 0
    const noAccounts = accounts.data && accounts.data.length === 0

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="amount">Amount</Label>
                    <Input
                        id="amount"
                        type="number"
                        step="0.01"
                        min="0.01"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="transaction_date">Date</Label>
                    <Input
                        id="transaction_date"
                        type="date"
                        value={transactionDate}
                        onChange={(e) => setTransactionDate(e.target.value)}
                        required
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="category_id">Category</Label>
                <Select value={categoryId} onValueChange={setCategoryId}>
                    <SelectTrigger id="category_id">
                        <SelectValue placeholder="Choose a category" />
                    </SelectTrigger>
                    <SelectContent>
                        {income.length > 0 && (
                            <SelectGroup>
                                <SelectLabel className="text-emerald-700">Income</SelectLabel>
                                {income.map((c) => (
                                    <SelectItem key={c.id} value={String(c.id)}>
                                        {c.icon && <CategoryIcon icon={c.icon} className="mr-2 h-4 w-4" />}
                                        {c.name}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        )}
                        {expenses.length > 0 && (
                            <SelectGroup>
                                <SelectLabel className="text-rose-700">Expense</SelectLabel>
                                {expenses.map((c) => (
                                    <SelectItem key={c.id} value={String(c.id)}>
                                        {c.icon && <CategoryIcon icon={c.icon} className="mr-2 h-4 w-4" />}
                                        {c.name}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        )}
                    </SelectContent>
                </Select>
                {noCategories && (
                    <p className="text-xs text-amber-700">
                        Create at least one category first before recording transactions.
                    </p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="account_id">Account</Label>
                <Select
                    value={accountId}
                    onValueChange={setAccountId}
                    disabled={!!noAccounts}
                >
                    <SelectTrigger id="account_id">
                        <SelectValue placeholder="Choose an account" />
                    </SelectTrigger>
                    <SelectContent>
                        {accounts.data?.map((a) => (
                            <SelectItem key={a.id} value={String(a.id)}>
                                {a.name} — {formatCurrency(a.current_balance, a.currency)}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {noAccounts && (
                    <p className="text-xs text-amber-700">
                        Create at least one account before recording transactions.
                    </p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="description">Description (optional)</Label>
                <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="What was this for?"
                    rows={2}
                />
            </div>

            {error && <p className="text-sm text-rose-600">{error}</p>}

            <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={onCancel}>
                    Cancel
                </Button>
                <Button
                    type="submit"
                    disabled={
                        isSubmitting || !categoryId || !amount || !accountId || !!noAccounts
                    }
                >
                    {isSubmitting ? "Saving…" : transaction ? "Update" : "Create"}
                </Button>
            </div>
        </form>
    )
}
