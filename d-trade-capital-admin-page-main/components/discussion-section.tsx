'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MessageCircle, Send, User } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

interface Question {
    id: string
    author: string
    question: string
    timestamp: string
    replies?: number
}

interface DiscussionSectionProps {
    videoId: string
}

const dummyQuestions: Question[] = [
    {
        id: '1',
        author: 'John Trader',
        question: 'How do you identify support and resistance levels in a trending market?',
        timestamp: '2 days ago',
        replies: 5,
    },
    {
        id: '2',
        author: 'Sarah Analyst',
        question: 'What is the best risk-reward ratio for day trading?',
        timestamp: '1 week ago',
        replies: 8,
    },
    {
        id: '3',
        author: 'Mike Investor',
        question: 'Can the moving average strategy work in a sideways market?',
        timestamp: '10 days ago',
        replies: 3,
    },
]

export function DiscussionSection({ videoId }: DiscussionSectionProps) {
    const [questions, setQuestions] = useState<Question[]>(dummyQuestions)
    const [newQuestion, setNewQuestion] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handleAskQuestion = () => {
        if (!newQuestion.trim()) return

        setIsLoading(true)
        setTimeout(() => {
            const question: Question = {
                id: String(questions.length + 1),
                author: 'You',
                question: newQuestion,
                timestamp: 'just now',
                replies: 0,
            }
            setQuestions((prev) => [question, ...prev])
            setNewQuestion('')
            setIsLoading(false)
            toast({
                title: 'Question posted',
                description: 'Your question has been posted to the discussion.',
            })
        }, 500)
    }

    return (
        <Card className="border border-border bg-card">
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                    <MessageCircle className="size-4" />
                    Discussion
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                {/* Ask Question Input */}
                <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground">Ask a question</label>
                    <div className="flex gap-2">
                        <Input
                            value={newQuestion}
                            onChange={(e) => setNewQuestion(e.target.value)}
                            placeholder="What's your doubt?"
                            className="border-border bg-background text-sm placeholder-muted-foreground focus:border-primary"
                            onKeyPress={(e) => e.key === 'Enter' && handleAskQuestion()}
                        />
                        <Button
                            onClick={handleAskQuestion}
                            disabled={!newQuestion.trim() || isLoading}
                            size="sm"
                            className="bg-primary hover:bg-primary/90"
                        >
                            <Send className="size-4" />
                        </Button>
                    </div>
                </div>

                {/* Questions List */}
                <div className="space-y-2 max-h-60 overflow-y-auto">
                    {questions.map((q) => (
                        <div
                            key={q.id}
                            className="rounded-lg border border-border bg-background/50 p-3 text-xs transition hover:bg-background"
                        >
                            <div className="flex items-start gap-2">
                                <div className="size-6 rounded-full bg-primary/20 text-primary flex items-center justify-center flex-shrink-0">
                                    <User className="size-3" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-2">
                                        <p className="font-medium text-foreground">{q.author}</p>
                                        <span className="text-muted-foreground flex-shrink-0">{q.timestamp}</span>
                                    </div>
                                    <p className="text-muted-foreground mt-1 line-clamp-2">{q.question}</p>
                                    {q.replies !== undefined && q.replies > 0 && (
                                        <button className="text-primary hover:underline mt-1 text-xs">
                                            View {q.replies} replies →
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {questions.length === 0 && (
                    <div className="text-center py-4 text-xs text-muted-foreground">
                        No questions yet. Be the first to ask!
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
