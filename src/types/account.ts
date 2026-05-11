export type AccountType =
    | "checking"
    | "savings"
    | "credit_card"
    | "investment"
    | "cash"
    | "loan"
    | "other"

export interface Account {
    id: number
    name: string
    account_type: AccountType
    institution: string | null
    current_balance: string
    currency: string
    description: string | null
    include_in_total: boolean
    user_id: number
    created_at: string
    updated_at: string | null
}

export interface AccountCreate {
    name: string
    account_type: AccountType
    institution?: string | null
    current_balance?: string | number
    currency?: string
    description?: string | null
    include_in_total?: boolean
}

export type AccountUpdate = Partial<AccountCreate>

export interface AccountTypeBreakdown {
    account_type: AccountType
    total: string
    count: number
}

export interface AccountsSummary {
    total_balance: string
    account_count: number
    breakdown: AccountTypeBreakdown[]
}