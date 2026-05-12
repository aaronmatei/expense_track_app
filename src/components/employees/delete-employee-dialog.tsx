import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useDeleteEmployee } from "@/hooks/use-employees"
import { getErrorMessage } from "@/lib/errors"
import type { Employee } from "@/types/employee"

interface DeleteEmployeeDialogProps {
    employee: Employee | null
    onClose: () => void
}

export function DeleteEmployeeDialog({
    employee,
    onClose,
}: DeleteEmployeeDialogProps) {
    const deleteMutation = useDeleteEmployee()

    function handleDelete() {
        if (!employee) return
        deleteMutation.mutate(employee.id, { onSuccess: () => onClose() })
    }

    return (
        <AlertDialog open={!!employee} onOpenChange={(open) => !open && onClose()}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete employee?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This cannot be undone. If this employee has transactions,
                        you'll need to deactivate them instead by editing the
                        employee and unchecking{" "}
                        <strong>Active</strong>.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                {deleteMutation.isError && (
                    <p className="text-sm text-rose-600">
                        {getErrorMessage(deleteMutation.error)}
                    </p>
                )}
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDelete}
                        disabled={deleteMutation.isPending}
                        className="bg-red-600 hover:bg-red-700"
                    >
                        {deleteMutation.isPending ? "Deleting…" : "Delete"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
