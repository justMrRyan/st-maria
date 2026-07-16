// lib/hooks/useDashboardAccess.ts
'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { DashboardAccess, DashboardRole, ROLE_PERMISSIONS } from '@/types/dashboard';

interface UseDashboardAccessReturn {
    access: DashboardAccess | null;
    loading: boolean;
    error: string | null;
    isOwner: boolean;
    isAdmin: boolean;
    canManageProjects: boolean;
    canManageMessages: boolean;
    canManageSettings: boolean;
    canManageUsers: boolean;
    role: DashboardRole | null;
}

export function useDashboardAccess(): UseDashboardAccessReturn {
    const [access, setAccess] = useState<DashboardAccess | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAccess = async () => {
            try {
                // Get current user
                const { data: { user } } = await supabase.auth.getUser();

                if (!user) {
                    setLoading(false);
                    return;
                }

                // Get user's access record
                const { data, error } = await supabase
                    .from('dashboard_access')
                    .select('*')
                    .eq('user_id', user.id)
                    .single();

                if (error && error.code !== 'PGRST116') {
                    throw error;
                }

                setAccess(data);
            } catch (err) {
                console.error('Error fetching dashboard access:', err);
                setError(err instanceof Error ? err.message : 'Failed to fetch access');
            } finally {
                setLoading(false);
            }
        };

        fetchAccess();
    }, []);

    return {
        access,
        loading,
        error,
        isOwner: access?.role === 'owner' || false,
        isAdmin: access?.role === 'admin' || access?.role === 'owner' || false,
        canManageProjects: access?.can_manage_projects || access?.role === 'owner' || false,
        canManageMessages: access?.can_manage_messages || access?.role === 'owner' || false,
        canManageSettings: access?.can_manage_settings || access?.role === 'owner' || false,
        canManageUsers: access?.can_manage_users || access?.role === 'owner' || false,
        role: access?.role || null,
    };
}