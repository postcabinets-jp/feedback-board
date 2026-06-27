'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createPost } from '@/app/actions/posts'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

interface NewPostDialogProps {
  boardId: string
  boardSlug: string
  categories: string[]
  isLoggedIn: boolean
  children: React.ReactNode
}

export function NewPostDialog({ boardId, boardSlug, categories, isLoggedIn, children }: NewPostDialogProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  function handleTriggerClick() {
    if (!isLoggedIn) {
      router.push('/login')
      return
    }
    setOpen(true)
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const result = await createPost(boardId, boardSlug, new FormData(e.currentTarget))
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    } else {
      setOpen(false)
      setLoading(false)
    }
  }

  return (
    <>
      <span onClick={handleTriggerClick} className="contents cursor-pointer">
        {children}
      </span>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>フィードバックを投稿</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div className="space-y-1.5">
              <Label htmlFor="title">タイトル <span className="text-red-500">*</span></Label>
              <Input
                id="title"
                name="title"
                placeholder="例: ダークモードに対応してほしい"
                required
                maxLength={120}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="description">詳細 <span className="text-red-500">*</span></Label>
              <Textarea
                id="description"
                name="description"
                placeholder="どんな課題があるか、どう解決してほしいかを具体的に書いてください"
                rows={4}
                required
              />
            </div>
            {categories.length > 0 && (
              <div className="space-y-1.5">
                <Label>カテゴリ</Label>
                <Select name="category">
                  <SelectTrigger>
                    <SelectValue placeholder="カテゴリを選択" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>
            )}

            <div className="flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                キャンセル
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? '投稿中...' : '投稿する'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
