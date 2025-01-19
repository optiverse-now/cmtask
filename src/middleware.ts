// Supabaseのサーバークライアントとクッキーオプションの型、Next.jsのレスポンス/リクエスト型をインポート
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// ミドルウェア関数 - すべてのリクエストの前に実行される
export async function middleware(request: NextRequest) {
  try {
    // 現在のURLを取得
    const url = new URL(request.url)
    
    // Edge Runtimeでより確実にログを出力
    console.warn('=== Middleware Debug ===')
    console.warn(`Path: ${url.pathname}`)
    console.warn(`Timestamp: ${new Date().toISOString()}`)
    console.warn(`Headers: ${JSON.stringify([...request.headers.entries()])}`)
    console.warn('========================')

    // 次のミドルウェアに渡すレスポンスオブジェクトを作成
    const response = NextResponse.next()

    // Supabaseのサーバークライアントを初期化
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value
          },
          set(name: string, value: string, options: CookieOptions) {
            response.cookies.set({
              name,
              value,
              ...options,
            })
          },
          remove(name: string, options: CookieOptions) {
            response.cookies.set({
              name,
              value: '',
              ...options,
              maxAge: 0,
            })
          },
        },
      }
    )

    // セッション情報を取得
    const { data: { session } } = await supabase.auth.getSession()

    // セッション情報のデバッグ
    console.warn('=== Session Debug ===')
    console.warn(`Session exists: ${!!session}`)
    console.warn(`User ID: ${session?.user?.id || 'none'}`)
    console.warn(`Email: ${session?.user?.email || 'none'}`)
    console.warn('===================')

    // 保護されたルートへのアクセスチェック
    if (url.pathname.startsWith('/applications')) {
      if (!session) {
        // 未認証の場合、ログインページへリダイレクト
        return NextResponse.redirect(new URL('/auth/login', request.url))
      }
    }

    // 認証済みユーザーのログインページアクセスチェック
    if (url.pathname === '/auth/login' && session) {
      // 認証済みの場合、アプリケーションページへリダイレクト
      return NextResponse.redirect(new URL('/applications/taskmaker', request.url))
    }

    return response
  } catch (error) {
    console.error('Middleware error:', error)
    // エラーが発生した場合でもレスポンスを返す
    return NextResponse.next()
  }
}

// ミドルウェアの設定
export const config = {
  matcher: [
    /*
     * 以下を除く全てのパスにマッチ:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}