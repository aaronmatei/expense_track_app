import type { PayDayConfig, PayFrequency } from "@/types/employee"

const ORDINALS: Record<number, string> = {
    1: "1st", 2: "2nd", 3: "3rd",
}
function ordinal(n: number): string {
    return ORDINALS[n] ?? `${n}th`
}

function capitalize(s: string): string {
    return s.charAt(0).toUpperCase() + s.slice(1)
}

function formatDayLabel(v: number | "last"): string {
    return v === "last" ? "last" : ordinal(v)
}

function describe(frequency: PayFrequency, config: PayDayConfig): string {
    switch (frequency) {
        case "monthly": {
            const c = config as { day: number }
            return `Monthly · ${ordinal(c.day)}`
        }
        case "semi_monthly": {
            const c = config as { days: (number | "last")[] }
            return `Semi-monthly · ${formatDayLabel(c.days[0])} & ${formatDayLabel(c.days[1])}`
        }
        case "weekly": {
            const c = config as { weekday: string }
            return `Weekly · ${capitalize(c.weekday)}s`
        }
        case "biweekly": {
            const c = config as { weekday: string; anchor_date: string }
            return `Bi-weekly · ${capitalize(c.weekday)}s`
        }
    }
}

interface PayFrequencyBadgeProps {
    frequency: PayFrequency
    config: PayDayConfig
}

export function PayFrequencyBadge({ frequency, config }: PayFrequencyBadgeProps) {
    return (
        <span className="inline-block rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-700">
            {describe(frequency, config)}
        </span>
    )
}
