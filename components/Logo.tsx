// components/Logo.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface LogoProps {
    className?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    variant?: 'light' | 'dark';
}

export function Logo({ className, size = 'md', variant = 'dark' }: LogoProps) {
    const sizes = {
        sm: { width: 120, height: 28 },
        md: { width: 180, height: 40 },
        lg: { width: 260, height: 58 },
        xl: { width: 350, height: 80 },
    };

    const logoSrc = variant === 'light' ? '/meryam-logo.svg' : '/meryam-logo.svg';

    return (
        <Link href="/" className={cn("block", className)}>
            <div className="relative" style={{
                width: sizes[size].width,
                height: sizes[size].height
            }}>
                <Image
                    src={logoSrc}
                    alt="Meryam Swilem"
                    fill
                    className="object-contain"
                    priority
                />
            </div>
        </Link>
    );
}