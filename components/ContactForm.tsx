// components/ContactForm.tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Toaster, toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase/client';
import { Mail, User, MessageSquare, Send, Loader2 } from 'lucide-react';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters').max(5000, 'Message is too long'),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      const allowedUserId = process.env.NEXT_PUBLIC_ALLOWED_USER_ID;

      // Save directly to Supabase
      const { error } = await supabase
          .from('messages')
          .insert({
            user_id: allowedUserId,
            name: data.name,
            email: data.email,
            message: data.message,
            read: false,
            created_at: new Date().toISOString(),
          });

      if (error) throw error;

      toast.success('Message sent successfully! I\'ll get back to you soon.');
      reset();
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error(
          error instanceof Error ? error.message : 'Failed to send message'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
      <>
        <Toaster position="top-right" />
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full max-w-md">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-[#2c1810] mb-1.5">
              Name <span className="text-[#c0392b]">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#b8a89a]" />
              <input
                  {...register('name')}
                  type="text"
                  id="name"
                  placeholder="Your name"
                  className="w-full pl-10 pr-4 py-2 bg-white border border-[#f0ebe6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c1810] focus:border-transparent transition-shadow text-[#2c1810] placeholder:text-[#b8a89a]"
              />
            </div>
            {errors.name && (
                <p className="text-[#c0392b] text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[#2c1810] mb-1.5">
              Email <span className="text-[#c0392b]">*</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#b8a89a]" />
              <input
                  {...register('email')}
                  type="email"
                  id="email"
                  placeholder="your.email@example.com"
                  className="w-full pl-10 pr-4 py-2 bg-white border border-[#f0ebe6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c1810] focus:border-transparent transition-shadow text-[#2c1810] placeholder:text-[#b8a89a]"
              />
            </div>
            {errors.email && (
                <p className="text-[#c0392b] text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Message */}
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-[#2c1810] mb-1.5">
              Message <span className="text-[#c0392b]">*</span>
            </label>
            <div className="relative">
              <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-[#b8a89a]" />
              <textarea
                  {...register('message')}
                  id="message"
                  placeholder="Tell me about your project..."
                  rows={5}
                  className="w-full pl-10 pr-4 py-2 bg-white border border-[#f0ebe6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c1810] focus:border-transparent resize-y text-[#2c1810] placeholder:text-[#b8a89a]"
              />
            </div>
            {errors.message && (
                <p className="text-[#c0392b] text-sm mt-1">{errors.message.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#2c1810] hover:bg-[#3d2820] text-white gap-2 py-6 text-base"
          >
            {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Sending...
                </>
            ) : (
                <>
                  <Send className="h-5 w-5" />
                  Send Message
                </>
            )}
          </Button>

          <p className="text-xs text-[#b8a89a] text-center mt-4">
            I'll get back to you within 24-48 hours
          </p>
        </form>
      </>
  );
}