import type { LucideIcon } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface StatCardProps {
    title: string
    value: string
    icon: LucideIcon
    iconColor: string
    iconBg: string
    caption?: string
    valueClassName?: string
}

export function StatCard({
    title,
    value,
    icon: Icon,
    iconColor,
    iconBg,
    caption,
    valueClassName,
}: StatCardProps) {
    return (
        <Card>
            <CardContent className="p-5">
                <div className="flex items-start gap-3">
                    <div
                        className={cn(
                            "flex h-10 w-10 shrink-0 items-center justify-center rounded-md",
                            iconBg,
                        )}
                    >
                        <Icon className={cn("h-5 w-5", iconColor)} />
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-slate-600 dark:text-slate-300">{title}</p>
                        <p
                            className={cn(
                                "mt-1 text-2xl font-bold tracking-tight tabular-nums",
                                valueClassName ?? "text-slate-900 dark:text-slate-100",
                            )}
                        >
                            {value}
                        </p>
                        {caption && (
                            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{caption}</p>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
