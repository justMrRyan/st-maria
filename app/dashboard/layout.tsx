// app/dashboard/layout.tsx - Should NOT have Navbar
'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import { ReactNode } from 'react';

export default function DashboardLayout({ children }: { children: ReactNode }) {
    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-[#faf8f6]">
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {children}
                </main>
            </div>
        </ProtectedRoute>
    );
}