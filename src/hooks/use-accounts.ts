import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import {
    createAccount,
    deleteAccount,
    getAccountsSummary,
    listAccounts,
    updateAccount,
} from "@/api/accounts"
import type { AccountUpdate } from "@/types/account"

const ACCOUNTS_KEY = ["accounts"]

export function useAccounts() {
    return useQuery({
        queryKey: ACCOUNTS_KEY,
        queryFn: listAccounts,
    })
}

export function useAccountsSummary() {
    return useQuery({
        queryKey: [...ACCOUNTS_KEY, "summary"],
        queryFn: getAccountsSummary,
    })
}

export function useCreateAccount() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: createAccount,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ACCOUNTS_KEY })
        },
    })
}

export function useUpdateAccount() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: AccountUpdate }) =>
            updateAccount(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ACCOUNTS_KEY })
        },
    })
}

export function useDeleteAccount() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: deleteAccount,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ACCOUNTS_KEY })
        },
    })
}