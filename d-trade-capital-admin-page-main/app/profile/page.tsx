"use client"

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const adminProfile = {
  name: 'Admin User',
  email: 'admin@dtrade.com',
  role: 'Administrator',
  joined: 'September 1, 2023',
  initials: 'AD',
}

export default function ProfilePage() {
  return (
    <div className="container mx-auto p-4 md:p-8 max-w-4xl">
      <div className="rounded-[32px] border border-slate-800 bg-slate-950/95 p-8 shadow-[0_40px_120px_-40px_rgba(15,23,42,0.8)]">
        <div className="flex flex-col gap-6 rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-inner shadow-black/10 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-5">
            <Avatar className="h-24 w-24 rounded-3xl border border-slate-800 bg-slate-800 text-slate-100">
              <AvatarFallback>{adminProfile.initials}</AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold text-slate-100">{adminProfile.name}</h1>
              <p className="text-sm text-slate-400">{adminProfile.email}</p>
              <Badge variant="secondary" className="rounded-full px-3 py-1 text-xs uppercase tracking-[0.18em] text-slate-200">
                {adminProfile.role}
              </Badge>
            </div>
          </div>
          <Button variant="secondary" size="lg">Edit Profile</Button>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-sm shadow-black/10">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Joined</p>
            <p className="mt-4 text-xl font-semibold text-slate-100">{adminProfile.joined}</p>
          </div>
          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-sm shadow-black/10 md:col-span-2">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Profile Summary</p>
            <p className="mt-4 text-sm leading-7 text-slate-300">
              This is a mock admin profile page for the DTrade Capital admin panel. Use this screen to display the administrator details and provide quick access to profile editing.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
