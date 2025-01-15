import Link from "next/link";

export default function CheckEmailPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-6 shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            メールを確認してください
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            パスワードリセット用のリンクを送信しました。
            メール内のリンクをクリックして、新しいパスワードを設定してください。
          </p>
          <div className="mt-6 text-center">
            <Link
              href="/auth/login"
              className="text-indigo-600 hover:text-indigo-500"
            >
              ログインページに戻る
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
