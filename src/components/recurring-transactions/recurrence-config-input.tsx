import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import type { RecurrenceConfig, RecurringFrequency, Weekday } from "@/types/recurring-transaction"

const WEEKDAYS: Weekday[] = [
    "monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday",
]

const MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
]

export function getDefaultRecurrenceConfig(frequency: RecurringFrequency): RecurrenceConfig {
    switch (frequency) {
        case "daily": return {}
        case "weekly": return { weekday: "monday" }
        case "biweekly": return { weekday: "monday", anchor_date: new Date().toISOString().split("T")[0] }
        case "monthly": return { day: 1 }
        case "quarterly": return { month_offset: 0, day: 1 }
        case "yearly": return { month: 1, day: 1 }
    }
}

interface RecurrenceConfigInputProps {
    frequency: RecurringFrequency
    value: RecurrenceConfig
    onChange: (config: RecurrenceConfig) => void
}

export function RecurrenceConfigInput({
    frequency,
    value,
    onChange,
}: RecurrenceConfigInputProps) {
    const cfg = value as Record<string, unknown>

    switch (frequency) {
        case "daily":
            return (
                <p className="text-sm text-slate-500 dark:text-slate-400">Will recur every day</p>
            )

        case "weekly":
            return (
                <div className="space-y-1">
                    <Label className="text-xs">Day of week</Label>
                    <Select
                        value={String(cfg.weekday ?? "monday")}
                        onValueChange={(v) => onChange({ weekday: v as Weekday })}
                    >
                        <SelectTrigger className="w-44">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {WEEKDAYS.map((d) => (
                                <SelectItem key={d} value={d}>
                                    {d.charAt(0).toUpperCase() + d.slice(1)}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            )

        case "biweekly":
            return (
                <div className="flex flex-wrap gap-3">
                    <div className="space-y-1">
                        <Label className="text-xs">Day of week</Label>
                        <Select
                            value={String(cfg.weekday ?? "monday")}
                            onValueChange={(v) =>
                                onChange({ ...cfg, weekday: v as Weekday } as RecurrenceConfig)
                            }
                        >
                            <SelectTrigger className="w-44">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {WEEKDAYS.map((d) => (
                                    <SelectItem key={d} value={d}>
                                        {d.charAt(0).toUpperCase() + d.slice(1)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs">Anchor date</Label>
                        <Input
                            type="date"
                            className="w-44"
                            value={String(cfg.anchor_date ?? "")}
                            onChange={(e) =>
                                onChange({ ...cfg, anchor_date: e.target.value } as RecurrenceConfig)
                            }
                        />
                    </div>
                </div>
            )

        case "monthly":
            return (
                <div className="space-y-1">
                    <Label className="text-xs">
                        Day of month{" "}
                        <span className="text-slate-400">
                            (1–31, values &gt; 28 clamp to last day in short months)
                        </span>
                    </Label>
                    <Input
                        type="number"
                        min={1}
                        max={31}
                        className="w-24"
                        value={String(cfg.day ?? 1)}
                        onChange={(e) =>
                            onChange({ day: Math.max(1, Math.min(31, Number(e.target.value))) })
                        }
                    />
                </div>
            )

        case "quarterly":
            return (
                <div className="flex flex-wrap gap-3">
                    <div className="space-y-1">
                        <Label className="text-xs">Quarter start months</Label>
                        <Select
                            value={String(cfg.month_offset ?? 0)}
                            onValueChange={(v) =>
                                onChange({ ...cfg, month_offset: Number(v) as 0 | 1 | 2 } as RecurrenceConfig)
                            }
                        >
                            <SelectTrigger className="w-52">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="0">Jan / Apr / Jul / Oct</SelectItem>
                                <SelectItem value="1">Feb / May / Aug / Nov</SelectItem>
                                <SelectItem value="2">Mar / Jun / Sep / Dec</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs">Day</Label>
                        <Input
                            type="number"
                            min={1}
                            max={31}
                            className="w-24"
                            value={String(cfg.day ?? 1)}
                            onChange={(e) =>
                                onChange({ ...cfg, day: Math.max(1, Math.min(31, Number(e.target.value))) } as RecurrenceConfig)
                            }
                        />
                    </div>
                </div>
            )

        case "yearly":
            return (
                <div className="flex flex-wrap gap-3">
                    <div className="space-y-1">
                        <Label className="text-xs">Month</Label>
                        <Select
                            value={String(cfg.month ?? 1)}
                            onValueChange={(v) =>
                                onChange({ ...cfg, month: Number(v) } as RecurrenceConfig)
                            }
                        >
                            <SelectTrigger className="w-44">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {MONTH_NAMES.map((name, i) => (
                                    <SelectItem key={i + 1} value={String(i + 1)}>
                                        {name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs">Day</Label>
                        <Input
                            type="number"
                            min={1}
                            max={31}
                            className="w-24"
                            value={String(cfg.day ?? 1)}
                            onChange={(e) =>
                                onChange({ ...cfg, day: Math.max(1, Math.min(31, Number(e.target.value))) } as RecurrenceConfig)
                            }
                        />
                    </div>
                </div>
            )
    }
}
