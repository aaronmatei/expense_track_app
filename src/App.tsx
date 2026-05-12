import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"

import { AppLayout } from "@/components/app-layout"
import { ProtectedRoute } from "@/components/protected-route"
import { AuthProvider } from "@/lib/auth-context"
import { AccountsPage } from "@/pages/accounts"
import { BudgetsPage } from "@/pages/budgets"
import { CategoriesPage } from "@/pages/categories"
import { DashboardPage } from "@/pages/dashboard"
import { EmployeesPage } from "@/pages/employees"
import { LoginPage } from "@/pages/login"
import { RecurringTransactionsPage } from "@/pages/recurring-transactions"
import { RegisterPage } from "@/pages/register"
import { SettingsPage } from "@/pages/settings"
import { TransactionsPage } from "@/pages/transactions"
import { TransfersPage } from "@/pages/transfers"

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/transactions" element={<TransactionsPage />} />
              <Route path="/transfers" element={<TransfersPage />} />
              <Route path="/categories" element={<CategoriesPage />} />
              <Route path="/budgets" element={<BudgetsPage />} />
              <Route path="/accounts" element={<AccountsPage />} />
              <Route path="/employees" element={<EmployeesPage />} />
              <Route path="/recurring-transactions" element={<RecurringTransactionsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>
          </Route>

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App