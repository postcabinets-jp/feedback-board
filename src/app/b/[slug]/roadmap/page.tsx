import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import type { Post, PostStatus } from '@/lib/supabase/types'
import { ChevronUp } from 'lucide-react'

interface PageProps {
  params: Promise<{ slug: string }>
}

const COLUMNS: { status: PostStatus; label: string; color: string }[] = [
  { status: 'planned', label: '計画済み', color: 'border-t-blue-500' },
  { status: 'in_progress', label: '進行中', color: 'border-t-indigo-500' },
  { status: 'complete', label: '完了', color: 'border-t-green-500' },
]

export default async function RoadmapPage({ params }: PageProps) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: rawBoard } = await supabase
    .from('boards')
    .select('id, name')
    .eq('slug', slug)
    .single()

  if (!rawBoard) notFound()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const board = rawBoard as any

  const { data: rawPosts } = await supabase
    .from('posts')
    .select('*')
    .eq('board_id', board.id)
    .in('status', ['planned', 'in_progress', 'complete'])
    .order('vote_count', { ascending: false })

  const posts = (rawPosts ?? []) as Post[]

  const grouped: Record<PostStatus, Post[]> = {
    planned: [],
    in_progress: [],
    complete: [],
    open: [],
    under_review: [],
    closed: [],
  }

  for (const post of posts) {
    if (grouped[post.status]) {
      grouped[post.status].push(post)
    }
  }

  return (
    <div>
      <h2 className="text-lg font-bold text-neutral-900 mb-6">公開ロードマップ</h2>

      <div className="grid gap-4 md:grid-cols-3">
        {COLUMNS.map(({ status, label, color }) => (
          <div key={status} className="flex flex-col">
            <div className={`bg-white border border-neutral-200 rounded-t-xl border-t-4 ${color} px-4 py-3 mb-2`}>
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm text-neutral-800">{label}</h3>
                <span className="text-xs text-neutral-400 bg-neutral-100 rounded-full px-2 py-0.5">
                  {grouped[status].length}
                </span>
              </div>
            </div>
            <div className="space-y-2 flex-1">
              {grouped[status].length === 0 ? (
                <div className="bg-neutral-50 border border-dashed border-neutral-200 rounded-xl px-4 py-6 text-center text-xs text-neutral-400">
                  なし
                </div>
              ) : (
                grouped[status].map((post) => (
                  <Link
                    key={post.id}
                    href={`/b/${slug}/post/${post.id}`}
                    className="block bg-white border border-neutral-200 rounded-xl px-4 py-3 hover:border-neutral-300 hover:shadow-sm transition-all"
                  >
                    <p className="text-sm font-medium text-neutral-900 line-clamp-2 mb-1.5">
                      {post.title}
                    </p>
                    <div className="flex items-center gap-2">
                      {post.category && (
                        <span className="text-xs text-neutral-400 bg-neutral-50 border border-neutral-200 rounded px-1.5 py-0.5">
                          {post.category}
                        </span>
                      )}
                      <span className="flex items-center gap-0.5 text-xs text-neutral-400 ml-auto">
                        <ChevronUp className="w-3 h-3" />
                        {post.vote_count}
                      </span>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
