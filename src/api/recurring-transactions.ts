import { apiClient } from "@/lib/api-client"
import type {
    BulkMaterializeItem,
    BulkMaterializeResponse,
    MaterializeRequest,
    RecurringTransaction,
    RecurringTransactionCreate,
    RecurringTransactionUpdate,
} from "@/types/recurring-transaction"
import type { Transaction } from "@/types/transaction"

export async function listRecurringTransactions(): Promise<RecurringTransaction[]> {
    const { data } = await apiClient.get<RecurringTransaction[]>("/recurring-transactions")
    return data
}

export async function getRecurringTransaction(id: number): Promise<RecurringTransaction> {
    const { data } = await apiClient.get<RecurringTransaction>(`/recurring-transactions/${id}`)
    return data
}

export async function createRecurringTransaction(
    payload: RecurringTransactionCreate,
): Promise<RecurringTransaction> {
    const { data } = await apiClient.post<RecurringTransaction>("/recurring-transactions", payload)
    return data
}

export async function updateRecurringTransaction(
    id: number,
    payload: RecurringTransactionUpdate,
): Promise<RecurringTransaction> {
    const { data } = await apiClient.patch<RecurringTransaction>(
        `/recurring-transactions/${id}`,
        payload,
    )
    return data
}

export async function deleteRecurringTransaction(id: number): Promise<void> {
    await apiClient.delete(`/recurring-transactions/${id}`)
}

export async function getDueRecurring(): Promise<RecurringTransaction[]> {
    const { data } = await apiClient.get<RecurringTransaction[]>("/recurring-transactions/due")
    return data
}

export async function materializeRecurringTransaction(
    id: number,
    payload: MaterializeRequest,
): Promise<Transaction> {
    const { data } = await apiClient.post<Transaction>(
        `/recurring-transactions/${id}/materialize`,
        payload,
    )
    return data
}

export async function materializeBulk(payload: {
    items: BulkMaterializeItem[]
}): Promise<BulkMaterializeResponse> {
    const { data } = await apiClient.post<BulkMaterializeResponse>(
        "/recurring-transactions/materialize-bulk",
        payload,
    )
    return data
}
