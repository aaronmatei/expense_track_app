import { Pencil, Trash2 } from "lucide-react"

import { CategoryIcon } from "@/components/category-icon"
import { Button } from "@/components/ui/button"
import type { Category } from "@/types/category"

interface CategoryCardProps {
    category: Category
    onEdit: (category: Category) => void
    onDelete: (category: Category) => void
}

export function CategoryCard({
    category,
    onEdit,
    onDelete,
}: CategoryCardProps) {
    return (
        <div className="group flex items-center gap-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-3">
            <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-lg text-white"
                style={{ backgroundColor: category.color ?? "#94a3b8" }}
            >
                <CategoryIcon icon={category.icon} className="text-lg" fallback={category.name[0]?.toUpperCase()} />
            </div>
            <p className="min-w-0 flex-1 truncate text-sm font-medium">
                {category.name}
            </p>
            <div className="flex opacity-0 transition-opacity group-hover:opacity-100">
                <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => onEdit(category)}
                    aria-label="Edit"
                >
                    <Pencil className="h-4 w-4" />
                </Button>
                <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => onDelete(category)}
                    aria-label="Delete"
                >
                    <Trash2 className="h-4 w-4 text-red-600" />
                </Button>
            </div>
        </div>
    )
}