'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Users,
  BookOpen,
  CheckCircle,
  Laptop,
  Award,
  Download,
  Share2,
  Bookmark
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Skeleton } from '@/components/ui/Skeleton';
import { workshopsApi } from '@/lib/api';
import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks';
import { addNotification } from '@/lib/redux/slices/notificationSlice';
import { Workshop } from '@/types';
import { formatDate } from '@/lib/utils';

// Mock data
const mockWorkshop: Workshop = {
  id: '1',
  title: 'Complete Python for Data Science',
  slug: 'python-data-science',
  description: `
Master Python for Data Science in this comprehensive 4-week workshop series. From basics to advanced analytics, you'll learn everything you need to start your data science journey.

This workshop series is designed for beginners who want to build a strong foundation in Python and data science.
  `,
  syllabus: [
    {
      week: 1,
      title: 'Python Fundamentals',
      topics: [
        'Python syntax and data types',
        'Control flow (if/else, loops)',
        'Functions and modules',
        'File handling',
      ],
    },
    {
      week: 2,
      title: 'Data Manipulation with Pandas',
      topics: [
        'Introduction to Pandas',
        'DataFrames and Series',
        'Data cleaning and preprocessing',
        'Grouping and aggregation',
      ],
    },
    {
      week: 3,
      title: 'Data Visualization',
      topics: [
        'Matplotlib basics',
        'Seaborn for statistical visualization',
        'Interactive plots with Plotly',
        'Creating dashboards',
      ],
    },
    {
      week: 4,
      title: 'Introduction to Machine Learning',
      topics: [
        'Scikit-learn overview',
        'Supervised learning basics',
        'Model training and evaluation',
        'Hands-on project',
      ],
    },
  ],
  prerequisites: [
    'Basic computer skills',
    'No prior programming experience required',
    'Laptop with Python installed (installation guide provided)',
    'Enthusiasm to learn!',
  ],
  level: 'BEGINNER',
  duration: '4 weeks',
  totalHours: 24,
  sessions: 8,
  schedule: 'Every Saturday & Sunday, 10:00 AM - 1:00 PM',
  startDate: '2024-03-02',
  endDate: '2024-03-24',
  venue: 'DIU Computer Lab, Building 5',
  mode: 'OFFLINE',
  capacity: 40,
  registrations: 28,
  fee: 500,
  price: 500,
  status: 'UPCOMING',
  instructor: {
    name: 'Dr. Mahmudul Hasan',
    title: 'Professor, Department of CSE',
    bio: 'Dr. Mahmudul has 15+ years of experience in teaching programming and data science.',
    image: undefined,
  },
  materials: [
    'Course slides (PDF)',
    'Jupyter notebooks',
    'Practice datasets',
    'Reference guides',
  ],
  hasCertificate: true,
  certificate: true,
  isPublished: true,
  isFeatured: true,
  createdAt: '2024-02-01',
  updatedAt: '2024-02-15',
};

const levelColors = {
  BEGINNER: 'green',
  INTERMEDIATE: 'yellow',
  ADVANCED: 'red',
} as const;

export default function WorkshopDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const [workshop, setWorkshop] = useState<Workshop | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [activeWeek, setActiveWeek] = useState(1);

  useEffect(() => {
    const fetchWorkshop = async () => {
      try {
        const response = await workshopsApi.getBySlug(params.slug as string);
        setWorkshop(response.data.data.workshop);
      } catch (error) {
        // Use mock data for development
        setWorkshop(mockWorkshop);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkshop();
  }, [params.slug]);

  const handleRegister = async () => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=/workshops/${params.slug}`);
      return;
    }

    setIsRegistering(true);
    try {
      await workshopsApi.register(workshop!.id);
      setIsRegistered(true);
      dispatch(addNotification({ message: 'You have been registered for this workshop.', type: 'success' }));
    } catch (error: any) {
      dispatch(addNotification({ message: error.response?.data?.message || 'Failed to register for workshop.', type: 'error' }));
    } finally {
      setIsRegistering(false);
    }
  };

  if (loading) {
    return (
      <div className="container-custom py-32">
        <Skeleton className="h-8 w-32 mb-8" />
        <Skeleton className="h-12 w-3/4 mb-4" />
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Skeleton className="h-64 w-full mb-8" />
            <Skeleton className="h-96 w-full" />
          </div>
          <div>
            <Skeleton className="h-96 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!workshop) {
    return (
      <div className="container-custom py-32 text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Workshop Not Found
        </h1>
        <p className="text-gray-500 mb-8">The workshop you're looking for doesn't exist.</p>
        <Link href="/workshops">
          <Button>Browse Workshops</Button>
        </Link>
      </div>
    );
  }

  const isFull = (workshop.registrations || 0) >= (workshop.capacity || 0);
  const isPast = new Date(workshop.startDate) < new Date();

  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 hero-gradient" />
        <div className="absolute inset-0 pattern-grid opacity-10" />

        <div className="container-custom relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Back Button */}
            <Link href="/workshops" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6">
              <ArrowLeft className="w-4 h-4" />
              Back to Workshops
            </Link>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge color={levelColors[workshop.level as keyof typeof levelColors] || 'gray'}>
                {workshop.level}
              </Badge>
              {workshop.certificate && (
                <Badge color="yellow">
                  <Award className="w-3 h-3 mr-1" />
                  Certificate
                </Badge>
              )}
              {workshop.isFeatured && <Badge color="blue">Featured</Badge>}
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-6">
              {workshop.title}
            </h1>

            {/* Meta Info */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="flex items-center gap-2 text-white/80">
                <Calendar className="w-5 h-5" />
                <span>{formatDate(workshop.startDate || new Date())} - {workshop.endDate ? formatDate(workshop.endDate) : 'TBA'}</span>
              </div>
              <div className="flex items-center gap-2 text-white/80">
                <Clock className="w-5 h-5" />
                <span>{workshop.totalHours} hours • {workshop.sessions} sessions</span>
              </div>
              <div className="flex items-center gap-2 text-white/80">
                <MapPin className="w-5 h-5" />
                <span>{workshop.venue}</span>
              </div>
              <div className="flex items-center gap-2 text-white/80">
                <Users className="w-5 h-5" />
                <span>{workshop.registrations || 0}/{workshop.capacity || 0} Seats</span>
              </div>
            </div>

            {/* Instructor */}
            {workshop.instructor && typeof workshop.instructor !== 'string' && (
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4 inline-flex">
                <Avatar name={workshop.instructor.name} size="lg" />
                <div>
                  <p className="font-medium text-white">{workshop.instructor.name}</p>
                  <p className="text-white/70 text-sm">{workshop.instructor.title}</p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12 bg-gray-50 dark:bg-gray-900">
        <div className="container-custom">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* About */}
              <Card>
                <CardHeader>
                  <CardTitle>About This Workshop</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose dark:prose-invert max-w-none">
                    {workshop.description?.split('\n').map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Syllabus */}
              {workshop.syllabus && Array.isArray(workshop.syllabus) && workshop.syllabus.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5" />
                      Course Syllabus
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {/* Week Tabs */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {workshop.syllabus.map((week: any) => (
                        <button
                          key={week.week}
                          onClick={() => setActiveWeek(week.week)}
                          className={`px-4 py-2 rounded-lg font-medium transition-all ${activeWeek === week.week
                            ? 'bg-primary-500 text-white'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                            }`}
                        >
                          Week {week.week}
                        </button>
                      ))}
                    </div>

                    {/* Week Content */}
                    {workshop.syllabus.filter((w: any) => w.week === activeWeek).map((week: any) => (
                      <div key={week.week}>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                          {week.title}
                        </h3>
                        <ul className="space-y-3">
                          {week.topics.map((topic: string, index: number) => (
                            <li key={index} className="flex items-start gap-3">
                              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                              <span className="text-gray-600 dark:text-gray-400">{topic}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Prerequisites */}
              {workshop.prerequisites && Array.isArray(workshop.prerequisites) && workshop.prerequisites.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Laptop className="w-5 h-5" />
                      Prerequisites
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {workshop.prerequisites.map((prereq: string, index: number) => (
                        <li key={index} className="flex items-start gap-3">
                          <div className="w-2 h-2 rounded-full bg-primary-500 flex-shrink-0 mt-2" />
                          <span className="text-gray-600 dark:text-gray-400">{prereq}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Materials */}
              {workshop.materials && workshop.materials.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Download className="w-5 h-5" />
                      Course Materials
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      You'll receive the following materials:
                    </p>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {workshop.materials.map((material, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800"
                        >
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          <span className="text-gray-700 dark:text-gray-300">{material}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Registration Card */}
              <Card className="sticky top-24">
                <CardContent className="p-6">
                  {/* Price */}
                  <div className="text-center mb-6">
                    <p className="text-4xl font-bold text-gray-900 dark:text-white">
                      {workshop.price === 0 ? 'Free' : `৳${workshop.price}`}
                    </p>
                    <p className="text-gray-500">
                      {workshop.sessions} sessions • {workshop.totalHours} hours
                    </p>
                  </div>

                  {/* Capacity Progress */}
                  <div className="mb-6">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-500">Seats Available</span>
                      <span className="font-medium">
                        {(workshop.capacity || 0) - (workshop.registrations || 0)} left
                      </span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${isFull ? 'bg-red-500' : 'bg-primary-500'}`}
                        style={{ width: `${((workshop.registrations || 0) / (workshop.capacity || 100)) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Schedule */}
                  <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                    <p className="font-medium text-gray-900 dark:text-white mb-2">Schedule</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{workshop.schedule}</p>
                  </div>

                  {/* Registration Button */}
                  {!isPast && (
                    <>
                      {isRegistered ? (
                        <div className="text-center py-4">
                          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
                          <p className="font-medium text-green-600">You're enrolled!</p>
                        </div>
                      ) : (
                        <Button
                          className="w-full"
                          size="lg"
                          disabled={isFull}
                          onClick={handleRegister}
                          isLoading={isRegistering}
                        >
                          {isFull ? 'Workshop Full' : 'Enroll Now'}
                        </Button>
                      )}
                    </>
                  )}

                  {isPast && (
                    <div className="text-center py-4">
                      <Badge color="gray" size="lg">Workshop Completed</Badge>
                    </div>
                  )}

                  {/* Certificate Badge */}
                  {workshop.certificate && (
                    <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl text-center">
                      <Award className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                      <p className="font-medium text-yellow-700 dark:text-yellow-400">
                        Certificate of Completion
                      </p>
                      <p className="text-sm text-yellow-600 dark:text-yellow-500">
                        Earn a certificate upon completion
                      </p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 mt-6">
                    <Button variant="outline" className="flex-1">
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                    <Button variant="outline" className="p-2">
                      <Bookmark className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
