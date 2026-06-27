import { createClient } from '@/lib/supabase/server'
import { CreateBoardDialog } from '@/components/dashboard/create-board-dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ExternalLink, MessageSquare, Plus } from 'lucide-react'
import Link from 'next/link'
import type { Board } from '@/lib/supabase/types'

export const metadata = { title: 'ダッシュボード — Feedback Board' }

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: rawBoards } = await supabase
    .from('boards')
    .select('id, name, slug, description, created_at')
    .eq('user_id', user!.id)
    .order('created_at', { ascending: false })

  const boards = (rawBoards ?? []) as Pick<Board, 'id' | 'name' | 'slug' | 'description' | 'created_at'>[]

  const boardIds = boards.map(b => b.id)
  const { data: rawPostCounts } = boardIds.length > 0
    ? await supabase
        .from('posts')
        .select('board_id')
        .in('board_id', boardIds)
        .neq('status', 'closed')
    : { data: [] }

  const postCounts = rawPostCounts as { board_id: string }[] | null
  const countMap: Record<string, number> = {}
  for (const p of postCounts ?? []) {
    countMap[p.board_id] = (countMap[p.board_id] ?? 0) + 1
  }

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-neutral-900">マイボード</h1>
          <p className="text-sm text-neutral-500 mt-0.5">フィードバックボードを管理します</p>
        </div>
        <CreateBoardDialog>
          <Button>
            <Plus className="w-4 h-4 mr-1.5" />
            新しいボード
          </Button>
        </CreateBoardDialog>
      </div>

      {boards.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed border-neutral-200 rounded-2xl">
          <MessageSquare className="w-10 h-10 text-neutral-300 mx-auto mb-3" />
          <p className="text-neutral-500 font-medium">ボードがありません</p>
          <p className="text-sm text-neutral-400 mt-1 mb-4">最初のフィードバックボードを作成しましょう</p>
          <CreateBoardDialog>
            <Button>
              <Plus className="w-4 h-4 mr-1.5" />
              ボードを作成
            </Button>
          </CreateBoardDialog>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {boards.map((board) => (
            <Card key={board.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-base font-semibold leading-tight">
                    <Link href={`/dashboard/${board.id}`} className="hover:text-blue-600 transition-colors">
                      {board.name}
                    </Link>
                  </CardTitle>
                  <Link
                    href={`/b/${board.slug}`}
                    target="_blank"
                    className="shrink-0 text-neutral-400 hover:text-neutral-600 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {board.description && (
                  <p className="text-sm text-neutral-500 mb-3 line-clamp-2">{board.description}</p>
                )}
                <div className="flex items-center gap-4 text-xs text-neutral-400">
                  <span className="flex items-center gap-1">
                    <MessageSquare className="w-3 h-3" />
                    {countMap[board.id] ?? 0} 件のリクエスト
                  </span>
                  <span>
                    {new Date(board.created_at).toLocaleDateString('ja-JP')}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
