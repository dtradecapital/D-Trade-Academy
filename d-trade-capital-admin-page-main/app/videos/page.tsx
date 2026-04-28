'use client'

import { ChangeEvent, useEffect, useState } from 'react'
import { ChevronRight, Trash2, X, Edit3, Plus } from 'lucide-react'
import { type Course, type QuizQuestion } from '@/lib/mock-data'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { QuizCreator } from '@/components/quiz-creator'

type SelectedLesson = {
    id: string
    title: string
    description?: string
    duration?: string
    videoUrl: string
}

type LessonNote = {
    id: string
    text: string
    color: string
    imageUrl?: string | null
    timestamp: string
}

type DiscussionComment = {
    id: string
    text: string
    imageUrl?: string | null
    timestamp: string
}

const SAVED_COURSES_KEY = 'admin-courses'

const prebuiltCourses: Course[] = [
    {
        id: 'prebuilt-1',
        title: 'Stock Market Basics',
        description: 'Learn the foundations of the stock market, trading terminology, and how to start with confidence.',
        durationWeeks: 4,
        unitCount: 3,
        units: [
            {
                id: 'prebuilt-1-unit-1',
                title: 'Introduction',
                videos: [
                    {
                        id: 'prebuilt-1-unit-1-topic-1',
                        title: 'What is Stock Market',
                        url: 'https://www.w3schools.com/html/mov_bbb.mp4',
                    },
                    {
                        id: 'prebuilt-1-unit-1-topic-2',
                        title: 'Types of Orders',
                        url: 'https://www.w3schools.com/html/mov_bbb.mp4',
                    },
                ],
            },
            {
                id: 'prebuilt-1-unit-2',
                title: 'Core Concepts',
                videos: [
                    {
                        id: 'prebuilt-1-unit-2-topic-1',
                        title: 'Market Participants',
                        url: 'https://www.w3schools.com/html/mov_bbb.mp4',
                    },
                    {
                        id: 'prebuilt-1-unit-2-topic-2',
                        title: 'Reading Charts',
                        url: 'https://www.w3schools.com/html/mov_bbb.mp4',
                    },
                ],
            },
            {
                id: 'prebuilt-1-unit-3',
                title: 'Advanced Strategies',
                videos: [
                    {
                        id: 'prebuilt-1-unit-3-topic-1',
                        title: 'Risk Management Basics',
                        url: 'https://www.w3schools.com/html/mov_bbb.mp4',
                    },
                    {
                        id: 'prebuilt-1-unit-3-topic-2',
                        title: 'Trading Psychology',
                        url: 'https://www.w3schools.com/html/mov_bbb.mp4',
                    },
                ],
            },
        ],
    },
    {
        id: 'prebuilt-2',
        title: 'Technical Analysis',
        description: 'Master chart reading, indicators, and patterns to trade with clearer signals.',
        durationWeeks: 5,
        unitCount: 3,
        units: [
            {
                id: 'prebuilt-2-unit-1',
                title: 'Chart Basics',
                videos: [
                    {
                        id: 'prebuilt-2-unit-1-topic-1',
                        title: 'Candlestick Patterns',
                        url: 'https://www.w3schools.com/html/mov_bbb.mp4',
                    },
                    {
                        id: 'prebuilt-2-unit-1-topic-2',
                        title: 'Support and Resistance',
                        url: 'https://www.w3schools.com/html/mov_bbb.mp4',
                    },
                ],
            },
            {
                id: 'prebuilt-2-unit-2',
                title: 'Indicators',
                videos: [
                    {
                        id: 'prebuilt-2-unit-2-topic-1',
                        title: 'Moving Averages',
                        url: 'https://www.w3schools.com/html/mov_bbb.mp4',
                    },
                    {
                        id: 'prebuilt-2-unit-2-topic-2',
                        title: 'RSI and MACD',
                        url: 'https://www.w3schools.com/html/mov_bbb.mp4',
                    },
                ],
            },
            {
                id: 'prebuilt-2-unit-3',
                title: 'Pattern Trading',
                videos: [
                    {
                        id: 'prebuilt-2-unit-3-topic-1',
                        title: 'Breakouts and Pullbacks',
                        url: 'https://www.w3schools.com/html/mov_bbb.mp4',
                    },
                    {
                        id: 'prebuilt-2-unit-3-topic-2',
                        title: 'Trendlines',
                        url: 'https://www.w3schools.com/html/mov_bbb.mp4',
                    },
                ],
            },
        ],
    },
    {
        id: 'prebuilt-3',
        title: 'Intraday Trading Strategies',
        description: 'Learn fast execution techniques and setup plans for intraday trading.',
        durationWeeks: 4,
        unitCount: 2,
        units: [
            {
                id: 'prebuilt-3-unit-1',
                title: 'Intraday Setup',
                videos: [
                    {
                        id: 'prebuilt-3-unit-1-topic-1',
                        title: 'Opening Range Strategies',
                        url: 'https://www.w3schools.com/html/mov_bbb.mp4',
                    },
                    {
                        id: 'prebuilt-3-unit-1-topic-2',
                        title: 'Volume and Order Flow',
                        url: 'https://www.w3schools.com/html/mov_bbb.mp4',
                    },
                ],
            },
            {
                id: 'prebuilt-3-unit-2',
                title: 'Exit Strategies',
                videos: [
                    {
                        id: 'prebuilt-3-unit-2-topic-1',
                        title: 'Stop Loss Placement',
                        url: 'https://www.w3schools.com/html/mov_bbb.mp4',
                    },
                    {
                        id: 'prebuilt-3-unit-2-topic-2',
                        title: 'Profit Targets',
                        url: 'https://www.w3schools.com/html/mov_bbb.mp4',
                    },
                ],
            },
        ],
    },
]

const getNoteKey = (lessonId: string) => `lesson-notes-${lessonId}`
const getCommentsKey = (lessonId: string) => `lesson-comments-${lessonId}`
const getQuizKey = (lessonId: string) => `lesson-quiz-${lessonId}`

const readFileAsDataUrl = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => {
            if (typeof reader.result === 'string') {
                resolve(reader.result)
            } else {
                reject(new Error('Unable to read file'))
            }
        }
        reader.onerror = () => reject(reader.error)
        reader.readAsDataURL(file)
    })

export default function VideosPage() {
    const [openCourseId, setOpenCourseId] = useState<string | null>(null)
    const [selectedLesson, setSelectedLesson] = useState<SelectedLesson | null>(null)
    const [selectedVideo, setSelectedVideo] = useState<string | null>(null)

    const [noteText, setNoteText] = useState('')
    const [noteColor, setNoteColor] = useState('#111827')
    const [noteImageUrl, setNoteImageUrl] = useState<string | null>(null)

    const [commentText, setCommentText] = useState('')
    const [commentImageUrl, setCommentImageUrl] = useState<string | null>(null)
    const [comments, setComments] = useState<DiscussionComment[]>([])
    const [lessonNotes, setLessonNotes] = useState<LessonNote[]>([])
    const [activeTab, setActiveTab] = useState<'notes' | 'discussion' | 'quiz' | null>(null)
    const [editingNoteId, setEditingNoteId] = useState<string | null>(null)
    const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([])
    const [isCreatingQuiz, setIsCreatingQuiz] = useState(false)
    const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({})
    const [isQuizSubmitted, setIsQuizSubmitted] = useState(false)
    const [quizScore, setQuizScore] = useState(0)
    const [toastMessage, setToastMessage] = useState<string | null>(null)
    const [showAddCourseForm, setShowAddCourseForm] = useState(false)
    const [courseList, setCourseList] = useState<Course[]>([])
    const [newCourseTitle, setNewCourseTitle] = useState('')
    const [newCourseDescription, setNewCourseDescription] = useState('')
    const [newCourseWeeks, setNewCourseWeeks] = useState(4)
    const [newCourseUnits, setNewCourseUnits] = useState(1)
    const [courseUnits, setCourseUnits] = useState<Course['units']>([
        {
            id: `unit-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            title: 'Unit 1',
            videos: [],
        },
    ])
    const [managingLessonsUnitId, setManagingLessonsUnitId] = useState<string | null>(null)
    const [lessonDrafts, setLessonDrafts] = useState<Record<string, { title: string; duration: string; videoUrl: string }>>({})
    const [bulkLessonList, setBulkLessonList] = useState<Record<string, Array<{ id: string; title: string; duration: string; url: string }>>>({})
    const [bulkModes, setBulkModes] = useState<Record<string, boolean>>({})
    const [saveStatus, setSaveStatus] = useState<string | null>(null)

    const createUnit = (index: number) => ({
        id: `unit-${Date.now()}-${Math.random().toString(36).slice(2, 6)}-${index}`,
        title: `Unit ${index + 1}`,
        videos: [] as Course['units'][number]['videos'],
    })

    const syncCourseUnits = (count: number) => {
        setCourseUnits((current) => {
            if (count <= current.length) {
                return current.slice(0, count)
            }

            return [
                ...current,
                ...Array.from({ length: count - current.length }, (_, idx) => createUnit(current.length + idx)),
            ]
        })
    }

    const updateUnitTitle = (unitId: string, title: string) => {
        setCourseUnits((current) =>
            current.map((unit) => (unit.id === unitId ? { ...unit, title } : unit)),
        )
    }

    const addUnit = () => {
        setCourseUnits((current) => [...current, createUnit(current.length)])
        setNewCourseUnits((current) => current + 1)
    }

    const updateLessonDraft = (unitId: string, field: 'title' | 'duration' | 'videoUrl', value: string) => {
        setLessonDrafts((current) => ({
            ...current,
            [unitId]: {
                title: current[unitId]?.title ?? '',
                duration: current[unitId]?.duration ?? '30 mins',
                videoUrl: current[unitId]?.videoUrl ?? '',
                [field]: value,
            },
        }))
    }

    const addLessonToUnit = (unitId: string) => {
        const draft = lessonDrafts[unitId] ?? { title: '', duration: '30 mins', videoUrl: '' }
        if (!draft.title.trim()) return

        const newLesson = {
            id: `lesson-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            title: draft.title.trim(),
            url: draft.videoUrl.trim() || '',
            duration: draft.duration.trim() || '30 mins',
        }

        setCourseUnits((current) =>
            current.map((unit) =>
                unit.id === unitId
                    ? { ...unit, videos: [...unit.videos, newLesson] }
                    : unit,
            ),
        )

        setLessonDrafts((current) => ({
            ...current,
            [unitId]: { title: '', duration: '30 mins', videoUrl: '' },
        }))
    }

    const addBulkLessonsToUnit = (unitId: string) => {
        const lessons = bulkLessonList[unitId] ?? []
        const validLessons = lessons.filter(l => l.title.trim() || l.url.trim())
        if (validLessons.length === 0) return

        const newLessons = validLessons.map((l, idx) => ({
            id: `lesson-${Date.now()}-${Math.random().toString(36).slice(2, 6)}-${idx}`,
            title: l.title.trim() || `Lesson ${idx + 1}`,
            duration: l.duration.trim() || '30 mins',
            url: l.url.trim() || '',
        }))

        setCourseUnits((current) =>
            current.map((unit) =>
                unit.id === unitId
                    ? { ...unit, videos: [...unit.videos, ...newLessons] }
                    : unit,
            ),
        )

        setBulkLessonList((current) => ({ ...current, [unitId]: [] }))
        setBulkModes((current) => ({ ...current, [unitId]: false }))
    }

    const addBulkLessonRow = (unitId: string) => {
        setBulkLessonList(cur => {
            const list = cur[unitId] ?? [{ id: Math.random().toString(), title: '', duration: '30 mins', url: '' }]
            return {
                ...cur,
                [unitId]: [...list, { id: Math.random().toString(), title: '', duration: '30 mins', url: '' }]
            }
        })
    }

    const updateBulkLesson = (unitId: string, lessonId: string, field: 'title' | 'duration' | 'url', value: string) => {
        setBulkLessonList(cur => {
            const list = cur[unitId] ?? [{ id: Math.random().toString(), title: '', duration: '30 mins', url: '' }]
            return {
                ...cur,
                [unitId]: list.map(l => l.id === lessonId ? { ...l, [field]: value } : l)
            }
        })
    }

    const removeBulkLesson = (unitId: string, lessonId: string) => {
        setBulkLessonList(cur => {
            const list = cur[unitId] ?? []
            return {
                ...cur,
                [unitId]: list.filter(l => l.id !== lessonId)
            }
        })
    }

    useEffect(() => {
        if (!selectedLesson) {
            setLessonNotes([])
            setNoteText('')
            setNoteColor('#111827')
            setNoteImageUrl(null)
            setEditingNoteId(null)
            setCommentText('')
            setCommentImageUrl(null)
            setComments([])
            setQuizQuestions([])
            setIsCreatingQuiz(false)
            setSelectedVideo(null)
            setSelectedAnswers({})
            setIsQuizSubmitted(false)
            setQuizScore(0)
            return
        }

        const savedNotes = localStorage.getItem(getNoteKey(selectedLesson.id))
        if (savedNotes) {
            try {
                setLessonNotes(JSON.parse(savedNotes) as LessonNote[])
            } catch {
                setLessonNotes([])
            }
        } else {
            setLessonNotes([])
        }

        const savedComments = localStorage.getItem(getCommentsKey(selectedLesson.id))
        if (savedComments) {
            try {
                const parsed = JSON.parse(savedComments) as Array<Partial<DiscussionComment> & { createdAt?: string }>
                const normalized = parsed.map((comment) => ({
                    id: comment.id ?? `comment-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
                    text: comment.text ?? '',
                    imageUrl: comment.imageUrl ?? null,
                    timestamp: comment.timestamp ?? comment.createdAt ?? new Date().toISOString(),
                }))
                setComments(normalized)
            } catch {
                setComments([])
            }
        } else {
            setComments([])
        }

        // Load quiz questions
        const savedQuiz = loadQuizFromStorage(selectedLesson.id)
        setQuizQuestions(savedQuiz)
        setIsCreatingQuiz(false)
        setSelectedAnswers({})
        setIsQuizSubmitted(false)
        setQuizScore(0)

        setNoteText('')
        setNoteColor('#111827')
        setNoteImageUrl(null)
        setEditingNoteId(null)
        setCommentText('')
        setCommentImageUrl(null)
        setActiveTab(null)
    }, [selectedLesson])

    const handleLessonClick = (video: { id: string; title: string; description?: string; duration?: string; url: string }) => {
        setSelectedLesson({
            id: video.id,
            title: video.title,
            description: video.description,
            duration: video.duration,
            videoUrl: video.url,
        })
        setSelectedVideo(video.url)
    }

    const getYouTubeEmbedUrl = (url: string | null) => {
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : null;
    }

    const saveNotesToStorage = (lessonId: string, notes: LessonNote[]) => {
        localStorage.setItem(getNoteKey(lessonId), JSON.stringify(notes))
    }

    const clearNoteForm = () => {
        setNoteText('')
        setNoteColor('#111827')
        setNoteImageUrl(null)
        setEditingNoteId(null)
    }

    const showToast = (message: string) => {
        setToastMessage(message)
        window.setTimeout(() => setToastMessage(null), 2500)
    }

    const handleSaveNotes = () => {
        if (!selectedLesson || !noteText.trim()) return

        const timestamp = new Date().toISOString()

        const nextNotes = editingNoteId
            ? lessonNotes.map((note) =>
                note.id === editingNoteId
                    ? {
                        ...note,
                        text: noteText.trim(),
                        color: noteColor,
                        imageUrl: noteImageUrl,
                        timestamp,
                    }
                    : note,
            )
            : [
                {
                    id: `note-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
                    text: noteText.trim(),
                    color: noteColor,
                    imageUrl: noteImageUrl,
                    timestamp,
                },
                ...lessonNotes,
            ]

        setLessonNotes(nextNotes)
        saveNotesToStorage(selectedLesson.id, nextNotes)
        clearNoteForm()
        showToast('Saved Successfully')
    }

    const handleEditNote = (noteId: string) => {
        const note = lessonNotes.find((item) => item.id === noteId)
        if (!note) return

        setNoteText(note.text)
        setNoteColor(note.color)
        setNoteImageUrl(note.imageUrl ?? null)
        setEditingNoteId(note.id)
    }

    const handleDeleteNote = (noteId: string) => {
        const confirmed = window.confirm('Delete this note?')
        if (!confirmed || !selectedLesson) return

        const nextNotes = lessonNotes.filter((note) => note.id !== noteId)
        setLessonNotes(nextNotes)
        saveNotesToStorage(selectedLesson.id, nextNotes)

        if (editingNoteId === noteId) {
            clearNoteForm()
        }
    }

    const handleNoteImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return

        const dataUrl = await readFileAsDataUrl(file)
        setNoteImageUrl(dataUrl)
    }

    const handleDiscussionImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return

        const dataUrl = await readFileAsDataUrl(file)
        setCommentImageUrl(dataUrl)
    }

    const handlePostComment = () => {
        if (!selectedLesson || !commentText.trim()) return

        const newComment: DiscussionComment = {
            id: `${Date.now()}`,
            text: commentText.trim(),
            imageUrl: commentImageUrl,
            timestamp: new Date().toISOString(),
        }

        const nextComments = [newComment, ...comments]
        setComments(nextComments)
        localStorage.setItem(getCommentsKey(selectedLesson.id), JSON.stringify(nextComments))
        setCommentText('')
        setCommentImageUrl(null)
        showToast('Posted Successfully')
    }

    const handleDeleteComment = (commentId: string) => {
        if (!selectedLesson) return

        const confirmed = window.confirm('Are you sure?')
        if (!confirmed) return

        const nextComments = comments.filter((comment) => comment.id !== commentId)
        setComments(nextComments)
        localStorage.setItem(getCommentsKey(selectedLesson.id), JSON.stringify(nextComments))
    }

    const saveQuizToStorage = (lessonId: string, questions: QuizQuestion[]) => {
        localStorage.setItem(getQuizKey(lessonId), JSON.stringify(questions))
    }

    const loadQuizFromStorage = (lessonId: string): QuizQuestion[] => {
        const saved = localStorage.getItem(getQuizKey(lessonId))
        if (saved) {
            try {
                return JSON.parse(saved) as QuizQuestion[]
            } catch {
                return []
            }
        }
        return []
    }

    const handleSaveQuiz = (questions: QuizQuestion[]) => {
        if (!selectedLesson) return

        setQuizQuestions(questions)
        saveQuizToStorage(selectedLesson.id, questions)
        setIsCreatingQuiz(false)
        setSelectedAnswers({})
        setIsQuizSubmitted(false)
        setQuizScore(0)
        showToast('Quiz saved successfully!')
    }

    const handleStartCreatingQuiz = () => {
        setIsCreatingQuiz(true)
    }

    const handleCancelQuizCreation = () => {
        setIsCreatingQuiz(false)
    }

    const handleAnswerSelect = (questionId: string, optionIndex: number) => {
        if (isQuizSubmitted) return;
        setSelectedAnswers(prev => ({
            ...prev,
            [questionId]: optionIndex
        }))
    }

    const handleSubmitQuiz = () => {
        let score = 0;
        quizQuestions.forEach(question => {
            if (selectedAnswers[question.id] === question.correctAnswerIndex) {
                score += 1;
            }
        });
        setQuizScore(score);
        setIsQuizSubmitted(true);
    }

    useEffect(() => {
        const saved = localStorage.getItem(SAVED_COURSES_KEY)
        if (saved) {
            try {
                const storedCourses = JSON.parse(saved) as Course[]
                setCourseList(storedCourses)
                return
            } catch {
                // fall through to initial prebuilt courses
            }
        }

        setCourseList(prebuiltCourses)
        localStorage.setItem(SAVED_COURSES_KEY, JSON.stringify(prebuiltCourses))
    }, [])

    const handleSaveCourse = () => {
        if (!newCourseTitle.trim() || !newCourseDescription.trim()) {
            setSaveStatus('Please provide a course title and description.')
            return
        }

        const newCourse: Course = {
            id: `course-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            title: newCourseTitle.trim(),
            description: newCourseDescription.trim(),
            durationWeeks: Math.max(1, newCourseWeeks),
            unitCount: courseUnits.length,
            units: courseUnits,
        }

        const nextCourseList = [newCourse, ...courseList]
        setCourseList(nextCourseList)
        localStorage.setItem(SAVED_COURSES_KEY, JSON.stringify(nextCourseList))

        setNewCourseTitle('')
        setNewCourseDescription('')
        setNewCourseWeeks(4)
        setNewCourseUnits(1)
        setCourseUnits([
            {
                id: `unit-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
                title: 'Unit 1',
                videos: [],
            },
        ])
        setSaveStatus('Course saved successfully.')
        setShowAddCourseForm(true)
    }

    const handleDeleteCourse = (courseId: string) => {
        const confirmed = window.confirm('Are you sure you want to delete this course?')
        if (!confirmed) return

        const remainingCourses = courseList.filter((course) => course.id !== courseId)
        setCourseList(remainingCourses)
        localStorage.setItem(SAVED_COURSES_KEY, JSON.stringify(remainingCourses))

        if (openCourseId === courseId) {
            setOpenCourseId(null)
        }
    }

    return (
        <div className="min-h-screen bg-background px-6 py-10 text-foreground">
            <div className="mx-auto max-w-6xl">
                {toastMessage && (
                    <div className="fixed bottom-6 right-6 z-50 rounded-3xl border border-border bg-card px-5 py-4 text-sm text-foreground shadow-lg">
                        {toastMessage}
                    </div>
                )}
                <div className="mb-10">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Learning Library</p>
                            <h1 className="mt-3 text-4xl font-semibold text-foreground">Learn Hub</h1>
                            <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground">
                                Master Trading with Structured Courses.
                            </p>
                        </div>
                        <Dialog open={showAddCourseForm} onOpenChange={setShowAddCourseForm}>
                            <DialogTrigger asChild>
                                <button
                                    type="button"
                                    className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary/90"
                                >
                                    + Add Course
                                </button>
                            </DialogTrigger>
                            <DialogContent className="flex max-h-[80vh] flex-col sm:max-w-2xl rounded-3xl border-white/10 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]">
                                <DialogHeader>
                                    <DialogTitle>Add Course</DialogTitle>
                                    <DialogDescription>Create a new course in the Learn Hub.</DialogDescription>
                                </DialogHeader>
                                <div className="flex-1 overflow-y-auto pr-1 min-h-0">
                                    <div className="space-y-4">
                                        <div className="grid gap-4 sm:grid-cols-2">
                                            <label className="space-y-2 text-sm text-muted-foreground">
                                                <span>Course Title</span>
                                                <input
                                                    value={newCourseTitle}
                                                    onChange={(event) => setNewCourseTitle(event.target.value)}
                                                    placeholder="Enter course title"
                                                    className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm text-foreground outline-none transition focus:border-primary"
                                                />
                                            </label>
                                            <label className="space-y-2 text-sm text-muted-foreground">
                                                <span>Number of Weeks</span>
                                                <input
                                                    type="number"
                                                    min={1}
                                                    value={newCourseWeeks}
                                                    onChange={(event) => setNewCourseWeeks(Math.max(1, Number(event.target.value) || 1))}
                                                    className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm text-foreground outline-none transition focus:border-primary"
                                                />
                                            </label>
                                        </div>
                                        <label className="space-y-2 text-sm text-muted-foreground">
                                            <span>Description</span>
                                            <textarea
                                                value={newCourseDescription}
                                                onChange={(event) => setNewCourseDescription(event.target.value)}
                                                placeholder="Enter course description"
                                                className="min-h-[120px] w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary"
                                            />
                                        </label>
                                        <label className="space-y-2 text-sm text-muted-foreground sm:w-1/2">
                                            <span>Number of Units</span>
                                            <input
                                                type="number"
                                                min={1}
                                                value={newCourseUnits}
                                                onChange={(event) => {
                                                    const count = Math.max(1, Number(event.target.value) || 1)
                                                    setNewCourseUnits(count)
                                                    syncCourseUnits(count)
                                                }}
                                                className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm text-foreground outline-none transition focus:border-primary"
                                            />
                                        </label>
                                        <div className="space-y-4 rounded-3xl border border-border bg-slate-950/5 p-4">
                                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                                <div>
                                                    <p className="text-sm font-semibold text-foreground">Units</p>
                                                    <p className="text-sm text-muted-foreground">Add unit titles and expand each unit to view lessons.</p>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={addUnit}
                                                    className="inline-flex items-center justify-center rounded-lg bg-primary px-3 py-2 text-xs font-medium text-white transition hover:bg-primary/90"
                                                >
                                                    Add Unit
                                                </button>
                                            </div>
                                            <div className="space-y-3">
                                                {courseUnits.map((unit, unitIndex) => (
                                                    <div key={unit.id} className="flex flex-col sm:flex-row sm:items-center justify-between rounded-2xl border border-border bg-background p-4 gap-4">
                                                        <div className="flex-1">
                                                            <input
                                                                value={unit.title}
                                                                onChange={(event) => updateUnitTitle(unit.id, event.target.value)}
                                                                className="w-full bg-transparent text-sm font-semibold text-foreground outline-none border-b border-transparent focus:border-border transition"
                                                                placeholder={`Unit ${unitIndex + 1} title`}
                                                            />
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            <span className="text-xs text-muted-foreground">{unit.videos.length} lessons</span>
                                                            <button
                                                                type="button"
                                                                onClick={() => setManagingLessonsUnitId(unit.id)}
                                                                className="rounded-lg bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground transition hover:bg-secondary/80"
                                                            >
                                                                Manage Lessons
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        {saveStatus && (
                                            <p className="text-sm text-muted-foreground">{saveStatus}</p>
                                        )}
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button type="button" onClick={handleSaveCourse}>
                                        Save Course
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>

                        {/* Separate Nested Manage Lessons Dialog */}
                        <Sheet open={!!managingLessonsUnitId} onOpenChange={(open) => !open && setManagingLessonsUnitId(null)}>
                            <SheetContent className="flex flex-col sm:max-w-xl overflow-hidden px-4">
                                <SheetHeader>
                                    <SheetTitle>Manage Lessons</SheetTitle>
                                    <SheetDescription>
                                        {courseUnits.find(u => u.id === managingLessonsUnitId)?.title || 'Unit Lessons'}
                                    </SheetDescription>
                                </SheetHeader>
                                <div className="flex-1 overflow-y-auto pr-1 min-h-0 pt-2 pb-4">
                                    {managingLessonsUnitId && (() => {
                                        const unit = courseUnits.find(u => u.id === managingLessonsUnitId);
                                        if (!unit) return null;
                                        return (
                                            <div className="space-y-6">
                                                <div className="flex items-center gap-4 rounded-xl border border-border bg-slate-950/5 p-1">
                                                    <button
                                                        type="button"
                                                        onClick={() => setBulkModes(cur => ({ ...cur, [unit.id]: false }))}
                                                        className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition ${!bulkModes[unit.id] ? 'bg-background shadow text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                                                    >
                                                        Single Lesson
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setBulkModes(cur => ({ ...cur, [unit.id]: true }))
                                                            if (!bulkLessonList[unit.id] || bulkLessonList[unit.id].length === 0) {
                                                                setBulkLessonList(cur => ({ ...cur, [unit.id]: [{ id: Math.random().toString(), title: '', duration: '30 mins', url: '' }] }))
                                                            }
                                                        }}
                                                        className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition ${bulkModes[unit.id] ? 'bg-background shadow text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                                                    >
                                                        Bulk Add
                                                    </button>
                                                </div>

                                                {bulkModes[unit.id] ? (
                                                    <div className="space-y-4">
                                                        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                                                            {(bulkLessonList[unit.id] || [{ id: 'default', title: '', duration: '30 mins', url: '' }]).map((lesson, index) => (
                                                                <div key={lesson.id} className="relative grid gap-4 rounded-xl border border-border bg-slate-950/5 p-4">
                                                                    <div className="flex items-center justify-between">
                                                                        <span className="text-xs font-semibold uppercase text-muted-foreground">Lesson {index + 1}</span>
                                                                        {(bulkLessonList[unit.id]?.length > 1) && (
                                                                            <button
                                                                                type="button"
                                                                                onClick={() => removeBulkLesson(unit.id, lesson.id)}
                                                                                className="text-muted-foreground hover:text-red-500 transition"
                                                                            >
                                                                                <X className="h-4 w-4" />
                                                                            </button>
                                                                        )}
                                                                    </div>
                                                                    <div className="grid gap-4 sm:grid-cols-2">
                                                                        <label className="space-y-2 text-sm text-muted-foreground">
                                                                            <span>Lesson Title</span>
                                                                            <input
                                                                                value={lesson.title}
                                                                                onChange={(e) => updateBulkLesson(unit.id, lesson.id, 'title', e.target.value)}
                                                                                placeholder="Enter lesson title"
                                                                                className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm text-foreground outline-none transition focus:border-primary"
                                                                            />
                                                                        </label>
                                                                        <label className="space-y-2 text-sm text-muted-foreground">
                                                                            <span>Duration</span>
                                                                            <input
                                                                                value={lesson.duration}
                                                                                onChange={(e) => updateBulkLesson(unit.id, lesson.id, 'duration', e.target.value)}
                                                                                placeholder="30 mins"
                                                                                className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm text-foreground outline-none transition focus:border-primary"
                                                                            />
                                                                        </label>
                                                                    </div>
                                                                    <label className="space-y-2 text-sm text-muted-foreground">
                                                                        <span>Video URL</span>
                                                                        <input
                                                                            value={lesson.url}
                                                                            onChange={(e) => updateBulkLesson(unit.id, lesson.id, 'url', e.target.value)}
                                                                            placeholder="https://example.com/video.mp4"
                                                                            className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm text-foreground outline-none transition focus:border-primary"
                                                                        />
                                                                    </label>
                                                                </div>
                                                            ))}
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => addBulkLessonRow(unit.id)}
                                                            className="inline-flex w-full items-center justify-center rounded-lg border border-dashed border-border bg-transparent px-4 py-3 text-sm font-medium text-foreground transition hover:bg-card"
                                                        >
                                                            + Add Lesson
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => addBulkLessonsToUnit(unit.id)}
                                                            className="inline-flex w-full items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary/90"
                                                        >
                                                            Save Lessons
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="space-y-4">
                                                        <div className="grid gap-4 sm:grid-cols-2">
                                                            <label className="space-y-2 text-sm text-muted-foreground">
                                                                <span>Lesson Title</span>
                                                                <input
                                                                    value={lessonDrafts[unit.id]?.title ?? ''}
                                                                    onChange={(event) => updateLessonDraft(unit.id, 'title', event.target.value)}
                                                                    placeholder="Enter lesson title"
                                                                    className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm text-foreground outline-none transition focus:border-primary"
                                                                />
                                                            </label>
                                                            <label className="space-y-2 text-sm text-muted-foreground">
                                                                <span>Duration</span>
                                                                <input
                                                                    value={lessonDrafts[unit.id]?.duration ?? '30 mins'}
                                                                    onChange={(event) => updateLessonDraft(unit.id, 'duration', event.target.value)}
                                                                    placeholder="30 mins"
                                                                    className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm text-foreground outline-none transition focus:border-primary"
                                                                />
                                                            </label>
                                                        </div>
                                                        <label className="space-y-2 text-sm text-muted-foreground">
                                                            <span>Video URL</span>
                                                            <input
                                                                value={lessonDrafts[unit.id]?.videoUrl ?? ''}
                                                                onChange={(event) => updateLessonDraft(unit.id, 'videoUrl', event.target.value)}
                                                                placeholder="https://example.com/video.mp4"
                                                                className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm text-foreground outline-none transition focus:border-primary"
                                                            />
                                                        </label>
                                                        <button
                                                            type="button"
                                                            onClick={() => addLessonToUnit(unit.id)}
                                                            className="inline-flex w-full items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary/90"
                                                        >
                                                            Add Lesson
                                                        </button>
                                                    </div>
                                                )}

                                                <div className="space-y-3 pt-4 border-t border-border">
                                                    <p className="text-sm font-semibold text-foreground">Added Lessons ({unit.videos.length})</p>
                                                    {unit.videos.length === 0 ? (
                                                        <div className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                                                            No lessons added yet.
                                                        </div>
                                                    ) : (
                                                        <ul className="space-y-2">
                                                            {unit.videos.map((video) => (
                                                                <li key={video.id} className="flex justify-between items-center rounded-xl bg-slate-50/5 border border-border px-4 py-3 text-sm text-foreground">
                                                                    <div className="font-medium truncate max-w-[200px] sm:max-w-xs">{video.title}</div>
                                                                    <div className="text-muted-foreground text-xs whitespace-nowrap">{video.duration ?? '30 mins'}</div>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })()}
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>



                {selectedLesson ? (
                    <div className="space-y-8">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Lesson view</p>
                                <h2 className="mt-2 text-3xl font-semibold text-foreground">{selectedLesson.title}</h2>
                            </div>
                            <button
                                type="button"
                                onClick={() => setSelectedLesson(null)}
                                className="inline-flex items-center rounded-lg border border-border bg-card px-4 py-2 text-sm text-foreground transition hover:bg-card/80"
                            >
                                Back to course list
                            </button>
                        </div>

                        <div className="overflow-hidden rounded-3xl bg-black shadow-lg flex items-center justify-center min-h-[300px]">
                            {!selectedVideo ? (
                                <p className="text-muted-foreground p-6">Select a lesson to play video</p>
                            ) : getYouTubeEmbedUrl(selectedVideo) ? (
                                <iframe
                                    className="w-full aspect-video"
                                    src={getYouTubeEmbedUrl(selectedVideo)!}
                                    title="YouTube video player"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            ) : (
                                <video
                                    controls
                                    className="w-full max-h-[640px] bg-black"
                                    src={selectedVideo}
                                />
                            )}
                        </div>

                        <div className="mt-6 flex flex-wrap items-center gap-4 border-b border-border pb-3">
                            <button
                                type="button"
                                onClick={() => setActiveTab('notes')}
                                className={`rounded-t-lg px-4 py-2 text-sm font-semibold transition ${activeTab === 'notes' ? 'border-b-2 border-primary text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                            >
                                Notes
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab('discussion')}
                                className={`rounded-t-lg px-4 py-2 text-sm font-semibold transition ${activeTab === 'discussion' ? 'border-b-2 border-primary text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                            >
                                Discussion
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab('quiz')}
                                className={`rounded-t-lg px-4 py-2 text-sm font-semibold transition ${activeTab === 'quiz' ? 'border-b-2 border-primary text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                            >
                                Quiz
                            </button>
                        </div>

                        {activeTab === 'notes' && (
                            <div className="space-y-6">
                                <div className="relative rounded-3xl border border-border bg-card p-6">
                                    <div className="flex flex-col gap-4">
                                        <button
                                            type="button"
                                            onClick={() => setActiveTab(null)}
                                            aria-label="Close notes"
                                            className="absolute top-4 right-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition hover:bg-red-50 hover:text-red-600"
                                        >
                                            <X className="size-4" />
                                        </button>
                                        <div>
                                            <h3 className="text-lg font-semibold">My Notes</h3>
                                            <p className="mt-1 text-sm text-muted-foreground">Write, save, edit, and delete notes for this lesson.</p>
                                        </div>
                                        <div className="flex justify-end">
                                            <button
                                                type="button"
                                                onClick={handleSaveNotes}
                                                className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary/90"
                                            >
                                                {editingNoteId ? 'Update Note' : 'Save Note'}
                                            </button>
                                        </div>
                                        <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
                                            <label className="flex flex-col gap-2 text-sm text-muted-foreground">
                                                Text color
                                                <input
                                                    type="color"
                                                    value={noteColor}
                                                    onChange={(event) => setNoteColor(event.target.value)}
                                                    className="h-10 w-full cursor-pointer rounded-lg border border-border bg-background"
                                                />
                                            </label>
                                            <label className="flex flex-col gap-2 text-sm text-muted-foreground">
                                                Upload image
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleNoteImageChange}
                                                    className="rounded-lg border border-border bg-background px-4 py-2 text-sm text-foreground"
                                                />
                                            </label>
                                        </div>

                                        <textarea
                                            value={noteText}
                                            onChange={(event) => setNoteText(event.target.value)}
                                            placeholder="Write your lesson notes here..."
                                            style={{ color: noteColor }}
                                            className="min-h-[180px] w-full rounded-3xl border border-border bg-background p-4 text-sm leading-6 outline-none transition focus:border-primary"
                                        />

                                        {noteImageUrl && (
                                            <img
                                                src={noteImageUrl}
                                                alt="Uploaded note"
                                                className="w-full rounded-3xl object-cover"
                                            />
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-semibold">Saved Notes</h3>
                                        <span className="text-sm text-muted-foreground">{lessonNotes.length} note{lessonNotes.length === 1 ? '' : 's'}</span>
                                    </div>
                                    {lessonNotes.length === 0 ? (
                                        <div className="rounded-3xl border border-dashed border-border bg-card p-6 text-sm text-muted-foreground">
                                            No notes saved yet for this lesson.
                                        </div>
                                    ) : (
                                        <div className="grid gap-4">
                                            {lessonNotes.map((note) => (
                                                <div key={note.id} className="rounded-3xl border border-border bg-background p-4 shadow-sm">
                                                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                                        <div>
                                                            <p className="text-sm text-muted-foreground">{new Date(note.timestamp).toLocaleString()}</p>
                                                            <p className="mt-2 whitespace-pre-wrap text-sm" style={{ color: note.color }}>
                                                                {note.text}
                                                            </p>
                                                        </div>
                                                        <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium" style={{ color: note.color, borderColor: note.color }}>
                                                            Selected color
                                                        </div>
                                                    </div>
                                                    {note.imageUrl && (
                                                        <img
                                                            src={note.imageUrl}
                                                            alt="Saved note image"
                                                            className="mt-4 w-full rounded-3xl object-cover"
                                                        />
                                                    )}
                                                    <div className="mt-4 flex flex-wrap gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleEditNote(note.id)}
                                                            className="inline-flex items-center justify-center rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground transition hover:bg-card/80"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleDeleteNote(note.id)}
                                                            className="inline-flex items-center justify-center rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground transition hover:bg-red-50 hover:text-red-600"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="rounded-3xl border border-border bg-card p-6">
                            <h3 className="text-lg font-semibold">Lesson summary</h3>
                            <p className="mt-3 text-sm leading-6 text-muted-foreground">
                                {selectedLesson.description ?? 'No description is available for this lesson yet.'}
                            </p>
                        </div>

                        {activeTab === 'discussion' && (
                            <div className="rounded-3xl border border-border bg-card p-6">
                                <div className="flex items-center justify-between gap-4">
                                    <h3 className="text-lg font-semibold">Discussion</h3>
                                    <button
                                        type="button"
                                        onClick={() => setActiveTab(null)}
                                        aria-label="Close discussion"
                                        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition hover:bg-red-50 hover:text-red-600"
                                    >
                                        <X className="size-4" />
                                    </button>
                                </div>
                                <div className="mt-4 space-y-4">
                                    <textarea
                                        value={commentText}
                                        onChange={(event) => setCommentText(event.target.value)}
                                        placeholder="Write your doubt or comment..."
                                        className="min-h-[140px] w-full rounded-3xl border border-border bg-background p-4 text-sm leading-6 outline-none transition focus:border-primary"
                                    />
                                    <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
                                        <label className="flex cursor-pointer items-center justify-between rounded-3xl border border-border bg-background px-4 py-3 text-sm text-muted-foreground transition hover:bg-card/50">
                                            Upload image
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleDiscussionImageChange}
                                                className="hidden"
                                            />
                                        </label>
                                        <button
                                            type="button"
                                            onClick={handlePostComment}
                                            className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-3 text-sm font-medium text-white transition hover:bg-primary/90"
                                        >
                                            Post Comment
                                        </button>
                                    </div>
                                    {commentImageUrl && (
                                        <img
                                            src={commentImageUrl}
                                            alt="Discussion upload preview"
                                            className="w-full rounded-3xl object-cover"
                                        />
                                    )}
                                </div>

                                <div className="mt-6 space-y-4">
                                    {comments.length > 0 ? (
                                        comments.map((comment) => (
                                            <div key={comment.id} className="rounded-3xl border border-border bg-background p-4">
                                                <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                                    <span className="text-sm font-medium text-foreground">Posted</span>
                                                    <span className="text-xs text-muted-foreground">{new Date(comment.timestamp).toLocaleString()}</span>
                                                </div>
                                                <p className="text-sm leading-6 text-foreground">{comment.text}</p>
                                                {comment.imageUrl && (
                                                    <img
                                                        src={comment.imageUrl}
                                                        alt="Discussion comment"
                                                        className="mt-3 w-full rounded-3xl object-cover"
                                                    />
                                                )}
                                                <div className="mt-4">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDeleteComment(comment.id)}
                                                        className="inline-flex items-center justify-center rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground transition hover:bg-red-50 hover:text-red-600"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-sm text-muted-foreground">No discussion comments yet. Share your doubts here.</p>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === 'quiz' && (
                            <div className="rounded-3xl border border-border bg-card p-6">
                                <div className="flex items-center justify-between gap-4">
                                    <h3 className="text-lg font-semibold">Lesson Quiz</h3>
                                    <button
                                        type="button"
                                        onClick={() => setActiveTab(null)}
                                        aria-label="Close quiz"
                                        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition hover:bg-red-50 hover:text-red-600"
                                    >
                                        <X className="size-4" />
                                    </button>
                                </div>
                                <div className="mt-6 space-y-6">
                                    {isCreatingQuiz ? (
                                        <QuizCreator
                                            lessonId={selectedLesson?.id || ''}
                                            initialQuestions={quizQuestions}
                                            onSave={handleSaveQuiz}
                                            onCancel={handleCancelQuizCreation}
                                        />
                                    ) : quizQuestions.length > 0 ? (
                                        <div className="space-y-6">
                                            {isQuizSubmitted && (
                                                <div className="rounded-xl border border-primary/20 bg-primary/10 p-6 text-center">
                                                    <h4 className="text-xl font-bold text-primary">Your Score: {quizScore} / {quizQuestions.length}</h4>
                                                    <p className="mt-2 text-sm text-muted-foreground">
                                                        {quizScore === quizQuestions.length ? 'Perfect score! Excellent job.' : 'Review your answers below.'}
                                                    </p>
                                                </div>
                                            )}
                                            
                                            {quizQuestions.map((question, qIdx) => (
                                                <div key={question.id} className={`rounded-3xl border ${isQuizSubmitted && selectedAnswers[question.id] === question.correctAnswerIndex ? 'border-green-500/50' : isQuizSubmitted && selectedAnswers[question.id] !== undefined ? 'border-red-500/50' : 'border-border'} bg-background p-6`}>
                                                    <p className="text-sm font-medium text-foreground">{qIdx + 1}. {question.question}</p>
                                                    <div className="mt-4 space-y-3">
                                                        {question.options.map((option, optIdx) => {
                                                            const isSelected = selectedAnswers[question.id] === optIdx;
                                                            const isCorrect = question.correctAnswerIndex === optIdx;
                                                            let optionClass = "border-border bg-card hover:bg-card/80";
                                                            
                                                            if (isQuizSubmitted) {
                                                                if (isCorrect) {
                                                                    optionClass = "border-green-500 bg-green-500/10 text-green-700 dark:text-green-400";
                                                                } else if (isSelected) {
                                                                    optionClass = "border-red-500 bg-red-500/10 text-red-700 dark:text-red-400";
                                                                } else {
                                                                    optionClass = "border-border bg-card opacity-50";
                                                                }
                                                            } else if (isSelected) {
                                                                optionClass = "border-primary bg-primary/5";
                                                            }

                                                            return (
                                                                <label key={optIdx} className={`flex ${isQuizSubmitted ? 'cursor-default' : 'cursor-pointer'} items-center gap-3 rounded-xl border px-4 py-3 text-sm transition ${optionClass}`}>
                                                                    <input
                                                                        type="radio"
                                                                        name={`quiz-q${qIdx}`}
                                                                        value={optIdx}
                                                                        checked={isSelected}
                                                                        onChange={() => handleAnswerSelect(question.id, optIdx)}
                                                                        disabled={isQuizSubmitted}
                                                                        className="h-4 w-4 accent-primary"
                                                                    />
                                                                    <span className={isQuizSubmitted && (isCorrect || isSelected) ? "font-semibold" : "text-foreground"}>{String.fromCharCode(65 + optIdx)}. {option}</span>
                                                                </label>
                                                            )
                                                        })}
                                                    </div>
                                                    {isQuizSubmitted && question.explanation && (
                                                        <div className="mt-4 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
                                                            <p className="text-xs font-semibold text-blue-900 dark:text-blue-100">Explanation:</p>
                                                            <p className="text-sm text-blue-800 dark:text-blue-200 mt-1">{question.explanation}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                            <div className="flex gap-2 justify-end pt-4 border-t">
                                                {!isQuizSubmitted && (
                                                    <Button
                                                        onClick={handleStartCreatingQuiz}
                                                        variant="outline"
                                                        className="gap-2"
                                                    >
                                                        <Edit3 className="w-4 h-4" />
                                                        Edit Quiz
                                                    </Button>
                                                )}
                                                {!isQuizSubmitted ? (
                                                    <Button 
                                                        onClick={handleSubmitQuiz}
                                                        disabled={Object.keys(selectedAnswers).length < quizQuestions.length}
                                                        className="gap-2"
                                                    >
                                                        Submit Quiz
                                                    </Button>
                                                ) : (
                                                    <Button 
                                                        onClick={() => {
                                                            setIsQuizSubmitted(false)
                                                            setSelectedAnswers({})
                                                            setQuizScore(0)
                                                        }}
                                                        variant="outline"
                                                        className="gap-2"
                                                    >
                                                        Retake Quiz
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="rounded-3xl border border-dashed border-border bg-background p-12 text-center">
                                            <p className="text-sm text-muted-foreground mb-4">No quiz questions yet. Create your first quiz!</p>
                                            <Button onClick={handleStartCreatingQuiz} className="gap-2">
                                                <Plus className="w-4 h-4" />
                                                Create Quiz
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {courseList.map((course) => {
                            const open = openCourseId === course.id
                            return (
                                <div key={course.id} className="rounded-3xl border border-border bg-card">
                                    <div className="flex flex-col gap-4 px-6 py-6 sm:flex-row sm:items-start sm:justify-between">
                                        <button
                                            type="button"
                                            className="flex-1 text-left text-foreground transition hover:bg-card/10 sm:pr-4"
                                            onClick={() => setOpenCourseId(open ? null : course.id)}
                                        >
                                            <div className="flex items-start justify-between gap-4">
                                                <div>
                                                    <h2 className="text-lg font-semibold">{course.title}</h2>
                                                    <p className="mt-1 text-sm text-muted-foreground">
                                                        {course.unitCount} units · {course.durationWeeks} weeks
                                                    </p>
                                                </div>
                                                <ChevronRight className={`size-5 text-muted-foreground transition ${open ? 'rotate-90' : ''}`} />
                                            </div>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={(event) => {
                                                event.stopPropagation()
                                                handleDeleteCourse(course.id)
                                            }}
                                            className="inline-flex items-center justify-center rounded-full border border-border bg-background px-3 py-2 text-sm font-medium text-foreground transition hover:bg-red-50 hover:text-red-600"
                                        >
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Delete
                                        </button>
                                    </div>

                                    {open && (
                                        <div className="border-t border-border px-6 pb-6 pt-4">
                                            {course.units.length ? (
                                                <div className="space-y-4">
                                                    {course.units.map((unit) => (
                                                        <div key={unit.id} className="rounded-3xl bg-background/50 p-4">
                                                            <div className="mb-3 text-sm font-semibold text-foreground">{unit.title}</div>
                                                            <ul className="space-y-2">
                                                                {unit.videos.map((video) => (
                                                                    <li key={video.id}>
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => handleLessonClick(video)}
                                                                            className="flex w-full items-center justify-between rounded-2xl border border-border bg-card px-4 py-3 text-left text-foreground transition hover:bg-card/10"
                                                                        >
                                                                            <div>
                                                                                <p className="font-medium">{video.title}</p>
                                                                                <p className="mt-1 text-xs text-muted-foreground">{video.duration ?? 'Lesson video'}</p>
                                                                            </div>
                                                                            <ChevronRight className="size-4 text-muted-foreground" />
                                                                        </button>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-sm text-muted-foreground">No units available yet.</p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}
