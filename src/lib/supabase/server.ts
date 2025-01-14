import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";

export function createClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          const cookie: RequestCookie | undefined = cookies().get(name) as
            | RequestCookie
            | undefined;
          return cookie?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          cookies().set(name, value, {
            ...options,
            secure: process.env.NEXT_PUBLIC_ENV === "production",
          });
        },
        remove(name: string) {
          cookies().delete(name);
        },
      },
    },
  );
}
