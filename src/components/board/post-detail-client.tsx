'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toggleVote } from '@/app/actions/posts'
import type { Post } from '@/lib/supabase/types'
import { ChevronUp } from 'lucide-react'

interface PostDetailClientProps {
  post: Post
  boardSlug: string
  hasVoted: boolean
  isLoggedIn: boolean
}

export function PostDetailClient({ post, boardSlug, hasVoted, isLoggedIn }: PostDetailClientProps) {
  const router = useRouter()
  const [voted, setVoted] = useState(hasVoted)
  const [count, setCount] = useState(post.vote_count)
  const [isPending, startTransition] = useTransition()

  async function handleVote() {
    if (!isLoggedIn) {
      router.push('/login')
      return
    }
    // Optimistic
    setVoted(!voted)
    setCount(c => c + (voted ? -1 : 1))
    startTransition(async () => {
      await toggleVote(post.id, boardSlug)
    })
  }

  return (
    <div className="flex items-start gap-4 w-full">
      <button
        onClick={handleVote}
        disabled={isPending}
        className={`flex flex-col items-center gap-0.5 min-w-[56px] py-2.5 px-3 rounded-xl border transition-colors ${
          voted
            ? 'border-blue-300 bg-blue-50 text-blue-600'
            : 'border-neutral-200 bg-neutral-50 text-neutral-500 hover:border-neutral-300 hover:bg-neutral-100'
        }`}
      >
        <ChevronUp className="w-5 h-5" />
        <span className="text-sm font-bold tabular-nums">{count}</span>
      </button>
      <div className="flex-1">
        <h1 className="text-xl font-bold text-neutral-900 mb-2">{post.title}</h1>
        <p className="text-neutral-600 whitespace-pre-wrap leading-relaxed">{post.description}</p>
        <div className="mt-3 text-xs text-neutral-400 flex items-center gap-3">
          {(post.author_name || post.author_email) && (
            <span>{post.author_name || post.author_email}</span>
          )}
          <span>{new Date(post.created_at).toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
      </div>
    </div>
  )
}
