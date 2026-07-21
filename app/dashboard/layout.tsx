// app/dashboard/layout.tsx
'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import { ReactNode, useEffect, useState } from 'react';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // --- Desktop protections ---
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'PrintScreen') {
        e.preventDefault();
        // Optional: Show a subtle warning
        // toast.warning('Screenshots are disabled');
      }
    };

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    const handleShortcuts = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 's') {
        e.preventDefault();
      }
    };

    // --- Mobile protections ---
    // Detect app backgrounding (common for screenshot shortcuts on phones)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsVisible(false);
        // Optional: Clear sensitive data from the DOM
        // You could add a blur overlay here
      } else {
        setIsVisible(true);
      }
    };

    // Prevent long-press save on images (common on mobile)
    const handleTouchStart = (e: TouchEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'IMG') {
        e.preventDefault();
      }
    };

    // Prevent double-tap zoom (sometimes used to trigger screenshots)
    const handleTouchEnd = (e: TouchEvent) => {
      if (e.touches && e.touches.length === 0) {
        // Optional: Additional logic
      }
    };

    // Add event listeners
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleShortcuts);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('touchstart', handleTouchStart, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);

    // Cleanup
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleShortcuts);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  return (
    <ProtectedRoute>
      {/* Optional: Blur overlay when app is backgrounded on mobile */}
      {!isVisible && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[9999] backdrop-blur-sm">
          <div className="text-center p-6">
            <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white text-lg font-medium">Content hidden for security</p>
            <p className="text-white/60 text-sm mt-2">Return to the app to continue</p>
          </div>
        </div>
      )}
      
      <div className="min-h-screen bg-[#faf8f6] pt-20">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}