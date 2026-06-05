// Delete Password Management Utility
const STORAGE_KEY = 'admin-delete-password'

export const getDeletePassword = (): string | null => {
    if (typeof window === 'undefined') return null
    return localStorage.getItem(STORAGE_KEY)
}

export const setDeletePassword = (password: string): boolean => {
    if (typeof window === 'undefined') return false
    if (!password || password.trim().length === 0) return false
    localStorage.setItem(STORAGE_KEY, password)
    return true
}

export const validateDeletePassword = (enteredPassword: string): boolean => {
    if (typeof window === 'undefined') return false
    const storedPassword = getDeletePassword()
    if (!storedPassword) return false
    return enteredPassword === storedPassword
}

export const isDeletePasswordSet = (): boolean => {
    return getDeletePassword() !== null && getDeletePassword() !== ''
}

export const clearDeletePassword = (): void => {
    if (typeof window === 'undefined') return
    localStorage.removeItem(STORAGE_KEY)
}
