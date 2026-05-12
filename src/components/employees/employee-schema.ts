import { z } from "zod"

export const employeeSchema = z.object({
    // Identity
    first_name: z.string().min(1, "First name is required").max(100),
    last_name: z.string().min(1, "Last name is required").max(100),
    date_of_birth: z.string(),
    national_id: z.string(),
    gender: z.string(), // "" | "male" | "female" | "other"

    // Contact
    email: z.union([z.string().email("Invalid email address"), z.literal("")]),
    phone: z.string(),
    address: z.string(),
    emergency_contact_name: z.string(),
    emergency_contact_phone: z.string(),

    // Employment
    position: z.string(),
    employment_type: z.enum(["permanent", "contract", "casual", "intern"]),
    start_date: z.string().min(1, "Start date is required"),
    is_active: z.boolean(),
    notes: z.string(),

    // Banking
    bank_name: z.string(),
    bank_account_number: z.string(),
    bank_branch: z.string(),
    kra_pin: z.string(),
    nhif_number: z.string(),
    nssf_number: z.string(),

    // Payroll
    pay_amount: z.string(),
    pay_frequency: z.enum(["monthly", "semi_monthly", "weekly", "biweekly"]),
    pay_day_config: z.custom<Record<string, unknown>>(),
    // Stored as strings in the form (Select values); converted to numbers in the dialog
    default_account_id: z.string(),
    default_category_id: z.string(),
})

export type EmployeeFormValues = z.infer<typeof employeeSchema>

export const STEP_FIELDS: Array<Array<keyof EmployeeFormValues>> = [
    ["first_name", "last_name", "date_of_birth", "national_id", "gender"],
    ["email", "phone", "address", "emergency_contact_name", "emergency_contact_phone"],
    ["position", "employment_type", "start_date", "is_active", "notes"],
    ["bank_name", "bank_account_number", "bank_branch", "kra_pin", "nhif_number", "nssf_number"],
    ["pay_amount", "pay_frequency", "pay_day_config", "default_account_id", "default_category_id"],
]

export const STEP_LABELS = ["Identity", "Contact", "Employment", "Banking", "Payroll"]
