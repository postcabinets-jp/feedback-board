import { describe, it, expect } from 'vitest'
import {
  postStatusSchema,
  signUpSchema,
  signInSchema,
  resetPasswordSchema,
  updatePasswordSchema,
  createBoardSchema,
  updateBoardSchema,
  deleteBoardSchema,
  createPostSchema,
  updatePostStatusSchema,
  mergePostSchema,
  toggleVoteSchema,
  addCommentSchema,
} from '@/lib/validations'

// ─── Helpers ──────────────────────────────────────────────
const VALID_UUID = '550e8400-e29b-41d4-a716-446655440000'
const INVALID_UUID = 'not-a-uuid'

function expectSuccess(result: { success: boolean }) {
  expect(result.success).toBe(true)
}

function expectFail(result: { success: boolean; error?: { issues: { message: string }[] } }) {
  expect(result.success).toBe(false)
}

function firstMessage(result: { error?: { issues: { message: string }[] } }): string {
  return result.error!.issues[0].message
}

// ─── postStatusSchema ─────────────────────────────────────
describe('postStatusSchema', () => {
  const validStatuses = ['open', 'under_review', 'planned', 'in_progress', 'complete', 'closed']

  it.each(validStatuses)('accepts "%s"', (status) => {
    expectSuccess(postStatusSchema.safeParse(status))
  })

  it('rejects invalid status', () => {
    expectFail(postStatusSchema.safeParse('pending'))
  })

  it('rejects empty string', () => {
    expectFail(postStatusSchema.safeParse(''))
  })

  it('rejects number', () => {
    expectFail(postStatusSchema.safeParse(42))
  })
})

// ─── signUpSchema ─────────────────────────────────────────
describe('signUpSchema', () => {
  const valid = {
    email: 'user@example.com',
    password: '12345678',
    display_name: 'Nobu',
  }

  it('accepts valid input', () => {
    expectSuccess(signUpSchema.safeParse(valid))
  })

  it('rejects invalid email', () => {
    const r = signUpSchema.safeParse({ ...valid, email: 'bad' })
    expectFail(r)
    expect(firstMessage(r)).toBe('有効なメールアドレスを入力してください')
  })

  it('rejects empty email', () => {
    expectFail(signUpSchema.safeParse({ ...valid, email: '' }))
  })

  it('rejects password shorter than 8 chars', () => {
    const r = signUpSchema.safeParse({ ...valid, password: '1234567' })
    expectFail(r)
    expect(firstMessage(r)).toBe('パスワードは8文字以上必要です')
  })

  it('accepts password of exactly 8 chars', () => {
    expectSuccess(signUpSchema.safeParse({ ...valid, password: '12345678' }))
  })

  it('rejects empty display_name', () => {
    const r = signUpSchema.safeParse({ ...valid, display_name: '' })
    expectFail(r)
    expect(firstMessage(r)).toBe('表示名は必須です')
  })

  it('accepts display_name of 100 chars', () => {
    expectSuccess(signUpSchema.safeParse({ ...valid, display_name: 'a'.repeat(100) }))
  })

  it('rejects display_name over 100 chars', () => {
    expectFail(signUpSchema.safeParse({ ...valid, display_name: 'a'.repeat(101) }))
  })

  it('rejects missing fields', () => {
    expectFail(signUpSchema.safeParse({}))
  })
})

// ─── signInSchema ─────────────────────────────────────────
describe('signInSchema', () => {
  const valid = { email: 'user@example.com', password: 'pass' }

  it('accepts valid input', () => {
    expectSuccess(signInSchema.safeParse(valid))
  })

  it('rejects invalid email', () => {
    const r = signInSchema.safeParse({ ...valid, email: 'nope' })
    expectFail(r)
    expect(firstMessage(r)).toBe('有効なメールアドレスを入力してください')
  })

  it('rejects empty password', () => {
    const r = signInSchema.safeParse({ ...valid, password: '' })
    expectFail(r)
    expect(firstMessage(r)).toBe('パスワードは必須です')
  })

  it('accepts password of 1 char (min 1)', () => {
    expectSuccess(signInSchema.safeParse({ ...valid, password: 'x' }))
  })
})

// ─── resetPasswordSchema ──────────────────────────────────
describe('resetPasswordSchema', () => {
  it('accepts valid email', () => {
    expectSuccess(resetPasswordSchema.safeParse({ email: 'a@b.co' }))
  })

  it('rejects invalid email', () => {
    const r = resetPasswordSchema.safeParse({ email: 'bad' })
    expectFail(r)
    expect(firstMessage(r)).toBe('有効なメールアドレスを入力してください')
  })

  it('rejects missing email', () => {
    expectFail(resetPasswordSchema.safeParse({}))
  })
})

// ─── updatePasswordSchema ─────────────────────────────────
describe('updatePasswordSchema', () => {
  it('accepts 8-char password', () => {
    expectSuccess(updatePasswordSchema.safeParse({ password: '12345678' }))
  })

  it('accepts long password', () => {
    expectSuccess(updatePasswordSchema.safeParse({ password: 'a'.repeat(256) }))
  })

  it('rejects 7-char password', () => {
    const r = updatePasswordSchema.safeParse({ password: '1234567' })
    expectFail(r)
    expect(firstMessage(r)).toBe('パスワードは8文字以上必要です')
  })

  it('rejects empty password', () => {
    expectFail(updatePasswordSchema.safeParse({ password: '' }))
  })
})

// ─── createBoardSchema ────────────────────────────────────
describe('createBoardSchema', () => {
  it('accepts valid input with description', () => {
    const r = createBoardSchema.safeParse({ name: 'My Board', description: 'desc' })
    expectSuccess(r)
  })

  it('accepts valid input without description', () => {
    expectSuccess(createBoardSchema.safeParse({ name: 'Board' }))
  })

  it('trims name', () => {
    const r = createBoardSchema.safeParse({ name: '  Board  ' })
    expect(r.success).toBe(true)
    if (r.success) expect(r.data.name).toBe('Board')
  })

  it('rejects empty name', () => {
    const r = createBoardSchema.safeParse({ name: '' })
    expectFail(r)
    expect(firstMessage(r)).toBe('ボード名は必須です')
  })

  it('accepts name of 100 chars', () => {
    expectSuccess(createBoardSchema.safeParse({ name: 'a'.repeat(100) }))
  })

  it('rejects name over 100 chars', () => {
    const r = createBoardSchema.safeParse({ name: 'a'.repeat(101) })
    expectFail(r)
    expect(firstMessage(r)).toBe('ボード名は100文字以内にしてください')
  })

  it('rejects description over 1000 chars', () => {
    const r = createBoardSchema.safeParse({ name: 'x', description: 'a'.repeat(1001) })
    expectFail(r)
  })

  it('accepts description of 1000 chars', () => {
    expectSuccess(createBoardSchema.safeParse({ name: 'x', description: 'a'.repeat(1000) }))
  })

  it('transforms null description to null', () => {
    const r = createBoardSchema.safeParse({ name: 'x', description: null })
    expect(r.success).toBe(true)
    if (r.success) expect(r.data.description).toBeNull()
  })

  it('transforms empty description to null', () => {
    const r = createBoardSchema.safeParse({ name: 'x', description: '' })
    expect(r.success).toBe(true)
    if (r.success) expect(r.data.description).toBeNull()
  })
})

// ─── updateBoardSchema ────────────────────────────────────
describe('updateBoardSchema', () => {
  const valid = { boardId: VALID_UUID, name: 'Updated Board' }

  it('accepts valid input', () => {
    expectSuccess(updateBoardSchema.safeParse(valid))
  })

  it('rejects invalid boardId UUID', () => {
    expectFail(updateBoardSchema.safeParse({ ...valid, boardId: INVALID_UUID }))
  })

  it('rejects empty name', () => {
    const r = updateBoardSchema.safeParse({ ...valid, name: '' })
    expectFail(r)
  })

  it('rejects name over 100 chars', () => {
    expectFail(updateBoardSchema.safeParse({ ...valid, name: 'a'.repeat(101) }))
  })

  it('parses categories from newline-separated string', () => {
    const r = updateBoardSchema.safeParse({
      ...valid,
      categories: 'Bug\nFeature\nQuestion',
    })
    expect(r.success).toBe(true)
    if (r.success) {
      expect(r.data.categories).toEqual(['Bug', 'Feature', 'Question'])
    }
  })

  it('trims category entries and filters empty lines', () => {
    const r = updateBoardSchema.safeParse({
      ...valid,
      categories: '  Bug  \n\n  Feature  \n',
    })
    expect(r.success).toBe(true)
    if (r.success) {
      expect(r.data.categories).toEqual(['Bug', 'Feature'])
    }
  })

  it('returns undefined for absent categories', () => {
    const r = updateBoardSchema.safeParse(valid)
    expect(r.success).toBe(true)
    if (r.success) expect(r.data.categories).toBeUndefined()
  })

  it('returns undefined for null categories', () => {
    const r = updateBoardSchema.safeParse({ ...valid, categories: null })
    expect(r.success).toBe(true)
    if (r.success) expect(r.data.categories).toBeUndefined()
  })
})

// ─── deleteBoardSchema ────────────────────────────────────
describe('deleteBoardSchema', () => {
  it('accepts valid UUID', () => {
    expectSuccess(deleteBoardSchema.safeParse({ boardId: VALID_UUID }))
  })

  it('rejects invalid UUID', () => {
    expectFail(deleteBoardSchema.safeParse({ boardId: INVALID_UUID }))
  })

  it('rejects missing boardId', () => {
    expectFail(deleteBoardSchema.safeParse({}))
  })
})

// ─── createPostSchema ─────────────────────────────────────
describe('createPostSchema', () => {
  const valid = {
    boardId: VALID_UUID,
    boardSlug: 'my-board',
    title: 'Feature Request',
    description: 'Please add dark mode',
  }

  it('accepts valid input', () => {
    expectSuccess(createPostSchema.safeParse(valid))
  })

  it('rejects invalid boardId', () => {
    expectFail(createPostSchema.safeParse({ ...valid, boardId: INVALID_UUID }))
  })

  it('rejects empty boardSlug', () => {
    expectFail(createPostSchema.safeParse({ ...valid, boardSlug: '' }))
  })

  it('rejects empty title', () => {
    const r = createPostSchema.safeParse({ ...valid, title: '' })
    expectFail(r)
    expect(firstMessage(r)).toBe('タイトルは必須です')
  })

  it('accepts title of 200 chars', () => {
    expectSuccess(createPostSchema.safeParse({ ...valid, title: 'a'.repeat(200) }))
  })

  it('rejects title over 200 chars', () => {
    const r = createPostSchema.safeParse({ ...valid, title: 'a'.repeat(201) })
    expectFail(r)
    expect(firstMessage(r)).toBe('タイトルは200文字以内にしてください')
  })

  it('trims title', () => {
    const r = createPostSchema.safeParse({ ...valid, title: '  Hello  ' })
    expect(r.success).toBe(true)
    if (r.success) expect(r.data.title).toBe('Hello')
  })

  it('rejects empty description', () => {
    const r = createPostSchema.safeParse({ ...valid, description: '' })
    expectFail(r)
    expect(firstMessage(r)).toBe('詳細は必須です')
  })

  it('accepts description of 5000 chars', () => {
    expectSuccess(createPostSchema.safeParse({ ...valid, description: 'a'.repeat(5000) }))
  })

  it('rejects description over 5000 chars', () => {
    const r = createPostSchema.safeParse({ ...valid, description: 'a'.repeat(5001) })
    expectFail(r)
    expect(firstMessage(r)).toBe('詳細は5000文字以内にしてください')
  })

  it('trims description', () => {
    const r = createPostSchema.safeParse({ ...valid, description: '  text  ' })
    expect(r.success).toBe(true)
    if (r.success) expect(r.data.description).toBe('text')
  })

  it('accepts optional category', () => {
    const r = createPostSchema.safeParse({ ...valid, category: 'Bug' })
    expect(r.success).toBe(true)
    if (r.success) expect(r.data.category).toBe('Bug')
  })

  it('transforms null category to null', () => {
    const r = createPostSchema.safeParse({ ...valid, category: null })
    expect(r.success).toBe(true)
    if (r.success) expect(r.data.category).toBeNull()
  })

  it('transforms empty category to null', () => {
    const r = createPostSchema.safeParse({ ...valid, category: '' })
    expect(r.success).toBe(true)
    if (r.success) expect(r.data.category).toBeNull()
  })

  it('accepts optional author_name', () => {
    const r = createPostSchema.safeParse({ ...valid, author_name: 'Nobu' })
    expect(r.success).toBe(true)
    if (r.success) expect(r.data.author_name).toBe('Nobu')
  })

  it('transforms null author_name to null', () => {
    const r = createPostSchema.safeParse({ ...valid, author_name: null })
    expect(r.success).toBe(true)
    if (r.success) expect(r.data.author_name).toBeNull()
  })

  it('accepts valid author_email', () => {
    const r = createPostSchema.safeParse({ ...valid, author_email: 'a@b.com' })
    expect(r.success).toBe(true)
    if (r.success) expect(r.data.author_email).toBe('a@b.com')
  })

  it('transforms empty author_email to null', () => {
    const r = createPostSchema.safeParse({ ...valid, author_email: '' })
    expect(r.success).toBe(true)
    if (r.success) expect(r.data.author_email).toBeNull()
  })

  it('transforms null author_email to null', () => {
    const r = createPostSchema.safeParse({ ...valid, author_email: null })
    expect(r.success).toBe(true)
    if (r.success) expect(r.data.author_email).toBeNull()
  })

  it('rejects invalid author_email', () => {
    expectFail(createPostSchema.safeParse({ ...valid, author_email: 'not-email' }))
  })

  it('rejects category over 100 chars', () => {
    expectFail(createPostSchema.safeParse({ ...valid, category: 'a'.repeat(101) }))
  })

  it('rejects author_name over 100 chars', () => {
    expectFail(createPostSchema.safeParse({ ...valid, author_name: 'a'.repeat(101) }))
  })
})

// ─── updatePostStatusSchema ──────────────────────────────
describe('updatePostStatusSchema', () => {
  const valid = {
    postId: VALID_UUID,
    boardId: VALID_UUID,
    boardSlug: 'my-board',
    status: 'planned' as const,
  }

  it('accepts valid input', () => {
    expectSuccess(updatePostStatusSchema.safeParse(valid))
  })

  it('rejects invalid postId', () => {
    expectFail(updatePostStatusSchema.safeParse({ ...valid, postId: INVALID_UUID }))
  })

  it('rejects invalid boardId', () => {
    expectFail(updatePostStatusSchema.safeParse({ ...valid, boardId: INVALID_UUID }))
  })

  it('rejects empty boardSlug', () => {
    expectFail(updatePostStatusSchema.safeParse({ ...valid, boardSlug: '' }))
  })

  it('rejects invalid status', () => {
    expectFail(updatePostStatusSchema.safeParse({ ...valid, status: 'invalid' }))
  })

  it.each(['open', 'under_review', 'planned', 'in_progress', 'complete', 'closed'] as const)(
    'accepts status "%s"',
    (status) => {
      expectSuccess(updatePostStatusSchema.safeParse({ ...valid, status }))
    },
  )
})

// ─── mergePostSchema ──────────────────────────────────────
describe('mergePostSchema', () => {
  const valid = {
    fromPostId: VALID_UUID,
    intoPostId: '660e8400-e29b-41d4-a716-446655440001',
    boardId: VALID_UUID,
    boardSlug: 'my-board',
  }

  it('accepts valid input', () => {
    expectSuccess(mergePostSchema.safeParse(valid))
  })

  it('rejects invalid fromPostId', () => {
    expectFail(mergePostSchema.safeParse({ ...valid, fromPostId: INVALID_UUID }))
  })

  it('rejects invalid intoPostId', () => {
    expectFail(mergePostSchema.safeParse({ ...valid, intoPostId: INVALID_UUID }))
  })

  it('rejects invalid boardId', () => {
    expectFail(mergePostSchema.safeParse({ ...valid, boardId: INVALID_UUID }))
  })

  it('rejects empty boardSlug', () => {
    expectFail(mergePostSchema.safeParse({ ...valid, boardSlug: '' }))
  })

  it('rejects missing fields', () => {
    expectFail(mergePostSchema.safeParse({}))
  })
})

// ─── toggleVoteSchema ─────────────────────────────────────
describe('toggleVoteSchema', () => {
  const valid = { postId: VALID_UUID, boardSlug: 'my-board' }

  it('accepts valid input', () => {
    expectSuccess(toggleVoteSchema.safeParse(valid))
  })

  it('rejects invalid postId', () => {
    expectFail(toggleVoteSchema.safeParse({ ...valid, postId: INVALID_UUID }))
  })

  it('rejects empty boardSlug', () => {
    expectFail(toggleVoteSchema.safeParse({ ...valid, boardSlug: '' }))
  })

  it('rejects missing fields', () => {
    expectFail(toggleVoteSchema.safeParse({}))
  })
})

// ─── addCommentSchema ─────────────────────────────────────
describe('addCommentSchema', () => {
  const valid = {
    postId: VALID_UUID,
    boardSlug: 'my-board',
    boardId: VALID_UUID,
    content: 'Great idea!',
  }

  it('accepts valid input', () => {
    expectSuccess(addCommentSchema.safeParse(valid))
  })

  it('rejects invalid postId', () => {
    expectFail(addCommentSchema.safeParse({ ...valid, postId: INVALID_UUID }))
  })

  it('rejects invalid boardId', () => {
    expectFail(addCommentSchema.safeParse({ ...valid, boardId: INVALID_UUID }))
  })

  it('rejects empty boardSlug', () => {
    expectFail(addCommentSchema.safeParse({ ...valid, boardSlug: '' }))
  })

  it('rejects empty content', () => {
    const r = addCommentSchema.safeParse({ ...valid, content: '' })
    expectFail(r)
    expect(firstMessage(r)).toBe('コメント内容は必須です')
  })

  it('accepts content of 5000 chars', () => {
    expectSuccess(addCommentSchema.safeParse({ ...valid, content: 'a'.repeat(5000) }))
  })

  it('rejects content over 5000 chars', () => {
    const r = addCommentSchema.safeParse({ ...valid, content: 'a'.repeat(5001) })
    expectFail(r)
    expect(firstMessage(r)).toBe('コメントは5000文字以内にしてください')
  })

  it('trims content', () => {
    const r = addCommentSchema.safeParse({ ...valid, content: '  hello  ' })
    expect(r.success).toBe(true)
    if (r.success) expect(r.data.content).toBe('hello')
  })

  it('rejects missing fields', () => {
    expectFail(addCommentSchema.safeParse({}))
  })
})
