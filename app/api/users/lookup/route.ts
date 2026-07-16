// app/api/users/lookup/route.ts
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
        return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    try {
        // Create admin client
        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!,
            {
                auth: {
                    autoRefreshToken: false,
                    persistSession: false,
                },
            }
        );

        // Query auth.users using admin client
        const { data, error } = await supabaseAdmin
            .from('auth.users')
            .select('id, email')
            .eq('email', email)
            .single();

        if (error || !data) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ user: data });
    } catch (error) {
        console.error('Error in user lookup API:', error);
        return NextResponse.json({ error: 'Failed to lookup user' }, { status: 500 });
    }
}