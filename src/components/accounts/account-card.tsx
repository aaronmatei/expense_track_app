import { Pencil, Trash2 } from "lucide-react"

import { ACCOUNT_TYPE_META } from "@/components/accounts/account-type-info"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { Account } from "@/types/account"

interface AccountCardProps {
    account: Account
    onEdit: (account: Account) => void
    onDelete: (account: Account) => void
}

function formatCurrency(amount: string | number, currency: string): string {
    try {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: currency,
            minimumFractionDigits: 2,
        }).format(Number(amount))
    } catch {
        return `${currency} ${Number(amount).toFixed(2)}`
    }
}

export function AccountCard({ account, onEdit, onDelete }: AccountCardProps) {
    const meta = ACCOUNT_TYPE_META[account.account_type]
    const Icon = meta.icon
    const isNegative = Number(account.current_balance) < 0

    return (
        <Card className={cn("group border-l-4", meta.borderColor)}>
            <CardContent className="p-5">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div
                            className={cn(
                                "flex h-10 w-10 items-center justify-center rounded-md",
                                meta.bgColor,
                            )}
                        >
                            <Icon className={cn("h-5 w-5", meta.color)} />
                        </div>
                        <div>
                            <p className="font-semibold">{account.name}</p>
                            {account.institution && (
                                <p className="text-xs text-slate-500 dark:text-slate-400">{account.institution}</p>
                            )}
                        </div>
                    </div>
                    <div className="flex opacity-0 transition-opacity group-hover:opacity-100">
                        <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => onEdit(account)}
                            aria-label="Edit"
                        >
                            <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => onDelete(account)}
                            aria-label="Delete"
                        >
                            <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                    </div>
                </div>

                <div className="mt-4">
                    <p className="text-xs text-slate-500 dark:text-slate-400">Current balance</p>
                    <p
                        className={cn(
                            "text-2xl font-bold tracking-tight tabular-nums",
                            isNegative ? "text-rose-600 dark:text-rose-400" : "text-slate-900 dark:text-slate-100",
                        )}
                    >
                        {formatCurrency(account.current_balance, account.currency)}
                    </p>
                </div>

                <div className="mt-4 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span>{meta.label}</span>
                    {!account.include_in_total && (
                        <span className="rounded-full bg-slate-100 dark:bg-slate-700/50 px-2 py-0.5">
                            Excluded from total
                        </span>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}