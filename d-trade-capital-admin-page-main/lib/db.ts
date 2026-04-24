export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
}

export interface UserProfile {
  id: string;
  user_id: string;
  display_name: string;
  avatar_url: string;
  rank_title: string;
  rank_points: number;
  current_streak: number;
  max_streak: number;
  specializations: string[];
  leaderboard_rank: number;
  joined_at: string;
  last_active_at: string;
  roadmap_progress: number;
  courses_in_progress: number;
  courses_completed: number;
  community_stats: {
    posts: number;
    answers: number;
    upvotes: number;
  };
  tools_used: string[];
  achievements: Achievement[];
  trading_stats: {
    total_trades_analyzed: number;
    successful_predictions: number;
    win_rate: number;
    favorite_assets: string[];
  };
}

// In-memory mock DB
export const mockDb: { user_profiles: UserProfile[] } = {
  user_profiles: [
    {
      id: "pro_1",
      user_id: "usr_123",
      display_name: "Alex Trader",
      avatar_url: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
      rank_title: "Master Trader",
      rank_points: 12450,
      current_streak: 15,
      max_streak: 42,
      specializations: ["Options", "Crypto", "Forex"],
      leaderboard_rank: 4,
      joined_at: "2023-01-15T08:00:00Z",
      last_active_at: new Date().toISOString(),
      roadmap_progress: 75,
      courses_in_progress: 2,
      courses_completed: 18,
      community_stats: {
        posts: 42,
        answers: 156,
        upvotes: 890,
      },
      tools_used: ["TradingView", "MetaTrader 5", "Glassnode"],
      achievements: [
        {
          id: "ach_001",
          name: "First Steps",
          description: "Complete your first lesson",
          icon: "🎓",
          unlockedAt: "2023-01-20T10:30:00Z",
          rarity: "common"
        },
        {
          id: "ach_002",
          name: "Knowledge Seeker",
          description: "Complete 10 courses",
          icon: "📚",
          unlockedAt: "2023-06-15T14:45:00Z",
          rarity: "uncommon"
        },
        {
          id: "ach_003",
          name: "Community Hero",
          description: "Received 500 upvotes",
          icon: "🦸",
          unlockedAt: "2023-11-10T09:20:00Z",
          rarity: "rare"
        },
        {
          id: "ach_004",
          name: "Streaker",
          description: "Maintain 30 day learning streak",
          icon: "🔥",
          unlockedAt: "2023-08-05T16:15:00Z",
          rarity: "epic"
        },
        {
          id: "ach_005",
          name: "Master Analyst",
          description: "Reach 10,000 points",
          icon: "👑",
          unlockedAt: "2024-02-28T11:00:00Z",
          rarity: "legendary"
        },
        {
          id: "ach_006",
          name: "Trading Novice",
          description: "Analyze your first 50 trades",
          icon: "📊",
          unlockedAt: "2023-03-10T08:45:00Z",
          rarity: "common"
        },
        {
          id: "ach_007",
          name: "Profit Hunter",
          description: "Achieve 60% win rate",
          icon: "🎯",
          unlockedAt: "2023-09-22T13:30:00Z",
          rarity: "rare"
        },
        {
          id: "ach_008",
          name: "Discussion Starter",
          description: "Create 25 forum posts",
          icon: "💬",
          unlockedAt: "2023-12-05T17:20:00Z",
          rarity: "uncommon"
        },
        {
          id: "ach_009",
          name: "Chart Master",
          description: "Master 15 different chart patterns",
          icon: "📈",
          unlockedAt: "2023-10-18T12:15:00Z",
          rarity: "rare"
        },
        {
          id: "ach_010",
          name: "Risk Manager",
          description: "Complete advanced risk management course",
          icon: "🛡️",
          unlockedAt: "2023-07-30T09:45:00Z",
          rarity: "uncommon"
        },
        {
          id: "ach_011",
          name: "Crypto Pioneer",
          description: "Trade 10 different cryptocurrencies",
          icon: "₿",
          unlockedAt: "2023-11-25T14:20:00Z",
          rarity: "epic"
        },
        {
          id: "ach_012",
          name: "Mentor",
          description: "Help 50 students in the community",
          icon: "👨‍🏫",
          unlockedAt: "2024-01-15T16:30:00Z",
          rarity: "epic"
        },
        {
          id: "ach_013",
          name: "Speed Trader",
          description: "Execute 100 trades in a single day",
          icon: "⚡",
          unlockedAt: "2023-12-20T18:45:00Z",
          rarity: "rare"
        },
        {
          id: "ach_014",
          name: "Consistent Winner",
          description: "Maintain 70% win rate for 3 months",
          icon: "🏆",
          unlockedAt: "2024-02-10T11:00:00Z",
          rarity: "legendary"
        },
        {
          id: "ach_015",
          name: "Early Bird",
          description: "Complete morning trading sessions",
          icon: "🌅",
          unlockedAt: "2023-04-05T07:30:00Z",
          rarity: "common"
        }
      ],
      trading_stats: {
        total_trades_analyzed: 284,
        successful_predictions: 198,
        win_rate: 69.7,
        favorite_assets: ["EUR/USD", "BTC/USD", "SPY"]
      }
    }
  ]
};

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const profile = mockDb.user_profiles.find(p => p.user_id === userId);
  return profile || null;
}

export async function updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile | null> {
  const index = mockDb.user_profiles.findIndex(p => p.user_id === userId);
  if (index === -1) return null;

  mockDb.user_profiles[index] = { ...mockDb.user_profiles[index], ...updates };
  return mockDb.user_profiles[index];
}

export async function getLeaderboard(limit: number = 10): Promise<UserProfile[]> {
  return mockDb.user_profiles
    .sort((a, b) => b.rank_points - a.rank_points)
    .slice(0, limit);
}

export async function unlockAchievement(userId: string, achievement: Achievement): Promise<UserProfile | null> {
  const profile = await getUserProfile(userId);
  if (!profile) return null;

  // Check if already unlocked
  if (profile.achievements.some(a => a.id === achievement.id)) {
    return profile;
  }

  const updatedAchievements = [...profile.achievements, achievement];
  return await updateUserProfile(userId, { achievements: updatedAchievements });
}

export async function updateStreakStats(userId: string, streakMaintained: boolean): Promise<UserProfile | null> {
  const profile = await getUserProfile(userId);
  if (!profile) return null;

  let newStreak = profile.current_streak;
  if (streakMaintained) {
    newStreak = profile.current_streak + 1;
  } else {
    newStreak = 0;
  }

  const maxStreak = Math.max(profile.max_streak, newStreak);

  return await updateUserProfile(userId, {
    current_streak: newStreak,
    max_streak: maxStreak,
    last_active_at: new Date().toISOString()
  });
}
