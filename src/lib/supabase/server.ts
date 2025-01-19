import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

/* eslint-disable @typescript-eslint/no-explicit-any */
export function createClient() {
  return createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          const cookieStore = cookies() as any;
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          const cookieStore = cookies() as any;
          cookieStore.set(name, value, {
            ...options,
            secure: process.env.NEXT_PUBLIC_ENV === "production",
          });
        },
        remove(name: string) {
          const cookieStore = cookies() as any;
          cookieStore.delete(name);
        },
      },
    },
  );
}
/* eslint-enable @typescript-eslint/no-explicit-any */
