import { apiClient } from "@/lib/api-client"
import type {
    BulkPayPayload,
    BulkPayResponse,
    Employee,
    EmployeeCreate,
    EmployeeUpdate,
    PayEmployeePayload,
} from "@/types/employee"
import type { Transaction } from "@/types/transaction"

export async function getEmployees(params?: {
    is_active?: boolean
    search?: string
}): Promise<Employee[]> {
    const { data } = await apiClient.get<Employee[]>("/employees", { params })
    return data
}

export async function getEmployee(id: number): Promise<Employee> {
    const { data } = await apiClient.get<Employee>(`/employees/${id}`)
    return data
}

export async function createEmployee(
    payload: EmployeeCreate,
): Promise<Employee> {
    const { data } = await apiClient.post<Employee>("/employees", payload)
    return data
}

export async function updateEmployee(
    id: number,
    payload: EmployeeUpdate,
): Promise<Employee> {
    const { data } = await apiClient.patch<Employee>(
        `/employees/${id}`,
        payload,
    )
    return data
}

export async function deleteEmployee(id: number): Promise<void> {
    await apiClient.delete(`/employees/${id}`)
}

export async function getDueEmployees(): Promise<Employee[]> {
    const { data } = await apiClient.get<Employee[]>("/employees/due")
    return data
}

export async function payEmployee(
    id: number,
    payload: PayEmployeePayload,
): Promise<Transaction> {
    const { data } = await apiClient.post<Transaction>(
        `/employees/${id}/pay`,
        payload,
    )
    return data
}

export async function payEmployeesBulk(
    payload: BulkPayPayload,
): Promise<BulkPayResponse> {
    const { data } = await apiClient.post<BulkPayResponse>(
        "/employees/pay-bulk",
        payload,
    )
    return data
}
