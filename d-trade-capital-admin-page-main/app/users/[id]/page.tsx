'use client'

import { use, useMemo } from 'react'
import Link from 'next/link'
import {
  ArrowLeft, Mail, Phone, MapPin, Calendar, Clock, Shield, CreditCard,
  BookOpen, Download, Activity, Ticket, LogIn, TrendingUp, TrendingDown,
  CheckCircle, XCircle, AlertCircle, Globe, Laptop, Smartphone, MoreHorizontal,
  Ban, UserCog, Send, RefreshCw
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
  users, transactions, supportTickets, userEnrollments, userTools,
  loginActivity, dTerminalData,
  type User, type Transaction, type SupportTicket, type UserEnrollment,
  type UserTool, type LoginActivity, type DTerminalData
} from '@/lib/mock-data'

interface UserProfilePageProps {
  params: Promise<{ id: string }>
}

export default function UserProfilePage({ params }: UserProfilePageProps) {
  const { id } = use(params)

  const user = useMemo(() => users.find(u => u.id === id), [id])
  const userTransactions = useMemo(() => transactions.filter(t => t.userId === id), [id])
  const userTickets = useMemo(() => supportTickets.filter(t => t.userId === id), [id])
  const enrollments = useMemo(() => userEnrollments.filter(e => e.userId === id), [id])
  const tools = useMemo(() => userTools.filter(t => t.userId === id), [id])
  const logins = useMemo(() => loginActivity.filter(l => l.userId === id), [id])
  const terminalData = useMemo(() => dTerminalData.find(d => d.userId === id), [id])

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Navbar />
        <main className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold">User Not Found</h1>
            <p className="mt-2 text-muted-foreground">The user you are looking for does not exist.</p>
            <Link href="/users">
              <Button className="mt-4">
                <ArrowLeft className="mr-2 size-4" />
                Back to Users
              </Button>
            </Link>
          </div>
        </main>
      </div>
    )
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    })
  }

  const formatDateTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    })
  }

  const totalSpent = userTransactions
    .filter(t => t.status === 'Completed')
    .reduce((sum, t) => sum + t.amount, 0)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-primary/20 text-primary'
      case 'Pending': return 'bg-warning/20 text-warning'
      case 'Failed': return 'bg-destructive/20 text-destructive'
      case 'Refunded': return 'bg-chart-2/20 text-chart-2'
      default: return ''
    }
  }

  const getTicketPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Urgent': return 'bg-destructive/20 text-destructive'
      case 'High': return 'bg-chart-5/20 text-chart-5'
      case 'Medium': return 'bg-warning/20 text-warning'
      case 'Low': return 'bg-muted text-muted-foreground'
      default: return ''
    }
  }

  const getTicketStatusColor = (status: string) => {
    switch (status) {
      case 'Open': return 'bg-chart-2/20 text-chart-2'
      case 'In Progress': return 'bg-warning/20 text-warning'
      case 'Resolved': return 'bg-primary/20 text-primary'
      case 'Closed': return 'bg-muted text-muted-foreground'
      default: return ''
    }
  }

  const getSubscriptionColor = (plan: string | undefined) => {
    switch (plan) {
      case 'Enterprise': return 'bg-chart-4/20 text-chart-4'
      case 'Pro': return 'bg-primary/20 text-primary'
      case 'Basic': return 'bg-chart-2/20 text-chart-2'
      case 'Free': return 'bg-muted text-muted-foreground'
      default: return ''
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <main className="flex-1 p-4 md:p-6 space-y-6">
        {/* Header with Back Button */}
        <div className="flex items-center gap-4">
          <Link href="/users">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="size-5" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-foreground">User Profile</h1>
            <p className="text-muted-foreground">View and manage user details</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <MoreHorizontal className="mr-2 size-4" />
                Actions
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>User Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <UserCog className="mr-2 size-4" />
                Edit Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Send className="mr-2 size-4" />
                Send Email
              </DropdownMenuItem>
              <DropdownMenuItem>
                <RefreshCw className="mr-2 size-4" />
                Reset Password
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                <Ban className="mr-2 size-4" />
                {user.status === 'Active' ? 'Suspend Account' : 'Reactivate Account'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Profile Header Card */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col gap-6 md:flex-row md:items-start">
              <Avatar className="size-24 text-3xl">
                <AvatarFallback className="bg-primary/10 text-primary">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-2xl font-bold">{user.name}</h2>
                  <Badge variant={user.role === 'Instructor' ? 'default' : user.role === 'Admin' ? 'destructive' : 'secondary'}>
                    {user.role}
                  </Badge>
                  <Badge className={user.status === 'Active' ? 'bg-primary/20 text-primary' : user.status === 'Suspended' ? 'bg-destructive/20 text-destructive' : ''}>
                    {user.status}
                  </Badge>
                </div>

                <div className="grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="size-4" />
                    <span>{user.email}</span>
                  </div>
                  {user.phone && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="size-4" />
                      <span>{user.phone}</span>
                    </div>
                  )}
                  {user.country && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="size-4" />
                      <span>{user.country}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="size-4" />
                    <span>Joined {formatDate(user.joinDate)}</span>
                  </div>
                </div>
              </div>

              {/* Subscription Card */}
              <Card className="w-full md:w-64 border-primary/20">
                <CardHeader className="pb-2">
                  <CardDescription className="flex items-center gap-2">
                    <CreditCard className="size-4" />
                    Subscription Plan
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <Badge className={getSubscriptionColor(user.subscriptionPlan)}>
                      {user.subscriptionPlan || 'Free'}
                    </Badge>
                    <Badge variant={user.subscriptionStatus === 'Active' ? 'default' : 'secondary'} className={user.subscriptionStatus === 'Active' ? 'bg-primary/20 text-primary' : ''}>
                      {user.subscriptionStatus || 'Active'}
                    </Badge>
                  </div>
                  {user.subscriptionExpiry && (
                    <p className="mt-2 text-xs text-muted-foreground">
                      Expires: {formatDate(user.subscriptionExpiry)}
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <BookOpen className="size-4" />
                Courses Enrolled
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{enrollments.length}</div>
              <p className="text-xs text-muted-foreground">
                {enrollments.filter(e => e.completionPercent === 100).length} completed
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <Download className="size-4" />
                Tools Purchased
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{tools.length}</div>
              <p className="text-xs text-muted-foreground">
                {tools.reduce((sum, t) => sum + t.downloadCount, 0)} total downloads
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <CreditCard className="size-4" />
                Total Spent
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalSpent.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                {userTransactions.length} transactions
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <Clock className="size-4" />
                Last Active
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm font-medium">
                {user.lastActive ? formatDateTime(user.lastActive) : 'Never'}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabbed Content */}
        <Tabs defaultValue="courses" className="space-y-4">
          <TabsList className="grid w-full grid-cols-6 lg:w-auto lg:inline-grid">
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="tools">Tools</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="dterminal">D Terminal</TabsTrigger>
            <TabsTrigger value="tickets">Support</TabsTrigger>
            <TabsTrigger value="logins">Logins</TabsTrigger>
          </TabsList>

          {/* Courses Tab */}
          <TabsContent value="courses" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Enrolled Courses</CardTitle>
                <CardDescription>Courses the user is enrolled in with completion progress</CardDescription>
              </CardHeader>
              <CardContent>
                {enrollments.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No courses enrolled yet</p>
                ) : (
                  <div className="space-y-4">
                    {enrollments.map((enrollment) => (
                      <div key={enrollment.courseId} className="flex items-center gap-4 rounded-lg border p-4">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">{enrollment.courseName}</h4>
                            <div className="flex items-center gap-2">
                              {enrollment.certificateIssued && (
                                <Badge className="bg-primary/20 text-primary">
                                  <CheckCircle className="mr-1 size-3" />
                                  Certified
                                </Badge>
                              )}
                              <span className="text-sm font-medium">{enrollment.completionPercent}%</span>
                            </div>
                          </div>
                          <Progress value={enrollment.completionPercent} className="h-2" />
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>Enrolled: {formatDate(enrollment.enrolledDate)}</span>
                            <span>Last accessed: {formatDateTime(enrollment.lastAccessed)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tools Tab */}
          <TabsContent value="tools" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Purchased Tools</CardTitle>
                <CardDescription>Tools and resources the user has purchased</CardDescription>
              </CardHeader>
              <CardContent>
                {tools.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No tools purchased yet</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tool Name</TableHead>
                        <TableHead>Purchase Date</TableHead>
                        <TableHead>Downloads</TableHead>
                        <TableHead>Last Download</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tools.map((tool) => (
                        <TableRow key={tool.toolId}>
                          <TableCell className="font-medium">{tool.toolName}</TableCell>
                          <TableCell>{formatDate(tool.purchasedDate)}</TableCell>
                          <TableCell>
                            <Badge variant="secondary">{tool.downloadCount}</Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {tool.lastDownload ? formatDateTime(tool.lastDownload) : 'Never'}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Transaction History</CardTitle>
                <CardDescription>All payments made by the user</CardDescription>
              </CardHeader>
              <CardContent>
                {userTransactions.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No transactions yet</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Transaction ID</TableHead>
                        <TableHead>Course</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Payment Method</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {userTransactions.map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell className="font-mono text-sm">{transaction.id}</TableCell>
                          <TableCell>{transaction.courseName}</TableCell>
                          <TableCell className="font-medium">${transaction.amount}</TableCell>
                          <TableCell>{transaction.paymentMethod}</TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(transaction.status)}>
                              {transaction.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {formatDateTime(transaction.date)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* D Terminal Tab */}
          <TabsContent value="dterminal" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="size-5" />
                  D Terminal Behavioral Data
                </CardTitle>
                <CardDescription>Trading activity and performance metrics from connected D Terminal</CardDescription>
              </CardHeader>
              <CardContent>
                {!terminalData ? (
                  <div className="text-center py-8">
                    <AlertCircle className="mx-auto size-12 text-muted-foreground" />
                    <p className="mt-4 text-muted-foreground">D Terminal not connected</p>
                    <p className="text-sm text-muted-foreground">User has not linked their D Terminal account</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Connection Status */}
                    <div className="flex items-center justify-between rounded-lg border p-4">
                      <div className="flex items-center gap-3">
                        <div className={`size-3 rounded-full ${terminalData.connected ? 'bg-primary animate-pulse' : 'bg-muted-foreground'}`} />
                        <span className="font-medium">
                          {terminalData.connected ? 'Connected' : 'Disconnected'}
                        </span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        Last sync: {formatDateTime(terminalData.lastSync)}
                      </span>
                    </div>

                    {/* Trading Stats Grid */}
                    <div className="grid gap-4 md:grid-cols-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardDescription>Total Trades</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{terminalData.totalTrades}</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-2">
                          <CardDescription>Win Rate</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className={`text-2xl font-bold ${terminalData.winRate >= 50 ? 'text-primary' : 'text-destructive'}`}>
                            {terminalData.winRate}%
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-2">
                          <CardDescription>Profit / Loss</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className={`flex items-center gap-1 text-2xl font-bold ${terminalData.profitLoss >= 0 ? 'text-primary' : 'text-destructive'}`}>
                            {terminalData.profitLoss >= 0 ? (
                              <TrendingUp className="size-5" />
                            ) : (
                              <TrendingDown className="size-5" />
                            )}
                            ${Math.abs(terminalData.profitLoss).toLocaleString()}
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-2">
                          <CardDescription>Avg Risk/Reward</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">1:{terminalData.averageRiskReward}</div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Additional Stats */}
                    <div className="grid gap-4 md:grid-cols-2">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardDescription>Trading Days</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="text-xl font-bold">{terminalData.tradingDays} days</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-2">
                          <CardDescription>Favorite Assets</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-wrap gap-2">
                            {terminalData.favoriteAssets.map((asset) => (
                              <Badge key={asset} variant="secondary">{asset}</Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Support Tickets Tab */}
          <TabsContent value="tickets" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Ticket className="size-5" />
                  Support Ticket History
                </CardTitle>
                <CardDescription>All support tickets submitted by the user</CardDescription>
              </CardHeader>
              <CardContent>
                {userTickets.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No support tickets</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Ticket ID</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {userTickets.map((ticket) => (
                        <TableRow key={ticket.id}>
                          <TableCell className="font-mono text-sm">{ticket.id}</TableCell>
                          <TableCell className="font-medium">{ticket.subject}</TableCell>
                          <TableCell>{ticket.category}</TableCell>
                          <TableCell>
                            <Badge className={getTicketPriorityColor(ticket.priority)}>
                              {ticket.priority}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={getTicketStatusColor(ticket.status)}>
                              {ticket.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {formatDateTime(ticket.createdAt)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Login Activity Tab */}
          <TabsContent value="logins" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LogIn className="size-5" />
                  Login Activity Log
                </CardTitle>
                <CardDescription>Recent login attempts with device and location info</CardDescription>
              </CardHeader>
              <CardContent>
                {logins.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No login activity recorded</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Status</TableHead>
                        <TableHead>IP Address</TableHead>
                        <TableHead>Device</TableHead>
                        <TableHead>Browser</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Timestamp</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {logins.map((login) => (
                        <TableRow key={login.id}>
                          <TableCell>
                            {login.status === 'Success' ? (
                              <Badge className="bg-primary/20 text-primary">
                                <CheckCircle className="mr-1 size-3" />
                                Success
                              </Badge>
                            ) : (
                              <Badge className="bg-destructive/20 text-destructive">
                                <XCircle className="mr-1 size-3" />
                                Failed
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="font-mono text-sm">{login.ipAddress}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {login.device.includes('iPhone') || login.device.includes('Android') ? (
                                <Smartphone className="size-4 text-muted-foreground" />
                              ) : (
                                <Laptop className="size-4 text-muted-foreground" />
                              )}
                              {login.device}
                            </div>
                          </TableCell>
                          <TableCell>{login.browser}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Globe className="size-4 text-muted-foreground" />
                              {login.location}
                            </div>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {formatDateTime(login.timestamp)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
