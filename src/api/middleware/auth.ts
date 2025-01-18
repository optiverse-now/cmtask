import { Context, Next } from 'hono'
import { createClient } from '@supabase/supabase-js'

declare module 'hono' {
  interface ContextVariableMap {
    userId: string
  }
}

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
)

export async function authMiddleware(c: Context, next: Next) {
  try {
    const authHeader = c.req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.error('No valid authorization header');
      return c.json({ error: 'No valid authorization header' }, 401);
    }

    const token = authHeader.split(' ')[1];
    
    // JWTの検証
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error) {
      console.error('Token verification error:', error);
      return c.json({ error: 'Invalid token', details: error.message }, 401);
    }

    if (!user) {
      console.error('No user found for token');
      return c.json({ error: 'User not found' }, 401);
    }

    // ユーザーIDをコンテキストに設定
    c.set('userId', user.id);
    
    // リクエストのユーザーIDとトークンのユーザーIDを比較
    const requestUserId = c.req.query('userId');
    if (requestUserId && requestUserId !== user.id) {
      console.error('User ID mismatch:', { tokenUserId: user.id, requestUserId });
      return c.json({ error: 'User ID mismatch' }, 403);
    }

    console.log('Auth successful:', {
      userId: user.id,
      email: user.email,
      path: c.req.path,
      method: c.req.method
    });

    await next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return c.json({ 
      error: 'Authentication failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, 401);
  }
} 