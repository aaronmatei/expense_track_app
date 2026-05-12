import { Check, ChevronDown } from "lucide-react"
import { useState } from "react"

import { CategoryIcon } from "@/components/category-icon"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import type { Category } from "@/types/category"

interface CategoryMultiSelectProps {
    categories: Category[]
    selectedIds: number[]
    onChange: (ids: number[]) => void
}

function triggerLabel(categories: Category[], selectedIds: number[]): React.ReactNode {
    if (selectedIds.length === 0) return "All categories"
    if (selectedIds.length === 1) {
        const cat = categories.find((c) => c.id === selectedIds[0])
        if (!cat) return "1 category"
        return (
            <span className="flex items-center gap-1.5 truncate">
                <CategoryIcon icon={cat.icon} className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{cat.name}</span>
            </span>
        )
    }
    if (selectedIds.length === 2) {
        const names = selectedIds
            .map((id) => categories.find((c) => c.id === id)?.name ?? "")
            .filter(Boolean)
            .join(", ")
        return <span className="truncate">{names}</span>
    }
    return `${selectedIds.length} categories`
}

export function CategoryMultiSelect({
    categories,
    selectedIds,
    onChange,
}: CategoryMultiSelectProps) {
    const [open, setOpen] = useState(false)

    const income = categories.filter((c) => c.type === "income")
    const expenses = categories.filter((c) => c.type === "expense")

    function toggle(id: number) {
        if (selectedIds.includes(id)) {
            onChange(selectedIds.filter((x) => x !== id))
        } else {
            onChange([...selectedIds, id])
        }
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[180px] justify-between font-normal"
                >
                    <span className="min-w-0 flex-1 truncate text-left">
                        {triggerLabel(categories, selectedIds)}
                    </span>
                    <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[280px] p-0" align="start">
                <Command>
                    <CommandInput placeholder="Search categories..." />
                    <CommandList>
                        <CommandEmpty>No categories found.</CommandEmpty>
                        {income.length > 0 && (
                            <CommandGroup heading={<span className="text-emerald-700">Income</span>}>
                                {income.map((c) => (
                                    <CommandItem
                                        key={c.id}
                                        value={c.name}
                                        onSelect={() => toggle(c.id)}
                                    >
                                        <Check
                                            className={cn(
                                                "mr-2 h-4 w-4 text-indigo-600",
                                                selectedIds.includes(c.id) ? "opacity-100" : "opacity-0",
                                            )}
                                        />
                                        <CategoryIcon icon={c.icon} className="mr-2 h-4 w-4" />
                                        {c.name}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        )}
                        {expenses.length > 0 && (
                            <CommandGroup heading={<span className="text-rose-700">Expense</span>}>
                                {expenses.map((c) => (
                                    <CommandItem
                                        key={c.id}
                                        value={c.name}
                                        onSelect={() => toggle(c.id)}
                                    >
                                        <Check
                                            className={cn(
                                                "mr-2 h-4 w-4 text-indigo-600",
                                                selectedIds.includes(c.id) ? "opacity-100" : "opacity-0",
                                            )}
                                        />
                                        <CategoryIcon icon={c.icon} className="mr-2 h-4 w-4" />
                                        {c.name}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        )}
                        {selectedIds.length > 0 && (
                            <>
                                <CommandSeparator />
                                <CommandGroup>
                                    <CommandItem
                                        onSelect={() => onChange([])}
                                        className="italic text-slate-500"
                                    >
                                        Clear selection
                                    </CommandItem>
                                </CommandGroup>
                            </>
                        )}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
