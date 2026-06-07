import { MouseEvent, useEffect, useState } from 'react'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Input } from '@/components/ui/input'
import { validateDeletePassword, isDeletePasswordSet } from '@/lib/delete-password'
import { Eye, EyeOff } from 'lucide-react'

export type DeleteItemType =
    | 'course'
    | 'unit'
    | 'lesson'
    | 'cheat-sheet'
    | 'quiz'
    | 'video-attachment'
    | 'note'
    | 'comment'

interface PasswordConfirmationDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    itemName: string
    itemType: DeleteItemType
    onConfirm: () => void
    onCancel?: () => void
}

export function PasswordConfirmationDialog({
    open,
    onOpenChange,
    itemName,
    onConfirm,
    onCancel,
}: PasswordConfirmationDialogProps) {
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const passwordRequired = isDeletePasswordSet()

    useEffect(() => {
        if (open) {
            setPassword('')
            setError('')
            setShowPassword(false)
        }
    }, [open])

    const handleConfirm = (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
        setError('')

        if (!passwordRequired) {
            setError('Please set a Delete Protection Password in Settings first.')
            return
        }

        if (!password) {
            setError('Password is required')
            return
        }

        if (!validateDeletePassword(password)) {
            setError('Incorrect password')
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
        setShowPassword(false)
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
                                    {itemName
                                        ? `Enter delete protection password to delete "${itemName}"`
                                        : 'Enter delete protection password to confirm deletion'}
                                </label>
                                <div className="relative mt-2">
                                    <Input
                                        id="delete-password"
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => {
                                            setPassword(e.target.value)
                                            setError('')
                                        }}
                                        placeholder="Enter delete protection password"
                                        className="bg-background pr-11"
                                        autoComplete="new-password"
                                        autoFocus
                                    />
                                    <button
                                        type="button"
                                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                                        onClick={() => setShowPassword((current) => !current)}
                                        className="absolute right-3 top-1/2 inline-flex -translate-y-1/2 text-muted-foreground transition hover:text-foreground"
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>
                            {error && (
                                <p className="text-sm font-medium text-red-400">{error}</p>
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
