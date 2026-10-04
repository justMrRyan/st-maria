// app/auth/callback/route.ts
import { NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get('code');
    const next = searchParams.get('next') ?? '/dashboard';

    console.log('[auth/callback] code present =', !!code);

    if (!code) {
        return NextResponse.redirect(`${origin}/login?error=auth`);
    }

    const supabase = await getSupabaseClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    console.log('[auth/callback] exchange error =', error?.message ?? 'none');

    if (error) {
        return NextResponse.redirect(
            `${origin}/login?error=auth&reason=${encodeURIComponent(error.message)}`
        );
    }

    return NextResponse.redirect(`${origin}${next}`);
}