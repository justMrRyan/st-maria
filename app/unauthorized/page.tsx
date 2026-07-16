// app/unauthorized/route.ts
'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Shield, ArrowLeft, Home, AlertCircle, Sparkles } from 'lucide-react';

export default function Unauthorized() {
  useEffect(() => {
    // Clear any session on unauthorized page
    const clearSession = async () => {
      await supabase.auth.signOut();
    };
    clearSession();
  }, []);

  return (
      <main className="min-h-screen bg-[#faf8f6] flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          {/* Card */}
          <div className="bg-white rounded-3xl border border-[#f0ebe6] p-8 shadow-lg text-center">
            {/* Icon */}
            <div className="w-20 h-20 bg-[#f8f4f0] rounded-full flex items-center justify-center mx-auto mb-6">
              <Shield className="h-10 w-10 text-[#c0392b]" />
            </div>

            <div className="space-y-4">
              <h1 className="text-3xl font-bold text-[#2c1810]">Access Denied</h1>
              <div className="w-12 h-1 bg-[#c0392b] mx-auto rounded-full" />

              <div className="space-y-3">
                <p className="text-[#8a7a6a]">
                  You don't have permission to access the dashboard.
                </p>
                <p className="text-sm text-[#b8a89a] leading-relaxed">
                  Only the authorized owner can access this area.
                  If you believe this is an error, please contact the site administrator.
                </p>
              </div>

              {/* Warning Box */}
              <div className="bg-[#f8f4f0] border border-[#f0ebe6] rounded-xl p-4 flex items-start gap-3 text-left">
                <AlertCircle className="h-5 w-5 text-[#c0392b] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-[#2c1810]">Unauthorized Access Attempt</p>
                  <p className="text-xs text-[#8a7a6a]">Your session has been cleared for security.</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-6 border-t border-[#f0ebe6] mt-6">
              <Link href="/">
                <Button className="w-full bg-[#2c1810] hover:bg-[#3d2820] text-white gap-2">
                  <Home className="h-4 w-4" />
                  Back to Home
                </Button>
              </Link>
              <Link href="/login">
                <Button
                    variant="outline"
                    className="w-full border-[#f0ebe6] text-[#2c1810] hover:bg-[#f8f4f0] gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Try Signing In Again
                </Button>
              </Link>
            </div>

            {/* Footer */}
            <p className="text-xs text-[#b8a89a] mt-6">
              Meryam Swilem Interior Design
            </p>
          </div>
        </div>
      </main>
  );
}