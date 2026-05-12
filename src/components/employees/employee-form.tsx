import { useState } from "react"
import { useForm, type UseFormReturn } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import {
    getDefaultPayDayConfig,
    PayDayConfigInput,
} from "@/components/employees/pay-day-config-input"
import {
    employeeSchema,
    type EmployeeFormValues,
    STEP_FIELDS,
    STEP_LABELS,
} from "@/components/employees/employee-schema"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Stepper } from "@/components/ui/stepper"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { useAccounts } from "@/hooks/use-accounts"
import { useCategories } from "@/hooks/use-categories"
import type { Employee, PayFrequency } from "@/types/employee"

// ─── Shared style constants ───────────────────────────────────────────────────

const inputClass = "h-10 border-slate-300 focus-visible:border-indigo-500 focus-visible:ring-indigo-500/20"
const selectClass = "h-10 border-slate-300 focus:border-indigo-500 focus:ring-indigo-500/20"
const textareaClass = "min-h-[80px] border-slate-300 focus-visible:border-indigo-500 focus-visible:ring-indigo-500/20"
const labelClass = "text-sm font-medium text-slate-700"

function RequiredMark() {
    return <span className="text-rose-500">*</span>
}

function SectionHeader({ title, description }: { title: string; description?: string }) {
    return (
        <div className="mb-6">
            <h3 className="text-base font-semibold text-slate-900">{title}</h3>
            {description && (
                <p className="mt-1 text-sm text-slate-500">{description}</p>
            )}
        </div>
    )
}

function SectionDivider() {
    return <div className="my-8 border-t border-slate-200" />
}

function FieldGroup({ children }: { children: React.ReactNode }) {
    return (
        <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2">
            {children}
        </div>
    )
}

// ─── Step components ──────────────────────────────────────────────────────────

const EMPLOYMENT_TYPES = [
    { value: "permanent", label: "Permanent" },
    { value: "contract", label: "Contract" },
    { value: "casual", label: "Casual" },
    { value: "intern", label: "Intern" },
] as const

const PAY_FREQUENCIES = [
    { value: "monthly", label: "Monthly" },
    { value: "semi_monthly", label: "Semi-monthly" },
    { value: "weekly", label: "Weekly" },
    { value: "biweekly", label: "Bi-weekly" },
] as const

const GENDERS = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other" },
] as const

function IdentityStep({ form }: { form: UseFormReturn<EmployeeFormValues> }) {
    return (
        <div>
            <SectionHeader
                title="Personal information"
                description="Basic identity details for this employee."
            />
            <FieldGroup>
                <FormField
                    control={form.control}
                    name="first_name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className={labelClass}>
                                First name <RequiredMark />
                            </FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    placeholder="Brian"
                                    className={inputClass}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="last_name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className={labelClass}>
                                Last name <RequiredMark />
                            </FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    placeholder="Kamau"
                                    className={inputClass}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </FieldGroup>

            <SectionDivider />

            <SectionHeader title="Additional details" />
            <FieldGroup>
                <FormField
                    control={form.control}
                    name="date_of_birth"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className={labelClass}>Date of birth</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    type="date"
                                    className={inputClass}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="national_id"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className={labelClass}>National ID</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    placeholder="12345678"
                                    className={inputClass}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className={labelClass}>Gender</FormLabel>
                            <Select
                                onValueChange={field.onChange}
                                value={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger className={selectClass}>
                                        <SelectValue placeholder="Select gender" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {GENDERS.map((g) => (
                                        <SelectItem key={g.value} value={g.value}>
                                            {g.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </FieldGroup>
        </div>
    )
}

function ContactStep({ form }: { form: UseFormReturn<EmployeeFormValues> }) {
    return (
        <div>
            <SectionHeader
                title="Contact details"
                description="How to reach this employee."
            />
            <FieldGroup>
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className={labelClass}>Email</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    type="email"
                                    placeholder="brian@example.com"
                                    className={inputClass}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className={labelClass}>Phone</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    placeholder="+254 700 000000"
                                    className={inputClass}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                        <FormItem className="md:col-span-2">
                            <FormLabel className={labelClass}>Address</FormLabel>
                            <FormControl>
                                <Textarea
                                    {...field}
                                    placeholder="123 Moi Avenue, Nairobi"
                                    className={textareaClass}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </FieldGroup>

            <SectionDivider />

            <SectionHeader title="Emergency contact" />
            <FieldGroup>
                <FormField
                    control={form.control}
                    name="emergency_contact_name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className={labelClass}>Name</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    placeholder="Jane Kamau"
                                    className={inputClass}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="emergency_contact_phone"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className={labelClass}>Phone</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    placeholder="+254 700 000000"
                                    className={inputClass}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </FieldGroup>
        </div>
    )
}

function EmploymentStep({ form }: { form: UseFormReturn<EmployeeFormValues> }) {
    return (
        <div>
            <SectionHeader
                title="Role"
                description="Position and employment classification."
            />
            <FieldGroup>
                <FormField
                    control={form.control}
                    name="position"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className={labelClass}>Position</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    placeholder="Software Engineer"
                                    className={inputClass}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="employment_type"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className={labelClass}>Employment type</FormLabel>
                            <Select
                                onValueChange={field.onChange}
                                value={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger className={selectClass}>
                                        <SelectValue />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {EMPLOYMENT_TYPES.map((t) => (
                                        <SelectItem key={t.value} value={t.value}>
                                            {t.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </FieldGroup>

            <SectionDivider />

            <SectionHeader title="Status" />
            <FieldGroup>
                <FormField
                    control={form.control}
                    name="start_date"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className={labelClass}>
                                Start date <RequiredMark />
                            </FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    type="date"
                                    className={inputClass}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="is_active"
                    render={({ field }) => (
                        <FormItem>
                            <div className="flex items-center gap-3 pt-6">
                                <FormControl>
                                    <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                                <FormLabel className="cursor-pointer text-sm font-medium text-slate-700">
                                    Active employee
                                </FormLabel>
                            </div>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </FieldGroup>

            <SectionDivider />

            <SectionHeader title="Notes" />
            <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className={labelClass}>Notes</FormLabel>
                        <FormControl>
                            <Textarea
                                {...field}
                                placeholder="Any additional notes"
                                className={textareaClass}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    )
}

function BankingStep({ form }: { form: UseFormReturn<EmployeeFormValues> }) {
    return (
        <div>
            <SectionHeader
                title="Bank account"
                description="Payment details for salary disbursement."
            />
            <FieldGroup>
                <FormField
                    control={form.control}
                    name="bank_name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className={labelClass}>Bank name</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    placeholder="Equity Bank"
                                    className={inputClass}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="bank_branch"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className={labelClass}>Bank branch</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    placeholder="Westlands"
                                    className={inputClass}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="bank_account_number"
                    render={({ field }) => (
                        <FormItem className="md:col-span-2">
                            <FormLabel className={labelClass}>Account number</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    placeholder="0123456789"
                                    className={inputClass}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </FieldGroup>

            <SectionDivider />

            <SectionHeader
                title="Statutory"
                description="Tax and social security identifiers."
            />
            <FieldGroup>
                <FormField
                    control={form.control}
                    name="kra_pin"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className={labelClass}>KRA PIN</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    placeholder="A012345678B"
                                    className={inputClass}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="nhif_number"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className={labelClass}>NHIF number</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    placeholder="12345678"
                                    className={inputClass}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="nssf_number"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className={labelClass}>NSSF number</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    placeholder="12345678"
                                    className={inputClass}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </FieldGroup>
        </div>
    )
}

function PayrollStep({ form }: { form: UseFormReturn<EmployeeFormValues> }) {
    const accounts = useAccounts()
    const categories = useCategories()
    const expenseCategories = categories.data?.filter((c) => c.type === "expense") ?? []
    const currentFrequency = form.watch("pay_frequency")

    return (
        <div>
            <SectionHeader
                title="Pay schedule"
                description="Frequency and timing of salary payments."
            />
            <FieldGroup>
                <FormField
                    control={form.control}
                    name="pay_amount"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className={labelClass}>Typical pay amount</FormLabel>
                            <div className="flex items-center">
                                <span className="flex h-10 items-center rounded-l-md border border-r-0 border-slate-300 bg-slate-50 px-3 text-sm text-slate-500">
                                    KES
                                </span>
                                <FormControl>
                                    <Input
                                        {...field}
                                        type="number"
                                        min={0}
                                        step="0.01"
                                        placeholder="50000.00"
                                        className={`rounded-l-none ${inputClass}`}
                                    />
                                </FormControl>
                            </div>
                            <p className="text-xs text-slate-500">
                                Optional — pre-fills the amount when marking this employee as paid.
                            </p>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="pay_frequency"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className={labelClass}>
                                Pay frequency <RequiredMark />
                            </FormLabel>
                            <Select
                                onValueChange={(v) => {
                                    field.onChange(v)
                                    form.setValue(
                                        "pay_day_config",
                                        getDefaultPayDayConfig(v as PayFrequency) as Record<string, unknown>,
                                    )
                                }}
                                value={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger className={selectClass}>
                                        <SelectValue />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {PAY_FREQUENCIES.map((f) => (
                                        <SelectItem key={f.value} value={f.value}>
                                            {f.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </FieldGroup>

            <div className="mt-5">
                <FormField
                    control={form.control}
                    name="pay_day_config"
                    render={({ field }) => (
                        <FormItem>
                            <PayDayConfigInput
                                frequency={currentFrequency}
                                value={field.value as Parameters<typeof PayDayConfigInput>[0]["value"]}
                                onChange={(v) => field.onChange(v as Record<string, unknown>)}
                            />
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

            <SectionDivider />

            <SectionHeader
                title="Defaults"
                description="Pre-filled values when recording payroll transactions."
            />
            <FieldGroup>
                <FormField
                    control={form.control}
                    name="default_account_id"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className={labelClass}>Default account</FormLabel>
                            <Select
                                onValueChange={field.onChange}
                                value={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger className={selectClass}>
                                        <SelectValue placeholder="Select account" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {accounts.data?.map((a) => (
                                        <SelectItem key={a.id} value={String(a.id)}>
                                            {a.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="default_category_id"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className={labelClass}>Default category</FormLabel>
                            <Select
                                onValueChange={field.onChange}
                                value={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger className={selectClass}>
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {expenseCategories.map((c) => (
                                        <SelectItem key={c.id} value={String(c.id)}>
                                            {c.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </FieldGroup>
        </div>
    )
}

// ─── Main wizard form ─────────────────────────────────────────────────────────

interface EmployeeFormProps {
    initialValues?: Employee
    onSubmit: (data: EmployeeFormValues) => void
    isSubmitting?: boolean
    errorMessage?: string
}

export function EmployeeForm({
    initialValues,
    onSubmit,
    isSubmitting,
    errorMessage,
}: EmployeeFormProps) {
    const [currentStep, setCurrentStep] = useState(0)

    const form = useForm<EmployeeFormValues>({
        resolver: zodResolver(employeeSchema),
        defaultValues: {
            first_name: initialValues?.first_name ?? "",
            last_name: initialValues?.last_name ?? "",
            date_of_birth: initialValues?.date_of_birth ?? "",
            national_id: initialValues?.national_id ?? "",
            gender: initialValues?.gender ?? "",
            email: initialValues?.email ?? "",
            phone: initialValues?.phone ?? "",
            address: initialValues?.address ?? "",
            emergency_contact_name: initialValues?.emergency_contact_name ?? "",
            emergency_contact_phone: initialValues?.emergency_contact_phone ?? "",
            position: initialValues?.position ?? "",
            employment_type: initialValues?.employment_type ?? "permanent",
            start_date: initialValues?.start_date ?? "",
            is_active: initialValues?.is_active ?? true,
            notes: initialValues?.notes ?? "",
            bank_name: initialValues?.bank_name ?? "",
            bank_account_number: initialValues?.bank_account_number ?? "",
            bank_branch: initialValues?.bank_branch ?? "",
            kra_pin: initialValues?.kra_pin ?? "",
            nhif_number: initialValues?.nhif_number ?? "",
            nssf_number: initialValues?.nssf_number ?? "",
            pay_amount: initialValues?.pay_amount ?? "",
            pay_frequency: initialValues?.pay_frequency ?? "monthly",
            pay_day_config: (initialValues?.pay_day_config ??
                getDefaultPayDayConfig("monthly")) as Record<string, unknown>,
            default_account_id:
                initialValues?.default_account_id != null
                    ? String(initialValues.default_account_id)
                    : "",
            default_category_id:
                initialValues?.default_category_id != null
                    ? String(initialValues.default_category_id)
                    : "",
        },
        mode: "onBlur",
    })

    async function handleNext() {
        const isValid = await form.trigger(STEP_FIELDS[currentStep])
        if (isValid) setCurrentStep((s) => s + 1)
    }

    function handlePrev() {
        setCurrentStep((s) => Math.max(0, s - 1))
    }

    function handleStepClick(i: number) {
        if (i <= currentStep) setCurrentStep(i)
    }

    const isLastStep = currentStep === STEP_LABELS.length - 1

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="px-8 pt-6 pb-4">
                    <Stepper
                        steps={STEP_LABELS}
                        current={currentStep}
                        onStepClick={handleStepClick}
                    />
                </div>

                <div className="px-8 py-6 min-h-[400px]">
                    {currentStep === 0 && <IdentityStep form={form} />}
                    {currentStep === 1 && <ContactStep form={form} />}
                    {currentStep === 2 && <EmploymentStep form={form} />}
                    {currentStep === 3 && <BankingStep form={form} />}
                    {currentStep === 4 && <PayrollStep form={form} />}
                </div>

                {errorMessage && (
                    <div className="mx-8 mb-4 rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                        {errorMessage}
                    </div>
                )}

                <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50/60 px-8 py-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handlePrev}
                        disabled={currentStep === 0}
                    >
                        Previous
                    </Button>
                    {!isLastStep ? (
                        <Button type="button" onClick={handleNext}>
                            Next
                        </Button>
                    ) : (
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting
                                ? "Saving..."
                                : initialValues
                                  ? "Save changes"
                                  : "Create employee"}
                        </Button>
                    )}
                </div>
            </form>
        </Form>
    )
}
