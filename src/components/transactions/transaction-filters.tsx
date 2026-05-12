import { Download, X } from "lucide-react"
import { useState } from "react"

import { CategoryMultiSelect } from "@/components/transactions/category-multi-select"
import { EmployeeCombobox } from "@/components/employees/employee-combobox"
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
import { exportTransactionsCsv } from "@/api/transactions"
import { useAccounts } from "@/hooks/use-accounts"
import { useCategories } from "@/hooks/use-categories"
import type { Employee } from "@/types/employee"

export interface TransactionFiltersState {
    startDate: string
    endDate: string
    categoryIds: number[]
    accountId: string
    type: "all" | "income" | "expense"
    employeeId: number | null
}

interface TransactionFiltersProps {
    filters: TransactionFiltersState
    onChange: (filters: TransactionFiltersState) => void
    onClear: () => void
    totalCount?: number
}

export function TransactionFilters({
    filters,
    onChange,
    onClear,
    totalCount,
}: TransactionFiltersProps) {
    const categories = useCategories()
    const accounts = useAccounts()
    const [isExporting, setIsExporting] = useState(false)
    const hasFilters =
        !!filters.startDate ||
        !!filters.endDate ||
        filters.categoryIds.length > 0 ||
        !!filters.accountId ||
        filters.type !== "all" ||
        filters.employeeId !== null

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
            <div className="space-y-1">
                <Label className="text-xs">Employee</Label>
                <div className="w-48">
                    <EmployeeCombobox
                        value={filters.employeeId}
                        onChange={(_id: number | null, _emp: Employee | null) =>
                            onChange({ ...filters, employeeId: _id })
                        }
                        placeholder="All employees"
                        allowClear={true}
                    />
                </div>
            </div>
            <div className="ml-auto flex items-center gap-2">
                {typeof totalCount === "number" && (
                    <span className="text-xs text-slate-500">
                        {totalCount} {totalCount === 1 ? "transaction" : "transactions"}
                    </span>
                )}
                <Button
                    variant="outline"
                    size="sm"
                    disabled={isExporting}
                    onClick={async () => {
                        setIsExporting(true)
                        try {
                            await exportTransactionsCsv(filters)
                        } finally {
                            setIsExporting(false)
                        }
                    }}
                >
                    <Download className="mr-1 h-4 w-4" />
                    {isExporting ? "Exporting…" : "Export CSV"}
                </Button>
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
        </div>
    )
}
