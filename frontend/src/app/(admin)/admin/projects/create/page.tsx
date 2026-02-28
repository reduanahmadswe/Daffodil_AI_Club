'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Save,
  Plus,
  X,
  Github,
  Globe,
  FileText,
  Upload,
  Image as ImageIcon
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { projectsApi, mediaApi } from '@/lib/api';
import { useAppDispatch } from '@/lib/redux/hooks';
import { addNotification } from '@/lib/redux/slices/notificationSlice';
import { resolveImageUrl } from '@/lib/utils';

const projectCategories = [
  { value: 'AI_ML', label: 'AI / Machine Learning' },
  { value: 'DEEP_LEARNING', label: 'Deep Learning' },
  { value: 'NLP', label: 'Natural Language Processing' },
  { value: 'COMPUTER_VISION', label: 'Computer Vision' },
  { value: 'DATA_SCIENCE', label: 'Data Science' },
  { value: 'ROBOTICS', label: 'Robotics' },
  { value: 'IOT', label: 'IoT' },
  { value: 'RESEARCH', label: 'Research' },
  { value: 'OTHER', label: 'Other' },
];

const projectSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  content: z.string().optional(),
  image: z.string().optional(),
  category: z.enum(['AI_ML', 'DEEP_LEARNING', 'NLP', 'COMPUTER_VISION', 'DATA_SCIENCE', 'ROBOTICS', 'IOT', 'RESEARCH', 'OTHER']).default('AI_ML'),
  githubUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  demoUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  paperUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  isFeatured: z.boolean().default(false),
  isPublished: z.boolean().default(false),
});

type ProjectFormData = z.infer<typeof projectSchema>;

export default function CreateProjectPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [technologies, setTechnologies] = useState<string[]>([]);
  const [techInput, setTechInput] = useState('');
  const [teamMembers, setTeamMembers] = useState<string[]>([]);
  const [memberInput, setMemberInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      category: 'AI_ML',
      isFeatured: false,
      isPublished: false,
    },
  });

  const watchedImage = watch('image');

  const addTech = () => {
    if (techInput.trim() && !technologies.includes(techInput.trim())) {
      setTechnologies([...technologies, techInput.trim()]);
      setTechInput('');
    }
  };

  const addMember = () => {
    if (memberInput.trim() && !teamMembers.includes(memberInput.trim())) {
      setTeamMembers([...teamMembers, memberInput.trim()]);
      setMemberInput('');
    }
  };

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

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

  const onSubmit = async (data: ProjectFormData) => {
    setIsSubmitting(true);
    try {
      // Ensure the Drive image URL is included even if register didn't capture it
      if (imagePreview && (!data.image || data.image === '')) {
        data.image = imagePreview;
      }
      await projectsApi.create({ ...data, technologies, teamMembers });
      dispatch(addNotification({ message: 'Project created successfully!', type: 'success' }));
      router.push('/admin/projects');
    } catch (error: any) {
      dispatch(addNotification({ message: error.response?.data?.message || 'Failed to create project.', type: 'error' }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/projects" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 mb-4">
          <ArrowLeft className="w-4 h-4" />
          Back to Projects
        </Link>
        <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-nexus-text">Create New Project</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader><CardTitle>Project Details</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title *</label>
                  <Input {...register('title')} placeholder="Project title" error={errors.title?.message} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description *</label>
                  <textarea
                    {...register('description')}
                    rows={3}
                    placeholder="Brief description of the project..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-nexus-text focus:ring-2 focus:ring-primary-500 resize-none"
                  />
                  {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Content (Detailed)</label>
                  <textarea
                    {...register('content')}
                    rows={12}
                    placeholder="Detailed project documentation (Markdown supported)..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-nexus-text focus:ring-2 focus:ring-primary-500 resize-none"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Cover Image */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="w-5 h-5" />
                  Project Image
                </CardTitle>
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
                      src={resolveImageUrl(imagePreview, 'Project image') || imagePreview}
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
                      {isUploadingImage ? 'Uploading to Google Drive...' : 'Click to upload project image'}
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

            <Card>
              <CardHeader><CardTitle>Links</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    <Github className="w-4 h-4 inline mr-1" /> GitHub URL
                  </label>
                  <Input {...register('githubUrl')} placeholder="https://github.com/..." error={errors.githubUrl?.message} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    <Globe className="w-4 h-4 inline mr-1" /> Demo URL
                  </label>
                  <Input {...register('demoUrl')} placeholder="https://demo.example.com" error={errors.demoUrl?.message} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    <FileText className="w-4 h-4 inline mr-1" /> Paper URL
                  </label>
                  <Input {...register('paperUrl')} placeholder="https://arxiv.org/..." error={errors.paperUrl?.message} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Technologies Used</CardTitle></CardHeader>
              <CardContent>
                <div className="flex gap-2 mb-3">
                  <Input
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    placeholder="e.g., Python, TensorFlow"
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTech())}
                  />
                  <Button type="button" variant="outline" onClick={addTech}><Plus className="w-4 h-4" /></Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {technologies.map((tech) => (
                    <Badge key={tech} color="blue" className="flex items-center gap-1">
                      {tech}
                      <button type="button" onClick={() => setTechnologies(technologies.filter((t) => t !== tech))}><X className="w-3 h-3" /></button>
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Team Members</CardTitle></CardHeader>
              <CardContent>
                <div className="flex gap-2 mb-3">
                  <Input
                    value={memberInput}
                    onChange={(e) => setMemberInput(e.target.value)}
                    placeholder="Team member name"
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addMember())}
                  />
                  <Button type="button" variant="outline" onClick={addMember}><Plus className="w-4 h-4" /></Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {teamMembers.map((member) => (
                    <Badge key={member} color="green" className="flex items-center gap-1">
                      {member}
                      <button type="button" onClick={() => setTeamMembers(teamMembers.filter((m) => m !== member))}><X className="w-3 h-3" /></button>
                    </Badge>
                  ))}
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
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category *</label>
                  <select
                    {...register('category')}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-nexus-text focus:ring-2 focus:ring-primary-500"
                  >
                    {projectCategories.map((cat) => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" {...register('isFeatured')} className="w-5 h-5 rounded border-gray-300 text-primary-500 focus:ring-primary-500" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-nexus-text">Featured</p>
                    <p className="text-sm text-gray-500">Show on homepage</p>
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
                Create Project
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
