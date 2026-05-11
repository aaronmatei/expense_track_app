import { Check } from "lucide-react"
import { useEffect, useRef, useState, type FormEvent } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useChangePassword } from "@/hooks/use-me"
import { getErrorMessage } from "@/lib/errors"

export function SecurityForm() {
    const changePassword = useChangePassword()
    const [currentPassword, setCurrentPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [saved, setSaved] = useState(false)
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    useEffect(() => {
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current)
        }
    }, [])

    const tooShort = newPassword.length > 0 && newPassword.length < 8
    const mismatch = confirmPassword.length > 0 && newPassword !== confirmPassword
    const canSubmit =
        currentPassword.length > 0 &&
        newPassword.length >= 8 &&
        newPassword === confirmPassword

    function handleSubmit(e: FormEvent) {
        e.preventDefault()
        if (!canSubmit) return
        changePassword.mutate(
            { current_password: currentPassword, new_password: newPassword },
            {
                onSuccess: () => {
                    setCurrentPassword("")
                    setNewPassword("")
                    setConfirmPassword("")
                    setSaved(true)
                    timerRef.current = setTimeout(() => setSaved(false), 2000)
                },
            },
        )
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="current_password">Current password</Label>
                <Input
                    id="current_password"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="new_password">New password</Label>
                <Input
                    id="new_password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    autoComplete="new-password"
                    required
                />
                {tooShort && (
                    <p className="text-xs text-rose-600">
                        Password must be at least 8 characters.
                    </p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="confirm_password">Confirm new password</Label>
                <Input
                    id="confirm_password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    autoComplete="new-password"
                    required
                />
                {mismatch && (
                    <p className="text-xs text-rose-600">Passwords do not match.</p>
                )}
            </div>

            {changePassword.isError && (
                <p className="text-sm text-rose-600">
                    {getErrorMessage(changePassword.error)}
                </p>
            )}

            <div className="flex items-center gap-3 pt-2">
                <Button type="submit" disabled={changePassword.isPending || !canSubmit}>
                    {changePassword.isPending ? "Saving…" : "Update password"}
                </Button>
                {saved && (
                    <span className="flex items-center gap-1 text-sm text-emerald-600">
                        <Check className="h-4 w-4" />
                        Saved
                    </span>
                )}
            </div>
        </form>
    )
}
