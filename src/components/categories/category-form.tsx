import { useEffect, useState, type FormEvent } from "react"
import { DynamicIcon, type IconName } from "lucide-react/dynamic"

import { CategoryIcon } from "@/components/category-icon"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { EMOJI_PRESETS, LUCIDE_PRESETS } from "@/lib/icon-presets"
import { cn } from "@/lib/utils"
import type {
    Category,
    CategoryCreate,
    CategoryType,
} from "@/types/category"

interface CategoryFormProps {
    category?: Category
    onSubmit: (data: CategoryCreate) => void
    onCancel: () => void
    isSubmitting?: boolean
    error?: string
}

export function CategoryForm({
    category,
    onSubmit,
    onCancel,
    isSubmitting,
    error,
}: CategoryFormProps) {
    const [name, setName] = useState(category?.name ?? "")
    const [type, setType] = useState<CategoryType>(category?.type ?? "expense")
    const [icon, setIcon] = useState(category?.icon ?? "")
    const [color, setColor] = useState(category?.color ?? "#3B82F6")

    useEffect(() => {
        setName(category?.name ?? "")
        setType(category?.type ?? "expense")
        setIcon(category?.icon ?? "")
        setColor(category?.color ?? "#3B82F6")
    }, [category])

    function handleSubmit(e: FormEvent) {
        e.preventDefault()
        onSubmit({
            name: name.trim(),
            type,
            icon: icon.trim() || null,
            color: color.trim() || null,
        })
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Groceries"
                    required
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select value={type} onValueChange={(v) => setType(v as CategoryType)}>
                    <SelectTrigger id="type">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="expense">Expense</SelectItem>
                        <SelectItem value="income">Income</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-3">
                <Label>Icon</Label>

                {/* Emoji presets */}
                <div>
                    <p className="mb-1.5 text-xs text-slate-500 dark:text-slate-400">Emojis</p>
                    <div className="grid grid-cols-4 gap-1 sm:grid-cols-8">
                        {EMOJI_PRESETS.map((e) => (
                            <button
                                key={e}
                                type="button"
                                onClick={() => setIcon(e)}
                                className={cn(
                                    "flex h-10 w-full items-center justify-center rounded-md border text-lg transition-colors hover:border-indigo-400",
                                    icon === e
                                        ? "border-indigo-500 ring-2 ring-indigo-500"
                                        : "border-slate-200 dark:border-slate-700",
                                )}
                            >
                                {e}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Lucide icon presets */}
                <div>
                    <p className="mb-1.5 text-xs text-slate-500 dark:text-slate-400">Icons</p>
                    <div className="grid grid-cols-4 gap-1 sm:grid-cols-8">
                        {LUCIDE_PRESETS.map((name) => (
                            <button
                                key={name}
                                type="button"
                                title={name}
                                onClick={() => setIcon(name)}
                                className={cn(
                                    "flex h-10 w-full items-center justify-center rounded-md border transition-colors hover:border-indigo-400",
                                    icon === name
                                        ? "border-indigo-500 ring-2 ring-indigo-500"
                                        : "border-slate-200 dark:border-slate-700",
                                )}
                            >
                                <DynamicIcon name={name as IconName} className="h-5 w-5 text-slate-600 dark:text-slate-300" />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Custom input */}
                <div>
                    <p className="mb-1.5 text-xs text-slate-500 dark:text-slate-400">
                        Or enter a custom emoji or Lucide icon name
                    </p>
                    <div className="flex items-center gap-2">
                        <Input
                            id="icon"
                            value={icon}
                            onChange={(e) => setIcon(e.target.value)}
                            placeholder="🛒 or shopping-cart"
                            maxLength={40}
                            className="flex-1"
                        />
                        {icon && (
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-lg text-white" style={{ backgroundColor: color || "#94a3b8" }}>
                                <CategoryIcon icon={icon} className="h-5 w-5 text-white text-lg" />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="color">Color</Label>
                <div className="flex items-center gap-2">
                    <Input
                        id="color"
                        type="color"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        className="h-10 w-14 cursor-pointer p-1"
                    />
                    <Input
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        placeholder="#3B82F6"
                        className="flex-1"
                    />
                </div>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={onCancel}>
                    Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting || !name.trim()}>
                    {isSubmitting ? "Saving…" : category ? "Update" : "Create"}
                </Button>
            </div>
        </form>
    )
}
