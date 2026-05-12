export type Gender = "male" | "female" | "other"
export type EmploymentType = "permanent" | "contract" | "casual" | "intern"
export type PayFrequency = "monthly" | "semi_monthly" | "weekly" | "biweekly"
export type Weekday =
    | "monday"
    | "tuesday"
    | "wednesday"
    | "thursday"
    | "friday"
    | "saturday"
    | "sunday"

export type PayDayConfig =
    | { day: number }
    | { days: (number | "last")[] }
    | { weekday: Weekday }
    | { weekday: Weekday; anchor_date: string }

export interface Employee {
    id: number
    user_id: number
    first_name: string
    last_name: string
    full_name: string
    date_of_birth: string | null
    national_id: string | null
    gender: Gender | null
    email: string | null
    phone: string | null
    address: string | null
    emergency_contact_name: string | null
    emergency_contact_phone: string | null
    position: string | null
    employment_type: EmploymentType
    start_date: string
    is_active: boolean
    notes: string | null
    kra_pin: string | null
    nhif_number: string | null
    nssf_number: string | null
    bank_name: string | null
    bank_account_number: string | null
    bank_branch: string | null
    pay_amount: string
    pay_frequency: PayFrequency
    pay_day_config: PayDayConfig
    default_account_id: number | null
    default_category_id: number | null
    last_paid_date: string | null
    next_pay_date: string | null
    most_recent_pay_date: string | null
    is_due_for_pay: boolean
    created_at: string
}

export interface PayEmployeePayload {
    amount?: string | number
    transaction_date?: string
    account_id?: number
    category_id?: number
    description?: string
}

export interface BulkPayItem extends PayEmployeePayload {
    employee_id: number
}

export interface BulkPayPayload {
    payments: BulkPayItem[]
}

export interface BulkPayError {
    employee_id: number
    error: string
}

export interface BulkPayResponse {
    successful: { id: number; amount: string; employee_id: number | null }[]
    failed: BulkPayError[]
}

export interface EmployeeCreate {
    first_name: string
    last_name: string
    date_of_birth?: string | null
    national_id?: string | null
    gender?: Gender | null
    email?: string | null
    phone?: string | null
    address?: string | null
    emergency_contact_name?: string | null
    emergency_contact_phone?: string | null
    position?: string | null
    employment_type: EmploymentType
    start_date: string
    is_active?: boolean
    notes?: string | null
    kra_pin?: string | null
    nhif_number?: string | null
    nssf_number?: string | null
    bank_name?: string | null
    bank_account_number?: string | null
    bank_branch?: string | null
    pay_amount: string | number
    pay_frequency: PayFrequency
    pay_day_config: PayDayConfig
    default_account_id?: number | null
    default_category_id?: number | null
}

export type EmployeeUpdate = Partial<EmployeeCreate>
