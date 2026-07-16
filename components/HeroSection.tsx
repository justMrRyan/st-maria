// components/HeroSection.tsx
'use client';

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export function HeroSection() {
    const scrollToContact = () => {
        const contactSection = document.querySelector("#contact");
        if (contactSection) {
            contactSection.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <section id="hero" className="relative min-h-[90vh] flex items-end overflow-hidden">
            <div className="absolute inset-0">
                <Image
                    src="/images/hero-interior.jpg"
                    alt="Luxurious interior design by Meryam Swilem"
                    fill
                    className="object-cover"
                    priority
                    sizes="100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2c1810]/90 via-[#2c1810]/40 to-transparent" />
            </div>

            <div className="relative z-10 pb-16 lg:pb-24 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="font-body text-sm md:text-base tracking-[0.3em] uppercase text-[#d4c5b0] mb-4"
                >
                    Interior Designer & Artiste Peintre
                </motion.p>

                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.05] text-white max-w-4xl"
                >
                    Creating Spaces
                    <br />
                    <span className="italic text-[#d4c5b0]">that Inspire</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="mt-6 text-lg md:text-xl text-white/70 max-w-xl"
                >
                    Bespoke interiors combining elegance, functionality, and artistic passion.
                    Based in Tunisia.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.7 }}
                    className="mt-10 flex flex-wrap gap-4"
                >
                    <button
                        onClick={scrollToContact}
                        className="px-8 py-3.5 bg-[#d4c5b0] text-[#2c1810] font-body text-sm tracking-wide uppercase hover:brightness-110 transition-all duration-300 rounded-lg font-semibold"
                    >
                        Get in Touch
                    </button>
                    <Link href="/projects">
                        <button className="px-8 py-3.5 border border-white/30 text-white font-body text-sm tracking-wide uppercase hover:border-[#d4c5b0] hover:text-[#d4c5b0] transition-all duration-300 rounded-lg">
                            View Portfolio
                        </button>
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}