import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// 保護されたルートの定義
const protectedRoutes = ['/applications/taskmaker']
const authRoutes = ['/auth/login', '/auth/signup']

export async function middleware(request: NextRequest) {
  try {
    const res = NextResponse.next()
    const supabase = createMiddlewareClient({ req: request, res })
    
    // セッションの取得
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession()

    const pathname = request.nextUrl.pathname

    // 認証ページにいる場合の処理
    if (authRoutes.some(route => pathname.startsWith(route))) {
      if (session?.user) {
        // 認証済みの場合は、リダイレクト先のパラメータがあればそこに、なければtaskmakerに遷移
        const redirectTo = request.nextUrl.searchParams.get('redirectTo')
        const redirectUrl = redirectTo || '/applications/taskmaker'
        return NextResponse.redirect(new URL(redirectUrl, request.url))
      }
      return res
    }

    // 保護されたルートへのアクセス処理
    if (protectedRoutes.some(route => pathname.startsWith(route))) {
      if (!session?.user) {
        // 未認証の場合は、現在のURLをリダイレクト先として保存
        const redirectUrl = new URL('/auth/login', request.url)
        redirectUrl.searchParams.set('redirectTo', pathname)
        return NextResponse.redirect(redirectUrl)
      }

      // セッションエラーがある場合
      if (sessionError) {
        console.error('Session error:', sessionError)
        const redirectUrl = new URL('/auth/login', request.url)
        redirectUrl.searchParams.set('redirectTo', pathname)
        return NextResponse.redirect(redirectUrl)
      }

      // アクセストークンの有効期限をチェック
      if (session.expires_at) {
        const expiresAt = new Date(session.expires_at * 1000)
        const now = new Date()
        
        if (expiresAt <= now) {
          console.warn('Session expired')
          const redirectUrl = new URL('/auth/login', request.url)
          redirectUrl.searchParams.set('redirectTo', pathname)
          return NextResponse.redirect(redirectUrl)
        }
      }
    }

    return res
  } catch (error) {
    console.error('Middleware error:', error)
    // エラーが発生した場合は、安全のためログインページにリダイレクト
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
     * - api (API routes)
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}
