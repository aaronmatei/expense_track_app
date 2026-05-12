import type { RecurrenceConfig, RecurringFrequency } from "@/types/recurring-transaction"

function ordinal(n: number): string {
    const mod10 = n % 10
    const mod100 = n % 100
    if (mod100 >= 11 && mod100 <= 13) return `${n}th`
    if (mod10 === 1) return `${n}st`
    if (mod10 === 2) return `${n}nd`
    if (mod10 === 3) return `${n}rd`
    return `${n}th`
}

function capitalize(s: string): string {
    return s.charAt(0).toUpperCase() + s.slice(1)
}

const QUARTER_LABELS: Record<0 | 1 | 2, string> = {
    0: "Jan/Apr/Jul/Oct",
    1: "Feb/May/Aug/Nov",
    2: "Mar/Jun/Sep/Dec",
}

const MONTH_NAMES = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
]

function describe(frequency: RecurringFrequency, config: RecurrenceConfig): string {
    const cfg = config as Record<string, unknown>
    switch (frequency) {
        case "daily":
            return "Daily"
        case "weekly":
            return `Weekly · ${capitalize(String(cfg.weekday ?? ""))}s`
        case "biweekly":
            return `Bi-weekly · ${capitalize(String(cfg.weekday ?? ""))}s`
        case "monthly":
            return `Monthly · ${ordinal(Number(cfg.day ?? 1))}`
        case "quarterly": {
            const offset = (cfg.month_offset ?? 0) as 0 | 1 | 2
            return `Quarterly · ${QUARTER_LABELS[offset]}, ${ordinal(Number(cfg.day ?? 1))}`
        }
        case "yearly": {
            const month = Number(cfg.month ?? 1)
            return `Yearly · ${MONTH_NAMES[month - 1]} ${ordinal(Number(cfg.day ?? 1))}`
        }
    }
}

interface FrequencyBadgeProps {
    frequency: RecurringFrequency
    config: RecurrenceConfig
}

export function FrequencyBadge({ frequency, config }: FrequencyBadgeProps) {
    return (
        <span className="inline-block rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-700">
            {describe(frequency, config)}
        </span>
    )
}
