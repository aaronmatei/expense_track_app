import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { ProfileForm } from "@/components/settings/profile-form"
import { SecurityForm } from "@/components/settings/security-form"
import { useMe } from "@/hooks/use-me"

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

export function SettingsPage() {
    const me = useMe()

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                    Manage your profile and account security
                </p>
            </div>

            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Profile</CardTitle>
                        <CardDescription>
                            Update your personal information
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center gap-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 p-4">
                            <Avatar className="h-14 w-14">
                                <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-lg text-white">
                                    {me.data
                                        ? getInitials(me.data.full_name, me.data.email)
                                        : "…"}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-semibold">
                                    {me.data?.full_name || "—"}
                                </p>
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    {me.data?.email}
                                </p>
                            </div>
                        </div>
                        <ProfileForm />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Password</CardTitle>
                        <CardDescription>
                            Change your password to keep your account secure
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <SecurityForm />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
