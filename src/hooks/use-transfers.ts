import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import {
    createTransfer,
    deleteTransfer,
    getTransfer,
    getTransfers,
    updateTransfer,
} from "@/api/transfers"
import type { TransferFilters, TransferUpdate } from "@/types/transfer"

const TRANSFERS_KEY = ["transfers"]

export function useTransfers(filters?: TransferFilters) {
    return useQuery({
        queryKey: [...TRANSFERS_KEY, filters],
        queryFn: () => getTransfers(filters),
    })
}

export function useTransfer(id: number | undefined) {
    return useQuery({
        queryKey: [...TRANSFERS_KEY, id],
        queryFn: () => getTransfer(id!),
        enabled: id != null,
    })
}

function useInvalidateAll() {
    const queryClient = useQueryClient()
    return () => {
        queryClient.invalidateQueries({ queryKey: TRANSFERS_KEY })
        queryClient.invalidateQueries({ queryKey: ["accounts"] })
        queryClient.invalidateQueries({ queryKey: ["dashboard"] })
    }
}

export function useCreateTransfer() {
    const invalidateAll = useInvalidateAll()
    return useMutation({
        mutationFn: createTransfer,
        onSuccess: invalidateAll,
    })
}

export function useUpdateTransfer() {
    const invalidateAll = useInvalidateAll()
    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: TransferUpdate }) =>
            updateTransfer(id, data),
        onSuccess: invalidateAll,
    })
}

export function useDeleteTransfer() {
    const invalidateAll = useInvalidateAll()
    return useMutation({
        mutationFn: deleteTransfer,
        onSuccess: invalidateAll,
    })
}
