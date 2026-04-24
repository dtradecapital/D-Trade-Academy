'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, Image as ImageIcon, Save } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

interface NotesEditorProps {
    videoId: string
    onNotesUpdate?: (count: number) => void
}

export function NotesEditor({ videoId, onNotesUpdate }: NotesEditorProps) {
    const [notes, setNotes] = useState('')
    const [textColor, setTextColor] = useState('#ffffff')
    const [savedNotes, setSavedNotes] = useState<string>('')
    const [images, setImages] = useState<string[]>([])

    const colors = [
        { name: 'White', value: '#ffffff', bg: 'bg-white' },
        { name: 'Yellow', value: '#fbbf24', bg: 'bg-yellow-400' },
        { name: 'Green', value: '#4ade80', bg: 'bg-green-500' },
        { name: 'Red', value: '#f87171', bg: 'bg-red-400' },
        { name: 'Blue', value: '#60a5fa', bg: 'bg-blue-400' },
        { name: 'Purple', value: '#c084fc', bg: 'bg-purple-400' },
    ]

    const handleSaveNotes = () => {
        setSavedNotes(notes)
        // Count words as a simple metric for notes count
        const wordCount = notes.trim().split(/\s+/).filter(word => word.length > 0).length
        onNotesUpdate?.(wordCount)
        toast({
            title: 'Notes saved',
            description: 'Your notes have been saved successfully.',
        })
    }

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setImages((prev) => [...prev, reader.result as string])
                toast({
                    title: 'Image added',
                    description: 'Image has been added to your notes.',
                })
            }
            reader.readAsDataURL(file)
        }
    }

    const removeImage = (index: number) => {
        setImages((prev) => prev.filter((_, i) => i !== index))
    }

    return (
        <Card className="border border-border bg-card">
            <CardHeader className="pb-3">
                <CardTitle className="text-base">Notes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                {/* Color Picker */}
                <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground">Text Color</label>
                    <div className="flex flex-wrap gap-2">
                        {colors.map((color) => (
                            <button
                                key={color.value}
                                onClick={() => setTextColor(color.value)}
                                className={`size-6 rounded-full border-2 transition-all ${textColor === color.value ? 'border-foreground scale-110' : 'border-transparent'
                                    } ${color.bg}`}
                                title={color.name}
                            />
                        ))}
                    </div>
                </div>

                {/* Textarea */}
                <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground">Write your notes</label>
                    <Textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Type your notes here..."
                        className="min-h-24 resize-none border-border bg-background text-sm placeholder-muted-foreground focus:border-primary"
                        style={{ color: textColor }}
                    />
                </div>

                {/* Image Upload */}
                <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground">Add Images</label>
                    <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-background/50 px-3 py-2 text-xs text-muted-foreground transition hover:bg-background hover:border-primary/50">
                        <ImageIcon className="size-4" />
                        Upload Image
                        <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>

                    {/* Image Preview */}
                    {images.length > 0 && (
                        <div className="grid grid-cols-3 gap-2">
                            {images.map((image, index) => (
                                <div key={index} className="relative group">
                                    <img
                                        src={image}
                                        alt={`Note image ${index + 1}`}
                                        className="aspect-square rounded-lg border border-border object-cover"
                                    />
                                    <button
                                        onClick={() => removeImage(index)}
                                        className="absolute top-0 right-0 hidden group-hover:flex items-center justify-center w-6 h-6 bg-red-500 rounded-full text-white text-xs font-bold"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Save Button */}
                <Button onClick={handleSaveNotes} className="w-full bg-primary hover:bg-primary/90" size="sm">
                    <Save className="mr-2 size-4" />
                    Save Notes
                </Button>

                {/* Saved Notes Display */}
                {savedNotes && (
                    <div className="rounded-lg border border-border bg-background/50 p-3 text-xs">
                        <div className="flex items-start gap-2">
                            <AlertCircle className="size-4 mt-0.5 text-green-500 flex-shrink-0" />
                            <div>
                                <p className="font-medium text-foreground">Last saved</p>
                                <p className="text-muted-foreground mt-1 line-clamp-2">{savedNotes}</p>
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
