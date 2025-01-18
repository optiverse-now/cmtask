import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { cors } from 'hono/cors'
import { handle } from '@hono/node-server/vercel'
import projectRoutes from './routes/project.js'
import taskRoutes from './routes/task.js'
import userRoutes from './routes/user.js'

const app = new Hono()

// グローバルエラーハンドラー
app.onError((err, c) => {
  console.error('Unhandled error:', err)
  return c.json({ error: 'Internal Server Error' }, 500)
})

// CORSの設定
app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  maxAge: 86400,
}))

app.use('*', logger())

// APIルート
app.route('/api/projects', projectRoutes)
app.route('/api/tasks', taskRoutes)
app.route('/api/users', userRoutes)

// ヘルスチェック
app.get('/api/health', (c) => c.json({ status: 'ok', env: process.env.APP_ENV }))

// Vercel用のハンドラー関数をエクスポート
export const GET = handle(app)
export const POST = handle(app)
export const PUT = handle(app)
export const DELETE = handle(app)
export const PATCH = handle(app)
export const OPTIONS = handle(app)