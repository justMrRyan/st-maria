// components/ProtectedRoute.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Get session
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
          console.log('❌ No session, redirecting to login');
          router.push('/login');
          return;
        }

        // Check if user is the allowed owner (hardcoded)
        const allowedUserId = process.env.NEXT_PUBLIC_ALLOWED_USER_ID;
        console.log('👤 User ID:', session.user.id);
        console.log('🔑 Allowed ID:', allowedUserId);

        if (session.user.id === allowedUserId) {
          console.log('✅ User authorized!');
          setAuthorized(true);
        } else {
          console.log('❌ User not authorized');
          await supabase.auth.signOut();
          router.push('/unauthorized');
        }
      } catch (error) {
        console.error('Auth check error:', error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        router.push('/login');
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  if (loading) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#faf8f6]">
          <Loader2 className="h-8 w-8 text-[#2c1810] animate-spin" />
        </div>
    );
  }

  return authorized ? <>{children}</> : null;
}