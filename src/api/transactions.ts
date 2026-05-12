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
    const { data } = await apiClient.get<Transaction[]>("/transactions", {
        params: {
            skip: filters.skip,
            limit: filters.limit,
            start_date: filters.start_date || undefined,
            end_date: filters.end_date || undefined,
            category_ids: filters.category_ids?.length ? filters.category_ids : undefined,
            account_id: filters.account_id ?? undefined,
            employee_id: filters.employee_id ?? undefined,
        },
        paramsSerializer: { indexes: null },
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

export async function exportTransactionsCsv(filters: {
    startDate?: string
    endDate?: string
    categoryIds?: number[]
    accountId?: string
    type?: string
    employeeId?: number | null
}): Promise<void> {
    const response = await apiClient.get("/transactions/export", {
        params: {
            start_date: filters.startDate || undefined,
            end_date: filters.endDate || undefined,
            category_ids: filters.categoryIds?.length ? filters.categoryIds : undefined,
            account_id: filters.accountId ? Number(filters.accountId) : undefined,
            employee_id: filters.employeeId ?? undefined,
            type: filters.type !== "all" ? filters.type : undefined,
        },
        paramsSerializer: { indexes: null },
        responseType: "blob",
    })
    const url = URL.createObjectURL(new Blob([response.data], { type: "text/csv" }))
    const a = document.createElement("a")
    a.href = url
    a.download = `transactions_${new Date().toISOString().slice(0, 10)}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
}