import { Pencil, Trash2 } from "lucide-react"

import { CategoryIcon } from "@/components/category-icon"
import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"
import type { Account } from "@/types/account"
import type { Category } from "@/types/category"
import type { Transaction } from "@/types/transaction"

function formatDate(iso: string): string {
    const d = new Date(iso)
    return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    })
}

function formatAmount(amount: string, isIncome: boolean): string {
    const sign = isIncome ? "+" : "-"
    return `${sign}$${Number(amount).toFixed(2)}`
}

interface TransactionListProps {
    transactions: Transaction[]
    categoryMap: Map<number, Category>
    accountMap: Map<number, Account>
    onEdit: (t: Transaction) => void
    onDelete: (t: Transaction) => void
}

export function TransactionList({
    transactions,
    categoryMap,
    accountMap,
    onEdit,
    onDelete,
}: TransactionListProps) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Account</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="w-20" />
                </TableRow>
            </TableHeader>
            <TableBody>
                {transactions.map((t) => {
                    const category = categoryMap.get(t.category_id)
                    const account = accountMap.get(t.account_id)
                    const isIncome = category?.type === "income"
                    return (
                        <TableRow key={t.id} className="group">
                            <TableCell className="text-sm text-slate-600">
                                {formatDate(t.transaction_date)}
                            </TableCell>
                            <TableCell>
                                {category ? (
                                    <div className="flex items-center gap-2">
                                        <div
                                            className="flex h-7 w-7 items-center justify-center rounded-md text-sm text-white"
                                            style={{ backgroundColor: category.color ?? "#94a3b8" }}
                                        >
                                            <CategoryIcon icon={category.icon} className="text-sm" fallback={category.name[0]?.toUpperCase()} />
                                        </div>
                                        <span className="text-sm font-medium">
                                            {category.name}
                                        </span>
                                    </div>
                                ) : (
                                    <span className="text-sm text-slate-400">Unknown</span>
                                )}
                            </TableCell>
                            <TableCell className="text-sm text-slate-600">
                                {account?.name ?? "—"}
                            </TableCell>
                            <TableCell className="max-w-xs truncate text-sm text-slate-600">
                                {t.description || "—"}
                            </TableCell>
                            <TableCell
                                className={cn(
                                    "text-right text-sm font-semibold tabular-nums",
                                    isIncome ? "text-emerald-600" : "text-rose-600",
                                )}
                            >
                                {formatAmount(t.amount, isIncome)}
                            </TableCell>
                            <TableCell>
                                <div className="flex justify-end opacity-0 transition-opacity group-hover:opacity-100">
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={() => onEdit(t)}
                                        aria-label="Edit"
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={() => onDelete(t)}
                                        aria-label="Delete"
                                    >
                                        <Trash2 className="h-4 w-4 text-red-600" />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    )
                })}
            </TableBody>
        </Table>
    )
}
