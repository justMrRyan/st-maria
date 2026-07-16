// app/auth/callback/route.ts
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

export default function AuthCallback() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [status, setStatus] = useState('Processing...');
    const [error, setError] = useState('');

    useEffect(() => {
        const checkExistingSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();

            if (session) {
                console.log('✅ User already logged into Coflow:', session.user.email);

                // Check if we have a returnTo parameter
                const searchParams = new URLSearchParams(window.location.search);
                const returnTo = searchParams.get('returnTo');

                if (returnTo && returnTo !== '/dashboard') {
                    // User is already logged in, redirect immediately with tokens
                    const url = new URL(returnTo);
                    if (session.access_token) {
                        url.searchParams.set('access_token', session.access_token);
                        url.searchParams.set('refresh_token', session.refresh_token || '');
                    }
                    console.log('🔗 Auto-redirecting to:', url.toString());
                    window.location.href = url.toString();
                }
            }
        };

        checkExistingSession();
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#faf8f6]">
            <div className="bg-white rounded-3xl border border-[#f0ebe6] p-8 max-w-md w-full text-center shadow-lg">
                <div className="flex flex-col items-center">
                    {!error ? (
                        <>
                            <Loader2 className="h-12 w-12 text-[#2c1810] animate-spin mb-4" />
                            <p className="text-[#2c1810] font-medium">{status}</p>
                            <p className="text-[#8a7a6a] text-sm mt-2">Please wait while we complete authentication...</p>
                        </>
                    ) : (
                        <>
                            <XCircle className="h-12 w-12 text-[#c0392b] mb-4" />
                            <p className="text-[#c0392b] font-medium">{error}</p>
                            <p className="text-[#8a7a6a] text-sm mt-2">You will be redirected automatically...</p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}