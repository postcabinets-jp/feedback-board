'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, MessageSquare, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CreateBoardDialog } from './create-board-dialog'

interface Board {
  id: string
  name: string
  slug: string
}

export function DashboardSidebar({ boards }: { boards: Board[] }) {
  const pathname = usePathname()

  return (
    <aside className="w-60 border-r border-neutral-200 bg-white flex flex-col shrink-0">
      <div className="px-4 py-4 border-b border-neutral-100">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-6 h-6 bg-neutral-900 rounded flex items-center justify-center">
            <MessageSquare className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-semibold text-sm text-neutral-900">Feedback Board</span>
        </Link>
      </div>

      <nav className="flex-1 px-2 py-3 overflow-y-auto">
        <Link
          href="/dashboard"
          className={cn(
            'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
            pathname === '/dashboard'
              ? 'bg-neutral-100 text-neutral-900'
              : 'text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900'
          )}
        >
          <LayoutDashboard className="w-4 h-4" />
          ダッシュボード
        </Link>

        {boards.length > 0 && (
          <div className="mt-4">
            <p className="px-3 text-xs font-medium text-neutral-400 uppercase tracking-wider mb-1">
              ボード
            </p>
            <div className="space-y-0.5">
              {boards.map((board) => (
                <Link
                  key={board.id}
                  href={`/dashboard/${board.id}`}
                  className={cn(
                    'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    pathname.startsWith(`/dashboard/${board.id}`)
                      ? 'bg-neutral-100 text-neutral-900'
                      : 'text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900'
                  )}
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                  <span className="truncate">{board.name}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>

      <div className="p-3 border-t border-neutral-100">
        <CreateBoardDialog>
          <button className="flex items-center gap-2 w-full rounded-lg px-3 py-2 text-sm text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900 transition-colors">
            <Plus className="w-4 h-4" />
            新しいボード
          </button>
        </CreateBoardDialog>
      </div>
    </aside>
  )
}
