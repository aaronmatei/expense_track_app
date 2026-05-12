import { EmployeeForm } from "@/components/employees/employee-form"
import type { EmployeeFormValues } from "@/components/employees/employee-schema"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { useCreateEmployee, useUpdateEmployee } from "@/hooks/use-employees"
import { getErrorMessage } from "@/lib/errors"
import type { Employee, EmployeeCreate, PayDayConfig } from "@/types/employee"

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

    function handleSubmit(values: EmployeeFormValues) {
        const payload: EmployeeCreate = {
            first_name: values.first_name.trim(),
            last_name: values.last_name.trim(),
            date_of_birth: values.date_of_birth || null,
            national_id: values.national_id.trim() || null,
            gender: (values.gender as EmployeeCreate["gender"]) || null,
            email: values.email.trim() || null,
            phone: values.phone.trim() || null,
            address: values.address.trim() || null,
            emergency_contact_name: values.emergency_contact_name.trim() || null,
            emergency_contact_phone: values.emergency_contact_phone.trim() || null,
            position: values.position.trim() || null,
            employment_type: values.employment_type,
            start_date: values.start_date,
            is_active: values.is_active,
            notes: values.notes.trim() || null,
            bank_name: values.bank_name.trim() || null,
            bank_account_number: values.bank_account_number.trim() || null,
            bank_branch: values.bank_branch.trim() || null,
            kra_pin: values.kra_pin.trim() || null,
            nhif_number: values.nhif_number.trim() || null,
            nssf_number: values.nssf_number.trim() || null,
            pay_amount: values.pay_amount.trim() || null,
            pay_frequency: values.pay_frequency,
            pay_day_config: values.pay_day_config as PayDayConfig,
            default_account_id: values.default_account_id
                ? parseInt(values.default_account_id, 10)
                : null,
            default_category_id: values.default_category_id
                ? parseInt(values.default_category_id, 10)
                : null,
        }

        if (employee) {
            updateMutation.mutate(
                { id: employee.id, data: payload },
                { onSuccess: () => onOpenChange(false) },
            )
        } else {
            createMutation.mutate(payload, {
                onSuccess: () => onOpenChange(false),
            })
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto overflow-x-hidden p-0">
                <DialogHeader className="border-b border-slate-200 dark:border-slate-700 bg-slate-50/60 px-8 py-5">
                    <DialogTitle>
                        {employee ? `Edit ${employee.full_name}` : "Add employee"}
                    </DialogTitle>
                    <DialogDescription>
                        {employee
                            ? "Update this employee's information."
                            : "Add a new employee to your payroll"}
                    </DialogDescription>
                </DialogHeader>
                <EmployeeForm
                    initialValues={employee}
                    onSubmit={handleSubmit}
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
