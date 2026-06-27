'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toggleVote } from '@/app/actions/posts'
import type { Post, PostStatus } from '@/lib/supabase/types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ChevronUp, Search } from 'lucide-react'

const STATUS_LABELS: Record<PostStatus, string> = {
  open: 'Open',
  under_review: '検討中',
  planned: '計画済み',
  in_progress: '進行中',
  complete: '完了',
  closed: '却下',
}

const STATUS_COLORS: Record<PostStatus, string> = {
  open: 'bg-neutral-100 text-neutral-600 border-neutral-200',
  under_review: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  planned: 'bg-blue-50 text-blue-700 border-blue-200',
  in_progress: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  complete: 'bg-green-50 text-green-700 border-green-200',
  closed: 'bg-red-50 text-red-600 border-red-200',
}

interface PostListProps {
  posts: Post[]
  userVotes: string[]
  boardSlug: string
  boardId: string
  categories: string[]
  currentStatus: string
  currentCategory: string
  currentSort: string
  searchQuery: string
  isLoggedIn: boolean
}

export function PostList({
  posts,
  userVotes,
  boardSlug,
  boardId,
  categories,
  currentStatus,
  currentCategory,
  currentSort,
  searchQuery,
  isLoggedIn,
}: PostListProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [localVotes, setLocalVotes] = useState<Set<string>>(new Set(userVotes))
  const [localCounts, setLocalCounts] = useState<Record<string, number>>(
    Object.fromEntries(posts.map(p => [p.id, p.vote_count]))
  )

  function applyFilter(key: string, value: string) {
    const url = new URL(window.location.href)
    if (value && value !== 'all' && value !== '') {
      url.searchParams.set(key, value)
    } else {
      url.searchParams.delete(key)
    }
    router.push(url.pathname + url.search)
  }

  async function handleVote(postId: string) {
    if (!isLoggedIn) {
      router.push('/login')
      return
    }
    // Optimistic update
    const voted = localVotes.has(postId)
    const newVotes = new Set(localVotes)
    if (voted) newVotes.delete(postId)
    else newVotes.add(postId)
    setLocalVotes(newVotes)
    setLocalCounts(prev => ({
      ...prev,
      [postId]: (prev[postId] ?? 0) + (voted ? -1 : 1),
    }))

    startTransition(async () => {
      await toggleVote(postId, boardSlug)
    })
  }

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <Input
            placeholder="検索..."
            defaultValue={searchQuery}
            className="pl-9"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                applyFilter('q', (e.target as HTMLInputElement).value)
              }
            }}
          />
        </div>
        <Select defaultValue={currentStatus || 'all'} onValueChange={(v) => applyFilter('status', v ?? 'all')}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="ステータス" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">すべて</SelectItem>
            {Object.entries(STATUS_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {categories.length > 0 && (
          <Select defaultValue={currentCategory || 'all'} onValueChange={(v) => applyFilter('category', v ?? 'all')}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="カテゴリ" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">すべて</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        <Select defaultValue={currentSort || 'votes'} onValueChange={(v) => applyFilter('sort', v ?? 'votes')}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="votes">投票数順</SelectItem>
            <SelectItem value="newest">新着順</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Posts */}
      {posts.length === 0 ? (
        <div className="text-center py-16 text-neutral-400">
          <p className="font-medium">まだフィードバックがありません</p>
          <p className="text-sm mt-1">最初のリクエストを投稿してみましょう</p>
        </div>
      ) : (
        <div className="space-y-2">
          {posts.map((post) => (
            <div key={post.id} className="bg-white border border-neutral-200 rounded-xl p-4 flex items-center gap-4 hover:border-neutral-300 transition-colors">
              {/* Vote button */}
              <button
                onClick={() => handleVote(post.id)}
                disabled={isPending}
                className={`flex flex-col items-center gap-0.5 min-w-[52px] py-2 px-3 rounded-lg border transition-colors ${
                  localVotes.has(post.id)
                    ? 'border-blue-300 bg-blue-50 text-blue-600'
                    : 'border-neutral-200 bg-neutral-50 text-neutral-500 hover:border-neutral-300 hover:bg-neutral-100'
                }`}
              >
                <ChevronUp className="w-4 h-4" />
                <span className="text-xs font-bold tabular-nums">{localCounts[post.id] ?? post.vote_count}</span>
              </button>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <Link
                    href={`/b/${boardSlug}/post/${post.id}`}
                    className="font-medium text-neutral-900 hover:text-blue-600 transition-colors line-clamp-1"
                  >
                    {post.title}
                  </Link>
                  <span className={`text-xs border rounded px-1.5 py-0.5 shrink-0 ${STATUS_COLORS[post.status]}`}>
                    {STATUS_LABELS[post.status]}
                  </span>
                </div>
                <p className="text-sm text-neutral-500 line-clamp-1">{post.description}</p>
                {post.category && (
                  <span className="inline-block mt-1 text-xs text-neutral-400 bg-neutral-50 border border-neutral-200 rounded px-2 py-0.5">
                    {post.category}
                  </span>
                )}
              </div>

              <div className="text-xs text-neutral-400 shrink-0">
                {new Date(post.created_at).toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
