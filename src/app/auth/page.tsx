"use client";

import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";
import { Session, AuthChangeEvent } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

interface AuthDebug {
  session?: Session | null;
  event?: AuthChangeEvent;
}

export default function AuthPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [supabase] = useState(() => createClientComponentClient());
  const [authDebug, setAuthDebug] = useState<AuthDebug | null>(null);

  useEffect(() => {
    const initAuth = async () => {
      try {
        setIsLoading(true);
        const { data: sessionData, error: sessionError } =
          await supabase.auth.getSession();
        if (sessionError) {
          throw sessionError;
        }
        setAuthDebug(sessionData);

        // セッションが存在する場合は/applications/taskmakerにリダイレクト
        if (sessionData.session) {
          router.push("/applications/taskmaker");
          return;
        }

        setIsLoading(false);
      } catch (e) {
        console.error("認証の初期化エラー:", e);
        setError(
          e instanceof Error ? e : new Error("認証の初期化に失敗しました"),
        );
        setIsLoading(false);
      }
    };

    initAuth();

    // 認証状態の変更を監視
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event, session);
      setAuthDebug({ event, session });

      // サインイン時に/applications/taskmakerにリダイレクト
      if (event === "SIGNED_IN" && session) {
        router.push("/applications/taskmaker");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, router]);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("サインアウトエラー:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center py-2">
        <div className="w-full max-w-md text-center">読み込み中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center py-2">
        <div className="w-full max-w-md text-center text-red-500">
          エラーが発生しました: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2 bg-gray-50">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        {authDebug?.session && (
          <div className="mb-4">
            <p className="text-sm text-gray-600">
              現在のユーザー: {authDebug.session.user?.email}
            </p>
            <button
              onClick={handleSignOut}
              className="text-sm text-blue-500 hover:text-blue-600"
            >
              サインアウト
            </button>
          </div>
        )}
        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: "#3b82f6",
                  brandAccent: "#2563eb",
                  inputBackground: "white",
                  inputText: "black",
                  inputPlaceholder: "#9ca3af",
                  inputBorder: "#e5e7eb",
                  inputBorderHover: "#3b82f6",
                  inputBorderFocus: "#2563eb",
                },
                space: {
                  inputPadding: "0.5rem 0.75rem",
                  buttonPadding: "0.5rem 1rem",
                },
                radii: {
                  buttonBorderRadius: "0.375rem",
                  inputBorderRadius: "0.375rem",
                },
                borderWidths: {
                  buttonBorderWidth: "1px",
                  inputBorderWidth: "1px",
                },
              },
            },
            className: {
              container: "auth-container",
              label: "text-gray-700 font-medium",
              button:
                "bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition-colors",
              input:
                "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
            },
          }}
          providers={[]}
          redirectTo={`${location.origin}/auth/callback`}
          localization={{
            variables: {
              sign_up: {
                email_label: "メールアドレス",
                password_label: "パスワード",
                button_label: "新規登録",
                loading_button_label: "登録中...",
                social_provider_text: "{{provider}}で続ける",
                link_text: "アカウントをお持ちでない方",
                confirmation_text: "確認メールを送信しました",
              },
              sign_in: {
                email_label: "メールアドレス",
                password_label: "パスワード",
                button_label: "ログイン",
                loading_button_label: "ログイン中...",
                social_provider_text: "{{provider}}で続ける",
                link_text: "すでにアカウントをお持ちの方",
              },
              forgotten_password: {
                link_text: "パスワードをお忘れの方",
                button_label: "パスワードをリセット",
                loading_button_label: "送信中...",
                confirmation_text: "パスワードリセット用のメールを送信しました",
              },
            },
          }}
        />
      </div>
    </div>
  );
}
