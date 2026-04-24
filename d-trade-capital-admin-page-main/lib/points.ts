import { getUserProfile, updateUserProfile, unlockAchievement, updateStreakStats, Achievement } from './db';

type PointAction = 'lesson_completed' | 'quiz_passed' | 'post_created' | 'answer_upvoted' | 'stage_completed' | 'streak_maintained';

export const POINTS_MAP: Record<PointAction, number> = {
  lesson_completed: 10,
  quiz_passed: 20,
  post_created: 5,
  answer_upvoted: 15,
  stage_completed: 50,
  streak_maintained: 5
};

export const RANK_THRESHOLDS = [
  { title: "Novice", minPoints: 0 },
  { title: "Advanced", minPoints: 1000 },
  { title: "Expert", minPoints: 5000 },
  { title: "Master Trader", minPoints: 10000 },
  { title: "Grandmaster", minPoints: 15000 },
];

export function calculateRankTitle(points: number): string {
  let rank = "Novice";
  for (const threshold of RANK_THRESHOLDS) {
    if (points >= threshold.minPoints) {
      rank = threshold.title;
    }
  }
  return rank;
}

export function calculateStreakBonus(streak: number): number {
  // Bonus increases every 7 days 
  const weeks = Math.floor(streak / 7);
  return 1 + weeks * 0.1; // 1x, 1.1x, 1.2x, etc.
}

export async function awardPoints(userId: string, action: PointAction, streakActive: boolean = true) {
  const profile = await getUserProfile(userId);
  if (!profile) throw new Error("User profile not found");

  const basePoints = POINTS_MAP[action];
  const streakMultiplier = calculateStreakBonus(profile.current_streak);
  const totalPoints = Math.floor(basePoints * streakMultiplier);

  const newPoints = profile.rank_points + totalPoints;
  const newRank = calculateRankTitle(newPoints);

  // Check for achievements based on action
  let achievementsToUnlock: Achievement[] = [];

  if (action === 'quiz_passed' && profile.courses_completed === 9) {
    achievementsToUnlock.push({
      id: "ach_006",
      name: "Certified Trader",
      description: "Complete 10 courses",
      icon: "📜",
      unlockedAt: new Date().toISOString(),
      rarity: "rare"
    });
  }

  if (newPoints >= 5000 && profile.rank_points < 5000) {
    achievementsToUnlock.push({
      id: "ach_007",
      name: "Expert Level",
      description: "Reach 5,000 points",
      icon: "⭐",
      unlockedAt: new Date().toISOString(),
      rarity: "epic"
    });
  }

  let updatedProfile = await updateUserProfile(userId, {
    rank_points: newPoints,
    rank_title: newRank,
    last_active_at: new Date().toISOString()
  });

  // Unlock any earned achievements
  for (const achievement of achievementsToUnlock) {
    updatedProfile = await unlockAchievement(userId, achievement);
  }

  // Handle streak if applicable
  if (action === 'streak_maintained') {
    updatedProfile = await updateStreakStats(userId, streakActive);
  }

  return updatedProfile;
}

export function getPointsUntilNextRank(currentPoints: number): { rankTitle: string; pointsNeeded: number; percentage: number } {
  const nextThreshold = RANK_THRESHOLDS.find(t => currentPoints < t.minPoints);

  if (!nextThreshold) {
    return {
      rankTitle: "Grandmaster",
      pointsNeeded: 0,
      percentage: 100
    };
  }

  const currentThreshold = RANK_THRESHOLDS.findIndex(t => currentPoints >= t.minPoints);
  const range = nextThreshold.minPoints - RANK_THRESHOLDS[currentThreshold].minPoints;
  const progress = currentPoints - RANK_THRESHOLDS[currentThreshold].minPoints;

  return {
    rankTitle: nextThreshold.title,
    pointsNeeded: nextThreshold.minPoints - currentPoints,
    percentage: Math.min(100, (progress / range) * 100)
  };
}
