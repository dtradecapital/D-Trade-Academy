"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Achievement } from "@/lib/db";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Sparkles, Trophy, Star, Crown, Zap } from "lucide-react";
import { useState } from "react";

interface AchievementsShowcaseProps {
    achievements: Achievement[];
    maxDisplay?: number;
}

const RARITY_COLORS: Record<string, { bg: string; text: string; border: string; glow: string; icon: React.ComponentType<any> }> = {
    common: {
        bg: "bg-slate-500/10",
        text: "text-slate-700 dark:text-slate-300",
        border: "border-slate-400/30",
        glow: "hover:shadow-slate-500/20",
        icon: Star
    },
    uncommon: {
        bg: "bg-green-500/10",
        text: "text-green-700 dark:text-green-300",
        border: "border-green-400/30",
        glow: "hover:shadow-green-500/20",
        icon: Sparkles
    },
    rare: {
        bg: "bg-blue-500/10",
        text: "text-blue-700 dark:text-blue-300",
        border: "border-blue-400/30",
        glow: "hover:shadow-blue-500/20",
        icon: Trophy
    },
    epic: {
        bg: "bg-purple-500/10",
        text: "text-purple-700 dark:text-purple-300",
        border: "border-purple-400/30",
        glow: "hover:shadow-purple-500/20",
        icon: Zap
    },
    legendary: {
        bg: "bg-yellow-500/10",
        text: "text-yellow-700 dark:text-yellow-300",
        border: "border-yellow-400/30",
        glow: "hover:shadow-yellow-500/20",
        icon: Crown
    },
};

const RARITY_ORDER = ['common', 'uncommon', 'rare', 'epic', 'legendary'];

export function AchievementsShowcase({ achievements, maxDisplay = 8 }: AchievementsShowcaseProps) {
    const [sortBy, setSortBy] = useState<'rarity' | 'date'>('rarity');

    // Sort achievements based on selected criteria
    const sortedAchievements = [...achievements].sort((a, b) => {
        if (sortBy === 'rarity') {
            return RARITY_ORDER.indexOf(b.rarity) - RARITY_ORDER.indexOf(a.rarity);
        } else {
            return new Date(b.unlockedAt).getTime() - new Date(a.unlockedAt).getTime();
        }
    });

    const displayedAchievements = sortedAchievements.slice(0, maxDisplay);
    const remainingCount = Math.max(0, achievements.length - maxDisplay);

    // Calculate achievement stats
    const rarityStats = achievements.reduce((acc, ach) => {
        acc[ach.rarity] = (acc[ach.rarity] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    return (
        <Card className="border-border/50 shadow-sm overflow-hidden">
            <CardHeader className="bg-muted/30 pb-4">
                <CardTitle className="flex items-center justify-between text-lg">
                    <div className="flex items-center">
                        <Sparkles className="w-5 h-5 mr-2 text-primary" />
                        Achievements
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setSortBy('rarity')}
                            className={`px-3 py-1 text-xs rounded-full transition-colors ${sortBy === 'rarity'
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                                }`}
                        >
                            Rarity
                        </button>
                        <button
                            onClick={() => setSortBy('date')}
                            className={`px-3 py-1 text-xs rounded-full transition-colors ${sortBy === 'date'
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                                }`}
                        >
                            Recent
                        </button>
                    </div>
                </CardTitle>
                <CardDescription>Badges earned through learning & community engagement</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
                {/* Rarity Stats */}
                <div className="flex flex-wrap gap-2 mb-6 p-4 bg-muted/20 rounded-lg">
                    {RARITY_ORDER.map(rarity => {
                        const count = rarityStats[rarity] || 0;
                        const RarityIcon = RARITY_COLORS[rarity].icon;
                        return (
                            <div key={rarity} className="flex items-center gap-1 text-xs">
                                <RarityIcon className={`w-3 h-3 ${RARITY_COLORS[rarity].text}`} />
                                <span className="capitalize text-muted-foreground">{rarity}:</span>
                                <span className="font-semibold">{count}</span>
                            </div>
                        );
                    })}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {displayedAchievements.map((achievement) => {
                        const rarityStyle = RARITY_COLORS[achievement.rarity];
                        const RarityIcon = rarityStyle.icon;
                        const unlockedDate = new Date(achievement.unlockedAt);
                        const formattedDate = unlockedDate.toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                        });

                        return (
                            <TooltipProvider key={achievement.id}>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <div className={`relative flex flex-col items-center p-4 rounded-lg border-2 transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer group ${rarityStyle.bg} ${rarityStyle.border} ${rarityStyle.glow}`}>
                                            {/* Rarity Icon Badge */}
                                            <div className="absolute -top-2 -right-2 bg-background border rounded-full p-1 shadow-sm">
                                                <RarityIcon className={`w-3 h-3 ${RARITY_COLORS[achievement.rarity].text}`} />
                                            </div>

                                            <div className="text-4xl mb-2 group-hover:scale-110 transition-transform duration-300">
                                                {achievement.icon}
                                            </div>
                                            <div className="text-center">
                                                <div className="text-xs font-bold text-foreground line-clamp-2 mb-1">
                                                    {achievement.name}
                                                </div>
                                                <Badge
                                                    variant="outline"
                                                    className={`text-xs capitalize ${rarityStyle.text}`}
                                                >
                                                    {achievement.rarity}
                                                </Badge>
                                            </div>

                                            {/* Subtle glow effect */}
                                            <div className={`absolute inset-0 rounded-lg opacity-0 group-hover:opacity-20 transition-opacity duration-300 ${rarityStyle.bg} blur-sm`} />
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent side="top" className="max-w-xs">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <span className="text-lg">{achievement.icon}</span>
                                                <div>
                                                    <p className="font-semibold">{achievement.name}</p>
                                                    <p className="text-xs text-muted-foreground capitalize">{achievement.rarity}</p>
                                                </div>
                                            </div>
                                            <p className="text-sm text-muted-foreground">{achievement.description}</p>
                                            <div className="flex items-center gap-1 pt-1">
                                                <RarityIcon className="w-3 h-3 text-muted-foreground" />
                                                <p className="text-xs text-muted-foreground">Unlocked: {formattedDate}</p>
                                            </div>
                                        </div>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        );
                    })}

                    {remainingCount > 0 && (
                        <div className="flex flex-col items-center justify-center p-4 rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/10 hover:bg-muted/20 transition-colors cursor-pointer">
                            <div className="text-2xl font-bold text-primary">+{remainingCount}</div>
                            <div className="text-xs text-muted-foreground text-center">More to unlock</div>
                            <div className="text-xs text-muted-foreground/70 mt-1">Click to view all</div>
                        </div>
                    )}
                </div>

                <div className="mt-6 pt-4 border-t border-border/40">
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Total Unlocked</span>
                        <div className="flex items-center gap-2">
                            <Trophy className="w-4 h-4 text-yellow-500" />
                            <span className="font-bold text-lg text-primary">{achievements.length}</span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
