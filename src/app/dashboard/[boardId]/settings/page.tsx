import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { BoardSettingsForm } from '@/components/dashboard/board-settings-form'
import type { Board } from '@/lib/supabase/types'

interface PageProps {
  params: Promise<{ boardId: string }>
}

export default async function BoardSettingsPage({ params }: PageProps) {
  const { boardId } = await params

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

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-neutral-900">ボード設定</h1>
        <p className="text-sm text-neutral-500 mt-0.5">{board.name} の設定を変更します</p>
      </div>
      <BoardSettingsForm board={board} />
    </div>
  )
}
