"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserProfile } from "@/lib/db";
import { Trophy, Flame, Medal, TrendingUp } from "lucide-react";

interface RankedProfile extends UserProfile {
    rank: number;
}

export default function LeaderboardPage() {
    const [leaderboard, setLeaderboard] = useState<RankedProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchLeaderboard();
    }, []);

    const fetchLeaderboard = async () => {
        try {
            const response = await fetch("/api/profile?action=leaderboard&limit=50");
            if (!response.ok) throw new Error("Failed to fetch leaderboard");
            const data = await response.json();
            setLeaderboard(data);
            setError(null);
        } catch (err) {
            setError(String(err));
        } finally {
            setLoading(false);
        }
    };

    const getRankMedalColor = (rank: number) => {
        switch (rank) {
            case 1:
                return "text-yellow-500";
            case 2:
                return "text-gray-400";
            case 3:
                return "text-orange-600";
            default:
                return "text-muted-foreground";
        }
    };

    const getRankBgColor = (rank: number) => {
        switch (rank) {
            case 1:
                return "bg-yellow-500/10 border-yellow-500/30";
            case 2:
                return "bg-gray-400/10 border-gray-400/30";
            case 3:
                return "bg-orange-600/10 border-orange-600/30";
            default:
                return "bg-muted/10 border-border/40";
        }
    };

    if (loading) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <div className="animate-pulse text-muted-foreground flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                    Loading Leaderboard...
                </div>
            </div>
        );
    }

    if (error || leaderboard.length === 0) {
        return (
            <div className="p-8 text-center text-red-500">
                Failed to load leaderboard. {error && `Error: ${error}`}
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 md:p-8 max-w-6xl space-y-8 animate-in fade-in duration-500 slide-in-from-bottom-4">

            {/* Header */}
            <div className="space-y-4">
                <div className="flex items-center gap-3">
                    <Trophy className="w-8 h-8 text-yellow-500" />
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Global Leaderboard</h1>
                </div>
                <p className="text-muted-foreground text-lg">Top trading educators ranked by points and community engagement</p>
            </div>

            {/* Top 3 Podium */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {leaderboard.slice(0, 3).map((trader, index) => (
                    <Card
                        key={trader.id}
                        className={`relative overflow-hidden border-2 transition-all hover:shadow-lg ${getRankBgColor(trader.rank)}`}
                    >
                        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl -mr-12 -mt-12 pointer-events-none" />

                        <CardHeader className="relative z-10 text-center pb-4">
                            <div className={`text-5xl font-black mb-3 ${getRankMedalColor(trader.rank)}`}>
                                {trader.rank === 1 ? "🥇" : trader.rank === 2 ? "🥈" : "🥉"}
                            </div>
                            <CardTitle className="text-2xl">{trader.display_name}</CardTitle>
                            <Badge className="mx-auto mt-2 bg-primary/10 text-primary border-0">
                                <Medal className="w-3 h-3 mr-1.5" />
                                {trader.rank_title}
                            </Badge>
                        </CardHeader>

                        <CardContent className="relative z-10 space-y-4">
                            <div className="space-y-3">
                                <div className="flex justify-between items-center p-3 rounded-lg bg-background/50">
                                    <span className="text-sm font-medium text-muted-foreground">Points</span>
                                    <span className="text-2xl font-bold text-primary">{trader.rank_points.toLocaleString()}</span>
                                </div>

                                <div className="flex justify-between items-center p-3 rounded-lg bg-background/50">
                                    <span className="text-sm font-medium text-muted-foreground">Streak</span>
                                    <span className="flex items-center text-lg font-bold">
                                        <Flame className="w-4 h-4 mr-1.5 text-orange-500" />
                                        {trader.current_streak}
                                    </span>
                                </div>

                                <div className="flex justify-between items-center p-3 rounded-lg bg-background/50">
                                    <span className="text-sm font-medium text-muted-foreground">Courses</span>
                                    <span className="font-bold">{trader.courses_completed}</span>
                                </div>
                            </div>

                            <div className="pt-3 border-t border-border/40 space-y-2 text-sm">
                                <div className="flex justify-between text-muted-foreground">
                                    <span>Community Posts:</span>
                                    <span className="font-semibold text-foreground">{trader.community_stats.posts}</span>
                                </div>
                                <div className="flex justify-between text-muted-foreground">
                                    <span>Answers:</span>
                                    <span className="font-semibold text-foreground">{trader.community_stats.answers}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Full Leaderboard Table */}
            <Card className="border-border/50 shadow-sm overflow-hidden">
                <CardHeader className="bg-muted/30 pb-4">
                    <CardTitle className="flex items-center">
                        <TrendingUp className="w-5 h-5 mr-2 text-primary" />
                        Rankings
                    </CardTitle>
                    <CardDescription>All traders ranked by points</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-border/40 bg-muted/50">
                                    <th className="px-4 py-4 text-left text-sm font-semibold text-muted-foreground">Rank</th>
                                    <th className="px-4 py-4 text-left text-sm font-semibold text-muted-foreground">Trader</th>
                                    <th className="px-4 py-4 text-right text-sm font-semibold text-muted-foreground">Points</th>
                                    <th className="px-4 py-4 text-right text-sm font-semibold text-muted-foreground hidden md:table-cell">Rank Title</th>
                                    <th className="px-4 py-4 text-right text-sm font-semibold text-muted-foreground hidden md:table-cell">Streak</th>
                                    <th className="px-4 py-4 text-right text-sm font-semibold text-muted-foreground hidden sm:table-cell">Courses</th>
                                    <th className="px-4 py-4 text-right text-sm font-semibold text-muted-foreground hidden lg:table-cell">Answers</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/40">
                                {leaderboard.map((trader) => (
                                    <tr
                                        key={trader.id}
                                        className={`transition-colors hover:bg-muted/30 ${[1, 2, 3].includes(trader.rank) ? "bg-muted/10" : ""
                                            }`}
                                    >
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-3 font-bold text-lg">
                                                {trader.rank <= 3 ? (
                                                    <span className={getRankMedalColor(trader.rank)}>
                                                        {trader.rank === 1 ? "🥇" : trader.rank === 2 ? "🥈" : "🥉"}
                                                    </span>
                                                ) : (
                                                    <span className="text-muted-foreground">#{trader.rank}</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-3">
                                                <Avatar className="w-10 h-10 border border-border">
                                                    <AvatarImage src={trader.avatar_url} alt={trader.display_name} />
                                                    <AvatarFallback>{trader.display_name.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-semibold text-foreground">{trader.display_name}</p>
                                                    <p className="text-xs text-muted-foreground">{trader.specializations.join(", ")}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 text-right">
                                            <span className="font-bold text-lg text-primary">
                                                {trader.rank_points.toLocaleString()}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 text-right hidden md:table-cell">
                                            <Badge variant="outline" className="px-2 py-1 text-xs">
                                                {trader.rank_title}
                                            </Badge>
                                        </td>
                                        <td className="px-4 py-4 text-right hidden md:table-cell">
                                            <div className="flex items-center justify-end gap-1 font-semibold">
                                                <Flame className="w-4 h-4 text-orange-500" />
                                                {trader.current_streak}
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 text-right hidden sm:table-cell font-semibold">
                                            {trader.courses_completed}
                                        </td>
                                        <td className="px-4 py-4 text-right hidden lg:table-cell font-semibold">
                                            {trader.community_stats.answers}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="border-border/50 shadow-sm bg-gradient-to-br from-blue-500/10 to-blue-500/5">
                    <CardContent className="pt-6">
                        <div className="text-center">
                            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                                {leaderboard.length}
                            </div>
                            <div className="text-sm text-muted-foreground font-medium">Total Traders</div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-border/50 shadow-sm bg-gradient-to-br from-green-500/10 to-green-500/5">
                    <CardContent className="pt-6">
                        <div className="text-center">
                            <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                                {leaderboard.reduce((sum, t) => sum + t.community_stats.answers, 0).toLocaleString()}
                            </div>
                            <div className="text-sm text-muted-foreground font-medium">Total Answers</div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-border/50 shadow-sm bg-gradient-to-br from-purple-500/10 to-purple-500/5">
                    <CardContent className="pt-6">
                        <div className="text-center">
                            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                                {leaderboard.reduce((sum, t) => sum + t.courses_completed, 0)}
                            </div>
                            <div className="text-sm text-muted-foreground font-medium">Courses Completed</div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-border/50 shadow-sm bg-gradient-to-br from-orange-500/10 to-orange-500/5">
                    <CardContent className="pt-6">
                        <div className="text-center">
                            <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">
                                {Math.max(...leaderboard.map(t => t.current_streak))}
                            </div>
                            <div className="text-sm text-muted-foreground font-medium">Max Streak</div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
