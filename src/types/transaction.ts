export interface Transaction {
    id: number
    amount: string
    description: string | null
    transaction_date: string // YYYY-MM-DD
    category_id: number
    user_id: number
    created_at: string
    updated_at: string | null
}

export interface TransactionCreate {
    amount: string | number
    description?: string | null
    transaction_date: string
    category_id: number
}

export type TransactionUpdate = Partial<TransactionCreate>

export interface TransactionFilters {
    skip?: number
    limit?: number
    category_id?: number
    start_date?: string
    end_date?: string
}

export interface TransactionSummary {
    start_date: string
    end_date: string
    total_income: string
    total_expenses: string
    net: string
    transaction_count: number
}