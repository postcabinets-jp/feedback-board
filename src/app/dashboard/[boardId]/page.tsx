import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AdminPostList } from '@/components/dashboard/admin-post-list'
import { Button } from '@/components/ui/button'
import { ExternalLink, Settings } from 'lucide-react'
import Link from 'next/link'
import type { Board, Post } from '@/lib/supabase/types'

interface PageProps {
  params: Promise<{ boardId: string }>
  searchParams: Promise<{ status?: string; q?: string }>
}

export default async function BoardAdminPage({ params, searchParams }: PageProps) {
  const { boardId } = await params
  const { status, q } = await searchParams

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: rawBoard } = await supabase
    .from('boards')
    .select('*')
    .eq('id', boardId)
    .eq('user_id', user.id)
    .single()

  if (!rawBoard) notFound()
  const board = rawBoard as Board

  let query = supabase
    .from('posts')
    .select('*')
    .eq('board_id', boardId)
    .order('vote_count', { ascending: false })

  if (status && status !== 'all') {
    query = query.eq('status', status)
  }
  if (q) {
    query = query.ilike('title', `%${q}%`)
  }

  const { data: rawPosts } = await query
  const posts = (rawPosts ?? []) as Post[]

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-neutral-900">{board.name}</h1>
          {board.description && (
            <p className="text-sm text-neutral-500 mt-0.5">{board.description}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/b/${board.slug}`} target="_blank">
            <Button variant="outline" size="sm">
              <ExternalLink className="w-4 h-4 mr-1.5" />
              公開ボード
            </Button>
          </Link>
          <Link href={`/dashboard/${boardId}/settings`}>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-1.5" />
              設定
            </Button>
          </Link>
        </div>
      </div>

      <AdminPostList
        posts={posts}
        boardId={boardId}
        boardSlug={board.slug}
        currentStatus={status ?? 'all'}
        searchQuery={q ?? ''}
      />
    </div>
  )
}
