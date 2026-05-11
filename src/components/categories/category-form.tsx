import { useEffect, useState, type FormEvent } from "react"

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

    // Reset form when the category prop changes (e.g. switching from create → edit)
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

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="icon">Icon (emoji)</Label>
                    <Input
                        id="icon"
                        value={icon}
                        onChange={(e) => setIcon(e.target.value)}
                        placeholder="🛒"
                        maxLength={4}
                    />
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