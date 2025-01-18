// SupabaseのサーバーサイドクライアントとNext.jsのミドルウェア関連の型をインポート
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export const createClient = (request: NextRequest) => {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string) {
          request.cookies.set(name, value)
        },
        remove(name: string) {
          request.cookies.delete(name)
        },
      },
    }
  )

  return supabase
}

// セッションを更新するミドルウェア関数
export async function updateSession(request: NextRequest) {
  // 次のミドルウェアに渡すレスポンスを作成
  const supabaseResponse = NextResponse.next({
    request,
  });

  // Supabaseのサーバークライアントを初期化
  // 環境変数からURLとアノニマスキーを取得
  const supabase = createClient(request);

  // 警告: createServerClientとsupabase.auth.getUser()の間にコードを書かないこと
  // セッション管理に問題が発生する可能性があります

  // 現在のユーザー情報を取得
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // ユーザーが未ログインで、かつログイン関連のページ以外にアクセスした場合
  if (
    !user &&
    !request.nextUrl.pathname.startsWith("/login") &&
    !request.nextUrl.pathname.startsWith("/auth")
  ) {
    // ログインページにリダイレクト
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    return NextResponse.redirect(url);
  }

  // 重要: セッション管理のため、supabaseResponseを必ず返す必要があります
  // カスタムレスポンスを作成する場合は以下の点に注意:
  // 1. リクエストを含める
  // 2. クッキーを正しくコピー
  // 3. クッキー以外の部分のみ変更
  // これを守らないとセッションが予期せず終了する可能性があります

  return supabaseResponse;
}
