'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { motion } from 'framer-motion';
import { Mail, Lock, Loader2, Eye, EyeOff, Shield, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const NO_ACCESS_MESSAGE = 'You do not have permission to access the dashboard.';

function GoogleIcon({ className }: { className?: string }) {
  return (
      <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z" />
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z" />
        <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z" />
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z" />
      </svg>
  );
}

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const [checking, setChecking] = useState(true);

  const busy = loading || googleLoading;

  const hasDashboardAccess = async (userId: string) => {
    const { data: access, error: accessError } = await supabase
        .from('dashboard_access')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle();

    if (accessError || !access) {
      await supabase.auth.signOut();
      return false;
    }
    return true;
  };

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          if (await hasDashboardAccess(session.user.id)) {
            window.location.href = '/dashboard';
            return;
          }
          setError(NO_ACCESS_MESSAGE);
        }
      } catch (err) {
        console.error('Session check error:', err);
      } finally {
        setChecking(false);
      }
    };

    checkSession();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (!(await hasDashboardAccess(data.user.id))) {
        setError(NO_ACCESS_MESSAGE);
        setLoading(false);
        return;
      }

      window.location.href = '/dashboard';
    } catch (err: any) {
      setError(err.message || 'Invalid email or password');
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setError('');

    try {
      const origin = window.location.origin;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${origin}/auth/callback?next=/dashboard`,
        },
      });

      if (error) throw error;
    } catch (err: any) {
      setError(err.message || 'Google sign-in failed');
      setGoogleLoading(false);
    }
  };

  if (checking) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#faf8f6]">
          <Loader2 className="h-8 w-8 text-[#2c1810] animate-spin" />
        </div>
    );
  }

  return (
      <div className="min-h-screen flex items-center justify-center bg-[#faf8f6] p-4 relative overflow-hidden">
        <div className="absolute top-20 right-20 w-64 h-64 bg-[#d4c5b0]/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-[#e8ddd0]/20 rounded-full blur-3xl" />

        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-md relative z-10"
        >
          <div className="bg-white border border-[#f0ebe6] p-8">
            <div className="text-center mb-8">
              <Link href="/" className="inline-block">
                <div className="relative w-[250px] h-[40px] mx-auto">
                  <Image
                      src="/coflow.svg"
                      alt="Meryam Swilem & Coflow"
                      fill
                      className="object-contain"
                  />
                </div>
              </Link>
              <h1 className="text-2xl font-bold text-[#2c1810] mt-4">Welcome !</h1>
              <p className="text-[#8a7a6a] mt-1 text-sm">Sign in with coflow account to manage your portfolio</p>
            </div>

            <div className="flex items-center gap-2 px-3 py-2 bg-[#f8f4f0] mb-6">
              <Shield className="h-4 w-4 text-[#2c1810]" />
              <span className="text-xs text-[#8a7a6a]">Restricted access • Authorized users only</span>
            </div>

            {error && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    role="alert"
                    className="bg-red-50 border border-red-100 text-[#c0392b] text-sm p-3 mb-4"
                >
                  {error}
                </motion.div>
            )}

            <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={busy}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white border border-[#f0ebe6] hover:border-[#d4c5b0] hover:bg-[#faf8f6] text-[#2c1810] transition-all duration-300 disabled:opacity-50 text-sm font-medium"
            >
              {googleLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <GoogleIcon className="h-4 w-4" />}
              <span>Continue with Google</span>
            </button>

            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-[#f0ebe6]" />
              <span className="text-[11px] tracking-[0.2em] uppercase text-[#b8a89a] font-medium">or</span>
              <div className="flex-1 h-px bg-[#f0ebe6]" />
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-xs tracking-[0.2em] uppercase text-[#8a7a6a] mb-2 font-medium">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#b8a89a]" />
                  <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-transparent border-b border-[#f0ebe6] text-[#2c1810] focus:border-[#d4c5b0] focus:outline-none transition-colors placeholder:text-[#b8a89a]"
                      placeholder="you@example.com"
                      required
                      autoComplete="email"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs tracking-[0.2em] uppercase text-[#8a7a6a] mb-2 font-medium">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#b8a89a]" />
                  <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-12 py-2.5 bg-transparent border-b border-[#f0ebe6] text-[#2c1810] focus:border-[#d4c5b0] focus:outline-none transition-colors placeholder:text-[#b8a89a]"
                      placeholder="Enter your password"
                      required
                      autoComplete="current-password"
                  />
                  <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-0 top-1/2 -translate-y-1/2 text-[#b8a89a] hover:text-[#2c1810] transition-colors"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <button
                  type="submit"
                  disabled={busy}
                  className="w-full bg-[#2c1810] hover:bg-[#3d2820] text-white py-3 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2 text-sm font-medium"
              >
                {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                    <>
                      Sign In
                      <ArrowRight className="h-4 w-4" />
                    </>
                )}
              </button>
            </form>

            <p className="text-xs text-[#b8a89a] text-center mt-6">
              Only authorized accounts can access this dashboard
            </p>
          </div>
        </motion.div>
      </div>
  );
}