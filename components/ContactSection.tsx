// components/ContactSection.tsx
'use client';

import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from '@/lib/supabase/client';

export function ContactSection() {
    const [form, setForm] = useState({ name: "", email: "", message: "" });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const allowedUserId = process.env.NEXT_PUBLIC_ALLOWED_USER_ID;

            const { error } = await supabase
                .from('messages')
                .insert({
                    user_id: allowedUserId,
                    name: form.name,
                    email: form.email,
                    message: form.message,
                    read: false,
                    created_at: new Date().toISOString(),
                });

            if (error) throw error;

            toast.success("Message sent! I'll get back to you soon.");
            setForm({ name: "", email: "", message: "" });
        } catch (error) {
            console.error('Error sending message:', error);
            toast.error("Failed to send message. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
            <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16">
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <p className="text-sm tracking-[0.3em] uppercase text-[#d4c5b0] mb-3 font-medium">
                        Contact
                    </p>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2c1810] mb-6 leading-tight">
                        Let's Talk About Your <br />
                        <span className="italic text-[#d4c5b0]">Project</span>
                    </h2>
                    <p className="text-[#8a7a6a] mb-10 leading-relaxed">
                        Have a project in mind? Feel free to reach out to discuss your ideas
                        and transform your space.
                    </p>

                    <div className="space-y-6">
                        {[
                            { icon: Mail, text: "meryam@example.com", href: "mailto:meryam@example.com" },
                            { icon: Phone, text: "+216 XX XXX XXX", href: "tel:+216XXXXXXXXX" },
                            { icon: MapPin, text: "Ben Arous, Tunisia" },
                        ].map(({ icon: Icon, text, href }) => (
                            <div key={text} className="flex items-center gap-4 group">
                                <div className="w-10 h-10 rounded-full bg-[#f8f4f0] flex items-center justify-center group-hover:bg-[#d4c5b0] transition-colors duration-300">
                                    <Icon className="w-4 h-4 text-[#2c1810] group-hover:text-white transition-colors duration-300" />
                                </div>
                                {href ? (
                                    <a
                                        href={href}
                                        className="text-sm text-[#8a7a6a] hover:text-[#2c1810] transition-colors"
                                    >
                                        {text}
                                    </a>
                                ) : (
                                    <span className="text-sm text-[#8a7a6a]">{text}</span>
                                )}
                            </div>
                        ))}
                    </div>
                </motion.div>

                <motion.form
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    onSubmit={handleSubmit}
                    className="space-y-6"
                >
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
                            rows={4}
                            value={form.message}
                            onChange={(e) => setForm({ ...form, message: e.target.value })}
                            className="w-full bg-transparent border-b border-[#f0ebe6] py-3 text-[#2c1810] focus:border-[#d4c5b0] focus:outline-none transition-colors resize-none placeholder:text-[#b8a89a]"
                            placeholder="Tell me about your project..."
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-2 px-8 py-3.5 bg-[#d4c5b0] text-[#2c1810] text-sm tracking-wide uppercase hover:brightness-110 transition-all duration-300 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
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
                </motion.form>
            </div>
        </section>
    );
}