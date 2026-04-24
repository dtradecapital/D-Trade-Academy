'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AlertTriangle, Lightbulb, TrendingUp, Target, AlertCircle } from 'lucide-react'

interface Insight {
    type: 'mistake' | 'tip' | 'pattern' | 'warning'
    title: string
    description: string
    priority: 'high' | 'medium' | 'low'
}

interface InsightsPanelProps {
    videoId: string
    videoTitle: string
    userScore?: number
}

const insightsData: Record<string, Insight[]> = {
    'v1': [
        {
            type: 'mistake',
            title: 'False Breakouts',
            description: 'Many traders enter breakouts too early without confirmation. Always wait for volume and momentum indicators.',
            priority: 'high'
        },
        {
            type: 'tip',
            title: 'Multiple Timeframes',
            description: 'Check support/resistance levels on multiple timeframes for stronger signals.',
            priority: 'high'
        },
        {
            type: 'pattern',
            title: 'Retest Patterns',
            description: 'After a breakout, price often retests the broken level. This creates high-probability entry points.',
            priority: 'medium'
        },
        {
            type: 'warning',
            title: 'Overtrading',
            description: 'Don\'t trade every level you identify. Quality over quantity - wait for the best setups.',
            priority: 'medium'
        }
    ],
    'v2': [
        {
            type: 'mistake',
            title: 'Counter-Trend Trading',
            description: 'Entering against the trend increases risk. Always trade with the trend, not against it.',
            priority: 'high'
        },
        {
            type: 'tip',
            title: 'Moving Average Slopes',
            description: 'The steeper the moving average slope, the stronger the trend. Use this for momentum assessment.',
            priority: 'high'
        },
        {
            type: 'pattern',
            title: 'Pullbacks in Trends',
            description: 'Strong trends have pullbacks. Use moving averages as dynamic support during these corrections.',
            priority: 'medium'
        },
        {
            type: 'warning',
            title: 'Late Entries',
            description: 'Entering trends too late often results in small profits and large risks. Focus on early trend identification.',
            priority: 'low'
        }
    ],
    'v3': [
        {
            type: 'mistake',
            title: 'No Risk Management',
            description: 'Trading without predefined risk parameters leads to account destruction. Always set stop losses.',
            priority: 'high'
        },
        {
            type: 'tip',
            title: 'Position Sizing Formula',
            description: 'Risk 1% of capital per trade. Position size = (Account × Risk%) ÷ Stop Loss Distance.',
            priority: 'high'
        },
        {
            type: 'pattern',
            title: 'Daily Loss Limits',
            description: 'Set a maximum daily loss limit (1-2% of account) and stop trading when reached.',
            priority: 'medium'
        },
        {
            type: 'warning',
            title: 'Revenge Trading',
            description: 'After a loss, avoid increasing position sizes to "get back" your money. Stick to your risk rules.',
            priority: 'high'
        }
    ]
}

export function InsightsPanel({ videoId, videoTitle, userScore }: InsightsPanelProps) {
    const insights = insightsData[videoId] || insightsData['v1']

    const getIcon = (type: string) => {
        switch (type) {
            case 'mistake': return AlertTriangle
            case 'tip': return Lightbulb
            case 'pattern': return TrendingUp
            case 'warning': return AlertCircle
            default: return Target
        }
    }

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high': return 'text-red-500 bg-red-500/10 border-red-500/20'
            case 'medium': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20'
            case 'low': return 'text-blue-500 bg-blue-500/10 border-blue-500/20'
            default: return 'text-gray-500 bg-gray-500/10 border-gray-500/20'
        }
    }

    const getTypeLabel = (type: string) => {
        switch (type) {
            case 'mistake': return 'Common Mistake'
            case 'tip': return 'Pro Tip'
            case 'pattern': return 'Trading Pattern'
            case 'warning': return 'Important Warning'
            default: return 'Insight'
        }
    }

    // Filter insights based on user performance
    const filteredInsights = insights.filter(insight => {
        if (!userScore) return true
        if (userScore >= 80) return insight.type === 'tip' || insight.type === 'pattern'
        if (userScore >= 60) return insight.priority !== 'low'
        return true // Show all for lower scores
    })

    return (
        <Card className="border border-border bg-card">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                    <Lightbulb className="size-5" />
                    Learning Insights
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                    Key insights for {videoTitle}
                    {userScore && (
                        <span className="ml-2">
                            • Quiz Score: <span className={userScore >= 80 ? 'text-green-500' : userScore >= 60 ? 'text-yellow-500' : 'text-red-500'}>
                                {userScore}%
                            </span>
                        </span>
                    )}
                </p>
            </CardHeader>
            <CardContent className="space-y-4">
                {filteredInsights.map((insight, index) => {
                    const Icon = getIcon(insight.type)
                    return (
                        <div
                            key={index}
                            className={`p-4 rounded-lg border ${getPriorityColor(insight.priority)}`}
                        >
                            <div className="flex items-start gap-3">
                                <Icon className="size-5 mt-0.5 flex-shrink-0" />
                                <div className="flex-1 space-y-2">
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline" className="text-xs">
                                            {getTypeLabel(insight.type)}
                                        </Badge>
                                        {insight.priority === 'high' && (
                                            <Badge variant="destructive" className="text-xs">
                                                High Priority
                                            </Badge>
                                        )}
                                    </div>
                                    <h4 className="font-medium text-sm">{insight.title}</h4>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        {insight.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )
                })}

                {filteredInsights.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                        <Lightbulb className="size-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">Complete the quiz to see personalized insights!</p>
                    </div>
                )}

                {/* Performance-based encouragement */}
                {userScore && (
                    <div className="mt-6 p-4 rounded-lg bg-primary/5 border border-primary/20">
                        <div className="flex items-start gap-3">
                            <Target className="size-5 text-primary mt-0.5" />
                            <div>
                                <h4 className="font-medium text-sm text-primary mb-1">
                                    {userScore >= 80 ? 'Outstanding Performance!' :
                                        userScore >= 60 ? 'Good Progress!' :
                                            'Keep Learning!'}
                                </h4>
                                <p className="text-xs text-muted-foreground">
                                    {userScore >= 80 ? 'You\'re mastering these concepts. Consider moving to more advanced topics.' :
                                        userScore >= 60 ? 'You\'re on the right track. Focus on the areas you missed.' :
                                            'Don\'t worry! Learning takes time. Review the material and try again.'}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}