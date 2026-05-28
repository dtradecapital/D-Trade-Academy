'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Bell, Moon, Sun, UserCircle2, BookOpen, Users, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { notifications } from '@/lib/mock-data'

export function Navbar() {
  const pathname = usePathname()
  const [isDarkMode, setIsDarkMode] = useState(true)
  const unreadCount = notifications.filter((n) => !n.read).length
  const latestNotifications = notifications.slice(0, 4)

  const formatTimestamp = (timestamp: string) =>
    new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(new Date(timestamp))

  const navItems = [
    { title: 'Dashboard', href: '/' },
    { title: 'Learn Hub', href: '/videos', icon: BookOpen },
    { title: 'Users', href: '/users' },
    { title: 'Reports', href: '/reports' },
  ]

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle('dark')
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-2 md:px-8 md:py-3">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-3 text-sm font-semibold text-foreground">
            <div className="rounded-md bg-primary p-2 text-primary-foreground">
              <UserCircle2 className="size-4" />
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-semibold md:text-base">DTrade Capital</p>
              <p className="text-[11px] text-muted-foreground">Admin Panel</p>
            </div>
          </Link>
        </div>

        <nav className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition ${pathname === item.href
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                }`}
            >
              {item.icon ? <item.icon className="size-4" /> : null}
              {item.title}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 md:gap-3">
          <Button variant="ghost" size="icon" onClick={toggleTheme} className="size-9">
            {isDarkMode ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative size-9">
                <Bell className="size-4" />
                {unreadCount > 0 && (
                  <Badge className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full p-0 text-xs">
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 bg-slate-950 text-slate-100 border border-slate-800 shadow-lg">
              <DropdownMenuLabel className="flex items-center justify-between px-3 py-2">
                <span className="text-sm font-semibold">Notifications</span>
                {unreadCount > 0 && <Badge variant="secondary" className="text-xs">{unreadCount} new</Badge>}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="space-y-1 px-1 py-1">
                {latestNotifications.map((notification) => (
                  <DropdownMenuItem
                    key={notification.id}
                    className="cursor-pointer flex flex-col rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-left text-slate-100 transition hover:bg-slate-800 focus:bg-slate-800"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-medium">{notification.title}</span>
                      <span className="text-[11px] text-muted-foreground">{formatTimestamp(notification.timestamp)}</span>
                    </div>
                    <p className="text-xs text-slate-400">{notification.description}</p>
                  </DropdownMenuItem>
                ))}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="rounded-full">
                <Avatar className="size-9">
                  <AvatarFallback className="bg-primary text-primary-foreground">AD</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-slate-950 text-slate-100 border border-slate-800 shadow-lg">
              <DropdownMenuLabel>
                <div className="space-y-0.5">
                  <p className="text-sm font-semibold">Admin User</p>
                  <p className="text-xs text-muted-foreground">admin@dtrade.com</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile" className="w-full">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings" className="w-full">Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <button type="button" className="w-full text-left">Logout</button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
