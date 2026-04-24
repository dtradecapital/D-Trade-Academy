'use client'

import { useState, useMemo } from 'react'
import { Search, MoreHorizontal, CreditCard, Calendar, Filter, Download, RefreshCw, CheckCircle, XCircle, Clock } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
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
import { transactions } from '@/lib/mock-data'

export default function PaymentsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [methodFilter, setMethodFilter] = useState<string>('all')

  const paymentMethods = useMemo(() => {
    return [...new Set(transactions.map((t) => t.paymentMethod))]
  }, [])

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const matchesSearch =
        transaction.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.courseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.id.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter
      const matchesMethod = methodFilter === 'all' || transaction.paymentMethod === methodFilter
      return matchesSearch && matchesStatus && matchesMethod
    })
  }, [searchQuery, statusFilter, methodFilter])

  const stats = useMemo(() => {
    const completed = transactions.filter((t) => t.status === 'Completed')
    const pending = transactions.filter((t) => t.status === 'Pending')
    const failed = transactions.filter((t) => t.status === 'Failed')
    const refunded = transactions.filter((t) => t.status === 'Refunded')
    const totalRevenue = completed.reduce((sum, t) => sum + t.amount, 0)
    const pendingAmount = pending.reduce((sum, t) => sum + t.amount, 0)
    return {
      total: transactions.length,
      completed: completed.length,
      pending: pending.length,
      failed: failed.length,
      refunded: refunded.length,
      totalRevenue,
      pendingAmount,
    }
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed':
        return <CheckCircle className="size-4 text-primary" />
      case 'Pending':
        return <Clock className="size-4 text-chart-3" />
      case 'Failed':
        return <XCircle className="size-4 text-destructive" />
      case 'Refunded':
        return <RefreshCw className="size-4 text-chart-2" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-primary/20 text-primary hover:bg-primary/30'
      case 'Pending':
        return 'bg-chart-3/20 text-chart-3 hover:bg-chart-3/30'
      case 'Failed':
        return 'bg-destructive/20 text-destructive hover:bg-destructive/30'
      case 'Refunded':
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
            <h1 className="text-2xl font-bold text-foreground">Payments & Transactions</h1>
            <p className="text-muted-foreground">Monitor and manage all payment activities</p>
          </div>
          <Button variant="outline">
            <Download className="mr-2 size-4" />
            Export Report
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Revenue</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">${stats.totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">{stats.completed} completed transactions</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Pending Amount</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-chart-3">${stats.pendingAmount.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">{stats.pending} pending transactions</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Failed Transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{stats.failed}</div>
              <p className="text-xs text-muted-foreground">Requires attention</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Refunded</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.refunded}</div>
              <p className="text-xs text-muted-foreground">This period</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Table */}
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <CardTitle>All Transactions</CardTitle>
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search transactions..."
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
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Failed">Failed</SelectItem>
                    <SelectItem value="Refunded">Refunded</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={methodFilter} onValueChange={setMethodFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Payment Method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Methods</SelectItem>
                    {paymentMethods.map((method) => (
                      <SelectItem key={method} value={method}>{method}</SelectItem>
                    ))}
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
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>
                      <code className="rounded bg-muted px-2 py-1 text-xs font-mono">
                        {transaction.id}
                      </code>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">{transaction.userName}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">{transaction.courseName}</span>
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold">${transaction.amount}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <CreditCard className="size-4 text-muted-foreground" />
                        <span className="text-sm">{transaction.paymentMethod}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={getStatusColor(transaction.status)}>
                        <span className="flex items-center gap-1">
                          {getStatusIcon(transaction.status)}
                          {transaction.status}
                        </span>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="size-3" />
                        {new Date(transaction.date).toLocaleDateString()}
                      </div>
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
                          <DropdownMenuItem>Download Receipt</DropdownMenuItem>
                          {transaction.status === 'Pending' && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>Mark as Completed</DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">Mark as Failed</DropdownMenuItem>
                            </>
                          )}
                          {transaction.status === 'Completed' && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive">Process Refund</DropdownMenuItem>
                            </>
                          )}
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
