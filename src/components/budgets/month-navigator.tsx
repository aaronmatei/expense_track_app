import { ChevronLeft, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"

const MONTHS = [
    "January", "February", "March", "April",
    "May", "June", "July", "August",
    "September", "October", "November", "December",
]

interface MonthNavigatorProps {
    year: number
    month: number
    onChange: (year: number, month: number) => void
}

export function MonthNavigator({ year, month, onChange }: MonthNavigatorProps) {
    function goBack() {
        if (month === 1) {
            onChange(year - 1, 12)
        } else {
            onChange(year, month - 1)
        }
    }

    function goForward() {
        if (month === 12) {
            onChange(year + 1, 1)
        } else {
            onChange(year, month + 1)
        }
    }

    return (
        <div className="flex items-center gap-2">
            <Button
                variant="outline"
                size="icon"
                onClick={goBack}
                aria-label="Previous month"
            >
                <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="min-w-32 text-center text-sm font-medium">
                {MONTHS[month - 1]} {year}
            </span>
            <Button
                variant="outline"
                size="icon"
                onClick={goForward}
                aria-label="Next month"
            >
                <ChevronRight className="h-4 w-4" />
            </Button>
        </div>
    )
}
