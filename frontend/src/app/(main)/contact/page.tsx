'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Facebook,
  Twitter,
  Linkedin,
  Github,
  Clock,
  MessageSquare,
  CheckCircle
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Badge } from '@/components/ui/Badge';
import { Input, Textarea, Select } from '@/components/ui/Input';

const contactSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(1, 'Please select a subject'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormData = z.infer<typeof contactSchema>;

const contactInfo = [
  {
    icon: Mail,
    title: 'Email Us',
    details: 'aiclub@diu.edu.bd',
    link: 'mailto:aiclub@diu.edu.bd'
  },
  {
    icon: Phone,
    title: 'Call Us',
    details: '+880 1234-567890',
    link: 'tel:+8801234567890'
  },
  {
    icon: MapPin,
    title: 'Visit Us',
    details: 'DIU Permanent Campus, Ashulia, Savar, Dhaka-1341',
    link: 'https://maps.google.com'
  },
  {
    icon: Clock,
    title: 'Office Hours',
    details: 'Sun - Thu: 9:00 AM - 5:00 PM',
    link: null
  },
];

const socialLinks = [
  { icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
  { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
  { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
  { icon: Github, href: 'https://github.com', label: 'GitHub' },
];

const subjects = [
  { value: 'general', label: 'General Inquiry' },
  { value: 'membership', label: 'Membership Question' },
  { value: 'events', label: 'Event Information' },
  { value: 'collaboration', label: 'Collaboration Proposal' },
  { value: 'feedback', label: 'Feedback' },
  { value: 'other', label: 'Other' },
];

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsSuccess(true);
      reset();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-black">
        {/* Background Orbs */}
        <div className="absolute inset-0">
          <div className="orb orb-purple w-96 h-96 top-1/4 left-1/4" />
          <div className="orb orb-cyan w-96 h-96 bottom-1/4 right-1/4" />
        </div>

        {/* Grid Overlay */}
        <div className="absolute inset-0 grid-overlay opacity-30" />

        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <Badge color="purple" className="mb-6">Contact</Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 text-white">
              Get in <span className="gradient-text">Touch</span>
            </h1>
            <p className="text-xl text-[#B5B5C3]">
              Have questions or want to collaborate? We'd love to hear from you!
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-20 bg-black relative overflow-hidden">
        {/* Background Orbs */}
        <div className="absolute inset-0">
          <div className="orb orb-cyan w-96 h-96 top-1/4 right-1/3" />
        </div>

        {/* Grid Overlay */}
        <div className="absolute inset-0 grid-overlay opacity-20" />

        <div className="container-custom relative z-10">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, index) => (
              <motion.div
                key={info.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="glass rounded-2xl p-6 text-center h-full hover:shadow-glow-purple transition-all duration-300">
                  <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#7B61FF] to-[#FF4FD8] flex items-center justify-center">
                    <info.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{info.title}</h3>
                  {info.link ? (
                    <a
                      href={info.link}
                      className="text-[#B5B5C3] hover:text-[#7B61FF] transition-colors text-sm"
                    >
                      {info.details}
                    </a>
                  ) : (
                    <p className="text-[#B5B5C3] text-sm">{info.details}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Map */}
      <section className="py-16 bg-black relative overflow-hidden">
        {/* Background Orbs */}
        <div className="absolute inset-0">
          <div className="orb orb-pink w-96 h-96 top-1/3 left-1/4" />
          <div className="orb orb-blue w-96 h-96 bottom-1/3 right-1/3" />
        </div>

        {/* Grid Overlay */}
        <div className="absolute inset-0 grid-overlay opacity-20" />

        <div className="container-custom relative z-10">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="glass rounded-2xl overflow-hidden">
                <div className="p-6 border-b border-white/10">
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <MessageSquare className="w-6 h-6 text-[#7B61FF]" />
                    Send us a Message
                  </h2>
                  <p className="text-[#B5B5C3] mt-2">
                    Fill out the form below and we'll get back to you soon
                  </p>
                </div>
                <div className="p-6">
                  {isSuccess ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-8"
                    >
                      <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-[#7B61FF] to-[#FF4FD8] rounded-full flex items-center justify-center">
                        <CheckCircle className="w-10 h-10 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-2">
                        Message Sent!
                      </h3>
                      <p className="text-[#B5B5C3] mb-6">
                        Thank you for reaching out. We'll respond within 24-48 hours.
                      </p>
                      <button className="btn-nexus-secondary px-6 py-3 rounded-xl" onClick={() => setIsSuccess(false)}>
                        Send Another Message
                      </button>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                      <div className="grid sm:grid-cols-2 gap-5">
                        <Input
                          label="Your Name"
                          placeholder="John Doe"
                          error={errors.name?.message}
                          {...register('name')}
                        />
                        <Input
                          type="email"
                          label="Email Address"
                          placeholder="john@example.com"
                          error={errors.email?.message}
                          {...register('email')}
                        />
                      </div>

                      <Select
                        label="Subject"
                        error={errors.subject?.message}
                        {...register('subject')}
                      >
                        <option value="">Select a subject</option>
                        {subjects.map((subject) => (
                          <option key={subject.value} value={subject.value}>
                            {subject.label}
                          </option>
                        ))}
                      </Select>

                      <Textarea
                        label="Message"
                        placeholder="Type your message here..."
                        rows={5}
                        error={errors.message?.message}
                        {...register('message')}
                      />

                      <button
                        type="submit"
                        className="btn-nexus-primary w-full px-6 py-4 rounded-xl font-semibold flex items-center justify-center gap-2"
                        disabled={isSubmitting}
                      >
                        <Send className="w-5 h-5" />
                        {isSubmitting ? 'Sending...' : 'Send Message'}
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Map & Social */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              {/* Map Placeholder */}
              <div className="glass rounded-2xl overflow-hidden">
                <div className="aspect-video bg-black/50 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-12 h-12 text-[#7B61FF] mx-auto mb-2" />
                    <p className="text-white font-medium">Interactive Map</p>
                    <a
                      href="https://maps.google.com/?q=Daffodil+International+University"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#7B61FF] hover:text-[#FF4FD8] text-sm transition-colors"
                    >
                      Open in Google Maps
                    </a>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="glass rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-2">Follow Us</h3>
                <p className="text-[#B5B5C3] mb-4">
                  Connect with us on social media
                </p>
                <div className="flex gap-4">
                  {socialLinks.map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 rounded-xl bg-white/5 hover:bg-gradient-to-br hover:from-[#7B61FF] hover:to-[#FF4FD8] flex items-center justify-center text-[#B5B5C3] hover:text-white transition-all duration-300"
                      aria-label={social.label}
                    >
                      <social.icon className="w-5 h-5" />
                    </a>
                  ))}
                </div>
              </div>

              {/* FAQ Prompt */}
              <div className="glass rounded-2xl p-6 bg-gradient-to-br from-[#7B61FF]/20 to-[#FF4FD8]/20 border-[#7B61FF]/30">
                <h3 className="text-xl font-semibold text-white mb-2">Have Questions?</h3>
                <p className="text-[#B5B5C3] mb-4">
                  Check out our FAQ section for quick answers to common questions.
                </p>
                <button className="btn-nexus-secondary px-6 py-3 rounded-xl">
                  View FAQ
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
