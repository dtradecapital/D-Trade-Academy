'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { courses } from '@/lib/mock-data'

interface UnitPageProps {
  params: {
    unitId: string
  }
}

export default function UnitPage({ params }: UnitPageProps) {
  const router = useRouter()
  const unit = courses.flatMap((course) => course.units).find((item) => item.id === params.unitId)
  const course = courses.find((item) => item.units.some((unitItem) => unitItem.id === params.unitId))
  const video = unit?.videos[0] || null

  const [notes, setNotes] = useState('')
  const [savedNotes, setSavedNotes] = useState('')
  const [comment, setComment] = useState('')
  const [comments, setComments] = useState<{ id: string; text: string; createdAt: string }[]>([])

  const handleSaveNotes = () => {
    setSavedNotes(notes)
  }

  const handlePostComment = () => {
    if (!comment.trim()) return
    setComments((prev) => [
      {
        id: `${Date.now()}`,
        text: comment.trim(),
        createdAt: new Date().toLocaleString(),
      },
      ...prev,
    ])
    setComment('')
  }

  if (!unit || !video) {
    return (
      <div className="min-h-screen bg-background px-5 py-8 text-foreground">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-sm text-muted-foreground">Lesson not found.</p>
          <Button variant="outline" className="mt-6 text-foreground border-border hover:bg-card" onClick={() => router.push('/videos')}>
            Back to courses
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background px-5 py-8 text-foreground">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Lesson page</p>
            <h1 className="mt-2 text-3xl font-semibold text-foreground">{video.title}</h1>
            <p className="mt-2 text-sm text-muted-foreground">{course?.title}  {unit.title}</p>
          </div>
          <Button variant="outline" className="text-foreground border-border hover:bg-card" onClick={() => router.push('/videos')}>
            Back to courses
          </Button>
        </div>

        <p className="max-w-3xl text-sm leading-6 text-muted-foreground">{video.description ?? 'This lesson has no description.'}</p>

        <div className="mt-8 w-full overflow-hidden">
          <video src={video.url} controls className="h-[72vh] w-full bg-black object-cover" />
        </div>

        <div className="mt-10 space-y-10">
          <div>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-xl font-semibold text-foreground">Notes</h2>
              <Button variant="outline" className="text-foreground border-border hover:bg-card" onClick={handleSaveNotes}>
                Save notes
              </Button>
            </div>
            <Textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Write your lesson notes..."
              rows={6}
              className="mt-4 bg-background border border-border text-foreground"
            />
            {savedNotes ? (
              <p className="mt-4 text-sm leading-6 text-muted-foreground whitespace-pre-line">{savedNotes}</p>
            ) : null}
          </div>

          <div>
            <h2 className="text-xl font-semibold text-foreground">Discussion</h2>
            <Textarea
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              placeholder="Write a discussion comment..."
              rows={5}
              className="mt-4 bg-background border border-border text-foreground"
            />
            <Button className="mt-4" onClick={handlePostComment}>
              Post comment
            </Button>
            <div className="mt-4 space-y-4">
              {comments.length ? (
                comments.map((item) => (
                  <div key={item.id} className="rounded-lg border border-border p-4 text-sm text-foreground">
                    <p>{item.text}</p>
                    <p className="mt-2 text-xs text-muted-foreground">{item.createdAt}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No discussion yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
