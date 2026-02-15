'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Search, 
  Plus,
  MoreVertical,
  MapPin,
  Clock,
  Users,
  Edit,
  Trash2,
  Eye,
  Copy
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Modal, ModalHeader, ModalBody, ModalFooter } from '@/components/ui/Modal';

const mockEvents = [
  {
    id: '1',
    title: 'Introduction to Machine Learning',
    type: 'WORKSHOP',
    date: '2024-03-15',
    time: '10:00 AM',
    venue: 'DIU Auditorium, Building 1',
    status: 'UPCOMING',
    registrations: 45,
    capacity: 100,
    isPublished: true,
  },
  {
    id: '2',
    title: 'AI in Healthcare Seminar',
    type: 'SEMINAR',
    date: '2024-03-20',
    time: '2:00 PM',
    venue: 'Conference Room 501',
    status: 'UPCOMING',
    registrations: 78,
    capacity: 80,
    isPublished: true,
  },
  {
    id: '3',
    title: 'Deep Learning Bootcamp',
    type: 'BOOTCAMP',
    date: '2024-04-01',
    time: '9:00 AM',
    venue: 'Lab 302',
    status: 'DRAFT',
    registrations: 0,
    capacity: 50,
    isPublished: false,
  },
  {
    id: '4',
    title: 'Python for Data Science',
    type: 'WORKSHOP',
    date: '2024-02-28',
    time: '11:00 AM',
    venue: 'Lab 405',
    status: 'COMPLETED',
    registrations: 35,
    capacity: 40,
    isPublished: true,
  },
  {
    id: '5',
    title: 'AI Hackathon 2024',
    type: 'HACKATHON',
    date: '2024-05-15',
    time: '8:00 AM',
    venue: 'DIU Main Campus',
    status: 'UPCOMING',
    registrations: 120,
    capacity: 200,
    isPublished: true,
  },
];

const typeColors = {
  WORKSHOP: 'blue',
  SEMINAR: 'purple',
  BOOTCAMP: 'green',
  HACKATHON: 'orange',
  MEETUP: 'pink',
} as const;

const statusColors = {
  UPCOMING: 'blue',
  ONGOING: 'green',
  COMPLETED: 'gray',
  CANCELLED: 'red',
  DRAFT: 'yellow',
} as const;

export default function AdminEventsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [selectedEvent, setSelectedEvent] = useState<typeof mockEvents[0] | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const filteredEvents = mockEvents.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || event.status === statusFilter;
    const matchesType = typeFilter === 'All' || event.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-nexus-text flex items-center gap-3">
            <Calendar className="w-8 h-8 text-primary-500" />
            Events Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Create and manage club events, workshops, and hackathons
          </p>
        </div>
        <Link href="/admin/events/create">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create Event
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-gray-900 dark:text-nexus-text">12</p>
            <p className="text-sm text-gray-500">Total Events</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-blue-600">5</p>
            <p className="text-sm text-gray-500">Upcoming</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-green-600">278</p>
            <p className="text-sm text-gray-500">Total Registrations</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-yellow-600">2</p>
            <p className="text-sm text-gray-500">Drafts</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters & Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                type="search"
                placeholder="Search events..."
                leftIcon={<Search className="w-5 h-5" />}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <select 
                className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-nexus-text"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All Status</option>
                <option value="UPCOMING">Upcoming</option>
                <option value="ONGOING">Ongoing</option>
                <option value="COMPLETED">Completed</option>
                <option value="DRAFT">Draft</option>
              </select>
              <select 
                className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-nexus-text"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="All">All Types</option>
                <option value="WORKSHOP">Workshop</option>
                <option value="SEMINAR">Seminar</option>
                <option value="BOOTCAMP">Bootcamp</option>
                <option value="HACKATHON">Hackathon</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Events Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left p-4 font-medium text-gray-500">Event</th>
                  <th className="text-left p-4 font-medium text-gray-500">Type</th>
                  <th className="text-left p-4 font-medium text-gray-500">Date & Time</th>
                  <th className="text-left p-4 font-medium text-gray-500">Venue</th>
                  <th className="text-left p-4 font-medium text-gray-500">Registrations</th>
                  <th className="text-left p-4 font-medium text-gray-500">Status</th>
                  <th className="text-right p-4 font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEvents.map((event) => (
                  <motion.tr 
                    key={event.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <td className="p-4">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-nexus-text">{event.title}</p>
                        {!event.isPublished && (
                          <Badge color="yellow" size="sm" className="mt-1">Unpublished</Badge>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge color={typeColors[event.type as keyof typeof typeColors]} size="sm">
                        {event.type}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(event.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-500 text-sm mt-1">
                        <Clock className="w-3 h-3" />
                        <span>{event.time}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <MapPin className="w-4 h-4" />
                        <span className="line-clamp-1">{event.venue}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-500" />
                        <span className={event.registrations >= event.capacity ? 'text-red-500 font-medium' : ''}>
                          {event.registrations}/{event.capacity}
                        </span>
                      </div>
                      <div className="w-20 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full mt-1">
                        <div 
                          className={`h-full rounded-full ${event.registrations >= event.capacity ? 'bg-red-500' : 'bg-primary-500'}`}
                          style={{ width: `${Math.min((event.registrations / event.capacity) * 100, 100)}%` }}
                        />
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge color={statusColors[event.status as keyof typeof statusColors]} size="sm">
                        {event.status}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-1">
                        <Link href={`/events/${event.id}`}>
                          <Button variant="ghost" size="sm" className="p-2">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button variant="ghost" size="sm" className="p-2">
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Link href={`/admin/events/${event.id}/edit`}>
                          <Button variant="ghost" size="sm" className="p-2">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="p-2 text-red-500 hover:text-red-600"
                          onClick={() => {
                            setSelectedEvent(event);
                            setIsDeleteModalOpen(true);
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between p-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500">
              Showing {filteredEvents.length} of {mockEvents.length} events
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled>Previous</Button>
              <Button variant="outline" size="sm">Next</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} size="sm">
        <ModalHeader>
          Confirm Delete
        </ModalHeader>
        <ModalBody>
          <p className="text-gray-600 dark:text-gray-400">
            Are you sure you want to delete <strong>{selectedEvent?.title}</strong>? 
            This will also remove all registrations for this event.
          </p>
        </ModalBody>
        <ModalFooter>
          <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
          <Button variant="danger" onClick={() => setIsDeleteModalOpen(false)}>Delete</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
