'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { courses } from '@/lib/mock-data'

type SavedNote = {
  text: string
  color: string
  image: string | null
}

type LessonComment = {
  id: string
  text: string
  image: string | null
  createdAt: string
}

interface LessonPageProps {
  params: {
    lessonId: string
  }
}

export default function LessonPage({ params }: LessonPageProps) {
  const router = useRouter()
  const lesson = useMemo(
    () =>
      courses
        .flatMap((course) =>
          course.units.map((unit) => ({ ...unit, courseTitle: course.title }))
        )
        .find((item) => item.id === params.lessonId),
    [params.lessonId]
  )
  const video = lesson?.videos?.[0] ?? null
  const noteKey = `lesson-notes-${params.lessonId}`
  const commentKey = `lesson-comments-${params.lessonId}`

  const [activeTab, setActiveTab] = useState<'notes' | 'discussion'>('notes')
  const [noteText, setNoteText] = useState('')
  const [noteColor, setNoteColor] = useState('#ffffff')
  const [noteImage, setNoteImage] = useState<string | null>(null)
  const [savedNote, setSavedNote] = useState<SavedNote | null>(null)

  const [commentText, setCommentText] = useState('')
  const [commentImage, setCommentImage] = useState<string | null>(null)
  const [comments, setComments] = useState<LessonComment[]>([])

  useEffect(() => {
    if (!lesson || !video) {
      router.replace('/videos')
      return
    }

    const savedNoteJson = localStorage.getItem(noteKey)
    if (savedNoteJson) {
      try {
        setSavedNote(JSON.parse(savedNoteJson))
      } catch {
        setSavedNote(null)
      }
    }

    const savedCommentsJson = localStorage.getItem(commentKey)
    if (savedCommentsJson) {
      try {
        setComments(JSON.parse(savedCommentsJson))
      } catch {
        setComments([])
      }
    }
  }, [lesson, video, noteKey, commentKey, router])

  const saveNote = () => {
    const payload: SavedNote = {
      text: noteText,
      color: noteColor,
      image: noteImage,
    }
    setSavedNote(payload)
    localStorage.setItem(noteKey, JSON.stringify(payload))
  }

  const handleFileUpload = (
    file: File | null,
    setter: (value: string | null) => void
  ) => {
    if (!file) {
      setter(null)
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setter(reader.result)
      }
    }
    reader.readAsDataURL(file)
  }

  const addComment = () => {
    if (!commentText.trim() && !commentImage) return

    const newComment: LessonComment = {
      id: `${Date.now()}`,
      text: commentText.trim(),
      image: commentImage,
      createdAt: new Date().toLocaleString(),
    }
    const nextComments = [newComment, ...comments]
    setComments(nextComments)
    localStorage.setItem(commentKey, JSON.stringify(nextComments))
    setCommentText('')
    setCommentImage(null)
  }

  if (!lesson || !video) {
    return null
  }

  return (
    <div className="min-h-screen bg-background px-5 py-8 text-foreground">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Lesson page</p>
            <h1 className="mt-2 text-3xl font-semibold text-foreground">{lesson.title}</h1>
            <p className="mt-2 text-sm text-muted-foreground">{lesson.courseTitle}  {lesson.title}</p>
          </div>
          <Button variant="outline" className="text-foreground border-border hover:bg-card" onClick={() => router.push('/videos')}>
            Back to courses
          </Button>
        </div>

        <p className="max-w-3xl text-sm leading-6 text-muted-foreground">{lesson.videos[0]?.description ?? 'No description available.'}</p>

        <div className="mt-8 w-full overflow-hidden">
          <video src={lesson.videos[0].url} controls className="h-[72vh] w-full bg-black object-cover" />
        </div>

        <div className="mt-10">
          <div className="flex gap-3 border-b border-border pb-3">
            <button
              type="button"
              onClick={() => setActiveTab('notes')}
              className={`px-4 py-2 text-sm ${activeTab === 'notes' ? 'border-b-2 border-foreground font-semibold' : 'text-muted-foreground'}`}
            >
              Notes
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('discussion')}
              className={`px-4 py-2 text-sm ${activeTab === 'discussion' ? 'border-b-2 border-foreground font-semibold' : 'text-muted-foreground'}`}
            >
              Discussion
            </button>
          </div>

          {activeTab === 'notes' ? (
            <div className="mt-6 space-y-6">
              <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
                <div>
                  <label className="text-sm text-muted-foreground">Text color</label>
                  <input
                    type="color"
                    value={noteColor}
                    onChange={(event) => setNoteColor(event.target.value)}
                    className="mt-2 h-10 w-16 cursor-pointer rounded border border-border bg-background"
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Upload image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(event) => handleFileUpload(event.target.files?.[0] ?? null, setNoteImage)}
                    className="mt-2 block w-full text-sm text-foreground"
                  />
                </div>
              </div>

              <Textarea
                value={noteText}
                onChange={(event) => setNoteText(event.target.value)}
                placeholder="Write notes for this lesson..."
                rows={6}
                className="bg-background border border-border text-foreground"
              />
              <Button onClick={saveNote}>Save notes</Button>

              {savedNote ? (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">Saved note</p>
                  <div style={{ color: savedNote.color }} className="whitespace-pre-line text-sm">
                    {savedNote.text || 'No text saved.'}
                  </div>
                  {savedNote.image ? (
                    <img src={savedNote.image} alt="Saved note" className="max-h-64 w-full object-contain" />
                  ) : null}
                </div>
              ) : null}
            </div>
          ) : (
            <div className="mt-6 space-y-6">
              <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
                <div>
                  <Textarea
                    value={commentText}
                    onChange={(event) => setCommentText(event.target.value)}
                    placeholder="Write your comment or doubt..."
                    rows={4}
                    className="bg-background border border-border text-foreground"
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-sm text-muted-foreground">Upload image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(event) => handleFileUpload(event.target.files?.[0] ?? null, setCommentImage)}
                    className="block w-full text-sm text-foreground"
                  />
                </div>
              </div>
              <Button onClick={addComment}>Post comment</Button>

              <div className="space-y-4">
                {comments.length ? (
                  comments.map((commentItem) => (
                    <div key={commentItem.id} className="rounded-lg border border-border p-4 text-sm text-foreground">
                      <p>{commentItem.text || 'Image comment'}</p>
                      {commentItem.image ? (
                        <img src={commentItem.image} alt="Comment" className="mt-3 max-h-64 w-full object-contain" />
                      ) : null}
                      <p className="mt-3 text-xs text-muted-foreground">{commentItem.createdAt}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No discussion yet.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
