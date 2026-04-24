'use client'

import { useState } from 'react'

type Lesson = {
    id: string
    title: string
    duration: string
    type: 'Learning' | 'Practice'
    videoUrl: string
}

type Unit = {
    id: string
    title: string
    lessons: Lesson[]
}

type Course = {
    id: string
    title: string
    description: string
    tags: string[]
    units: Unit[]
}

type LessonDraft = {
    title: string
    duration: string
    type: 'Learning' | 'Practice'
}

const initialCourses: Course[] = [
    {
        id: 'course-1',
        title: 'Frontend Foundations',
        description: 'A beginner-friendly course covering HTML, CSS, and JavaScript basics.',
        tags: ['HTML', 'CSS', 'JavaScript'],
        units: [
            {
                id: 'unit-1',
                title: 'HTML Basics',
                lessons: [
                    {
                        id: 'lesson-1',
                        title: 'Intro to HTML',
                        duration: '30 mins',
                        type: 'Learning',
                        videoUrl: 'https://example.com/html-intro',
                    },
                    {
                        id: 'lesson-2',
                        title: 'HTML Practice',
                        duration: '20 mins',
                        type: 'Practice',
                        videoUrl: '',
                    },
                ],
            },
            {
                id: 'unit-2',
                title: 'CSS Layouts',
                lessons: [
                    {
                        id: 'lesson-3',
                        title: 'Flexbox Fundamentals',
                        duration: '35 mins',
                        type: 'Learning',
                        videoUrl: 'https://example.com/flexbox',
                    },
                ],
            },
        ],
    },
    {
        id: 'course-2',
        title: 'Practice with React',
        description: 'Build interactive UI components and state-driven lessons with React.',
        tags: ['React', 'State', 'Components'],
        units: [
            {
                id: 'unit-3',
                title: 'React Basics',
                lessons: [
                    {
                        id: 'lesson-4',
                        title: 'React Components',
                        duration: '40 mins',
                        type: 'Learning',
                        videoUrl: 'https://example.com/react-components',
                    },
                    {
                        id: 'lesson-5',
                        title: 'React Practice',
                        duration: '25 mins',
                        type: 'Practice',
                        videoUrl: '',
                    },
                ],
            },
        ],
    },
]

export default function CourseManager() {
    const [courses, setCourses] = useState<Course[]>(initialCourses)
    const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null)
    const [openUnitId, setOpenUnitId] = useState<string | null>(null)
    const [lessonDrafts, setLessonDrafts] = useState<Record<string, LessonDraft>>({})
    const [bulkLessonInput, setBulkLessonInput] = useState<Record<string, string>>({})

    const selectedCourse = courses.find((course) => course.id === selectedCourseId) || null

    const toggleUnit = (unitId: string) => {
        setOpenUnitId((current) => (current === unitId ? null : unitId))
    }

    const updateLessonDraft = (unitId: string, field: keyof LessonDraft, value: string) => {
        setLessonDrafts((current) => ({
            ...current,
            [unitId]: {
                title: current[unitId]?.title ?? '',
                duration: current[unitId]?.duration ?? '30 mins',
                type: current[unitId]?.type ?? 'Learning',
                [field]: value,
            },
        }))
    }

    const addLessonToUnit = (unitId: string) => {
        const draft = lessonDrafts[unitId] ?? {
            title: '',
            duration: '30 mins',
            type: 'Learning',
        }

        const newLesson: Lesson = {
            id: `lesson-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            title: draft.title.trim() || 'Untitled Lesson',
            duration: draft.duration.trim() || '30 mins',
            type: draft.type,
            videoUrl: '',
        }

        setCourses((currentCourses) =>
            currentCourses.map((course) =>
                course.id === selectedCourseId
                    ? {
                        ...course,
                        units: course.units.map((unit) =>
                            unit.id === unitId
                                ? { ...unit, lessons: [...unit.lessons, newLesson] }
                                : unit,
                        ),
                    }
                    : course,
            ),
        )

        setLessonDrafts((current) => ({
            ...current,
            [unitId]: { title: '', duration: '30 mins', type: 'Learning' },
        }))
    }

    const addBulkLessonsToUnit = (unitId: string) => {
        const raw = bulkLessonInput[unitId] ?? ''
        const rows = raw.split('\n').map((line) => line.trim()).filter(Boolean)
        if (!rows.length) {
            return
        }

        const newLessons = rows.map((row) => {
            const [title, duration, type] = row.split('|').map((part) => part.trim())
            return {
                id: `lesson-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
                title: title || 'Untitled Lesson',
                duration: duration || '30 mins',
                type: type?.toLowerCase() === 'practice' ? 'Practice' : 'Learning',
                videoUrl: '',
            } as Lesson
        })

        setCourses((currentCourses) =>
            currentCourses.map((course) =>
                course.id === selectedCourseId
                    ? {
                        ...course,
                        units: course.units.map((unit) =>
                            unit.id === unitId
                                ? { ...unit, lessons: [...unit.lessons, ...newLessons] }
                                : unit,
                        ),
                    }
                    : course,
            ),
        )

        setBulkLessonInput((current) => ({ ...current, [unitId]: '' }))
    }

    const addUnitToSelectedCourse = () => {
        if (!selectedCourseId) {
            return
        }

        setCourses((currentCourses) =>
            currentCourses.map((course) =>
                course.id === selectedCourseId
                    ? {
                        ...course,
                        units: [
                            ...course.units,
                            {
                                id: `unit-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
                                title: `New Unit ${course.units.length + 1}`,
                                lessons: [],
                            },
                        ],
                    }
                    : course,
            ),
        )
    }

    return (
        <section className="space-y-6 p-6 rounded-2xl bg-slate-50">
            <header>
                <h2 className="text-2xl font-semibold">Course Manager</h2>
                <p className="text-sm text-slate-600">Sample course data with units and lessons stored in state.</p>
            </header>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {courses.map((course) => {
                    const isSelected = course.id === selectedCourseId
                    return (
                        <button
                            key={course.id}
                            type="button"
                            onClick={() => setSelectedCourseId(course.id)}
                            className={`text-left rounded-3xl border p-5 shadow-sm transition focus:outline-none ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-slate-200 bg-white hover:border-slate-300'}`}
                        >
                            <h3 className="text-lg font-semibold text-slate-900">{course.title}</h3>
                            <p className="mt-2 text-sm text-slate-600">{course.units.length} units</p>
                        </button>
                    )
                })}
            </div>

            {selectedCourse && (
                <div className="space-y-5">
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <h3 className="text-xl font-semibold">Selected course: {selectedCourse.title}</h3>
                        <p className="mt-2 text-sm text-slate-600">{selectedCourse.description}</p>
                        <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-700">
                            {selectedCourse.tags.map((tag) => (
                                <span key={tag} className="rounded-full bg-slate-100 px-2 py-1">{tag}</span>
                            ))}
                        </div>
                        <div className="mt-4 flex flex-wrap items-center gap-3">
                            <p className="text-sm text-slate-700">Units: {selectedCourse.units.length}</p>
                            <button
                                type="button"
                                onClick={addUnitToSelectedCourse}
                                className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700 transition hover:bg-blue-100"
                            >
                                Add Unit
                            </button>
                        </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        {selectedCourse.units.map((unit) => {
                            const isExpanded = openUnitId === unit.id
                            return (
                                <div
                                    key={unit.id}
                                    className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                                >
                                    <button
                                        type="button"
                                        onClick={() => toggleUnit(unit.id)}
                                        className="flex w-full items-center justify-between gap-3 text-left"
                                    >
                                        <div>
                                            <h4 className="text-lg font-semibold text-slate-900">{unit.title}</h4>
                                            <p className="mt-2 text-sm text-slate-600">{unit.lessons.length} lessons</p>
                                        </div>
                                        <span className="rounded-full border border-slate-300 bg-slate-100 px-3 py-1 text-sm text-slate-700 transition hover:bg-slate-200">
                                            {isExpanded ? 'Collapse' : 'Expand'}
                                        </span>
                                    </button>
                                    {isExpanded && (
                                        <div className="mt-3 space-y-4">
                                            {unit.lessons.map((lesson) => (
                                                <div key={lesson.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                                        <div>
                                                            <p className="font-medium text-slate-900">{lesson.title}</p>
                                                            <p className="text-sm text-slate-600">{lesson.duration}</p>
                                                        </div>
                                                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-600">
                                                            {lesson.type}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}

                                            <form
                                                onSubmit={(event) => {
                                                    event.preventDefault()
                                                    addLessonToUnit(unit.id)
                                                }}
                                                className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                                            >
                                                <h5 className="text-sm font-semibold text-slate-900">Add a new lesson</h5>
                                                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                                                    <label className="space-y-2 text-sm text-slate-700">
                                                        <span>Title</span>
                                                        <input
                                                            value={lessonDrafts[unit.id]?.title ?? ''}
                                                            onChange={(event) => updateLessonDraft(unit.id, 'title', event.target.value)}
                                                            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none"
                                                            placeholder="Lesson title"
                                                        />
                                                    </label>
                                                    <label className="space-y-2 text-sm text-slate-700">
                                                        <span>Duration</span>
                                                        <input
                                                            value={lessonDrafts[unit.id]?.duration ?? '30 mins'}
                                                            onChange={(event) => updateLessonDraft(unit.id, 'duration', event.target.value)}
                                                            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none"
                                                            placeholder="30 mins"
                                                        />
                                                    </label>
                                                </div>
                                                <label className="mt-3 flex flex-col gap-2 text-sm text-slate-700">
                                                    <span>Type</span>
                                                    <select
                                                        value={lessonDrafts[unit.id]?.type ?? 'Learning'}
                                                        onChange={(event) => updateLessonDraft(unit.id, 'type', event.target.value)}
                                                        className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none"
                                                    >
                                                        <option value="Learning">Learning</option>
                                                        <option value="Practice">Practice</option>
                                                    </select>
                                                </label>
                                                <label className="mt-4 block text-sm text-slate-700">
                                                    <span className="mb-2 inline-block">Bulk lessons</span>
                                                    <textarea
                                                        value={bulkLessonInput[unit.id] ?? ''}
                                                        onChange={(event) => setBulkLessonInput((current) => ({
                                                            ...current,
                                                            [unit.id]: event.target.value,
                                                        }))}
                                                        placeholder="Title | 30 mins | learning\nPractice 1 | 20 mins | practice"
                                                        className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none"
                                                        rows={4}
                                                    />
                                                    <p className="mt-2 text-xs text-slate-500">Use one lesson per line with pipe-separated values.</p>
                                                </label>
                                                <div className="mt-4 flex flex-wrap items-center gap-3">
                                                    <button
                                                        type="submit"
                                                        className="inline-flex items-center justify-center rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                                                    >
                                                        Add Lesson
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => addBulkLessonsToUnit(unit.id)}
                                                        className="inline-flex items-center justify-center rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
                                                    >
                                                        Add Bulk Lessons
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}
        </section>
    )
}
