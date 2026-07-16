// types/dashboard.ts
export interface DashboardAccess {
    id: string;
    user_id: string;
    email: string;
    role: 'owner' | 'admin' | 'editor' | 'viewer';
    can_manage_projects: boolean;
    can_manage_messages: boolean;
    can_manage_settings: boolean;
    can_manage_users: boolean;
    created_at: string;
    updated_at: string;
    created_by: string;
}

export type DashboardRole = 'owner' | 'admin' | 'editor' | 'viewer';

export const ROLE_PERMISSIONS: Record<DashboardRole, {
    label: string;
    description: string;
    color: string;
    icon: string;
}> = {
    owner: {
        label: 'Owner',
        description: 'Full access to everything',
        color: 'text-[#2c1810] bg-[#f8f4f0]',
        icon: '👑',
    },
    admin: {
        label: 'Admin',
        description: 'Can manage all content and users',
        color: 'text-blue-700 bg-blue-50',
        icon: '🛡️',
    },
    editor: {
        label: 'Editor',
        description: 'Can manage projects and messages',
        color: 'text-green-700 bg-green-50',
        icon: '✏️',
    },
    viewer: {
        label: 'Viewer',
        description: 'Can only view content',
        color: 'text-gray-700 bg-gray-50',
        icon: '👁️',
    },
};