// Supabaseのサーバークライアントとクッキーオプションの型、Next.jsのレスポンス/リクエスト型をインポート
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// ミドルウェア関数 - すべてのリクエストの前に実行される
export async function middleware(request: NextRequest) {
  // 次のミドルウェアに渡すレスポンスオブジェクトを作成
  // リクエストヘッダーを維持したまま新しいレスポンスを生成
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Supabaseのサーバークライアントを初期化
  console.log('Middleware is executing for path:', request.nextUrl.pathname)
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      // クッキーの操作方法を定義
      cookies: {
        get(name: string) {
          const cookie = request.cookies.get(name)
          console.log(`Cookie ${name}:`, cookie?.value)
          return cookie?.value
        },
        // クッキーの設定 - 名前、値、オプションを指定してクッキーを設定
        set(name: string, value: string, options: CookieOptions) {
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        // クッキーの削除 - 指定されたクッキーを無効化（maxAge=0に設定）
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

  // 現在のセッション情報を取得（認証状態の確認）
  const { data: { session } } = await supabase.auth.getSession()
  
  console.log('Full session data:', session)
  console.log('Current path:', request.nextUrl.pathname)
  console.log('Session status:', session ? 'Authenticated' : 'Not authenticated')
  console.log('Request URL:', request.url)
  console.log('All Cookies:', request.cookies.getAll())

  if (!session) {
    console.log('No session detected, should redirect to login')
    const redirectUrl = new URL('/auth/login', request.url)
    console.log('Redirect URL:', redirectUrl.toString())
    return NextResponse.redirect(redirectUrl)
  }

  // 認証済みで /auth/login にアクセスした場合は /applications/taskmaker にリダイレクト
  if (request.nextUrl.pathname === '/auth/login') {
    return NextResponse.redirect(new URL('/applications/taskmaker', request.url))
  }

  // 処理済みのレスポンスを返す
  return response
}

// ミドルウェアの設定
export const config = {
  // どのパスでミドルウェアを実行するかを指定
  matcher: [
    '/applications/:path*',  // applicationsディレクトリ配下のすべてのパス
    '/auth/:path*',         // authディレクトリ配下のすべてのパス
  ],
}