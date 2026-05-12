import { useEffect, useState } from "react"

import {
    getDefaultRecurrenceConfig,
    RecurrenceConfigInput,
} from "@/components/recurring-transactions/recurrence-config-input"
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
import { Switch } from "@/components/ui/switch"
import { useAccounts } from "@/hooks/use-accounts"
import { useCategories } from "@/hooks/use-categories"
import type {
    RecurrenceConfig,
    RecurringFrequency,
    RecurringTransaction,
    RecurringTransactionCreate,
} from "@/types/recurring-transaction"

const FREQUENCIES: { value: RecurringFrequency; label: string }[] = [
    { value: "daily", label: "Daily" },
    { value: "weekly", label: "Weekly" },
    { value: "biweekly", label: "Bi-weekly" },
    { value: "monthly", label: "Monthly" },
    { value: "quarterly", label: "Quarterly" },
    { value: "yearly", label: "Yearly" },
]

function todayISO(): string {
    return new Date().toISOString().split("T")[0]
}

interface FormState {
    description: string
    transaction_type: "income" | "expense"
    amount: string
    category_id: string
    account_id: string
    frequency: RecurringFrequency
    day_config: RecurrenceConfig
    start_date: string
    end_date: string
    max_occurrences: string
    is_active: boolean
}

function buildInitialState(template?: RecurringTransaction): FormState {
    if (template) {
        return {
            description: template.description,
            transaction_type: template.transaction_type,
            amount: template.amount,
            category_id: String(template.category_id),
            account_id: String(template.account_id),
            frequency: template.frequency,
            day_config: template.day_config,
            start_date: template.start_date,
            end_date: template.end_date ?? "",
            max_occurrences: template.max_occurrences != null ? String(template.max_occurrences) : "",
            is_active: template.is_active,
        }
    }
    return {
        description: "",
        transaction_type: "expense",
        amount: "",
        category_id: "",
        account_id: "",
        frequency: "monthly",
        day_config: getDefaultRecurrenceConfig("monthly"),
        start_date: todayISO(),
        end_date: "",
        max_occurrences: "",
        is_active: true,
    }
}

interface RecurringTransactionFormProps {
    template?: RecurringTransaction
    onSubmit: (payload: RecurringTransactionCreate) => void
    isSubmitting: boolean
    errorMessage?: string
}

export function RecurringTransactionForm({
    template,
    onSubmit,
    isSubmitting,
    errorMessage,
}: RecurringTransactionFormProps) {
    const categories = useCategories()
    const accounts = useAccounts()
    const [form, setForm] = useState<FormState>(() => buildInitialState(template))
    const [submitted, setSubmitted] = useState(false)

    useEffect(() => {
        setForm(buildInitialState(template))
        setSubmitted(false)
    }, [template])

    const filteredCategories = categories.data?.filter(
        (c) => c.type === form.transaction_type,
    ) ?? []

    function set<K extends keyof FormState>(key: K, value: FormState[K]) {
        setForm((prev) => ({ ...prev, [key]: value }))
    }

    function handleFrequencyChange(freq: RecurringFrequency) {
        setForm((prev) => ({
            ...prev,
            frequency: freq,
            day_config: getDefaultRecurrenceConfig(freq),
        }))
    }

    function handleTypeChange(type: "income" | "expense") {
        setForm((prev) => ({ ...prev, transaction_type: type, category_id: "" }))
    }

    function handleSubmit() {
        setSubmitted(true)
        if (!form.description.trim() || !form.amount || !form.category_id || !form.account_id || !form.start_date) {
            return
        }
        onSubmit({
            description: form.description.trim(),
            amount: form.amount,
            transaction_type: form.transaction_type,
            category_id: Number(form.category_id),
            account_id: Number(form.account_id),
            frequency: form.frequency,
            day_config: form.day_config,
            start_date: form.start_date,
            end_date: form.end_date || null,
            max_occurrences: form.max_occurrences ? Number(form.max_occurrences) : null,
            is_active: form.is_active,
        })
    }

    return (
        <form onSubmit={(e) => e.preventDefault()} className="space-y-5 px-6 pb-6 pt-4">
            {errorMessage && (
                <p className="rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700">
                    {errorMessage}
                </p>
            )}

            {/* Description */}
            <div className="space-y-1.5">
                <Label htmlFor="rt_description">Description</Label>
                <Input
                    id="rt_description"
                    value={form.description}
                    onChange={(e) => set("description", e.target.value)}
                    placeholder="e.g. Rent payment"
                />
                {submitted && !form.description.trim() && (
                    <p className="text-xs text-amber-600">Description is required.</p>
                )}
            </div>

            {/* Type + Amount */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <Label htmlFor="rt_type">Type</Label>
                    <Select value={form.transaction_type} onValueChange={handleTypeChange}>
                        <SelectTrigger id="rt_type">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="income">Income</SelectItem>
                            <SelectItem value="expense">Expense</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-1.5">
                    <Label htmlFor="rt_amount">Amount</Label>
                    <div className="relative">
                        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-500">
                            KES
                        </span>
                        <Input
                            id="rt_amount"
                            type="number"
                            min="0.01"
                            step="0.01"
                            className="pl-12"
                            value={form.amount}
                            onChange={(e) => set("amount", e.target.value)}
                        />
                    </div>
                    {submitted && !form.amount && (
                        <p className="text-xs text-amber-600">Amount is required.</p>
                    )}
                </div>
            </div>

            {/* Category + Account */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <Label htmlFor="rt_category">Category</Label>
                    <Select
                        value={form.category_id}
                        onValueChange={(v) => set("category_id", v)}
                    >
                        <SelectTrigger id="rt_category">
                            <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                            {filteredCategories.map((c) => (
                                <SelectItem key={c.id} value={String(c.id)}>
                                    {c.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {submitted && !form.category_id && (
                        <p className="text-xs text-amber-600">Category is required.</p>
                    )}
                </div>
                <div className="space-y-1.5">
                    <Label htmlFor="rt_account">Account</Label>
                    <Select
                        value={form.account_id}
                        onValueChange={(v) => set("account_id", v)}
                    >
                        <SelectTrigger id="rt_account">
                            <SelectValue placeholder="Select account" />
                        </SelectTrigger>
                        <SelectContent>
                            {accounts.data?.map((a) => (
                                <SelectItem key={a.id} value={String(a.id)}>
                                    {a.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {submitted && !form.account_id && (
                        <p className="text-xs text-amber-600">Account is required.</p>
                    )}
                </div>
            </div>

            {/* Frequency */}
            <div className="space-y-1.5">
                <Label htmlFor="rt_frequency">Frequency</Label>
                <Select
                    value={form.frequency}
                    onValueChange={(v) => handleFrequencyChange(v as RecurringFrequency)}
                >
                    <SelectTrigger id="rt_frequency" className="w-48">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {FREQUENCIES.map((f) => (
                            <SelectItem key={f.value} value={f.value}>
                                {f.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Recurrence config */}
            <div className="rounded-md border border-slate-100 bg-slate-50 p-3">
                <RecurrenceConfigInput
                    frequency={form.frequency}
                    value={form.day_config}
                    onChange={(cfg) => set("day_config", cfg)}
                />
            </div>

            {/* Start / End dates */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <Label htmlFor="rt_start">Start date</Label>
                    <Input
                        id="rt_start"
                        type="date"
                        value={form.start_date}
                        onChange={(e) => set("start_date", e.target.value)}
                    />
                    {submitted && !form.start_date && (
                        <p className="text-xs text-amber-600">Start date is required.</p>
                    )}
                </div>
                <div className="space-y-1.5">
                    <Label htmlFor="rt_end" className="flex items-center gap-1">
                        End date <span className="text-slate-400 text-xs">(optional)</span>
                    </Label>
                    <Input
                        id="rt_end"
                        type="date"
                        value={form.end_date}
                        onChange={(e) => set("end_date", e.target.value)}
                    />
                </div>
            </div>

            {/* Max occurrences */}
            <div className="space-y-1.5">
                <Label htmlFor="rt_max" className="flex items-center gap-1">
                    Max occurrences <span className="text-slate-400 text-xs">(optional)</span>
                </Label>
                <Input
                    id="rt_max"
                    type="number"
                    min={1}
                    step={1}
                    className="w-32"
                    value={form.max_occurrences}
                    onChange={(e) => set("max_occurrences", e.target.value)}
                    placeholder="Unlimited"
                />
            </div>

            {/* Active toggle */}
            <div className="flex items-center gap-3">
                <Switch
                    id="rt_active"
                    checked={form.is_active}
                    onCheckedChange={(checked) => set("is_active", checked)}
                />
                <Label htmlFor="rt_active" className="cursor-pointer">
                    Active
                </Label>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-2 border-t pt-4">
                <Button
                    type="button"
                    disabled={isSubmitting}
                    onClick={handleSubmit}
                >
                    {isSubmitting ? "Saving…" : template ? "Save changes" : "Create template"}
                </Button>
            </div>
        </form>
    )
}
