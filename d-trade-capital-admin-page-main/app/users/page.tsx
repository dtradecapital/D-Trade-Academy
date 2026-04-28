'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Search, Edit, Trash2, Users, UserCheck, UserX, Crown, GraduationCap, Shield, Trophy, Flame, Medal, Coins, Target, Calendar } from 'lucide-react'
import { users } from '@/lib/mock-data'
import { toast } from '@/hooks/use-toast'

// Interfaces for tracking data
interface UserStats {
  id: string
  name: string
  score: number
  currentStreak: number
  bestStreak: number
  consistencyScore: number // percentage
  completedDaysThisMonth: number
  avatar?: string
}

interface MonthlyDay {
  date: number
  status: 'achieved' | 'missed' | 'holiday'
}

// Generate mock tracking data for users
function generateUserStats(): UserStats[] {
  return users
    .filter(u => u.role === 'Student')
    .map((user, idx) => {
      const seed = user.id.charCodeAt(0)
      return {
        id: user.id,
        name: user.name,
        score: (seed * 123) % 1000 + 500,
        currentStreak: (seed * 7) % 30,
        bestStreak: (seed * 13) % 60 + 10,
        consistencyScore: 50 + (seed % 40),
        completedDaysThisMonth: (seed * 3) % 25,
        avatar: user.avatar
      }
    })
}

// Generate monthly tracking data for April 2026
function generateMonthlyData(): MonthlyDay[] {
  const daysInMonth = 30 // April has 30 days
  const holidays = [4, 11, 18, 25] // Example holidays

  return Array.from({ length: daysInMonth }, (_, i) => {
    const date = i + 1
    if (holidays.includes(date)) {
      return { date, status: 'holiday' as const }
    }
    // Random achieved/missed status
    const seed = (date * 7) % 100
    return {
      date,
      status: seed > 30 ? ('achieved' as const) : ('missed' as const)
    }
  })
}

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<typeof users[0] | null>(null)
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    role: 'Student' as const,
    status: 'Active' as const
  })
  const [selectedUserForTracking, setSelectedUserForTracking] = useState<string>('1')

  // Calculate analytics
  const totalUsers = users.length
  const activeUsers = users.filter(u => u.status === 'Active').length
  const inactiveUsers = users.filter(u => u.status === 'Inactive').length
  const suspendedUsers = users.filter(u => u.status === 'Suspended').length

  const roleDistribution = {
    Student: users.filter(u => u.role === 'Student').length,
    Instructor: users.filter(u => u.role === 'Instructor').length,
    Admin: users.filter(u => u.role === 'Admin').length
  }

  // Generate tracking data
  const userStats = useMemo(() => generateUserStats(), [])
  const monthlyData = useMemo(() => generateMonthlyData(), [])

  const selectedUserStats = useMemo(() => {
    return userStats.find(s => s.id === selectedUserForTracking)
  }, [selectedUserForTracking, userStats])

  // Filter users based on search and role filter
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesRole = roleFilter === 'all' || user.role === roleFilter
      return matchesSearch && matchesRole
    })
  }, [searchTerm, roleFilter])

  const leaderboardData = useMemo(() => {
    return userStats
      .sort((a, b) => b.score - a.score)
      .map((user, index) => ({
        ...user,
        rank: index + 1
      }))
  }, [userStats])

  const handleEditUser = (user: typeof users[0]) => {
    setEditingUser(user)
    setEditForm({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status
    })
    setIsEditDialogOpen(true)
  }

  const handleSaveEdit = () => {
    if (!editingUser) return

    // In a real app, this would make an API call
    toast({
      title: 'User updated',
      description: `${editForm.name} has been updated successfully.`,
    })

    setIsEditDialogOpen(false)
    setEditingUser(null)
  }

  const handleDeleteUser = (user: typeof users[0]) => {
    // In a real app, this would make an API call
    toast({
      title: 'User deleted',
      description: `${user.name} has been deleted successfully.`,
    })
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'Admin': return <Shield className="size-4" />
      case 'Instructor': return <GraduationCap className="size-4" />
      default: return <Users className="size-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-500'
      case 'Inactive': return 'bg-gray-500'
      case 'Suspended': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getMedalIcon = (rank: number) => {
    if (rank === 1) return <Medal className="size-5 text-yellow-500 fill-yellow-500" />
    if (rank === 2) return <Medal className="size-5 text-gray-400 fill-gray-400" />
    if (rank === 3) return <Medal className="size-5 text-amber-700 fill-amber-700" />
    return null
  }

  return (
    <div className="flex min-h-screen flex-col bg-background p-4 md:p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Users</h1>
          <p className="text-muted-foreground">Manage platform users and instructors.</p>
        </div>
        <Link href="/users/1">
          <Button>View sample user</Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Students</CardTitle>
            <GraduationCap className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{roleDistribution.Student}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Instructors</CardTitle>
            <Crown className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{roleDistribution.Instructor}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Admins</CardTitle>
            <Shield className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{roleDistribution.Admin}</div>
          </CardContent>
        </Card>
      </div>

      {/* User Analytics */}
      <div className="mb-6 grid gap-4 md:grid-cols-2">
        {/* Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">User Status Distribution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <UserCheck className="size-4 text-green-500" />
                  <span>Active Users</span>
                </div>
                <span className="font-medium">{activeUsers}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(activeUsers / totalUsers) * 100}%` }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <UserX className="size-4 text-gray-500" />
                  <span>Inactive Users</span>
                </div>
                <span className="font-medium">{inactiveUsers}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-gray-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(inactiveUsers / totalUsers) * 100}%` }}
                />
              </div>
            </div>

            {suspendedUsers > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <UserX className="size-4 text-red-500" />
                    <span>Suspended Users</span>
                  </div>
                  <span className="font-medium">{suspendedUsers}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-red-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(suspendedUsers / totalUsers) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Role Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Role Distribution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <GraduationCap className="size-4 text-blue-500" />
                  <span>Students</span>
                </div>
                <span className="font-medium">{roleDistribution.Student}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(roleDistribution.Student / totalUsers) * 100}%` }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Crown className="size-4 text-purple-500" />
                  <span>Instructors</span>
                </div>
                <span className="font-medium">{roleDistribution.Instructor}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(roleDistribution.Instructor / totalUsers) * 100}%` }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Shield className="size-4 text-orange-500" />
                  <span>Admins</span>
                </div>
                <span className="font-medium">{roleDistribution.Admin}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(roleDistribution.Admin / totalUsers) * 100}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="users" className="space-y-6">
        <TabsList>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="tracking">Advanced Tracking</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
        </TabsList>

        {/* Advanced Tracking Tab */}
        <TabsContent value="tracking" className="space-y-6">
          {/* User Selection */}
          <div className="flex gap-4 items-center">
            <label className="text-sm font-medium">Select User:</label>
            <Select value={selectedUserForTracking} onValueChange={setSelectedUserForTracking}>
              <SelectTrigger className="w-64">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {userStats.map(stat => (
                  <SelectItem key={stat.id} value={stat.id}>
                    {stat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedUserStats && (
            <>
              {/* User Overview Card */}
              <Card className="border-2">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <span>User Overview - {selectedUserStats.name}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {/* Score */}
                    <div className="rounded-lg bg-muted p-4 space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Coins className="size-4 text-yellow-500" />
                        <span>Score</span>
                      </div>
                      <div className="text-2xl font-bold">{selectedUserStats.score.toLocaleString()}</div>
                    </div>

                    {/* Current Streak */}
                    <div className="rounded-lg bg-muted p-4 space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Flame className="size-4 text-orange-500" />
                        <span>Streak</span>
                      </div>
                      <div className="text-2xl font-bold">{selectedUserStats.currentStreak}</div>
                      <div className="text-xs text-muted-foreground">days</div>
                    </div>

                    {/* Best Streak */}
                    <div className="rounded-lg bg-muted p-4 space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Trophy className="size-4 text-purple-500" />
                        <span>Best Streak</span>
                      </div>
                      <div className="text-2xl font-bold">{selectedUserStats.bestStreak}</div>
                      <div className="text-xs text-muted-foreground">days</div>
                    </div>

                    {/* Consistency Score */}
                    <div className="rounded-lg bg-muted p-4 space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Target className="size-4 text-green-500" />
                        <span>Consistency</span>
                      </div>
                      <div className="text-2xl font-bold">{selectedUserStats.consistencyScore}%</div>
                      <div className="w-full bg-background rounded-full h-1.5 mt-2">
                        <div
                          className="bg-green-500 h-1.5 rounded-full"
                          style={{ width: `${selectedUserStats.consistencyScore}%` }}
                        />
                      </div>
                    </div>

                    {/* Days Completed This Month */}
                    <div className="rounded-lg bg-muted p-4 space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="size-4 text-blue-500" />
                        <span>This Month</span>
                      </div>
                      <div className="text-2xl font-bold">{selectedUserStats.completedDaysThisMonth}</div>
                      <div className="text-xs text-muted-foreground">days completed</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Streak Goal */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="size-5 text-green-500" />
                    Streak Goal
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">7 Day Streak Goal</span>
                      <span className="text-sm text-muted-foreground">
                        {selectedUserStats.currentStreak}/7 days
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-3">
                      <div
                        className={`h-3 rounded-full transition-all ${selectedUserStats.currentStreak >= 7 ? 'bg-green-500' : 'bg-blue-500'
                          }`}
                        style={{ width: `${Math.min((selectedUserStats.currentStreak / 7) * 100, 100)}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      {selectedUserStats.currentStreak >= 7
                        ? '🎉 Goal achieved! Keep it up!'
                        : `${7 - selectedUserStats.currentStreak} more days to reach your goal`}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Monthly Tracker */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="size-5 text-blue-500" />
                    April 2026 - Activity Tracker
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Calendar Grid */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-7 gap-2">
                      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="text-center text-xs font-semibold text-muted-foreground p-2">
                          {day}
                        </div>
                      ))}
                      {monthlyData.map((day) => (
                        <div
                          key={day.date}
                          className={`
                            aspect-square flex items-center justify-center rounded-lg font-medium text-sm
                            transition-all duration-200 hover:scale-105 cursor-default
                            ${day.status === 'achieved' ? 'bg-green-100 text-green-700 border-2 border-green-500' : ''}
                            ${day.status === 'missed' ? 'bg-gray-100 text-gray-600 border-2 border-gray-300' : ''}
                            ${day.status === 'holiday' ? 'bg-amber-100 text-amber-700 border-2 border-amber-400' : ''}
                          `}
                        >
                          {day.status === 'holiday' ? '🏖️' : day.date}
                        </div>
                      ))}
                    </div>

                    {/* Legend */}
                    <div className="flex flex-wrap gap-4 mt-6 p-4 bg-muted rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-green-100 border-2 border-green-500 rounded-sm" />
                        <span className="text-sm">Achieved</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-gray-100 border-2 border-gray-300 rounded-sm" />
                        <span className="text-sm">Missed</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-amber-100 border-2 border-amber-400 rounded-sm" />
                        <span className="text-sm">Holiday</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          {/* Search and Filter */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="Student">Students</SelectItem>
                <SelectItem value="Instructor">Instructors</SelectItem>
                <SelectItem value="Admin">Admins</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Users Table */}
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <p className="text-sm text-muted-foreground">
                Showing {filteredUsers.length} of {totalUsers} users
              </p>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="gap-1">
                          {getRoleIcon(user.role)}
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className={`size-2 rounded-full ${getStatusColor(user.status)}`} />
                          <span className="text-sm">{user.status}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditUser(user)}
                            className="size-8 p-0"
                          >
                            <Edit className="size-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="size-8 p-0 text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="size-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete User</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete {user.name}? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteUser(user)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {filteredUsers.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No users found matching your criteria.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leaderboard" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="size-5 text-yellow-500" />
                Student Leaderboard
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Top performing students based on quiz scores and activity streaks.
              </p>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-20 text-center">Rank</TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Coins className="size-4 text-yellow-500" />
                        Score
                      </div>
                    </TableHead>
                    <TableHead className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Flame className="size-4 text-orange-500" />
                        Streak
                      </div>
                    </TableHead>
                    <TableHead className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Target className="size-4 text-green-500" />
                        Consistency
                      </div>
                    </TableHead>
                    <TableHead className="text-center">Medal</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leaderboardData.map((student) => (
                    <TableRow key={student.id} className={student.rank <= 3 ? 'bg-muted/50' : ''}>
                      <TableCell className="text-center font-bold">
                        <div className="flex items-center justify-center gap-2">
                          {student.rank <= 3 ? getMedalIcon(student.rank) : <span className="text-muted-foreground">#{student.rank}</span>}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{student.name}</TableCell>
                      <TableCell className="text-right font-bold text-primary">
                        {student.score.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1 font-medium">
                          <Flame className="size-4 text-orange-500 fill-orange-500" />
                          {student.currentStreak}d
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <div className="w-16 bg-muted rounded-full h-2">
                            <div
                              className="bg-green-500 h-2 rounded-full"
                              style={{ width: `${student.consistencyScore}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium w-10 text-right">{student.consistencyScore}%</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        {student.rank <= 3 && (
                          <Badge variant="outline" className="gap-1">
                            {student.rank === 1 ? '🥇 Gold' : student.rank === 2 ? '🥈 Silver' : '🥉 Bronze'}
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user information and permissions.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <Input
                value={editForm.name}
                onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input
                value={editForm.email}
                onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                type="email"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Role</label>
              <Select
                value={editForm.role}
                onValueChange={(value: any) => setEditForm(prev => ({ ...prev, role: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Student">Student</SelectItem>
                  <SelectItem value="Instructor">Instructor</SelectItem>
                  <SelectItem value="Admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select
                value={editForm.status}
                onValueChange={(value: any) => setEditForm(prev => ({ ...prev, status: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                  <SelectItem value="Suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
