"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { setDeletePassword, getDeletePassword, clearDeletePassword } from "@/lib/delete-password"

export default function SettingsPage() {
    const [darkMode, setDarkMode] = useState(true)
    const [notificationsEnabled, setNotificationsEnabled] = useState(true)
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    // Delete password protection states
    const [deleteProtectionPassword, setDeleteProtectionPassword] = useState('')
    const [deleteProtectionConfirm, setDeleteProtectionConfirm] = useState('')
    const [deleteProtectionMessage, setDeleteProtectionMessage] = useState('')
    const [isDeletePasswordSet, setIsDeletePasswordSet] = useState(false)

    // Dialog states
    const [clearPasswordDialogOpen, setClearPasswordDialogOpen] = useState(false)
    const [logoutDialogOpen, setLogoutDialogOpen] = useState(false)
    const [logoutMessage, setLogoutMessage] = useState('')

    useEffect(() => {
        const password = getDeletePassword()
        setIsDeletePasswordSet(!!password)
    }, [])

    const handleSaveDeletePassword = () => {
        setDeleteProtectionMessage('')

        if (!deleteProtectionPassword.trim()) {
            setDeleteProtectionMessage('Password cannot be empty')
            return
        }

        if (deleteProtectionPassword !== deleteProtectionConfirm) {
            setDeleteProtectionMessage('Passwords do not match')
            return
        }

        if (deleteProtectionPassword.length < 4) {
            setDeleteProtectionMessage('Password must be at least 4 characters')
            return
        }

        const success = setDeletePassword(deleteProtectionPassword)
        if (success) {
            setDeleteProtectionMessage('Delete password saved successfully!')
            setDeleteProtectionPassword('')
            setDeleteProtectionConfirm('')
            setIsDeletePasswordSet(true)
            setTimeout(() => setDeleteProtectionMessage(''), 3000)
        }
    }

    const handleClearDeletePassword = () => {
        setClearPasswordDialogOpen(true)
    }

    const handleConfirmClearPassword = () => {
        clearDeletePassword()
        setIsDeletePasswordSet(false)
        setDeleteProtectionPassword('')
        setDeleteProtectionConfirm('')
        setDeleteProtectionMessage('Delete password removed')
        setClearPasswordDialogOpen(false)
        setTimeout(() => setDeleteProtectionMessage(''), 2000)
    }

    const handleLogout = () => {
        setLogoutDialogOpen(true)
    }

    const handleConfirmLogout = () => {
        setLogoutMessage('Logged out (mock)')
        setLogoutDialogOpen(false)
        setTimeout(() => setLogoutMessage(''), 2000)
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

                <Card className="xl:col-span-1">
                    <CardHeader>
                        <CardTitle>Delete Protection</CardTitle>
                        <CardDescription>Protect deletions with a password.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-4 rounded-3xl border border-slate-800 bg-slate-950 p-5">
                            {isDeletePasswordSet && (
                                <div className="rounded-lg bg-green-900/20 border border-green-800 p-3">
                                    <p className="text-xs font-medium text-green-200">✓ Delete password is active</p>
                                </div>
                            )}
                            <div>
                                <label className="text-sm font-medium text-slate-200" htmlFor="delete-protection-password">
                                    Delete Protection Password
                                </label>
                                <Input
                                    id="delete-protection-password"
                                    type="password"
                                    value={deleteProtectionPassword}
                                    onChange={(event) => setDeleteProtectionPassword(event.target.value)}
                                    placeholder="Enter a password to protect deletions"
                                    className="mt-2 bg-slate-900 text-slate-100"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-slate-200" htmlFor="delete-protection-confirm">
                                    Confirm Password
                                </label>
                                <Input
                                    id="delete-protection-confirm"
                                    type="password"
                                    value={deleteProtectionConfirm}
                                    onChange={(event) => setDeleteProtectionConfirm(event.target.value)}
                                    placeholder="Confirm the password"
                                    className="mt-2 bg-slate-900 text-slate-100"
                                />
                            </div>
                            {deleteProtectionMessage && (
                                <div className={`rounded-lg p-3 text-xs font-medium ${deleteProtectionMessage.includes('successfully') || deleteProtectionMessage.includes('removed')
                                    ? 'bg-green-900/20 border border-green-800 text-green-200'
                                    : deleteProtectionMessage.includes('cannot be empty') || deleteProtectionMessage.includes('do not match') || deleteProtectionMessage.includes('at least')
                                        ? 'bg-red-900/20 border border-red-800 text-red-200'
                                        : 'bg-blue-900/20 border border-blue-800 text-blue-200'
                                    }`}>
                                    {deleteProtectionMessage}
                                </div>
                            )}
                            <Button
                                className="w-full"
                                variant="secondary"
                                onClick={handleSaveDeletePassword}
                            >
                                Save Password
                            </Button>
                            {isDeletePasswordSet && (
                                <Button
                                    className="w-full text-red-600 border-red-600 hover:bg-red-900/10"
                                    variant="outline"
                                    onClick={handleClearDeletePassword}
                                >
                                    Remove Password Protection
                                </Button>
                            )}
                        </div>
                        <div className="rounded-3xl border border-slate-800 bg-slate-950 p-5">
                            <p className="text-xs font-medium text-slate-300">ℹ️ How it works</p>
                            <p className="mt-2 text-xs text-slate-400">
                                When a password is set, you'll need to enter it to delete courses, units, or lessons. This helps prevent accidental deletions.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Clear Password Confirmation Dialog */}
            <Dialog open={clearPasswordDialogOpen} onOpenChange={setClearPasswordDialogOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Remove Delete Protection</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to remove the delete protection password? You'll be able to delete courses, units, and lessons without entering a password.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setClearPasswordDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleConfirmClearPassword}>
                            Remove
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Logout Confirmation Dialog */}
            <Dialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Logout</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to logout from the admin panel?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setLogoutDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleConfirmLogout}>
                            Logout
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Logout Success Message */}
            {logoutMessage && (
                <div className="fixed bottom-4 right-4 rounded-lg bg-green-900/20 border border-green-800 p-3">
                    <p className="text-sm text-green-200">{logoutMessage}</p>
                </div>
            )}
        </div>
    )
}           