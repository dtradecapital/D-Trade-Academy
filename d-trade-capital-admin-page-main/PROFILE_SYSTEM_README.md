# D Trade LMS - User Profile System

Complete implementation of the gamified User Profile System for D Trade LMS platform.

## Overview

The User Profile System is a comprehensive gamification feature that tracks user learning progress, achievements, community engagement, and trading performance. It includes:

- **User Profiles** with detailed stats and progression tracking
- **Points & Ranking System** with tiered progression
- **Achievement/Badge System** with rarity levels
- **Community Engagement Tracking** (posts, answers, upvotes)
- **Trading Performance Analytics** with win rates and asset tracking
- **Learning Progress Monitoring** across roadmap and courses
- **Live Leaderboard** showcasing top traders

## Architecture

### Database Schema (lib/db.ts)

```typescript
UserProfile {
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

Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
}
```

### Points System (lib/points.ts)

#### Points Map
- **Lesson Completed**: +10 points
- **Quiz Passed**: +20 points
- **Post Created**: +5 points
- **Answer Upvoted**: +15 points
- **Stage Completed**: +50 points
- **Streak Maintained**: +5 points/day

#### Rank Thresholds
- **Novice**: 0+ points
- **Advanced**: 1,000+ points
- **Expert**: 5,000+ points
- **Master Trader**: 10,000+ points
- **Grandmaster**: 15,000+ points

#### Streak Bonuses
- Every 7 days adds 10% multiplier to earned points
- Encourages consistent daily engagement
- Max streak tracked for stats

### API Endpoints (app/api/profile/route.ts)

#### GET /api/profile
- `?userId=<id>` - Get user profile
- `?action=leaderboard&limit=10` - Get leaderboard

#### PATCH /api/profile
Request body:
```json
{
  "userId": "usr_123",
  "action": "lesson_completed",
  "streakActive": true
}
```
Or:
```json
{
  "userId": "usr_123",
  "updates": {
    "display_name": "New Name",
    "avatar_url": "https://..."
  }
}
```

## Components

### 1. AchievementsShowcase (components/achievements-showcase.tsx)
Displays earned achievements with:
- Color-coded rarity levels
- Tooltip information with unlock dates
- Grid layout (max 8 displayed, counter for more)
- Hover animations

### 2. TradingStats (components/trading-stats.tsx)
Analytics dashboard featuring:
- Win rate progress bar
- Prediction distribution pie chart
- Asset performance bar chart
- Trading performance KPIs

### 3. ProfileEditor (components/profile-editor.tsx)
Dialog form for updating:
- Display name
- Avatar URL
- Live preview

### 4. Profile Page (app/profile/page.tsx)
Main profile display with:
- Header with avatar, rank, streaks
- Quick action buttons for awarding points (for demo)
- Learning progress section
- Trading stats visualization
- Achievements showcase
- Community impact stats
- Rank progression indicator
- Account stats sidebar

### 5. Leaderboard Page (app/leaderboard/page.tsx)
Ranking display featuring:
- Top 3 podium view with medals
- Full leaderboard table
- Responsive design for mobile
- Global statistics summary

## Key Features

### 1. Gamification
- Progressive rank system with visual feedback
- Achievement unlocking on milestones
- Streak tracking for daily engagement
- Points-based progression

### 2. Community Integration
- Forum post tracking
- Answer contribution stats
- Upvote recognition system
- Community leadership recognition

### 3. Trading Analytics
- Win rate calculation
- Trade analysis tracking
- Favorite assets identification
- Prediction accuracy metrics

### 4. Learning Path Tracking
- Roadmap progress percentage
- Course enrollment tracking
- Completion status monitoring
- Learning specializations

### 5. Social Features
- Public leaderboard rankings
- Profile customization (avatar, name)
- Specialization display
- Tool/platform preferences

## Data Flow

1. **User Action** → Award points event
2. **Points Calculation** → Base + streak multiplier
3. **Profile Update** → New points, potential rank upgrade, achievements
4. **Achievement Check** → Unlock if thresholds met
5. **Leaderboard Update** → Re-rank all users
6. **Profile Refresh** → Display updated stats

## Usage Examples

### Award Points
```typescript
const response = await fetch("/api/profile", {
  method: "PATCH",
  body: JSON.stringify({
    userId: "usr_123",
    action: "quiz_passed",
    streakActive: true
  })
});
```

### Update Profile
```typescript
const response = await fetch("/api/profile", {
  method: "PATCH",
  body: JSON.stringify({
    userId: "usr_123",
    updates: {
      display_name: "New Name",
      avatar_url: "https://..."
    }
  })
});
```

### Get Profile
```typescript
const response = await fetch("/api/profile?userId=usr_123");
const profile = await response.json();
```

### Get Leaderboard
```typescript
const response = await fetch("/api/profile?action=leaderboard&limit=50");
const leaderboard = await response.json();
```

## Styling & Theme

- **Dark mode compatible** with Tailwind CSS
- **Trading-themed** color palette (gold, purple, blue)
- **Responsive design** for mobile, tablet, desktop
- **Smooth animations** and transitions
- **Accessibility** with proper contrast and read order

## Future Enhancements

1. **Badges & Titles**
   - Custom title system
   - Collectible badge variations
   - Season-based achievements

2. **Social Features**
   - Following traders
   - Challenge/competition system
   - Team/group rankings

3. **Advanced Analytics**
   - Performance trends over time
   - Comparison with other traders
   - Predictive insights

4. **Gamification Expansion**
   - Daily missions/quests
   - Weekly challenges
   - Limited-time events
   - Seasonal events with exclusive rewards

5. **Persistence**
   - Real database integration (PostgreSQL/MongoDB)
   - User authentication system
   - Audit logging

## Testing

Quick test buttons available on profile page to award different point types:
- +10 for lesson completion
- +20 for quiz passing
- +50 for stage completion
- +5 for forum post
- +15 for upvote
- +5 for streak maintenance

## File Structure

```
app/
├── api/profile/route.ts          # API endpoints
├── profile/page.tsx              # Profile page
└── leaderboard/page.tsx          # Leaderboard page
components/
├── achievements-showcase.tsx      # Achievements display
├── trading-stats.tsx             # Analytics charts
├── profile-editor.tsx            # Profile edit form
└── ui/                           # Shadcn components
lib/
├── db.ts                         # Database & schemas
├── points.ts                     # Points logic
└── utils.ts                      # Utilities
```

## Notes

- Currently uses in-memory mock data
- Ready for database integration
- API endpoints support real backend
- All components are client-side optimized
- Points system extensible for new actions
