import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { handle } from '@hono/node-server/vercel'
import projectRoutes from './routes/project.js'
import taskRoutes from './routes/task.js'
import userRoutes from './routes/user.js'

const app = new Hono().basePath('/api')

// グローバルエラーハンドラー
app.onError((err, c) => {
  console.error('Unhandled error:', err)
  return c.json({ error: 'Internal Server Error' }, 500)
})

// CORSの設定
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

app.use('*', logger())

// APIルート
app.route('/projects', projectRoutes)
app.route('/tasks', taskRoutes)
app.route('/users', userRoutes)

// ヘルスチェック
app.get('/health', (c) => c.json({ status: 'ok', env: process.env.APP_ENV }))

// Vercel用のハンドラー関数をエクスポート
export const GET = handle(app)
export const POST = handle(app)
export const PUT = handle(app)
export const DELETE = handle(app)
export const PATCH = handle(app)
export const OPTIONS = handle(app)