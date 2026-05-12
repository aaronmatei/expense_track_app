import { EmployeeForm } from "@/components/employees/employee-form"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { useCreateEmployee, useUpdateEmployee } from "@/hooks/use-employees"
import { getErrorMessage } from "@/lib/errors"
import type { Employee, EmployeeCreate } from "@/types/employee"

interface EmployeeDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    employee?: Employee
}

export function EmployeeDialog({
    open,
    onOpenChange,
    employee,
}: EmployeeDialogProps) {
    const createMutation = useCreateEmployee()
    const updateMutation = useUpdateEmployee()
    const mutation = employee ? updateMutation : createMutation

    function handleSubmit(data: EmployeeCreate) {
        if (employee) {
            updateMutation.mutate(
                { id: employee.id, data },
                { onSuccess: () => onOpenChange(false) },
            )
        } else {
            createMutation.mutate(data, {
                onSuccess: () => onOpenChange(false),
            })
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {employee ? `Edit ${employee.full_name}` : "Add employee"}
                    </DialogTitle>
                    <DialogDescription>
                        {employee
                            ? "Update the employee's details"
                            : "Add a new employee to your payroll"}
                    </DialogDescription>
                </DialogHeader>
                <EmployeeForm
                    employee={employee}
                    onSubmit={handleSubmit}
                    onCancel={() => onOpenChange(false)}
                    isSubmitting={mutation.isPending}
                    errorMessage={
                        mutation.isError
                            ? getErrorMessage(mutation.error)
                            : undefined
                    }
                />
            </DialogContent>
        </Dialog>
    )
}
