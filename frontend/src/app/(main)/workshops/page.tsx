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
import { Card, CardContent, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Avatar } from '@/components/ui/Avatar';
import { Skeleton } from '@/components/ui/Skeleton';
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
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 hero-gradient" />
        <div className="absolute inset-0 pattern-grid opacity-10" />
        
        <div className="container-custom relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-white max-w-3xl mx-auto"
          >
            <Badge color="white" className="bg-white/20 text-white mb-6">Workshops</Badge>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">
              Learn AI Through Practice
            </h1>
            <p className="text-xl text-white/80">
              Hands-on workshops designed to build your AI skills from beginner to advanced
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-16 lg:top-20 z-30">
        <div className="container-custom">
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
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                    level === lvl
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
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
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container-custom">
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="h-48 rounded-none" />
                  <CardContent className="p-6">
                    <Skeleton className="h-6 w-3/4 mb-3" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-2/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredWorkshops.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredWorkshops.map((workshop, index) => {
                const LevelIcon = getLevelIcon(workshop.level);
                return (
                  <motion.div
                    key={workshop.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="overflow-hidden card-hover h-full flex flex-col">
                      {/* Workshop Image */}
                      <div className="aspect-video bg-gradient-to-br from-primary-400 to-secondary-400 relative">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <LevelIcon className="w-16 h-16 text-white/30" />
                        </div>
                        <div className="absolute top-4 left-4 flex gap-2">
                          <Badge color={getLevelColor(workshop.level) as any}>
                            {workshop.level}
                          </Badge>
                          {workshop.hasCertificate && (
                            <Badge color="yellow">
                              <Award className="w-3 h-3 mr-1" />
                              Certificate
                            </Badge>
                          )}
                        </div>
                      </div>

                      <CardContent className="p-6 flex-1 flex flex-col">
                        <CardTitle className="mb-3 line-clamp-2">{workshop.title}</CardTitle>
                        <CardDescription className="mb-4 line-clamp-2 flex-1">
                          {workshop.description}
                        </CardDescription>

                        {/* Workshop Details */}
                        <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(workshop.startDate)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>{workshop.duration}</span>
                          </div>
                          {workshop.maxParticipants && (
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4" />
                              <span>{workshop.registeredCount || 0}/{workshop.maxParticipants} seats</span>
                            </div>
                          )}
                        </div>

                        {/* Instructor */}
                        <div className="flex items-center gap-3 py-3 border-t border-gray-100 dark:border-gray-800">
                          <Avatar name={workshop.instructor || 'Instructor'} size="sm" />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {workshop.instructor || 'Club Instructor'}
                            </p>
                            <p className="text-xs text-gray-500">Instructor</p>
                          </div>
                        </div>

                        {/* CTA */}
                        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                          <Link href={`/workshops/${workshop.slug}`}>
                            <Button variant="primary" className="w-full">
                              View Details
                              <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-20">
              <BookOpen className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No workshops found
              </h3>
              <p className="text-gray-500">
                {search ? 'Try a different search term' : 'Check back later for upcoming workshops'}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container-custom">
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
                <Card className="h-full text-center card-hover">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                      <benefit.icon className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="mb-2">{benefit.title}</CardTitle>
                    <CardDescription>{benefit.description}</CardDescription>
                  </CardContent>
                </Card>
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
    startDate: '2024-03-20T10:00:00',
    endDate: '2024-03-20T16:00:00',
    duration: '6 hours',
    instructor: 'Rafiqul Islam',
    maxParticipants: 40,
    registeredCount: 28,
    hasCertificate: true,
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
    startDate: '2024-03-25T10:00:00',
    endDate: '2024-03-25T17:00:00',
    duration: '7 hours',
    instructor: 'Dr. Saddam Hossain',
    maxParticipants: 30,
    registeredCount: 25,
    hasCertificate: true,
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
    startDate: '2024-04-01T14:00:00',
    endDate: '2024-04-01T18:00:00',
    duration: '4 hours',
    instructor: 'Fatima Akter',
    maxParticipants: 35,
    registeredCount: 18,
    hasCertificate: true,
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
    startDate: '2024-04-08T10:00:00',
    endDate: '2024-04-08T15:00:00',
    duration: '5 hours',
    instructor: 'Kamal Hossain',
    maxParticipants: 30,
    registeredCount: 12,
    hasCertificate: true,
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
    startDate: '2024-04-15T10:00:00',
    endDate: '2024-04-15T18:00:00',
    duration: '8 hours',
    instructor: 'Dr. Saddam Hossain',
    maxParticipants: 25,
    registeredCount: 20,
    hasCertificate: true,
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
    startDate: '2024-04-20T14:00:00',
    endDate: '2024-04-20T18:00:00',
    duration: '4 hours',
    instructor: 'Nusrat Jahan',
    maxParticipants: 50,
    registeredCount: 35,
    hasCertificate: true,
    status: 'UPCOMING',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];
