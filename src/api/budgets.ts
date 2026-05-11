import { apiClient } from "@/lib/api-client"
import type {
    Budget,
    BudgetCreate,
    BudgetUpdate,
    BudgetWithSpending,
} from "@/types/budget"

export async function listBudgets(): Promise<Budget[]> {
    const { data } = await apiClient.get<Budget[]>("/budgets")
    return data
}

export async function getBudgetsSummary(
    year: number,
    month: number,
): Promise<BudgetWithSpending[]> {
    const { data } = await apiClient.get<BudgetWithSpending[]>("/budgets/summary", {
        params: { year, month },
    })
    return data
}

export async function createBudget(payload: BudgetCreate): Promise<Budget> {
    const { data } = await apiClient.post<Budget>("/budgets", payload)
    return data
}

export async function updateBudget(
    id: number,
    payload: BudgetUpdate,
): Promise<Budget> {
    const { data } = await apiClient.patch<Budget>(`/budgets/${id}`, payload)
    return data
}

export async function deleteBudget(id: number): Promise<void> {
    await apiClient.delete(`/budgets/${id}`)
}
