import { useEffect, useState, type FormEvent } from "react"

import {
    getDefaultPayDayConfig,
    PayDayConfigInput,
} from "@/components/employees/pay-day-config-input"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useAccounts } from "@/hooks/use-accounts"
import { useCategories } from "@/hooks/use-categories"
import type {
    Employee,
    EmployeeCreate,
    EmploymentType,
    Gender,
    PayDayConfig,
    PayFrequency,
} from "@/types/employee"

function RequiredMark() {
    return <span className="ml-0.5 text-red-500">*</span>
}

const EMPLOYMENT_TYPES: { value: EmploymentType; label: string }[] = [
    { value: "permanent", label: "Permanent" },
    { value: "contract", label: "Contract" },
    { value: "casual", label: "Casual" },
    { value: "intern", label: "Intern" },
]

const PAY_FREQUENCIES: { value: PayFrequency; label: string }[] = [
    { value: "monthly", label: "Monthly" },
    { value: "semi_monthly", label: "Semi-monthly" },
    { value: "weekly", label: "Weekly" },
    { value: "biweekly", label: "Bi-weekly" },
]

const GENDERS: { value: Gender; label: string }[] = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other" },
]

interface EmployeeFormProps {
    employee?: Employee
    onSubmit: (data: EmployeeCreate) => void
    onCancel: () => void
    isSubmitting?: boolean
    errorMessage?: string
}

export function EmployeeForm({
    employee,
    onSubmit,
    onCancel,
    isSubmitting,
    errorMessage,
}: EmployeeFormProps) {
    const accounts = useAccounts()
    const categories = useCategories()
    const expenseCategories = categories.data?.filter((c) => c.type === "expense") ?? []

    // Identity
    const [firstName, setFirstName] = useState(employee?.first_name ?? "")
    const [lastName, setLastName] = useState(employee?.last_name ?? "")
    const [dateOfBirth, setDateOfBirth] = useState(employee?.date_of_birth ?? "")
    const [nationalId, setNationalId] = useState(employee?.national_id ?? "")
    const [gender, setGender] = useState<Gender | "">(employee?.gender ?? "")

    // Contact
    const [email, setEmail] = useState(employee?.email ?? "")
    const [phone, setPhone] = useState(employee?.phone ?? "")
    const [address, setAddress] = useState(employee?.address ?? "")
    const [emergencyName, setEmergencyName] = useState(
        employee?.emergency_contact_name ?? "",
    )
    const [emergencyPhone, setEmergencyPhone] = useState(
        employee?.emergency_contact_phone ?? "",
    )

    // Employment
    const [position, setPosition] = useState(employee?.position ?? "")
    const [employmentType, setEmploymentType] = useState<EmploymentType>(
        employee?.employment_type ?? "permanent",
    )
    const [startDate, setStartDate] = useState(employee?.start_date ?? "")
    const [isActive, setIsActive] = useState(employee?.is_active ?? true)
    const [notes, setNotes] = useState(employee?.notes ?? "")

    // Banking
    const [bankName, setBankName] = useState(employee?.bank_name ?? "")
    const [bankAccountNumber, setBankAccountNumber] = useState(
        employee?.bank_account_number ?? "",
    )
    const [bankBranch, setBankBranch] = useState(employee?.bank_branch ?? "")
    const [kraPin, setKraPin] = useState(employee?.kra_pin ?? "")
    const [nhifNumber, setNhifNumber] = useState(employee?.nhif_number ?? "")
    const [nssfNumber, setNssfNumber] = useState(employee?.nssf_number ?? "")

    // Payroll
    const [payAmount, setPayAmount] = useState(employee?.pay_amount ?? "")
    const [payFrequency, setPayFrequency] = useState<PayFrequency>(
        employee?.pay_frequency ?? "monthly",
    )
    const [payDayConfig, setPayDayConfig] = useState<PayDayConfig>(
        employee?.pay_day_config ?? getDefaultPayDayConfig("monthly"),
    )
    const [defaultAccountId, setDefaultAccountId] = useState<string>(
        employee?.default_account_id != null
            ? String(employee.default_account_id)
            : "",
    )
    const [defaultCategoryId, setDefaultCategoryId] = useState<string>(
        employee?.default_category_id != null
            ? String(employee.default_category_id)
            : "",
    )

    useEffect(() => {
        if (!employee) return
        setFirstName(employee.first_name)
        setLastName(employee.last_name)
        setDateOfBirth(employee.date_of_birth ?? "")
        setNationalId(employee.national_id ?? "")
        setGender(employee.gender ?? "")
        setEmail(employee.email ?? "")
        setPhone(employee.phone ?? "")
        setAddress(employee.address ?? "")
        setEmergencyName(employee.emergency_contact_name ?? "")
        setEmergencyPhone(employee.emergency_contact_phone ?? "")
        setPosition(employee.position ?? "")
        setEmploymentType(employee.employment_type)
        setStartDate(employee.start_date)
        setIsActive(employee.is_active)
        setNotes(employee.notes ?? "")
        setBankName(employee.bank_name ?? "")
        setBankAccountNumber(employee.bank_account_number ?? "")
        setBankBranch(employee.bank_branch ?? "")
        setKraPin(employee.kra_pin ?? "")
        setNhifNumber(employee.nhif_number ?? "")
        setNssfNumber(employee.nssf_number ?? "")
        setPayAmount(employee.pay_amount)
        setPayFrequency(employee.pay_frequency)
        setPayDayConfig(employee.pay_day_config)
        setDefaultAccountId(
            employee.default_account_id != null
                ? String(employee.default_account_id)
                : "",
        )
        setDefaultCategoryId(
            employee.default_category_id != null
                ? String(employee.default_category_id)
                : "",
        )
    }, [employee])

    function handleFrequencyChange(freq: PayFrequency) {
        setPayFrequency(freq)
        setPayDayConfig(getDefaultPayDayConfig(freq))
    }

    function handleSubmit(e: FormEvent) {
        e.preventDefault()
        onSubmit({
            first_name: firstName.trim(),
            last_name: lastName.trim(),
            date_of_birth: dateOfBirth || null,
            national_id: nationalId.trim() || null,
            gender: (gender as Gender) || null,
            email: email.trim() || null,
            phone: phone.trim() || null,
            address: address.trim() || null,
            emergency_contact_name: emergencyName.trim() || null,
            emergency_contact_phone: emergencyPhone.trim() || null,
            position: position.trim() || null,
            employment_type: employmentType,
            start_date: startDate,
            is_active: isActive,
            notes: notes.trim() || null,
            bank_name: bankName.trim() || null,
            bank_account_number: bankAccountNumber.trim() || null,
            bank_branch: bankBranch.trim() || null,
            kra_pin: kraPin.trim() || null,
            nhif_number: nhifNumber.trim() || null,
            nssf_number: nssfNumber.trim() || null,
            pay_amount: payAmount,
            pay_frequency: payFrequency,
            pay_day_config: payDayConfig,
            default_account_id: defaultAccountId
                ? parseInt(defaultAccountId, 10)
                : null,
            default_category_id: defaultCategoryId
                ? parseInt(defaultCategoryId, 10)
                : null,
        })
    }

    const canSubmit =
        firstName.trim() &&
        lastName.trim() &&
        startDate &&
        payAmount &&
        payFrequency &&
        payDayConfig

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Tabs defaultValue="identity" className="w-full">
                <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="identity">Identity</TabsTrigger>
                    <TabsTrigger value="contact">Contact</TabsTrigger>
                    <TabsTrigger value="employment">Employment</TabsTrigger>
                    <TabsTrigger value="banking">Banking</TabsTrigger>
                    <TabsTrigger value="payroll">Payroll</TabsTrigger>
                </TabsList>

                {/* Identity */}
                <TabsContent value="identity" className="mt-4 space-y-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="first_name">
                                First name
                                <RequiredMark />
                            </Label>
                            <Input
                                id="first_name"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                placeholder="Brian"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="last_name">
                                Last name
                                <RequiredMark />
                            </Label>
                            <Input
                                id="last_name"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                placeholder="Kamau"
                                required
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="date_of_birth">Date of birth</Label>
                            <Input
                                id="date_of_birth"
                                type="date"
                                value={dateOfBirth}
                                onChange={(e) => setDateOfBirth(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="national_id">National ID</Label>
                            <Input
                                id="national_id"
                                value={nationalId}
                                onChange={(e) => setNationalId(e.target.value)}
                                placeholder="12345678"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="gender">Gender</Label>
                        <Select
                            value={gender}
                            onValueChange={(v) => setGender(v as Gender)}
                        >
                            <SelectTrigger id="gender">
                                <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                            <SelectContent>
                                {GENDERS.map((g) => (
                                    <SelectItem key={g.value} value={g.value}>
                                        {g.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </TabsContent>

                {/* Contact */}
                <TabsContent value="contact" className="mt-4 space-y-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="brian@example.com"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone</Label>
                            <Input
                                id="phone"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="+254 700 000000"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <Textarea
                            id="address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="123 Moi Avenue, Nairobi"
                            rows={2}
                        />
                    </div>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="emergency_name">
                                Emergency contact name
                            </Label>
                            <Input
                                id="emergency_name"
                                value={emergencyName}
                                onChange={(e) => setEmergencyName(e.target.value)}
                                placeholder="Jane Kamau"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="emergency_phone">
                                Emergency contact phone
                            </Label>
                            <Input
                                id="emergency_phone"
                                value={emergencyPhone}
                                onChange={(e) =>
                                    setEmergencyPhone(e.target.value)
                                }
                                placeholder="+254 700 000000"
                            />
                        </div>
                    </div>
                </TabsContent>

                {/* Employment */}
                <TabsContent value="employment" className="mt-4 space-y-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="position">Position</Label>
                            <Input
                                id="position"
                                value={position}
                                onChange={(e) => setPosition(e.target.value)}
                                placeholder="Software Engineer"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="employment_type">
                                Employment type
                            </Label>
                            <Select
                                value={employmentType}
                                onValueChange={(v) =>
                                    setEmploymentType(v as EmploymentType)
                                }
                            >
                                <SelectTrigger id="employment_type">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {EMPLOYMENT_TYPES.map((t) => (
                                        <SelectItem
                                            key={t.value}
                                            value={t.value}
                                        >
                                            {t.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="start_date">
                            Start date
                            <RequiredMark />
                        </Label>
                        <Input
                            id="start_date"
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            required
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <Switch
                            id="is_active"
                            checked={isActive}
                            onCheckedChange={setIsActive}
                        />
                        <Label htmlFor="is_active" className="cursor-pointer">
                            Active
                        </Label>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="notes">Notes</Label>
                        <Textarea
                            id="notes"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Any additional notes"
                            rows={3}
                        />
                    </div>
                </TabsContent>

                {/* Banking */}
                <TabsContent value="banking" className="mt-4 space-y-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="bank_name">Bank name</Label>
                            <Input
                                id="bank_name"
                                value={bankName}
                                onChange={(e) => setBankName(e.target.value)}
                                placeholder="Equity Bank"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="bank_branch">Bank branch</Label>
                            <Input
                                id="bank_branch"
                                value={bankBranch}
                                onChange={(e) => setBankBranch(e.target.value)}
                                placeholder="Westlands"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="bank_account_number">
                            Bank account number
                        </Label>
                        <Input
                            id="bank_account_number"
                            value={bankAccountNumber}
                            onChange={(e) =>
                                setBankAccountNumber(e.target.value)
                            }
                            placeholder="0123456789"
                        />
                    </div>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div className="space-y-2">
                            <Label htmlFor="kra_pin">KRA PIN</Label>
                            <Input
                                id="kra_pin"
                                value={kraPin}
                                onChange={(e) => setKraPin(e.target.value)}
                                placeholder="A012345678B"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="nhif_number">NHIF number</Label>
                            <Input
                                id="nhif_number"
                                value={nhifNumber}
                                onChange={(e) => setNhifNumber(e.target.value)}
                                placeholder="12345678"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="nssf_number">NSSF number</Label>
                            <Input
                                id="nssf_number"
                                value={nssfNumber}
                                onChange={(e) => setNssfNumber(e.target.value)}
                                placeholder="12345678"
                            />
                        </div>
                    </div>
                </TabsContent>

                {/* Payroll */}
                <TabsContent value="payroll" className="mt-4 space-y-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="pay_amount">
                                Pay amount
                                <RequiredMark />
                            </Label>
                            <div className="flex items-center">
                                <span className="flex h-9 items-center rounded-l-md border border-r-0 border-slate-200 bg-slate-50 px-3 text-sm text-slate-500">
                                    KES
                                </span>
                                <Input
                                    id="pay_amount"
                                    type="number"
                                    min={0}
                                    step="0.01"
                                    value={payAmount}
                                    onChange={(e) =>
                                        setPayAmount(e.target.value)
                                    }
                                    placeholder="50000.00"
                                    className="rounded-l-none"
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="pay_frequency">
                                Pay frequency
                                <RequiredMark />
                            </Label>
                            <Select
                                value={payFrequency}
                                onValueChange={(v) =>
                                    handleFrequencyChange(v as PayFrequency)
                                }
                            >
                                <SelectTrigger id="pay_frequency">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {PAY_FREQUENCIES.map((f) => (
                                        <SelectItem
                                            key={f.value}
                                            value={f.value}
                                        >
                                            {f.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <PayDayConfigInput
                        frequency={payFrequency}
                        value={payDayConfig}
                        onChange={setPayDayConfig}
                    />

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="default_account">
                                Default account
                            </Label>
                            <Select
                                value={defaultAccountId}
                                onValueChange={setDefaultAccountId}
                            >
                                <SelectTrigger id="default_account">
                                    <SelectValue placeholder="Select account" />
                                </SelectTrigger>
                                <SelectContent>
                                    {accounts.data?.map((a) => (
                                        <SelectItem
                                            key={a.id}
                                            value={String(a.id)}
                                        >
                                            {a.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="default_category">
                                Default category
                            </Label>
                            <Select
                                value={defaultCategoryId}
                                onValueChange={setDefaultCategoryId}
                            >
                                <SelectTrigger id="default_category">
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {expenseCategories.map((c) => (
                                        <SelectItem
                                            key={c.id}
                                            value={String(c.id)}
                                        >
                                            {c.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>

            {errorMessage && (
                <p className="text-sm text-red-600">{errorMessage}</p>
            )}

            <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={onCancel}>
                    Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting || !canSubmit}>
                    {isSubmitting
                        ? "Saving…"
                        : employee
                          ? "Update"
                          : "Create"}
                </Button>
            </div>
        </form>
    )
}
