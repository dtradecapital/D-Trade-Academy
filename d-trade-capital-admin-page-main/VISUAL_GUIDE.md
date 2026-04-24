# User Profile System - Visual Guide

## Page Structure Overview

### Profile Page (/profile)

```
┌─────────────────────────────────────────────────────────────────┐
│                        D TRADE LMS NAVBAR                       │
├─────────────────────────────────────────────────────────────────┤
│                                [EDIT PROFILE BTN]                │
│  ┌──────┐                                                         │
│  │ AVATAR                  ALEX TRADER                           │
│  │       │  ⭐ Master Trader | 🏆 12,450 PTS | 🔥 15 DAY STREAK  │
│  │       │                                                         │
│  └──────┘  Specializations: [Options] [Crypto] [Forex]   #4    │
│                                                    LEADERBOARD    │
├─────────────────────────────────────────────────────────────────┤
│ QUICK ACTIONS                                                    │
│ [+10 LESSON] [+20 QUIZ] [+50 STAGE] [+5 POST] [+15 UPVOTE] [+5 STREAK] │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────────────────────────────────────────┐  ┌────────┐│
│  │ LEARNING PROGRESS                              │  │ RANK   ││
│  │ Trading Roadmap: ████████░ 75%                │  │ PROG.  ││
│  │ ┌──────────────────────────────────────────┐ │  │        ││
│  │ │ 2 In Progress │ 18 Completed │ 20 Total  │ │  │ Next:  ││
│  │ └──────────────────────────────────────────┘ │  │ Grand- ││
│  │                                              │  │ master ││
│  ├────────────────────────────────────────────┤│  │ 12450→ ││
│  │ TRADING STATS                              ││  │ 15000  ││
│  │ Win Rate: 69.7% ████████░                 ││  │ 2550→  ││
│  │                                            ││  │        ││
│  │ ┌─────────┬─────────┬────────┐           ││  │ ┌──────┐││
│  │ │284 Trades│198 Wins │69.7%  │           ││  │ │COMM. ││
│  │ └─────────┴─────────┴────────┘           ││  │ │STATS ││
│  │                                            ││  │ ┌──────┐││
│  ├────────────────────────────────────────────┤│  │ Posts ││
│  │ ACHIEVEMENTS                               ││  │ Answers││
│  │ 🎓 📚 🦸 🔥 👑    +3 More                  ││  │ Upvotes││
│  │ Badges: Common, Uncommon, Rare, Epic...   ││  │ └──────┘││
│  │                                            ││  └────────┘│
│  ├────────────────────────────────────────────┤│            │
│  │ TRADING ARSENAL                            ││  Account   │
│  │ [TradingView] [MetaTrader 5] [Glassnode]  ││  Stats     │
│  │                                            ││  ┌──────┐  │
│  └────────────────────────────────────────────┘│  │Date  │  │
│                                                 │  │Joined│  │
│                                                 │  └──────┘  │
│                                                 │  ┌──────┐  │
│                                                 │  │ Best │  │
│                                                 │  │Streak│  │
│                                                 │  └──────┘  │
│                                                 └────────────┘
└─────────────────────────────────────────────────────────────────┘
```

---

### Leaderboard Page (/leaderboard)

```
┌─────────────────────────────────────────────────────────────────┐
│                        D TRADE LMS NAVBAR                       │
├─────────────────────────────────────────────────────────────────┤
│  🏆 GLOBAL LEADERBOARD                                          │
│  Top trading educators ranked by points and engagement         │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   ┌──────────┐    ┌──────────┐    ┌──────────┐                 │
│   │  🥇 #1   │    │  🥈 #2   │    │  🥉 #3   │                 │
│   ├──────────┤    ├──────────┤    ├──────────┤                 │
│   │ NAME     │    │ NAME     │    │ NAME     │                 │
│   │ 15,200 PTS    │ 12,450 PTS    │ 11,000 PTS│                 │
│   │ Master   │    │ Master   │    │ Expert   │                 │
│   │ 20 streak    │ 15 streak    │ 8 streak │                 │
│   │ 20 courses  │ 18 courses  │ 12 courses │                 │
│   └──────────┘    └──────────┘    └──────────┘                 │
│                                                                   │
├─────────────────────────────────────────────────────────────────┤
│ FULL RANKINGS TABLE                                             │
│ ┌─────┬───────┬─────────┬──────────┬────────┬───────┬────────┐ │
│ │Rank │ Trader│ Points  │ Rank     │Streak │Courses│Answers │ │
│ ├─────┼───────┼─────────┼──────────┼────────┼───────┼────────┤ │
│ │ 🥇  │ Alex T│ 15,200  │ Grandm   │ 20🔥   │  20   │  250   │ │
│ │ 🥈  │ Jane E│ 12,450  │ Master   │ 15🔥   │  18   │  156   │ │
│ │ 🥉  │ John P│ 11,000  │ Expert   │  8🔥   │  12   │  128   │ │
│ │ #4  │ Sarah │  9,850  │ Expert   │  5🔥   │  10   │   95   │ │
│ │ #5  │ Tom M │  8,720  │ Advanced │  3🔥   │   8   │   72   │ │
│ │ ... │......│.........│..........│........│.......│........│ │
│ │ #50 │ Bob L │  1,200  │ Novice   │  0🔥   │   1   │    5   │ │
│ └─────┴───────┴─────────┴──────────┴────────┴───────┴────────┘ │
│                                                                   │
├─────────────────────────────────────────────────────────────────┤
│ GLOBAL STATISTICS                                               │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌────────┐  │
│ │  50 Traders  │ │ 3,600 Answers│ │ 500 Courses  │ │42 Days │  │
│ │   Total      │ │    Total     │ │  Completed   │ │Max Str.│  │
│ └──────────────┘ └──────────────┘ └──────────────┘ └────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Component Hierarchy

```
ProfilePage/
├── Avatar Display
├── Header Info
│   ├── Display Name
│   ├── Rank Badge
│   ├── Points Counter
│   └── Streak Display
├── ProfileEditor Modal
│   ├── Name Input
│   ├── Avatar URL Input
│   └── Preview
├── Quick Actions (6 Buttons)
│   └── Points Awarding
├── LeftColumn
│   ├── LearningProgress Card
│   │   ├── Roadmap Progress Bar
│   │   └── Statistics Grid
│   ├── TradingStats Component
│   │   ├── Win Rate Card
│   │   ├── Pie Chart
│   │   └── Bar Chart
│   ├── AchievementsShowcase Component
│   │   ├── Achievement Grid
│   │   ├── Rarity Badges
│   │   └── Tooltips
│   └── TradingArsenal Card
└── RightColumn
    ├── RankProgress Card
    ├── CommunityImpact Card
    └── AccountStats Card
```

---

## Color Scheme

### Achievement Rarity Colors
```
Common:    ⬜ Slate    (text-slate-700)
Uncommon:  🟩 Green    (text-green-700)
Rare:      🟦 Blue     (text-blue-700)
Epic:      🟪 Purple   (text-purple-700)
Legendary: 🟨 Gold     (text-yellow-700)
```

### UI Gradient Effects
```
Primary:        blue → purple
Rank Progress:  blue gradient
Leaderboard 1:  yellow gradient
Leaderboard 2:  gray gradient
Leaderboard 3:  orange gradient
```

### Icon Color Mapping
```
Points:     🏆 Yellow
Streak:     🔥 Orange
Level:      ⚡ Yellow
Posts:      💬 Blue
Answers:    ⭐ Yellow
Upvotes:    👍 Green
Roadmap:    🎯 Primary
Tools:      🔧 Primary
```

---

## Responsive Behavior

### Mobile (< 768px)
- Single column layout
- Hidden table columns: Rank Title, Streak, Courses, Answers
- Stacked cards
- Avatar display: centered

### Tablet (768px - 1024px)
- 2-column layout on profile
- Some table columns visible
- Adjusted padding/margins
- Avatar + info side-by-side

### Desktop (> 1024px)
- 3-column layout on profile
- Full table visibility
- Max width: 1280px (7xl)
- Optimal spacing

---

## Interactive Elements

### Buttons
- Quick Action Buttons: Color-coded (blue/green/purple/yellow/red/orange)
- Edit Profile: Outline style
- Hover effects: Background color shift + elevation

### Dialog/Modals
- Profile Editor: Centered, validated form
- Avatar Preview: Live update on URL change

### Charts
- Pie Chart: Interactive tooltips, color-coded segments
- Bar Chart: Responsive container, axis labels
- Progress Bars: Animated fills with percentage labels

### Tooltips
- Achievement tooltips: Unlock date + description
- Stats tooltips: Full information on hover

---

## Animations

```css
/* Page Entry */
animate-in fade-in duration-500 slide-in-from-bottom-4

/* Spinner Loading */
animate-spin (Tailwind built-in)

/* Hover Effects */
hover:bg-muted/30 transition-colors
hover:shadow-md transition-shadow

/* Badge/Button Hovers */
hover:bg-primary/20 hover:border-primary/50
hover:bg-secondary/80
hover:scale-105 (on stats cards)
```

---

## Typography Hierarchy

```
H1: text-4xl md:text-5xl font-bold    (Display Name)
H2: text-2xl font-bold                (Card Titles)
H3: text-lg font-semibold             (Section Headers)
Body: text-sm/base font-medium        (Content)
Small: text-xs text-muted-foreground   (Secondary Info)
```

---

## Accessibility Features

- ✅ Semantic HTML structure
- ✅ ARIA labels on icons
- ✅ Color not sole indicator (icons + text)
- ✅ Sufficient contrast ratios
- ✅ Keyboard navigation support
- ✅ Focus indicators on buttons
- ✅ Alt text on avatars

---

**Design System Status: ✅ Complete & Responsive**
