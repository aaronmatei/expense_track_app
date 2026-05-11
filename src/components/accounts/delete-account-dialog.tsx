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
import { useDeleteAccount } from "@/hooks/use-accounts"
import type { Account } from "@/types/account"

interface DeleteAccountDialogProps {
    account: Account | null
    onClose: () => void
}

export function DeleteAccountDialog({
    account,
    onClose,
}: DeleteAccountDialogProps) {
    const deleteMutation = useDeleteAccount()

    function handleDelete() {
        if (!account) return
        deleteMutation.mutate(account.id, { onSuccess: () => onClose() })
    }

    return (
        <AlertDialog open={!!account} onOpenChange={(open) => !open && onClose()}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete account?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This permanently deletes <strong>{account?.name}</strong> and
                        removes it from your total balance.
                    </AlertDialogDescription>
                </AlertDialogHeader>
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