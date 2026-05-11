import { Outlet } from "react-router-dom"

import { AppHeader } from "@/components/app-header"
import { AppSidebar } from "@/components/app-sidebar"

export function AppLayout() {
    return (
        <div className="flex h-screen bg-slate-50">
            <AppSidebar />
            <div className="flex flex-1 flex-col overflow-hidden">
                <AppHeader />
                <main className="flex-1 overflow-y-auto p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}