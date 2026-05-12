import { Check } from "lucide-react"

import { cn } from "@/lib/utils"

interface StepperProps {
    steps: string[]
    current: number
    onStepClick?: (i: number) => void
}

export function Stepper({ steps, current, onStepClick }: StepperProps) {
    return (
        <div className="flex w-full items-center">
            {steps.map((label, i) => {
                const isComplete = i < current
                const isActive = i === current
                const canClick = !!onStepClick && (isComplete || isActive)

                return (
                    <div
                        key={label}
                        className={cn(
                            "flex items-center",
                            i < steps.length - 1 && "flex-1",
                        )}
                    >
                        <button
                            type="button"
                            disabled={!canClick}
                            onClick={() => canClick && onStepClick?.(i)}
                            className={cn(
                                "flex items-center gap-2",
                                canClick ? "cursor-pointer" : "cursor-default",
                            )}
                        >
                            <div
                                className={cn(
                                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 text-sm font-medium transition-colors",
                                    isComplete &&
                                        "border-indigo-600 bg-indigo-600 text-white",
                                    isActive &&
                                        "border-indigo-600 bg-white text-indigo-600",
                                    !isActive &&
                                        !isComplete &&
                                        "border-slate-300 bg-white text-slate-500",
                                )}
                            >
                                {isComplete ? (
                                    <Check className="h-4 w-4" />
                                ) : (
                                    i + 1
                                )}
                            </div>
                            <span
                                className={cn(
                                    "whitespace-nowrap text-sm font-medium transition-colors",
                                    isActive || isComplete
                                        ? "text-slate-900"
                                        : "text-slate-500",
                                )}
                            >
                                {label}
                            </span>
                        </button>

                        {i < steps.length - 1 && (
                            <div
                                className={cn(
                                    "mx-4 h-0.5 flex-1 transition-colors",
                                    isComplete ? "bg-indigo-600" : "bg-slate-200",
                                )}
                            />
                        )}
                    </div>
                )
            })}
        </div>
    )
}
