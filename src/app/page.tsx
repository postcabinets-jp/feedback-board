import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ChevronUp, GitMerge, LayoutDashboard, MessageSquare, Map, Shield, Zap } from 'lucide-react'

export const metadata = {
  title: 'Feedback Board — Open-source Canny alternative',
  description: '機能要望の投票・優先順位付け・ロードマップ管理をセルフホストで。Cannyの代替OSS。',
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="border-b border-neutral-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-neutral-900 rounded flex items-center justify-center">
              <MessageSquare className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-semibold text-sm text-neutral-900">Feedback Board</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="https://github.com/postcabinets-jp/feedback-board"
              target="_blank"
              className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
            >
              GitHub
            </Link>
            <Link href="/login">
              <Button variant="outline" size="sm">ログイン</Button>
            </Link>
            <Link href="/register">
              <Button size="sm">無料で始める</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-4 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-neutral-100 border border-neutral-200 text-neutral-600 rounded-full px-3 py-1 text-xs font-medium mb-6">
          Cannyの代替・完全オープンソース
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 leading-tight mb-4">
          ユーザーの声を<br />
          プロダクトに変える
        </h1>
        <p className="text-lg text-neutral-500 max-w-xl mx-auto mb-8">
          機能要望の収集・投票・優先順位付け・ロードマップ公開まで、
          セルフホストで無制限に使えるOSS。
          月$79〜のCannyを置き換えます。
        </p>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <Link href="/register">
            <Button size="lg" className="px-6">
              無料でセットアップ
            </Button>
          </Link>
          <a
            href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fpostcabinets-jp%2Ffeedback-board&env=NEXT_PUBLIC_SUPABASE_URL,NEXT_PUBLIC_SUPABASE_ANON_KEY&project-name=feedback-board"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline" size="lg" className="px-6">
              Vercelにデプロイ
            </Button>
          </a>
        </div>
      </section>

      {/* Demo visual */}
      <section className="max-w-5xl mx-auto px-4 pb-20">
        <div className="border border-neutral-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="bg-neutral-100 border-b border-neutral-200 flex items-center gap-1.5 px-4 py-3">
            <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
            <div className="mx-auto text-xs text-neutral-400 font-mono">your-app.vercel.app/b/your-product</div>
          </div>
          <div className="bg-white p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-neutral-900">フィードバック一覧</h3>
              <div className="flex items-center gap-2">
                <span className="text-xs text-neutral-400 bg-neutral-100 rounded px-2 py-1">すべて</span>
                <span className="text-xs text-neutral-400 bg-neutral-100 rounded px-2 py-1">投票数順</span>
              </div>
            </div>
            <div className="space-y-2">
              {[
                { title: 'Slack連携を追加してほしい', votes: 42, status: '計画済み', statusColor: 'bg-blue-50 text-blue-700 border-blue-200', category: 'Integration' },
                { title: 'CSVエクスポート機能', votes: 38, status: '検討中', statusColor: 'bg-yellow-50 text-yellow-700 border-yellow-200', category: 'Feature Request' },
                { title: 'ダークモード対応', votes: 31, status: 'Open', statusColor: 'bg-neutral-100 text-neutral-600 border-neutral-200', category: 'Improvement' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-3 border border-neutral-100 rounded-xl">
                  <div className="flex flex-col items-center min-w-[44px] bg-neutral-50 border border-neutral-200 rounded-lg py-1.5 px-2">
                    <ChevronUp className="w-3 h-3 text-neutral-400" />
                    <span className="text-xs font-bold text-neutral-700">{item.votes}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-neutral-900">{item.title}</p>
                    <span className="text-xs text-neutral-400">{item.category}</span>
                  </div>
                  <span className={`text-xs border rounded px-1.5 py-0.5 ${item.statusColor}`}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-neutral-100 bg-neutral-50">
        <div className="max-w-5xl mx-auto px-4 py-20">
          <h2 className="text-2xl font-bold text-neutral-900 text-center mb-3">
            Cannyが有料で提供する機能をOSSで
          </h2>
          <p className="text-neutral-500 text-center mb-12 text-sm">
            $79/moを払う必要はありません
          </p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: ChevronUp,
                title: '投票システム',
                desc: '1ユーザー1票。ログイン済みユーザーが投票でき、取り消しも可能。人気順で優先順位が一目でわかる。',
              },
              {
                icon: Map,
                title: '公開ロードマップ',
                desc: '計画済み・進行中・完了のKanbanボードを外部公開。ユーザーに透明性を提供。',
              },
              {
                icon: LayoutDashboard,
                title: '管理ダッシュボード',
                desc: 'ステータス変更、フィルタリング、投稿一覧。ボードは無制限に作成可能。',
              },
              {
                icon: GitMerge,
                title: '重複マージ',
                desc: '同内容のリクエストをマージして投票数を統合。フィードバックの散乱を防ぐ。',
              },
              {
                icon: MessageSquare,
                title: 'コメントスレッド',
                desc: 'ユーザーと管理者が対話できるコメント機能。管理者コメントは青バッジで区別。',
              },
              {
                icon: Shield,
                title: 'RLS完全対応',
                desc: 'Supabase Row Level Securityで全テーブル保護。クロスユーザーアクセスは不可能。',
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white border border-neutral-200 rounded-2xl p-5">
                <div className="w-8 h-8 bg-neutral-900 rounded-lg flex items-center justify-center mb-3">
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <h3 className="font-semibold text-neutral-900 mb-1.5">{title}</h3>
                <p className="text-sm text-neutral-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Deploy section */}
      <section className="max-w-5xl mx-auto px-4 py-20">
        <div className="bg-neutral-900 rounded-3xl p-10 text-center">
          <div className="inline-flex items-center gap-1.5 bg-neutral-800 text-neutral-300 text-xs rounded-full px-3 py-1 mb-4">
            <Zap className="w-3.5 h-3.5" />
            5分でデプロイ完了
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            今すぐセルフホストを始める
          </h2>
          <p className="text-neutral-400 mb-8 text-sm max-w-md mx-auto">
            Supabaseプロジェクト + Vercelアカウントがあれば即日運用開始。
            クレジットカード不要。
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fpostcabinets-jp%2Ffeedback-board&env=NEXT_PUBLIC_SUPABASE_URL,NEXT_PUBLIC_SUPABASE_ANON_KEY&project-name=feedback-board"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white text-neutral-900 font-semibold text-sm rounded-xl px-5 py-2.5 hover:bg-neutral-100 transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 76 76" fill="none">
                <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" fill="black" />
              </svg>
              Deploy with Vercel
            </a>
            <a
              href="https://github.com/postcabinets-jp/feedback-board"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-neutral-700 text-neutral-300 text-sm rounded-xl px-5 py-2.5 hover:border-neutral-600 hover:text-white transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
              GitHub
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-200 py-8">
        <div className="max-w-5xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-neutral-900 rounded flex items-center justify-center">
              <MessageSquare className="w-3 h-3 text-white" />
            </div>
            <span className="text-sm text-neutral-500">Feedback Board</span>
          </div>
          <div className="flex items-center gap-4 text-xs text-neutral-400">
            <a href="https://github.com/postcabinets-jp/feedback-board" target="_blank" rel="noopener noreferrer" className="hover:text-neutral-600">
              GitHub
            </a>
            <span>MIT License</span>
            <a href="https://postcabinets.co.jp" target="_blank" rel="noopener noreferrer" className="hover:text-neutral-600">
              POST CABINETS
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
