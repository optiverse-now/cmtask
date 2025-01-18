import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import projectRoutes from './routes/project'
import taskRoutes from './routes/task'
import { authMiddleware } from './middleware/auth'
const app = new Hono()

// CORSミドルウェアを最初に適用
app.use('*', cors({
  origin: [
    'http://localhost:3000',
    'https://dev.optiverse-now.com',
    'https://optiverse-now.com'
  ],
  credentials: true,
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}))

// ログミドルウェアの設定
app.use('*', logger())

// 認証ミドルウェアをAPIルートに適用
app.use('/api/*', authMiddleware)

// ルートの設定
app.route('/api/projects', projectRoutes)
app.route('/api/tasks', taskRoutes)

// ヘルスチェック
app.get('/health', (c) => c.json({ status: 'ok', env: process.env.APP_ENV }))

// サーバーの起動
const port = process.env.API_PORT || 8000

serve({
  fetch: app.fetch,
  port: Number(port),
})