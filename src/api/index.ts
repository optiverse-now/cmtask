import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { handle } from 'hono/vercel'
import projectRoutes from './routes/project.js'
import taskRoutes from './routes/task.js'
import userRoutes from './routes/user.js'

export const runtime = 'edge'

const app = new Hono().basePath('/api')

// グローバルエラーハンドラー
app.onError((err, c) => {
  console.error('Unhandled error:', err)
  return c.json({ error: 'Internal Server Error' }, 500)
})

// プリフライトリクエストの処理
app.options('*', (c) => {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': c.req.header('Origin') || 'https://dev.optiverse-now.com',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Max-Age': '86400',
      'Access-Control-Expose-Headers': 'Authorization'
    }
  })
})

// CORSの設定
app.use('*', async (c, next) => {
  const origin = c.req.header('Origin') || 'https://dev.optiverse-now.com'
  c.header('Access-Control-Allow-Origin', origin)
  c.header('Access-Control-Allow-Credentials', 'true')
  c.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  c.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')
  c.header('Access-Control-Expose-Headers', 'Authorization')
  
  // 認証チェック
  const authHeader = c.req.header('Authorization')
  console.log('=== Auth Check Start ===')
  console.log('Path:', c.req.path)
  console.log('Auth Header:', authHeader ? 'exists' : 'missing')
  
  if (authHeader) {
    const [authType, token] = authHeader.split(' ')
    console.log('Auth Type:', authType)
    console.log('Token Length:', token?.length)
    
    try {
      // トークンの形式チェック
      if (authType !== 'Bearer') {
        throw new Error('Invalid authorization type')
      }
      
      if (!token) {
        throw new Error('Token is missing')
      }

      // トークンの検証に関する詳細なログ
      console.log('Token Validation:', {
        path: c.req.path,
        method: c.req.method,
        tokenExists: !!token,
        tokenLength: token.length,
        requestUserId: new URL(c.req.url).searchParams.get('userId')
      })

    } catch (error: unknown) {
      console.error('Token Validation Error:', error instanceof Error ? error.message : 'Unknown error')
      return c.json({ 
        error: 'Unauthorized',
        details: error instanceof Error ? error.message : 'Unknown error',
        path: c.req.path,
        method: c.req.method,
        authType,
        tokenPresent: !!token
      }, 401)
    }
  }

  if (!authHeader && c.req.path !== '/health') {
    console.log('Auth Check Failed: No Authorization header')
    return c.json({ 
      error: 'Unauthorized',
      details: 'Authorization header is required',
      path: c.req.path,
      method: c.req.method
    }, 401)
  }
  
  await next()
})

app.use('*', logger())

// APIルート
app.route('/projects', projectRoutes)
app.route('/tasks', taskRoutes)
app.route('/users', userRoutes)

// ヘルスチェック
app.get('/health', (c) => c.json({ status: 'ok', env: process.env.APP_ENV }))

const handler = handle(app)
export { 
  handler as GET,
  handler as POST,
  handler as PUT,
  handler as DELETE,
  handler as PATCH,
  handler as OPTIONS
}