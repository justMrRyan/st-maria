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
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
          router.push('/login');
          return;
        }

        // Check if user has dashboard access
        const { data: access } = await supabase
            .from('dashboard_access')
            .select('id')
            .eq('user_id', session.user.id)
            .maybeSingle();

        if (access) {
          setAuthorized(true);
        } else {
          await supabase.auth.signOut();
          router.push('/login?error=unauthorized');
        }
      } catch (error) {
        console.error('Auth check error:', error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
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