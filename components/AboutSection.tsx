// components/AboutSection.tsx
'use client';

import { motion } from "framer-motion";
import Image from "next/image";

export function AboutSection() {
    return (
        <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#faf8f6]">
            <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
                <motion.div
                    initial={{ opacity: 0, x: -40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="relative"
                >
                    <div className="aspect-[4/5] overflow-hidden rounded-2xl">
                        <Image
                            src="/images/about-portrait.jpg"
                            alt="Meryam Swilem, Interior Designer"
                            width={800}
                            height={1000}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="absolute -bottom-4 -right-4 w-32 h-32 border-2 border-[#d4c5b0] rounded-2xl -z-10" />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <p className="text-sm tracking-[0.3em] uppercase text-[#d4c5b0] mb-3 font-medium">
                        About
                    </p>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2c1810] mb-6 leading-tight">
                        Passion for Design,
                        <br />
                        <span className="italic text-[#d4c5b0]">Love of Art</span>
                    </h2>
                    <div className="space-y-4 text-[#8a7a6a] leading-relaxed">
                        <p>
                            I am Meryam Swilem, an interior designer and painter passionate about design,
                            architecture, graphic design, and photography.
                        </p>
                        <p>
                            Graduated in interior design from Collège LaSalle Tunis, I was trained in
                            the layout of various structures and the development of unique creative concepts.
                        </p>
                        <p>
                            Each project is a blank canvas where I blend functionality, aesthetics, and a
                            personal artistic touch to create spaces that tell a story.
                        </p>
                    </div>
                    <div className="mt-8 flex gap-12">
                        {[
                            { number: "50+", label: "Projects Completed" },
                            { number: "8+", label: "Years Experience" },
                        ].map((stat) => (
                            <div key={stat.label}>
                                <p className="text-3xl sm:text-4xl font-bold text-[#d4c5b0]">{stat.number}</p>
                                <p className="text-sm text-[#8a7a6a] mt-1">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}