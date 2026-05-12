import { LogOut, ChevronDown } from "lucide-react"

import { ThemeToggle } from "@/components/theme-toggle"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useMe } from "@/hooks/use-me"
import { useAuth } from "@/lib/auth-context"

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

export function AppHeader() {
    const me = useMe()
    const { signOut } = useAuth()

    return (
        <header className="flex h-16 items-center justify-end border-b border-slate-200 bg-white px-6 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-2">
            <ThemeToggle />
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="gap-2 px-2">
                        <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-xs">
                                {me.data ? getInitials(me.data.full_name, me.data.email) : "…"}
                            </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">
                            {me.data?.full_name || me.data?.email}
                        </span>
                        <ChevronDown className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                        <p className="text-sm font-medium">{me.data?.full_name}</p>
                        <p className="text-xs font-normal text-slate-500 dark:text-slate-400">
                            {me.data?.email}
                        </p>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={signOut}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign out
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            </div>
        </header>
    )
}