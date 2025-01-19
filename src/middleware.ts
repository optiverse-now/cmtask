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
  // 環境変数からURLと認証キーを取得
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      // クッキーの操作方法を定義
      cookies: {
        // クッキーの取得 - 指定された名前のクッキー値を返す
        get(name: string) {
          return request.cookies.get(name)?.value
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

  if (!session) {
    // 未認証の場合は /auth/login にリダイレクト
    const redirectUrl = new URL('/auth/login', request.url)
    return NextResponse.redirect(redirectUrl)
  }

  // 認証済みで /auth/login にアクセスした場合は /applications/taskmaker にリダイレクト
  if (request.nextUrl.pathname === '/auth/login') {
    const redirectUrl = new URL('/applications/taskmaker', request.url) 
    return NextResponse.redirect(redirectUrl)
  }

  // 処理済みのレスポンスを返す
  return response
}

// ミドルウェアの設定
export const config = {
  // どのパスでミドルウェアを実行するかを指定
  matcher: [
    /*
     * 以下で始まるパス以外のすべてのリクエストパスに対してミドルウェアを実行:
     * - _next/static (静的ファイル)
     * - _next/image (画像最適化ファイル)
     * - favicon.ico (ファビコン)
     * 必要に応じてこのパターンを修正して、より多くのパスを含めることができます。
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}