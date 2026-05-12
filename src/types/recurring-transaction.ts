export type RecurringFrequency = "daily" | "weekly" | "biweekly" | "monthly" | "quarterly" | "yearly"
export type Weekday = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday"

export type RecurrenceConfig =
    | Record<string, never>
    | { weekday: Weekday }
    | { weekday: Weekday; anchor_date: string }
    | { day: number }
    | { month_offset: 0 | 1 | 2; day: number }
    | { month: number; day: number }

export interface RecurringTransaction {
    id: number
    user_id: number
    description: string
    amount: string
    transaction_type: "income" | "expense"
    category_id: number
    category_name: string
    account_id: number
    account_name: string
    frequency: RecurringFrequency
    day_config: RecurrenceConfig
    start_date: string
    end_date: string | null
    max_occurrences: number | null
    occurrences_count: number
    last_generated_date: string | null
    next_due_date: string | null
    is_due: boolean
    is_active: boolean
    created_at: string
}

export interface RecurringTransactionCreate {
    description: string
    amount: string
    transaction_type: "income" | "expense"
    category_id: number
    account_id: number
    frequency: RecurringFrequency
    day_config: RecurrenceConfig
    start_date: string
    end_date?: string | null
    max_occurrences?: number | null
    is_active?: boolean
}

export interface RecurringTransactionUpdate extends Partial<RecurringTransactionCreate> {}

export interface MaterializeRequest {
    amount?: string
    transaction_date?: string
    description?: string
}

export interface BulkMaterializeItem {
    recurring_transaction_id: number
    amount?: string
    transaction_date?: string
    description?: string
}

export interface BulkMaterializeResponse {
    successful: { id: number; amount: string; recurring_transaction_id: number | null }[]
    failed: { recurring_transaction_id: number; error: string }[]
}
