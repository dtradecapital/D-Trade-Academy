'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Users,
  BookOpen,
  DollarSign,
  UserCheck,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  Clock,
  AlertCircle,
  CheckCircle,
  RefreshCcw,
  XCircle,
  Plus,
  Wrench,
  UserPlus,
  Wifi,
  FileWarning,
  GraduationCap,
  ShieldCheck,
  Wallet,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  dashboardStats,
  monthlyRevenue,
  weeklyRevenue,
  courses,
  transactions,
  userEnrollments,
  userGrowth,
  supportTickets,
  tools,
  instructorPayouts,
  coursePopularity,
} from '@/lib/mock-data'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'

// User breakdown for pie chart
const userBreakdown = [
  { name: 'Students', value: dashboardStats.totalStudents, color: 'oklch(0.7 0.18 160)' },
  { name: 'Instructors', value: dashboardStats.totalInstructors, color: 'oklch(0.65 0.15 250)' },
  { name: 'Admins', value: dashboardStats.totalAdmins, color: 'oklch(0.75 0.18 45)' },
]

// Course status breakdown
const courseBreakdown = [
  { name: 'Published', value: dashboardStats.publishedCourses, color: 'oklch(0.7 0.18 160)' },
  { name: 'Pending', value: dashboardStats.pendingCourses, color: 'oklch(0.75 0.18 45)' },
  { name: 'Draft', value: dashboardStats.draftCourses, color: 'oklch(0.65 0.15 250)' },
  { name: 'Archived', value: dashboardStats.archivedCourses, color: 'oklch(0.5 0 0)' },
]

const STORAGE_KEY = 'admin-courses'

export default function DashboardPage() {
  const recentTransactions = transactions.slice(0, 6)
  const [discussionSort, setDiscussionSort] = useState('Latest')
  const [discussionFilter, setDiscussionFilter] = useState('All')
  const [createdThreads, setCreatedThreads] = useState(0)

  const courseStats = courses.map((course) => {
    const enrollments = userEnrollments.filter((enrollment) => enrollment.courseId === course.id).length
    const revenue = transactions
      .filter((transaction) => transaction.courseId === course.id && transaction.status === 'Completed')
      .reduce((sum, transaction) => sum + transaction.amount, 0)

    return {
      ...course,
      enrollments,
      revenue,
    }
  })
  const topCoursesByEnrollment = [...courseStats]
    .sort((a, b) => b.enrollments - a.enrollments)
    .slice(0, 5)
  const topCoursesByRevenue = [...courseStats]
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5)
  const openSupportTickets = supportTickets.filter(t => t.status === 'Open' || t.status === 'In Progress')
  const pendingApprovals = instructorPayouts.filter(p => p.status === 'Requested' || p.status === 'Processing')
  const pendingCourses = courseStats.slice(0, 2)


  return (
    <div className="flex min-h-screen flex-col bg-background">
      <main className="flex-1 p-4 md:p-6 space-y-6">
        <div className="space-y-5">
          <div className="flex flex-col gap-4 items-start justify-start">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Trading Insights</h1>
              <p className="text-muted-foreground">Track user growth, trading activity, and platform performance in real-time</p>
            </div>
          </div>

        </div>

        {/* Primary Stats Row */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
              <Users className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardStats.totalUsers.toLocaleString()}</div>
              <div className="mt-1 flex items-center gap-1 text-xs">
                <TrendingUp className="size-3 text-primary" />
                <span className="text-primary">{dashboardStats.monthlyGrowth.users}%</span>
                <span className="text-muted-foreground">from last month</span>
              </div>
              <div className="mt-2 flex gap-2 text-xs text-muted-foreground">
                <span>{dashboardStats.totalStudents} students</span>
                <span>|</span>
                <span>{dashboardStats.totalInstructors} instructors</span>
                <span>|</span>
                <span>{dashboardStats.totalAdmins} admins</span>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Trading Videos</CardTitle>
              <BookOpen className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.max(45, dashboardStats.totalCourses)}</div>
              <div className="mt-1 flex items-center gap-1 text-xs">
                <TrendingUp className="size-3 text-primary" />
                <span className="text-primary">{dashboardStats.monthlyGrowth.courses}%</span>
                <span className="text-muted-foreground">from last month</span>
              </div>
              <div className="mt-2 flex gap-2 text-xs text-muted-foreground">
                <span className="text-primary">{Math.max(35, dashboardStats.publishedCourses)} published</span>
                <span>|</span>
                <span className="text-warning">{Math.max(10, dashboardStats.pendingCourses)} pending</span>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
              <DollarSign className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${(dashboardStats.totalRevenue / 1000).toFixed(0)}K</div>
              <div className="mt-1 flex items-center gap-1 text-xs">
                <TrendingUp className="size-3 text-primary" />
                <span className="text-primary">{dashboardStats.monthlyGrowth.revenue}%</span>
                <span className="text-muted-foreground">from last month</span>
              </div>
              <div className="mt-2 text-xs text-muted-foreground">
                This month: ${dashboardStats.revenueThisMonth.toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Tools & Resources</CardTitle>
              <Wrench className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardStats.totalTools}</div>
              <div className="mt-1 flex items-center gap-1 text-xs">
                <CheckCircle className="size-3 text-primary" />
                <span className="text-primary">{dashboardStats.activeTools} active</span>
                <span className="text-muted-foreground">| 1 in maintenance</span>
              </div>
              <div className="mt-2 text-xs text-muted-foreground">
                {tools.reduce((acc, t) => acc + t.usageCount, 0).toLocaleString()} total uses
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Secondary Stats Row - Real-time Activity */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Revenue Today</p>
                  <p className="text-xl font-bold text-primary">${dashboardStats.revenueToday.toLocaleString()}</p>
                </div>
                <DollarSign className="size-8 text-primary/40" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-chart-2/5 border-chart-2/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">This Week</p>
                  <p className="text-xl font-bold" style={{ color: 'oklch(0.65 0.15 250)' }}>${dashboardStats.revenueThisWeek.toLocaleString()}</p>
                </div>
                <TrendingUp className="size-8" style={{ color: 'oklch(0.65 0.15 250 / 0.4)' }} />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-chart-3/5 border-chart-3/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">New Signups Today</p>
                  <p className="text-xl font-bold" style={{ color: 'oklch(0.75 0.18 45)' }}>{dashboardStats.newSignupsToday}</p>
                </div>
                <UserPlus className="size-8" style={{ color: 'oklch(0.75 0.18 45 / 0.4)' }} />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-chart-4/5 border-chart-4/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Active Sessions</p>
                  <p className="text-xl font-bold" style={{ color: 'oklch(0.6 0.18 300)' }}>{dashboardStats.activeSessions}</p>
                </div>
                <Wifi className="size-8" style={{ color: 'oklch(0.6 0.18 300 / 0.4)' }} />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-destructive/5 border-destructive/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Open Tickets</p>
                  <p className="text-xl font-bold text-destructive">{dashboardStats.openTickets}</p>
                </div>
                <FileWarning className="size-8 text-destructive/40" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border border-border bg-card">
          <CardHeader>
            <div className="flex items-start justify-between gap-2">
              <div>
                <CardTitle>Trading Video Cheat Sheets</CardTitle>
                <CardDescription>Short trading lessons with summary takeaways</CardDescription>
              </div>
              <Link href="/videos" className="text-xs font-medium text-primary hover:underline">Open Videos</Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-lg border border-border p-3">
                <p className="font-semibold">1. Support/Resistance</p>
                <p className="text-xs text-muted-foreground mt-1">Trade with the trend, only take reversal entries at high-confidence levels.</p>
              </div>
              <div className="rounded-lg border border-border p-3">
                <p className="font-semibold">2. Risk Checklist</p>
                <p className="text-xs text-muted-foreground mt-1">Max 1% risk per trade, set stop first, target min 2x risk.</p>
              </div>
              <div className="rounded-lg border border-border p-3">
                <p className="font-semibold">3. Momentum Entry</p>
                <p className="text-xs text-muted-foreground mt-1">Use volume confirmation and price action candle structure for entries.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pending Approvals Section */}
        <Card className="border-warning/30 bg-warning/5">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="size-5 text-warning" />
                <CardTitle className="text-base">Pending Approvals</CardTitle>
              </div>
              <Badge variant="secondary" className="bg-warning/20 text-warning">
                {dashboardStats.pendingCourseApprovals + dashboardStats.pendingWithdrawals} items
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="flex items-center justify-between rounded-lg bg-background p-3">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-chart-3/20 p-2">
                    <BookOpen className="size-4" style={{ color: 'oklch(0.75 0.18 45)' }} />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Courses</p>
                    <p className="text-xs text-muted-foreground">{dashboardStats.pendingCourseApprovals} awaiting review</p>
                  </div>
                </div>
                <Link href="/courses?status=pending">
                  <Button size="sm" variant="ghost">
                    Review <ArrowUpRight className="ml-1 size-3" />
                  </Button>
                </Link>
              </div>

              <div className="flex items-center justify-between rounded-lg bg-background p-3">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-chart-2/20 p-2">
                    <GraduationCap className="size-4" style={{ color: 'oklch(0.65 0.15 250)' }} />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Instructors</p>
                    <p className="text-xs text-muted-foreground">{dashboardStats.pendingInstructorApprovals} pending</p>
                  </div>
                </div>
                <Link href="/users?role=instructor">
                  <Button size="sm" variant="ghost">
                    Review <ArrowUpRight className="ml-1 size-3" />
                  </Button>
                </Link>
              </div>

              <div className="flex items-center justify-between rounded-lg bg-background p-3">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-primary/20 p-2">
                    <Wallet className="size-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Withdrawals</p>
                    <p className="text-xs text-muted-foreground">{dashboardStats.pendingWithdrawals} requests</p>
                  </div>
                </div>
                <Link href="/payouts">
                  <Button size="sm" variant="ghost">
                    Process <ArrowUpRight className="ml-1 size-3" />
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border bg-card">
          <CardHeader>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold uppercase tracking-[0.2em]">DISCUSSIONS</h2>
                <RefreshCcw className="size-4 text-muted-foreground" />
              </div>
              <Button variant="secondary" onClick={() => setCreatedThreads((count) => count + 1)}>
                <Plus className="mr-2 h-4 w-4" />
                New Thread
              </Button>
            </div>
            <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  SORT BY
                  <select
                    value={discussionSort}
                    onChange={(event) => setDiscussionSort(event.target.value)}
                    className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none"
                  >
                    <option>Latest</option>
                    <option>Oldest</option>
                    <option>Most Active</option>
                  </select>
                </label>
                <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  FILTERS
                  <select
                    value={discussionFilter}
                    onChange={(event) => setDiscussionFilter(event.target.value)}
                    className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none"
                  >
                    <option>All</option>
                    <option>Posted by Me</option>
                    <option>Not Clarified</option>
                  </select>
                </label>
              </div>
              <div className="text-sm text-muted-foreground">
                {createdThreads} new thread{createdThreads === 1 ? '' : 's'} created
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Revenue Charts */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Monthly Revenue Chart */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Revenue Overview</CardTitle>
                  <CardDescription>Monthly revenue trends</CardDescription>
                </div>
                <Tabs defaultValue="monthly" className="w-auto">
                  <TabsList className="h-8">
                    <TabsTrigger value="weekly" className="text-xs px-2 h-6">Week</TabsTrigger>
                    <TabsTrigger value="monthly" className="text-xs px-2 h-6">Year</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyRevenue}>
                    <defs>
                      <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="oklch(0.7 0.18 160)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="oklch(0.7 0.18 160)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="month" className="text-xs fill-muted-foreground" tick={{ fontSize: 11 }} />
                    <YAxis className="text-xs fill-muted-foreground" tick={{ fontSize: 11 }} tickFormatter={(value) => `$${value / 1000}K`} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'oklch(0.16 0.005 260)',
                        border: '1px solid oklch(0.26 0.005 260)',
                        borderRadius: '8px',
                      }}
                      labelStyle={{ color: 'oklch(0.95 0 0)' }}
                      formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="oklch(0.7 0.18 160)"
                      strokeWidth={2}
                      fill="url(#revenueGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Weekly Revenue */}
          <Card>
            <CardHeader>
              <CardTitle>This Week</CardTitle>
              <CardDescription>Daily revenue breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyRevenue}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="day" className="text-xs fill-muted-foreground" tick={{ fontSize: 11 }} />
                    <YAxis className="text-xs fill-muted-foreground" tick={{ fontSize: 11 }} tickFormatter={(value) => `$${value / 1000}K`} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'oklch(0.16 0.005 260)',
                        border: '1px solid oklch(0.26 0.005 260)',
                        borderRadius: '8px',
                      }}
                      labelStyle={{ color: 'oklch(0.95 0 0)' }}
                      formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']}
                    />
                    <Bar dataKey="revenue" fill="oklch(0.65 0.15 250)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* User Growth & Distribution */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* User Growth Chart */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>User Growth</CardTitle>
              <CardDescription>Students and instructors over the past year</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={userGrowth}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="month" className="text-xs fill-muted-foreground" tick={{ fontSize: 11 }} />
                    <YAxis className="text-xs fill-muted-foreground" tick={{ fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'oklch(0.16 0.005 260)',
                        border: '1px solid oklch(0.26 0.005 260)',
                        borderRadius: '8px',
                      }}
                      labelStyle={{ color: 'oklch(0.95 0 0)' }}
                    />
                    <Legend />
                    <Bar dataKey="students" name="Students" fill="oklch(0.7 0.18 160)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="instructors" name="Instructors" fill="oklch(0.65 0.15 250)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* User Distribution Pie */}
          <Card>
            <CardHeader>
              <CardTitle>User Distribution</CardTitle>
              <CardDescription>Breakdown by role</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={userBreakdown}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {userBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'oklch(0.16 0.005 260)',
                        border: '1px solid oklch(0.26 0.005 260)',
                        borderRadius: '8px',
                      }}
                      formatter={(value: number) => [value.toLocaleString(), 'Users']}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Courses Section */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Top Courses by Enrollment */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Top Courses by Enrollment</CardTitle>
                <CardDescription>Most popular courses by student count</CardDescription>
              </div>
              <Link href="/courses">
                <Badge variant="secondary" className="cursor-pointer">
                  View All <ArrowUpRight className="ml-1 size-3" />
                </Badge>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topCoursesByEnrollment.map((course, index) => (
                  <div key={course.id} className="flex items-center gap-4">
                    <div className="flex size-8 items-center justify-center rounded-full bg-muted text-sm font-medium">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{course.title}</p>
                      <p className="text-xs text-muted-foreground">{course.unitCount} units</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{course.enrollments.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">students</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Courses by Revenue */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Top Courses by Revenue</CardTitle>
                <CardDescription>Highest earning courses</CardDescription>
              </div>
              <Link href="/reports">
                <Badge variant="secondary" className="cursor-pointer">
                  Full Report <ArrowUpRight className="ml-1 size-3" />
                </Badge>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topCoursesByRevenue.map((course, index) => (
                  <div key={course.id} className="flex items-center gap-4">
                    <div className="flex size-8 items-center justify-center rounded-full bg-primary/20 text-sm font-medium text-primary">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{course.title}</p>
                      <p className="text-xs text-muted-foreground">{course.unitCount} units</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-primary">${course.revenue.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">{course.enrollments} enrolled</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity Section */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Recent Transactions */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>Latest payment activities</CardDescription>
              </div>
              <Link href="/payments">
                <Badge variant="secondary" className="cursor-pointer">
                  View All <ArrowUpRight className="ml-1 size-3" />
                </Badge>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                    <div className="flex items-center gap-3">
                      <div className={`rounded-full p-2 ${transaction.status === 'Completed' ? 'bg-primary/20' :
                        transaction.status === 'Pending' ? 'bg-warning/20' :
                          transaction.status === 'Failed' ? 'bg-destructive/20' :
                            'bg-muted'
                        }`}>
                        {transaction.status === 'Completed' ? <CheckCircle className="size-4 text-primary" /> :
                          transaction.status === 'Pending' ? <Clock className="size-4 text-warning" /> :
                            transaction.status === 'Failed' ? <XCircle className="size-4 text-destructive" /> :
                              <ArrowUpRight className="size-4 text-muted-foreground" />}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{transaction.userName}</p>
                        <p className="text-xs text-muted-foreground truncate max-w-[150px]">{transaction.courseName}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">${transaction.amount}</p>
                      <Badge
                        variant="secondary"
                        className={`text-xs ${transaction.status === 'Completed' ? 'bg-primary/20 text-primary' :
                          transaction.status === 'Pending' ? 'bg-warning/20 text-warning' :
                            transaction.status === 'Failed' ? 'bg-destructive/20 text-destructive' :
                              ''
                          }`}
                      >
                        {transaction.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Support Tickets / Flags */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Support Tickets</CardTitle>
                <CardDescription>Issues requiring attention</CardDescription>
              </div>
              <Badge variant="destructive" className="bg-destructive/20 text-destructive">
                {dashboardStats.highPriorityTickets} High Priority
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {openSupportTickets.map((ticket) => (
                  <div key={ticket.id} className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                    <div className="flex items-center gap-3">
                      <div className={`rounded-full p-2 ${ticket.priority === 'High' || ticket.priority === 'Urgent' ? 'bg-destructive/20' :
                        ticket.priority === 'Medium' ? 'bg-warning/20' :
                          'bg-muted'
                        }`}>
                        <AlertCircle className={`size-4 ${ticket.priority === 'High' || ticket.priority === 'Urgent' ? 'text-destructive' :
                          ticket.priority === 'Medium' ? 'text-warning' :
                            'text-muted-foreground'
                          }`} />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{ticket.subject}</p>
                        <p className="text-xs text-muted-foreground">{ticket.userName} - {ticket.category}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <Badge
                        variant="secondary"
                        className={`text-xs ${ticket.priority === 'High' || ticket.priority === 'Urgent' ? 'bg-destructive/20 text-destructive' :
                          ticket.priority === 'Medium' ? 'bg-warning/20 text-warning' :
                            ''
                          }`}
                      >
                        {ticket.priority}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {ticket.status}
                      </Badge>
                    </div>
                  </div>
                ))}
                {openSupportTickets.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <CheckCircle className="size-8 text-primary mb-2" />
                    <p className="text-sm text-muted-foreground">No open tickets</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Courses Pending Approval */}
        {pendingCourses.length > 0 && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Courses Pending Approval</CardTitle>
                <CardDescription>Review and approve new course submissions</CardDescription>
              </div>
              <Link href="/courses?status=pending">
                <Button size="sm">
                  Review All <ArrowUpRight className="ml-1 size-3" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {pendingCourses.map((course) => (
                  <div key={course.id} className="flex items-center justify-between rounded-lg border p-4">
                    <div>
                      <p className="font-medium">{course.title}</p>
                      <p className="text-sm text-muted-foreground">{course.durationWeeks} week course</p>
                      <div className="mt-2 flex items-center gap-2">
                        <Badge variant="secondary">{course.unitCount} units</Badge>
                        <span className="text-sm text-muted-foreground">${(course.unitCount * 49).toFixed(0)}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">Reject</Button>
                      <Button size="sm">Approve</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
