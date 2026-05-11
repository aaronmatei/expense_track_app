import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useMe } from "@/hooks/use-me"
import { useAuth } from "@/lib/auth-context"

export const DashboardPage = () => {
  const me = useMe()
  const { signOut } = useAuth()

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <Button variant="outline" onClick={signOut}>
            Sign out
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Welcome back</CardTitle>
            <CardDescription>
              You're signed in as {me.data?.full_name || me.data?.email}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600">
              This is a placeholder. We'll build the real dashboard with charts and
              summary cards in the next steps.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}