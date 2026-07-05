import { z } from 'zod'

// ─── Post status enum ───────────────────────────────────────
export const postStatusSchema = z.enum([
  'open',
  'under_review',
  'planned',
  'in_progress',
  'complete',
  'closed',
])

// ─── UUID (reusable) ────────────────────────────────────────
const uuid = z.string().uuid()

// FormData.get() returns null for absent fields. Coerce null → undefined
// so z.string().optional() works correctly.
const optStr = z
  .string()
  .nullable()
  .optional()
  .transform((v) => v ?? undefined)

// ─── Auth ───────────────────────────────────────────────────
export const signUpSchema = z.object({
  email: z.string().email('有効なメールアドレスを入力してください'),
  password: z.string().min(8, 'パスワードは8文字以上必要です'),
  display_name: z.string().min(1, '表示名は必須です').max(100),
})

export const signInSchema = z.object({
  email: z.string().email('有効なメールアドレスを入力してください'),
  password: z.string().min(1, 'パスワードは必須です'),
})

export const resetPasswordSchema = z.object({
  email: z.string().email('有効なメールアドレスを入力してください'),
})

export const updatePasswordSchema = z.object({
  password: z.string().min(8, 'パスワードは8文字以上必要です'),
})

// ─── Boards ─────────────────────────────────────────────────
export const createBoardSchema = z.object({
  name: z
    .string()
    .min(1, 'ボード名は必須です')
    .max(100, 'ボード名は100文字以内にしてください')
    .transform((v) => v.trim()),
  description: optStr.pipe(
    z
      .string()
      .max(1000, '説明は1000文字以内にしてください')
      .optional()
      .transform((v) => v?.trim() || null),
  ),
})

export const updateBoardSchema = z.object({
  boardId: uuid,
  name: z
    .string()
    .min(1, 'ボード名は必須です')
    .max(100, 'ボード名は100文字以内にしてください')
    .transform((v) => v.trim()),
  description: optStr.pipe(
    z
      .string()
      .max(1000, '説明は1000文字以内にしてください')
      .optional()
      .transform((v) => v?.trim() || null),
  ),
  categories: optStr.pipe(
    z
      .string()
      .optional()
      .transform((v) =>
        v
          ? v
              .split('\n')
              .map((c) => c.trim())
              .filter(Boolean)
          : undefined,
      ),
  ),
})

export const deleteBoardSchema = z.object({
  boardId: uuid,
})

// ─── Posts ───────────────────────────────────────────────────
export const createPostSchema = z.object({
  boardId: uuid,
  boardSlug: z.string().min(1),
  title: z
    .string()
    .min(1, 'タイトルは必須です')
    .max(200, 'タイトルは200文字以内にしてください')
    .transform((v) => v.trim()),
  description: z
    .string()
    .min(1, '詳細は必須です')
    .max(5000, '詳細は5000文字以内にしてください')
    .transform((v) => v.trim()),
  category: optStr.pipe(
    z
      .string()
      .max(100)
      .optional()
      .transform((v) => v?.trim() || null),
  ),
  author_name: optStr.pipe(
    z
      .string()
      .max(100)
      .optional()
      .transform((v) => v?.trim() || null),
  ),
  author_email: z
    .string()
    .email('有効なメールアドレスを入力してください')
    .nullable()
    .optional()
    .or(z.literal(''))
    .transform((v) => (v ? v.trim() : null)),
})

export const updatePostStatusSchema = z.object({
  postId: uuid,
  boardId: uuid,
  boardSlug: z.string().min(1),
  status: postStatusSchema,
})

export const mergePostSchema = z.object({
  fromPostId: uuid,
  intoPostId: uuid,
  boardId: uuid,
  boardSlug: z.string().min(1),
})

export const toggleVoteSchema = z.object({
  postId: uuid,
  boardSlug: z.string().min(1),
})

export const addCommentSchema = z.object({
  postId: uuid,
  boardSlug: z.string().min(1),
  boardId: uuid,
  content: z
    .string()
    .min(1, 'コメント内容は必須です')
    .max(5000, 'コメントは5000文字以内にしてください')
    .transform((v) => v.trim()),
})
