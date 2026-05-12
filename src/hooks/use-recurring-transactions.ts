import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import {
    createRecurringTransaction,
    deleteRecurringTransaction,
    getDueRecurring,
    listRecurringTransactions,
    materializeBulk,
    materializeRecurringTransaction,
    updateRecurringTransaction,
} from "@/api/recurring-transactions"
import type {
    BulkMaterializeItem,
    MaterializeRequest,
    RecurringTransactionCreate,
    RecurringTransactionUpdate,
} from "@/types/recurring-transaction"

const RT_KEY = ["recurring-transactions"]

function invalidateAll(queryClient: ReturnType<typeof useQueryClient>) {
    queryClient.invalidateQueries({ queryKey: RT_KEY })
    queryClient.invalidateQueries({ queryKey: ["transactions"] })
    queryClient.invalidateQueries({ queryKey: ["accounts"] })
}

export function useRecurringTransactions() {
    return useQuery({
        queryKey: RT_KEY,
        queryFn: listRecurringTransactions,
    })
}

export function useDueRecurring() {
    return useQuery({
        queryKey: [...RT_KEY, "due"],
        queryFn: getDueRecurring,
    })
}

export function useCreateRecurringTransaction() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (payload: RecurringTransactionCreate) =>
            createRecurringTransaction(payload),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: RT_KEY }),
    })
}

export function useUpdateRecurringTransaction() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: RecurringTransactionUpdate }) =>
            updateRecurringTransaction(id, data),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: RT_KEY }),
    })
}

export function useDeleteRecurringTransaction() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: deleteRecurringTransaction,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: RT_KEY }),
    })
}

export function useMaterialize() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ id, payload }: { id: number; payload: MaterializeRequest }) =>
            materializeRecurringTransaction(id, payload),
        onSuccess: () => invalidateAll(queryClient),
    })
}

export function useMaterializeBulk() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (items: BulkMaterializeItem[]) => materializeBulk({ items }),
        onSuccess: () => invalidateAll(queryClient),
    })
}
