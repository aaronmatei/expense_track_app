import { Wallet } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

function App() {
  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="mx-auto max-w-md">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Wallet className="h-6 w-6" />
              <CardTitle>Expense Tracker</CardTitle>
            </div>
            <CardDescription>shadcn/ui is installed and working.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" />
            </div>
            <Button className="w-full">Sign in</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default App