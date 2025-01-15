import { AuthError } from "../types/auth";

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPassword = (password: string): boolean => {
  // 最低8文字、1つ以上の大文字、1つ以上の小文字、1つ以上の数字
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
  return passwordRegex.test(password);
};

export const getErrorMessage = (error: AuthError | null): string => {
  if (!error) return "";

  // Supabaseのエラーメッセージをユーザーフレンドリーなメッセージに変換
  switch (error.message) {
    case "Invalid login credentials":
      return "メールアドレスまたはパスワードが正しくありません";
    case "Email not confirmed":
      return "メールアドレスの確認が完了していません";
    case "User already registered":
      return "このメールアドレスは既に登録されています";
    default:
      return error.message;
  }
};
