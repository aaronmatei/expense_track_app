import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import {
    createBudget,
    deleteBudget,
    getBudgetsSummary,
    listBudgets,
    updateBudget,
} from "@/api/budgets"
import type { BudgetUpdate } from "@/types/budget"

const BUDGETS_KEY = ["budgets"]

export function useBudgets() {
    return useQuery({
        queryKey: BUDGETS_KEY,
        queryFn: listBudgets,
    })
}

export function useBudgetsSummary(year: number, month: number) {
    return useQuery({
        queryKey: [...BUDGETS_KEY, "summary", year, month],
        queryFn: () => getBudgetsSummary(year, month),
    })
}

export function useCreateBudget() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: createBudget,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: BUDGETS_KEY })
        },
    })
}

export function useUpdateBudget() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: BudgetUpdate }) =>
            updateBudget(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: BUDGETS_KEY })
        },
    })
}

export function useDeleteBudget() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: deleteBudget,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: BUDGETS_KEY })
        },
    })
}
