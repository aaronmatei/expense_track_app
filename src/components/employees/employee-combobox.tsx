import { ChevronDown, X } from "lucide-react"
import { useState } from "react"

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
import { useEmployees } from "@/hooks/use-employees"
import type { Employee } from "@/types/employee"

interface Props {
    value: number | null
    onChange: (employeeId: number | null, employee: Employee | null) => void
    placeholder?: string
    allowClear?: boolean
}

export function EmployeeCombobox({
    value,
    onChange,
    placeholder = "Select employee (optional)",
    allowClear = true,
}: Props) {
    const [open, setOpen] = useState(false)
    const employees = useEmployees({ is_active: true })
    const selected = employees.data?.find((e) => e.id === value) ?? null

    function handleSelect(employee: Employee) {
        onChange(employee.id, employee)
        setOpen(false)
    }

    function handleClear(e: React.MouseEvent) {
        e.stopPropagation()
        onChange(null, null)
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    type="button"
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between font-normal"
                >
                    <span className="min-w-0 flex-1 truncate text-left">
                        {selected ? (
                            <span className="flex items-center gap-2">
                                <span>{selected.full_name}</span>
                                {selected.position && (
                                    <span className="text-xs text-slate-400">
                                        {selected.position}
                                    </span>
                                )}
                            </span>
                        ) : (
                            <span className="text-slate-400">{placeholder}</span>
                        )}
                    </span>
                    <span className="ml-2 flex shrink-0 items-center gap-1">
                        {selected && (
                            <span
                                role="button"
                                tabIndex={0}
                                onClick={handleClear}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" || e.key === " ") {
                                        e.preventDefault()
                                        onChange(null, null)
                                    }
                                }}
                                className="rounded p-0.5 hover:bg-slate-100"
                                aria-label="Clear employee"
                            >
                                <X className="h-3 w-3 text-slate-400" />
                            </span>
                        )}
                        <ChevronDown className="h-4 w-4 opacity-50" />
                    </span>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0" align="start">
                <Command>
                    <CommandInput placeholder="Search employees…" />
                    <CommandList>
                        <CommandEmpty>No employees found.</CommandEmpty>
                        {allowClear && (
                            <>
                                <CommandGroup>
                                    <CommandItem
                                        value="__clear__"
                                        onSelect={() => {
                                            onChange(null, null)
                                            setOpen(false)
                                        }}
                                        className="text-slate-500 dark:text-slate-400 italic"
                                    >
                                        All employees
                                    </CommandItem>
                                </CommandGroup>
                                <CommandSeparator />
                            </>
                        )}
                        <CommandGroup>
                            {employees.data?.map((employee) => (
                                <CommandItem
                                    key={employee.id}
                                    value={employee.full_name}
                                    onSelect={() => handleSelect(employee)}
                                    data-checked={value === employee.id || undefined}
                                >
                                    <span className="flex flex-col">
                                        <span>{employee.full_name}</span>
                                        <span className="text-xs text-slate-500 dark:text-slate-400">
                                            {employee.position ?? "—"}
                                        </span>
                                    </span>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
