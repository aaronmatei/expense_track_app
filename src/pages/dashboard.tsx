import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useMe } from "@/hooks/use-me"

export function DashboardPage() {
  const me = useMe()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-600">
          Welcome back, {me.data?.full_name || me.data?.email}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Get started</CardTitle>
          <CardDescription>
            We'll build the real dashboard — summary cards, charts, recent activity
            — in the next steps.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-600">
            Use the sidebar to explore the other sections.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}