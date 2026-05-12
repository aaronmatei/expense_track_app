import { useEffect, useState, type FormEvent } from "react"
import { toast } from "sonner"

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
import { useCategories } from "@/hooks/use-categories"
import { usePayEmployee } from "@/hooks/use-employees"
import { getErrorMessage } from "@/lib/errors"
import type { Employee } from "@/types/employee"

function todayISO(): string {
    return new Date().toISOString().split("T")[0]
}

interface PayEmployeeDialogProps {
    employee: Employee | undefined
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function PayEmployeeDialog({
    employee,
    open,
    onOpenChange,
}: PayEmployeeDialogProps) {
    const accounts = useAccounts()
    const categories = useCategories()
    const payMutation = usePayEmployee()

    const [amount, setAmount] = useState("")
    const [date, setDate] = useState(todayISO())
    const [accountId, setAccountId] = useState("")
    const [categoryId, setCategoryId] = useState("")
    const [description, setDescription] = useState("")

    useEffect(() => {
        if (!employee) return
        setAmount(employee.pay_amount)
        setDate(todayISO())
        setAccountId(
            employee.default_account_id != null
                ? String(employee.default_account_id)
                : "",
        )
        setCategoryId(
            employee.default_category_id != null
                ? String(employee.default_category_id)
                : "",
        )
        setDescription(`Payroll: ${employee.full_name}`)
        payMutation.reset()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [employee, open])

    function handleSubmit(e: FormEvent) {
        e.preventDefault()
        if (!employee) return
        payMutation.mutate(
            {
                id: employee.id,
                payload: {
                    amount,
                    transaction_date: date,
                    account_id: accountId ? Number(accountId) : undefined,
                    category_id: categoryId ? Number(categoryId) : undefined,
                    description: description.trim() || undefined,
                },
            },
            {
                onSuccess: () => {
                    toast.success(`Paid ${employee.full_name}`)
                    onOpenChange(false)
                },
            },
        )
    }

    if (!employee) return null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Pay {employee.full_name}</DialogTitle>
                    <DialogDescription asChild>
                        <div className="flex flex-col gap-1 text-sm text-slate-500">
                            {employee.position && (
                                <span>{employee.position}</span>
                            )}
                            <PayFrequencyBadge
                                frequency={employee.pay_frequency}
                                config={employee.pay_day_config}
                            />
                        </div>
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {payMutation.isError && (
                        <p className="rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700">
                            {getErrorMessage(payMutation.error)}
                        </p>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="pay_amount">Amount (KES)</Label>
                            <Input
                                id="pay_amount"
                                type="number"
                                min="0.01"
                                step="0.01"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="pay_date">Date</Label>
                            <Input
                                id="pay_date"
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="pay_account">Account</Label>
                        <Select
                            value={accountId}
                            onValueChange={setAccountId}
                            required
                        >
                            <SelectTrigger id="pay_account">
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
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="pay_category">Category</Label>
                        <Select
                            value={categoryId}
                            onValueChange={setCategoryId}
                            required
                        >
                            <SelectTrigger id="pay_category">
                                <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.data
                                    ?.filter((c) => c.type === "expense")
                                    .map((c) => (
                                        <SelectItem key={c.id} value={String(c.id)}>
                                            {c.name}
                                        </SelectItem>
                                    ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="pay_description">Description</Label>
                        <Input
                            id="pay_description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={
                                payMutation.isPending ||
                                !amount ||
                                !accountId ||
                                !categoryId
                            }
                        >
                            {payMutation.isPending ? "Paying…" : "Confirm payment"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
