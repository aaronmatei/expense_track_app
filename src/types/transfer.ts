export interface Transfer {
    id: number
    user_id: number
    from_account_id: number
    to_account_id: number
    from_account_name: string
    to_account_name: string
    amount: string
    transfer_date: string
    description: string | null
    created_at: string
}

export interface TransferCreate {
    from_account_id: number
    to_account_id: number
    amount: string
    transfer_date: string
    description?: string | null
}

export interface TransferUpdate extends Partial<TransferCreate> {}

export interface TransferFilters {
    start_date?: string
    end_date?: string
    account_id?: number
}
