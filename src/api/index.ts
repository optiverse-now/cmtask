import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import projectRoutes from './routes/project'
import taskRoutes from './routes/task'
import userRoutes from './routes/user'

const app = new Hono()

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
app.route('/api/projects', projectRoutes)
app.route('/api/tasks', taskRoutes)
app.route('/api/users', userRoutes)

// ヘルスチェック
app.get('/health', (c) => c.json({ status: 'ok', env: process.env.APP_ENV }))

export default app