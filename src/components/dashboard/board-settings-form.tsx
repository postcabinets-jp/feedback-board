'use client'

import { useState, useTransition } from 'react'
import { updateBoard, deleteBoard } from '@/app/actions/boards'
import type { Board } from '@/lib/supabase/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { ExternalLink } from 'lucide-react'
import Link from 'next/link'

export function BoardSettingsForm({ board }: { board: Board }) {
  const [isPending, startTransition] = useTransition()
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [confirmDelete, setConfirmDelete] = useState(false)

  async function handleUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setMessage(null)
    startTransition(async () => {
      const result = await updateBoard(board.id, new FormData(e.currentTarget))
      if (result?.error) setMessage({ type: 'error', text: result.error })
      else if (result?.success) setMessage({ type: 'success', text: result.success })
    })
  }

  async function handleDelete() {
    startTransition(async () => {
      await deleteBoard(board.id)
    })
  }

  return (
    <div className="space-y-8">
      {/* Board info */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-6">
        <h2 className="font-semibold text-neutral-900 mb-4">基本情報</h2>
        <form onSubmit={handleUpdate} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="name">ボード名</Label>
            <Input id="name" name="name" defaultValue={board.name} required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="description">説明</Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={board.description ?? ''}
              rows={3}
              placeholder="このボードの目的を説明してください"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="categories">カテゴリ（1行に1つ）</Label>
            <Textarea
              id="categories"
              name="categories"
              defaultValue={(board.categories ?? []).join('\n')}
              rows={4}
              placeholder="Feature Request&#10;Bug Report&#10;Improvement"
            />
          </div>

          {message && (
            <p className={`text-sm rounded-lg px-3 py-2 ${
              message.type === 'success'
                ? 'text-green-700 bg-green-50 border border-green-100'
                : 'text-red-600 bg-red-50 border border-red-100'
            }`}>
              {message.text}
            </p>
          )}

          <div className="flex items-center gap-3">
            <Button type="submit" disabled={isPending}>
              {isPending ? '保存中...' : '保存'}
            </Button>
            <Link
              href={`/b/${board.slug}`}
              target="_blank"
              className="text-sm text-blue-600 hover:underline flex items-center gap-1"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              公開ボードを開く
            </Link>
          </div>
        </form>
      </div>

      {/* Public URL */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-6">
        <h2 className="font-semibold text-neutral-900 mb-1">公開URL</h2>
        <p className="text-sm text-neutral-500 mb-3">ユーザーはこのURLからフィードバックを投稿できます</p>
        <div className="flex items-center gap-2 bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-2">
          <code className="text-sm text-neutral-700 flex-1">
            {process.env.NEXT_PUBLIC_APP_URL}/b/{board.slug}
          </code>
        </div>
      </div>

      <Separator />

      {/* Danger zone */}
      <div className="bg-white border border-red-200 rounded-2xl p-6">
        <h2 className="font-semibold text-red-700 mb-1">危険ゾーン</h2>
        <p className="text-sm text-neutral-500 mb-4">
          ボードを削除すると、すべての投稿・投票・コメントが永久に削除されます。この操作は取り消せません。
        </p>
        {!confirmDelete ? (
          <Button variant="destructive" onClick={() => setConfirmDelete(true)}>
            ボードを削除
          </Button>
        ) : (
          <div className="flex items-center gap-3">
            <Button variant="destructive" onClick={handleDelete} disabled={isPending}>
              {isPending ? '削除中...' : '本当に削除する'}
            </Button>
            <Button variant="outline" onClick={() => setConfirmDelete(false)}>
              キャンセル
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
