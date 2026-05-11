import { useEffect, useState, type FormEvent } from "react"

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
import { useCategories } from "@/hooks/use-categories"
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
    const [amount, setAmount] = useState(transaction?.amount ?? "")
    const [description, setDescription] = useState(transaction?.description ?? "")
    const [transactionDate, setTransactionDate] = useState(
        transaction?.transaction_date ?? todayISO(),
    )
    const [categoryId, setCategoryId] = useState<string>(
        transaction?.category_id ? String(transaction.category_id) : "",
    )

    useEffect(() => {
        setAmount(transaction?.amount ?? "")
        setDescription(transaction?.description ?? "")
        setTransactionDate(transaction?.transaction_date ?? todayISO())
        setCategoryId(
            transaction?.category_id ? String(transaction.category_id) : "",
        )
    }, [transaction])

    function handleSubmit(e: FormEvent) {
        e.preventDefault()
        if (!categoryId) return
        onSubmit({
            amount: amount || "0",
            description: description.trim() || null,
            transaction_date: transactionDate,
            category_id: Number(categoryId),
        })
    }

    const income = categories.data?.filter((c) => c.type === "income") ?? []
    const expenses = categories.data?.filter((c) => c.type === "expense") ?? []
    const noCategories = categories.data && categories.data.length === 0

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
                                        {c.icon && <span className="mr-2">{c.icon}</span>}
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
                                        {c.icon && <span className="mr-2">{c.icon}</span>}
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
                <Label htmlFor="description">Description (optional)</Label>
                <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="What was this for?"
                    rows={2}
                />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={onCancel}>
                    Cancel
                </Button>
                <Button
                    type="submit"
                    disabled={isSubmitting || !categoryId || !amount}
                >
                    {isSubmitting ? "Saving…" : transaction ? "Update" : "Create"}
                </Button>
            </div>
        </form>
    )
}