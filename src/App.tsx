import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"

import { ProtectedRoute } from "@/components/protected-route"
import { AuthProvider } from "@/lib/auth-context"
import { DashboardPage } from "@/pages/dashboard"
import { LoginPage } from "@/pages/login"
import { RegisterPage } from "@/pages/register"

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
          </Route>

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App