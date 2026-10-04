// lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * SSR-aware server client.
 * Reads/writes the auth session from cookies. Use this in:
 *   - Route Handlers (app/auth/callback/route.ts, etc.)
 *   - Server Components
 *   - Server Actions
 * Must be awaited because it reads cookies().
 */
export async function getSupabaseClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY');
  }

  const cookieStore = await cookies();

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
          );
        } catch {
          // Called from a Server Component — cookie set fails silently.
          // Middleware (if you have it) will refresh the session instead.
        }
      },
    },
  });
}

/**
 * Service-role admin client.
 * Bypasses RLS. Only use server-side, never expose to the browser.
 */
export function getSupabaseAdmin() {
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.warn('⚠️ Supabase admin environment variables are not set');
    return null;
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}