'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Trash2, Plus, Save } from 'lucide-react'
import { type QuizQuestion } from '@/lib/mock-data'

interface QuizCreatorProps {
    lessonId: string
    initialQuestions?: QuizQuestion[]
    onSave: (questions: QuizQuestion[]) => void
    onCancel?: () => void
}

interface QuestionDraft {
    tempId: string
    question: string
    options: [string, string, string, string]
    correctAnswerIndex: number
    explanation?: string
}

export function QuizCreator({ lessonId, initialQuestions = [], onSave, onCancel }: QuizCreatorProps) {
    const [questions, setQuestions] = useState<QuestionDraft[]>(
        initialQuestions.map((q, idx) => ({
            tempId: `q-${idx}`,
            question: q.question,
            options: q.options,
            correctAnswerIndex: q.correctAnswerIndex,
            explanation: q.explanation,
        }))
    )

    const generateId = () => `q-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    const addQuestion = () => {
        setQuestions([
            ...questions,
            {
                tempId: generateId(),
                question: '',
                options: ['', '', '', ''],
                correctAnswerIndex: 0,
                explanation: '',
            },
        ])
    }

    const removeQuestion = (tempId: string) => {
        setQuestions(questions.filter((q) => q.tempId !== tempId))
    }

    const updateQuestion = (tempId: string, field: keyof QuestionDraft, value: any) => {
        setQuestions(
            questions.map((q) =>
                q.tempId === tempId ? { ...q, [field]: value } : q
            )
        )
    }

    const updateOption = (tempId: string, optionIndex: number, value: string) => {
        setQuestions(
            questions.map((q) => {
                if (q.tempId === tempId) {
                    const newOptions = [...q.options] as [string, string, string, string]
                    newOptions[optionIndex] = value
                    return { ...q, options: newOptions }
                }
                return q
            })
        )
    }

    const handleSave = () => {
        // Validate all questions have required fields
        const isValid = questions.every(
            (q) =>
                q.question.trim() &&
                q.options.every((o) => o.trim()) &&
                q.correctAnswerIndex >= 0
        )

        if (!isValid) {
            alert('Please fill in all required fields for each question')
            return
        }

        const formattedQuestions: QuizQuestion[] = questions.map((q, idx) => ({
            id: `${lessonId}-q-${idx}`,
            question: q.question,
            options: q.options,
            correctAnswerIndex: q.correctAnswerIndex,
            explanation: q.explanation || '',
        }))

        onSave(formattedQuestions)
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold">Quiz Creator</h3>
                    <p className="text-sm text-muted-foreground">
                        Create quiz questions for this lesson
                    </p>
                </div>
            </div>

            {questions.length === 0 ? (
                <Card className="border-dashed">
                    <CardContent className="flex flex-col items-center justify-center py-8">
                        <p className="text-sm text-muted-foreground mb-4">
                            No questions yet. Add your first question to get started.
                        </p>
                        <Button onClick={addQuestion} variant="outline">
                            <Plus className="w-4 h-4 mr-2" />
                            Add Question
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-4">
                    {questions.map((question, questionIndex) => (
                        <Card key={question.tempId}>
                            <CardHeader className="pb-3">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <CardTitle className="text-base">
                                            Question {questionIndex + 1}
                                        </CardTitle>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => removeQuestion(question.tempId)}
                                        className="text-destructive hover:text-destructive"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Question Input */}
                                <div>
                                    <Label htmlFor={`question-${question.tempId}`} className="text-sm font-medium">
                                        Question Text *
                                    </Label>
                                    <Input
                                        id={`question-${question.tempId}`}
                                        placeholder="Enter the quiz question..."
                                        value={question.question}
                                        onChange={(e) =>
                                            updateQuestion(question.tempId, 'question', e.target.value)
                                        }
                                        className="mt-2"
                                    />
                                </div>

                                {/* Options Input */}
                                <div className="space-y-3">
                                    <Label className="text-sm font-medium">Answer Options *</Label>
                                    <div className="space-y-2">
                                        {question.options.map((option, optionIndex) => (
                                            <div key={optionIndex} className="flex items-center gap-3">
                                                <RadioGroup
                                                    value={question.correctAnswerIndex.toString()}
                                                    onValueChange={(value) =>
                                                        updateQuestion(
                                                            question.tempId,
                                                            'correctAnswerIndex',
                                                            parseInt(value)
                                                        )
                                                    }
                                                >
                                                    <div className="flex items-center space-x-2">
                                                        <RadioGroupItem
                                                            value={optionIndex.toString()}
                                                            id={`option-${question.tempId}-${optionIndex}`}
                                                        />
                                                        <Label
                                                            htmlFor={`option-${question.tempId}-${optionIndex}`}
                                                            className="font-normal cursor-pointer w-6 h-6 flex items-center justify-center"
                                                        >
                                                            {String.fromCharCode(65 + optionIndex)}
                                                        </Label>
                                                    </div>
                                                </RadioGroup>
                                                <Input
                                                    placeholder={`Option ${String.fromCharCode(65 + optionIndex)}`}
                                                    value={option}
                                                    onChange={(e) =>
                                                        updateOption(question.tempId, optionIndex, e.target.value)
                                                    }
                                                    className="flex-1"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Select the radio button for the correct answer
                                    </p>
                                </div>

                                {/* Explanation Input */}
                                <div>
                                    <Label htmlFor={`explanation-${question.tempId}`} className="text-sm font-medium">
                                        Explanation (Optional)
                                    </Label>
                                    <Input
                                        id={`explanation-${question.tempId}`}
                                        placeholder="Explain why this is the correct answer..."
                                        value={question.explanation || ''}
                                        onChange={(e) =>
                                            updateQuestion(question.tempId, 'explanation', e.target.value)
                                        }
                                        className="mt-2"
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Add Question Button */}
            {questions.length > 0 && (
                <Button
                    onClick={addQuestion}
                    variant="outline"
                    className="w-full"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Another Question
                </Button>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2 justify-end pt-4 border-t">
                {onCancel && (
                    <Button variant="outline" onClick={onCancel}>
                        Cancel
                    </Button>
                )}
                <Button
                    onClick={handleSave}
                    disabled={questions.length === 0}
                    className="gap-2"
                >
                    <Save className="w-4 h-4" />
                    Save Quiz Questions
                </Button>
            </div>
        </div>
    )
}
