-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "ユーザーは自分のデータを参照可能" ON users
    FOR SELECT
    USING (auth.uid()::text = id::text);

CREATE POLICY "ユーザーは自分のデータを更新可能" ON users
    FOR UPDATE
    USING (auth.uid()::text = id::text);

CREATE POLICY "ユーザーは自分のデータを挿入可能" ON users
    FOR INSERT
    WITH CHECK (auth.uid()::text = id::text);

-- Grant permissions to authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Grant permissions to anon users (必要最小限)
GRANT USAGE ON SCHEMA public TO anon;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon; 