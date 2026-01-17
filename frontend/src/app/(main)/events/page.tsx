'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Search,
  ArrowRight
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Skeleton } from '@/components/ui/Skeleton';
import FadeContent from '@/components/FadeContent';
import { eventsApi } from '@/lib/api';
import { Event } from '@/types';

const eventTypes = ['All', 'Workshop', 'Seminar', 'Competition', 'Meetup', 'Conference'];

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await eventsApi.getAll({ type: filter !== 'All' ? filter : undefined });
        setEvents(response.data.events || mockEvents);
      } catch (error) {
        setEvents(mockEvents);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [filter]);

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(search.toLowerCase()) ||
    event.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-black">
        {/* Background Orbs */}
        <div className="absolute inset-0">
          <div className="orb orb-purple w-96 h-96 top-1/4 left-1/4" />
          <div className="orb orb-pink w-96 h-96 bottom-1/4 right-1/4" />
        </div>

        {/* Grid Overlay */}
        <div className="absolute inset-0 grid-overlay opacity-30" />

        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <Badge color="purple" className="mb-6">Events</Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 text-white">
              Explore Our <span className="gradient-text">Events</span>
            </h1>
            <p className="text-xl text-[#B5B5C3]">
              Discover workshops, seminars, hackathons, and more to enhance your AI journey
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-black relative overflow-hidden border-b border-white/10">
        {/* Subtle Orb */}
        <div className="absolute inset-0">
          <div className="orb orb-cyan w-64 h-64 top-1/2 right-1/4 opacity-30" />
        </div>

        <div className="container-custom relative z-10">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="w-full md:w-96">
              <Input
                type="search"
                placeholder="Search events..."
                leftIcon={<Search className="w-5 h-5" />}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2">
              {eventTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setFilter(type)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === type
                    ? 'bg-gradient-to-r from-[#7B61FF] to-[#FF4FD8] text-white shadow-glow-purple'
                    : 'bg-white/5 text-[#B5B5C3] hover:bg-white/10 hover:text-white'
                    }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-20 bg-black relative overflow-hidden">
        {/* Background Orbs */}
        <div className="absolute inset-0">
          <div className="orb orb-blue w-96 h-96 top-1/3 left-1/4" />
          <div className="orb orb-pink w-96 h-96 bottom-1/3 right-1/3" />
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
          ) : filteredEvents.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="glass rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 h-full flex flex-col border border-white/5">
                    {/* Event Image */}
                    <div className="aspect-video bg-gradient-to-br from-[#7B61FF] to-[#FF4FD8] relative overflow-hidden">
                      {event.image && (
                        <img
                          src={event.image}
                          alt={event.title}
                          className="w-full h-full object-cover"
                        />
                      )}
                      <Badge
                        color={getEventTypeColor(event.type)}
                        className="absolute top-4 left-4"
                      >
                        {event.type}
                      </Badge>
                      {event.isFeatured && (
                        <Badge color="yellow" className="absolute top-4 right-4">
                          Featured
                        </Badge>
                      )}
                    </div>

                    <div className="p-6 flex-1 flex flex-col">
                      <h3 className="text-xl font-bold text-white mb-3 line-clamp-2">{event.title}</h3>
                      <p className="text-[#B5B5C3] mb-4 line-clamp-2">
                        {event.description}
                      </p>

                      <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm text-[#8A8A9E] mb-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-[#7B61FF] flex-shrink-0" />
                          <span className="truncate">{formatDate(event.startDate)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-[#7B61FF] flex-shrink-0" />
                          <span className="truncate">{formatTime(event.startDate)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-[#7B61FF] flex-shrink-0" />
                          <span className="truncate">{event.venue}</span>
                        </div>
                        {event.maxParticipants && (
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-[#7B61FF] flex-shrink-0" />
                            <span className="truncate">{event.registeredCount || 0}/{event.maxParticipants} Reg.</span>
                          </div>
                        )}
                      </div>

                      <div className="mt-auto pt-4 border-t border-white/10">
                        <Link href={`/events/${event.id}`} className="block w-full">
                          <FadeContent blur={true} duration={500} delay={200}>
                            <button className="group relative w-full overflow-hidden rounded-xl border border-white/20 bg-transparent px-6 py-3 font-semibold text-white transition-all hover:bg-white/10 hover:border-white/40 hover:scale-[1.01]">
                              <span className="flex items-center justify-center gap-2">
                                View Details
                                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                              </span>
                            </button>
                          </FadeContent>
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <Calendar className="w-16 h-16 mx-auto text-[#7B61FF] mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                No events found
              </h3>
              <p className="text-[#B5B5C3]">
                {search ? 'Try a different search term' : 'Check back later for upcoming events'}
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

// Helper functions
function getEventTypeColor(type: string): 'blue' | 'purple' | 'green' | 'orange' | 'red' {
  const colors: Record<string, 'blue' | 'purple' | 'green' | 'orange' | 'red'> = {
    'Workshop': 'blue',
    'Seminar': 'green',
    'Competition': 'purple',
    'Meetup': 'orange',
    'Conference': 'red',
  };
  return colors[type] || 'blue';
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatTime(date: string): string {
  return new Date(date).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

// Mock data
const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Introduction to Machine Learning',
    slug: 'intro-to-ml',
    description: 'Learn the fundamentals of machine learning and build your first model.',
    type: 'Workshop',
    image: 'https://images.unsplash.com/photo-1555255707-c07966088b7b?w=800&h=450&fit=crop',
    startDate: '2024-03-15T15:00:00',
    endDate: '2024-03-15T18:00:00',
    venue: 'CSE Lab 1, DIU',
    maxParticipants: 50,
    registeredCount: 35,
    isFeatured: true,
    status: 'UPCOMING',
    fee: 0,
    isPublished: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'AI Hackathon 2024',
    slug: 'ai-hackathon-2024',
    description: '24-hour hackathon to build innovative AI solutions for real-world problems.',
    type: 'Competition',
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=450&fit=crop',
    startDate: '2024-03-25T09:00:00',
    endDate: '2024-03-26T09:00:00',
    venue: 'DIU Auditorium',
    maxParticipants: 200,
    registeredCount: 150,
    isFeatured: true,
    status: 'UPCOMING',
    fee: 200,
    isPublished: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Deep Learning with PyTorch',
    slug: 'deep-learning-pytorch',
    description: 'Hands-on workshop on building neural networks using PyTorch framework.',
    type: 'Workshop',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=450&fit=crop',
    startDate: '2024-04-05T14:00:00',
    endDate: '2024-04-05T17:00:00',
    venue: 'SWE Lab 2, DIU',
    maxParticipants: 40,
    registeredCount: 20,
    isFeatured: false,
    status: 'UPCOMING',
    fee: 100,
    isPublished: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '4',
    title: 'AI in Healthcare Seminar',
    slug: 'ai-healthcare-seminar',
    description: 'Industry experts discuss the applications of AI in modern healthcare.',
    type: 'Seminar',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=450&fit=crop',
    startDate: '2024-04-12T10:00:00',
    endDate: '2024-04-12T13:00:00',
    venue: 'DIU Conference Hall',
    maxParticipants: 100,
    registeredCount: 45,
    isFeatured: false,
    status: 'UPCOMING',
    fee: 50,
    isPublished: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '5',
    title: 'Monthly AI Meetup',
    slug: 'monthly-meetup-march',
    description: 'Network with fellow AI enthusiasts and share your projects.',
    type: 'Meetup',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=450&fit=crop',
    startDate: '2024-03-30T16:00:00',
    endDate: '2024-03-30T18:00:00',
    venue: 'DIU Cafeteria',
    maxParticipants: 30,
    registeredCount: 28,
    isFeatured: false,
    status: 'UPCOMING',
    fee: 0,
    isPublished: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '6',
    title: 'Computer Vision Fundamentals',
    slug: 'cv-fundamentals',
    description: 'Learn image processing and object detection techniques.',
    type: 'Workshop',
    image: 'https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=800&h=450&fit=crop',
    startDate: '2024-04-20T15:00:00',
    endDate: '2024-04-20T18:00:00',
    venue: 'CSE Lab 3, DIU',
    maxParticipants: 35,
    registeredCount: 15,
    isFeatured: false,
    status: 'UPCOMING',
    fee: 150,
    isPublished: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];
