'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import {
  createBoardSchema,
  updateBoardSchema,
  deleteBoardSchema,
} from '@/lib/validations'

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\u3040-\u309f\u30a0-\u30ff\u4e00-\u9fff]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60)
}

export async function createBoard(formData: FormData) {
  const parsed = createBoardSchema.safeParse({
    name: formData.get('name'),
    description: formData.get('description'),
  })
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'ログインが必要です' }

  const { name, description } = parsed.data

  let slug = slugify(name)
  if (!slug) slug = `board-${Date.now()}`

  const { data: existing } = await supabase
    .from('boards')
    .select('slug')
    .eq('slug', slug)
    .single()

  if (existing) slug = `${slug}-${Date.now().toString(36)}`

  const { data, error } = await supabase
    .from('boards')
    .insert([{ user_id: user.id, name, slug, description }])
    .select('id')
    .single()

  if (error || !data) return { error: '作成に失敗しました' }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const board = data as any
  revalidatePath('/dashboard')
  redirect(`/dashboard/${board.id}`)
}

export async function updateBoard(boardId: string, formData: FormData) {
  const parsed = updateBoardSchema.safeParse({
    boardId,
    name: formData.get('name'),
    description: formData.get('description'),
    categories: formData.get('categories'),
  })
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'ログインが必要です' }

  const { name, description, categories } = parsed.data

  const updates: Record<string, unknown> = {
    name,
    description,
  }
  if (categories) updates.categories = categories

  const { error } = await supabase
    .from('boards')
    .update(updates)
    .eq('id', boardId)
    .eq('user_id', user.id)

  if (error) return { error: '更新に失敗しました' }

  revalidatePath(`/dashboard/${boardId}`)
  revalidatePath(`/dashboard/${boardId}/settings`)
  return { success: '更新しました' }
}

export async function deleteBoard(boardId: string) {
  const parsed = deleteBoardSchema.safeParse({ boardId })
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'ログインが必要です' }

  const { error } = await supabase
    .from('boards')
    .delete()
    .eq('id', boardId)
    .eq('user_id', user.id)

  if (error) return { error: '削除に失敗しました' }

  revalidatePath('/dashboard')
  redirect('/dashboard')
}
