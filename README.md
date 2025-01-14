# アプリ概要
各個人のやるべきことを明らかにして目標を達成し自己実現をサポートする

# 技術スタック
- Next.js
- TailwindCSS
- TypeScript
- Prisma
- Supabase
- Vercel

# 今後の実装機能
- taskをdbで保存
- ユーザー認証
- タスク作成AIエージェントの搭載

# DB
## dockerでsupabase環境を構築
`supabase start`

##  開発環境（development）
**マイグレーション実行** <br>
`npm run db:migrate:dev`

**Prisma Studio起動** <br>
`npm run db:studio:dev`

## ステージング環境（staging）
**マイグレーション実行** <br>
`npm run db:migrate:staging`

**Prisma Studio起動** <br>
`npm run db:studio:staging`


## 本番環境（production）
**マイグレーション実行** <br>
`npm run db:migrate:prod`

**Prisma Studio起動** <br>
`npm run db:studio:prod`

## Prisma Studioの起動方法
`npm run db:studio:dev` <br>
[Supabase Studio](http://127.0.0.1:54323)でテーブルが正しく作成されているか確認。
