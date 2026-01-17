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
import { Card, CardContent, CardTitle, CardDescription, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input, Textarea, Select } from '@/components/ui/Input';
import { contactApi } from '@/lib/api';

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
  { icon: Facebook, href: 'https://facebook.com', label: 'Facebook', color: 'hover:bg-blue-600' },
  { icon: Twitter, href: 'https://twitter.com', label: 'Twitter', color: 'hover:bg-sky-500' },
  { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn', color: 'hover:bg-blue-700' },
  { icon: Github, href: 'https://github.com', label: 'GitHub', color: 'hover:bg-gray-700' },
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
      await contactApi.send(data);
      setIsSuccess(true);
      reset();
    } catch (error) {
      // Handle error
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 hero-gradient" />
        <div className="absolute inset-0 pattern-grid opacity-10" />
        
        <div className="container-custom relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-white max-w-3xl mx-auto"
          >
            <Badge color="white" className="bg-white/20 text-white mb-6">Contact</Badge>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">
              Get in Touch
            </h1>
            <p className="text-xl text-white/80">
              Have questions or want to collaborate? We'd love to hear from you!
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container-custom">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 -mt-32 relative z-10">
            {contactInfo.map((info, index) => (
              <motion.div
                key={info.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full text-center card-hover">
                  <CardContent className="p-6">
                    <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                      <info.icon className="w-7 h-7 text-white" />
                    </div>
                    <CardTitle className="text-lg mb-2">{info.title}</CardTitle>
                    {info.link ? (
                      <a 
                        href={info.link} 
                        className="text-gray-600 dark:text-gray-400 hover:text-primary-600 transition-colors"
                      >
                        {info.details}
                      </a>
                    ) : (
                      <p className="text-gray-600 dark:text-gray-400">{info.details}</p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Map */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <MessageSquare className="w-6 h-6 text-primary-600" />
                    Send us a Message
                  </CardTitle>
                  <CardDescription>
                    Fill out the form below and we'll get back to you soon
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isSuccess ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-8"
                    >
                      <div className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-10 h-10 text-green-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        Message Sent!
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-6">
                        Thank you for reaching out. We'll respond within 24-48 hours.
                      </p>
                      <Button variant="outline" onClick={() => setIsSuccess(false)}>
                        Send Another Message
                      </Button>
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

                      <Button type="submit" variant="primary" className="w-full" isLoading={isSubmitting}>
                        <Send className="w-5 h-5 mr-2" />
                        Send Message
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Map & Social */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              {/* Map Placeholder */}
              <Card className="overflow-hidden">
                <div className="aspect-video bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">Interactive Map</p>
                    <a 
                      href="https://maps.google.com/?q=Daffodil+International+University"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:underline text-sm"
                    >
                      Open in Google Maps
                    </a>
                  </div>
                </div>
              </Card>

              {/* Social Links */}
              <Card>
                <CardHeader>
                  <CardTitle>Follow Us</CardTitle>
                  <CardDescription>
                    Connect with us on social media
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4">
                    {socialLinks.map((social) => (
                      <a
                        key={social.label}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 transition-all duration-300 ${social.color} hover:text-white`}
                        aria-label={social.label}
                      >
                        <social.icon className="w-5 h-5" />
                      </a>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* FAQ Prompt */}
              <Card variant="gradient">
                <CardContent className="p-6 text-white">
                  <h3 className="text-xl font-semibold mb-2">Have Questions?</h3>
                  <p className="text-white/80 mb-4">
                    Check out our FAQ section for quick answers to common questions.
                  </p>
                  <Button className="bg-white/20 hover:bg-white/30 text-white border-white/30">
                    View FAQ
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
