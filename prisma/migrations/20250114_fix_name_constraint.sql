-- nameカラムのNULL制約を削除
ALTER TABLE users ALTER COLUMN name DROP NOT NULL; 