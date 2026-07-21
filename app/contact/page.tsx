// app/contact/route.ts
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { Mail, Phone, MapPin, Clock, Send, Loader2, Sparkles } from 'lucide-react';

export default function ContactPage() {
    const [form, setForm] = useState({ name: '', email: '', message: '' });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { error } = await supabase
                .from('messages')
                .insert({
                    name: form.name,
                    email: form.email,
                    message: form.message,
                    read: false,
                    created_at: new Date().toISOString(),
                });

            if (error) throw error;

            toast.success('Message sent successfully!');
            setForm({ name: '', email: '', message: '' });
        } catch (error) {
            console.error('Error sending message:', error);
            toast.error('Failed to send message. Please try again.');
        } finally {
            setLoading(false);
        }
    };


    return (
        <>
            <main className="min-h-screen bg-[#faf8f6]">
                {/* ─── HERO ────────────────────────────────────────────────── */}
                <section className="relative pt-20 py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#f8f4f0] via-white to-[#f0ebe6] overflow-hidden">
                    <div className="absolute top-20 right-20 w-64 h-64 bg-[#d4c5b0]/20 rounded-full blur-3xl" />
                    <div className="absolute bottom-20 left-20 w-96 h-96 bg-[#e8ddd0]/20 rounded-full blur-3xl" />

                    <div className="max-w-7xl mx-auto text-center relative">

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="text-4xl sm:text-5xl font-bold text-[#2c1810]"
                        >
                            Let's Create Something <span className="italic text-[#d4c5b0]">Beautiful</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-lg text-[#8a7a6a] max-w-2xl mx-auto mt-4 leading-relaxed"
                        >
                            Have a project in mind? I'd love to hear about it. Fill out the form below and I'll get back to you soon.
                        </motion.p>
                        <motion.div
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="w-20 h-1 bg-[#d4c5b0] mx-auto mt-6 rounded-full"
                        />
                    </div>
                </section>

                {/* ─── CONTACT ────────────────────────────────────────────── */}
                <section className="py-16 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12">
                        {/* ─── FORM ──────────────────────────────────────── */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            className="bg-white p-8 shadow-sm border border-[#f0ebe6]"
                        >
                            <h2 className="text-2xl font-bold text-[#2c1810] mb-6">Send a Message</h2>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="text-xs tracking-[0.2em] uppercase text-[#8a7a6a] mb-2 block font-medium">
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={form.name}
                                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                                        className="w-full bg-transparent border-b border-[#f0ebe6] py-3 text-[#2c1810] focus:border-[#d4c5b0] focus:outline-none transition-colors placeholder:text-[#b8a89a]"
                                        placeholder="Your name"
                                    />
                                </div>

                                <div>
                                    <label className="text-xs tracking-[0.2em] uppercase text-[#8a7a6a] mb-2 block font-medium">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        value={form.email}
                                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                                        className="w-full bg-transparent border-b border-[#f0ebe6] py-3 text-[#2c1810] focus:border-[#d4c5b0] focus:outline-none transition-colors placeholder:text-[#b8a89a]"
                                        placeholder="your@email.com"
                                    />
                                </div>

                                <div>
                                    <label className="text-xs tracking-[0.2em] uppercase text-[#8a7a6a] mb-2 block font-medium">
                                        Message
                                    </label>
                                    <textarea
                                        required
                                        rows={5}
                                        value={form.message}
                                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                                        className="w-full bg-transparent border-b border-[#f0ebe6] py-3 text-[#2c1810] focus:border-[#d4c5b0] focus:outline-none transition-colors resize-none placeholder:text-[#b8a89a]"
                                        placeholder="Tell me about your project..."
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex items-center gap-2 px-8 py-3.5 bg-[#2c1810] text-white hover:bg-[#3d2820] transition-all duration-300 text-sm font-medium tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-4 h-4" />
                                            Send Message
                                        </>
                                    )}
                                </button>
                            </form>
                        </motion.div>

                        {/* ─── INFO ────────────────────────────────────────── */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="space-y-8"
                        >
                            <div>
                                <h2 className="text-2xl font-bold text-[#2c1810] mb-6">Contact Information</h2>
                                <div className="space-y-4">
                                    {[
                                        { icon: Mail, label: 'Email', value: 'int.designermeryamswilem@gmail.com', href: 'mailto:int.designermeryamswilem@gmail.com' },
                                        { icon: Phone, label: 'Phone', value: '+216 20 392 003', href: 'tel:+21620392003' },
                                        { icon: MapPin, label: 'Location', value: '359 Jaafer, Route de Raoued Ariana, Raoued, Tunisia, 2083' },
                                        { icon: Clock, label: 'Response Time', value: 'Typically within 24-48 hours' },
                                    ].map((item, index) => (
                                        <motion.div
                                            key={item.label}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.4, delay: index * 0.1 }}
                                            className="flex items-start gap-4 group"
                                        >
                                            <div className="mt-1 p-2 bg-[#f8f4f0] group-hover:bg-[#d4c5b0] transition-colors duration-300">
                                                <item.icon className="h-5 w-5 text-[#2c1810] group-hover:text-white transition-colors duration-300" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-[#2c1810]">{item.label}</p>
                                                {item.href ? (
                                                    <a href={item.href} className="text-[#8a7a6a] hover:text-[#2c1810] transition-colors">
                                                        {item.value}
                                                    </a>
                                                ) : (
                                                    <p className="text-[#8a7a6a]">{item.value}</p>
                                                )}
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>

                            {/* Tips */}
                            <div className="bg-[#f8f4f0] p-6 border border-[#f0ebe6]">
                                <h3 className="text-lg font-semibold text-[#2c1810] mb-3">Before You Message</h3>
                                <ul className="space-y-2 text-sm text-[#8a7a6a]">
                                    <li className="flex gap-2">
                                        <span className="text-[#2c1810] font-bold">✓</span>
                                        Include details about your project scope
                                    </li>
                                    <li className="flex gap-2">
                                        <span className="text-[#2c1810] font-bold">✓</span>
                                        Share your preferred timeline
                                    </li>
                                    <li className="flex gap-2">
                                        <span className="text-[#2c1810] font-bold">✓</span>
                                        Let me know your budget range
                                    </li>
                                    <li className="flex gap-2">
                                        <span className="text-[#2c1810] font-bold">✓</span>
                                        Feel free to share any inspiration images
                                    </li>
                                </ul>
                            </div>

                        </motion.div>
                    </div>
                </section>
            </main>
        </>
    );
}