import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import type { PayDayConfig, PayFrequency, Weekday } from "@/types/employee"

const WEEKDAYS: Weekday[] = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
]

function getNextFriday(): string {
    const d = new Date()
    const day = d.getDay()
    const daysUntilFriday = (5 - day + 7) % 7 || 7
    d.setDate(d.getDate() + daysUntilFriday)
    return d.toISOString().split("T")[0]
}

export function getDefaultPayDayConfig(freq: PayFrequency): PayDayConfig {
    switch (freq) {
        case "monthly":
            return { day: 25 }
        case "semi_monthly":
            return { days: [15, "last"] }
        case "weekly":
            return { weekday: "friday" }
        case "biweekly":
            return { weekday: "friday", anchor_date: getNextFriday() }
    }
}

interface Props {
    frequency: PayFrequency
    value: PayDayConfig
    onChange: (v: PayDayConfig) => void
}

function isValidConfigForFrequency(freq: PayFrequency, v: unknown): boolean {
    if (!v || typeof v !== "object") return false
    const obj = v as Record<string, unknown>
    if (freq === "monthly") return typeof obj.day === "number"
    if (freq === "semi_monthly") return Array.isArray(obj.days) && obj.days.length === 2
    if (freq === "weekly") return typeof obj.weekday === "string"
    if (freq === "biweekly") return typeof obj.weekday === "string" && typeof obj.anchor_date === "string"
    return false
}

export function PayDayConfigInput({ frequency, value, onChange }: Props) {
    const safeValue = isValidConfigForFrequency(frequency, value)
        ? value
        : getDefaultPayDayConfig(frequency)

    if (frequency === "monthly") {
        const cfg = safeValue as { day: number }
        return (
            <div className="space-y-2">
                <Label htmlFor="pay_day">Day of month</Label>
                <Input
                    id="pay_day"
                    type="number"
                    min={1}
                    max={31}
                    value={cfg.day ?? 25}
                    onChange={(e) =>
                        onChange({ day: parseInt(e.target.value, 10) || 1 })
                    }
                />
            </div>
        )
    }

    if (frequency === "semi_monthly") {
        const cfg = safeValue as { days: (number | "last")[] }
        const days = cfg.days ?? [15, "last"]
        const dayOptions = Array.from({ length: 31 }, (_, i) => i + 1)

        function handleDayChange(index: number, v: string) {
            const newDays = [...days] as (number | "last")[]
            newDays[index] = v === "last" ? "last" : parseInt(v, 10)
            onChange({ days: newDays })
        }

        return (
            <div className="space-y-2">
                <Label>Pay days</Label>
                <div className="grid grid-cols-2 gap-2">
                    {[0, 1].map((i) => (
                        <Select
                            key={i}
                            value={String(days[i] ?? (i === 0 ? 15 : "last"))}
                            onValueChange={(v) => handleDayChange(i, v)}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {dayOptions.map((d) => (
                                    <SelectItem key={d} value={String(d)}>
                                        {d}
                                    </SelectItem>
                                ))}
                                <SelectItem value="last">Last day</SelectItem>
                            </SelectContent>
                        </Select>
                    ))}
                </div>
            </div>
        )
    }

    if (frequency === "weekly") {
        const cfg = safeValue as { weekday: Weekday }
        return (
            <div className="space-y-2">
                <Label htmlFor="pay_weekday">Pay day</Label>
                <Select
                    value={cfg.weekday ?? "friday"}
                    onValueChange={(v) => onChange({ weekday: v as Weekday })}
                >
                    <SelectTrigger id="pay_weekday">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {WEEKDAYS.map((w) => (
                            <SelectItem key={w} value={w}>
                                {w.charAt(0).toUpperCase() + w.slice(1)}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        )
    }

    if (frequency === "biweekly") {
        const cfg = safeValue as { weekday: Weekday; anchor_date: string }
        return (
            <div className="space-y-2">
                <Label>Pay day</Label>
                <div className="grid grid-cols-2 gap-2">
                    <Select
                        value={cfg.weekday ?? "friday"}
                        onValueChange={(v) =>
                            onChange({ ...cfg, weekday: v as Weekday })
                        }
                    >
                        <SelectTrigger id="bi_weekday">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {WEEKDAYS.map((w) => (
                                <SelectItem key={w} value={w}>
                                    {w.charAt(0).toUpperCase() + w.slice(1)}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Input
                        id="anchor_date"
                        type="date"
                        value={cfg.anchor_date ?? ""}
                        onChange={(e) =>
                            onChange({ ...cfg, anchor_date: e.target.value })
                        }
                    />
                </div>
            </div>
        )
    }

    return null
}
