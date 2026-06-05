import { useState } from 'react'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Input } from '@/components/ui/input'
import { validateDeletePassword, isDeletePasswordSet } from '@/lib/delete-password'

interface PasswordConfirmationDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    itemName: string
    itemType: 'course' | 'unit' | 'lesson'
    onConfirm: () => void
    onCancel?: () => void
}

export function PasswordConfirmationDialog({
    open,
    onOpenChange,
    itemName,
    itemType,
    onConfirm,
    onCancel,
}: PasswordConfirmationDialogProps) {
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const passwordRequired = isDeletePasswordSet()

    const handleConfirm = () => {
        setError('')

        if (!passwordRequired) {
            // No password set - show warning
            setError('Please set a Delete Protection Password in Settings first.')
            return
        }

        if (!password) {
            setError('Password is required')
            return
        }

        if (!validateDeletePassword(password)) {
            setError('Incorrect delete protection password.')
            return
        }

        // Password is correct
        onConfirm()
        setPassword('')
        onOpenChange(false)
    }

    const handleCancel = () => {
        setPassword('')
        setError('')
        onCancel?.()
        onOpenChange(false)
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className="max-w-md">
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete Protection</AlertDialogTitle>
                </AlertDialogHeader>

                <div className="space-y-4 py-4">
                    {!passwordRequired ? (
                        <div className="rounded-lg bg-yellow-900/20 border border-yellow-800 p-3">
                            <p className="text-sm text-yellow-200">
                                Please set a Delete Protection Password in Settings first.
                            </p>
                        </div>
                    ) : (
                        <>
                            <div>
                                <label className="text-sm font-medium text-foreground" htmlFor="delete-password">
                                    Enter Delete Password to delete "{itemName}"
                                </label>
                                <Input
                                    id="delete-password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value)
                                        setError('')
                                    }}
                                    placeholder="Enter password"
                                    className="mt-2 bg-background"
                                    autoFocus
                                />
                            </div>
                            {error && (
                                <div className="rounded-lg bg-red-900/20 border border-red-800 p-2">
                                    <p className="text-sm text-red-200">{error}</p>
                                </div>
                            )}
                        </>
                    )}
                </div>

                <AlertDialogFooter>
                    <AlertDialogCancel onClick={handleCancel}>Cancel</AlertDialogCancel>
                    {passwordRequired && (
                        <AlertDialogAction
                            onClick={handleConfirm}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            Delete
                        </AlertDialogAction>
                    )}
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
