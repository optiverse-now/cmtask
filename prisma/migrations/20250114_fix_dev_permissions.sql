-- 既存のポリシーを削除
DROP POLICY IF EXISTS "ユーザーは自分のデータのみ参照可能" ON users;
DROP POLICY IF EXISTS "ユーザーは自分のデータのみ更新可能" ON users;
DROP POLICY IF EXISTS "ユーザーは自分のデータのみ挿入可能" ON users;
DROP POLICY IF EXISTS "開発環境での全体アクセス" ON users;

-- 開発環境用の緩いポリシーを作成
CREATE POLICY "開発環境用全アクセス許可" ON users FOR ALL USING (true);

-- 認証ユーザーに必要な権限を付与
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;

-- 未認証ユーザーに最小限の権限を付与
GRANT USAGE ON SCHEMA public TO anon;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon; 