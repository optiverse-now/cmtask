-- 認証ロールの権限設定
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO authenticated;

GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON SCHEMA public TO authenticated;

-- すべての既存テーブルに対する権限を付与
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO authenticated;

-- anon（未認証ユーザー）にも最小限の権限を付与
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;

-- RLSポリシーの再設定
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- ユーザーテーブルのポリシー
CREATE POLICY "ユーザーは自分のデータのみ参照可能" ON users
    FOR SELECT
    USING (auth.uid()::text = id::text);

CREATE POLICY "ユーザーは自分のデータのみ更新可能" ON users
    FOR UPDATE
    USING (auth.uid()::text = id::text);

CREATE POLICY "ユーザーは自分のデータのみ挿入可能" ON users
    FOR INSERT
    WITH CHECK (auth.uid()::text = id::text);

-- 開発環境用の特別なポリシー（より緩い制約）
CREATE POLICY "開発環境での全体アクセス" ON users
    FOR ALL
    USING (current_setting('app.environment', true) = 'development'); 