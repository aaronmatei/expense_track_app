import {
    Building2,
    CreditCard,
    HandCoins,
    Landmark,
    PiggyBank,
    TrendingUp,
    Wallet,
    type LucideIcon,
} from "lucide-react"

import type { AccountType } from "@/types/account"

interface AccountTypeMeta {
    label: string
    icon: LucideIcon
    color: string
    bgColor: string
    borderColor: string
}

export const ACCOUNT_TYPE_META: Record<AccountType, AccountTypeMeta> = {
    checking: {
        label: "Checking",
        icon: Landmark,
        color: "text-blue-600",
        bgColor: "bg-blue-50",
        borderColor: "border-l-blue-500",
    },
    savings: {
        label: "Savings",
        icon: PiggyBank,
        color: "text-emerald-600",
        bgColor: "bg-emerald-50",
        borderColor: "border-l-emerald-500",
    },
    credit_card: {
        label: "Credit Card",
        icon: CreditCard,
        color: "text-rose-600",
        bgColor: "bg-rose-50",
        borderColor: "border-l-rose-500",
    },
    investment: {
        label: "Investment",
        icon: TrendingUp,
        color: "text-purple-600",
        bgColor: "bg-purple-50",
        borderColor: "border-l-purple-500",
    },
    cash: {
        label: "Cash",
        icon: Wallet,
        color: "text-amber-600",
        bgColor: "bg-amber-50",
        borderColor: "border-l-amber-500",
    },
    loan: {
        label: "Loan",
        icon: HandCoins,
        color: "text-orange-600",
        bgColor: "bg-orange-50",
        borderColor: "border-l-orange-500",
    },
    other: {
        label: "Other",
        icon: Building2,
        color: "text-slate-600",
        bgColor: "bg-slate-50",
        borderColor: "border-l-slate-500",
    },
}