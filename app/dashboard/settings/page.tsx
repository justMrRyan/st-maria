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
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast, Toaster } from 'sonner';
import Image from 'next/image';

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