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
    
    // セッションの取得と有効性確認
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession()

    if (sessionError) {
      console.error('Session error:', sessionError)
      throw sessionError
    }

    const pathname = request.nextUrl.pathname

    // 認証ページにいる場合の処理
    if (authRoutes.some(route => pathname.startsWith(route))) {
      if (session?.user) {
        return NextResponse.redirect(new URL('/applications/taskmaker', request.url))
      }
      return res
    }

    // 保護されたルートへのアクセス処理
    if (protectedRoutes.some(route => pathname.startsWith(route))) {
      // セッションが存在しない、または無効な場合
      if (!session?.user || !session?.access_token) {
        console.warn('Unauthorized access attempt to:', pathname)
        const redirectUrl = new URL('/auth/login', request.url)
        redirectUrl.searchParams.set('redirectTo', pathname)
        return NextResponse.redirect(redirectUrl)
      }
      
      // セッションの有効性を確認
      const { data: { user }, error: userError } = await supabase.auth.getUser(session.access_token)
      
      if (userError || !user) {
        console.warn('Invalid session detected:', userError)
        const redirectUrl = new URL('/auth/login', request.url)
        redirectUrl.searchParams.set('redirectTo', pathname)
        return NextResponse.redirect(redirectUrl)
      }
    }

    // セッションの更新
    if (session) {
      res.headers.set('x-middleware-cache', 'no-cache')
    }

    return res
  } catch (error) {
    console.error('Middleware error:', error)
    const redirectUrl = new URL('/auth/login', request.url)
    return NextResponse.redirect(redirectUrl)
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
    '/((?!_next/static|_next/image|favicon.ico|public|api).*)',
  ],
}
