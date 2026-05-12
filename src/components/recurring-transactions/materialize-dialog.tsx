import { useEffect, useState } from "react"
import { toast } from "sonner"

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
import { useMaterialize } from "@/hooks/use-recurring-transactions"
import { getErrorMessage } from "@/lib/errors"
import type { RecurringTransaction } from "@/types/recurring-transaction"

function todayISO(): string {
    return new Date().toISOString().split("T")[0]
}

interface MaterializeDialogProps {
    template: RecurringTransaction | undefined
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function MaterializeDialog({
    template,
    open,
    onOpenChange,
}: MaterializeDialogProps) {
    const materializeMutation = useMaterialize()
    const [amount, setAmount] = useState("")
    const [date, setDate] = useState(todayISO())
    const [description, setDescription] = useState("")

    useEffect(() => {
        if (!template) return
        setAmount(template.amount)
        setDate(template.next_due_date ?? todayISO())
        setDescription(template.description)
        materializeMutation.reset()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [template, open])

    function handleSubmit() {
        if (!template) return
        materializeMutation.mutate(
            {
                id: template.id,
                payload: {
                    amount: amount || undefined,
                    transaction_date: date || undefined,
                    description: description.trim() || undefined,
                },
            },
            {
                onSuccess: () => {
                    toast.success(`Generated: ${template.description}`)
                    onOpenChange(false)
                },
            },
        )
    }

    if (!template) return null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Generate transaction</DialogTitle>
                    <DialogDescription asChild>
                        <div className="flex flex-col gap-1 text-sm text-slate-500 dark:text-slate-400">
                            <span>{template.description}</span>
                            <FrequencyBadge
                                frequency={template.frequency}
                                config={template.day_config}
                            />
                        </div>
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    {materializeMutation.isError && (
                        <p className="rounded-md bg-rose-50 dark:bg-rose-950/30 px-3 py-2 text-sm text-rose-700 dark:text-rose-400">
                            {getErrorMessage(materializeMutation.error)}
                        </p>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="mat_amount">Amount (KES)</Label>
                            <Input
                                id="mat_amount"
                                type="number"
                                min="0.01"
                                step="0.01"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="mat_date">Date</Label>
                            <Input
                                id="mat_date"
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="mat_description">Description</Label>
                        <Input
                            id="mat_description"
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
                            type="button"
                            disabled={materializeMutation.isPending || !amount || !date}
                            onClick={handleSubmit}
                        >
                            {materializeMutation.isPending ? "Generating…" : "Generate"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
