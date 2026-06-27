'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { PostStatus } from '@/lib/supabase/types'

export async function createPost(boardId: string, boardSlug: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const title = (formData.get('title') as string)?.trim()
  const description = (formData.get('description') as string)?.trim()
  const category = (formData.get('category') as string)?.trim() || null
  const authorName = (formData.get('author_name') as string)?.trim() || null
  const authorEmail = (formData.get('author_email') as string)?.trim() || null

  if (!title || !description) return { error: 'タイトルと詳細は必須です' }

  const { data, error } = await supabase
    .from('posts')
    .insert([{
      board_id: boardId,
      author_id: user?.id ?? null,
      author_email: user?.email ?? authorEmail,
      author_name: authorName,
      title,
      description,
      category,
    }])
    .select('id')
    .single()

  if (error || !data) return { error: '投稿に失敗しました' }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const post = data as any
  revalidatePath(`/b/${boardSlug}`)
  revalidatePath(`/dashboard/${boardId}`)
  return { postId: post.id as string }
}

export async function updatePostStatus(postId: string, boardId: string, boardSlug: string, status: PostStatus) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'ログインが必要です' }

  const { data: board } = await supabase
    .from('boards')
    .select('id')
    .eq('id', boardId)
    .eq('user_id', user.id)
    .single()

  if (!board) return { error: '権限がありません' }

  const { error } = await supabase
    .from('posts')
    .update({ status })
    .eq('id', postId)
    .eq('board_id', boardId)

  if (error) return { error: '更新に失敗しました' }

  revalidatePath(`/b/${boardSlug}`)
  revalidatePath(`/b/${boardSlug}/roadmap`)
  revalidatePath(`/dashboard/${boardId}`)
  return { success: true }
}

export async function mergePost(fromPostId: string, intoPostId: string, boardId: string, boardSlug: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'ログインが必要です' }

  const { data: board } = await supabase
    .from('boards')
    .select('id')
    .eq('id', boardId)
    .eq('user_id', user.id)
    .single()

  if (!board) return { error: '権限がありません' }

  const { error } = await supabase
    .from('posts')
    .update({ merged_into: intoPostId, status: 'closed' })
    .eq('id', fromPostId)

  if (error) return { error: 'マージに失敗しました' }

  revalidatePath(`/b/${boardSlug}`)
  revalidatePath(`/dashboard/${boardId}`)
  return { success: true }
}

export async function toggleVote(postId: string, boardSlug: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'ログインが必要です' }

  const { data: existing } = await supabase
    .from('votes')
    .select('id')
    .eq('post_id', postId)
    .eq('user_id', user.id)
    .single()

  if (existing) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await supabase.from('votes').delete().eq('id', (existing as any).id)
    if (error) return { error: '投票の取り消しに失敗しました' }
  } else {
    const { error } = await supabase.from('votes').insert([{ post_id: postId, user_id: user.id }])
    if (error) return { error: '投票に失敗しました' }
  }

  revalidatePath(`/b/${boardSlug}`)
  return { voted: !existing }
}

export async function addComment(postId: string, boardSlug: string, boardId: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'ログインが必要です' }

  const content = (formData.get('content') as string)?.trim()
  if (!content) return { error: 'コメント内容は必須です' }

  const { data: board } = await supabase
    .from('boards')
    .select('id')
    .eq('id', boardId)
    .eq('user_id', user.id)
    .single()

  const { error } = await supabase
    .from('comments')
    .insert([{
      post_id: postId,
      author_id: user.id,
      content,
      is_admin: !!board,
    }])

  if (error) return { error: 'コメントの投稿に失敗しました' }

  revalidatePath(`/b/${boardSlug}/post/${postId}`)
  return { success: true }
}
