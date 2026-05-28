"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"

export default function SettingsPage() {
    const [darkMode, setDarkMode] = useState(true)
    const [notificationsEnabled, setNotificationsEnabled] = useState(true)
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const handleLogout = () => {
        window.alert('Logged out (mock)')
    }

    return (
        <div className="container mx-auto p-4 md:p-8 max-w-7xl space-y-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h1 className="text-3xl font-semibold text-foreground">Admin Settings</h1>
                    <p className="text-sm text-muted-foreground mt-1">Manage your admin preferences locally.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Badge variant="secondary">Admin Panel</Badge>
                    <Button variant="ghost" size="sm">Save changes</Button>
                </div>
            </div>

            <div className="grid gap-6 xl:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Preferences</CardTitle>
                        <CardDescription>Toggle your admin experience settings.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between rounded-3xl border border-slate-800 bg-slate-950 px-4 py-4">
                            <div>
                                <p className="font-medium text-slate-100">Dark mode</p>
                                <p className="text-sm text-slate-400">Enable the dark admin dashboard theme.</p>
                            </div>
                            <Switch checked={darkMode} onCheckedChange={setDarkMode} />
                        </div>
                        <div className="flex items-center justify-between rounded-3xl border border-slate-800 bg-slate-950 px-4 py-4">
                            <div>
                                <p className="font-medium text-slate-100">Notifications</p>
                                <p className="text-sm text-slate-400">Receive in-dashboard alerts and updates.</p>
                            </div>
                            <Switch checked={notificationsEnabled} onCheckedChange={setNotificationsEnabled} />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Account security</CardTitle>
                        <CardDescription>Update your password and logout securely.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-4 rounded-3xl border border-slate-800 bg-slate-950 p-5">
                            <div>
                                <label className="text-sm font-medium text-slate-200" htmlFor="current-password">
                                    Current password
                                </label>
                                <Input
                                    id="current-password"
                                    type="password"
                                    value={currentPassword}
                                    onChange={(event) => setCurrentPassword(event.target.value)}
                                    placeholder="Enter current password"
                                    className="mt-2 bg-slate-900 text-slate-100"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-slate-200" htmlFor="new-password">
                                    New password
                                </label>
                                <Input
                                    id="new-password"
                                    type="password"
                                    value={newPassword}
                                    onChange={(event) => setNewPassword(event.target.value)}
                                    placeholder="Enter new password"
                                    className="mt-2 bg-slate-900 text-slate-100"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-slate-200" htmlFor="confirm-password">
                                    Confirm password
                                </label>
                                <Input
                                    id="confirm-password"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(event) => setConfirmPassword(event.target.value)}
                                    placeholder="Confirm new password"
                                    className="mt-2 bg-slate-900 text-slate-100"
                                />
                            </div>
                            <Button className="w-full" variant="secondary">
                                Update password
                            </Button>
                        </div>
                        <div className="rounded-3xl border border-slate-800 bg-slate-950 p-5">
                            <p className="text-sm font-medium text-slate-100">Logout</p>
                            <p className="mt-2 text-sm text-slate-400">Sign out of the admin panel session.</p>
                            <Button variant="destructive" className="mt-4 w-full" onClick={handleLogout}>
                                Logout
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
