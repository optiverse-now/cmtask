-- password_hashカラムを削除
ALTER TABLE users DROP COLUMN IF EXISTS password_hash; 