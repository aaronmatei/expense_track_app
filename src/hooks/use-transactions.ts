import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import {
    createTransaction,
    deleteTransaction,
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