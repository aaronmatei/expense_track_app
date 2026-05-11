import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import {
    createCategory,
    deleteCategory,
    listCategories,
    updateCategory,
} from "@/api/categories"
import type { CategoryUpdate } from "@/types/category"

const QUERY_KEY = ["categories"]

export function useCategories() {
    return useQuery({
        queryKey: QUERY_KEY,
        queryFn: listCategories,
    })
}

export function useCreateCategory() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: createCategory,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEY })
        },
    })
}

export function useUpdateCategory() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: CategoryUpdate }) =>
            updateCategory(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEY })
        },
    })
}

export function useDeleteCategory() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: deleteCategory,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEY })
        },
    })
}