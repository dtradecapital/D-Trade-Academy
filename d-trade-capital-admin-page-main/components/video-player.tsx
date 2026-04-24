'use client'

import { Badge } from '@/components/ui/badge'
import { CircleDot } from 'lucide-react'

interface VideoPlayerProps {
    title: string
    duration: string
    level: string
    description: string
}

export function VideoPlayer({ title, duration, level, description }: VideoPlayerProps) {
    return (
        <div className="space-y-4">
            <div className="aspect-video rounded-lg border border-border bg-black/80 p-4 text-center text-sm font-medium text-white flex items-center justify-center">
                <div className="text-center">
                    <div className="text-4xl mb-2">▶</div>
                    <span>Video Player</span>
                    <div className="text-xs mt-2 text-gray-400">{title}</div>
                </div>
            </div>

            <div className="space-y-3 rounded-lg border border-border bg-card p-4">
                <div>
                    <h3 className="text-lg font-semibold text-foreground">{title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{description}</p>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                    <Badge variant="secondary" className="text-xs">{level}</Badge>
                    <div className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                        <CircleDot className="size-3" />
                        {duration}
                    </div>
                </div>
            </div>
        </div>
    )
}
