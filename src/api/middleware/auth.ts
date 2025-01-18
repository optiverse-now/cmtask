import { Context, Next } from 'hono'
import { createClient } from '@supabase/supabase-js'

declare module 'hono' {
  interface ContextVariableMap {
    userId: string
  }
}

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env._SUPABASE_ANON_KEY!
)

export async function authMiddleware(c: Context, next: Next) {
  try {
    const authHeader = c.req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.error('認証ヘッダーが無効です');
      return c.json({ error: '認証ヘッダーが無効です' }, 401);
    }

    const token = authHeader.split(' ')[1];
    
    if (!token) {
      console.error('トークンが見つかりません');
      return c.json({ error: 'トークンが見つかりません' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error) {
      console.error('トークン検証エラー:', error);
      return c.json({ 
        error: 'トークンが無効です', 
        details: error.message
      }, 401);
    }

    if (!user) {
      console.error('ユーザーが見つかりません');
      return c.json({ error: 'ユーザーが見つかりません' }, 401);
    }

    c.set('userId', user.id);
    
    const requestUserId = c.req.query('userId');
    if (requestUserId && requestUserId !== user.id) {
      console.error('ユーザーIDが一致しません:', { tokenUserId: user.id, requestUserId });
      return c.json({ error: 'ユーザーIDが一致しません' }, 403);
    }

    await next();
  } catch (error) {
    console.error('認証ミドルウェアエラー:', error);
    return c.json({ 
      error: '認証に失敗しました',
      details: error instanceof Error ? error.message : '不明なエラー'
    }, 401);
  }
} 