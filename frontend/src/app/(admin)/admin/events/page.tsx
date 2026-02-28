'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { 
  Calendar, 
  Search, 
  Plus,
  MapPin,
  Clock,
  Users,
  Edit,
  Trash2,
  Eye,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Modal, ModalHeader, ModalBody, ModalFooter } from '@/components/ui/Modal';
import { adminApi } from '@/lib/api';

interface Event {
  id: string;
  title: string;
  slug: string;
  type: string;
  date: string;
  time?: string;
  venue?: string;
  capacity?: number;
  isPublished: boolean;
  isFeatured: boolean;
  registrations?: any[];
  _count?: { registrations: number };
  createdAt: string;
}

const typeColors: Record<string, string> = {
  WORKSHOP: 'blue',
  SEMINAR: 'purple',
  COMPETITION: 'green',
  HACKATHON: 'orange',
  MEETUP: 'pink',
  WEBINAR: 'cyan',
  CONFERENCE: 'red',
};

export default function AdminEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const response = await adminApi.getEvents({ search, type: typeFilter !== 'All' ? typeFilter : undefined });
      const data = response.data;
      const eventsList = data.data || data.events || data;
      if (Array.isArray(eventsList)) {
        setEvents(eventsList);
      }
    } catch (error) {
      console.error('Failed to fetch events:', error);
    } finally {
      setLoading(false);
    }
  }, [search, typeFilter]);

  useEffect(() => {
    const debounce = setTimeout(() => fetchEvents(), 300);
    return () => clearTimeout(debounce);
  }, [fetchEvents]);

  const handleDelete = async () => {
    if (!selectedEvent) return;
    setIsDeleting(true);
    try {
      await adminApi.deleteEvent(selectedEvent.id);
      setEvents((prev) => prev.filter((e) => e.id !== selectedEvent.id));
      setIsDeleteModalOpen(false);
      setSelectedEvent(null);
    } catch (error) {
      console.error('Failed to delete event:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const getRegistrationCount = (event: Event) => {
    return event._count?.registrations || event.registrations?.length || 0;
  };

  const stats = {
    total: events.length,
    upcoming: events.filter((e) => new Date(e.date) > new Date()).length,
    published: events.filter((e) => e.isPublished).length,
    drafts: events.filter((e) => !e.isPublished).length,
  };

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
            <p className="text-3xl font-bold text-gray-900 dark:text-nexus-text">{stats.total}</p>
            <p className="text-sm text-gray-500">Total Events</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-blue-600">{stats.upcoming}</p>
            <p className="text-sm text-gray-500">Upcoming</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-green-600">{stats.published}</p>
            <p className="text-sm text-gray-500">Published</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-yellow-600">{stats.drafts}</p>
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
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="All">All Types</option>
                <option value="WORKSHOP">Workshop</option>
                <option value="SEMINAR">Seminar</option>
                <option value="COMPETITION">Competition</option>
                <option value="HACKATHON">Hackathon</option>
                <option value="MEETUP">Meetup</option>
                <option value="WEBINAR">Webinar</option>
              </select>
              <Button variant="outline" size="sm" onClick={() => fetchEvents()}>
                <RefreshCw className="w-4 h-4" />
              </Button>
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
                {loading ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center">
                      <Loader2 className="w-6 h-6 animate-spin text-gray-400 mx-auto" />
                      <p className="text-sm text-gray-500 mt-2">Loading events...</p>
                    </td>
                  </tr>
                ) : events.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-gray-500">
                      No events found
                    </td>
                  </tr>
                ) : (
                  events.map((event) => (
                  <tr 
                    key={event.id}
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
                      <Badge color={(typeColors[event.type] || 'gray') as any} size="sm">
                        {event.type}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(event.date).toLocaleDateString()}</span>
                      </div>
                      {event.time && (
                        <div className="flex items-center gap-2 text-gray-500 text-sm mt-1">
                          <Clock className="w-3 h-3" />
                          <span>{event.time}</span>
                        </div>
                      )}
                    </td>
                    <td className="p-4">
                      {event.venue ? (
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                          <MapPin className="w-4 h-4" />
                          <span className="line-clamp-1">{event.venue}</span>
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-500" />
                        <span>
                          {getRegistrationCount(event)}{event.capacity ? `/${event.capacity}` : ''}
                        </span>
                      </div>
                      {event.capacity && (
                        <div className="w-20 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full mt-1">
                          <div 
                            className={`h-full rounded-full ${getRegistrationCount(event) >= event.capacity ? 'bg-red-500' : 'bg-primary-500'}`}
                            style={{ width: `${Math.min((getRegistrationCount(event) / event.capacity) * 100, 100)}%` }}
                          />
                        </div>
                      )}
                    </td>
                    <td className="p-4">
                      <Badge color={event.isPublished ? 'green' : 'yellow'} size="sm">
                        {event.isPublished ? 'PUBLISHED' : 'DRAFT'}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-1">
                        <Link href={`/events/${event.slug || event.id}`}>
                          <Button variant="ghost" size="sm" className="p-2">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
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
                  </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between p-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500">
              Showing {events.length} events
            </p>
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
          <Button variant="danger" onClick={handleDelete} isLoading={isDeleting}>Delete</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
