'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import {
  ArrowLeft,
  Save,
  Plus,
  X,
  Github,
  Globe,
  FileText,
  Loader2
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { projectsApi } from '@/lib/api';
import { useAppDispatch } from '@/lib/redux/hooks';
import { addNotification } from '@/lib/redux/slices/notificationSlice';

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
  category: z.enum(['AI_ML', 'DEEP_LEARNING', 'NLP', 'COMPUTER_VISION', 'DATA_SCIENCE', 'ROBOTICS', 'IOT', 'RESEARCH', 'OTHER']).default('AI_ML'),
  githubUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  demoUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  paperUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  isFeatured: z.boolean().default(false),
  isPublished: z.boolean().default(false),
});

type ProjectFormData = z.infer<typeof projectSchema>;

export default function EditProjectPage() {
  const router = useRouter();
  const params = useParams();
  const dispatch = useAppDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [technologies, setTechnologies] = useState<string[]>([]);
  const [techInput, setTechInput] = useState('');
  const [teamMembers, setTeamMembers] = useState<string[]>([]);
  const [memberInput, setMemberInput] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
  });

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await projectsApi.getById(params.id as string);
        const project = response.data.data || response.data;
        reset({
          title: project.title,
          description: project.description || '',
          content: project.content || '',
          category: project.category || 'AI_ML',
          githubUrl: project.githubUrl || '',
          demoUrl: project.demoUrl || '',
          paperUrl: project.paperUrl || '',
          isFeatured: project.isFeatured || false,
          isPublished: project.isPublished || false,
        });
        if (project.technologies) {
          setTechnologies(typeof project.technologies === 'string' ? JSON.parse(project.technologies) : project.technologies);
        }
        if (project.teamMembers) {
          setTeamMembers(typeof project.teamMembers === 'string' ? JSON.parse(project.teamMembers) : project.teamMembers);
        }
      } catch (error) {
        dispatch(addNotification({ message: 'Failed to load project', type: 'error' }));
        router.push('/admin/projects');
      } finally {
        setIsLoading(false);
      }
    };
    if (params.id) fetchProject();
  }, [params.id, reset, dispatch, router]);

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

  const onSubmit = async (data: ProjectFormData) => {
    setIsSubmitting(true);
    try {
      await projectsApi.update(params.id as string, { ...data, technologies, teamMembers });
      dispatch(addNotification({ message: 'Project updated successfully!', type: 'success' }));
      router.push('/admin/projects');
    } catch (error: any) {
      dispatch(addNotification({ message: error.response?.data?.message || 'Failed to update project.', type: 'error' }));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/projects" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 mb-4">
          <ArrowLeft className="w-4 h-4" />
          Back to Projects
        </Link>
        <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-nexus-text">Edit Project</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid lg:grid-cols-3 gap-6">
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
                Update Project
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
