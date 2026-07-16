// components/Navbar.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, LayoutDashboard, LogOut, Home, FolderOpen, MessageSquare, Settings, Users } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import Image from 'next/image';

const publicNavLinks = [
    { label: 'Home', href: '/' },
    { label: 'Portfolio', href: '/projects' },
    { label: 'Contact', href: '/contact' },
];

const dashboardNavLinks = [
    { label: 'Dashboard', href: '/dashboard', icon: Home },
    { label: 'Projects', href: '/dashboard/projects', icon: FolderOpen },
    { label: 'Messages', href: '/dashboard/messages', icon: MessageSquare },
    { label: 'Users', href: '/dashboard/users', icon: Users },  // ← Added Users
    { label: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isDashboard, setIsDashboard] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const checkAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setIsLoggedIn(!!session);
        };
        checkAuth();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setIsLoggedIn(!!session);
        });

        return () => subscription.unsubscribe();
    }, []);

    useEffect(() => {
        setIsDashboard(pathname?.startsWith('/dashboard') || false);
    }, [pathname]);

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

    const navLinks = isDashboard ? dashboardNavLinks : publicNavLinks;

    return (
        <nav className={cn(
            "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
            isScrolled || isDashboard
                ? "bg-white/90 backdrop-blur-xl border-b border-[#f0ebe6] shadow-sm"
                : "bg-transparent"
        )}>
            <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4 lg:px-12">
                {/* Logo - 150px width */}
                <Link href="/" className="flex items-center group">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="relative w-[150px] h-[34px]"
                    >
                        <Image
                            src="/meryam-logo.svg"
                            alt="Meryam Swilem"
                            fill
                            className="object-contain group-hover:opacity-90 transition-opacity"
                            priority
                        />
                    </motion.div>
                </Link>

                {/* Desktop Navigation */}
                <motion.ul
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="hidden md:flex items-center gap-8"
                >
                    {navLinks.map((link, index) => {
                        const isActive = pathname === link.href || pathname?.startsWith(link.href + '/');
                        const Icon = link.icon;

                        if (isDashboard) {
                            return (
                                <motion.li
                                    key={link.href}
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                >
                                    <Link
                                        href={link.href}
                                        onClick={() => setOpen(false)}
                                        className={cn(
                                            "relative flex items-center gap-2 px-3 py-2 text-sm font-medium transition-all duration-300",
                                            isActive
                                                ? "text-[#2c1810]"
                                                : "text-[#8a7a6a] hover:text-[#2c1810] hover:bg-[#f8f4f0]"
                                        )}
                                    >
                                        {Icon && <Icon className="w-4 h-4" />}
                                        {link.label}
                                        {isActive && (
                                            <motion.span
                                                layoutId="activeIndicator"
                                                className="absolute inset-0 bg-[#2c1810]/10 -z-10"
                                                transition={{ type: "spring", duration: 0.6 }}
                                            />
                                        )}
                                    </Link>
                                </motion.li>
                            );
                        }

                        return (
                            <motion.li
                                key={link.href}
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                            >
                                <Link
                                    href={link.href}
                                    onClick={() => setOpen(false)}
                                    className={cn(
                                        "relative text-sm tracking-wide transition-all duration-300 font-medium",
                                        isActive
                                            ? "text-[#2c1810]"
                                            : "text-[#8a7a6a] hover:text-[#2c1810]"
                                    )}
                                >
                                    {link.label}
                                    {isActive && (
                                        <motion.span
                                            layoutId="activeIndicator"
                                            className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#d4c5b0]"
                                            transition={{ type: "spring", duration: 0.6 }}
                                        />
                                    )}
                                </Link>
                            </motion.li>
                        );
                    })}

                    {isDashboard ? (
                        <motion.li
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.2 }}
                        >
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-[#c0392b] hover:bg-red-50 transition-all duration-200"
                            >
                                <LogOut className="w-4 h-4" />
                                Logout
                            </button>
                        </motion.li>
                    ) : isLoggedIn ? (
                        <motion.li
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.2 }}
                        >
                            <Link href="/dashboard">
                                <button className="flex items-center gap-2 px-4 py-2 bg-[#2c1810] text-white hover:bg-[#3d2820] transition-all duration-300 text-sm font-medium shadow-sm hover:shadow-md">
                                    <LayoutDashboard className="w-4 h-4" />
                                    Dashboard
                                </button>
                            </Link>
                        </motion.li>
                    ) : (
                        <motion.li
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.2 }}
                        >
                        </motion.li>
                    )}
                </motion.ul>

                {/* Mobile toggle */}
                <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="md:hidden text-[#2c1810] p-2 hover:bg-[#f8f4f0] transition-colors"
                    onClick={() => setOpen(!open)}
                    whileTap={{ scale: 0.95 }}
                >
                    {open ? <X size={24} /> : <Menu size={24} />}
                </motion.button>
            </div>

            {/* Mobile menu */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4 }}
                        className="md:hidden overflow-hidden bg-white/95 backdrop-blur-xl border-b border-[#f0ebe6]"
                    >
                        <div className="px-6 py-8">
                            <ul className="flex flex-col items-center gap-6">
                                {navLinks.map((link, index) => {
                                    const isActive = pathname === link.href || pathname?.startsWith(link.href + '/');
                                    const Icon = link.icon;

                                    if (isDashboard) {
                                        return (
                                            <motion.li
                                                key={link.href}
                                                className="w-full"
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.3, delay: index * 0.05 }}
                                            >
                                                <Link
                                                    href={link.href}
                                                    onClick={() => setOpen(false)}
                                                    className={cn(
                                                        "flex items-center gap-3 px-3 py-2 text-base font-medium transition-all duration-300 w-full justify-center",
                                                        isActive
                                                            ? "bg-[#2c1810] text-white"
                                                            : "text-[#8a7a6a] hover:text-[#2c1810] hover:bg-[#f8f4f0]"
                                                    )}
                                                >
                                                    {Icon && <Icon className="w-5 h-5" />}
                                                    {link.label}
                                                </Link>
                                            </motion.li>
                                        );
                                    }

                                    return (
                                        <motion.li
                                            key={link.href}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.3, delay: index * 0.05 }}
                                        >
                                            <Link
                                                href={link.href}
                                                onClick={() => setOpen(false)}
                                                className={cn(
                                                    "text-lg transition-colors duration-300 font-medium",
                                                    isActive
                                                        ? "text-[#2c1810]"
                                                        : "text-[#8a7a6a] hover:text-[#2c1810]"
                                                )}
                                            >
                                                {link.label}
                                            </Link>
                                        </motion.li>
                                    );
                                })}

                                <motion.li
                                    className="w-full pt-6 border-t border-[#f0ebe6]"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: 0.2 }}
                                >
                                    {isDashboard ? (
                                        <button
                                            onClick={() => {
                                                handleLogout();
                                                setOpen(false);
                                            }}
                                            className="flex items-center justify-center gap-3 w-full px-3 py-2 text-base font-medium text-[#c0392b] hover:bg-red-50 transition-all duration-200"
                                        >
                                            <LogOut className="w-5 h-5" />
                                            Logout
                                        </button>
                                    ) : isLoggedIn ? (
                                        <Link href="/dashboard" onClick={() => setOpen(false)}>
                                            <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#2c1810] text-white hover:bg-[#3d2820] transition-all duration-300 text-sm font-medium shadow-sm">
                                                <LayoutDashboard className="w-4 h-4" />
                                                Dashboard
                                            </button>
                                        </Link>
                                    ) : (
                                        <Link href="/login" onClick={() => setOpen(false)}>
                                            <button className="w-full px-4 py-2 border border-[#2c1810] text-[#2c1810] hover:bg-[#2c1810] hover:text-white transition-all duration-300 text-sm font-medium">
                                                Admin Login
                                            </button>
                                        </Link>
                                    )}
                                </motion.li>
                            </ul>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}