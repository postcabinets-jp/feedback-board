import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { PostList } from '@/components/board/post-list'
import { NewPostDialog } from '@/components/board/new-post-dialog'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import type { Post } from '@/lib/supabase/types'

interface PageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ status?: string; category?: string; sort?: string; q?: string }>
}

export default async function BoardPage({ params, searchParams }: PageProps) {
  const { slug } = await params
  const { status, category, sort = 'votes', q } = await searchParams

  const supabase = await createClient()

  const { data: rawBoard } = await supabase
    .from('boards')
    .select('id, name, slug, categories, description')
    .eq('slug', slug)
    .single()

  if (!rawBoard) notFound()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const board = rawBoard as any

  const { data: { user } } = await supabase.auth.getUser()

  let query = supabase
    .from('posts')
    .select('*')
    .eq('board_id', board.id)
    .neq('status', 'closed')

  if (status && status !== 'all') {
    query = query.eq('status', status)
  }
  if (category) {
    query = query.eq('category', category)
  }
  if (q) {
    query = query.ilike('title', `%${q}%`)
  }

  if (sort === 'votes') {
    query = query.order('vote_count', { ascending: false })
  } else {
    query = query.order('created_at', { ascending: false })
  }

  const { data: rawPosts } = await query
  const posts = (rawPosts ?? []) as Post[]

  let userVotes: Set<string> = new Set()
  if (user) {
    const postIds = posts.map(p => p.id)
    if (postIds.length > 0) {
      const { data: rawVotes } = await supabase
        .from('votes')
        .select('post_id')
        .eq('user_id', user.id)
        .in('post_id', postIds)
      const votes = (rawVotes ?? []) as { post_id: string }[]
      userVotes = new Set(votes.map(v => v.post_id))
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-neutral-900">
          フィードバック一覧
        </h2>
        <NewPostDialog
          boardId={board.id}
          boardSlug={slug}
          categories={board.categories ?? []}
          isLoggedIn={!!user}
        >
          <Button size="sm">
            <Plus className="w-4 h-4 mr-1.5" />
            リクエストを投稿
          </Button>
        </NewPostDialog>
      </div>

      <PostList
        posts={posts}
        userVotes={Array.from(userVotes)}
        boardSlug={slug}
        boardId={board.id}
        categories={board.categories ?? []}
        currentStatus={status ?? 'all'}
        currentCategory={category ?? ''}
        currentSort={sort}
        searchQuery={q ?? ''}
        isLoggedIn={!!user}
      />
    </div>
  )
}
