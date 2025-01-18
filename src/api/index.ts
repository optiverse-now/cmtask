import { Hono } from 'hono'
import { logger } from 'hono/logger'
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
app.use('*', async (c, next) => {
  const origin = c.req.header('Origin')
  const allowedOrigins = [
    'http://localhost:3000',
    'https://dev.optiverse-now.com',
    'https://optiverse-now.com',
    'https://api-dev.optiverse-now.com'
  ]

  if (origin && allowedOrigins.includes(origin)) {
    c.header('Access-Control-Allow-Origin', origin)
    c.header('Access-Control-Allow-Credentials', 'true')
    c.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    c.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')
    c.header('Access-Control-Max-Age', '86400')

    // プリフライトリクエストの場合
    if (c.req.method === 'OPTIONS') {
      return new Response(null, { status: 204 })
    }
  }

  await next()
})

app.use('*', logger())

// APIルート
app.route('/api/projects', projectRoutes)
app.route('/api/tasks', taskRoutes)
app.route('/api/users', userRoutes)

// ヘルスチェック
app.get('/api/health', (c) => c.json({ status: 'ok', env: process.env.APP_ENV }))

// Vercel用のハンドラー関数をエクスポート
const handler = handle(app)
export const GET = handler
export const POST = handler
export const PUT = handler
export const DELETE = handler
export const PATCH = handler
export const OPTIONS = handler