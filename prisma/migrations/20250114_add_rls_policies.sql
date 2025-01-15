-- Enable RLS for all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE short_term_memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE mid_term_memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE long_term_memories ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "ユーザーは自分のデータのみ参照可能" ON users
    FOR SELECT
    USING (auth.uid()::text = id::text);

CREATE POLICY "ユーザーは自分のデータのみ更新可能" ON users
    FOR UPDATE
    USING (auth.uid()::text = id::text);

CREATE POLICY "ユーザーは自分のデータのみ挿入可能" ON users
    FOR INSERT
    WITH CHECK (auth.uid()::text = id::text);

-- Projects policies
CREATE POLICY "ユーザーは自分のプロジェクトのみ参照可能" ON projects
    FOR SELECT
    USING (auth.uid()::text = user_id::text);

CREATE POLICY "ユーザーは自分のプロジェクトのみ更新可能" ON projects
    FOR ALL
    USING (auth.uid()::text = user_id::text);

-- Tasks policies
CREATE POLICY "ユーザーは自分のタスクのみ参照可能" ON tasks
    FOR SELECT
    USING (auth.uid()::text = user_id::text);

CREATE POLICY "ユーザーは自分のタスクのみ更新可能" ON tasks
    FOR ALL
    USING (auth.uid()::text = user_id::text);

-- Chats policies
CREATE POLICY "ユーザーは自分のチャットのみ参照可能" ON chats
    FOR SELECT
    USING (auth.uid()::text = user_id::text);

CREATE POLICY "ユーザーは自分のチャットのみ更新可能" ON chats
    FOR ALL
    USING (auth.uid()::text = user_id::text);

-- Memories policies
CREATE POLICY "ユーザーは関連する短期メモリのみ参照可能" ON short_term_memories
    FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM chats
        WHERE chats.id = short_term_memories.chat_id
        AND chats.user_id::text = auth.uid()::text
    ));

CREATE POLICY "ユーザーは関連する短期メモリのみ更新可能" ON short_term_memories
    FOR ALL
    USING (EXISTS (
        SELECT 1 FROM chats
        WHERE chats.id = short_term_memories.chat_id
        AND chats.user_id::text = auth.uid()::text
    ));

CREATE POLICY "ユーザーは関連する中期メモリのみ参照可能" ON mid_term_memories
    FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM chats
        WHERE chats.id = mid_term_memories.chat_id
        AND chats.user_id::text = auth.uid()::text
    ));

CREATE POLICY "ユーザーは関連する中期メモリのみ更新可能" ON mid_term_memories
    FOR ALL
    USING (EXISTS (
        SELECT 1 FROM chats
        WHERE chats.id = mid_term_memories.chat_id
        AND chats.user_id::text = auth.uid()::text
    ));

CREATE POLICY "ユーザーは関連する長期メモリのみ参照可能" ON long_term_memories
    FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM chats
        WHERE chats.id = long_term_memories.chat_id
        AND chats.user_id::text = auth.uid()::text
    ));

CREATE POLICY "ユーザーは関連する長期メモリのみ更新可能" ON long_term_memories
    FOR ALL
    USING (EXISTS (
        SELECT 1 FROM chats
        WHERE chats.id = long_term_memories.chat_id
        AND chats.user_id::text = auth.uid()::text
    )); 