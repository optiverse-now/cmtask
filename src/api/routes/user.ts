import { Hono } from 'hono';
import { prisma } from '../lib/prisma.js';
import { authMiddleware } from '../middleware/auth.js';
import { createClient } from '@supabase/supabase-js';
import { Prisma } from '@prisma/client';

const app = new Hono();

// Supabaseクライアントの初期化
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

app.post('/', async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return c.json({ error: '認証ヘッダーが不正です' }, 401);
    }

    const token = authHeader.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      console.error('Auth error:', authError);
      return c.json({ error: '認証トークンが無効です' }, 401);
    }

    const body = await c.req.json();
    const { id, email } = body;

    if (!id || !email) {
      return c.json({ error: 'IDとメールアドレスは必須です' }, 400);
    }

    // トークンのユーザーIDと作成しようとしているユーザーIDが一致することを確認
    if (user.id !== id) {
      return c.json({ error: 'ユーザーIDが一致しません' }, 403);
    }

    const newUser = await prisma.user.create({
      data: {
        id,
        email,
      },
    });

    return c.json(newUser, 201);
  } catch (error) {
    console.error('Error creating user:', error);
    
    // Prismaのエラーをより詳細に処理
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return c.json({ error: 'このメールアドレスは既に使用されています' }, 400);
      }
      if (error.code === 'P2003') {
        return c.json({ error: '外部キー制約エラー: ユーザーIDが無効です' }, 400);
      }
    }
    
    return c.json({ error: 'ユーザーの作成に失敗しました' }, 500);
  }
});

// ユーザー情報の取得
app.get('/:id', authMiddleware, async (c) => {
  try {
    const { id } = c.req.param();
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return c.json({ error: 'User not found' }, 404);
    }

    return c.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    return c.json({ error: 'Failed to fetch user' }, 500);
  }
});

export default app; 