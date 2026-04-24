'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { BookOpen, FileText, PlayCircle, CheckCircle2, Target } from 'lucide-react'

interface LearningProgressProps {
    videosWatched: number
    totalVideos: number
    notesCount: number
    quizzesCompleted: number
    averageScore: number
}

export function LearningProgress({
    videosWatched,
    totalVideos,
    notesCount,
    quizzesCompleted,
    averageScore
}: LearningProgressProps) {
    const progressPercentage = Math.round((videosWatched / totalVideos) * 100)

    const stats = [
        {
            label: 'Videos Watched',
            value: `${videosWatched}/${totalVideos}`,
            percentage: progressPercentage,
            icon: PlayCircle,
            color: 'text-blue-500',
            bgColor: 'bg-blue-500'
        },
        {
            label: 'Notes Created',
            value: notesCount.toString(),
            percentage: Math.min(notesCount * 10, 100), // Assume 10 notes = 100%
            icon: FileText,
            color: 'text-green-500',
            bgColor: 'bg-green-500'
        },
        {
            label: 'Quizzes Completed',
            value: quizzesCompleted.toString(),
            percentage: Math.min(quizzesCompleted * 25, 100), // Assume 4 quizzes = 100%
            icon: CheckCircle2,
            color: 'text-purple-500',
            bgColor: 'bg-purple-500'
        },
        {
            label: 'Average Score',
            value: averageScore > 0 ? `${averageScore}%` : 'N/A',
            percentage: averageScore,
            icon: Target,
            color: 'text-orange-500',
            bgColor: 'bg-orange-500'
        }
    ]

    const getMotivationalMessage = () => {
        if (progressPercentage >= 80) return "Excellent progress! You're mastering the material."
        if (progressPercentage >= 60) return "Great work! Keep up the momentum."
        if (progressPercentage >= 40) return "Good start! Stay consistent with your learning."
        return "Every journey begins with a single step. Keep going!"
    }

    return (
        <Card className="border border-border bg-card">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                    <BookOpen className="size-5" />
                    Learning Progress
                </CardTitle>
                <p className="text-sm text-muted-foreground">{getMotivationalMessage()}</p>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Overall Progress */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">Overall Completion</span>
                        <Badge variant="secondary">{progressPercentage}%</Badge>
                    </div>
                    <Progress value={progressPercentage} className="h-3" />
                </div>

                {/* Individual Stats */}
                <div className="grid gap-4">
                    {stats.map((stat, index) => {
                        const Icon = stat.icon
                        return (
                            <div key={index} className="flex items-center gap-4 p-3 rounded-lg border border-border bg-background/50">
                                <div className={`p-2 rounded-lg bg-muted ${stat.color}`}>
                                    <Icon className="size-4" />
                                </div>
                                <div className="flex-1 space-y-1">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-medium">{stat.label}</p>
                                        <span className="text-sm font-semibold">{stat.value}</span>
                                    </div>
                                    <Progress value={stat.percentage} className="h-1.5" />
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* Achievement Badges */}
                <div className="space-y-3">
                    <h4 className="text-sm font-medium">Achievements</h4>
                    <div className="flex flex-wrap gap-2">
                        {videosWatched >= 1 && (
                            <Badge variant="secondary" className="gap-1">
                                <PlayCircle className="size-3" />
                                First Video
                            </Badge>
                        )}
                        {videosWatched >= totalVideos * 0.5 && (
                            <Badge variant="secondary" className="gap-1">
                                <Target className="size-3" />
                                Halfway There
                            </Badge>
                        )}
                        {videosWatched === totalVideos && (
                            <Badge variant="secondary" className="gap-1 bg-green-500/10 text-green-500">
                                <CheckCircle2 className="size-3" />
                                Course Complete
                            </Badge>
                        )}
                        {notesCount >= 3 && (
                            <Badge variant="secondary" className="gap-1">
                                <FileText className="size-3" />
                                Note Taker
                            </Badge>
                        )}
                        {quizzesCompleted >= 2 && (
                            <Badge variant="secondary" className="gap-1">
                                <CheckCircle2 className="size-3" />
                                Quiz Master
                            </Badge>
                        )}
                        {averageScore >= 80 && (
                            <Badge variant="secondary" className="gap-1 bg-yellow-500/10 text-yellow-500">
                                <Target className="size-3" />
                                High Scorer
                            </Badge>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}