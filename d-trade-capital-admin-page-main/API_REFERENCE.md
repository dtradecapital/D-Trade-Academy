## API Reference - User Profile System

### Base URL
```
http://localhost:3000/api/profile
```

---

## Endpoints

### 1. GET Profile
**Fetch a user's profile data**

```bash
curl "http://localhost:3000/api/profile?userId=usr_123"
```

**Response:**
```json
{
  "id": "pro_1",
  "user_id": "usr_123",
  "display_name": "Alex Trader",
  "avatar_url": "https://...",
  "rank_title": "Master Trader",
  "rank_points": 12450,
  "current_streak": 15,
  "max_streak": 42,
  "specializations": ["Options", "Crypto", "Forex"],
  "leaderboard_rank": 4,
  "joined_at": "2023-01-15T08:00:00Z",
  "last_active_at": "2024-03-26T...",
  "roadmap_progress": 75,
  "courses_in_progress": 2,
  "courses_completed": 18,
  "community_stats": {
    "posts": 42,
    "answers": 156,
    "upvotes": 890
  },
  "tools_used": ["TradingView", "MetaTrader 5"],
  "achievements": [...],
  "trading_stats": {
    "total_trades_analyzed": 284,
    "successful_predictions": 198,
    "win_rate": 69.7,
    "favorite_assets": ["EUR/USD", "BTC/USD", "SPY"]
  }
}
```

---

### 2. GET Leaderboard
**Fetch global leaderboard rankings**

```bash
curl "http://localhost:3000/api/profile?action=leaderboard&limit=10"
```

**Optional Parameters:**
- `limit` (default: 10) - Number of traders to return

**Response:**
```json
[
  {
    "rank": 1,
    "id": "pro_1",
    "user_id": "usr_123",
    "display_name": "Alex Trader",
    "rank_title": "Master Trader",
    "rank_points": 12450,
    ...
  },
  {
    "rank": 2,
    "id": "pro_2",
    "user_id": "usr_124",
    "display_name": "Jane Expert",
    "rank_title": "Expert",
    "rank_points": 8720,
    ...
  },
  ...
]
```

---

### 3. PATCH Award Points
**Award points for a specific action**

```bash
curl -X PATCH "http://localhost:3000/api/profile" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "usr_123",
    "action": "lesson_completed",
    "streakActive": true
  }'
```

**Valid Actions:**
- `lesson_completed` → +10 points
- `quiz_passed` → +20 points
- `post_created` → +5 points
- `answer_upvoted` → +15 points
- `stage_completed` → +50 points
- `streak_maintained` → +5 points

**Parameters:**
- `streakActive` (boolean) - Whether to maintain streak (default: true)

**Response:**
```json
{
  "id": "pro_1",
  "user_id": "usr_123",
  "rank_points": 12460,
  "rank_title": "Master Trader",
  "current_streak": 16,
  "last_active_at": "2024-03-26T...",
  ...
}
```

---

### 4. PATCH Update Profile
**Update user profile information**

```bash
curl -X PATCH "http://localhost:3000/api/profile" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "usr_123",
    "updates": {
      "display_name": "New Trader Name",
      "avatar_url": "https://i.pravatar.cc/150?u=newavatar"
    }
  }'
```

**Updatable Fields:**
- `display_name` - User's display name
- `avatar_url` - Avatar image URL
- `specializations` - Array of trading specializations
- `tools_used` - Array of preferred tools

**Response:**
```json
{
  "id": "pro_1",
  "user_id": "usr_123",
  "display_name": "New Trader Name",
  "avatar_url": "https://...",
  ...
}
```

---

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 400 | Invalid request (missing fields, invalid action) |
| 404 | Profile not found |
| 500 | Server error |

---

## Error Responses

**Invalid User:**
```json
{
  "error": "Profile not found"
}
```

**Invalid Action:**
```json
{
  "error": "Invalid action. Must be one of: lesson_completed, quiz_passed, ..."
}
```

**Missing Parameters:**
```json
{
  "error": "No action or updates provided"
}
```

---

## JavaScript/TypeScript Examples

### Fetch Profile
```typescript
const response = await fetch('/api/profile?userId=usr_123');
const profile = await response.json();
console.log(profile.display_name);
```

### Award Points
```typescript
const response = await fetch('/api/profile', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    userId: 'usr_123',
    action: 'quiz_passed',
    streakActive: true
  })
});

const updated = await response.json();
console.log(`New Points: ${updated.rank_points}`);
console.log(`New Rank: ${updated.rank_title}`);
```

### Get Leaderboard
```typescript
const response = await fetch('/api/profile?action=leaderboard&limit=50');
const leaderboard = await response.json();

leaderboard.forEach((trader) => {
  console.log(`#${trader.rank} - ${trader.display_name} (${trader.rank_points} pts)`);
});
```

### Update Profile
```typescript
const response = await fetch('/api/profile', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    userId: 'usr_123',
    updates: {
      display_name: 'Super Trader',
      avatar_url: 'https://...'
    }
  })
});

const updated = await response.json();
console.log(`Profile updated: ${updated.display_name}`);
```

---

## Performance Tips

1. **Batch Updates** - Avoid multiple rapid requests, batch updates together
2. **Caching** - Cache profile data locally and refresh on demand
3. **Pagination** - Use `limit` parameter on leaderboard for large datasets
4. **Debouncing** - Debounce point-awarding actions to prevent spam

---

## Testing with cURL

Quick test of all endpoints:

```bash
# Get profile
curl "http://localhost:3000/api/profile?userId=usr_123"

# Get leaderboard
curl "http://localhost:3000/api/profile?action=leaderboard&limit=5"

# Award points
curl -X PATCH "http://localhost:3000/api/profile" \
  -H "Content-Type: application/json" \
  -d '{"userId":"usr_123","action":"quiz_passed","streakActive":true}'

# Update profile
curl -X PATCH "http://localhost:3000/api/profile" \
  -H "Content-Type: application/json" \
  -d '{"userId":"usr_123","updates":{"display_name":"Jane Pro"}}'
```

---

## Rate Limiting (Future)

To be implemented for production:
- 100 requests per minute per user
- 1000 requests per minute per IP
- Custom errors for rate limit exceeded

---

## Webhook Notifications (Future)

When implemented:
- `achievement.unlocked` - User earns a badge
- `rank.changed` - User ranks up/down
- `streak.lost` - User's streak ends
- `leaderboard.position.changed` - Position changes

---

**Last Updated:** March 26, 2024
