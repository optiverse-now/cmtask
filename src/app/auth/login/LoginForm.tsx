'use client';

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const message = searchParams.get("message");
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      router.push("/applications/taskmaker");
      router.refresh();
    }
  };

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      {message && (
        <div className="rounded-md bg-green-50 p-4 text-sm text-green-700">
          {message}
        </div>
      )}
      {error && (
        <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}
      <div className="space-y-4 rounded-md shadow-sm">
        <div>
          <label htmlFor="email" className="sr-only">
            メールアドレス
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="relative block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            placeholder="メールアドレス"
          />
        </div>
        <div>
          <label htmlFor="password" className="sr-only">
            パスワード
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="relative block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            placeholder="パスワード"
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm">
          <Link
            href="/auth/reset-password"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            パスワードをお忘れですか？
          </Link>
        </div>
        <div className="text-sm">
          <Link
            href="/auth/signup"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            新規登録
          </Link>
        </div>
      </div>

      <div>
        <button
          type="submit"
          className="group relative flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          ログイン
        </button>
      </div>
    </form>
  );
} 