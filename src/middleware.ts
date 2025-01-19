import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// 保護されたルートの定義
const protectedRoutes = ['/applications/taskmaker']

export async function middleware(request: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req: request, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // 保護されたルートへのアクセスで未認証の場合
  if (
    protectedRoutes.some(route => request.nextUrl.pathname.startsWith(route)) &&
    !session
  ) {
    const redirectUrl = new URL('/auth/login', request.url)
    return NextResponse.redirect(redirectUrl)
  }

  return res
}

// ミドルウェアを適用するパスの設定
export const config = {
  matcher: ['/applications/:path*']
}
