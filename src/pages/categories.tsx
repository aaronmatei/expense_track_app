import { Plus, TrendingDown, TrendingUp } from "lucide-react"
import { useState } from "react"

import { CategoryCard } from "@/components/categories/category-card"
import { CategoryDialog } from "@/components/categories/category-dialog"
import { DeleteCategoryDialog } from "@/components/categories/delete-category-dialog"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { useCategories } from "@/hooks/use-categories"
import type { Category } from "@/types/category"

export function CategoriesPage() {
    const { data: categories, isLoading, error } = useCategories()
    const [dialogOpen, setDialogOpen] = useState(false)
    const [editing, setEditing] = useState<Category | undefined>(undefined)
    const [deleting, setDeleting] = useState<Category | null>(null)

    function handleCreate() {
        setEditing(undefined)
        setDialogOpen(true)
    }

    function handleEdit(category: Category) {
        setEditing(category)
        setDialogOpen(true)
    }

    function handleDialogChange(open: boolean) {
        setDialogOpen(open)
        if (!open) setEditing(undefined)
    }

    const income = categories?.filter((c) => c.type === "income") ?? []
    const expenses = categories?.filter((c) => c.type === "expense") ?? []

    return (
        <div className="space-y-6">
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
                    <p className="mt-1 text-sm text-slate-600">
                        Organize your income and expenses into groups
                    </p>
                </div>
                <Button onClick={handleCreate}>
                    <Plus className="mr-2 h-4 w-4" /> New category
                </Button>
            </div>

            {isLoading && <p className="text-sm text-slate-600">Loading…</p>}
            {error && (
                <p className="text-sm text-red-600">Failed to load categories</p>
            )}

            {categories && (
                <div className="grid gap-6 md:grid-cols-2">
                    <Card className="border-emerald-100">
                        <CardHeader className="bg-emerald-50/60">
                            <CardTitle className="flex items-center gap-2 text-base">
                                <TrendingUp className="h-4 w-4 text-emerald-600" />
                                <span className="text-emerald-900">Income</span>
                                <span className="ml-auto text-xs font-normal text-emerald-700/70">
                                    {income.length}
                                </span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 pt-4">
                            {income.length === 0 ? (
                                <p className="py-6 text-center text-sm text-slate-500">
                                    No income categories yet
                                </p>
                            ) : (
                                income.map((c) => (
                                    <CategoryCard
                                        key={c.id}
                                        category={c}
                                        onEdit={handleEdit}
                                        onDelete={setDeleting}
                                    />
                                ))
                            )}
                        </CardContent>
                    </Card>

                    <Card className="border-rose-100">
                        <CardHeader className="bg-rose-50/60">
                            <CardTitle className="flex items-center gap-2 text-base">
                                <TrendingDown className="h-4 w-4 text-rose-600" />
                                <span className="text-rose-900">Expenses</span>
                                <span className="ml-auto text-xs font-normal text-rose-700/70">
                                    {expenses.length}
                                </span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 pt-4">
                            {expenses.length === 0 ? (
                                <p className="py-6 text-center text-sm text-slate-500">
                                    No expense categories yet
                                </p>
                            ) : (
                                expenses.map((c) => (
                                    <CategoryCard
                                        key={c.id}
                                        category={c}
                                        onEdit={handleEdit}
                                        onDelete={setDeleting}
                                    />
                                ))
                            )}
                        </CardContent>
                    </Card>
                </div>
            )}

            <CategoryDialog
                open={dialogOpen}
                onOpenChange={handleDialogChange}
                category={editing}
            />

            <DeleteCategoryDialog
                category={deleting}
                onClose={() => setDeleting(null)}
            />
        </div>
    )
}