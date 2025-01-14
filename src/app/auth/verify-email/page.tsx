export default function VerifyEmailPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-6 shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            メールを確認してください
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            登録したメールアドレスに確認メールを送信しました。
            メール内のリンクをクリックして、登録を完了してください。
          </p>
        </div>
      </div>
    </div>
  );
}
