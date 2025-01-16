import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import projectRoutes from './routes/project'
import taskRoutes from './routes/task'

const app = new Hono()

// ミドルウェアの設定
app.use('*', logger())
app.use('*', cors({
  origin: ['http://localhost:3000', 'https://dev.optiverse-now.com', 'https://optiverse-now.com'],
  credentials: true,
}))

// ルートの設定
app.route('/api/projects', projectRoutes)
app.route('/api/tasks', taskRoutes)

// ヘルスチェック
app.get('/health', (c) => c.json({ status: 'ok', env: process.env.APP_ENV }))

// サーバーの起動
const port = process.env.API_PORT || 8000
console.log(`Server is running on port ${port}`)
console.log(`Environment: ${process.env.APP_ENV}`)

serve({
  fetch: app.fetch,
  port: Number(port),
})
