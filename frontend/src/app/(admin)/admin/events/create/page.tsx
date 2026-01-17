'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Save, 
  Calendar, 
  Clock, 
  MapPin, 
  Users,
  Image,
  Plus,
  X
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { eventsApi } from '@/lib/api';
import { useNotificationStore } from '@/lib/store';

const eventSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  type: z.enum(['WORKSHOP', 'SEMINAR', 'BOOTCAMP', 'HACKATHON', 'MEETUP']),
  date: z.string().min(1, 'Date is required'),
  endDate: z.string().optional(),
  time: z.string().min(1, 'Time is required'),
  venue: z.string().min(3, 'Venue is required'),
  capacity: z.number().min(1, 'Capacity must be at least 1'),
  speakerName: z.string().optional(),
  speakerTitle: z.string().optional(),
  speakerBio: z.string().optional(),
  isFeatured: z.boolean().default(false),
  isPublished: z.boolean().default(false),
});

type EventFormData = z.infer<typeof eventSchema>;

export default function CreateEventPage() {
  const router = useRouter();
  const { addNotification } = useNotificationStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      type: 'WORKSHOP',
      capacity: 50,
      isFeatured: false,
      isPublished: false,
    },
  });

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const onSubmit = async (data: EventFormData) => {
    setIsSubmitting(true);
    try {
      const eventData = {
        ...data,
        tags,
        speaker: data.speakerName ? {
          name: data.speakerName,
          title: data.speakerTitle,
          bio: data.speakerBio,
        } : undefined,
      };

      await eventsApi.create(eventData);
      addNotification({
        type: 'success',
        title: 'Event Created',
        message: 'The event has been created successfully.',
      });
      router.push('/admin/events');
    } catch (error: any) {
      addNotification({
        type: 'error',
        title: 'Failed to Create Event',
        message: error.response?.data?.message || 'Something went wrong.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link 
            href="/admin/events" 
            className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Events
          </Link>
          <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">
            Create New Event
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Event Title *
                  </label>
                  <Input
                    {...register('title')}
                    placeholder="Enter event title"
                    error={errors.title?.message}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Event Type *
                  </label>
                  <select
                    {...register('type')}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="WORKSHOP">Workshop</option>
                    <option value="SEMINAR">Seminar</option>
                    <option value="BOOTCAMP">Bootcamp</option>
                    <option value="HACKATHON">Hackathon</option>
                    <option value="MEETUP">Meetup</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description *
                  </label>
                  <textarea
                    {...register('description')}
                    rows={6}
                    placeholder="Describe the event..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500 resize-none"
                  />
                  {errors.description && (
                    <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
                  )}
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Tags
                  </label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      placeholder="Add a tag"
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    />
                    <Button type="button" variant="outline" onClick={addTag}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <Badge key={tag} color="blue" className="flex items-center gap-1">
                        {tag}
                        <button type="button" onClick={() => removeTag(tag)}>
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Date & Location */}
            <Card>
              <CardHeader>
                <CardTitle>Date & Location</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      <Calendar className="w-4 h-4 inline mr-1" />
                      Start Date *
                    </label>
                    <Input
                      type="date"
                      {...register('date')}
                      error={errors.date?.message}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      <Calendar className="w-4 h-4 inline mr-1" />
                      End Date
                    </label>
                    <Input
                      type="date"
                      {...register('endDate')}
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      <Clock className="w-4 h-4 inline mr-1" />
                      Time *
                    </label>
                    <Input
                      {...register('time')}
                      placeholder="e.g., 10:00 AM - 4:00 PM"
                      error={errors.time?.message}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      <Users className="w-4 h-4 inline mr-1" />
                      Capacity *
                    </label>
                    <Input
                      type="number"
                      {...register('capacity', { valueAsNumber: true })}
                      error={errors.capacity?.message}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    Venue *
                  </label>
                  <Input
                    {...register('venue')}
                    placeholder="Enter venue location"
                    error={errors.venue?.message}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Speaker Info */}
            <Card>
              <CardHeader>
                <CardTitle>Speaker Information (Optional)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Speaker Name
                    </label>
                    <Input
                      {...register('speakerName')}
                      placeholder="Enter speaker name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Speaker Title
                    </label>
                    <Input
                      {...register('speakerTitle')}
                      placeholder="e.g., Professor, CSE Department"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Speaker Bio
                  </label>
                  <textarea
                    {...register('speakerBio')}
                    rows={3}
                    placeholder="Brief bio of the speaker..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500 resize-none"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Publish Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Publish Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register('isPublished')}
                    className="w-5 h-5 rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                  />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Publish Event</p>
                    <p className="text-sm text-gray-500">Make this event visible to public</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register('isFeatured')}
                    className="w-5 h-5 rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                  />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Featured Event</p>
                    <p className="text-sm text-gray-500">Show on homepage and featured sections</p>
                  </div>
                </label>
              </CardContent>
            </Card>

            {/* Cover Image */}
            <Card>
              <CardHeader>
                <CardTitle>Cover Image</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center">
                  <Image className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-2">Upload cover image</p>
                  <Button type="button" variant="outline" size="sm">
                    Choose File
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1"
                isLoading={isSubmitting}
              >
                <Save className="w-4 h-4 mr-2" />
                Create Event
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
