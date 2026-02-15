'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Save,
  Calendar,
  Clock,
  MapPin,
  Users,
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
import { workshopsApi } from '@/lib/api';
import { useAppDispatch } from '@/lib/redux/hooks';
import { addNotification } from '@/lib/redux/slices/notificationSlice';

const workshopSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  content: z.string().optional(),
  instructor: z.string().min(2, 'Instructor name is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional(),
  duration: z.string().optional(),
  schedule: z.string().optional(),
  venue: z.string().optional(),
  mode: z.enum(['ONLINE', 'OFFLINE', 'HYBRID']).default('OFFLINE'),
  fee: z.number().min(0).default(0),
  capacity: z.number().min(1, 'Capacity must be at least 1').default(30),
  prerequisites: z.string().optional(),
  hasCertificate: z.boolean().default(false),
  isPublished: z.boolean().default(false),
});

type WorkshopFormData = z.infer<typeof workshopSchema>;

export default function CreateWorkshopPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [syllabus, setSyllabus] = useState<string[]>([]);
  const [syllabusInput, setSyllabusInput] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<WorkshopFormData>({
    resolver: zodResolver(workshopSchema),
    defaultValues: {
      mode: 'OFFLINE',
      fee: 0,
      capacity: 30,
      hasCertificate: false,
      isPublished: false,
    },
  });

  const addSyllabus = () => {
    if (syllabusInput.trim() && !syllabus.includes(syllabusInput.trim())) {
      setSyllabus([...syllabus, syllabusInput.trim()]);
      setSyllabusInput('');
    }
  };

  const removeSyllabus = (item: string) => {
    setSyllabus(syllabus.filter((s) => s !== item));
  };

  const onSubmit = async (data: WorkshopFormData) => {
    setIsSubmitting(true);
    try {
      await workshopsApi.create({ ...data, syllabus });
      dispatch(addNotification({ message: 'Workshop created successfully!', type: 'success' }));
      router.push('/admin/workshops');
    } catch (error: any) {
      dispatch(addNotification({ message: error.response?.data?.message || 'Failed to create workshop.', type: 'error' }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/workshops" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 mb-4">
          <ArrowLeft className="w-4 h-4" />
          Back to Workshops
        </Link>
        <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-nexus-text">Create New Workshop</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader><CardTitle>Basic Information</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title *</label>
                  <Input {...register('title')} placeholder="Workshop title" error={errors.title?.message} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description *</label>
                  <textarea
                    {...register('description')}
                    rows={3}
                    placeholder="Brief description of the workshop..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-nexus-text focus:ring-2 focus:ring-primary-500 resize-none"
                  />
                  {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Content (Detailed)</label>
                  <textarea
                    {...register('content')}
                    rows={10}
                    placeholder="Detailed workshop content (Markdown supported)..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-nexus-text focus:ring-2 focus:ring-primary-500 resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Instructor *</label>
                  <Input {...register('instructor')} placeholder="Instructor name" error={errors.instructor?.message} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Schedule & Location</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      <Calendar className="w-4 h-4 inline mr-1" /> Start Date *
                    </label>
                    <Input type="date" {...register('startDate')} error={errors.startDate?.message} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      <Calendar className="w-4 h-4 inline mr-1" /> End Date
                    </label>
                    <Input type="date" {...register('endDate')} />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      <Clock className="w-4 h-4 inline mr-1" /> Duration
                    </label>
                    <Input {...register('duration')} placeholder="e.g., 3 hours / 2 days" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Schedule</label>
                    <Input {...register('schedule')} placeholder="e.g., Every Saturday, 10 AM - 1 PM" />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      <MapPin className="w-4 h-4 inline mr-1" /> Venue
                    </label>
                    <Input {...register('venue')} placeholder="Location or online link" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Mode</label>
                    <select
                      {...register('mode')}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-nexus-text focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="OFFLINE">Offline</option>
                      <option value="ONLINE">Online</option>
                      <option value="HYBRID">Hybrid</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Syllabus</CardTitle></CardHeader>
              <CardContent>
                <div className="flex gap-2 mb-3">
                  <Input
                    value={syllabusInput}
                    onChange={(e) => setSyllabusInput(e.target.value)}
                    placeholder="Add syllabus topic"
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSyllabus())}
                  />
                  <Button type="button" variant="outline" onClick={addSyllabus}><Plus className="w-4 h-4" /></Button>
                </div>
                <div className="space-y-2">
                  {syllabus.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                      <span className="text-sm text-gray-700 dark:text-gray-300">{idx + 1}. {item}</span>
                      <button type="button" onClick={() => removeSyllabus(item)} className="text-red-400 hover:text-red-600"><X className="w-4 h-4" /></button>
                    </div>
                  ))}
                  {syllabus.length === 0 && (
                    <p className="text-sm text-gray-400 text-center py-4">No syllabus topics added yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader><CardTitle>Settings</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    <Users className="w-4 h-4 inline mr-1" /> Capacity
                  </label>
                  <Input type="number" {...register('capacity', { valueAsNumber: true })} error={errors.capacity?.message} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fee (BDT)</label>
                  <Input type="number" {...register('fee', { valueAsNumber: true })} placeholder="0 for free" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Prerequisites</label>
                  <textarea
                    {...register('prerequisites')}
                    rows={3}
                    placeholder="Any prerequisites for attendees..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-nexus-text focus:ring-2 focus:ring-primary-500 resize-none"
                  />
                </div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" {...register('hasCertificate')} className="w-5 h-5 rounded border-gray-300 text-primary-500 focus:ring-primary-500" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-nexus-text">Certificate</p>
                    <p className="text-sm text-gray-500">Issue certificate on completion</p>
                  </div>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" {...register('isPublished')} className="w-5 h-5 rounded border-gray-300 text-primary-500 focus:ring-primary-500" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-nexus-text">Publish</p>
                    <p className="text-sm text-gray-500">Make visible on website</p>
                  </div>
                </label>
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button type="button" variant="outline" className="flex-1" onClick={() => router.back()}>Cancel</Button>
              <Button type="submit" className="flex-1" isLoading={isSubmitting}>
                <Save className="w-4 h-4 mr-2" />
                Create Workshop
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
