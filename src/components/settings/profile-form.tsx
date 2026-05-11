import { Check } from "lucide-react"
import { useEffect, useRef, useState, type FormEvent } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useMe, useUpdateMe } from "@/hooks/use-me"
import { getErrorMessage } from "@/lib/errors"

export function ProfileForm() {
    const me = useMe()
    const updateMe = useUpdateMe()
    const [fullName, setFullName] = useState("")
    const [phoneNumber, setPhoneNumber] = useState("")
    const [idNumber, setIdNumber] = useState("")
    const [address, setAddress] = useState("")
    const [saved, setSaved] = useState(false)
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    useEffect(() => {
        if (me.data) {
            setFullName(me.data.full_name ?? "")
            setPhoneNumber(me.data.phone_number ?? "")
            setIdNumber(me.data.id_number ?? "")
            setAddress(me.data.address ?? "")
        }
    }, [me.data])

    useEffect(() => {
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current)
        }
    }, [])

    function handleSubmit(e: FormEvent) {
        e.preventDefault()
        updateMe.mutate(
            {
                full_name: fullName.trim() || null,
                phone_number: phoneNumber.trim() || null,
                id_number: idNumber.trim() || null,
                address: address.trim() || null,
            },
            {
                onSuccess: () => {
                    setSaved(true)
                    timerRef.current = setTimeout(() => setSaved(false), 2000)
                },
            },
        )
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    value={me.data?.email ?? ""}
                    disabled
                    className="bg-slate-50 text-slate-500"
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="full_name">Full name</Label>
                <Input
                    id="full_name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Jane Doe"
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="phone_number">Phone number</Label>
                <Input
                    id="phone_number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+1 555 000 0000"
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="id_number">ID number</Label>
                <Input
                    id="id_number"
                    value={idNumber}
                    onChange={(e) => setIdNumber(e.target.value)}
                    placeholder="Optional"
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="123 Main St"
                />
            </div>

            {updateMe.isError && (
                <p className="text-sm text-rose-600">
                    {getErrorMessage(updateMe.error)}
                </p>
            )}

            <div className="flex items-center gap-3 pt-2">
                <Button type="submit" disabled={updateMe.isPending}>
                    {updateMe.isPending ? "Saving…" : "Save changes"}
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
