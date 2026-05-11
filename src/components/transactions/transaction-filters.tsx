import { X } from "lucide-react"

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
import { useCategories } from "@/hooks/use-categories"

export interface TransactionFiltersState {
    startDate: string
    endDate: string
    categoryId: string // "" means all
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
    const hasFilters =
        !!filters.startDate || !!filters.endDate || !!filters.categoryId

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
                <Label htmlFor="category" className="text-xs">
                    Category
                </Label>
                <Select
                    value={filters.categoryId || "all"}
                    onValueChange={(v) =>
                        onChange({ ...filters, categoryId: v === "all" ? "" : v })
                    }
                >
                    <SelectTrigger id="category" className="w-48">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All categories</SelectItem>
                        {categories.data?.map((c) => (
                            <SelectItem key={c.id} value={String(c.id)}>
                                {c.icon && <span className="mr-2">{c.icon}</span>}
                                {c.name}
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