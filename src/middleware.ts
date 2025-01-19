import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// 保護されたルートの定義
const protectedRoutes = ['/applications/taskmaker']
const authRoutes = ['/auth/login', '/auth/signup']

export async function middleware(request: NextRequest) {
  try {
    // レスポンスの作成
    const res = NextResponse.next()
    
    // Supabaseクライアントの作成
    const supabase = createMiddlewareClient({ req: request, res })
    
    // セッションの取得
    const {
      data: { session },
    } = await supabase.auth.getSession()

    const pathname = request.nextUrl.pathname

    // 認証ページにいる場合、すでにログインしていればアプリケーションページにリダイレクト
    if (authRoutes.some(route => pathname.startsWith(route)) && session) {
      return NextResponse.redirect(new URL('/applications/taskmaker', request.url))
    }

    // 保護されたルートへのアクセスで未認証の場合
    if (protectedRoutes.some(route => pathname.startsWith(route)) && !session) {
      // リダイレクト用URLの作成
      const redirectUrl = new URL('/auth/login', request.url)
      redirectUrl.searchParams.set('redirectTo', pathname)
      return NextResponse.redirect(redirectUrl)
    }

    return res
  } catch (error) {
    // エラーが発生した場合は、安全のためログインページにリダイレクト
    console.error('Middleware error:', error)
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }
}

// ミドルウェアを適用するパスの設定
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}
