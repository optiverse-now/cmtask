import { User, Session } from "@supabase/supabase-js";

export interface AuthFormData {
  email: string;
  password: string;
}

export interface AuthError {
  message: string;
}

export interface AuthState {
  isLoading: boolean;
  error: AuthError | null;
}

export interface AuthResponse {
  error: AuthError | null;
  data: {
    user: User | null;
    session: Session | null;
  } | null;
}
