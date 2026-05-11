import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import {
    createTransaction,
    deleteTransaction,
    getCategorySummary,
    getMonthlySummary,
    getTransactionsSummary,
    listTransactions,
    updateTransaction,
} from "@/api/transactions"
import type {
    TransactionFilters,
    TransactionUpdate,
} from "@/types/transaction"

const TRANSACTIONS_KEY = ["transactions"]

export function useTransactions(filters: TransactionFilters = {}) {
    return useQuery({
        queryKey: [...TRANSACTIONS_KEY, filters],
        queryFn: () => listTransactions(filters),
    })
}

export function useCreateTransaction() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: createTransaction,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: TRANSACTIONS_KEY })
        },
    })
}

export function useUpdateTransaction() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: TransactionUpdate }) =>
            updateTransaction(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: TRANSACTIONS_KEY })
        },
    })
}

export function useDeleteTransaction() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: deleteTransaction,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: TRANSACTIONS_KEY })
        },
    })
}

export function useTransactionsSummary(startDate: string, endDate: string) {
    return useQuery({
        queryKey: ["transactions", "summary", startDate, endDate],
        queryFn: () => getTransactionsSummary(startDate, endDate),
    })
}

export function useMonthlySummary(year: number, enabled = true) {
    return useQuery({
        queryKey: ["transactions", "summary", "by-month", year],
        queryFn: () => getMonthlySummary(year),
        enabled,
    })
}

export function useCategorySummary(startDate: string, endDate: string) {
    return useQuery({
        queryKey: ["transactions", "summary", "by-category", startDate, endDate],
        queryFn: () => getCategorySummary(startDate, endDate),
    })
}