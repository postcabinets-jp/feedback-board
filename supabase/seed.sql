-- Seed data for feedback-board
-- Note: In production, auth.users are created via Supabase Auth.
-- This seed populates demo board + posts. Profiles auto-created via trigger.

-- Demo board (owned by the first user who signs up — see README for setup)
-- Insert a sample board using a placeholder UUID that you'll replace after creating your account
-- Uncomment and replace 'YOUR_USER_ID' after signup:

/*
INSERT INTO boards (id, user_id, name, slug, description, categories, settings)
VALUES (
  'a0000000-0000-0000-0000-000000000001',
  'YOUR_USER_ID',
  'Acme Product Feedback',
  'acme-product',
  '機能リクエストやバグ報告をこちらから送ってください。チームで優先順位を管理します。',
  ARRAY['Feature Request', 'Bug Report', 'Improvement', 'Integration'],
  '{"allowAnonymous": false, "requireEmail": true}'
);

INSERT INTO posts (id, board_id, author_email, author_name, title, description, category, status, vote_count)
VALUES
  ('b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'tanaka@example.com', '田中 太郎', 'Slack連携を追加してほしい', 'ステータスが更新された際にSlackチャンネルに自動通知が来ると、チーム全員がリアルタイムで把握できます。現状はメールだけなので見落とすことが多いです。', 'Integration', 'planned', 42),
  ('b0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'sato@example.com', '佐藤 花子', 'CSVエクスポート機能', '月次レポートのために全フィードバックをCSVでエクスポートしたい。経営会議資料に使いたいが、今は手動でコピペしている。', 'Feature Request', 'under_review', 38),
  ('b0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'yamamoto@example.com', '山本 健一', 'ダークモード対応', '夜間作業が多いためダークモードが欲しい。目が疲れにくくなるし、デザイン的にも好み。', 'Improvement', 'open', 31),
  ('b0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000001', 'ito@example.com', '伊藤 美咲', '投票した機能にコメントできない', 'コメントを投稿しようとすると「投稿に失敗しました」のエラーが出る。再現手順: 1) 投票する 2) コメントフォームに記入 3) 送信を押す', 'Bug Report', 'in_progress', 28),
  ('b0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000001', 'nakamura@example.com', '中村 大輔', 'APIを公開してほしい', '社内ツールからフィードバックを自動送信したい。RESTまたはGraphQL APIがあれば既存ワークフローに組み込める。', 'Feature Request', 'open', 25),
  ('b0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000001', 'kobayashi@example.com', '小林 由美', 'モバイルアプリが欲しい', 'Webは使いにくい。iOS / Androidアプリがあればもっと気軽にフィードバックできる。', 'Feature Request', 'open', 19),
  ('b0000000-0000-0000-0000-000000000007', 'a0000000-0000-0000-0000-000000000001', 'kato@example.com', '加藤 翔', '重複リクエストのマージ機能', '同じ内容のリクエストが複数登録されると管理が大変。管理者が2つのリクエストをマージして投票数を合算できると便利。', 'Improvement', 'planned', 17),
  ('b0000000-0000-0000-0000-000000000008', 'a0000000-0000-0000-0000-000000000001', 'suzuki@example.com', '鈴木 智子', 'ログインなしで投票できるようにしてほしい', 'ゲストユーザーもメールアドレスだけで投票できれば回答率が上がると思う。登録の手間がネック。', 'Feature Request', 'open', 15),
  ('b0000000-0000-0000-0000-000000000009', 'a0000000-0000-0000-0000-000000000001', 'watanabe@example.com', '渡辺 浩', '完了した機能のロードマップ表示', '完了ステータスの機能一覧をリリースノートとして自動生成してほしい。ユーザーへの報告に使いたい。', 'Feature Request', 'complete', 22),
  ('b0000000-0000-0000-0000-000000000010', 'a0000000-0000-0000-0000-000000000001', 'matsumoto@example.com', '松本 彩', 'カスタムステータス名を設定したい', '「計画中」「進行中」ではなく独自のラベルにしたい（例: Sprint 1, Backlog, QA中）。', 'Improvement', 'open', 11);
*/
