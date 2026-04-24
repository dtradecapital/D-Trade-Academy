'use client'

import { useEffect, useState } from 'react'
import { Plus, BookOpen, ChevronRight, CheckSquare } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

type LessonForm = {
  id: string
  title: string
  duration: string
  type: 'Learning' | 'Practice'
  videoUrl: string
}

type UnitForm = {
  id: string
  title: string
  lessons: LessonForm[]
}

type SavedCourse = {
  id: string
  title: string
  description: string
  durationWeeks: number
  tags: string[]
  units: UnitForm[]
}

const createLesson = (): LessonForm => ({
  id: `lesson-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
  title: '',
  duration: '40 mins',
  type: 'Learning',
  videoUrl: '',
})

const createUnit = (): UnitForm => ({
  id: `unit-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
  title: '',
  lessons: [createLesson()],
})

const STORAGE_KEY = 'admin-courses'

export default function CoursesPage() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [tagsText, setTagsText] = useState('')
  const [durationWeeks, setDurationWeeks] = useState(4)
  const [unitCount, setUnitCount] = useState(1)
  const [units, setUnits] = useState<UnitForm[]>([createUnit()])
  const [savedCourses, setSavedCourses] = useState<SavedCourse[]>([])
  const [expandedCourseId, setExpandedCourseId] = useState<string | null>(null)
  const [expandedUnitIds, setExpandedUnitIds] = useState<string[]>([])
  const [bulkLessonText, setBulkLessonText] = useState<Record<string, string>>({})
  const [showCourseForm, setShowCourseForm] = useState(true)

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        setSavedCourses(JSON.parse(saved) as SavedCourse[])
      } catch {
        setSavedCourses([])
      }
    }
  }, [])

  useEffect(() => {
    setUnits((currentUnits) => {
      const nextUnits = [...currentUnits]
      if (unitCount > nextUnits.length) {
        while (nextUnits.length < unitCount) {
          nextUnits.push(createUnit())
        }
      } else if (unitCount < nextUnits.length) {
        nextUnits.length = unitCount
      }
      return nextUnits
    })
  }, [unitCount])

  const handleUnitTitleChange = (unitId: string, value: string) => {
    setUnits((current) => current.map((unit) => unit.id === unitId ? { ...unit, title: value } : unit))
  }

  const handleAddLesson = (unitId: string) => {
    setUnits((current) => current.map((unit) =>
      unit.id === unitId
        ? { ...unit, lessons: [...unit.lessons, createLesson()] }
        : unit
    ))
  }

  const handleLessonChange = (
    unitId: string,
    lessonId: string,
    field: 'title' | 'duration' | 'type' | 'videoUrl',
    value: string,
  ) => {
    setUnits((current) => current.map((unit) =>
      unit.id === unitId
        ? {
          ...unit,
          lessons: unit.lessons.map((lesson) =>
            lesson.id === lessonId ? { ...lesson, [field]: value } : lesson
          ),
        }
        : unit
    ))
  }

  const handleBulkLessons = (unitId: string) => {
    const raw = bulkLessonText[unitId] ?? ''
    const lines = raw.split('\n').map((line) => line.trim()).filter(Boolean)
    if (!lines.length) return

    const newLessons = lines.map((line) => {
      const [title, duration, type] = line.split('|').map((part) => part.trim())
      return {
        id: `lesson-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        title: title || 'Untitled lesson',
        duration: duration || '40 mins',
        type: type?.toLowerCase() === 'practice' ? 'Practice' : 'Learning',
        videoUrl: '',
      } as LessonForm
    })

    setUnits((current) => current.map((unit) =>
      unit.id === unitId
        ? { ...unit, lessons: [...unit.lessons, ...newLessons] }
        : unit
    ))
    setBulkLessonText((current) => ({ ...current, [unitId]: '' }))
  }

  const handleToggleUnit = (unitId: string) => {
    setExpandedUnitIds((current) =>
      current.includes(unitId) ? current.filter((id) => id !== unitId) : [...current, unitId]
    )
  }

  const handleAddUnit = () => {
    setUnitCount((count) => count + 1)
  }

  const handleSaveCourse = () => {
    if (!title.trim() || !description.trim()) {
      return
    }

    const course: SavedCourse = {
      id: `course-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      title: title.trim(),
      description: description.trim(),
      durationWeeks: Math.max(1, durationWeeks),
      tags: tagsText
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
      units: units.map((unit) => ({
        ...unit,
        lessons: unit.lessons.map((lesson) => ({
          ...lesson,
          title: lesson.title.trim(),
          duration: lesson.duration.trim(),
          videoUrl: lesson.videoUrl.trim(),
        })),
      })),
    }

    const nextCourses = [course, ...savedCourses]
    setSavedCourses(nextCourses)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextCourses))

    setTitle('')
    setDescription('')
    setTagsText('')
    setDurationWeeks(4)
    setUnitCount(1)
    setUnits([createUnit()])
  }

  const handleToggleCourse = (courseId: string) => {
    setExpandedCourseId((current) => (current === courseId ? null : courseId))
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <main className="flex-1 p-4 md:p-6">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Course Management</h1>
            <p className="text-muted-foreground mt-2">Build courses with units and lessons for a modern LMS experience.</p>
          </div>
          <Button
            type="button"
            variant="secondary"
            onClick={() => setShowCourseForm((current) => !current)}
          >
            <Plus className="mr-2 size-4" />
            {showCourseForm ? 'Close Form' : 'Add Course'}
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.3fr_0.9fr]">
          {showCourseForm && (
            <Card>
              <CardHeader>
                <CardTitle>Course Form</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-foreground">Course Title</label>
                  <Input
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    placeholder="Enter course title"
                  />
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-medium text-foreground">Course Description</label>
                  <Textarea
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    placeholder="Enter course description"
                    className="min-h-[120px]"
                  />
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-medium text-foreground">Course Tags</label>
                  <Input
                    value={tagsText}
                    onChange={(event) => setTagsText(event.target.value)}
                    placeholder="Enter tags like design, frontend, trading"
                  />
                  <p className="text-xs text-muted-foreground">Separate tags with commas.</p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-foreground">Number of Weeks</label>
                    <Input
                      type="number"
                      min={1}
                      value={durationWeeks}
                      onChange={(event) => setDurationWeeks(Math.max(1, Number(event.target.value) || 1))}
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-foreground">Number of Units</label>
                    <Input
                      type="number"
                      min={1}
                      value={unitCount}
                      onChange={(event) => setUnitCount(Math.max(1, Number(event.target.value) || 1))}
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center justify-between gap-4">
                    <h2 className="text-lg font-semibold text-foreground">Units</h2>
                    <Button variant="outline" type="button" onClick={handleAddUnit}>
                      <Plus className="mr-2 size-4" />
                      Add Unit
                    </Button>
                  </div>

                  {units.map((unit, unitIndex) => (
                    <div key={unit.id} className="rounded-3xl border border-border bg-card p-5">
                      <div className="mb-4 flex items-center justify-between gap-4">
                        <div>
                          <p className="text-sm font-semibold text-foreground">Unit {unitIndex + 1}</p>
                          <p className="text-xs text-muted-foreground">Configure this unit and add lessons below.</p>
                        </div>
                        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">Lessons: {unit.lessons.length}</span>
                      </div>

                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-foreground">Unit Title</label>
                          <Input
                            value={unit.title}
                            onChange={(event) => handleUnitTitleChange(unit.id, event.target.value)}
                            placeholder="Enter unit title"
                          />
                        </div>

                        <div className="space-y-4">
                          {unit.lessons.map((lesson, lessonIndex) => (
                            <div key={lesson.id} className="rounded-2xl border border-border bg-background p-4">
                              <p className="mb-3 text-sm font-medium text-foreground">Lesson {lessonIndex + 1}</p>
                              <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                  <label className="block text-sm text-muted-foreground">Lesson Title</label>
                                  <Input
                                    value={lesson.title}
                                    onChange={(event) => handleLessonChange(unit.id, lesson.id, 'title', event.target.value)}
                                    placeholder="Lesson title"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <label className="block text-sm text-muted-foreground">Duration</label>
                                  <Input
                                    value={lesson.duration}
                                    onChange={(event) => handleLessonChange(unit.id, lesson.id, 'duration', event.target.value)}
                                    placeholder="40 mins"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <label className="block text-sm text-muted-foreground">Type</label>
                                  <select
                                    value={lesson.type}
                                    onChange={(event) => handleLessonChange(unit.id, lesson.id, 'type', event.target.value)}
                                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none"
                                  >
                                    <option value="Learning">Learning</option>
                                    <option value="Practice">Practice</option>
                                  </select>
                                </div>
                                <div className="space-y-2">
                                  <label className="block text-sm text-muted-foreground">Video URL</label>
                                  <Input
                                    value={lesson.videoUrl}
                                    onChange={(event) => handleLessonChange(unit.id, lesson.id, 'videoUrl', event.target.value)}
                                    placeholder="https://example.com/video.mp4"
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                          <div className="flex flex-col gap-3 md:w-[60%]">
                            <label className="block text-sm font-medium text-foreground">Bulk add lessons</label>
                            <Textarea
                              value={bulkLessonText[unit.id] ?? ''}
                              onChange={(event) => setBulkLessonText((current) => ({ ...current, [unit.id]: event.target.value }))}
                              placeholder="Intro to HTML | 40 mins | learning\nPractice 1 | 15 mins | practice"
                              className="min-h-[110px]"
                            />
                            <p className="text-xs text-muted-foreground">Use pipe-separated rows to add multiple lessons.</p>
                          </div>
                          <div className="flex flex-col gap-2">
                            <Button type="button" onClick={() => handleAddLesson(unit.id)} className="bg-amber-400 text-foreground hover:bg-amber-500">
                              <Plus className="mr-2 size-4" />
                              Add Lesson
                            </Button>
                            <Button type="button" onClick={() => handleBulkLessons(unit.id)} className="bg-amber-400 text-foreground hover:bg-amber-500">
                              Add Lessons in Bulk
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-4">
                  <Button type="button" onClick={handleSaveCourse}>
                    Save Course
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Saved Courses</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {savedCourses.length === 0 ? (
                <p className="text-sm text-muted-foreground">No saved courses yet. Fill the form to add your first course.</p>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {savedCourses.map((course) => (
                    <div key={course.id} className="rounded-3xl border border-border bg-card p-5">
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-lg font-semibold text-foreground">{course.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">{course.description}</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {course.tags.length ? course.tags.map((tag) => (
                            <span key={tag} className="rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-700">{tag}</span>
                          )) : (
                            <span className="rounded-full bg-muted-foreground/10 px-2 py-1 text-xs font-medium text-muted-foreground">No tags</span>
                          )}
                        </div>
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span>{course.units.length} units</span>
                          <span>{course.units.reduce((sum, unit) => sum + unit.lessons.length, 0)} lessons</span>
                        </div>
                        <div className="flex items-center justify-between gap-4">
                          <button
                            type="button"
                            onClick={() => handleToggleCourse(course.id)}
                            className="text-sm font-medium text-primary hover:underline"
                          >
                            View details
                          </button>
                          <ChevronRight className={`size-5 text-muted-foreground transition ${expandedCourseId === course.id ? 'rotate-90' : ''}`} />
                        </div>

                        {expandedCourseId === course.id && (
                          <div className="mt-4 border-t border-border pt-4">
                            <p className="text-sm text-muted-foreground mb-4">{course.description}</p>
                            <div className="space-y-4">
                              {course.units.map((unit, unitIndex) => {
                                const unitExpanded = expandedUnitIds.includes(unit.id)
                                return (
                                  <div key={unit.id} className="relative overflow-hidden rounded-3xl border border-border bg-background p-4 pl-8">
                                    <span className="absolute left-4 top-6 h-full w-px bg-border" />
                                    <div className="relative">
                                      <button
                                        type="button"
                                        onClick={() => handleToggleUnit(unit.id)}
                                        className="flex w-full items-center justify-between gap-4 pb-4 text-left"
                                      >
                                        <div className="flex items-center gap-3">
                                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-100 text-amber-700">{unitIndex + 1}</div>
                                          <div>
                                            <p className="font-semibold text-foreground">{unit.title || `Unit ${unitIndex + 1}`}</p>
                                            <p className="text-xs text-muted-foreground">{unit.lessons.length} lessons</p>
                                          </div>
                                        </div>
                                        <ChevronRight className={`size-5 text-muted-foreground transition ${unitExpanded ? 'rotate-90' : ''}`} />
                                      </button>
                                      {unitExpanded && (
                                        <div className="space-y-3 pt-3">
                                          {unit.lessons.map((lesson) => (
                                            <div key={lesson.id} className="flex items-start gap-3 rounded-2xl border border-border bg-white p-4 shadow-sm">
                                              <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
                                                {lesson.type === 'Practice' ? <CheckSquare className="size-4" /> : <BookOpen className="size-4" />}
                                              </div>
                                              <div className="flex-1">
                                                <div className="flex flex-wrap items-center justify-between gap-2">
                                                  <p className="font-medium text-foreground">{lesson.title || 'Untitled Lesson'}</p>
                                                  <span className="rounded-full bg-muted-foreground/10 px-2 py-1 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">{lesson.type}</span>
                                                </div>
                                                <p className="text-sm text-muted-foreground mt-1">{lesson.duration}</p>
                                                <p className="text-xs text-muted-foreground mt-2 break-all">{lesson.videoUrl || 'No video link provided'}</p>
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
