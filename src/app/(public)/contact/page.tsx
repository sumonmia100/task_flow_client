"use client";

import type { Metadata } from "next";
import { Mail, MessageSquare, Send } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Enter a valid email"),
  subject: z.string().min(3, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    // In production, send to your backend
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log(data);
    toast.success("Message sent! We'll get back to you soon.");
    reset();
  };

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Get in Touch</h1>
          <p className="text-xl text-blue-100">Have a question? We&apos;d love to hear from you.</p>
        </div>
      </section>

      <section className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Contact Info</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail size={16} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Email</p>
                    <p className="text-sm text-gray-500">support@taskflow.app</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MessageSquare size={16} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Live Chat</p>
                    <p className="text-sm text-gray-500">Available 9am–6pm (BST)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Name</label>
                  <input
                    {...register("name")}
                    placeholder="John Doe"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                  <input
                    {...register("email")}
                    type="email"
                    placeholder="you@example.com"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Subject</label>
                <input
                  {...register("subject")}
                  placeholder="How can we help?"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Message</label>
                <textarea
                  {...register("message")}
                  rows={5}
                  placeholder="Tell us more..."
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
                {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
              >
                <Send size={16} /> {isSubmitting ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
