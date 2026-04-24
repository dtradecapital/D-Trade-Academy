'use client'

import { useState, useMemo } from 'react'
import { Download, TrendingUp, TrendingDown, Users, BookOpen, DollarSign, BarChart3, PieChart as PieChartIcon, Calendar } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  monthlyRevenue,
  userGrowth,
  coursePopularity,
  instructorEarningsData,
  dashboardStats,
  courses,
  transactions,
  users
} from '@/lib/mock-data'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts'

const COLORS = ['oklch(0.7 0.18 160)', 'oklch(0.65 0.15 250)', 'oklch(0.75 0.18 45)', 'oklch(0.6 0.18 300)', 'oklch(0.7 0.2 30)']

export default function ReportsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [dateRange, setDateRange] = useState('year')

  const stats = useMemo(() => {
    const totalRevenue = transactions.filter(t => t.status === 'Completed').reduce((sum, t) => sum + t.amount, 0)
    const totalUsers = users.length
    const totalCourses = courses.length
    const avgRevenuePerUser = totalRevenue / totalUsers

    return {
      totalRevenue,
      totalUsers,
      totalCourses,
      avgRevenuePerUser,
    }
  }, [])

  const categoryData = useMemo(() => {
    const categoryMap = new Map<string, number>()
    courses.forEach((course) => {
      const existing = categoryMap.get(course.category) || 0
      categoryMap.set(course.category, existing + course.enrollments)
    })
    return Array.from(categoryMap.entries()).map(([name, value]) => ({ name, value }))
  }, [])

  const paymentMethodData = useMemo(() => {
    const methodMap = new Map<string, number>()
    transactions.forEach((t) => {
      const existing = methodMap.get(t.paymentMethod) || 0
      methodMap.set(t.paymentMethod, existing + 1)
    })
    return Array.from(methodMap.entries()).map(([name, value]) => ({ name, value }))
  }, [])

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <main className="flex-1 p-4 md:p-6 space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Reports & Analytics</h1>
            <p className="text-muted-foreground">Comprehensive platform performance metrics</p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-[150px]">
                <Calendar className="mr-2 size-4" />
                <SelectValue placeholder="Date Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Last 7 Days</SelectItem>
                <SelectItem value="month">Last 30 Days</SelectItem>
                <SelectItem value="quarter">Last Quarter</SelectItem>
                <SelectItem value="year">Last Year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="mr-2 size-4" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardDescription>Total Revenue</CardDescription>
              <DollarSign className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</div>
              <div className="flex items-center gap-1 text-xs text-primary">
                <TrendingUp className="size-3" />
                <span>+{dashboardStats.monthlyGrowth.revenue}% from last period</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardDescription>Total Users</CardDescription>
              <Users className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardStats.totalUsers.toLocaleString()}</div>
              <div className="flex items-center gap-1 text-xs text-primary">
                <TrendingUp className="size-3" />
                <span>+{dashboardStats.monthlyGrowth.users}% from last period</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardDescription>Active Courses</CardDescription>
              <BookOpen className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCourses}</div>
              <div className="flex items-center gap-1 text-xs text-primary">
                <TrendingUp className="size-3" />
                <span>+{dashboardStats.monthlyGrowth.courses}% from last period</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardDescription>Avg Revenue/User</CardDescription>
              <BarChart3 className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.avgRevenuePerUser.toFixed(2)}</div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <span>Based on completed transactions</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for different report views */}
        <Tabs defaultValue="revenue" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4 lg:w-[400px]">
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
          </TabsList>

          <TabsContent value="revenue" className="space-y-4">
            <div className="grid gap-4 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Trend</CardTitle>
                  <CardDescription>Monthly revenue over the past year</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={monthlyRevenue}>
                        <defs>
                          <linearGradient id="revenueGradient2" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="oklch(0.7 0.18 160)" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="oklch(0.7 0.18 160)" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                        <XAxis dataKey="month" className="text-xs fill-muted-foreground" />
                        <YAxis className="text-xs fill-muted-foreground" tickFormatter={(value) => `$${value / 1000}K`} />
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
                          fill="url(#revenueGradient2)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Instructor Earnings</CardTitle>
                  <CardDescription>Top instructor earnings breakdown</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={instructorEarningsData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                        <XAxis dataKey="name" className="text-xs fill-muted-foreground" />
                        <YAxis className="text-xs fill-muted-foreground" tickFormatter={(value) => `$${value / 1000}K`} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'oklch(0.16 0.005 260)',
                            border: '1px solid oklch(0.26 0.005 260)',
                            borderRadius: '8px',
                          }}
                          labelStyle={{ color: 'oklch(0.95 0 0)' }}
                          formatter={(value: number) => [`$${value.toLocaleString()}`, 'Earnings']}
                        />
                        <Bar dataKey="earnings" fill="oklch(0.65 0.15 250)" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <div className="grid gap-4 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>User Growth</CardTitle>
                  <CardDescription>Student and instructor growth over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={userGrowth}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                        <XAxis dataKey="month" className="text-xs fill-muted-foreground" />
                        <YAxis className="text-xs fill-muted-foreground" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'oklch(0.16 0.005 260)',
                            border: '1px solid oklch(0.26 0.005 260)',
                            borderRadius: '8px',
                          }}
                          labelStyle={{ color: 'oklch(0.95 0 0)' }}
                        />
                        <Legend />
                        <Line type="monotone" dataKey="students" stroke="oklch(0.7 0.18 160)" strokeWidth={2} dot={false} />
                        <Line type="monotone" dataKey="instructors" stroke="oklch(0.65 0.15 250)" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>User Distribution</CardTitle>
                  <CardDescription>Breakdown by user role</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-center">
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Students', value: users.filter(u => u.role === 'Student').length },
                            { name: 'Instructors', value: users.filter(u => u.role === 'Instructor').length },
                          ]}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {[0, 1].map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'oklch(0.16 0.005 260)',
                            border: '1px solid oklch(0.26 0.005 260)',
                            borderRadius: '8px',
                          }}
                          labelStyle={{ color: 'oklch(0.95 0 0)' }}
                        />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="courses" className="space-y-4">
            <div className="grid gap-4 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Course Popularity</CardTitle>
                  <CardDescription>Top courses by enrollment</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={coursePopularity} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                        <XAxis type="number" className="text-xs fill-muted-foreground" />
                        <YAxis type="category" dataKey="name" className="text-xs fill-muted-foreground" width={120} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'oklch(0.16 0.005 260)',
                            border: '1px solid oklch(0.26 0.005 260)',
                            borderRadius: '8px',
                          }}
                          labelStyle={{ color: 'oklch(0.95 0 0)' }}
                          formatter={(value: number) => [value.toLocaleString(), 'Enrollments']}
                        />
                        <Bar dataKey="enrollments" fill="oklch(0.75 0.18 45)" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Category Distribution</CardTitle>
                  <CardDescription>Enrollments by course category</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-center">
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {categoryData.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'oklch(0.16 0.005 260)',
                            border: '1px solid oklch(0.26 0.005 260)',
                            borderRadius: '8px',
                          }}
                          labelStyle={{ color: 'oklch(0.95 0 0)' }}
                        />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="payments" className="space-y-4">
            <div className="grid gap-4 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Transaction Status</CardTitle>
                  <CardDescription>Breakdown of transaction statuses</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-center">
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Completed', value: transactions.filter(t => t.status === 'Completed').length },
                            { name: 'Pending', value: transactions.filter(t => t.status === 'Pending').length },
                            { name: 'Failed', value: transactions.filter(t => t.status === 'Failed').length },
                            { name: 'Refunded', value: transactions.filter(t => t.status === 'Refunded').length },
                          ]}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {[0, 1, 2, 3].map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'oklch(0.16 0.005 260)',
                            border: '1px solid oklch(0.26 0.005 260)',
                            borderRadius: '8px',
                          }}
                          labelStyle={{ color: 'oklch(0.95 0 0)' }}
                        />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Payment Methods</CardTitle>
                  <CardDescription>Distribution by payment method</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={paymentMethodData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                        <XAxis dataKey="name" className="text-xs fill-muted-foreground" />
                        <YAxis className="text-xs fill-muted-foreground" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'oklch(0.16 0.005 260)',
                            border: '1px solid oklch(0.26 0.005 260)',
                            borderRadius: '8px',
                          }}
                          labelStyle={{ color: 'oklch(0.95 0 0)' }}
                          formatter={(value: number) => [value, 'Transactions']}
                        />
                        <Bar dataKey="value" fill="oklch(0.6 0.18 300)" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
