// app/dashboard/settings/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Shield,
  Settings as SettingsIcon,
  LogOut,
  Sparkles,
  CheckCircle,
  Crown,
  ArrowRight,
  Fingerprint,
  ExternalLink,
  KeyRound,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast, Toaster } from 'sonner';
import Image from 'next/image';

const COFLOW_SETTINGS_URL = 'https://coflowapp.vercel.app/settings';

export default function DashboardSettings() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [access, setAccess] = useState<any>(null);
  const [role, setRole] = useState<string>('viewer');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          setLoading(false);
          return;
        }
        setUser(session.user);

        // Fetch profile (including pfp_url)
        const { data: profileData } = await supabase
            .from('Profile')
            .select('*')
            .eq('id', session.user.id)
            .single();
        setProfile(profileData);

        // Fetch dashboard access (to get role)
        const { data: accessData } = await supabase
            .from('dashboard_access')
            .select('*')
            .eq('user_id', session.user.id)
            .maybeSingle();
        if (accessData) {
          setAccess(accessData);
          setRole(accessData.role);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success('Logged out successfully');
      router.push('/login');
    } catch (error) {
      console.error('Error logging out:', error);
      toast.error('Failed to log out');
    }
  };

  if (loading) {
    return (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin h-8 w-8 border-4 border-[#d4c5b0] border-t-transparent" />
        </div>
    );
  }

  const displayName = profile?.display_name || 'User';
  const initial = displayName.charAt(0).toUpperCase() || 'U';
  const pfpUrl = profile?.pfp_url || null;

  const roleLabels: Record<string, { label: string; color: string }> = {
    owner: { label: 'Owner', color: 'bg-[#2c1810] text-white' },
    admin: { label: 'Admin', color: 'bg-blue-100 text-blue-700' },
    editor: { label: 'Editor', color: 'bg-green-100 text-green-700' },
    viewer: { label: 'Viewer', color: 'bg-gray-100 text-gray-700' },
  };
  const roleInfo = roleLabels[role] || roleLabels.viewer;

  return (
      <>
        <Toaster position="top-right" />
        <div className="space-y-8 max-w-3xl">
          <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold text-[#2c1810]">Settings</h1>
            <p className="text-[#8a7a6a] mt-1">Manage your account and preferences</p>
          </motion.div>

          <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white border border-[#f0ebe6] p-6"
          >
            <h2 className="text-xl font-semibold text-[#2c1810] mb-4 flex items-center gap-2">
              <User className="h-5 w-5 text-[#8a7a6a]" />
              Account Information
            </h2>
            {user ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-[#f8f4f0]">
                    <div className="relative h-14 w-14 rounded-full overflow-hidden bg-[#d4c5b0] flex items-center justify-center">
                      {pfpUrl ? (
                          <Image src={pfpUrl} alt={displayName} fill className="object-cover" />
                      ) : (
                          <span className="text-xl font-bold text-[#2c1810]">{initial}</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-[#2c1810]">{displayName}</p>
                      <p className="text-sm text-[#8a7a6a] flex items-center gap-1.5">
                        <Mail className="h-3.5 w-3.5" />
                        {user.email}
                      </p>
                    </div>
                    <div className={`px-3 py-1.5 text-xs font-medium rounded-full ${roleInfo.color}`}>
                      {roleInfo.label}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-white border border-[#f0ebe6]">
                      <p className="text-sm text-[#8a7a6a] flex items-center gap-1.5">
                        <Shield className="h-3.5 w-3.5" />
                        Role
                      </p>
                      <p className="font-medium text-[#2c1810] mt-1">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-sm ${roleInfo.color}`}>
                      <CheckCircle className="h-4 w-4" />
                      {roleInfo.label}
                    </span>
                      </p>
                      {role === 'owner' && (
                          <p className="text-xs text-[#8a7a6a] mt-1">
                            Full access to manage everything
                          </p>
                      )}
                    </div>
                    <div className="p-4 bg-white border border-[#f0ebe6]">
                      <p className="text-sm text-[#8a7a6a] flex items-center gap-1.5">
                        <SettingsIcon className="h-3.5 w-3.5" />
                        Account Status
                      </p>
                      <p className="font-medium text-[#2c1810] mt-1">
                    <span className="inline-flex items-center gap-1.5 text-[#27ae60]">
                      <CheckCircle className="h-4 w-4" />
                      Active
                    </span>
                      </p>
                      <p className="text-xs text-[#8a7a6a] mt-1">
                        Connected to Coflow authentication
                      </p>
                    </div>
                  </div>
                </div>
            ) : (
                <p className="text-[#8a7a6a]">No user session found</p>
            )}
          </motion.div>

          <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="bg-white border border-[#f0ebe6] p-6"
          >
            <h2 className="text-xl font-semibold text-[#2c1810] mb-4 flex items-center gap-2">
              <KeyRound className="h-5 w-5 text-[#8a7a6a]" />
              Sign-in Methods
            </h2>
            <div className="space-y-4">
              <p className="text-sm text-[#8a7a6a]">
                You can sign in to this dashboard with your password, your Google account.
                Google is set up from your Coflow account settings.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-4 bg-[#f8f4f0]">
                  <div className="bg-white p-2 border border-[#f0ebe6]">
                    <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#2c1810]">Google account</p>
                    <p className="text-xs text-[#8a7a6a] mt-0.5">
                      Connect your Google account to sign in with one click.
                    </p>
                  </div>
                </div>


              </div>

              <div className="flex flex-wrap items-center gap-3">
                <a
                    href={COFLOW_SETTINGS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#2c1810] hover:bg-[#3d2820] text-white px-4 py-2 text-sm font-medium transition-all duration-300 flex items-center gap-2"
                >
                  Open Coflow settings
                  <ExternalLink className="h-4 w-4" />
                </a>
                <span className="text-xs text-[#b8a89a]">
                coflowapp.vercel.app/settings
              </span>
              </div>
            </div>
          </motion.div>

          <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white border border-[#f0ebe6] p-6"
          >
            <h2 className="text-xl font-semibold text-[#2c1810] mb-4">Actions</h2>
            <div className="flex flex-wrap gap-3">
              <button
                  onClick={() => router.push('/dashboard')}
                  className="border border-[#f0ebe6] text-[#2c1810] hover:bg-[#f8f4f0] px-4 py-2 text-sm font-medium transition-all duration-300 flex items-center gap-2"
              >
                <SettingsIcon className="h-4 w-4" />
                Go to Dashboard
              </button>
              <button
                  onClick={handleLogout}
                  className="bg-[#c0392b] hover:bg-[#e74c3c] text-white px-4 py-2 text-sm font-medium transition-all duration-300 flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </motion.div>

          <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-[#f8f4f0] border border-[#f0ebe6] p-6"
          >
            <h2 className="text-xl font-semibold text-[#2c1810] mb-3 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-[#8a7a6a]" />
              Need Help?
            </h2>
            <div className="space-y-2 text-sm text-[#8a7a6a]">
              <p className="flex items-start gap-2">
                <span className="text-[#2c1810] font-bold">•</span>
                For questions about managing your portfolio or messages, contact support.
              </p>
              <p className="flex items-start gap-2">
                <span className="text-[#2c1810] font-bold">•</span>
                To upload projects, visit the <strong className="text-[#2c1810]">Projects</strong> section and click "New Project".
              </p>
              <p className="flex items-start gap-2">
                <span className="text-[#2c1810] font-bold">•</span>
                Your contact form messages will appear in the <strong className="text-[#2c1810]">Messages</strong> section.
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-[#f0ebe6]">
              <p className="text-xs text-[#b8a89a] flex items-center gap-2">
                <span className="font-medium text-[#2c1810]">User ID:</span>
                {user?.id ? `${user.id.slice(0, 8)}...` : 'N/A'}
              </p>
            </div>
          </motion.div>

          <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-gradient-to-r from-[#2c1810] to-[#3d2820] p-6"
          >
            <div className="flex items-start gap-4">
              <div className="bg-white/10 p-2">
                <Sparkles className="h-5 w-5 text-[#d4c5b0]" />
              </div>
              <div>
                <h3 className="font-semibold text-[#d4c5b0]">Quick Tip</h3>
                <p className="text-sm text-[#b8a89a] mt-1">
                  You can manage all your portfolio projects from the Projects section.
                  Add images, descriptions, and categories to showcase your work.
                </p>
                <button
                    onClick={() => router.push('/dashboard/projects')}
                    className="mt-3 border border-white/20 text-white hover:bg-white/10 px-4 py-1.5 text-sm font-medium transition-all duration-300 flex items-center gap-1.5"
                >
                  Go to Projects
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </>
  );
}