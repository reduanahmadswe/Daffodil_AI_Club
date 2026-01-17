'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Users,
  Calendar,
  Award,
  Rocket,
  Brain,
  Code,
  ChevronRight,
  Star,
  Target
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import HeroSection from '@/components/HeroSection';

// Mock data for other sections

const features = [
  {
    icon: Brain,
    title: 'AI/ML Learning',
    description: 'Hands-on workshops and courses on Machine Learning, Deep Learning, and Neural Networks.',
  },
  {
    icon: Code,
    title: 'Real Projects',
    description: 'Work on industry-relevant AI projects and build your portfolio with practical experience.',
  },
  {
    icon: Users,
    title: 'Networking',
    description: 'Connect with like-minded students, industry experts, and potential employers.',
  },
  {
    icon: Award,
    title: 'Competitions',
    description: 'Participate in hackathons, coding contests, and AI challenges to showcase your skills.',
  },
];

const upcomingEvents = [
  {
    id: 1,
    title: 'Introduction to Machine Learning',
    date: 'March 15, 2024',
    time: '3:00 PM',
    type: 'Workshop',
    image: '/events/ml-workshop.jpg',
  },
  {
    id: 2,
    title: 'AI Hackathon 2024',
    date: 'March 25, 2024',
    time: '9:00 AM',
    type: 'Competition',
    image: '/events/hackathon.jpg',
  },
  {
    id: 3,
    title: 'Deep Learning with PyTorch',
    date: 'April 5, 2024',
    time: '2:00 PM',
    type: 'Workshop',
    image: '/events/pytorch.jpg',
  },
];

const executives = [
  { name: 'Dr. Md. Saddam Hossain', role: 'Faculty Advisor', image: '/team/advisor.jpg' },
  { name: 'Rafiqul Islam', role: 'President', image: '/team/president.jpg' },
  { name: 'Fatima Akter', role: 'Vice President', image: '/team/vp.jpg' },
  { name: 'Kamal Hossain', role: 'General Secretary', image: '/team/gs.jpg' },
];

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <HeroSection />


      {/* About Section */}
      <section className="py-20 lg:py-32 bg-black relative overflow-hidden">
        {/* Background Orbs */}
        <div className="absolute inset-0">
          <div className="orb orb-purple w-96 h-96 top-1/4 right-1/4" />
          <div className="orb orb-cyan w-96 h-96 bottom-1/3 left-1/4" />
        </div>

        {/* Grid Overlay */}
        <div className="absolute inset-0 grid-overlay opacity-20" />

        <div className="container-custom relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Badge color="purple" className="mb-4">About Us</Badge>
              <h2 className="section-title mb-6">
                Empowering Students with{' '}
                <span className="gradient-text">AI Knowledge</span>
              </h2>
              <p className="text-[#B5B5C3] mb-6 text-lg">
                Daffodil AI Club is the premier artificial intelligence community at Daffodil International University.
                We are dedicated to fostering a culture of innovation and learning in the field of AI and Machine Learning.
              </p>
              <p className="text-[#B5B5C3] mb-8 text-lg">
                Our mission is to bridge the gap between academic learning and industry requirements by providing
                hands-on experience through workshops, projects, and competitions.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 text-[#7B61FF]">
                  <Target className="w-5 h-5" />
                  <span className="font-medium text-white">Hands-on Learning</span>
                </div>
                <div className="flex items-center gap-2 text-[#FF4FD8]">
                  <Star className="w-5 h-5" />
                  <span className="font-medium text-white">Industry Experts</span>
                </div>
                <div className="flex items-center gap-2 text-[#6EF3FF]">
                  <Rocket className="w-5 h-5" />
                  <span className="font-medium text-white">Real Projects</span>
                </div>
              </div>
              <div className="mt-8">
                <Link href="/about">
                  <button className="btn-nexus-primary px-8 py-4 rounded-xl font-semibold text-base flex items-center gap-2">
                    Know More About Us
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden glass p-8">
                <div className="aspect-video bg-gradient-to-br from-[#7B61FF] to-[#FF4FD8] rounded-2xl flex items-center justify-center">
                  <Brain className="w-32 h-32 text-white/30" />
                </div>
              </div>
              {/* Floating Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="absolute -bottom-6 -left-6 glass rounded-xl shadow-glow-pink p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#7B61FF] to-[#FF4FD8] flex items-center justify-center">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-white">5+ Years</p>
                    <p className="text-sm text-[#B5B5C3]">Of Excellence</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 lg:py-32 bg-black relative overflow-hidden">
        {/* Background Orbs */}
        <div className="absolute inset-0">
          <div className="orb orb-pink w-96 h-96 top-1/3 left-1/3" />
          <div className="orb orb-blue w-96 h-96 bottom-1/4 right-1/3" />
        </div>

        {/* Grid Overlay */}
        <div className="absolute inset-0 grid-overlay opacity-20" />

        <div className="container-custom relative z-10">
          <div className="text-center mb-16">
            <Badge color="blue" className="mb-4">What We Offer</Badge>
            <h2 className="section-title mb-4">Why Join Daffodil AI Club?</h2>
            <p className="section-subtitle">
              Discover the benefits of being part of our AI community
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="glass rounded-2xl p-6 text-center h-full hover:shadow-glow-purple transition-all duration-300">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#7B61FF] to-[#FF4FD8] flex items-center justify-center">
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-[#B5B5C3]">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="py-20 lg:py-32 bg-black relative overflow-hidden">
        {/* Background Orbs */}
        <div className="absolute inset-0">
          <div className="orb orb-cyan w-96 h-96 top-1/4 left-1/4" />
          <div className="orb orb-purple w-96 h-96 bottom-1/3 right-1/4" />
        </div>

        {/* Grid Overlay */}
        <div className="absolute inset-0 grid-overlay opacity-20" />

        <div className="container-custom relative z-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
            <div>
              <Badge color="green" className="mb-4">Events</Badge>
              <h2 className="section-title">Upcoming Events</h2>
            </div>
            <Link href="/events" className="mt-4 md:mt-0">
              <Button variant="outline">
                View All Events
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="glass rounded-2xl overflow-hidden hover:shadow-glow-pink transition-all duration-300">
                  <div className="aspect-video bg-gradient-to-br from-[#7B61FF] to-[#FF4FD8] relative">
                    <Badge
                      color={event.type === 'Workshop' ? 'blue' : 'purple'}
                      className="absolute top-4 left-4"
                    >
                      {event.type}
                    </Badge>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-3">{event.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-[#B5B5C3]">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {event.date}
                      </div>
                      <span>•</span>
                      <span>{event.time}</span>
                    </div>
                    <Link href={`/events/${event.id}`} className="mt-4 inline-block">
                      <button className="text-[#7B61FF] hover:text-[#FF4FD8] font-medium flex items-center gap-1 transition-colors">
                        Learn More
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Executive Panel Section */}
      <section className="py-20 lg:py-32 bg-black relative overflow-hidden">
        {/* Background Orbs */}
        <div className="absolute inset-0">
          <div className="orb orb-pink w-96 h-96 top-1/3 right-1/4" />
          <div className="orb orb-blue w-96 h-96 bottom-1/4 left-1/3" />
        </div>

        {/* Grid Overlay */}
        <div className="absolute inset-0 grid-overlay opacity-20" />

        <div className="container-custom relative z-10">
          <div className="text-center mb-16">
            <Badge color="purple" className="mb-4">Our Team</Badge>
            <h2 className="section-title mb-4">Executive Panel</h2>
            <p className="section-subtitle">
              Meet the dedicated team leading Daffodil AI Club
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {executives.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="glass rounded-2xl p-6 text-center hover:shadow-glow-purple transition-all duration-300">
                  <Avatar name={member.name} size="xl" className="mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
                  <p className="text-[#7B61FF] text-sm font-medium">{member.role}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/executives">
              <Button variant="outline">
                View All Executives
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32 relative overflow-hidden bg-black">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#7B61FF]/20 via-[#FF4FD8]/20 to-[#6EF3FF]/20" />

        {/* Background Orbs */}
        <div className="absolute inset-0">
          <div className="orb orb-purple w-[600px] h-[600px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 grid-overlay opacity-30" />

        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-6">
              Ready to Start Your <span className="gradient-text">AI Journey?</span>
            </h2>
            <p className="text-lg text-[#B5B5C3] mb-8">
              Join Daffodil AI Club today and become part of a thriving community of AI enthusiasts.
              Get your unique membership ID and access exclusive resources.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register">
                <button className="btn-nexus-primary px-8 py-4 rounded-xl font-semibold text-base flex items-center gap-2">
                  Register Now
                  <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
              <Link href="/contact">
                <button className="btn-nexus-secondary px-8 py-4 rounded-xl font-semibold text-base">
                  Contact Us
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
