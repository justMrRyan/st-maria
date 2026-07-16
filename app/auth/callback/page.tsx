// app/auth/callback/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      // Just redirect to dashboard if already logged in
      const { data: { session } } = await supabase?.auth.getSession() || { data: { session: null } };
      
      if (session) {
        router.push('/dashboard');
      } else {
        router.push('/login');
      }
    };

    handleCallback();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#faf8f6]">
      <div className="text-center">
        <div className="animate-spin h-8 w-8 border-4 border-[#d4c5b0] border-t-transparent mx-auto" />
        <p className="text-[#8a7a6a] mt-4">Redirecting...</p>
      </div>
    </div>
  );
}
