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
const PinterestIcon = (props: LucideProps) => (
    <svg {...props} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.934 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z"/>
    </svg>
);

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-[#f8f4f0] border-t border-[#f0ebe6]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
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
                            <li className="flex items-center gap-1 text-sm text-[#8a7a6a]">
                                <Mail className="w-4 h-4 text-[#d4c5b0]" />
                                <a href="mailto:int.designermeryamswilem@gmail.com" className="hover:text-[#2c1810] transition-colors">
                                    int.designermeryamswilem@gmail.com
                                </a>
                            </li>
                            <li className="flex items-center gap-3 text-sm text-[#8a7a6a]">
                                <Phone className="w-4 h-4 text-[#d4c5b0]" />
                                <a href="tel:+21620392003" className="hover:text-[#2c1810] transition-colors">
                                    +216 20 392 003
                                </a>
                            </li>
                            <li className="flex items-center gap-1 text-sm text-[#8a7a6a]">
                                <MapPin className="w-4 h-4 text-[#d4c5b0]" />
                                <span>359 Jaafer, Route de Raoued Ariana, Raoued, Tunisia, 2083</span>
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
                                href="https://www.instagram.com/meryam_swilem/"
                                className="w-10 h-10 rounded-full bg-white border border-[#f0ebe6] flex items-center justify-center text-[#8a7a6a] hover:bg-[#2c1810] hover:text-white hover:border-[#2c1810] transition-all duration-300"
                                aria-label="Instagram"
                            >
                                <InstagramIcon className="w-5 h-5" />
                            </a>
                            <a
                                href="https://www.pinterest.com/meryamswilem/"
                                className="w-10 h-10 rounded-full bg-white border border-[#f0ebe6] flex items-center justify-center text-[#8a7a6a] hover:bg-[#2c1810] hover:text-white hover:border-[#2c1810] transition-all duration-300"
                                aria-label="Pinterest"
                            >
                                <PinterestIcon className="w-5 h-5" />
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