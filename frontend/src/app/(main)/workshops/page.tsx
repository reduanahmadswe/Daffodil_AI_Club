'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Calendar,
  Clock,
  Users,
  Award,
  ArrowRight,
  Search,
  BookOpen,
  Code,
  Brain,
  Layers
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Avatar } from '@/components/ui/Avatar';
import { Skeleton } from '@/components/ui/Skeleton';
import FadeContent from '@/components/FadeContent';
import { workshopsApi } from '@/lib/api';
import { Workshop } from '@/types';

const levels = ['All', 'Beginner', 'Intermediate', 'Advanced'];

export default function WorkshopsPage() {
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [loading, setLoading] = useState(true);
  const [level, setLevel] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchWorkshops = async () => {
      try {
        const response = await workshopsApi.getAll({ level: level !== 'All' ? level : undefined });
        setWorkshops(response.data.workshops || mockWorkshops);
      } catch (error) {
        setWorkshops(mockWorkshops);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkshops();
  }, [level]);

  const filteredWorkshops = workshops.filter(workshop =>
    workshop.title.toLowerCase().includes(search.toLowerCase()) ||
    workshop.description?.toLowerCase().includes(search.toLowerCase())
  );

  const getLevelColor = (lvl: string) => {
    switch (lvl) {
      case 'Beginner': return 'green';
      case 'Intermediate': return 'blue';
      case 'Advanced': return 'purple';
      default: return 'gray';
    }
  };

  const getLevelIcon = (lvl: string) => {
    switch (lvl) {
      case 'Beginner': return BookOpen;
      case 'Intermediate': return Code;
      case 'Advanced': return Brain;
      default: return Layers;
    }
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-40 pb-20 overflow-hidden bg-nexus-bg">
        {/* Background Orbs */}
        <div className="absolute inset-0">
          <div className="orb orb-cyan w-96 h-96 top-1/4 left-1/4" />
          <div className="orb orb-blue w-96 h-96 bottom-1/4 right-1/4" />
        </div>

        {/* Grid Overlay */}
        <div className="absolute inset-0 grid-overlay opacity-30" />

        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <Badge color="cyan" className="mb-6">Workshops</Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 text-nexus-text">
              Learn AI Through <span className="gradient-text">Practice</span>
            </h1>
            <p className="text-xl text-nexus-text-secondary">
              Hands-on workshops designed to build your AI skills from beginner to advanced
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-nexus-bg relative overflow-hidden border-b border-nexus-border">
        {/* Subtle Orb */}
        <div className="absolute inset-0">
          <div className="orb orb-purple w-64 h-64 top-1/2 right-1/4 opacity-30" />
        </div>

        <div className="container-custom relative z-10">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="w-full md:w-96">
              <Input
                type="search"
                placeholder="Search workshops..."
                leftIcon={<Search className="w-5 h-5" />}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="flex gap-2">
              {levels.map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setLevel(lvl)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${level === lvl
                    ? 'bg-gradient-to-r from-nexus-purple to-nexus-pink text-nexus-text shadow-glow-purple'
                    : 'bg-nexus-glass text-nexus-text-secondary hover:bg-nexus-glass hover:text-nexus-text'
                    }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Workshops Grid */}
      <section className="py-20 bg-nexus-bg relative overflow-hidden">
        {/* Background Orbs */}
        <div className="absolute inset-0">
          <div className="orb orb-pink w-96 h-96 top-1/3 left-1/4" />
          <div className="orb orb-cyan w-96 h-96 bottom-1/3 right-1/3" />
        </div>

        {/* Grid Overlay */}
        <div className="absolute inset-0 grid-overlay opacity-20" />

        <div className="container-custom relative z-10">
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="glass rounded-2xl overflow-hidden">
                  <Skeleton className="h-48 rounded-none" />
                  <div className="p-6">
                    <Skeleton className="h-6 w-3/4 mb-3" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredWorkshops.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredWorkshops.map((workshop, index) => {
                const LevelIcon = getLevelIcon(workshop.level || 'Beginner');
                return (
                  <motion.div
                    key={workshop.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link href={`/workshops/${workshop.slug}`}>
                      <div className="glass rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-cyan-500/10 transition-all duration-300 h-full flex flex-col border border-nexus-border group relative">
                        {/* Workshop Image */}
                        <div className="aspect-video bg-gradient-to-br from-[#6EF3FF] to-[#5B8CFF] relative overflow-hidden">
                          {workshop.image ? (
                            <img
                              src={workshop.image}
                              alt={workshop.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <LevelIcon className="w-16 h-16 text-white/30" />
                            </div>
                          )}
                          <div className="absolute top-4 left-4 flex gap-2">
                            {workshop.level && (
                              <Badge color={getLevelColor(workshop.level) as any}>
                                {workshop.level}
                              </Badge>
                            )}
                            {workshop.hasCertificate && (
                              <Badge color="yellow">
                                <Award className="w-3 h-3 mr-1" />
                                Certificate
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="p-6 flex-1 flex flex-col">
                          <h3 className="text-xl font-bold text-nexus-text mb-3 line-clamp-2 group-hover:text-nexus-cyan transition-colors">{workshop.title}</h3>
                          <p className="text-nexus-text-secondary mb-4 line-clamp-2 flex-1">
                            {workshop.description}
                          </p>

                          {/* Workshop Details */}
                          <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm text-nexus-text-muted mb-4">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-nexus-cyan flex-shrink-0" />
                              <span className="truncate">{formatDate(workshop.startDate)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-nexus-cyan flex-shrink-0" />
                              <span className="truncate">{workshop.duration}</span>
                            </div>
                            {workshop.maxParticipants && (
                              <div className="flex items-center gap-2">
                                <Users className="w-4 h-4 text-nexus-cyan flex-shrink-0" />
                                <span className="truncate">{workshop.registeredCount || 0}/{workshop.maxParticipants} seats</span>
                              </div>
                            )}
                          </div>

                          {/* Instructor */}
                          <div className="flex items-center justify-between border-t border-nexus-border pt-3">
                            <div className="flex items-center gap-3">
                              <Avatar name={typeof workshop.instructor === 'string' ? workshop.instructor : workshop.instructor?.name || 'Instructor'} size="sm" />
                              <div className="flex-1">
                                <p className="text-sm font-medium text-nexus-text">
                                  {typeof workshop.instructor === 'string' ? workshop.instructor : workshop.instructor?.name || 'Club Instructor'}
                                </p>
                                <p className="text-xs text-nexus-text-muted">Instructor</p>
                              </div>
                            </div>
                            <ArrowRight className="w-5 h-5 text-nexus-cyan group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-20">
              <BookOpen className="w-16 h-16 mx-auto text-nexus-cyan mb-4" />
              <h3 className="text-xl font-semibold text-nexus-text mb-2">
                No workshops found
              </h3>
              <p className="text-nexus-text-secondary">
                {search ? 'Try a different search term' : 'Check back later for upcoming workshops'}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-nexus-bg relative overflow-hidden">
        {/* Background Orbs */}
        <div className="absolute inset-0">
          <div className="orb orb-blue w-96 h-96 top-1/4 right-1/3" />
          <div className="orb orb-purple w-96 h-96 bottom-1/4 left-1/3" />
        </div>

        {/* Grid Overlay */}
        <div className="absolute inset-0 grid-overlay opacity-20" />

        <div className="container-custom relative z-10">
          <div className="text-center mb-12">
            <Badge color="blue" className="mb-4">Why Join</Badge>
            <h2 className="section-title mb-4">Workshop Benefits</h2>
            <p className="section-subtitle">
              What you'll gain from our hands-on workshops
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Code, title: 'Practical Skills', description: 'Learn by doing with real-world projects and coding exercises' },
              { icon: Award, title: 'Certificates', description: 'Earn certificates upon completion to showcase your skills' },
              { icon: Users, title: 'Expert Guidance', description: 'Learn from experienced instructors and industry professionals' },
            ].map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="glass rounded-2xl p-8 text-center h-full hover:shadow-glow-blue transition-all duration-300">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#6EF3FF] to-[#5B8CFF] flex items-center justify-center">
                    <benefit.icon className="w-8 h-8 text-nexus-text" />
                  </div>
                  <h3 className="text-xl font-bold text-nexus-text mb-2">{benefit.title}</h3>
                  <p className="text-nexus-text-secondary">{benefit.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

// Mock data
const mockWorkshops: Workshop[] = [
  {
    id: '1',
    title: 'Introduction to Machine Learning with Python',
    slug: 'intro-ml-python',
    description: 'Learn the fundamentals of machine learning using Python, scikit-learn, and hands-on projects.',
    level: 'Beginner',
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&h=450&fit=crop',
    startDate: '2024-03-20T10:00:00',
    endDate: '2024-03-20T16:00:00',
    duration: '6 hours',
    instructor: 'Rafiqul Islam',
    mode: 'OFFLINE',
    fee: 500,
    maxParticipants: 40,
    registeredCount: 28,
    hasCertificate: true,
    isPublished: true,
    status: 'UPCOMING',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Deep Learning with TensorFlow',
    slug: 'deep-learning-tensorflow',
    description: 'Build neural networks and deep learning models using TensorFlow and Keras.',
    level: 'Intermediate',
    image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&h=450&fit=crop',
    startDate: '2024-03-25T10:00:00',
    endDate: '2024-03-25T17:00:00',
    duration: '7 hours',
    instructor: 'Dr. Saddam Hossain',
    mode: 'OFFLINE',
    fee: 500,
    maxParticipants: 30,
    registeredCount: 25,
    hasCertificate: true,
    isPublished: true,
    status: 'UPCOMING',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Natural Language Processing Fundamentals',
    slug: 'nlp-fundamentals',
    description: 'Explore text processing, sentiment analysis, and building NLP applications.',
    level: 'Intermediate',
    image: 'https://images.unsplash.com/photo-1516110833967-0b5716ca1387?w=800&h=450&fit=crop',
    startDate: '2024-04-01T14:00:00',
    endDate: '2024-04-01T18:00:00',
    duration: '4 hours',
    instructor: 'Fatima Akter',
    mode: 'OFFLINE',
    fee: 500,
    maxParticipants: 35,
    registeredCount: 18,
    hasCertificate: true,
    isPublished: true,
    status: 'UPCOMING',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '4',
    title: 'Computer Vision with OpenCV',
    slug: 'cv-opencv',
    description: 'Master image processing and computer vision techniques using OpenCV.',
    level: 'Intermediate',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=450&fit=crop',
    startDate: '2024-04-08T10:00:00',
    endDate: '2024-04-08T15:00:00',
    duration: '5 hours',
    instructor: 'Kamal Hossain',
    mode: 'OFFLINE',
    fee: 500,
    maxParticipants: 30,
    registeredCount: 12,
    hasCertificate: true,
    isPublished: true,
    status: 'UPCOMING',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '5',
    title: 'Generative AI & LLMs',
    slug: 'generative-ai-llms',
    description: 'Understand and work with large language models and generative AI technologies.',
    level: 'Advanced',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=450&fit=crop',
    startDate: '2024-04-15T10:00:00',
    endDate: '2024-04-15T18:00:00',
    duration: '8 hours',
    instructor: 'Dr. Saddam Hossain',
    mode: 'OFFLINE',
    fee: 500,
    maxParticipants: 25,
    registeredCount: 20,
    hasCertificate: true,
    isPublished: true,
    status: 'UPCOMING',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '6',
    title: 'Python for Data Science',
    slug: 'python-data-science',
    description: 'Learn Python programming essentials for data science and analytics.',
    level: 'Beginner',
    image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800&h=450&fit=crop',
    startDate: '2024-04-20T14:00:00',
    endDate: '2024-04-20T18:00:00',
    duration: '4 hours',
    instructor: 'Nusrat Jahan',
    mode: 'OFFLINE',
    fee: 500,
    maxParticipants: 50,
    registeredCount: 35,
    hasCertificate: true,
    isPublished: true,
    status: 'UPCOMING',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];
