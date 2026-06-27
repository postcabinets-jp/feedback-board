'use client'

import { useState, useTransition } from 'react'
import { addComment } from '@/app/actions/posts'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

interface CommentFormWrapperProps {
  postId: string
  boardSlug: string
  boardId: string
}

export function CommentFormWrapper({ postId, boardSlug, boardId }: CommentFormWrapperProps) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const form = e.currentTarget
    startTransition(async () => {
      const result = await addComment(postId, boardSlug, boardId, new FormData(form))
      if (result?.error) {
        setError(result.error)
      } else {
        form.reset()
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Textarea
        name="content"
        placeholder="コメントを入力..."
        rows={3}
        required
        disabled={isPending}
      />
      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>
      )}
      <Button type="submit" size="sm" disabled={isPending}>
        {isPending ? '送信中...' : 'コメントを送信'}
      </Button>
    </form>
  )
}
