'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users,
  ArrowRight,
  CheckCircle,
  XCircle,
  AlertCircle,
  Filter
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

const mockEvents = [
  {
    id: '1',
    title: 'Introduction to Machine Learning',
    type: 'WORKSHOP',
    date: '2024-03-15',
    time: '10:00 AM',
    venue: 'DIU Auditorium',
    status: 'REGISTERED',
    attendance: 'PENDING',
  },
  {
    id: '2',
    title: 'AI in Healthcare Seminar',
    type: 'SEMINAR',
    date: '2024-03-20',
    time: '2:00 PM',
    venue: 'Conference Room 501',
    status: 'REGISTERED',
    attendance: 'PENDING',
  },
  {
    id: '3',
    title: 'Python for Data Science',
    type: 'WORKSHOP',
    date: '2024-02-28',
    time: '11:00 AM',
    venue: 'Lab 405',
    status: 'COMPLETED',
    attendance: 'ATTENDED',
  },
  {
    id: '4',
    title: 'Deep Learning Bootcamp Day 1',
    type: 'BOOTCAMP',
    date: '2024-02-15',
    time: '9:00 AM',
    venue: 'Lab 302',
    status: 'COMPLETED',
    attendance: 'ATTENDED',
  },
  {
    id: '5',
    title: 'NLP Workshop',
    type: 'WORKSHOP',
    date: '2024-02-10',
    time: '3:00 PM',
    venue: 'Conference Room 401',
    status: 'COMPLETED',
    attendance: 'MISSED',
  },
];

const typeColors = {
  WORKSHOP: 'blue',
  SEMINAR: 'purple',
  BOOTCAMP: 'green',
  HACKATHON: 'orange',
} as const;

const attendanceIcons = {
  ATTENDED: { icon: CheckCircle, color: 'text-green-500' },
  MISSED: { icon: XCircle, color: 'text-red-500' },
  PENDING: { icon: AlertCircle, color: 'text-yellow-500' },
};

export default function DashboardEventsPage() {
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('all');

  const upcomingEvents = mockEvents.filter(e => e.status === 'REGISTERED');
  const pastEvents = mockEvents.filter(e => e.status === 'COMPLETED');
  
  const filteredEvents = filter === 'all' 
    ? mockEvents 
    : filter === 'upcoming' 
      ? upcomingEvents 
      : pastEvents;

  const attendedCount = pastEvents.filter(e => e.attendance === 'ATTENDED').length;
  const attendanceRate = pastEvents.length > 0 
    ? Math.round((attendedCount / pastEvents.length) * 100) 
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">
            My Events
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track your registered events and attendance
          </p>
        </div>
        <Link href="/events">
          <Button>
            Browse Events
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{mockEvents.length}</p>
            <p className="text-sm text-gray-500">Total Registered</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-blue-600">{upcomingEvents.length}</p>
            <p className="text-sm text-gray-500">Upcoming</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-green-600">{attendedCount}</p>
            <p className="text-sm text-gray-500">Attended</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-purple-600">{attendanceRate}%</p>
            <p className="text-sm text-gray-500">Attendance Rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {(['all', 'upcoming', 'past'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
              filter === tab
                ? 'bg-primary-500 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
            }`}
          >
            {tab} {tab === 'upcoming' ? `(${upcomingEvents.length})` : tab === 'past' ? `(${pastEvents.length})` : `(${mockEvents.length})`}
          </button>
        ))}
      </div>

      {/* Events List */}
      <div className="space-y-4">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event, index) => {
            const AttendanceIcon = attendanceIcons[event.attendance as keyof typeof attendanceIcons];
            
            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      {/* Date Box */}
                      <div className="flex-shrink-0 w-16 h-16 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex flex-col items-center justify-center text-white">
                        <span className="text-xl font-bold">
                          {new Date(event.date).getDate()}
                        </span>
                        <span className="text-xs uppercase">
                          {new Date(event.date).toLocaleString('default', { month: 'short' })}
                        </span>
                      </div>

                      {/* Event Info */}
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <Badge color={typeColors[event.type as keyof typeof typeColors]} size="sm">
                            {event.type}
                          </Badge>
                          {event.status === 'COMPLETED' && (
                            <div className={`flex items-center gap-1 text-sm ${AttendanceIcon.color}`}>
                              <AttendanceIcon.icon className="w-4 h-4" />
                              <span className="capitalize">{event.attendance.toLowerCase()}</span>
                            </div>
                          )}
                        </div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                          {event.title}
                        </h3>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{event.time}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>{event.venue}</span>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Link href={`/events/${event.id}`}>
                          <Button variant="outline" size="sm">View Details</Button>
                        </Link>
                        {event.status === 'REGISTERED' && (
                          <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600">
                            Cancel
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <Calendar className="w-12 h-12 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No events found
              </h3>
              <p className="text-gray-500 mb-6">
                {filter === 'upcoming' 
                  ? "You don't have any upcoming events" 
                  : filter === 'past' 
                    ? "You haven't attended any events yet" 
                    : "You haven't registered for any events yet"
                }
              </p>
              <Link href="/events">
                <Button>Browse Events</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
