import { AccountForm } from "@/components/accounts/account-form"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { useCreateAccount, useUpdateAccount } from "@/hooks/use-accounts"
import { getErrorMessage } from "@/lib/errors"
import type { Account, AccountCreate } from "@/types/account"

interface AccountDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    account?: Account
}

export function AccountDialog({
    open,
    onOpenChange,
    account,
}: AccountDialogProps) {
    const createMutation = useCreateAccount()
    const updateMutation = useUpdateAccount()
    const mutation = account ? updateMutation : createMutation

    function handleSubmit(data: AccountCreate) {
        if (account) {
            updateMutation.mutate(
                { id: account.id, data },
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
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{account ? "Edit account" : "New account"}</DialogTitle>
                    <DialogDescription>
                        {account
                            ? "Update the details of this account"
                            : "Add a bank account, credit card, or other financial account"}
                    </DialogDescription>
                </DialogHeader>
                <AccountForm
                    account={account}
                    onSubmit={handleSubmit}
                    onCancel={() => onOpenChange(false)}
                    isSubmitting={mutation.isPending}
                    error={mutation.isError ? getErrorMessage(mutation.error) : undefined}
                />
            </DialogContent>
        </Dialog>
    )
}