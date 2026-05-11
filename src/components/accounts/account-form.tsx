import { useEffect, useState, type FormEvent } from "react"

import { ACCOUNT_TYPE_META } from "@/components/accounts/account-type-info"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import type {
    Account,
    AccountCreate,
    AccountType,
} from "@/types/account"

const ACCOUNT_TYPES: AccountType[] = [
    "checking",
    "savings",
    "credit_card",
    "investment",
    "cash",
    "loan",
    "other",
]

interface AccountFormProps {
    account?: Account
    onSubmit: (data: AccountCreate) => void
    onCancel: () => void
    isSubmitting?: boolean
    error?: string
}

export function AccountForm({
    account,
    onSubmit,
    onCancel,
    isSubmitting,
    error,
}: AccountFormProps) {
    const [name, setName] = useState(account?.name ?? "")
    const [accountType, setAccountType] = useState<AccountType>(
        account?.account_type ?? "checking",
    )
    const [institution, setInstitution] = useState(account?.institution ?? "")
    const [balance, setBalance] = useState(account?.current_balance ?? "0")
    const [currency, setCurrency] = useState(account?.currency ?? "USD")
    const [description, setDescription] = useState(account?.description ?? "")
    const [includeInTotal, setIncludeInTotal] = useState(
        account?.include_in_total ?? true,
    )

    useEffect(() => {
        setName(account?.name ?? "")
        setAccountType(account?.account_type ?? "checking")
        setInstitution(account?.institution ?? "")
        setBalance(account?.current_balance ?? "0")
        setCurrency(account?.currency ?? "USD")
        setDescription(account?.description ?? "")
        setIncludeInTotal(account?.include_in_total ?? true)
    }, [account])

    function handleSubmit(e: FormEvent) {
        e.preventDefault()
        onSubmit({
            name: name.trim(),
            account_type: accountType,
            institution: institution.trim() || null,
            current_balance: balance || "0",
            currency: currency.trim().toUpperCase() || "USD",
            description: description.trim() || null,
            include_in_total: includeInTotal,
        })
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="name">Account name</Label>
                <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Chase Checking"
                    required
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="account_type">Type</Label>
                <Select
                    value={accountType}
                    onValueChange={(v) => setAccountType(v as AccountType)}
                >
                    <SelectTrigger id="account_type">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {ACCOUNT_TYPES.map((t) => (
                            <SelectItem key={t} value={t}>
                                {ACCOUNT_TYPE_META[t].label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <Label htmlFor="institution">Institution (optional)</Label>
                <Input
                    id="institution"
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    placeholder="Chase, Bank of America, etc."
                />
            </div>

            <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2 space-y-2">
                    <Label htmlFor="balance">
                        {account ? "Current balance" : "Starting balance"}
                    </Label>
                    <Input
                        id="balance"
                        type="number"
                        step="0.01"
                        value={balance}
                        onChange={(e) => setBalance(e.target.value)}
                        placeholder="0.00"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Input
                        id="currency"
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value.toUpperCase())}
                        placeholder="USD"
                        maxLength={3}
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="description">Description (optional)</Label>
                <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Notes about this account"
                    rows={2}
                />
            </div>

            <div className="flex items-center gap-2">
                <Checkbox
                    id="include_in_total"
                    checked={includeInTotal}
                    onCheckedChange={(checked) => setIncludeInTotal(checked === true)}
                />
                <Label htmlFor="include_in_total" className="cursor-pointer">
                    Include in total balance
                </Label>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={onCancel}>
                    Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting || !name.trim()}>
                    {isSubmitting ? "Saving…" : account ? "Update" : "Create"}
                </Button>
            </div>
        </form>
    )
}