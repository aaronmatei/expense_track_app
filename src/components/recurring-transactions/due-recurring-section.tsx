import { Zap } from "lucide-react"
import { useState } from "react"
import { Link } from "react-router-dom"

import { BulkMaterializeDialog } from "@/components/recurring-transactions/bulk-materialize-dialog"
import { FrequencyBadge } from "@/components/recurring-transactions/frequency-badge"
import { MaterializeDialog } from "@/components/recurring-transactions/materialize-dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { useDueRecurring } from "@/hooks/use-recurring-transactions"
import { formatShortDate } from "@/lib/format"
import { cn } from "@/lib/utils"
import type { RecurringTransaction } from "@/types/recurring-transaction"

interface DueRecurringSectionProps {
    variant: "page" | "widget"
    limit?: number
}

export function DueRecurringSection({
    variant,
    limit = 5,
}: DueRecurringSectionProps) {
    const dueQuery = useDueRecurring()
    const due = dueQuery.data ?? []

    const [genTarget, setGenTarget] = useState<RecurringTransaction | undefined>(undefined)
    const [genOpen, setGenOpen] = useState(false)
    const [selected, setSelected] = useState<Set<number>>(new Set())
    const [bulkOpen, setBulkOpen] = useState(false)

    const visible = variant === "widget" ? due.slice(0, limit) : due

    if (variant === "page" && due.length === 0) return null

    function openGenerate(t: RecurringTransaction) {
        setGenTarget(t)
        setGenOpen(true)
    }

    function toggleSelect(id: number) {
        setSelected((prev) => {
            const next = new Set(prev)
            if (next.has(id)) next.delete(id)
            else next.add(id)
            return next
        })
    }

    function selectAll() {
        if (selected.size === due.length) {
            setSelected(new Set())
        } else {
            setSelected(new Set(due.map((t) => t.id)))
        }
    }

    const selectedTemplates = due.filter((t) => selected.has(t.id))

    return (
        <>
            <div className={cn("rounded-lg border", variant === "page" && "mb-2")}>
                {/* Header */}
                <div className="flex items-center justify-between border-b px-4 py-3">
                    <div className="flex items-center gap-2">
                        <h2 className="text-sm font-semibold">Due Now</h2>
                        {due.length > 0 && (
                            <span className="rounded-full bg-rose-100 px-2 py-0.5 text-xs font-medium text-rose-700">
                                {due.length}
                            </span>
                        )}
                    </div>
                    {variant === "widget" && due.length > limit && (
                        <Link
                            to="/recurring-transactions"
                            className="text-xs text-indigo-600 hover:underline"
                        >
                            View all ({due.length})
                        </Link>
                    )}
                    {variant === "page" && due.length > 1 && (
                        <div className="flex items-center gap-2">
                            <Checkbox
                                id="rt-select-all"
                                checked={selected.size === due.length}
                                onCheckedChange={selectAll}
                            />
                            <label
                                htmlFor="rt-select-all"
                                className="cursor-pointer text-xs text-slate-500"
                            >
                                Select all
                            </label>
                        </div>
                    )}
                </div>

                {/* Empty state (widget only) */}
                {due.length === 0 && variant === "widget" && (
                    <p className="px-4 py-6 text-center text-sm text-slate-500">
                        All templates are up to date 🎉
                    </p>
                )}

                {/* Rows */}
                {visible.map((t) => {
                    const isIncome = t.transaction_type === "income"
                    return (
                        <div
                            key={t.id}
                            className="flex items-center gap-3 border-b px-4 py-3 last:border-b-0"
                        >
                            {variant === "page" && (
                                <Checkbox
                                    checked={selected.has(t.id)}
                                    onCheckedChange={() => toggleSelect(t.id)}
                                    onClick={(e) => e.stopPropagation()}
                                />
                            )}

                            {/* Icon */}
                            <div
                                className={cn(
                                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
                                    isIncome
                                        ? "bg-emerald-100 text-emerald-600"
                                        : "bg-rose-100 text-rose-600",
                                )}
                            >
                                <Zap className="h-4 w-4" />
                            </div>

                            {/* Name + badge */}
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-medium">{t.description}</p>
                                <div className="mt-0.5 flex flex-wrap items-center gap-2">
                                    <FrequencyBadge
                                        frequency={t.frequency}
                                        config={t.day_config}
                                    />
                                    {t.next_due_date && (
                                        <span className="text-xs text-slate-400">
                                            Due {formatShortDate(t.next_due_date)}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Amount */}
                            <span
                                className={cn(
                                    "hidden shrink-0 text-sm font-medium tabular-nums sm:block",
                                    isIncome ? "text-emerald-600" : "text-rose-600",
                                )}
                            >
                                {isIncome ? "+" : "-"}KES{" "}
                                {Number(t.amount).toLocaleString(undefined, {
                                    minimumFractionDigits: 2,
                                })}
                            </span>

                            {/* Generate button */}
                            <Button
                                size="sm"
                                variant="outline"
                                className="shrink-0 border-rose-200 text-rose-700 hover:bg-rose-50"
                                onClick={() => openGenerate(t)}
                            >
                                <Zap className="mr-1 h-3.5 w-3.5" />
                                Generate
                            </Button>
                        </div>
                    )
                })}

                {/* Widget: footer link when truncated */}
                {variant === "widget" && due.length > limit && (
                    <div className="border-t px-4 py-2 text-center">
                        <Link
                            to="/recurring-transactions"
                            className="text-xs text-indigo-600 hover:underline"
                        >
                            View all {due.length} due →
                        </Link>
                    </div>
                )}
            </div>

            {/* Floating "Generate selected" — page variant */}
            {variant === "page" && selected.size > 0 && (
                <div className="sticky bottom-4 z-10 flex justify-center">
                    <Button onClick={() => setBulkOpen(true)} className="shadow-lg">
                        <Zap className="mr-2 h-4 w-4" />
                        Generate selected ({selected.size})
                    </Button>
                </div>
            )}

            <MaterializeDialog
                template={genTarget}
                open={genOpen}
                onOpenChange={(o) => {
                    setGenOpen(o)
                    if (!o) setGenTarget(undefined)
                }}
            />

            <BulkMaterializeDialog
                templates={selectedTemplates}
                open={bulkOpen}
                onOpenChange={(o) => {
                    setBulkOpen(o)
                    if (!o) setSelected(new Set())
                }}
            />
        </>
    )
}
