import { Construction } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"

interface PlaceholderPageProps {
    title: string
    description?: string
}

export function PlaceholderPage({ title, description }: PlaceholderPageProps) {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
                {description && (
                    <p className="mt-1 text-sm text-slate-600">{description}</p>
                )}
            </div>
            <Card>
                <CardContent className="flex flex-col items-center justify-center gap-3 py-20">
                    <Construction className="h-10 w-10 text-slate-400" />
                    <p className="text-sm text-slate-600">Coming soon</p>
                </CardContent>
            </Card>
        </div>
    )
}