import { X } from "lucide-react"

import { CategoryMultiSelect } from "@/components/transactions/category-multi-select"
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
import { useAccounts } from "@/hooks/use-accounts"
import { useCategories } from "@/hooks/use-categories"

export interface TransactionFiltersState {
    startDate: string
    endDate: string
    categoryIds: number[]
    accountId: string
    type: "all" | "income" | "expense"
}

interface TransactionFiltersProps {
    filters: TransactionFiltersState
    onChange: (filters: TransactionFiltersState) => void
    onClear: () => void
}

export function TransactionFilters({
    filters,
    onChange,
    onClear,
}: TransactionFiltersProps) {
    const categories = useCategories()
    const accounts = useAccounts()
    const hasFilters =
        !!filters.startDate ||
        !!filters.endDate ||
        filters.categoryIds.length > 0 ||
        !!filters.accountId ||
        filters.type !== "all"

    return (
        <div className="flex flex-wrap items-end gap-3 rounded-lg border border-slate-200 bg-white p-4">
            <div className="space-y-1">
                <Label htmlFor="start_date" className="text-xs">
                    From
                </Label>
                <Input
                    id="start_date"
                    type="date"
                    value={filters.startDate}
                    onChange={(e) =>
                        onChange({ ...filters, startDate: e.target.value })
                    }
                    className="w-40"
                />
            </div>
            <div className="space-y-1">
                <Label htmlFor="end_date" className="text-xs">
                    To
                </Label>
                <Input
                    id="end_date"
                    type="date"
                    value={filters.endDate}
                    onChange={(e) => onChange({ ...filters, endDate: e.target.value })}
                    className="w-40"
                />
            </div>
            <div className="space-y-1">
                <Label htmlFor="type" className="text-xs">
                    Type
                </Label>
                <Select
                    value={filters.type}
                    onValueChange={(v) =>
                        onChange({ ...filters, type: v as TransactionFiltersState["type"] })
                    }
                >
                    <SelectTrigger id="type" className="w-36">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All types</SelectItem>
                        <SelectItem value="income">Income</SelectItem>
                        <SelectItem value="expense">Expense</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-1">
                <Label className="text-xs">Category</Label>
                <CategoryMultiSelect
                    categories={categories.data ?? []}
                    selectedIds={filters.categoryIds}
                    onChange={(ids) => onChange({ ...filters, categoryIds: ids })}
                />
            </div>
            <div className="space-y-1">
                <Label htmlFor="account" className="text-xs">
                    Account
                </Label>
                <Select
                    value={filters.accountId || "all"}
                    onValueChange={(v) =>
                        onChange({ ...filters, accountId: v === "all" ? "" : v })
                    }
                >
                    <SelectTrigger id="account" className="w-48">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All accounts</SelectItem>
                        {accounts.data?.map((a) => (
                            <SelectItem key={a.id} value={String(a.id)}>
                                {a.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            {hasFilters && (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClear}
                    className="text-slate-600"
                >
                    <X className="mr-1 h-4 w-4" /> Clear
                </Button>
            )}
        </div>
    )
}
