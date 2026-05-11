import { useEffect, useState, type FormEvent } from "react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
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
import { useCategories } from "@/hooks/use-categories"
import type { Budget, BudgetCreate, BudgetPeriod } from "@/types/budget"

function todayISO(): string {
    return new Date().toISOString().split("T")[0]
}

interface BudgetFormProps {
    budget?: Budget
    onSubmit: (data: BudgetCreate) => void
    onCancel: () => void
    isSubmitting?: boolean
    error?: string
}

export function BudgetForm({
    budget,
    onSubmit,
    onCancel,
    isSubmitting,
    error,
}: BudgetFormProps) {
    const categories = useCategories()
    const [categoryId, setCategoryId] = useState<string>(
        budget?.category_id ? String(budget.category_id) : "",
    )
    const [amount, setAmount] = useState(budget?.amount ?? "")
    const [period, setPeriod] = useState<BudgetPeriod>(budget?.period ?? "monthly")
    const [startDate, setStartDate] = useState(budget?.start_date ?? todayISO())
    const [notifyAt80, setNotifyAt80] = useState(budget?.notify_at_80_percent ?? false)
    const [notifyExceeded, setNotifyExceeded] = useState(
        budget?.notify_when_exceeded ?? false,
    )

    useEffect(() => {
        setCategoryId(budget?.category_id ? String(budget.category_id) : "")
        setAmount(budget?.amount ?? "")
        setPeriod(budget?.period ?? "monthly")
        setStartDate(budget?.start_date ?? todayISO())
        setNotifyAt80(budget?.notify_at_80_percent ?? false)
        setNotifyExceeded(budget?.notify_when_exceeded ?? false)
    }, [budget])

    function handleSubmit(e: FormEvent) {
        e.preventDefault()
        if (!categoryId) return
        onSubmit({
            amount,
            period,
            start_date: startDate,
            category_id: Number(categoryId),
            notify_at_80_percent: notifyAt80,
            notify_when_exceeded: notifyExceeded,
        })
    }

    const income = categories.data?.filter((c) => c.type === "income") ?? []
    const expenses = categories.data?.filter((c) => c.type === "expense") ?? []

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="category_id">Category</Label>
                <Select
                    value={categoryId}
                    onValueChange={setCategoryId}
                    disabled={!!budget}
                >
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
                {budget && (
                    <p className="text-xs text-slate-500">
                        Category cannot be changed after creation.
                    </p>
                )}
            </div>

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
                    <Label htmlFor="period">Period</Label>
                    <Select
                        value={period}
                        onValueChange={(v) => setPeriod(v as BudgetPeriod)}
                    >
                        <SelectTrigger id="period">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="monthly">Monthly</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="yearly">Yearly</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="start_date">Start date</Label>
                <Input
                    id="start_date"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                />
            </div>

            <div className="space-y-3">
                <Label>Notifications</Label>
                <div className="flex items-center gap-2">
                    <Checkbox
                        id="notify_at_80"
                        checked={notifyAt80}
                        onCheckedChange={(checked) => setNotifyAt80(!!checked)}
                    />
                    <Label
                        htmlFor="notify_at_80"
                        className="cursor-pointer font-normal"
                    >
                        Notify when 80% used
                    </Label>
                </div>
                <div className="flex items-center gap-2">
                    <Checkbox
                        id="notify_exceeded"
                        checked={notifyExceeded}
                        onCheckedChange={(checked) => setNotifyExceeded(!!checked)}
                    />
                    <Label
                        htmlFor="notify_exceeded"
                        className="cursor-pointer font-normal"
                    >
                        Notify when budget exceeded
                    </Label>
                </div>
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
                    {isSubmitting ? "Saving…" : budget ? "Update" : "Create"}
                </Button>
            </div>
        </form>
    )
}
