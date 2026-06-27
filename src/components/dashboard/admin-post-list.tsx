'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { updatePostStatus, mergePost } from '@/app/actions/posts'
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
import { ChevronUp, GitMerge, Search } from 'lucide-react'

const STATUS_LABELS: Record<PostStatus, string> = {
  open: 'Open',
  under_review: '検討中',
  planned: '計画済み',
  in_progress: '進行中',
  complete: '完了',
  closed: '却下',
}

const STATUS_COLORS: Record<PostStatus, string> = {
  open: 'bg-neutral-100 text-neutral-600',
  under_review: 'bg-yellow-100 text-yellow-700',
  planned: 'bg-blue-100 text-blue-700',
  in_progress: 'bg-indigo-100 text-indigo-700',
  complete: 'bg-green-100 text-green-700',
  closed: 'bg-red-100 text-red-600',
}

interface AdminPostListProps {
  posts: Post[]
  boardId: string
  boardSlug: string
  currentStatus: string
  searchQuery: string
}

export function AdminPostList({ posts, boardId, boardSlug, currentStatus, searchQuery }: AdminPostListProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [mergingFrom, setMergingFrom] = useState<string | null>(null)

  const statuses = ['all', 'open', 'under_review', 'planned', 'in_progress', 'complete', 'closed']

  function applyFilter(key: string, value: string) {
    const url = new URL(window.location.href)
    if (value && value !== 'all' && value !== '') {
      url.searchParams.set(key, value)
    } else {
      url.searchParams.delete(key)
    }
    router.push(url.pathname + url.search)
  }

  async function handleStatusChange(postId: string, status: PostStatus) {
    startTransition(async () => {
      await updatePostStatus(postId, boardId, boardSlug, status)
    })
  }

  async function handleMerge(fromId: string, intoId: string) {
    startTransition(async () => {
      await mergePost(fromId, intoId, boardId, boardSlug)
      setMergingFrom(null)
    })
  }

  return (
    <div>
      {/* Filters */}
      <div className="flex items-center gap-3 mb-5">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <Input
            placeholder="タイトルで検索..."
            defaultValue={searchQuery}
            className="pl-9"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                applyFilter('q', (e.target as HTMLInputElement).value)
              }
            }}
          />
        </div>
        <Select defaultValue={currentStatus} onValueChange={(v) => applyFilter('status', v ?? 'all')}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="ステータス" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">すべて</SelectItem>
            {Object.entries(STATUS_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-16 text-neutral-400">
          <p>条件に一致するリクエストはありません</p>
        </div>
      ) : (
        <div className="space-y-2">
          {posts.map((post) => (
            <div
              key={post.id}
              className={`bg-white border rounded-xl p-4 flex items-start gap-4 ${
                mergingFrom && mergingFrom !== post.id ? 'cursor-pointer hover:border-blue-300 hover:bg-blue-50' : ''
              }`}
              onClick={() => {
                if (mergingFrom && mergingFrom !== post.id) {
                  handleMerge(mergingFrom, post.id)
                }
              }}
            >
              {/* Vote count */}
              <div className="flex flex-col items-center gap-0.5 min-w-[48px]">
                <ChevronUp className="w-4 h-4 text-neutral-400" />
                <span className="text-sm font-bold text-neutral-700">{post.vote_count}</span>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start gap-2 mb-1">
                  <Link
                    href={`/b/${boardSlug}/post/${post.id}`}
                    className="font-medium text-neutral-900 hover:text-blue-600 transition-colors truncate"
                  >
                    {post.title}
                  </Link>
                  {post.merged_into && (
                    <Badge variant="secondary" className="shrink-0 text-xs">マージ済</Badge>
                  )}
                </div>
                <p className="text-sm text-neutral-500 line-clamp-1">{post.description}</p>
                <div className="flex items-center gap-3 mt-1.5">
                  {post.category && (
                    <span className="text-xs text-neutral-400 bg-neutral-50 border border-neutral-200 rounded px-2 py-0.5">
                      {post.category}
                    </span>
                  )}
                  <span className="text-xs text-neutral-400">
                    {new Date(post.created_at).toLocaleDateString('ja-JP')}
                  </span>
                  {(post.author_name || post.author_email) && (
                    <span className="text-xs text-neutral-400">
                      {post.author_name || post.author_email}
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
                <Select
                  defaultValue={post.status}
                  onValueChange={(v) => handleStatusChange(post.id, v as PostStatus)}
                  disabled={isPending}
                >
                  <SelectTrigger className="w-32 h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(STATUS_LABELS).map(([value, label]) => (
                      <SelectItem key={value} value={value} className="text-xs">{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {!post.merged_into && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`h-8 w-8 p-0 ${mergingFrom === post.id ? 'bg-blue-100 text-blue-600' : 'text-neutral-400'}`}
                    title="別のリクエストにマージ"
                    onClick={() => setMergingFrom(mergingFrom === post.id ? null : post.id)}
                  >
                    <GitMerge className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {mergingFrom && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-2 rounded-full text-sm shadow-lg">
          マージ先のリクエストをクリックしてください
          <button className="ml-3 underline" onClick={() => setMergingFrom(null)}>キャンセル</button>
        </div>
      )}
    </div>
  )
}
