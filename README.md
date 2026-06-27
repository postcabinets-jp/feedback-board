# Feedback Board

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fpostcabinets-jp%2Ffeedback-board&env=NEXT_PUBLIC_SUPABASE_URL,NEXT_PUBLIC_SUPABASE_ANON_KEY&project-name=feedback-board)

**Cannyの代替オープンソース。** 機能要望の収集・投票・優先順位付け・ロードマップ管理をセルフホストで。

> Cannyは$79/mo〜。Feedback Boardは無制限・無料・完全コントロール。

## Features

- **投票システム** — 1ユーザー1票。投票取り消し可。投票数順に自動ソート
- **公開ロードマップ** — 計画済み・進行中・完了のKanban形式で外部公開
- **ステータス管理** — Open → 検討中 → 計画済み → 進行中 → 完了
- **管理ダッシュボード** — ステータス一括変更、フィルタリング、検索
- **重複マージ** — 同内容リクエストをマージして投票数を統合
- **コメントスレッド** — ユーザーと管理者の対話。管理者は青バッジで区別
- **ボード無制限** — プロジェクトごとに複数ボードを作成可能
- **Supabase RLS** — 全テーブルにRow Level Security適用

## Quick Start

### 1. Supabaseプロジェクトを作成

[supabase.com](https://supabase.com) でプロジェクトを作成し、URLとAnon Keyを控える。

### 2. データベースをセットアップ

Supabase SQL Editorで `supabase/migrations/001_initial_schema.sql` を実行する。

### 3. Vercelにデプロイ

上の「Deploy with Vercel」ボタンをクリックし、環境変数を設定する。

または手動でデプロイ:

```bash
git clone https://github.com/postcabinets-jp/feedback-board
cd feedback-board
cp .env.example .env.local
# .env.localにSupabase URLとキーを入力
npm install
npm run dev
```

### 環境変数

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

## Pages

| Path | Description | Auth Required |
|------|-------------|---------------|
| `/` | ランディングページ | No |
| `/login` `/register` | 認証 | No |
| `/dashboard` | ボード管理 | Yes |
| `/dashboard/[boardId]` | 投稿管理・ステータス変更 | Yes |
| `/b/[slug]` | 公開ボード（投票・投稿） | No (投票はログイン必要) |
| `/b/[slug]/roadmap` | 公開ロードマップ | No |

## Tech Stack

- **Next.js 16** (App Router, TypeScript strict)
- **Supabase** (PostgreSQL + Auth + RLS)
- **Tailwind CSS v4 + shadcn/ui** (base-ui)
- **Vercel** deployment

## Database Schema

- `profiles` — ユーザープロファイル (auth.usersを拡張)
- `boards` — フィードバックボード
- `posts` — 機能リクエスト・バグ報告
- `votes` — 投票 (post_id + user_id の一意制約)
- `comments` — コメントスレッド

全テーブルにRLS適用済み。

## License

MIT

---

Built by [POST CABINETS](https://postcabinets.co.jp)
