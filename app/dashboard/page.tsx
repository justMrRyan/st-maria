// app/dashboard/page.tsx
'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { motion } from 'framer-motion';
import {
  FolderOpen,
  MessageSquare,
  Plus,
  Mail,
  ArrowRight,
  Sparkles,
  Users,
  Clock
} from 'lucide-react';

export default function DashboardHome() {
  const [stats, setStats] = useState({
    projects: 0,
    messages: 0,
    unreadMessages: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const allowedUserId = process.env.NEXT_PUBLIC_ALLOWED_USER_ID;

        // Get projects count
        const { count: projectsCount } = await supabase
            .from('projects')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', allowedUserId);

        // Get ALL messages (no user_id filter since we removed it)
        const { count: messagesCount } = await supabase
            .from('messages')
            .select('*', { count: 'exact', head: true });

        // Get unread messages count (no user_id filter)
        const { count: unreadCount } = await supabase
            .from('messages')
            .select('*', { count: 'exact', head: true })
            .eq('read', false);

        setStats({
          projects: projectsCount || 0,
          messages: messagesCount || 0,
          unreadMessages: unreadCount || 0,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin h-8 w-8 border-4 border-[#d4c5b0] border-t-transparent" />
        </div>
    );
  }

  return (
      <div className="space-y-8">
        {/* Header */}
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold text-[#2c1810]">Dashboard</h1>
            <p className="text-[#8a7a6a] mt-1">
              Welcome back. Here's what's happening with your portfolio.
            </p>
          </div>
          <Link href="/dashboard/projects/new">
            <button className="bg-[#2c1810] hover:bg-[#3d2820] text-white px-6 py-2.5 flex items-center gap-2 text-sm font-medium transition-all duration-300">
              <Plus className="h-4 w-4" />
              New Project
            </button>
          </Link>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid gap-4 md:grid-cols-3"
        >
          <div className="bg-white border border-[#f0ebe6] p-6">
            <div className="flex items-center gap-2">
              <FolderOpen className="h-4 w-4 text-[#8a7a6a]" />
              <h3 className="text-sm font-medium text-[#8a7a6a]">Total Projects</h3>
            </div>
            <p className="mt-2 text-3xl font-bold text-[#2c1810]">{stats.projects}</p>
            <p className="text-xs text-[#b8a89a] mt-1">
              {stats.projects === 0 ? 'No projects yet' : `${stats.projects} projects in your portfolio`}
            </p>
          </div>

          <div className="bg-white border border-[#f0ebe6] p-6">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-[#8a7a6a]" />
              <h3 className="text-sm font-medium text-[#8a7a6a]">Total Messages</h3>
            </div>
            <p className="mt-2 text-3xl font-bold text-[#2c1810]">{stats.messages}</p>
            <p className="text-xs text-[#b8a89a] mt-1">
              {stats.messages === 0 ? 'No messages yet' : `${stats.messages} messages received`}
            </p>
          </div>

          <div className="bg-white border border-[#f0ebe6] p-6">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-[#8a7a6a]" />
              <h3 className="text-sm font-medium text-[#8a7a6a]">Unread Messages</h3>
            </div>
            <p className="mt-2 text-3xl font-bold text-[#c0392b]">{stats.unreadMessages}</p>
            <p className="text-xs text-[#b8a89a] mt-1">
              {stats.unreadMessages === 0 ? 'All caught up!' : `${stats.unreadMessages} need your attention`}
            </p>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid gap-6 md:grid-cols-2"
        >
          <Link href="/dashboard/projects" className="group">
            <div className="bg-white border border-[#f0ebe6] p-6 transition-all duration-300 hover:shadow-md hover:border-[#d4c5b0]">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-[#2c1810] group-hover:text-[#d4c5b0] transition-colors">Projects</h2>
                  <p className="text-[#8a7a6a] text-sm mt-1">
                    Manage your portfolio projects.
                  </p>
                </div>
                <FolderOpen className="h-8 w-8 text-[#b8a89a] group-hover:text-[#d4c5b0] transition-colors" />
              </div>
              <div className="mt-4 flex items-center gap-4 text-sm">
                <span className="text-[#b8a89a]">{stats.projects} projects</span>
                <span className="text-[#b8a89a]">·</span>
                <span className="text-[#2c1810] font-medium flex items-center gap-1 group-hover:text-[#d4c5b0] transition-colors">
                Manage Projects
                <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
              </span>
              </div>
            </div>
          </Link>

          <Link href="/dashboard/messages" className="group">
            <div className="bg-white border border-[#f0ebe6] p-6 transition-all duration-300 hover:shadow-md hover:border-[#d4c5b0]">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-[#2c1810] group-hover:text-[#d4c5b0] transition-colors">Messages</h2>
                  <p className="text-[#8a7a6a] text-sm mt-1">
                    View and manage contact form messages.
                  </p>
                </div>
                <MessageSquare className="h-8 w-8 text-[#b8a89a] group-hover:text-[#d4c5b0] transition-colors" />
              </div>
              <div className="mt-4 flex items-center gap-4 text-sm">
                <span className="text-[#b8a89a]">{stats.messages} messages</span>
                <span className="text-[#b8a89a]">·</span>
                {stats.unreadMessages > 0 ? (
                    <span className="text-[#c0392b] font-medium">{stats.unreadMessages} unread</span>
                ) : (
                    <span className="text-[#27ae60] font-medium">All read</span>
                )}
                <span className="text-[#b8a89a]">·</span>
                <span className="text-[#2c1810] font-medium flex items-center gap-1 group-hover:text-[#d4c5b0] transition-colors">
                View Messages
                <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
              </span>
              </div>
            </div>
          </Link>
        </motion.div>

        {/* Getting Started */}
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-[#f8f4f0] border border-[#f0ebe6] p-6"
        >
          <div className="flex items-start gap-4">
            <div className="bg-white p-2 shadow-sm">
              <Sparkles className="h-6 w-6 text-[#2c1810]" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-[#2c1810]">Getting Started</h2>
              <p className="text-[#8a7a6a] text-sm mt-1">
                Follow these steps to set up your portfolio:
              </p>
              <ul className="mt-4 space-y-2">
                <li className="flex items-center gap-3 text-sm text-[#2c1810]">
                  <span className="flex h-6 w-6 items-center justify-center bg-[#2c1810] text-white font-medium text-xs">1</span>
                  Create your first project in the Projects section
                </li>
                <li className="flex items-center gap-3 text-sm text-[#2c1810]">
                  <span className="flex h-6 w-6 items-center justify-center bg-[#2c1810] text-white font-medium text-xs">2</span>
                  Upload high-quality images for your projects
                </li>
                <li className="flex items-center gap-3 text-sm text-[#2c1810]">
                  <span className="flex h-6 w-6 items-center justify-center bg-[#2c1810] text-white font-medium text-xs">3</span>
                  Write compelling project descriptions
                </li>
                <li className="flex items-center gap-3 text-sm text-[#2c1810]">
                  <span className="flex h-6 w-6 items-center justify-center bg-[#2c1810] text-white font-medium text-xs">4</span>
                  Respond to client inquiries through messages
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
  );
}