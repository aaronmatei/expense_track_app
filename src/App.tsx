import { useQuery } from "@tanstack/react-query"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { apiClient } from "@/lib/api-client"

interface Health {
  status: string
}

function App() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["health"],
    queryFn: async () => {
      const { data } = await apiClient.get<Health>("/health")
      return data
    },
  })

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="mx-auto max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>API Connection Test</CardTitle>
            <CardDescription>
              Frontend → {import.meta.env.VITE_API_URL}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading && <p className="text-slate-600">Connecting…</p>}
            {error && (
              <p className="text-red-600">
                Error: {(error as Error).message}
              </p>
            )}
            {data && (
              <p className="text-green-700">
                Backend status: <strong>{data.status}</strong>
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default App