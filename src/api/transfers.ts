import { apiClient } from "@/lib/api-client"
import type {
    Transfer,
    TransferCreate,
    TransferFilters,
    TransferUpdate,
} from "@/types/transfer"

export async function getTransfers(filters?: TransferFilters): Promise<Transfer[]> {
    const { data } = await apiClient.get<Transfer[]>("/transfers", {
        params: filters,
    })
    return data
}

export async function getTransfer(id: number): Promise<Transfer> {
    const { data } = await apiClient.get<Transfer>(`/transfers/${id}`)
    return data
}

export async function createTransfer(payload: TransferCreate): Promise<Transfer> {
    const { data } = await apiClient.post<Transfer>("/transfers", payload)
    return data
}

export async function updateTransfer(
    id: number,
    payload: TransferUpdate,
): Promise<Transfer> {
    const { data } = await apiClient.patch<Transfer>(`/transfers/${id}`, payload)
    return data
}

export async function deleteTransfer(id: number): Promise<void> {
    await apiClient.delete(`/transfers/${id}`)
}
