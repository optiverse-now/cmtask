# アプリ概要
各個人のやるべきことを明らかにして目標を達成し自己実現をサポートする

# 今後の実装機能
- ユーザー認証
- DBとの連携
- タスク作成AIエージェントの搭載

# Staging環境
npx dotenv -e .env.staging -- npx prisma migrate deploy

# Production環境
npx dotenv -e .env.production -- npx prisma migrate deploy