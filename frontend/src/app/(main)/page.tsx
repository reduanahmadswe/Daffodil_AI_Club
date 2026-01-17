'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
  Play,
  Star,
  Zap,
  Target
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

// Mock data
const stats = [
  { icon: Users, label: 'Active Members', value: '500+' },
  { icon: Calendar, label: 'Events Organized', value: '100+' },
  { icon: Award, label: 'Workshops', value: '50+' },
  { icon: Rocket, label: 'Projects Completed', value: '25+' },
];

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
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 hero-gradient opacity-90" />
        <div className="absolute inset-0 pattern-grid opacity-10" />
        
        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
            transition={{ duration: 6, repeat: Infinity }}
            className="absolute top-1/4 left-1/4 w-20 h-20 bg-white/10 rounded-2xl backdrop-blur-sm"
          />
          <motion.div
            animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute top-1/3 right-1/4 w-32 h-32 bg-white/10 rounded-full backdrop-blur-sm"
          />
          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 5, repeat: Infinity }}
            className="absolute bottom-1/4 left-1/3 w-16 h-16 bg-white/10 rounded-xl backdrop-blur-sm"
          />
        </div>

        {/* Content */}
        <div className="relative container-custom py-32">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.div variants={fadeInUp}>
              <Badge color="purple" className="mb-6">
                <Zap className="w-4 h-4 mr-1" />
                Welcome to Daffodil AI Club
              </Badge>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold text-white mb-6"
            >
              Explore the Future of
              <span className="block mt-2 bg-gradient-to-r from-yellow-200 via-pink-200 to-cyan-200 bg-clip-text text-transparent">
                Artificial Intelligence
              </span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-lg sm:text-xl text-white/80 mb-8 max-w-2xl mx-auto"
            >
              Join DIU's premier AI community. Learn, build, and innovate with us through workshops, 
              hackathons, and real-world projects.
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link href="/register">
                <Button size="lg" className="bg-white text-primary-600 hover:bg-white/90 px-8">
                  Join the Club
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/about">
                <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10">
                  <Play className="w-5 h-5 mr-2" />
                  Learn More
                </Button>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={fadeInUp}
              className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6"
            >
              {stats.map((stat, index) => (
                <div
                  key={stat.label}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center"
                >
                  <stat.icon className="w-8 h-8 text-white mx-auto mb-2" />
                  <p className="text-3xl font-bold text-white">{stat.value}</p>
                  <p className="text-sm text-white/70">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-2">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-3 bg-white rounded-full"
            />
          </div>
        </motion.div>
      </section>

      {/* About Section */}
      <section className="py-20 lg:py-32 bg-white dark:bg-gray-900">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Badge color="blue" className="mb-4">About Us</Badge>
              <h2 className="section-title mb-6">
                Empowering Students with{' '}
                <span className="gradient-text">AI Knowledge</span>
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Daffodil AI Club is the premier artificial intelligence community at Daffodil International University. 
                We are dedicated to fostering a culture of innovation and learning in the field of AI and Machine Learning.
              </p>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                Our mission is to bridge the gap between academic learning and industry requirements by providing 
                hands-on experience through workshops, projects, and competitions.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 text-primary-600">
                  <Target className="w-5 h-5" />
                  <span className="font-medium">Hands-on Learning</span>
                </div>
                <div className="flex items-center gap-2 text-primary-600">
                  <Star className="w-5 h-5" />
                  <span className="font-medium">Industry Experts</span>
                </div>
                <div className="flex items-center gap-2 text-primary-600">
                  <Rocket className="w-5 h-5" />
                  <span className="font-medium">Real Projects</span>
                </div>
              </div>
              <div className="mt-8">
                <Link href="/about">
                  <Button variant="primary">
                    Know More About Us
                    <ChevronRight className="w-5 h-5 ml-1" />
                  </Button>
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
              <div className="relative rounded-2xl overflow-hidden">
                <div className="aspect-video bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center">
                  <Brain className="w-32 h-32 text-white/30" />
                </div>
              </div>
              {/* Floating Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="absolute -bottom-6 -left-6 bg-white dark:bg-gray-800 rounded-xl shadow-xl p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                    <Award className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white">5+ Years</p>
                    <p className="text-sm text-gray-500">Of Excellence</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 lg:py-32 bg-gray-50 dark:bg-gray-800">
        <div className="container-custom">
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
                <Card variant="default" className="h-full card-hover">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="mb-2">{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="py-20 lg:py-32 bg-white dark:bg-gray-900">
        <div className="container-custom">
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
                <Card className="overflow-hidden card-hover">
                  <div className="aspect-video bg-gradient-to-br from-primary-400 to-secondary-400 relative">
                    <Badge 
                      color={event.type === 'Workshop' ? 'blue' : 'purple'} 
                      className="absolute top-4 left-4"
                    >
                      {event.type}
                    </Badge>
                  </div>
                  <CardContent className="p-6">
                    <CardTitle className="mb-3">{event.title}</CardTitle>
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {event.date}
                      </div>
                      <span>•</span>
                      <span>{event.time}</span>
                    </div>
                    <Link href={`/events/${event.id}`} className="mt-4 inline-block">
                      <Button variant="ghost" size="sm">
                        Learn More
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Executive Panel Section */}
      <section className="py-20 lg:py-32 bg-gray-50 dark:bg-gray-800">
        <div className="container-custom">
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
                <Card className="text-center card-hover">
                  <CardContent className="p-6">
                    <Avatar name={member.name} size="xl" className="mx-auto mb-4" />
                    <CardTitle className="mb-1">{member.name}</CardTitle>
                    <p className="text-primary-600 text-sm font-medium">{member.role}</p>
                  </CardContent>
                </Card>
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
      <section className="py-20 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0 hero-gradient" />
        <div className="absolute inset-0 pattern-dots opacity-10" />
        
        <div className="container-custom relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-6">
              Ready to Start Your AI Journey?
            </h2>
            <p className="text-lg text-white/80 mb-8">
              Join Daffodil AI Club today and become part of a thriving community of AI enthusiasts. 
              Get your unique membership ID and access exclusive resources.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register">
                <Button size="lg" className="bg-white text-primary-600 hover:bg-white/90 px-8">
                  Register Now
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10">
                  Contact Us
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
