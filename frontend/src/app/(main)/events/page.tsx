'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Filter,
  Search,
  ArrowRight,
  ChevronDown
} from 'lucide-react';
import { Card, CardContent, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Skeleton } from '@/components/ui/Skeleton';
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
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 hero-gradient" />
        <div className="absolute inset-0 pattern-grid opacity-10" />
        
        <div className="container-custom relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-white max-w-3xl mx-auto"
          >
            <Badge color="white" className="bg-white/20 text-white mb-6">Events</Badge>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">
              Explore Our Events
            </h1>
            <p className="text-xl text-white/80">
              Discover workshops, seminars, hackathons, and more to enhance your AI journey
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-16 lg:top-20 z-30">
        <div className="container-custom">
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
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    filter === type
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
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
          ) : filteredEvents.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="overflow-hidden card-hover h-full flex flex-col">
                    {/* Event Image */}
                    <div className="aspect-video bg-gradient-to-br from-primary-400 to-secondary-400 relative">
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

                    <CardContent className="p-6 flex-1 flex flex-col">
                      <CardTitle className="mb-3 line-clamp-2">{event.title}</CardTitle>
                      <CardDescription className="mb-4 line-clamp-2">
                        {event.description}
                      </CardDescription>

                      <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(event.startDate)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>{formatTime(event.startDate)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span>{event.venue}</span>
                        </div>
                        {event.maxParticipants && (
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            <span>{event.registeredCount || 0}/{event.maxParticipants} registered</span>
                          </div>
                        )}
                      </div>

                      <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-800">
                        <Link href={`/events/${event.id}`}>
                          <Button variant="primary" className="w-full">
                            View Details
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <Calendar className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No events found
              </h3>
              <p className="text-gray-500">
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
    startDate: '2024-03-15T15:00:00',
    endDate: '2024-03-15T18:00:00',
    venue: 'CSE Lab 1, DIU',
    maxParticipants: 50,
    registeredCount: 35,
    isFeatured: true,
    status: 'UPCOMING',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'AI Hackathon 2024',
    slug: 'ai-hackathon-2024',
    description: '24-hour hackathon to build innovative AI solutions for real-world problems.',
    type: 'Competition',
    startDate: '2024-03-25T09:00:00',
    endDate: '2024-03-26T09:00:00',
    venue: 'DIU Auditorium',
    maxParticipants: 200,
    registeredCount: 150,
    isFeatured: true,
    status: 'UPCOMING',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Deep Learning with PyTorch',
    slug: 'deep-learning-pytorch',
    description: 'Hands-on workshop on building neural networks using PyTorch framework.',
    type: 'Workshop',
    startDate: '2024-04-05T14:00:00',
    endDate: '2024-04-05T17:00:00',
    venue: 'SWE Lab 2, DIU',
    maxParticipants: 40,
    registeredCount: 20,
    isFeatured: false,
    status: 'UPCOMING',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '4',
    title: 'AI in Healthcare Seminar',
    slug: 'ai-healthcare-seminar',
    description: 'Industry experts discuss the applications of AI in modern healthcare.',
    type: 'Seminar',
    startDate: '2024-04-12T10:00:00',
    endDate: '2024-04-12T13:00:00',
    venue: 'DIU Conference Hall',
    maxParticipants: 100,
    registeredCount: 45,
    isFeatured: false,
    status: 'UPCOMING',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '5',
    title: 'Monthly AI Meetup',
    slug: 'monthly-meetup-march',
    description: 'Network with fellow AI enthusiasts and share your projects.',
    type: 'Meetup',
    startDate: '2024-03-30T16:00:00',
    endDate: '2024-03-30T18:00:00',
    venue: 'DIU Cafeteria',
    maxParticipants: 30,
    registeredCount: 28,
    isFeatured: false,
    status: 'UPCOMING',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '6',
    title: 'Computer Vision Fundamentals',
    slug: 'cv-fundamentals',
    description: 'Learn image processing and object detection techniques.',
    type: 'Workshop',
    startDate: '2024-04-20T15:00:00',
    endDate: '2024-04-20T18:00:00',
    venue: 'CSE Lab 3, DIU',
    maxParticipants: 35,
    registeredCount: 15,
    isFeatured: false,
    status: 'UPCOMING',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];
