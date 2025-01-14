import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

export function createClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          const cookieStore = cookies();
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          const cookieStore = cookies();
          cookieStore.set(name, value, {
            ...options,
            secure: process.env.NEXT_PUBLIC_ENV === "production",
          });
        },
        remove(name: string) {
          const cookieStore = cookies();
          cookieStore.delete(name);
        },
      },
    },
  );
}
