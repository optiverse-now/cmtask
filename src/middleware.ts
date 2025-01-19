import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// 保護されたルートの定義
const protectedRoutes = ['/applications/taskmaker']

export async function middleware(request: NextRequest) {
  // セッションの確認
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )

  const { data: { session } } = await supabase.auth.getSession()

  // 保護されたルートへのアクセスで未認証の場合
  if (
    protectedRoutes.some(route => request.nextUrl.pathname.startsWith(route)) &&
    !session
  ) {
    const redirectUrl = new URL('/auth/login', request.url)
    return NextResponse.redirect(redirectUrl)
  }

  return NextResponse.next()
}

// ミドルウェアを適用するパスの設定
export const config = {
  matcher: ['/applications/:path*']
}
