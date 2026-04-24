'use client'

import { useState, useMemo } from 'react'
import { Search, MoreHorizontal, Wallet, DollarSign, Filter, Download, CheckCircle, Clock, RefreshCw, BookOpen, Send } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'
import { instructorPayouts, instructorEarningsData } from '@/lib/mock-data'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'

export default function PayoutsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [isPayoutDialogOpen, setIsPayoutDialogOpen] = useState(false)

  const filteredPayouts = useMemo(() => {
    return instructorPayouts.filter((payout) => {
      const matchesSearch = payout.instructorName.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = statusFilter === 'all' || payout.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [searchQuery, statusFilter])

  const stats = useMemo(() => {
    const totalRevenue = instructorPayouts.reduce((sum, p) => sum + p.courseRevenue, 0)
    const totalCommission = instructorPayouts.reduce((sum, p) => sum + p.platformCommission, 0)
    const totalEarnings = instructorPayouts.reduce((sum, p) => sum + p.instructorEarnings, 0)
    const pendingPayouts = instructorPayouts.filter((p) => p.status === 'Pending')
    const pendingAmount = pendingPayouts.reduce((sum, p) => sum + p.instructorEarnings, 0)
    return { totalRevenue, totalCommission, totalEarnings, pendingAmount, pendingCount: pendingPayouts.length }
  }, [])

  const getInitials = (name: string) => {
    return name.split(' ').map((n) => n[0]).join('').toUpperCase()
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Paid':
        return <CheckCircle className="size-4 text-primary" />
      case 'Pending':
        return <Clock className="size-4 text-chart-3" />
      case 'Processing':
        return <RefreshCw className="size-4 text-chart-2" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid':
        return 'bg-primary/20 text-primary hover:bg-primary/30'
      case 'Pending':
        return 'bg-chart-3/20 text-chart-3 hover:bg-chart-3/30'
      case 'Processing':
        return 'bg-chart-2/20 text-chart-2 hover:bg-chart-2/30'
      default:
        return ''
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <main className="flex-1 p-4 md:p-6 space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Instructor Payouts</h1>
            <p className="text-muted-foreground">Manage instructor earnings and commission splits</p>
          </div>
          <Dialog open={isPayoutDialogOpen} onOpenChange={setIsPayoutDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Send className="mr-2 size-4" />
                Process Payouts
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Process Pending Payouts</DialogTitle>
                <DialogDescription>
                  This will process all pending payouts for instructors.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="rounded-lg bg-muted p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Pending Payouts</span>
                    <span className="font-semibold">{stats.pendingCount}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total Amount</span>
                    <span className="text-lg font-bold text-primary">${stats.pendingAmount.toLocaleString()}</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Are you sure you want to process all pending payouts? This action will initiate bank transfers to all instructors with pending balances.
                </p>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsPayoutDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsPayoutDialogOpen(false)}>
                  Confirm & Process
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Course Revenue</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Gross revenue from all courses</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Platform Commission (20%)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-chart-2">${stats.totalCommission.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Platform earnings</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Instructor Earnings (80%)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">${stats.totalEarnings.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Total instructor payouts</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Pending Payouts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-chart-3">${stats.pendingAmount.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">{stats.pendingCount} instructors waiting</p>
            </CardContent>
          </Card>
        </div>

        {/* Earnings Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Instructor Earnings Overview</CardTitle>
            <CardDescription>Comparison of instructor earnings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={instructorEarningsData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis type="number" className="text-xs fill-muted-foreground" tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`} />
                  <YAxis type="category" dataKey="name" className="text-xs fill-muted-foreground" width={100} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'oklch(0.16 0.005 260)',
                      border: '1px solid oklch(0.26 0.005 260)',
                      borderRadius: '8px',
                    }}
                    labelStyle={{ color: 'oklch(0.95 0 0)' }}
                    formatter={(value: number) => [`$${value.toLocaleString()}`, 'Earnings']}
                  />
                  <Bar dataKey="earnings" fill="oklch(0.7 0.18 160)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Payouts Table */}
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <CardTitle>All Payouts</CardTitle>
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search instructors..."
                    className="w-[200px] pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[140px]">
                    <Filter className="mr-2 size-4" />
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="Paid">Paid</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Processing">Processing</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon">
                  <Download className="size-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Instructor</TableHead>
                  <TableHead>Courses</TableHead>
                  <TableHead>Course Revenue</TableHead>
                  <TableHead>Commission (20%)</TableHead>
                  <TableHead>Earnings (80%)</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayouts.map((payout) => (
                  <TableRow key={payout.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {getInitials(payout.instructorName)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{payout.instructorName}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <BookOpen className="size-4 text-muted-foreground" />
                        <span>{payout.courses}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">${payout.courseRevenue.toLocaleString()}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-muted-foreground">${payout.platformCommission.toLocaleString()}</span>
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold text-primary">${payout.instructorEarnings.toLocaleString()}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={getStatusColor(payout.status)}>
                        <span className="flex items-center gap-1">
                          {getStatusIcon(payout.status)}
                          {payout.status}
                        </span>
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>View Courses</DropdownMenuItem>
                          {payout.status === 'Pending' && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>Process Payout</DropdownMenuItem>
                            </>
                          )}
                          <DropdownMenuItem>Download Statement</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
