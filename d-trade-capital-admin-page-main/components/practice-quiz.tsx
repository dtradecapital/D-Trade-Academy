'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, XCircle, Trophy, RotateCcw } from 'lucide-react'

interface Question {
    id: string
    question: string
    options: string[]
    correctAnswer: number
    explanation: string
}

interface QuizProps {
    videoId: string
    videoTitle: string
    onComplete: (score: number, total: number) => void
}

const quizData: Record<string, Question[]> = {
    'v1': [
        {
            id: 'q1',
            question: 'What is the primary purpose of support and resistance levels?',
            options: [
                'To predict future price movements',
                'To identify key price levels where buying/selling pressure occurs',
                'To calculate profit margins',
                'To determine trading volume'
            ],
            correctAnswer: 1,
            explanation: 'Support and resistance levels identify key price levels where buying (support) or selling (resistance) pressure occurs, helping traders make informed decisions.'
        },
        {
            id: 'q2',
            question: 'When should you consider entering a breakout trade?',
            options: [
                'Immediately when price breaks a level',
                'After confirming the breakout with volume and momentum',
                'Only during market open hours',
                'When the level has been tested multiple times'
            ],
            correctAnswer: 1,
            explanation: 'Breakout trades should be confirmed with volume and momentum indicators to avoid false breakouts and improve success rates.'
        },
        {
            id: 'q3',
            question: 'What is risk control in trading?',
            options: [
                'Maximizing profits',
                'Setting stop losses and position sizing',
                'Trading frequently',
                'Using leverage'
            ],
            correctAnswer: 1,
            explanation: 'Risk control involves setting appropriate stop losses and position sizing to protect capital and ensure disciplined trading.'
        }
    ],
    'v2': [
        {
            id: 'q1',
            question: 'What is the first step in trend trading?',
            options: [
                'Enter a position',
                'Identify the trend direction',
                'Set stop losses',
                'Calculate profit targets'
            ],
            correctAnswer: 1,
            explanation: 'The first step in trend trading is to identify whether the market is in an uptrend, downtrend, or ranging.'
        },
        {
            id: 'q2',
            question: 'What role do moving averages play in trend trading?',
            options: [
                'They predict future prices',
                'They help identify trend direction and momentum',
                'They replace fundamental analysis',
                'They guarantee profits'
            ],
            correctAnswer: 1,
            explanation: 'Moving averages help identify trend direction, provide dynamic support/resistance, and indicate momentum strength.'
        },
        {
            id: 'q3',
            question: 'When should you exit a trend trade?',
            options: [
                'When you feel like it',
                'When the trend reverses or target is hit',
                'After one day',
                'Never'
            ],
            correctAnswer: 1,
            explanation: 'Exit trend trades when the trend shows signs of reversal, your profit target is reached, or risk management rules are triggered.'
        }
    ],
    'v3': [
        {
            id: 'q1',
            question: 'What is position sizing?',
            options: [
                'Choosing which stocks to trade',
                'Determining how much to risk per trade',
                'Setting profit targets',
                'Timing market entries'
            ],
            correctAnswer: 1,
            explanation: 'Position sizing determines how much capital to allocate to each trade based on your risk tolerance and stop loss distance.'
        },
        {
            id: 'q2',
            question: 'What is a good risk-reward ratio?',
            options: [
                '1:1 or better',
                'Always 2:1 minimum',
                '3:1 or higher',
                'It depends on your strategy'
            ],
            correctAnswer: 3,
            explanation: 'The ideal risk-reward ratio depends on your trading strategy, but generally 1:1 or better is acceptable, with 2:1+ being preferable.'
        },
        {
            id: 'q3',
            question: 'What should your daily loss limit be?',
            options: [
                '1% of account balance',
                '5% of account balance',
                '10% of account balance',
                'No limit needed'
            ],
            correctAnswer: 0,
            explanation: 'A daily loss limit of 1-2% of your account balance helps preserve capital and prevents emotional decision-making.'
        }
    ]
}

export function PracticeQuiz({ videoId, videoTitle, onComplete }: QuizProps) {
    const [currentQuestion, setCurrentQuestion] = useState(0)
    const [selectedAnswers, setSelectedAnswers] = useState<number[]>([])
    const [showResults, setShowResults] = useState(false)
    const [isCompleted, setIsCompleted] = useState(false)

    const questions = quizData[videoId] || quizData['v1']
    const currentQ = questions[currentQuestion]

    const handleAnswerSelect = (answerIndex: number) => {
        const newAnswers = [...selectedAnswers]
        newAnswers[currentQuestion] = answerIndex
        setSelectedAnswers(newAnswers)
    }

    const handleNext = () => {
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1)
        } else {
            setShowResults(true)
            const score = selectedAnswers.reduce((acc, answer, index) => {
                return acc + (answer === questions[index].correctAnswer ? 1 : 0)
            }, 0)
            setIsCompleted(true)
            onComplete(score, questions.length)
        }
    }

    const handleRestart = () => {
        setCurrentQuestion(0)
        setSelectedAnswers([])
        setShowResults(false)
        setIsCompleted(false)
    }

    const getScoreColor = (score: number, total: number) => {
        const percentage = (score / total) * 100
        if (percentage >= 80) return 'text-green-500'
        if (percentage >= 60) return 'text-yellow-500'
        return 'text-red-500'
    }

    const getScoreMessage = (score: number, total: number) => {
        const percentage = (score / total) * 100
        if (percentage >= 80) return 'Excellent! You have a strong understanding.'
        if (percentage >= 60) return 'Good job! Review the areas you missed.'
        return 'Keep practicing! Focus on the key concepts.'
    }

    if (showResults) {
        const score = selectedAnswers.reduce((acc, answer, index) => {
            return acc + (answer === questions[index].correctAnswer ? 1 : 0)
        }, 0)

        return (
            <Card className="border border-border bg-card">
                <CardHeader className="text-center">
                    <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-primary/10">
                        <Trophy className="size-8 text-primary" />
                    </div>
                    <CardTitle className="text-xl">Quiz Complete!</CardTitle>
                    <div className={`text-3xl font-bold ${getScoreColor(score, questions.length)}`}>
                        {score}/{questions.length}
                    </div>
                    <p className="text-sm text-muted-foreground">{getScoreMessage(score, questions.length)}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                    {questions.map((question, index) => {
                        const userAnswer = selectedAnswers[index]
                        const isCorrect = userAnswer === question.correctAnswer

                        return (
                            <div key={question.id} className="rounded-lg border border-border bg-background/50 p-4">
                                <div className="flex items-start gap-3">
                                    {isCorrect ? (
                                        <CheckCircle className="size-5 text-green-500 mt-0.5 flex-shrink-0" />
                                    ) : (
                                        <XCircle className="size-5 text-red-500 mt-0.5 flex-shrink-0" />
                                    )}
                                    <div className="flex-1">
                                        <p className="font-medium text-sm mb-2">{question.question}</p>
                                        <div className="text-xs text-muted-foreground mb-2">
                                            Your answer: <span className={isCorrect ? 'text-green-500' : 'text-red-500'}>
                                                {question.options[userAnswer]}
                                            </span>
                                            {!isCorrect && (
                                                <> • Correct: <span className="text-green-500">{question.options[question.correctAnswer]}</span></>
                                            )}
                                        </div>
                                        <p className="text-xs text-muted-foreground">{question.explanation}</p>
                                    </div>
                                </div>
                            </div>
                        )
                    })}

                    <Button onClick={handleRestart} className="w-full" variant="outline">
                        <RotateCcw className="mr-2 size-4" />
                        Take Quiz Again
                    </Button>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="border border-border bg-card">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Practice Quiz</CardTitle>
                    <Badge variant="secondary">
                        {currentQuestion + 1} of {questions.length}
                    </Badge>
                </div>
                <p className="text-sm text-muted-foreground">Test your understanding of {videoTitle}</p>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-4">
                    <h3 className="font-medium text-foreground">{currentQ.question}</h3>

                    <RadioGroup
                        value={selectedAnswers[currentQuestion]?.toString()}
                        onValueChange={(value) => handleAnswerSelect(parseInt(value))}
                        className="space-y-3"
                    >
                        {currentQ.options.map((option, index) => (
                            <div key={index} className="flex items-center space-x-2">
                                <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                                <Label
                                    htmlFor={`option-${index}`}
                                    className="flex-1 cursor-pointer text-sm leading-relaxed"
                                >
                                    {option}
                                </Label>
                            </div>
                        ))}
                    </RadioGroup>
                </div>

                <div className="flex items-center justify-between pt-4">
                    <div className="text-xs text-muted-foreground">
                        Question {currentQuestion + 1} of {questions.length}
                    </div>
                    <Button
                        onClick={handleNext}
                        disabled={selectedAnswers[currentQuestion] === undefined}
                        className="bg-primary hover:bg-primary/90"
                    >
                        {currentQuestion === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
                    </Button>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-muted rounded-full h-2">
                    <div
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                    />
                </div>
            </CardContent>
        </Card>
    )
}