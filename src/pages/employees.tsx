import { Plus, Search } from "lucide-react"
import { useEffect, useState } from "react"

import { DeleteEmployeeDialog } from "@/components/employees/delete-employee-dialog"
import { DuePaymentsSection } from "@/components/employees/due-payments-section"
import { EmployeeDetailDrawer } from "@/components/employees/employee-detail-drawer"
import { EmployeeDialog } from "@/components/employees/employee-dialog"
import { EmployeeRow } from "@/components/employees/employee-row"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useEmployees } from "@/hooks/use-employees"
import type { Employee } from "@/types/employee"

function useDebounced<T>(value: T, delay: number): T {
    const [debounced, setDebounced] = useState(value)
    useEffect(() => {
        const id = setTimeout(() => setDebounced(value), delay)
        return () => clearTimeout(id)
    }, [value, delay])
    return debounced
}

type StatusFilter = "all" | "active" | "inactive"

export function EmployeesPage() {
    const [search, setSearch] = useState("")
    const [statusFilter, setStatusFilter] = useState<StatusFilter>("all")
    const debouncedSearch = useDebounced(search, 300)

    const [dialogOpen, setDialogOpen] = useState(false)
    const [editing, setEditing] = useState<Employee | undefined>(undefined)
    const [deleting, setDeleting] = useState<Employee | null>(null)
    const [drawerEmployee, setDrawerEmployee] = useState<Employee | undefined>(
        undefined,
    )
    const [drawerOpen, setDrawerOpen] = useState(false)

    const queryParams = {
        search: debouncedSearch || undefined,
        is_active:
            statusFilter === "active"
                ? true
                : statusFilter === "inactive"
                  ? false
                  : undefined,
    }

    const employees = useEmployees(queryParams)

    function handleCreate() {
        setEditing(undefined)
        setDialogOpen(true)
    }

    function handleEdit(employee: Employee) {
        setEditing(employee)
        setDialogOpen(true)
    }

    function handleDialogChange(open: boolean) {
        setDialogOpen(open)
        if (!open) setEditing(undefined)
    }

    function handleSelect(employee: Employee) {
        setDrawerEmployee(employee)
        setDrawerOpen(true)
    }

    return (
        <div className="space-y-6 pb-16">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Employees
                    </h1>
                    <p className="mt-1 text-sm text-slate-600">
                        Manage your employees and payroll
                    </p>
                </div>
                <Button onClick={handleCreate}>
                    <Plus className="mr-2 h-4 w-4" /> Add employee
                </Button>
            </div>

            {/* Filters */}
            <div className="flex gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                        placeholder="Search employees…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9"
                    />
                </div>
                <Select
                    value={statusFilter}
                    onValueChange={(v) => setStatusFilter(v as StatusFilter)}
                >
                    <SelectTrigger className="w-36">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <DuePaymentsSection variant="page" />

            {/* List */}
            {employees.isLoading && (
                <p className="text-sm text-slate-600">Loading…</p>
            )}
            {employees.error && (
                <p className="text-sm text-red-600">Failed to load employees</p>
            )}

            {employees.data && employees.data.length === 0 && (
                <div className="rounded-lg border">
                    <div className="flex flex-col items-center gap-3 py-16">
                        <p className="text-sm text-slate-600">
                            {search || statusFilter !== "all"
                                ? "No employees match your filters"
                                : "No employees yet. Add your first to get started."}
                        </p>
                        {!search && statusFilter === "all" && (
                            <Button onClick={handleCreate} variant="outline">
                                <Plus className="mr-2 h-4 w-4" /> Add your first employee
                            </Button>
                        )}
                    </div>
                </div>
            )}

            {employees.data && employees.data.length > 0 && (
                <div className="rounded-lg border">
                    {employees.data.map((employee) => (
                        <EmployeeRow
                            key={employee.id}
                            employee={employee}
                            onEdit={handleEdit}
                            onDelete={setDeleting}
                            onSelect={handleSelect}
                        />
                    ))}
                </div>
            )}

            <EmployeeDialog
                open={dialogOpen}
                onOpenChange={handleDialogChange}
                employee={editing}
            />

            <DeleteEmployeeDialog
                employee={deleting}
                onClose={() => setDeleting(null)}
            />

            <EmployeeDetailDrawer
                employee={drawerEmployee}
                open={drawerOpen}
                onOpenChange={(open) => {
                    setDrawerOpen(open)
                    if (!open) setDrawerEmployee(undefined)
                }}
            />
        </div>
    )
}
