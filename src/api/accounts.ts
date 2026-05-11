import { apiClient } from "@/lib/api-client"
import type {
    Account,
    AccountCreate,
    AccountUpdate,
    AccountsSummary,
} from "@/types/account"

export async function listAccounts(): Promise<Account[]> {
    const { data } = await apiClient.get<Account[]>("/accounts")
    return data
}

export async function getAccountsSummary(): Promise<AccountsSummary> {
    const { data } = await apiClient.get<AccountsSummary>("/accounts/summary")
    return data
}

export async function createAccount(payload: AccountCreate): Promise<Account> {
    const { data } = await apiClient.post<Account>("/accounts", payload)
    return data
}

export async function updateAccount(
    id: number,
    payload: AccountUpdate,
): Promise<Account> {
    const { data } = await apiClient.patch<Account>(`/accounts/${id}`, payload)
    return data
}

export async function deleteAccount(id: number): Promise<void> {
    await apiClient.delete(`/accounts/${id}`)
}