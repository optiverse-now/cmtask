import { createClient } from '@/utils/supabase/middleware'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const protectedPaths = ['/applications']

export async function middleware(request: NextRequest) {
  try {
    // 保護されたパスかどうかをチェック
    const isProtectedPath = protectedPaths.some(path => 
      request.nextUrl.pathname.startsWith(path)
    )

    if (!isProtectedPath) {
      return NextResponse.next()
    }

    // Supabaseクライアントの初期化
    const supabase = createClient(request)

    // セッションの取得
    const { data: { session } } = await supabase.auth.getSession()

    // 未認証の場合、ログインページにリダイレクト
    if (!session) {
      const redirectUrl = new URL('/auth/login', request.url)
      redirectUrl.searchParams.set('redirectedFrom', request.nextUrl.pathname)
      return NextResponse.redirect(redirectUrl)
    }

    return NextResponse.next()
  } catch (error) {
    console.error('Middleware error:', error)
    // エラーが発生した場合もログインページにリダイレクト
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }
}

export const config = {
  matcher: [
    /*
     * 認証が必要なパスのマッチパターン
     * - /applications以下のすべてのパス
     */
    '/applications/:path*',
  ],
}
