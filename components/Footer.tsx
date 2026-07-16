// components/Footer.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
    Mail,
    Phone,
    MapPin,
    LucideProps
} from 'lucide-react';

// Custom social icons since lucide-react doesn't export them directly
const FacebookIcon = (props: LucideProps) => (
    <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
);

const InstagramIcon = (props: LucideProps) => (
    <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="5" />
        <circle cx="17.5" cy="6.5" r="1.5" />
    </svg>
);

const LinkedinIcon = (props: LucideProps) => (
    <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
    </svg>
);

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-[#f8f4f0] border-t border-[#f0ebe6]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="md:col-span-1">
                        <Link href="/" className="inline-block">
                            <div className="relative w-[180px] h-[40px]">
                                <Image
                                    src="/meryam-logo.svg"
                                    alt="Meryam Swilem"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                        </Link>
                        <p className="text-sm text-[#8a7a6a] mt-4 max-w-xs leading-relaxed">
                            Creating beautiful, timeless interior spaces that reflect personality and lifestyle.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-sm font-semibold text-[#2c1810] mb-4 tracking-wider uppercase">
                            Quick Links
                        </h4>
                        <ul className="space-y-3">
                            <li>
                                <Link href="/projects" className="text-sm text-[#8a7a6a] hover:text-[#2c1810] transition-colors">
                                    Projects
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="text-sm text-[#8a7a6a] hover:text-[#2c1810] transition-colors">
                                    Contact
                                </Link>
                            </li>
                            <li>
                                <Link href="/dashboard" className="text-sm text-[#8a7a6a] hover:text-[#2c1810] transition-colors">
                                    Admin
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-sm font-semibold text-[#2c1810] mb-4 tracking-wider uppercase">
                            Contact
                        </h4>
                        <ul className="space-y-3">
                            <li className="flex items-center gap-3 text-sm text-[#8a7a6a]">
                                <Mail className="w-4 h-4 text-[#d4c5b0]" />
                                <a href="mailto:meryam@example.com" className="hover:text-[#2c1810] transition-colors">
                                    meryam@example.com
                                </a>
                            </li>
                            <li className="flex items-center gap-3 text-sm text-[#8a7a6a]">
                                <Phone className="w-4 h-4 text-[#d4c5b0]" />
                                <a href="tel:+216XXXXXXXXX" className="hover:text-[#2c1810] transition-colors">
                                    +216 XX XXX XXX
                                </a>
                            </li>
                            <li className="flex items-center gap-3 text-sm text-[#8a7a6a]">
                                <MapPin className="w-4 h-4 text-[#d4c5b0]" />
                                <span>Ben Arous, Tunisia</span>
                            </li>
                        </ul>
                    </div>

                    {/* Social & Legal */}
                    <div>
                        <h4 className="text-sm font-semibold text-[#2c1810] mb-4 tracking-wider uppercase">
                            Follow Me
                        </h4>
                        <div className="flex gap-4">
                            <a
                                href="https://www.facebook.com/INTERIORDESIGNERMERYAMSWILEM"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-full bg-white border border-[#f0ebe6] flex items-center justify-center text-[#8a7a6a] hover:bg-[#2c1810] hover:text-white hover:border-[#2c1810] transition-all duration-300"
                                aria-label="Facebook"
                            >
                                <FacebookIcon className="w-5 h-5" />
                            </a>
                            <a
                                href="#"
                                className="w-10 h-10 rounded-full bg-white border border-[#f0ebe6] flex items-center justify-center text-[#8a7a6a] hover:bg-[#2c1810] hover:text-white hover:border-[#2c1810] transition-all duration-300"
                                aria-label="Instagram"
                            >
                                <InstagramIcon className="w-5 h-5" />
                            </a>
                            <a
                                href="#"
                                className="w-10 h-10 rounded-full bg-white border border-[#f0ebe6] flex items-center justify-center text-[#8a7a6a] hover:bg-[#2c1810] hover:text-white hover:border-[#2c1810] transition-all duration-300"
                                aria-label="LinkedIn"
                            >
                                <LinkedinIcon className="w-5 h-5" />
                            </a>
                        </div>
                        <p className="text-xs text-[#b8a89a] mt-6">
                            © {currentYear} Meryam Swilem. All rights reserved.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}