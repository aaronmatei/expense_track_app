import { apiClient } from "@/lib/api-client"
import type {
    CategorySummary,
    MonthSummary,
    Transaction,
    TransactionCreate,
    TransactionFilters,
    TransactionSummary,
    TransactionUpdate,
} from "@/types/transaction"

export async function listTransactions(
    filters: TransactionFilters = {},
): Promise<Transaction[]> {
    // Strip empty/undefined values so we don't send `?start_date=&category_id=`
    const params = Object.fromEntries(
        Object.entries(filters).filter(
            ([, v]) => v !== undefined && v !== null && v !== "",
        ),
    )
    const { data } = await apiClient.get<Transaction[]>("/transactions", {
        params,
    })
    return data
}

export async function createTransaction(
    payload: TransactionCreate,
): Promise<Transaction> {
    const { data } = await apiClient.post<Transaction>("/transactions", payload)
    return data
}

export async function updateTransaction(
    id: number,
    payload: TransactionUpdate,
): Promise<Transaction> {
    const { data } = await apiClient.patch<Transaction>(
        `/transactions/${id}`,
        payload,
    )
    return data
}

export async function deleteTransaction(id: number): Promise<void> {
    await apiClient.delete(`/transactions/${id}`)
}

export async function getTransactionsSummary(
    startDate: string,
    endDate: string,
): Promise<TransactionSummary> {
    const { data } = await apiClient.get<TransactionSummary>(
        "/transactions/summary",
        { params: { start_date: startDate, end_date: endDate } },
    )
    return data
}

export async function getMonthlySummary(year: number): Promise<MonthSummary[]> {
    const { data } = await apiClient.get<MonthSummary[]>(
        "/transactions/summary/by-month",
        { params: { year } },
    )
    return data
}

export async function getCategorySummary(
    startDate: string,
    endDate: string,
): Promise<CategorySummary[]> {
    const { data } = await apiClient.get<CategorySummary[]>(
        "/transactions/summary/by-category",
        { params: { start_date: startDate, end_date: endDate } },
    )
    return data
}