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
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import HeroSection from '@/components/HeroSection';
import FadeContent from '@/components/FadeContent';

import DashboardAnimation from '@/components/DashboardAnimation';

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
    image: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800&h=450&fit=crop',
  },
  {
    id: 2,
    title: 'AI Hackathon 2024',
    date: 'March 25, 2024',
    time: '9:00 AM',
    type: 'Competition',
    image: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800&h=450&fit=crop',
  },
  {
    id: 3,
    title: 'Deep Learning with PyTorch',
    date: 'April 5, 2024',
    time: '2:00 PM',
    type: 'Workshop',
    image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&h=450&fit=crop',
  },
];

const executives = [
  {
    name: "Professor Dr. Fernaz Narin Nur",
    role: "Convener",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&h=800&fit=crop"
  },
  {
    name: "Associate Professor Dr. Md. Akhtaruzzaman",
    role: "Co-Convener",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&h=800&fit=crop"
  },
  {
    name: "Assistant Professor Mr. Md. Hasanuzzaman Dipu",
    role: "Co-Convener",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&h=800&fit=crop"
  }
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
              <div className="relative w-full flex items-center justify-center">
                {/* Subtle background glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#7B61FF]/10 to-[#FF4FD8]/10 blur-3xl rounded-full opacity-40 pointer-events-none" />

                {/* Animation Container - Larger and Seamless */}
                <div className="relative w-full max-w-[120%] h-auto -my-10 scale-110 md:scale-125 z-10">
                  <DashboardAnimation />
                </div>
              </div>
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
            <FadeContent blur={true} duration={1000} delay={200} className="mt-4 md:mt-0">
              <Link href="/events">
                <button className="group relative px-6 py-2.5 rounded-full bg-white/5 border border-white/10 hover:border-purple-500/50 hover:bg-purple-500/10 transition-all duration-300 overflow-hidden">
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-purple-500/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  <span className="relative flex items-center gap-2 font-medium text-sm text-white group-hover:text-purple-300 transition-colors">
                    View All Events
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>
              </Link>
            </FadeContent>
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
                <div className="glass rounded-2xl overflow-hidden hover:shadow-glow-pink transition-all duration-300 group">
                  <div className="aspect-video relative overflow-hidden">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-60" />
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
            <Badge color="purple" className="mb-4">Leadership</Badge>
            <h2 className="section-title mb-4">Meet Our Conveners</h2>
            <p className="section-subtitle">
              Guided by the visionary faculty of Daffodil International University
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 justify-center">
            {executives.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="group relative overflow-hidden rounded-2xl aspect-[4/5]">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />

                  <div className="absolute bottom-0 left-0 w-full p-6 text-center transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="text-xl font-bold text-white mb-1 leading-tight">{member.name}</h3>
                    <p className="text-[#B5B5C3] text-sm font-medium">{member.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <FadeContent blur={true} duration={1000} className="text-center mt-12 flex justify-center">
            <Link href="/executives">
              <button className="group relative px-8 py-3 rounded-full bg-white/5 border border-white/10 hover:border-purple-500/50 hover:bg-purple-500/10 transition-all duration-300 overflow-hidden">
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-purple-500/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                <span className="relative flex items-center gap-2 font-medium text-white group-hover:text-purple-300 transition-colors">
                  View Full Executive Panel
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
            </Link>
          </FadeContent>
        </div>
      </section>

      {/* CTA Section - Themed Simple Layout */}
      <section className="py-20 lg:py-32 relative overflow-hidden bg-black">
        {/* Gradient Background - Subtle */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#7B61FF]/10 via-black to-[#6EF3FF]/10 opacity-60" />

        {/* Background Orbs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="orb orb-purple w-[500px] h-[500px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-40" />
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
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-6">
              Ready to Start Your <span className="gradient-text">AI Journey?</span>
            </h2>
            <p className="text-lg text-[#B5B5C3] mb-10 leading-relaxed">
              Join Daffodil AI Club today and become part of a thriving community of AI enthusiasts.
              Get your unique membership ID and access exclusive resources.
            </p>
            <FadeContent blur={true} duration={1000} delay={200} className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link href="/register">
                <button className="group relative px-8 py-4 rounded-xl bg-gradient-to-r from-[#7B61FF] to-[#FF4FD8] text-white font-bold text-lg shadow-lg shadow-purple-500/25 hover:shadow-purple-500/50 hover:scale-105 transition-all duration-300">
                  <span className="relative z-10 flex items-center gap-2">
                    Register Now
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 rounded-xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </Link>
              <Link href="/contact">
                <button className="group px-8 py-4 rounded-xl font-bold text-lg text-white border border-white/10 hover:bg-white/5 hover:border-white/30 transition-all flex items-center gap-2">
                  Contact Us
                </button>
              </Link>
            </FadeContent>
          </motion.div>
        </div>
      </section>
    </>
  );
}
