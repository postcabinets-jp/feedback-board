import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { MessageSquare } from 'lucide-react'

export default async function BoardLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: rawBoard } = await supabase
    .from('boards')
    .select('id, name, description, slug')
    .eq('slug', slug)
    .single()

  if (!rawBoard) notFound()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const board = rawBoard as any

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="bg-white border-b border-neutral-200">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-neutral-900 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="font-semibold text-neutral-900">{board.name}</h1>
              {board.description && (
                <p className="text-xs text-neutral-500">{board.description}</p>
              )}
            </div>
          </div>
          <nav className="flex items-center gap-4">
            <Link href={`/b/${slug}`} className="text-sm text-neutral-600 hover:text-neutral-900">
              フィードバック
            </Link>
            <Link href={`/b/${slug}/roadmap`} className="text-sm text-neutral-600 hover:text-neutral-900">
              ロードマップ
            </Link>
            <Link href="/login" className="text-sm font-medium text-neutral-900 border border-neutral-200 rounded-lg px-3 py-1.5 hover:bg-neutral-50 transition-colors">
              ログイン
            </Link>
          </nav>
        </div>
      </header>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {children}
      </div>
    </div>
  )
}
