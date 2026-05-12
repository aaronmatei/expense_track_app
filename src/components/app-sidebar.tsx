import {
    LayoutDashboard,
    Receipt,
    Tag,
    Wallet,
    Landmark,
    Settings as SettingsIcon,
    Users,
} from "lucide-react"
import { NavLink } from "react-router-dom"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { useMe } from "@/hooks/use-me"
import { cn } from "@/lib/utils"

const navItems = [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/transactions", label: "Transactions", icon: Receipt },
    { to: "/categories", label: "Categories", icon: Tag },
    { to: "/budgets", label: "Budgets", icon: Wallet },
    { to: "/accounts", label: "Accounts", icon: Landmark },
    { to: "/employees", label: "Employees", icon: Users },
    { to: "/settings", label: "Settings", icon: SettingsIcon },
]

function getInitials(name: string | null | undefined, email: string): string {
    if (name) {
        return name
            .split(" ")
            .map((n) => n[0])
            .slice(0, 2)
            .join("")
            .toUpperCase()
    }
    return email[0].toUpperCase()
}

export function AppSidebar() {
    const me = useMe()

    return (
        <aside className="flex w-64 shrink-0 flex-col border-r border-slate-200 bg-white">
            <div className="flex h-16 items-center gap-3 px-6">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 shadow-sm">
                    <Wallet className="h-5 w-5 text-white" />
                </div>
                <span className="text-lg font-semibold tracking-tight">
                    Expense Tracker
                </span>
            </div>

            <Separator />

            <nav className="flex-1 space-y-1 px-3 py-4">
                {navItems.map(({ to, label, icon: Icon }) => (
                    <NavLink
                        key={to}
                        to={to}
                        className={({ isActive }) =>
                            cn(
                                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-indigo-50 text-indigo-700"
                                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                            )
                        }
                    >
                        <Icon className="h-4 w-4" />
                        {label}
                    </NavLink>
                ))}
            </nav>

            <Separator />

            <div className="flex items-center gap-3 p-4">
                <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                        {me.data ? getInitials(me.data.full_name, me.data.email) : "…"}
                    </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                        {me.data?.full_name || me.data?.email || "…"}
                    </p>
                    <p className="truncate text-xs text-slate-500">{me.data?.email}</p>
                </div>
            </div>
        </aside>
    )
}