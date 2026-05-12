import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import {
    createEmployee,
    deleteEmployee,
    getDueEmployees,
    getEmployee,
    getEmployees,
    payEmployee,
    payEmployeesBulk,
    updateEmployee,
} from "@/api/employees"
import type { BulkPayPayload, EmployeeUpdate, PayEmployeePayload } from "@/types/employee"

const EMPLOYEES_KEY = ["employees"]

export function useEmployees(params?: { is_active?: boolean; search?: string }) {
    return useQuery({
        queryKey: [...EMPLOYEES_KEY, params],
        queryFn: () => getEmployees(params),
    })
}

export function useEmployee(id: number | undefined) {
    return useQuery({
        queryKey: [...EMPLOYEES_KEY, id],
        queryFn: () => getEmployee(id!),
        enabled: id !== undefined,
    })
}

export function useCreateEmployee() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: createEmployee,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: EMPLOYEES_KEY })
        },
    })
}

export function useUpdateEmployee() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: EmployeeUpdate }) =>
            updateEmployee(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: EMPLOYEES_KEY })
        },
    })
}

export function useDeleteEmployee() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: deleteEmployee,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: EMPLOYEES_KEY })
        },
    })
}

export function useDueEmployees() {
    return useQuery({
        queryKey: [...EMPLOYEES_KEY, "due"],
        queryFn: getDueEmployees,
    })
}

function invalidatePayroll(queryClient: ReturnType<typeof useQueryClient>) {
    queryClient.invalidateQueries({ queryKey: EMPLOYEES_KEY })
    queryClient.invalidateQueries({ queryKey: ["transactions"] })
    queryClient.invalidateQueries({ queryKey: ["accounts"] })
}

export function usePayEmployee() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ id, payload }: { id: number; payload: PayEmployeePayload }) =>
            payEmployee(id, payload),
        onSuccess: () => invalidatePayroll(queryClient),
    })
}

export function usePayEmployeesBulk() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (payload: BulkPayPayload) => payEmployeesBulk(payload),
        onSuccess: () => invalidatePayroll(queryClient),
    })
}
