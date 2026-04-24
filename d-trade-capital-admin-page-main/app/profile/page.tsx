"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UserProfile } from "@/lib/db";
import { Trophy, Flame, Target, MessageSquare, ThumbsUp, Medal, Star, LayoutDashboard, Zap, Calendar, TrendingUp } from "lucide-react";
import { AchievementsShowcase } from "@/components/achievements-showcase";
import { TradingStats } from "@/components/trading-stats";
import { ProfileEditor } from "@/components/profile-editor";
import { getPointsUntilNextRank } from "@/lib/points";

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nextRankInfo, setNextRankInfo] = useState({ rankTitle: "", pointsNeeded: 0, percentage: 0 });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("/api/profile");
        if (!response.ok) throw new Error("Failed to fetch profile");
        const data = await response.json();
        setProfile(data);
        setNextRankInfo(getPointsUntilNextRank(data.rank_points));
      } catch (err) {
        setError(String(err));
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleAwardPoints = async (action: string) => {
    if (!profile) return;
    try {
      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: profile.user_id, action, streakActive: true }),
      });
      if (!response.ok) throw new Error("Failed to award points");
      const updatedProfile = await response.json();
      setProfile(updatedProfile);
      setNextRankInfo(getPointsUntilNextRank(updatedProfile.rank_points));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading Profile...</div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="p-8 text-center text-red-500">
        Failed to load profile. {error && `Error: ${error}`}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-7xl space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>{profile.display_name}</CardTitle>
          <CardDescription>{profile.rank_title}  {profile.rank_points.toLocaleString()} points</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <div className="flex items-center gap-3">
            <Avatar className="w-16 h-16">
              <AvatarImage src={profile.avatar_url} alt={profile.display_name} />
              <AvatarFallback>{profile.display_name.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-semibold">{profile.rank_title}</div>
              <div className="text-sm text-muted-foreground">Rank points: {profile.rank_points}</div>
            </div>
          </div>
          <div>
            <p className="text-sm">{profile.specializations.join(", ")}</p>
          </div>
          <div className="space-y-2">
            <Button onClick={() => handleAwardPoints("lesson_completed")} size="sm">+10 Lesson</Button>
            <Button onClick={() => handleAwardPoints("quiz_passed")} size="sm">+20 Quiz</Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <TradingStats
          totalTradesAnalyzed={profile.trading_stats.total_trades_analyzed}
          successfulPredictions={profile.trading_stats.successful_predictions}
          winRate={profile.trading_stats.win_rate}
          favoriteAssets={profile.trading_stats.favorite_assets}
        />

        <Card>
          <CardHeader>
            <CardTitle>Rank Progress</CardTitle>
            <CardDescription>Next: {nextRankInfo.rankTitle}</CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={nextRankInfo.percentage} className="h-2" />
            <div className="text-xs text-muted-foreground mt-2">{nextRankInfo.pointsNeeded} points to next rank</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Community Impact</CardTitle>
          </CardHeader>
          <CardContent>
            <div>Posts: {profile.community_stats.posts}</div>
            <div>Answers: {profile.community_stats.answers}</div>
            <div>Upvotes: {profile.community_stats.upvotes}</div>
          </CardContent>
        </Card>
      </div>

      <AchievementsShowcase achievements={profile.achievements} />
    </div>
  );
}
