// Mock Data for DTrade Capital Admin Dashboard

export interface User {
  id: string
  name: string
  email: string
  role: 'Student' | 'Instructor' | 'Admin'
  joinDate: string
  status: 'Active' | 'Inactive' | 'Suspended'
  avatar?: string
  lastActive?: string
  phone?: string
  country?: string
  subscriptionPlan?: 'Free' | 'Basic' | 'Pro' | 'Enterprise'
  subscriptionStatus?: 'Active' | 'Expired' | 'Cancelled'
  subscriptionExpiry?: string
}

export interface UserEnrollment {
  userId: string
  courseId: string
  courseName: string
  enrolledDate: string
  completionPercent: number
  lastAccessed: string
  certificateIssued: boolean
}

export interface UserTool {
  userId: string
  toolId: string
  toolName: string
  purchasedDate: string
  downloadCount: number
  lastDownload?: string
}

export interface LoginActivity {
  id: string
  userId: string
  ipAddress: string
  device: string
  browser: string
  location: string
  timestamp: string
  status: 'Success' | 'Failed'
}

export interface DTerminalData {
  userId: string
  connected: boolean
  lastSync: string
  totalTrades: number
  winRate: number
  profitLoss: number
  averageRiskReward: number
  tradingDays: number
  favoriteAssets: string[]
}

export interface QuizQuestion {
  id: string
  question: string
  options: [string, string, string, string]
  correctAnswerIndex: number
  explanation?: string
}

export interface Quiz {
  id: string
  questions: QuizQuestion[]
}

export interface Video {
  id: string
  title: string
  url: string
  description?: string
  duration?: string
  type?: 'Learning' | 'Practice'
  quizQuestion?: string
  quizAnswer?: string
  quiz?: Quiz
}

export interface Unit {
  id: string
  title: string
  videos: Video[]
}

export interface Course {
  id: string
  title: string
  description: string
  durationWeeks: number
  unitCount: number
  units: Unit[]
}

export interface Transaction {
  id: string
  userId: string
  userName: string
  courseId: string
  courseName: string
  amount: number
  status: 'Completed' | 'Pending' | 'Failed' | 'Refunded'
  date: string
  paymentMethod: string
}

export interface InstructorPayout {
  id: string
  instructorId: string
  instructorName: string
  courseRevenue: number
  platformCommission: number
  instructorEarnings: number
  status: 'Pending' | 'Paid' | 'Processing' | 'Requested'
  courses: number
  requestDate?: string
}

export interface Notification {
  id: string
  type: 'course' | 'user' | 'payout' | 'support' | 'system'
  title: string
  description: string
  timestamp: string
  read: boolean
}

export interface SupportTicket {
  id: string
  userId: string
  userName: string
  subject: string
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed'
  priority: 'Low' | 'Medium' | 'High' | 'Urgent'
  createdAt: string
  category: string
}

export interface Tool {
  id: string
  name: string
  description: string
  status: 'Active' | 'Inactive' | 'Maintenance'
  category: string
  usageCount: number
}

// Users Data (Extended with profile details)
export const users: User[] = [
  { id: '1', name: 'Alex Thompson', email: 'alex.thompson@email.com', role: 'Student', joinDate: '2024-01-15', status: 'Active', lastActive: '2024-02-15T14:30:00', phone: '+1 (555) 123-4567', country: 'United States', subscriptionPlan: 'Pro', subscriptionStatus: 'Active', subscriptionExpiry: '2025-01-15' },
  { id: '2', name: 'Sarah Chen', email: 'sarah.chen@email.com', role: 'Instructor', joinDate: '2023-11-20', status: 'Active', lastActive: '2024-02-15T10:15:00', phone: '+1 (555) 234-5678', country: 'Canada', subscriptionPlan: 'Enterprise', subscriptionStatus: 'Active', subscriptionExpiry: '2025-11-20' },
  { id: '3', name: 'Michael Roberts', email: 'michael.r@email.com', role: 'Student', joinDate: '2024-02-01', status: 'Active', lastActive: '2024-02-15T09:45:00', phone: '+44 7700 900123', country: 'United Kingdom', subscriptionPlan: 'Basic', subscriptionStatus: 'Active', subscriptionExpiry: '2025-02-01' },
  { id: '4', name: 'Emily Davis', email: 'emily.davis@email.com', role: 'Instructor', joinDate: '2023-09-10', status: 'Active', lastActive: '2024-02-14T16:20:00', phone: '+1 (555) 345-6789', country: 'United States', subscriptionPlan: 'Enterprise', subscriptionStatus: 'Active', subscriptionExpiry: '2025-09-10' },
  { id: '5', name: 'James Wilson', email: 'james.w@email.com', role: 'Student', joinDate: '2024-01-28', status: 'Inactive', lastActive: '2024-01-30T11:00:00', phone: '+1 (555) 456-7890', country: 'Australia', subscriptionPlan: 'Basic', subscriptionStatus: 'Expired', subscriptionExpiry: '2024-01-28' },
  { id: '6', name: 'Lisa Anderson', email: 'lisa.a@email.com', role: 'Student', joinDate: '2023-12-05', status: 'Active', lastActive: '2024-02-15T08:30:00', phone: '+1 (555) 567-8901', country: 'United States', subscriptionPlan: 'Pro', subscriptionStatus: 'Active', subscriptionExpiry: '2024-12-05' },
  { id: '7', name: 'David Kim', email: 'david.kim@email.com', role: 'Instructor', joinDate: '2023-08-15', status: 'Active', lastActive: '2024-02-15T12:00:00', phone: '+82 10-1234-5678', country: 'South Korea', subscriptionPlan: 'Enterprise', subscriptionStatus: 'Active', subscriptionExpiry: '2025-08-15' },
  { id: '8', name: 'Jennifer Martinez', email: 'jennifer.m@email.com', role: 'Student', joinDate: '2024-02-10', status: 'Active', lastActive: '2024-02-15T15:00:00', phone: '+1 (555) 678-9012', country: 'Mexico', subscriptionPlan: 'Free', subscriptionStatus: 'Active', subscriptionExpiry: undefined },
  { id: '9', name: 'Robert Brown', email: 'robert.b@email.com', role: 'Student', joinDate: '2023-10-22', status: 'Inactive', lastActive: '2024-01-15T09:00:00', phone: '+1 (555) 789-0123', country: 'United States', subscriptionPlan: 'Pro', subscriptionStatus: 'Cancelled', subscriptionExpiry: '2024-01-22' },
  { id: '10', name: 'Amanda White', email: 'amanda.w@email.com', role: 'Instructor', joinDate: '2023-07-30', status: 'Active', lastActive: '2024-02-15T11:45:00', phone: '+1 (555) 890-1234', country: 'United States', subscriptionPlan: 'Enterprise', subscriptionStatus: 'Active', subscriptionExpiry: '2025-07-30' },
  { id: '11', name: 'Chris Taylor', email: 'chris.t@email.com', role: 'Student', joinDate: '2024-01-05', status: 'Active', lastActive: '2024-02-15T13:20:00', phone: '+61 412 345 678', country: 'Australia', subscriptionPlan: 'Pro', subscriptionStatus: 'Active', subscriptionExpiry: '2025-01-05' },
  { id: '12', name: 'Michelle Lee', email: 'michelle.l@email.com', role: 'Student', joinDate: '2023-11-15', status: 'Active', lastActive: '2024-02-14T17:30:00', phone: '+65 9123 4567', country: 'Singapore', subscriptionPlan: 'Basic', subscriptionStatus: 'Active', subscriptionExpiry: '2024-11-15' },
  { id: '13', name: 'Admin User', email: 'admin@dtradecapital.com', role: 'Admin', joinDate: '2023-01-01', status: 'Active', lastActive: '2024-02-15T16:00:00', phone: '+1 (555) 000-0001', country: 'United States', subscriptionPlan: 'Enterprise', subscriptionStatus: 'Active', subscriptionExpiry: undefined },
  { id: '14', name: 'Support Admin', email: 'support@dtradecapital.com', role: 'Admin', joinDate: '2023-03-15', status: 'Active', lastActive: '2024-02-15T15:45:00', phone: '+1 (555) 000-0002', country: 'United States', subscriptionPlan: 'Enterprise', subscriptionStatus: 'Active', subscriptionExpiry: undefined },
  { id: '15', name: 'Kevin Park', email: 'kevin.p@email.com', role: 'Student', joinDate: '2024-02-14', status: 'Active', lastActive: '2024-02-15T14:00:00', phone: '+1 (555) 901-2345', country: 'United States', subscriptionPlan: 'Free', subscriptionStatus: 'Active', subscriptionExpiry: undefined },
  { id: '16', name: 'Rachel Green', email: 'rachel.g@email.com', role: 'Student', joinDate: '2024-02-15', status: 'Active', lastActive: '2024-02-15T10:00:00', phone: '+1 (555) 012-3456', country: 'United States', subscriptionPlan: 'Free', subscriptionStatus: 'Active', subscriptionExpiry: undefined },
]

// User Enrollments Data
export const userEnrollments: UserEnrollment[] = [
  { userId: '1', courseId: '1', courseName: 'Technical Analysis Masterclass', enrolledDate: '2024-01-20', completionPercent: 75, lastAccessed: '2024-02-15T14:00:00', certificateIssued: false },
  { userId: '1', courseId: '7', courseName: 'Day Trading Strategies', enrolledDate: '2024-02-13', completionPercent: 25, lastAccessed: '2024-02-15T13:30:00', certificateIssued: false },
  { userId: '3', courseId: '3', courseName: 'Cryptocurrency Trading 101', enrolledDate: '2024-02-05', completionPercent: 45, lastAccessed: '2024-02-15T09:00:00', certificateIssued: false },
  { userId: '3', courseId: '5', courseName: 'Forex Trading Blueprint', enrolledDate: '2024-02-10', completionPercent: 10, lastAccessed: '2024-02-14T16:00:00', certificateIssued: false },
  { userId: '6', courseId: '1', courseName: 'Technical Analysis Masterclass', enrolledDate: '2023-12-10', completionPercent: 100, lastAccessed: '2024-02-12T10:00:00', certificateIssued: true },
  { userId: '6', courseId: '5', courseName: 'Forex Trading Blueprint', enrolledDate: '2024-02-14', completionPercent: 5, lastAccessed: '2024-02-15T08:00:00', certificateIssued: false },
  { userId: '8', courseId: '1', courseName: 'Technical Analysis Masterclass', enrolledDate: '2024-02-14', completionPercent: 15, lastAccessed: '2024-02-15T14:45:00', certificateIssued: false },
  { userId: '8', courseId: '3', courseName: 'Cryptocurrency Trading 101', enrolledDate: '2024-02-12', completionPercent: 30, lastAccessed: '2024-02-14T11:00:00', certificateIssued: false },
  { userId: '11', courseId: '3', courseName: 'Cryptocurrency Trading 101', enrolledDate: '2024-01-10', completionPercent: 85, lastAccessed: '2024-02-15T13:00:00', certificateIssued: false },
  { userId: '12', courseId: '4', courseName: 'Risk Management Strategies', enrolledDate: '2023-12-01', completionPercent: 100, lastAccessed: '2024-01-20T15:00:00', certificateIssued: true },
  { userId: '15', courseId: '7', courseName: 'Day Trading Strategies', enrolledDate: '2024-02-15', completionPercent: 5, lastAccessed: '2024-02-15T13:45:00', certificateIssued: false },
  { userId: '16', courseId: '2', courseName: 'Options Trading Fundamentals', enrolledDate: '2024-02-15', completionPercent: 0, lastAccessed: '2024-02-15T09:30:00', certificateIssued: false },
]

// User Tools Data
export const userTools: UserTool[] = [
  { userId: '1', toolId: '1', toolName: 'Trading Simulator', purchasedDate: '2024-01-20', downloadCount: 3, lastDownload: '2024-02-10T10:00:00' },
  { userId: '1', toolId: '4', toolName: 'Risk Calculator', purchasedDate: '2024-01-25', downloadCount: 5, lastDownload: '2024-02-15T12:00:00' },
  { userId: '1', toolId: '7', toolName: 'Trade Journal', purchasedDate: '2024-02-01', downloadCount: 2, lastDownload: '2024-02-14T09:00:00' },
  { userId: '3', toolId: '1', toolName: 'Trading Simulator', purchasedDate: '2024-02-05', downloadCount: 1, lastDownload: '2024-02-05T14:00:00' },
  { userId: '3', toolId: '2', toolName: 'Market Scanner', purchasedDate: '2024-02-08', downloadCount: 2, lastDownload: '2024-02-15T08:00:00' },
  { userId: '6', toolId: '1', toolName: 'Trading Simulator', purchasedDate: '2023-12-15', downloadCount: 8, lastDownload: '2024-02-14T16:00:00' },
  { userId: '6', toolId: '2', toolName: 'Market Scanner', purchasedDate: '2024-01-05', downloadCount: 4, lastDownload: '2024-02-15T07:30:00' },
  { userId: '6', toolId: '3', toolName: 'Portfolio Tracker', purchasedDate: '2024-01-20', downloadCount: 3, lastDownload: '2024-02-13T11:00:00' },
  { userId: '11', toolId: '1', toolName: 'Trading Simulator', purchasedDate: '2024-01-10', downloadCount: 6, lastDownload: '2024-02-15T12:30:00' },
  { userId: '11', toolId: '5', toolName: 'Economic Calendar', purchasedDate: '2024-01-15', downloadCount: 2, lastDownload: '2024-02-14T08:00:00' },
  { userId: '12', toolId: '4', toolName: 'Risk Calculator', purchasedDate: '2023-12-05', downloadCount: 4, lastDownload: '2024-02-10T15:00:00' },
]

// Login Activity Data
export const loginActivity: LoginActivity[] = [
  { id: 'LA001', userId: '1', ipAddress: '192.168.1.105', device: 'MacBook Pro', browser: 'Chrome 121', location: 'New York, USA', timestamp: '2024-02-15T14:30:00', status: 'Success' },
  { id: 'LA002', userId: '1', ipAddress: '192.168.1.105', device: 'MacBook Pro', browser: 'Chrome 121', location: 'New York, USA', timestamp: '2024-02-15T08:15:00', status: 'Success' },
  { id: 'LA003', userId: '1', ipAddress: '74.125.224.72', device: 'iPhone 15 Pro', browser: 'Safari Mobile', location: 'New York, USA', timestamp: '2024-02-14T22:45:00', status: 'Success' },
  { id: 'LA004', userId: '1', ipAddress: '103.45.67.89', device: 'Unknown', browser: 'Firefox 122', location: 'Mumbai, India', timestamp: '2024-02-14T03:20:00', status: 'Failed' },
  { id: 'LA005', userId: '1', ipAddress: '192.168.1.105', device: 'MacBook Pro', browser: 'Chrome 121', location: 'New York, USA', timestamp: '2024-02-13T09:00:00', status: 'Success' },
  { id: 'LA006', userId: '3', ipAddress: '86.12.45.78', device: 'Windows PC', browser: 'Edge 121', location: 'London, UK', timestamp: '2024-02-15T09:45:00', status: 'Success' },
  { id: 'LA007', userId: '3', ipAddress: '86.12.45.78', device: 'Windows PC', browser: 'Edge 121', location: 'London, UK', timestamp: '2024-02-14T14:30:00', status: 'Success' },
  { id: 'LA008', userId: '6', ipAddress: '98.76.54.32', device: 'MacBook Air', browser: 'Safari 17', location: 'Los Angeles, USA', timestamp: '2024-02-15T08:30:00', status: 'Success' },
  { id: 'LA009', userId: '6', ipAddress: '98.76.54.32', device: 'MacBook Air', browser: 'Safari 17', location: 'Los Angeles, USA', timestamp: '2024-02-14T10:15:00', status: 'Success' },
  { id: 'LA010', userId: '8', ipAddress: '201.23.45.67', device: 'Windows PC', browser: 'Chrome 121', location: 'Mexico City, MX', timestamp: '2024-02-15T15:00:00', status: 'Success' },
  { id: 'LA011', userId: '11', ipAddress: '123.45.67.89', device: 'Windows PC', browser: 'Chrome 121', location: 'Sydney, AU', timestamp: '2024-02-15T13:20:00', status: 'Success' },
  { id: 'LA012', userId: '11', ipAddress: '111.222.33.44', device: 'Android Phone', browser: 'Chrome Mobile', location: 'Melbourne, AU', timestamp: '2024-02-14T20:00:00', status: 'Failed' },
]

// D Terminal Behavioral Data
export const dTerminalData: DTerminalData[] = [
  { userId: '1', connected: true, lastSync: '2024-02-15T14:25:00', totalTrades: 156, winRate: 62.5, profitLoss: 4520.80, averageRiskReward: 1.8, tradingDays: 45, favoriteAssets: ['BTC/USD', 'ETH/USD', 'AAPL', 'TSLA'] },
  { userId: '3', connected: true, lastSync: '2024-02-15T09:40:00', totalTrades: 42, winRate: 52.4, profitLoss: -320.50, averageRiskReward: 1.2, tradingDays: 12, favoriteAssets: ['EUR/USD', 'GBP/USD', 'XAU/USD'] },
  { userId: '6', connected: true, lastSync: '2024-02-15T08:28:00', totalTrades: 289, winRate: 68.2, profitLoss: 12450.25, averageRiskReward: 2.1, tradingDays: 85, favoriteAssets: ['SPY', 'QQQ', 'NVDA', 'AMD', 'META'] },
  { userId: '8', connected: false, lastSync: '2024-02-10T11:00:00', totalTrades: 15, winRate: 46.7, profitLoss: -180.00, averageRiskReward: 0.9, tradingDays: 8, favoriteAssets: ['BTC/USD', 'SOL/USD'] },
  { userId: '11', connected: true, lastSync: '2024-02-15T13:15:00', totalTrades: 98, winRate: 58.2, profitLoss: 2890.40, averageRiskReward: 1.5, tradingDays: 32, favoriteAssets: ['DOGE/USD', 'ETH/USD', 'BNB/USD', 'XRP/USD'] },
  { userId: '12', connected: false, lastSync: '2024-01-20T14:00:00', totalTrades: 25, winRate: 60.0, profitLoss: 450.00, averageRiskReward: 1.4, tradingDays: 15, favoriteAssets: ['EUR/USD', 'USD/JPY'] },
]

// Courses Data
export const courses: Course[] = [
  {
    id: '1',
    title: 'Technical Analysis Masterclass',
    description: 'Master chart reading, patterns, and trading signals with practical examples.',
    durationWeeks: 8,
    unitCount: 2,
    units: [
      {
        id: '1-1',
        title: 'Introduction to Technical Analysis',
        videos: [
          {
            id: '1-1-1',
            title: 'What is Technical Analysis?',
            url: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
            description: 'Foundation of technical analysis and use cases.',
            duration: '14:25',
            quizQuestion: 'What does technical analysis focus on?',
            quizAnswer: 'Price action'
          },
          {
            id: '1-1-2',
            title: 'Chart Reading Basics',
            url: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
            description: 'Learn how to read price action and chart structure.',
            duration: '12:10',
            quizQuestion: 'What does a candlestick chart display?',
            quizAnswer: 'Open high low close'
          }
        ]
      },
      {
        id: '1-2',
        title: 'Chart Patterns',
        videos: [
          {
            id: '1-2-1',
            title: 'Candlestick Patterns',
            url: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
            description: 'Study bullish and bearish reversal patterns.',
            duration: '16:40',
            quizQuestion: 'Is a bullish pattern usually a buy or sell signal?',
            quizAnswer: 'Buy'
          },
          {
            id: '1-2-2',
            title: 'Trend Lines and Support/Resistance',
            url: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
            description: 'Use trend lines and levels for trade decisions.',
            duration: '13:00',
            quizQuestion: 'What does a trend line help identify?',
            quizAnswer: 'Support and resistance'
          }
        ]
      }
    ]
  },
  {
    id: '2',
    title: 'Cryptocurrency Trading 101',
    description: 'Build strong crypto trading skills from wallet setup to strategy execution.',
    durationWeeks: 6,
    unitCount: 2,
    units: [
      {
        id: '2-1',
        title: 'Crypto Basics',
        videos: [
          {
            id: '2-1-1',
            title: 'What is Cryptocurrency?',
            url: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
            description: 'Understand digital assets, wallets, and market structure.',
            duration: '11:20',
            quizQuestion: 'What is a cryptocurrency?',
            quizAnswer: 'Digital asset'
          },
          {
            id: '2-1-2',
            title: 'Blockchain Technology',
            url: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
            description: 'Learn how blockchain works and why it matters for traders.',
            duration: '13:50',
            quizQuestion: 'What technology records transactions in crypto?',
            quizAnswer: 'Blockchain'
          }
        ]
      },
      {
        id: '2-2',
        title: 'Trading Strategies',
        videos: [
          {
            id: '2-2-1',
            title: 'Spot Trading',
            url: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
            description: 'Trade crypto pairs with structured entry and exit plans.',
            duration: '15:05',
            quizQuestion: 'What does spot trading involve?',
            quizAnswer: 'Immediate settlement'
          },
          {
            id: '2-2-2',
            title: 'Risk Management in Crypto',
            url: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
            description: 'Apply position sizing and stop placement for volatile markets.',
            duration: '12:45',
            quizQuestion: 'Why is risk management important?',
            quizAnswer: 'Protect capital'
          }
        ]
      }
    ]
  }
]
// Transactions Data
export const transactions: Transaction[] = [
  { id: 'TXN001', userId: '1', userName: 'Alex Thompson', courseId: '1', courseName: 'Technical Analysis Masterclass', amount: 299, status: 'Completed', date: '2024-02-15T14:30:00', paymentMethod: 'Credit Card' },
  { id: 'TXN002', userId: '3', userName: 'Michael Roberts', courseId: '3', courseName: 'Cryptocurrency Trading 101', amount: 249, status: 'Completed', date: '2024-02-15T10:15:00', paymentMethod: 'PayPal' },
  { id: 'TXN003', userId: '15', userName: 'Kevin Park', courseId: '7', courseName: 'Day Trading Strategies', amount: 399, status: 'Completed', date: '2024-02-15T09:45:00', paymentMethod: 'Credit Card' },
  { id: 'TXN004', userId: '16', userName: 'Rachel Green', courseId: '2', courseName: 'Options Trading Fundamentals', amount: 199, status: 'Pending', date: '2024-02-15T08:30:00', paymentMethod: 'Credit Card' },
  { id: 'TXN005', userId: '6', userName: 'Lisa Anderson', courseId: '5', courseName: 'Forex Trading Blueprint', amount: 349, status: 'Completed', date: '2024-02-14T16:45:00', paymentMethod: 'Debit Card' },
  { id: 'TXN006', userId: '8', userName: 'Jennifer Martinez', courseId: '1', courseName: 'Technical Analysis Masterclass', amount: 299, status: 'Completed', date: '2024-02-14T14:20:00', paymentMethod: 'Credit Card' },
  { id: 'TXN007', userId: '11', userName: 'Chris Taylor', courseId: '3', courseName: 'Cryptocurrency Trading 101', amount: 249, status: 'Completed', date: '2024-02-14T11:00:00', paymentMethod: 'PayPal' },
  { id: 'TXN008', userId: '12', userName: 'Michelle Lee', courseId: '4', courseName: 'Risk Management Strategies', amount: 179, status: 'Failed', date: '2024-02-14T09:30:00', paymentMethod: 'Credit Card' },
  { id: 'TXN009', userId: '1', userName: 'Alex Thompson', courseId: '7', courseName: 'Day Trading Strategies', amount: 399, status: 'Completed', date: '2024-02-13T15:00:00', paymentMethod: 'Credit Card' },
  { id: 'TXN010', userId: '3', userName: 'Michael Roberts', courseId: '5', courseName: 'Forex Trading Blueprint', amount: 349, status: 'Refunded', date: '2024-02-13T10:00:00', paymentMethod: 'PayPal' },
  { id: 'TXN011', userId: '6', userName: 'Lisa Anderson', courseId: '1', courseName: 'Technical Analysis Masterclass', amount: 299, status: 'Completed', date: '2024-02-12T14:00:00', paymentMethod: 'Credit Card' },
  { id: 'TXN012', userId: '8', userName: 'Jennifer Martinez', courseId: '3', courseName: 'Cryptocurrency Trading 101', amount: 249, status: 'Completed', date: '2024-02-12T09:00:00', paymentMethod: 'Debit Card' },
]

// Instructor Payouts Data
export const instructorPayouts: InstructorPayout[] = [
  { id: '1', instructorId: '2', instructorName: 'Sarah Chen', courseRevenue: 45850, platformCommission: 9170, instructorEarnings: 36680, status: 'Paid', courses: 2 },
  { id: '2', instructorId: '4', instructorName: 'Emily Davis', courseRevenue: 28540, platformCommission: 5708, instructorEarnings: 22832, status: 'Requested', courses: 2, requestDate: '2024-02-14' },
  { id: '3', instructorId: '7', instructorName: 'David Kim', courseRevenue: 68250, platformCommission: 13650, instructorEarnings: 54600, status: 'Paid', courses: 2 },
  { id: '4', instructorId: '10', instructorName: 'Amanda White', courseRevenue: 18320, platformCommission: 3664, instructorEarnings: 14656, status: 'Processing', courses: 2 },
]

// Support Tickets Data
export const supportTickets: SupportTicket[] = [
  { id: 'TKT001', userId: '1', userName: 'Alex Thompson', subject: 'Cannot access course materials', status: 'Open', priority: 'High', createdAt: '2024-02-15T13:00:00', category: 'Technical Issue' },
  { id: 'TKT002', userId: '5', userName: 'James Wilson', subject: 'Refund request for Options course', status: 'In Progress', priority: 'Medium', createdAt: '2024-02-15T10:30:00', category: 'Billing' },
  { id: 'TKT003', userId: '9', userName: 'Robert Brown', subject: 'Account reactivation request', status: 'Open', priority: 'Low', createdAt: '2024-02-14T16:00:00', category: 'Account' },
  { id: 'TKT004', userId: '12', userName: 'Michelle Lee', subject: 'Video playback issues', status: 'In Progress', priority: 'Medium', createdAt: '2024-02-14T11:00:00', category: 'Technical Issue' },
  { id: 'TKT005', userId: '3', userName: 'Michael Roberts', subject: 'Certificate not received', status: 'Open', priority: 'High', createdAt: '2024-02-13T14:00:00', category: 'Support' },
]

// Tools/Resources Data
export const tools: Tool[] = [
  { id: '1', name: 'Trading Simulator', description: 'Practice trading with virtual funds', status: 'Active', category: 'Simulation', usageCount: 4520 },
  { id: '2', name: 'Market Scanner', description: 'Real-time market scanning tool', status: 'Active', category: 'Analysis', usageCount: 3890 },
  { id: '3', name: 'Portfolio Tracker', description: 'Track your investment portfolio', status: 'Active', category: 'Portfolio', usageCount: 2750 },
  { id: '4', name: 'Risk Calculator', description: 'Calculate position sizing and risk', status: 'Active', category: 'Risk', usageCount: 2100 },
  { id: '5', name: 'Economic Calendar', description: 'Stay updated on market events', status: 'Active', category: 'News', usageCount: 1850 },
  { id: '6', name: 'Backtesting Engine', description: 'Test strategies on historical data', status: 'Maintenance', category: 'Analysis', usageCount: 1200 },
  { id: '7', name: 'Trade Journal', description: 'Document and analyze your trades', status: 'Active', category: 'Journal', usageCount: 980 },
  { id: '8', name: 'Option Chain Analyzer', description: 'Analyze option chains and Greeks', status: 'Active', category: 'Options', usageCount: 760 },
]

// Notifications Data
export const notifications: Notification[] = [
  { id: '1', type: 'course', title: 'Course Pending Approval', description: 'Sarah Chen submitted "Swing Trading Secrets" for review', timestamp: '2024-02-15T10:30:00', read: false },
  { id: '2', type: 'support', title: 'High Priority Ticket', description: 'Alex Thompson reported course access issues', timestamp: '2024-02-15T13:00:00', read: false },
  { id: '3', type: 'payout', title: 'Withdrawal Request', description: 'Emily Davis requested payout of $22,832', timestamp: '2024-02-14T16:45:00', read: false },
  { id: '4', type: 'user', title: 'New User Registration', description: 'Rachel Green joined as a Student', timestamp: '2024-02-15T08:00:00', read: false },
  { id: '5', type: 'course', title: 'Course Pending Approval', description: 'Emily Davis submitted "Advanced Chart Patterns" for review', timestamp: '2024-02-14T14:20:00', read: true },
  { id: '6', type: 'payout', title: 'Payout Completed', description: 'Payment of $36,680 sent to Sarah Chen', timestamp: '2024-02-12T09:30:00', read: true },
  { id: '7', type: 'system', title: 'System Maintenance', description: 'Backtesting Engine scheduled for maintenance', timestamp: '2024-02-11T18:00:00', read: true },
]

// Analytics Data
export const monthlyRevenue = [
  { month: 'Jan', revenue: 45000, users: 120 },
  { month: 'Feb', revenue: 52000, users: 145 },
  { month: 'Mar', revenue: 48000, users: 138 },
  { month: 'Apr', revenue: 61000, users: 162 },
  { month: 'May', revenue: 55000, users: 155 },
  { month: 'Jun', revenue: 67000, users: 178 },
  { month: 'Jul', revenue: 72000, users: 195 },
  { month: 'Aug', revenue: 69000, users: 188 },
  { month: 'Sep', revenue: 78000, users: 210 },
  { month: 'Oct', revenue: 82000, users: 225 },
  { month: 'Nov', revenue: 88000, users: 242 },
  { month: 'Dec', revenue: 95000, users: 268 },
]

export const weeklyRevenue = [
  { day: 'Mon', revenue: 4200 },
  { day: 'Tue', revenue: 3800 },
  { day: 'Wed', revenue: 5100 },
  { day: 'Thu', revenue: 4600 },
  { day: 'Fri', revenue: 5800 },
  { day: 'Sat', revenue: 3200 },
  { day: 'Sun', revenue: 2900 },
]

export const userGrowth = [
  { month: 'Jan', students: 850, instructors: 12 },
  { month: 'Feb', students: 920, instructors: 14 },
  { month: 'Mar', students: 1050, instructors: 15 },
  { month: 'Apr', students: 1180, instructors: 17 },
  { month: 'May', students: 1320, instructors: 19 },
  { month: 'Jun', students: 1480, instructors: 21 },
  { month: 'Jul', students: 1650, instructors: 23 },
  { month: 'Aug', students: 1820, instructors: 25 },
  { month: 'Sep', students: 2010, instructors: 27 },
  { month: 'Oct', students: 2200, instructors: 29 },
  { month: 'Nov', students: 2420, instructors: 31 },
  { month: 'Dec', students: 2680, instructors: 34 },
]

export const coursePopularity = [
  { name: 'Crypto Trading 101', enrollments: 2100, revenue: 522900 },
  { name: 'Day Trading', enrollments: 1650, revenue: 658350 },
  { name: 'Technical Analysis', enrollments: 1250, revenue: 373750 },
  { name: 'Options Trading', enrollments: 890, revenue: 177110 },
  { name: 'Forex Blueprint', enrollments: 780, revenue: 272220 },
]

export const instructorEarningsData = [
  { name: 'David Kim', earnings: 54600 },
  { name: 'Sarah Chen', earnings: 36680 },
  { name: 'Emily Davis', earnings: 22832 },
  { name: 'Amanda White', earnings: 14656 },
]

// Dashboard Stats
export const dashboardStats = {
  // User counts by role
  totalStudents: 2680,
  totalInstructors: 34,
  totalAdmins: 2,
  totalUsers: 2716,

  // Course counts by status
  publishedCourses: 7,
  pendingCourses: 2,
  draftCourses: 1,
  archivedCourses: 1,
  totalCourses: 10,

  // Tools/Resources
  totalTools: 8,
  activeTools: 7,

  // Revenue
  revenueToday: 1146, // TXN001 + TXN002 + TXN003 = 299 + 249 + 399 + 199
  revenueThisWeek: 29600,
  revenueThisMonth: 95000,
  totalRevenue: 812000,

  // Activity
  newSignupsToday: 2, // Kevin Park and Rachel Green
  activeSessions: 47,

  // Pending items
  pendingCourseApprovals: 2,
  pendingInstructorApprovals: 0,
  pendingWithdrawals: 2, // Emily Davis (Requested) + Amanda White (Processing)

  // Support
  openTickets: 3,
  highPriorityTickets: 2,

  // Growth metrics
  monthlyGrowth: {
    users: 12.5,
    revenue: 8.2,
    courses: 25,
    instructors: 10,
  },
}
