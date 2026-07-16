// app/login/route.ts
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { motion } from 'framer-motion';
import { Sparkles, Mail, Lock, Loader2, Eye, EyeOff, Shield, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import {Footer} from "@/components/Footer";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          const allowedUserId = process.env.NEXT_PUBLIC_ALLOWED_USER_ID;
          if (session.user.id === allowedUserId) {
            window.location.href = '/dashboard';
            return;
          }
        }
      } catch (error) {
        console.error('Session check error:', error);
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

      const allowedUserId = process.env.NEXT_PUBLIC_ALLOWED_USER_ID;

      if (data.user.id === allowedUserId) {
        window.location.href = '/dashboard';
      } else {
        await supabase.auth.signOut();
        setError('This account does not have dashboard access.');
        setLoading(false);
      }

    } catch (err: any) {
      setError(err.message || 'Invalid email or password');
      setLoading(false);
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
        {/* Decorative Elements */}
        <div className="absolute top-20 right-20 w-64 h-64 bg-[#d4c5b0]/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-[#e8ddd0]/20 rounded-full blur-3xl" />

        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-md relative z-10"
        >
          <div className="bg-white border border-[#f0ebe6] p-8">
            {/* Logo */}
            <div className="text-center mb-8">
              <Link href="/" className="inline-block">
                <div className="relative w-[180px] h-[40px] mx-auto">
                  <Image
                      src="/meryam-logo.svg"
                      alt="Meryam Swilem"
                      fill
                      className="object-contain"
                  />
                </div>
              </Link>
              <h1 className="text-2xl font-bold text-[#2c1810] mt-4">Welcome Back</h1>
              <p className="text-[#8a7a6a] mt-1 text-sm">Sign in to manage your portfolio</p>
            </div>

            {/* Security Notice */}
            <div className="flex items-center gap-2 px-3 py-2 bg-[#f8f4f0] mb-6">
              <Shield className="h-4 w-4 text-[#2c1810]" />
              <span className="text-xs text-[#8a7a6a]">Restricted access • Authorized users only</span>
            </div>

            {/* Error */}
            {error && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-50 border border-red-100 text-[#c0392b] text-sm p-3 mb-4"
                >
                  {error}
                </motion.div>
            )}

            {/* Form */}
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
                      placeholder="••••••••"
                      required
                  />
                  <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-0 top-1/2 -translate-y-1/2 text-[#b8a89a] hover:text-[#2c1810] transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <button
                  type="submit"
                  disabled={loading}
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