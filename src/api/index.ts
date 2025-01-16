import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import projectRoutes from './routes/project'
import taskRoutes from './routes/task'

const app = new Hono()

// ミドルウェアの設定
app.use('*', logger())

// CORSミドルウェアを認証の前に配置
app.options('*', cors({
  origin: ['http://localhost:3000', 'https://dev.optiverse-now.com', 'https://optiverse-now.com'],
  credentials: true,
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  exposeHeaders: ['Content-Length', 'X-Requested-With'],
  maxAge: 86400,
}))

app.use('*', cors({
  origin: ['http://localhost:3000', 'https://dev.optiverse-now.com', 'https://optiverse-now.com'],
  credentials: true,
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  exposeHeaders: ['Content-Length', 'X-Requested-With'],
  maxAge: 86400,
}))

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
