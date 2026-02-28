'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Save,
  Calendar,
  Clock,
  MapPin,
  Users,
  Image as ImageIcon,
  Plus,
  X,
  Upload
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { eventsApi, mediaApi } from '@/lib/api';
import { useAppDispatch } from '@/lib/redux/hooks';
import { addNotification } from '@/lib/redux/slices/notificationSlice';
import { resolveImageUrl } from '@/lib/utils';

const eventSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  content: z.string().optional(),
  image: z.string().optional(),
  type: z.enum(['SEMINAR', 'WORKSHOP', 'COMPETITION', 'HACKATHON', 'MEETUP', 'WEBINAR', 'CONFERENCE']),
  date: z.string().min(1, 'Date is required'),
  endDate: z.string().optional(),
  time: z.string().optional(),
  venue: z.string().optional(),
  capacity: z.number().min(1, 'Capacity must be at least 1').optional(),
  fee: z.number().min(0).default(0),
  isFeatured: z.boolean().default(false),
  isPublished: z.boolean().default(false),
});

type EventFormData = z.infer<typeof eventSchema>;

export default function CreateEventPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      type: 'WORKSHOP',
      capacity: 50,
      fee: 0,
      isFeatured: false,
      isPublished: false,
    },
  });

  const watchedImage = watch('image');

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    try {
      setIsUploadingImage(true);
      const response = await mediaApi.uploadDriveImage(file);
      const driveUrl = response.data?.data?.openUrl;

      if (!driveUrl) {
        throw new Error('Drive URL not found in upload response');
      }

      setImagePreview(driveUrl);
      setValue('image', driveUrl, { shouldDirty: true, shouldValidate: true });

      dispatch(addNotification({
        message: 'Image uploaded to Google Drive successfully.',
        type: 'success',
      }));
    } catch (error: any) {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      dispatch(addNotification({
        message: error.response?.data?.message || 'Failed to upload image to Google Drive.',
        type: 'error',
      }));
    } finally {
      setIsUploadingImage(false);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setValue('image', '');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const onSubmit = async (data: EventFormData) => {
    setIsSubmitting(true);
    try {
      // Ensure the Drive image URL is included even if register didn't capture it
      if (imagePreview && (!data.image || data.image === '')) {
        data.image = imagePreview;
      }
      await eventsApi.create(data);
      dispatch(addNotification({ message: 'The event has been created successfully.', type: 'success' }));
      router.push('/admin/events');
    } catch (error: any) {
      dispatch(addNotification({ message: error.response?.data?.message || 'Something went wrong.', type: 'error' }));
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
          <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-nexus-text">
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
                    <option value="COMPETITION">Competition</option>
                    <option value="HACKATHON">Hackathon</option>
                    <option value="MEETUP">Meetup</option>
                    <option value="WEBINAR">Webinar</option>
                    <option value="CONFERENCE">Conference</option>
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Detailed Content (Optional, Markdown supported)
                  </label>
                  <textarea
                    {...register('content')}
                    rows={6}
                    placeholder="Detailed event content..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500 resize-none"
                  />
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
                      Time
                    </label>
                    <Input
                      {...register('time')}
                      placeholder="e.g., 10:00 AM - 4:00 PM"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      <Users className="w-4 h-4 inline mr-1" />
                      Capacity
                    </label>
                    <Input
                      type="number"
                      {...register('capacity', { valueAsNumber: true })}
                      error={errors.capacity?.message}
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      <MapPin className="w-4 h-4 inline mr-1" />
                      Venue
                    </label>
                    <Input
                      {...register('venue')}
                      placeholder="Enter venue location"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Fee (BDT)
                    </label>
                    <Input
                      type="number"
                      {...register('fee', { valueAsNumber: true })}
                      placeholder="0 for free"
                    />
                  </div>
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
                    <p className="font-medium text-gray-900 dark:text-nexus-text">Publish Event</p>
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
                    <p className="font-medium text-gray-900 dark:text-nexus-text">Featured Event</p>
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
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />
                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={resolveImageUrl(imagePreview, 'Event cover') || imagePreview}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-xl"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => !isUploadingImage && fileInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center cursor-pointer hover:border-primary-500 transition-colors"
                  >
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 mb-2">
                      {isUploadingImage ? 'Uploading to Google Drive...' : 'Click to upload cover image'}
                    </p>
                    <p className="text-xs text-gray-400">PNG, JPG, WEBP up to 5MB</p>
                  </div>
                )}
                <div className="mt-3">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Or enter image URL</label>
                  <Input
                    value={watchedImage || ''}
                    placeholder="https://example.com/image.jpg"
                    onChange={(e) => {
                      const val = e.target.value;
                      setValue('image', val, { shouldDirty: true, shouldValidate: true });
                      if (val && !val.startsWith('data:')) {
                        setImagePreview(val);
                      } else if (!val) {
                        setImagePreview(null);
                      }
                    }}
                  />
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
