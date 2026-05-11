export type BudgetPeriod = "weekly" | "monthly" | "yearly"

export interface Budget {
    id: number
    amount: string
    period: BudgetPeriod
    start_date: string
    category_id: number
    notify_at_80_percent: boolean
    notify_when_exceeded: boolean
    user_id: number
    created_at: string
    updated_at: string | null
}

export interface BudgetCreate {
    amount: string
    period?: BudgetPeriod
    start_date: string
    category_id: number
    notify_at_80_percent?: boolean
    notify_when_exceeded?: boolean
}

export type BudgetUpdate = Partial<Omit<BudgetCreate, "category_id">>

export interface BudgetWithSpending extends Budget {
    category_name: string
    spent: string
    remaining: string
    percentage_used: number
    is_over_budget: boolean
}
