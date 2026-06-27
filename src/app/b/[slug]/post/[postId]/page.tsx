import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { PostDetailClient } from '@/components/board/post-detail-client'
import { CommentFormWrapper } from '@/components/board/comment-form'
import { ArrowLeft } from 'lucide-react'
import type { Post } from '@/lib/supabase/types'

interface PageProps {
  params: Promise<{ slug: string; postId: string }>
}

const STATUS_LABELS: Record<string, string> = {
  open: 'Open',
  under_review: '検討中',
  planned: '計画済み',
  in_progress: '進行中',
  complete: '完了',
  closed: '却下',
}

const STATUS_COLORS: Record<string, string> = {
  open: 'bg-neutral-100 text-neutral-600 border-neutral-200',
  under_review: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  planned: 'bg-blue-50 text-blue-700 border-blue-200',
  in_progress: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  complete: 'bg-green-50 text-green-700 border-green-200',
  closed: 'bg-red-50 text-red-600 border-red-200',
}

export default async function PostDetailPage({ params }: PageProps) {
  const { slug, postId } = await params
  const supabase = await createClient()

  const { data: rawBoard } = await supabase
    .from('boards')
    .select('id, name, slug')
    .eq('slug', slug)
    .single()

  if (!rawBoard) notFound()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const board = rawBoard as any

  const { data: rawPost } = await supabase
    .from('posts')
    .select('*')
    .eq('id', postId)
    .eq('board_id', board.id)
    .single()

  if (!rawPost) notFound()
  const post = rawPost as Post

  const { data: rawComments } = await supabase
    .from('comments')
    .select(`*, author:profiles(display_name, email)`)
    .eq('post_id', postId)
    .order('created_at', { ascending: true })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const comments = (rawComments ?? []) as any[]

  const { data: { user } } = await supabase.auth.getUser()

  let hasVoted = false
  if (user) {
    const { data: vote } = await supabase
      .from('votes')
      .select('id')
      .eq('post_id', postId)
      .eq('user_id', user.id)
      .single()
    hasVoted = !!vote
  }

  return (
    <div className="max-w-2xl">
      <Link
        href={`/b/${slug}`}
        className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        一覧に戻る
      </Link>

      <div className="bg-white border border-neutral-200 rounded-2xl p-6 mb-6">
        <PostDetailClient
          post={post}
          boardSlug={slug}
          hasVoted={hasVoted}
          isLoggedIn={!!user}
        />

        <div className="mt-4">
          <span className={`text-xs border rounded-md px-2 py-0.5 ${STATUS_COLORS[post.status] ?? ''}`}>
            {STATUS_LABELS[post.status] ?? post.status}
          </span>
          {post.category && (
            <span className="ml-2 text-xs text-neutral-400 bg-neutral-50 border border-neutral-200 rounded px-2 py-0.5">
              {post.category}
            </span>
          )}
        </div>
      </div>

      <div className="bg-white border border-neutral-200 rounded-2xl p-6">
        <h2 className="font-semibold text-neutral-900 mb-4">
          コメント {comments.length > 0 ? `(${comments.length})` : ''}
        </h2>

        {comments.length === 0 && (
          <p className="text-sm text-neutral-400 mb-4">まだコメントはありません</p>
        )}

        <div className="space-y-4 mb-6">
          {comments.map((comment) => {
            const authorName =
              comment.author?.display_name ||
              comment.author?.email ||
              '匿名'
            return (
              <div
                key={comment.id}
                className={`p-3 rounded-xl ${
                  comment.is_admin
                    ? 'bg-blue-50 border border-blue-100'
                    : 'bg-neutral-50 border border-neutral-100'
                }`}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-sm font-medium text-neutral-800">{authorName}</span>
                  {comment.is_admin && (
                    <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-medium">運営</span>
                  )}
                  <span className="text-xs text-neutral-400">
                    {new Date(comment.created_at).toLocaleDateString('ja-JP', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <p className="text-sm text-neutral-700 whitespace-pre-wrap">{comment.content}</p>
              </div>
            )
          })}
        </div>

        {user ? (
          <CommentFormWrapper postId={postId} boardSlug={slug} boardId={board.id} />
        ) : (
          <div className="text-center py-4 border border-dashed border-neutral-200 rounded-xl">
            <p className="text-sm text-neutral-500">
              <Link href="/login" className="text-blue-600 hover:underline font-medium">ログイン</Link>
              してコメントを投稿
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
