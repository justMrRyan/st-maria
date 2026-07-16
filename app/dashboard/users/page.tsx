// app/dashboard/users/route.ts
'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { DashboardAccess, DashboardRole, ROLE_PERMISSIONS } from '@/types/dashboard';
import { useDashboardAccess } from '@/lib/hooks/useDashboardAccess';
import { toast, Toaster } from 'sonner';
import { motion } from 'framer-motion';
import { UserPlus, Trash2, Shield, Users, Sparkles, X, Mail, User, Crown, Edit2, Save, XCircle } from 'lucide-react';

export default function DashboardUsers() {
    const { isOwner, canManageUsers, access: currentUserAccess } = useDashboardAccess();
    const [users, setUsers] = useState<DashboardAccess[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newUserEmail, setNewUserEmail] = useState('');
    const [newUserRole, setNewUserRole] = useState<DashboardRole>('editor');
    const [addingUser, setAddingUser] = useState(false);
    const [editingRole, setEditingRole] = useState<string | null>(null);
    const [tempRole, setTempRole] = useState<DashboardRole>('editor');
    const [searchingUser, setSearchingUser] = useState(false);
    const [userData, setUserData] = useState<{ id: string; email: string } | null>(null);

    useEffect(() => {
        if (canManageUsers) {
            fetchUsers();
        }
    }, [canManageUsers]);

    const fetchUsers = async () => {
        try {
            const { data: accessData, error: accessError } = await supabase
                .from('dashboard_access')
                .select('*')
                .order('created_at', { ascending: false });

            if (accessError) throw accessError;

            if (!accessData || accessData.length === 0) {
                setUsers([]);
                setLoading(false);
                return;
            }

            const userIds = accessData.map(u => u.user_id);

            const { data: profiles, error: profilesError } = await supabase
                .from('Profile')
                .select('id, display_name, username')
                .in('id', userIds);

            if (profilesError) {
                console.error('Error fetching profiles:', profilesError);
            }

            const usersWithInfo = accessData.map(user => {
                const profile = profiles?.find(p => p.id === user.user_id);

                const displayName = profile?.display_name || profile?.username || user.email?.split('@')[0] || 'User';

                return {
                    ...user,
                    display_name: displayName,
                    username: profile?.username || '',
                };
            });

            setUsers(usersWithInfo);
        } catch (error) {
            console.error('Error fetching users:', error);
            toast.error('Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    const checkUserExists = async (email: string) => {
        setSearchingUser(true);
        setUserData(null);

        try {
            console.log('🔍 Checking user with email:', email);

            // Try the RPC call
            const { data, error } = await supabase
                .rpc('get_user_by_email', { email_input: email });

            console.log('📦 RPC Response:', { data, error });

            if (error) {
                console.error('❌ RPC Error details:', error);

                // If RPC fails, try a different approach - query the Profile table
                // This is a fallback for testing
                toast.error('Could not verify user. Please try again.');
                return null;
            }

            if (!data || data.length === 0) {
                toast.error('User not found. Make sure they have an account.');
                return null;
            }

            const user = data[0];
            setUserData(user);
            toast.success('User found!');
            return user;
        } catch (error) {
            console.error('❌ Error checking user:', error);
            toast.error('Failed to check user. Please try again.');
            return null;
        } finally {
            setSearchingUser(false);
        }
    };

    const handleAddUser = async () => {
        if (!newUserEmail) {
            toast.error('Please enter an email address');
            return;
        }

        setAddingUser(true);
        try {
            // Check if user exists
            const user = await checkUserExists(newUserEmail);

            if (!user) {
                setAddingUser(false);
                return;
            }

            // Check if user already has access
            const { data: existing, error: checkError } = await supabase
                .from('dashboard_access')
                .select('id')
                .eq('user_id', user.id)
                .single();

            if (existing) {
                toast.error('User already has dashboard access.');
                setAddingUser(false);
                return;
            }

            const { error } = await supabase
                .from('dashboard_access')
                .insert({
                    user_id: user.id,
                    email: newUserEmail,
                    role: newUserRole,
                    can_manage_projects: true,
                    can_manage_messages: true,
                    can_manage_settings: newUserRole === 'admin' || newUserRole === 'owner',
                    can_manage_users: newUserRole === 'admin' || newUserRole === 'owner',
                    created_by: (await supabase.auth.getUser()).data.user?.id,
                });

            if (error) throw error;

            toast.success('User added successfully');
            setNewUserEmail('');
            setNewUserRole('editor');
            setUserData(null);
            setShowAddModal(false);
            fetchUsers();
        } catch (error) {
            console.error('Error adding user:', error);
            toast.error('Failed to add user');
        } finally {
            setAddingUser(false);
        }
    };

    const handleRemoveUser = async (userId: string, userName: string) => {
        if (!confirm(`Are you sure you want to remove ${userName}?`)) return;

        try {
            const { error } = await supabase
                .from('dashboard_access')
                .delete()
                .eq('user_id', userId);

            if (error) throw error;

            toast.success('User removed successfully');
            fetchUsers();
        } catch (error) {
            console.error('Error removing user:', error);
            toast.error('Failed to remove user');
        }
    };

    const startEditingRole = (userId: string, currentRole: DashboardRole) => {
        setEditingRole(userId);
        setTempRole(currentRole);
    };

    const cancelEditingRole = () => {
        setEditingRole(null);
        setTempRole('editor');
    };

    const saveRole = async (userId: string) => {
        try {
            const { error } = await supabase
                .from('dashboard_access')
                .update({
                    role: tempRole,
                    can_manage_settings: tempRole === 'admin' || tempRole === 'owner',
                    can_manage_users: tempRole === 'admin' || tempRole === 'owner',
                })
                .eq('user_id', userId);

            if (error) throw error;

            toast.success('Role updated successfully');
            setEditingRole(null);
            fetchUsers();
        } catch (error) {
            console.error('Error updating role:', error);
            toast.error('Failed to update role');
        }
    };

    if (!canManageUsers) {
        return (
            <div className="text-center py-20">
                <Shield className="h-16 w-16 text-[#b8a89a] mx-auto mb-4" />
                <p className="text-lg font-medium text-[#2c1810]">Access Denied</p>
                <p className="text-sm text-[#8a7a6a] mt-1">You don't have permission to manage users.</p>
            </div>
        );
    }

    return (
        <>
            <Toaster position="top-right" />
            <div className="space-y-8">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                    <div>
                        <h1 className="text-3xl font-bold text-[#2c1810]">User Management</h1>
                        <p className="text-[#8a7a6a] mt-1">
                            Manage who has access to the dashboard
                        </p>
                    </div>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="bg-[#2c1810] hover:bg-[#3d2820] text-white px-6 py-2.5 flex items-center gap-2 text-sm font-medium transition-all duration-300"
                    >
                        <UserPlus className="h-4 w-4" />
                        Add User
                    </button>
                </motion.div>

                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin h-8 w-8 border-4 border-[#d4c5b0] border-t-transparent" />
                    </div>
                ) : users.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="bg-[#f8f4f0] border border-[#f0ebe6] p-12 text-center"
                    >
                        <Users className="h-12 w-12 text-[#b8a89a] mx-auto mb-4" />
                        <p className="text-[#8a7a6a]">No users have dashboard access yet.</p>
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="mt-4 bg-[#2c1810] hover:bg-[#3d2820] text-white px-6 py-2 text-sm font-medium transition-all duration-300"
                        >
                            Add Your First User
                        </button>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="bg-white border border-[#f0ebe6] overflow-hidden"
                    >
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-[#f8f4f0] border-b border-[#f0ebe6]">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-[#8a7a6a] uppercase tracking-wider">User</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-[#8a7a6a] uppercase tracking-wider">Role</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-[#8a7a6a] uppercase tracking-wider">Permissions</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-[#8a7a6a] uppercase tracking-wider">Actions</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-[#f0ebe6]">
                                {users.map((user, index) => {
                                    const roleInfo = ROLE_PERMISSIONS[user.role];
                                    const isOwnerUser = user.role === 'owner';
                                    const displayName = user.display_name || user.username || 'User';
                                    const initial = displayName.charAt(0).toUpperCase() || 'U';
                                    const isEditing = editingRole === user.user_id;

                                    return (
                                        <motion.tr
                                            key={user.id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.3, delay: index * 0.05 }}
                                            className="hover:bg-[#f8f4f0] transition-colors"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 bg-[#2c1810] flex items-center justify-center text-white font-medium text-sm">
                                                        {initial}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-[#2c1810] flex items-center gap-1.5">
                                                            {displayName}
                                                            {isOwnerUser && (
                                                                <Crown className="h-3.5 w-3.5 text-[#d4c5b0]" />
                                                            )}
                                                        </p>
                                                        <p className="text-xs text-[#b8a89a]">
                                                            @{user.username || 'user'} • {user.email || 'No email'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {isEditing ? (
                                                    <div className="flex items-center gap-2">
                                                        <select
                                                            value={tempRole}
                                                            onChange={(e) => setTempRole(e.target.value as DashboardRole)}
                                                            className="px-2 py-1 border border-[#f0ebe6] text-sm focus:outline-none focus:border-[#d4c5b0] bg-white text-[#2c1810]"
                                                            autoFocus
                                                        >
                                                            <option value="owner">Owner</option>
                                                            <option value="admin">Admin</option>
                                                            <option value="editor">Editor</option>
                                                            <option value="viewer">Viewer</option>
                                                        </select>
                                                        <button
                                                            onClick={() => saveRole(user.user_id)}
                                                            className="p-1 text-green-600 hover:bg-green-50 transition-colors"
                                                            title="Save role"
                                                        >
                                                            <Save className="h-4 w-4" />
                                                        </button>
                                                        <button
                                                            onClick={cancelEditingRole}
                                                            className="p-1 text-[#c0392b] hover:bg-red-50 transition-colors"
                                                            title="Cancel"
                                                        >
                                                            <XCircle className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-2">
                                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium ${roleInfo.color}`}>
                                                                <span>{roleInfo.icon}</span>
                                                                {roleInfo.label}
                                                            </span>
                                                        <button
                                                            onClick={() => startEditingRole(user.user_id, user.role)}
                                                            className="p-1 text-[#8a7a6a] hover:text-[#2c1810] hover:bg-[#f8f4f0] transition-colors"
                                                            title="Edit role"
                                                        >
                                                            <Edit2 className="h-3.5 w-3.5" />
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-wrap gap-1.5">
                                                    {user.can_manage_projects && (
                                                        <span className="px-2 py-0.5 bg-[#f8f4f0] text-[#2c1810] text-xs">Projects</span>
                                                    )}
                                                    {user.can_manage_messages && (
                                                        <span className="px-2 py-0.5 bg-[#f8f4f0] text-[#2c1810] text-xs">Messages</span>
                                                    )}
                                                    {user.can_manage_settings && (
                                                        <span className="px-2 py-0.5 bg-[#f8f4f0] text-[#2c1810] text-xs">Settings</span>
                                                    )}
                                                    {user.can_manage_users && (
                                                        <span className="px-2 py-0.5 bg-[#f8f4f0] text-[#2c1810] text-xs">Users</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => handleRemoveUser(user.user_id, displayName)}
                                                    className="p-1 text-[#c0392b] hover:bg-red-50 transition-colors"
                                                    title="Remove user"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </td>
                                        </motion.tr>
                                    );
                                })}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                )}

                {users.length > 0 && (
                    <div className="text-center text-sm text-[#b8a89a]">
                        Total users: <span className="font-medium text-[#2c1810]">{users.length}</span>
                    </div>
                )}
            </div>

            {/* Add User Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-white w-full max-w-md p-8"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-[#2c1810]">Add User</h2>
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="text-[#b8a89a] hover:text-[#2c1810] transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs tracking-[0.2em] uppercase text-[#8a7a6a] mb-2 font-medium">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-4 text-[#b8a89a]" />
                                    <input
                                        type="email"
                                        value={newUserEmail}
                                        onChange={(e) => setNewUserEmail(e.target.value)}
                                        className="w-full pl-6 pb-2 bg-transparent border-b border-[#f0ebe6] text-[#2c1810] focus:border-[#d4c5b0] focus:outline-none transition-colors placeholder:text-[#b8a89a]"
                                        placeholder="user@example.com"
                                    />
                                </div>
                                {searchingUser && (
                                    <div className="mt-2 text-sm text-[#8a7a6a]">Checking user...</div>
                                )}
                                {userData && (
                                    <div className="mt-2 text-sm text-[#27ae60]">User found! Ready to add.</div>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs tracking-[0.2em] uppercase text-[#8a7a6a] mb-2 font-medium">
                                    Role
                                </label>
                                <select
                                    value={newUserRole}
                                    onChange={(e) => setNewUserRole(e.target.value as DashboardRole)}
                                    className="w-full pb-2 bg-transparent border-b border-[#f0ebe6] text-[#2c1810] focus:border-[#d4c5b0] focus:outline-none transition-colors"
                                >
                                    <option value="editor">Editor</option>
                                    <option value="admin">Admin</option>
                                    <option value="viewer">Viewer</option>
                                </select>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button
                                    onClick={handleAddUser}
                                    disabled={addingUser || searchingUser}
                                    className="flex-1 bg-[#2c1810] hover:bg-[#3d2820] text-white py-2.5 text-sm font-medium transition-all duration-300 disabled:opacity-50"
                                >
                                    {addingUser ? 'Adding...' : 'Add User'}
                                </button>
                                <button
                                    onClick={() => setShowAddModal(false)}
                                    className="flex-1 border border-[#f0ebe6] text-[#2c1810] hover:bg-[#f8f4f0] py-2.5 text-sm font-medium transition-all duration-300"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </>
    );
}