'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users,
  ArrowLeft,
  Share2,
  Bookmark,
  CheckCircle,
  User,
  Globe,
  Linkedin,
  Twitter
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Skeleton } from '@/components/ui/Skeleton';
import { Modal, ModalHeader, ModalBody, ModalFooter } from '@/components/ui/Modal';
import { eventsApi } from '@/lib/api';
import { useAuthStore, useNotificationStore } from '@/lib/store';
import { Event } from '@/types';

// Mock data for development
const mockEvent: Event = {
  id: '1',
  title: 'Introduction to Machine Learning',
  slug: 'intro-machine-learning',
  description: `
    Join us for an immersive workshop on Machine Learning fundamentals! This comprehensive workshop is designed for beginners who want to start their journey in AI and Machine Learning.

    ## What You'll Learn
    - Understanding the basics of Machine Learning
    - Types of Machine Learning: Supervised, Unsupervised, Reinforcement
    - Building your first ML model with Python
    - Practical hands-on exercises
    - Real-world applications and case studies

    ## Prerequisites
    - Basic Python programming knowledge
    - Laptop with Python installed
    - Enthusiasm to learn!

    ## Who Should Attend
    This workshop is perfect for students who are curious about AI and want to get started with Machine Learning. No prior ML experience required.
  `,
  type: 'WORKSHOP',
  date: '2024-03-15',
  endDate: '2024-03-15',
  time: '10:00 AM - 4:00 PM',
  venue: 'DIU Auditorium, Building 1',
  capacity: 100,
  registrations: 45,
  status: 'UPCOMING',
  isPublished: true,
  isFeatured: true,
  speaker: {
    name: 'Dr. Rafiqul Islam',
    title: 'Associate Professor, CSE Department',
    bio: 'Dr. Rafiqul Islam is an expert in Machine Learning and AI with over 10 years of research experience.',
    image: undefined,
    social: {
      linkedin: 'https://linkedin.com',
      twitter: 'https://twitter.com',
      website: 'https://example.com',
    },
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const typeColors = {
  WORKSHOP: 'blue',
  SEMINAR: 'purple',
  BOOTCAMP: 'green',
  HACKATHON: 'orange',
  MEETUP: 'pink',
} as const;

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const { addNotification } = useNotificationStore();
  
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await eventsApi.getBySlug(params.slug as string);
        setEvent(response.data.data.event);
      } catch (error) {
        // Use mock data for development
        setEvent(mockEvent);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [params.slug]);

  const handleRegister = async () => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=/events/${params.slug}`);
      return;
    }

    setIsRegistering(true);
    try {
      await eventsApi.register(event!.id);
      setIsRegistered(true);
      addNotification({
        type: 'success',
        title: 'Registration Successful',
        message: 'You have been registered for this event.',
      });
    } catch (error: any) {
      addNotification({
        type: 'error',
        title: 'Registration Failed',
        message: error.response?.data?.message || 'Failed to register for event.',
      });
    } finally {
      setIsRegistering(false);
    }
  };

  const handleCancelRegistration = async () => {
    setIsRegistering(true);
    try {
      await eventsApi.cancelRegistration(event!.id);
      setIsRegistered(false);
      addNotification({
        type: 'success',
        title: 'Registration Cancelled',
        message: 'Your registration has been cancelled.',
      });
    } catch (error: any) {
      addNotification({
        type: 'error',
        title: 'Cancellation Failed',
        message: error.response?.data?.message || 'Failed to cancel registration.',
      });
    } finally {
      setIsRegistering(false);
    }
  };

  if (loading) {
    return (
      <div className="container-custom py-32">
        <Skeleton className="h-8 w-32 mb-8" />
        <Skeleton className="h-12 w-3/4 mb-4" />
        <Skeleton className="h-6 w-1/4 mb-8" />
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Skeleton className="h-64 w-full mb-8" />
            <Skeleton className="h-40 w-full" />
          </div>
          <div>
            <Skeleton className="h-80 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container-custom py-32 text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Event Not Found
        </h1>
        <p className="text-gray-500 mb-8">The event you're looking for doesn't exist.</p>
        <Link href="/events">
          <Button>Browse Events</Button>
        </Link>
      </div>
    );
  }

  const isFull = event.registrations >= event.capacity;
  const isPast = new Date(event.date) < new Date();

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
            <Link href="/events" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6">
              <ArrowLeft className="w-4 h-4" />
              Back to Events
            </Link>

            {/* Event Type & Status */}
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge color={typeColors[event.type as keyof typeof typeColors] || 'gray'}>
                {event.type}
              </Badge>
              <Badge color={isPast ? 'gray' : isFull ? 'red' : 'green'}>
                {isPast ? 'Completed' : isFull ? 'Full' : 'Open for Registration'}
              </Badge>
              {event.isFeatured && <Badge color="yellow">Featured</Badge>}
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-6">
              {event.title}
            </h1>

            {/* Event Meta */}
            <div className="flex flex-wrap gap-6 text-white/80">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span>{new Date(event.date).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>{event.time}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                <span>{event.venue}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                <span>{event.registrations}/{event.capacity} Registered</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12 bg-gray-50 dark:bg-gray-900">
        <div className="container-custom">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Description */}
              <Card>
                <CardHeader>
                  <CardTitle>About This Event</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose dark:prose-invert max-w-none">
                    {event.description?.split('\n').map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Speaker */}
              {event.speaker && (
                <Card>
                  <CardHeader>
                    <CardTitle>Speaker</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-start gap-4">
                      <Avatar name={event.speaker.name} size="xl" />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {event.speaker.name}
                        </h3>
                        <p className="text-primary-600 mb-2">{event.speaker.title}</p>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                          {event.speaker.bio}
                        </p>
                        {event.speaker.social && (
                          <div className="flex gap-2">
                            {event.speaker.social.linkedin && (
                              <a href={event.speaker.social.linkedin} target="_blank" rel="noopener noreferrer">
                                <Button variant="ghost" size="sm" className="p-2">
                                  <Linkedin className="w-4 h-4" />
                                </Button>
                              </a>
                            )}
                            {event.speaker.social.twitter && (
                              <a href={event.speaker.social.twitter} target="_blank" rel="noopener noreferrer">
                                <Button variant="ghost" size="sm" className="p-2">
                                  <Twitter className="w-4 h-4" />
                                </Button>
                              </a>
                            )}
                            {event.speaker.social.website && (
                              <a href={event.speaker.social.website} target="_blank" rel="noopener noreferrer">
                                <Button variant="ghost" size="sm" className="p-2">
                                  <Globe className="w-4 h-4" />
                                </Button>
                              </a>
                            )}
                          </div>
                        )}
                      </div>
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
                  {/* Capacity */}
                  <div className="mb-6">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-500">Registration</span>
                      <span className="font-medium">{event.registrations}/{event.capacity}</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${isFull ? 'bg-red-500' : 'bg-primary-500'}`}
                        style={{ width: `${Math.min((event.registrations / event.capacity) * 100, 100)}%` }}
                      />
                    </div>
                    {isFull && (
                      <p className="text-sm text-red-500 mt-2">This event is full</p>
                    )}
                  </div>

                  {/* Actions */}
                  {!isPast && (
                    <>
                      {isRegistered ? (
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-green-600 mb-4">
                            <CheckCircle className="w-5 h-5" />
                            <span className="font-medium">You're registered!</span>
                          </div>
                          <Button 
                            variant="outline" 
                            className="w-full"
                            onClick={handleCancelRegistration}
                            isLoading={isRegistering}
                          >
                            Cancel Registration
                          </Button>
                        </div>
                      ) : (
                        <Button 
                          className="w-full" 
                          disabled={isFull}
                          onClick={handleRegister}
                          isLoading={isRegistering}
                        >
                          {isFull ? 'Event Full' : 'Register Now'}
                        </Button>
                      )}
                    </>
                  )}

                  {isPast && (
                    <div className="text-center py-4">
                      <Badge color="gray" size="lg">Event Completed</Badge>
                    </div>
                  )}

                  {/* Share & Bookmark */}
                  <div className="flex gap-2 mt-4">
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => setShowShareModal(true)}
                    >
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

      {/* Share Modal */}
      <Modal isOpen={showShareModal} onClose={() => setShowShareModal(false)} size="sm">
        <ModalHeader onClose={() => setShowShareModal(false)}>
          Share Event
        </ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            <p className="text-gray-600 dark:text-gray-400">
              Share this event with your friends!
            </p>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1">
                <Twitter className="w-4 h-4 mr-2" />
                Twitter
              </Button>
              <Button variant="outline" className="flex-1">
                <Linkedin className="w-4 h-4 mr-2" />
                LinkedIn
              </Button>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Copy Link
              </label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={typeof window !== 'undefined' ? window.location.href : ''}
                  readOnly
                  className="flex-1 px-3 py-2 border rounded-lg bg-gray-50 dark:bg-gray-800 text-sm"
                />
                <Button variant="outline" size="sm">Copy</Button>
              </div>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
}
