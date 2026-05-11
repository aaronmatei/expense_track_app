export type CategoryType = "income" | "expense"

export interface Category {
    id: number
    name: string
    type: CategoryType
    icon: string | null
    color: string | null
    user_id: number
    created_at: string
    updated_at: string | null
}

export interface CategoryCreate {
    name: string
    type: CategoryType
    icon?: string | null
    color?: string | null
}

export type CategoryUpdate = Partial<CategoryCreate>