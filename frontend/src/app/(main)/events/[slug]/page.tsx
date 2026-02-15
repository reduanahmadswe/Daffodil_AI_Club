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
  CheckCircle,
  X,
  Share2,
  AlertCircle,
  Linkedin,
  Twitter,
  Globe,
  User
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Skeleton } from '@/components/ui/Skeleton';
import { Modal, ModalHeader, ModalBody, ModalFooter } from '@/components/ui/Modal';
import { eventsApi } from '@/lib/api';
import { useAuthStore, useNotificationStore } from '@/lib/store';
import { Event } from '@/types';
import { formatDate } from '@/lib/utils';

// Mock data for development
const mockEvent: Event = {
  id: '1',
  title: 'Introduction to Machine Learning',
  slug: 'intro-machine-learning',
  description: `
    Join us for an immersive workshop on Machine Learning basics. This session is designed for beginners who want to understand the core concepts of ML and how to get started with their first model.
    
    ## What You'll Learn
    
    - Fundamentals of Machine Learning
    - Supervised vs Unsupervised Learning
    - Introduction to Python for ML
    - Building your first ML model
    
    ## Prerequisites
    
    - Basic knowledge of Python
    - Laptop with Python installed
    - Enthusiasm for learning AI!
    
    ## Schedule
    
    - **10:00 AM**: Registration
    - **10:30 AM**: Keynote Speech
    - **11:00 AM**: Workflow Fundamentals
    - **1:00 PM**: Lunch Break
    - **2:00 PM**: Hands-on Session
  `,
  type: 'WORKSHOP',
  startDate: '2024-03-15T10:00:00',
  endDate: '2024-03-15T16:00:00',
  venue: 'DIU Auditorium, Building 1',
  maxParticipants: 100,
  registeredCount: 45,
  status: 'UPCOMING',
  fee: 0,
  isPublished: true,
  isFeatured: true,
  image: 'https://images.unsplash.com/photo-1591453089816-0fbb971b454c?w=1200&h=600&fit=crop',
  speaker: {
    id: '1',
    name: 'Dr. Rafiqul Islam',
    title: 'Associate Professor, CSE Department',
    bio: 'Dr. Rafiqul Islam is an expert in Machine Learning and AI with over 10 years of research experience.',
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
  COMPETITION: 'red',
} as const;

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const { addNotification } = useNotificationStore();

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await eventsApi.getBySlug(params.slug as string);
        setEvent(response.data.event);
        // Check if user is registered (mock logic)
        if (isAuthenticated) {
          setIsRegistered(response.data.isRegistered || false);
        }
      } catch (error) {
        setEvent(mockEvent);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [params.slug, isAuthenticated]);

  const handleRegister = async () => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/events/' + params.slug);
      return;
    }

    setShowRegisterModal(true);
  };

  const confirmRegistration = async () => {
    setProcessing(true);
    try {
      await eventsApi.register(event!.id);
      setIsRegistered(true);
      setEvent(prev => prev ? { ...prev, registeredCount: (prev.registeredCount || 0) + 1 } : null);
      addNotification('Successfully registered for the event!', 'success');
      setShowRegisterModal(false);
    } catch (error) {
      addNotification('Failed to register. Please try again.', 'error');
    } finally {
      setProcessing(false);
    }
  };

  const handleCancelRegistration = async () => {
    setShowCancelModal(true);
  };

  const confirmCancellation = async () => {
    setProcessing(true);
    try {
      await eventsApi.cancelRegistration(event!.id);
      setIsRegistered(false);
      setEvent(prev => prev ? { ...prev, registeredCount: Math.max(0, (prev.registeredCount || 0) - 1) } : null);
      addNotification('Registration cancelled successfully.', 'success');
      setShowCancelModal(false);
    } catch (error) {
      addNotification('Failed to cancel registration.', 'error');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black pt-32 pb-20">
        <div className="container-custom">
          <Skeleton className="h-8 w-32 mb-8 bg-nexus-glass" />
          <Skeleton className="h-12 w-3/4 mb-4 bg-nexus-glass" />
          <Skeleton className="h-6 w-1/4 mb-8 bg-nexus-glass" />
          <Skeleton className="h-[400px] w-full mb-8 bg-nexus-glass" />
          <div className="space-y-4">
            <Skeleton className="h-6 w-full bg-nexus-glass" />
            <Skeleton className="h-6 w-full bg-nexus-glass" />
            <Skeleton className="h-6 w-3/4 bg-nexus-glass" />
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-black pt-32 pb-20">
        <div className="container-custom text-center">
          <h1 className="text-2xl font-bold text-nexus-text mb-4">
            Event Not Found
          </h1>
          <p className="text-nexus-text-secondary mb-8">The event you're looking for doesn't exist.</p>
          <Link href="/events">
            <button className="btn-nexus-primary px-6 py-3 rounded-xl">Browse Events</button>
          </Link>
        </div>
      </div>
    );
  }

  const isFull = (event.registeredCount || 0) >= (event.maxParticipants || 0);
  const remainingSpots = (event.maxParticipants || 0) - (event.registeredCount || 0);

  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-40 pb-20 overflow-hidden bg-black">
        {/* Background Orbs */}
        <div className="absolute inset-0">
          <div className="orb orb-purple w-96 h-96 top-1/4 left-1/4" />
          <div className="orb orb-pink w-96 h-96 bottom-1/4 right-1/4" />
        </div>

        {/* Grid Overlay */}
        <div className="absolute inset-0 grid-overlay opacity-30" />

        <div className="container-custom relative max-w-5xl mx-auto z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Back Button */}
            <Link href="/events" className="inline-flex items-center gap-2 text-nexus-text-secondary hover:text-nexus-text mb-6 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back to Events
            </Link>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge color={typeColors[event.type as keyof typeof typeColors] || 'blue'}>
                {event.type}
              </Badge>
              {event.isFeatured && <Badge color="yellow">Featured</Badge>}
              <Badge color={isFull ? 'red' : 'green'}>
                {isFull ? 'Sold Out' : 'Registration Open'}
              </Badge>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-nexus-text mb-6">
              {event.title}
            </h1>

            {/* Meta Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 text-nexus-text-secondary">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-nexus-glass border border-nexus-border">
                  <Calendar className="w-5 h-5 text-nexus-pink" />
                </div>
                <div>
                  <p className="text-xs text-nexus-text-muted uppercase tracking-wider font-semibold">Date</p>
                  <p className="text-nexus-text font-medium">{formatDate(event.startDate)}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-nexus-glass border border-nexus-border">
                  <Clock className="w-5 h-5 text-nexus-purple" />
                </div>
                <div>
                  <p className="text-xs text-nexus-text-muted uppercase tracking-wider font-semibold">Time</p>
                  <p className="text-nexus-text font-medium">
                    {new Date(event.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-nexus-glass border border-nexus-border">
                  <MapPin className="w-5 h-5 text-nexus-cyan" />
                </div>
                <div>
                  <p className="text-xs text-nexus-text-muted uppercase tracking-wider font-semibold">Venue</p>
                  <p className="text-nexus-text font-medium truncate" title={event.venue}>{event.venue}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-nexus-glass border border-nexus-border">
                  <Users className="w-5 h-5 text-nexus-blue" />
                </div>
                <div>
                  <p className="text-xs text-nexus-text-muted uppercase tracking-wider font-semibold">Availability</p>
                  <p className="text-nexus-text font-medium">{remainingSpots} spots left</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4">
              {!isRegistered ? (
                <button
                  onClick={handleRegister}
                  disabled={isFull}
                  className={`btn-nexus-primary px-8 py-3 rounded-xl flex items-center gap-2 ${isFull ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <CheckCircle className="w-5 h-5" />
                  {isFull ? 'Event Full' : 'Register Now'}
                </button>
              ) : (
                <div className="flex gap-4">
                  <button className="px-8 py-3 rounded-xl bg-green-500/20 text-green-400 border border-green-500/30 flex items-center gap-2 cursor-default">
                    <CheckCircle className="w-5 h-5" />
                    You're Registered
                  </button>
                  <button
                    onClick={handleCancelRegistration}
                    className="px-6 py-3 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-all flex items-center gap-2"
                  >
                    Cancel
                  </button>
                </div>
              )}
              <button className="px-6 py-3 rounded-xl bg-nexus-glass border border-nexus-border text-nexus-text hover:bg-nexus-glass transition-all flex items-center gap-2">
                <Share2 className="w-5 h-5" />
                Share Event
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Hero Image */}
      {event.image && (
        <section className="relative bg-black">
          <div className="container-custom max-w-5xl">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-purple-900/20">
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-[400px] object-cover"
              />
            </div>
          </div>
        </section>
      )}

      {/* Content Section */}
      <section className="py-20 bg-black relative overflow-hidden">
        {/* Background Orbs */}
        <div className="absolute inset-0">
          <div className="orb orb-blue w-96 h-96 top-1/3 left-1/4 opacity-20" />
        </div>

        <div className="container-custom relative z-10">
          <div className="max-w-5xl mx-auto grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Event Description */}
              <div className="glass rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-nexus-text mb-6">About Event</h2>
                <article className="prose prose-invert prose-lg max-w-none prose-headings:text-nexus-text prose-p:text-nexus-text-secondary prose-strong:text-nexus-text prose-li:text-nexus-text-secondary">
                  {event.description?.split('\n').map((line, index) => {
                    if (line.startsWith('# ')) {
                      return <h1 key={index} className="text-2xl font-bold mb-4">{line.slice(2)}</h1>;
                    } else if (line.startsWith('## ')) {
                      return <h2 key={index} className="text-xl font-bold mt-8 mb-4">{line.slice(3)}</h2>;
                    } else if (line.startsWith('### ')) {
                      return <h3 key={index} className="text-lg font-bold mt-6 mb-3">{line.slice(4)}</h3>;
                    } else if (line.startsWith('- **')) {
                      // Handle scheduling items bold part specially
                      const parts = line.split('**');
                      return (
                        <li key={index} className="ml-4 mb-2">
                          <strong className="text-nexus-text">{parts[1]}</strong>{parts.slice(2).join('**')}
                        </li>
                      );
                    } else if (line.startsWith('- ')) {
                      return <li key={index} className="ml-4 mb-2">{line.slice(2)}</li>;
                    } else if (line.trim()) {
                      return <p key={index} className="mb-4 leading-relaxed">{line}</p>;
                    }
                    return null;
                  })}
                </article>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Speaker Card */}
              {event.speaker && (
                <div className="glass rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-nexus-text mb-6">Speaker</h3>
                  <div className="flex flex-col items-center text-center">
                    <Avatar name={event.speaker.name} size="xl" />
                    <h4 className="mt-4 text-lg font-bold text-nexus-text">{event.speaker.name}</h4>
                    <p className="text-sm text-nexus-blue font-medium mb-3">{event.speaker.title}</p>
                    <p className="text-sm text-nexus-text-secondary mb-6">{event.speaker.bio}</p>

                    <div className="flex gap-3">
                      {event.speaker.social?.linkedin && (
                        <a href={event.speaker.social.linkedin} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-nexus-glass text-nexus-text-secondary hover:text-[#0077b5] hover:bg-nexus-glass transition-all">
                          <Linkedin className="w-5 h-5" />
                        </a>
                      )}
                      {event.speaker.social?.twitter && (
                        <a href={event.speaker.social.twitter} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-nexus-glass text-nexus-text-secondary hover:text-[#1DA1F2] hover:bg-nexus-glass transition-all">
                          <Twitter className="w-5 h-5" />
                        </a>
                      )}
                      {event.speaker.social?.website && (
                        <a href={event.speaker.social.website} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-nexus-glass text-nexus-text-secondary hover:text-nexus-text hover:bg-nexus-glass transition-all">
                          <Globe className="w-5 h-5" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Location Map Placeholder */}
              <div className="glass rounded-2xl p-6">
                <h3 className="text-xl font-bold text-nexus-text mb-4">Location</h3>
                <div className="bg-nexus-glass rounded-xl h-48 w-full flex items-center justify-center border border-nexus-border">
                  <div className="text-center p-4">
                    <MapPin className="w-8 h-8 text-nexus-cyan mx-auto mb-2" />
                    <p className="text-nexus-text text-sm font-medium">{event.venue}</p>
                    <p className="text-nexus-text-secondary text-xs mt-1">Daffodil International University</p>
                  </div>
                </div>
                <button className="w-full mt-4 py-2 rounded-lg border border-nexus-border text-nexus-text-secondary hover:text-nexus-text hover:bg-nexus-glass transition-all text-sm font-medium">
                  Get Directions
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Registration Modal */}
      <Modal isOpen={showRegisterModal} onClose={() => setShowRegisterModal(false)} title="Confirm Registration">
        <ModalBody>
          <div className="space-y-4">
            <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5 shrink-0" />
              <div>
                <h4 className="text-blue-400 font-bold text-sm mb-1">Confirm your spot</h4>
                <p className="text-blue-200/70 text-sm">
                  You are about to register for <span className="text-nexus-text">{event.title}</span>.
                  An email confirmation will be sent to your registered address.
                </p>
              </div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <button
            onClick={() => setShowRegisterModal(false)}
            className="px-4 py-2 rounded-lg text-nexus-text-secondary hover:text-nexus-text hover:bg-nexus-glass"
          >
            Cancel
          </button>
          <button
            onClick={confirmRegistration}
            disabled={processing}
            className="btn-nexus-primary px-6 py-2 rounded-lg flex items-center gap-2"
          >
            {processing ? 'Registering...' : 'Confirm Registration'}
          </button>
        </ModalFooter>
      </Modal>

      {/* Cancel Modal */}
      <Modal isOpen={showCancelModal} onClose={() => setShowCancelModal(false)} title="Cancel Registration">
        <ModalBody>
          <p className="text-nexus-text-secondary">
            Are you sure you want to cancel your registration? This action cannot be undone and you might lose your spot if the event fills up.
          </p>
        </ModalBody>
        <ModalFooter>
          <button
            onClick={() => setShowCancelModal(false)}
            className="px-4 py-2 rounded-lg text-nexus-text-secondary hover:text-nexus-text hover:bg-nexus-glass"
          >
            Keep Spot
          </button>
          <button
            onClick={confirmCancellation}
            disabled={processing}
            className="px-6 py-2 rounded-lg bg-red-500 text-nexus-text hover:bg-red-600 transition-colors"
          >
            {processing ? 'Cancelling...' : 'Yes, Cancel'}
          </button>
        </ModalFooter>
      </Modal>
    </>
  );
}
