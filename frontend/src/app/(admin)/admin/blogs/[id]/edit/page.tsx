'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import {
  ArrowLeft,
  Save,
  Plus,
  X,
  Loader2,
  Bold,
  Italic,
  List,
  Link2,
  Code,
  Heading
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { blogsApi } from '@/lib/api';
import { useAppDispatch } from '@/lib/redux/hooks';
import { addNotification } from '@/lib/redux/slices/notificationSlice';
import { resolveImageUrl } from '@/lib/utils';

const categories = [
  'Artificial Intelligence', 'Machine Learning', 'Deep Learning', 'NLP',
  'Computer Vision', 'Data Science', 'Robotics', 'IoT', 'Research',
  'Tutorial', 'News', 'Opinion', 'Other'
];

const blogSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  excerpt: z.string().min(10, 'Excerpt must be at least 10 characters'),
  content: z.string().min(50, 'Content must be at least 50 characters'),
  category: z.string().min(1, 'Category is required'),
  status: z.enum(['DRAFT', 'PENDING', 'PUBLISHED']).default('DRAFT'),
  coverImage: z.string().optional(),
  isFeatured: z.boolean().default(false),
});

type BlogFormData = z.infer<typeof blogSchema>;

export default function EditBlogPage() {
  const router = useRouter();
  const params = useParams();
  const dispatch = useAppDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<BlogFormData>({
    resolver: zodResolver(blogSchema),
  });
  const watchedCoverImage = watch('coverImage');
  const watchedTitle = watch('title');

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await blogsApi.getById(params.id as string);
        const blog = response.data.data || response.data;
        reset({
          title: blog.title,
          excerpt: blog.excerpt || '',
          content: blog.content || '',
          category: blog.category || '',
          status: blog.status || 'DRAFT',
          coverImage: blog.coverImage || '',
          isFeatured: blog.isFeatured || false,
        });
        if (blog.tags) {
          setTags(typeof blog.tags === 'string' ? JSON.parse(blog.tags) : blog.tags);
        }
      } catch (error) {
        dispatch(addNotification({ message: 'Failed to load blog post', type: 'error' }));
        router.push('/admin/blogs');
      } finally {
        setIsLoading(false);
      }
    };
    if (params.id) fetchBlog();
  }, [params.id, reset, dispatch, router]);

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const onSubmit = async (data: BlogFormData) => {
    setIsSubmitting(true);
    try {
      await blogsApi.update(params.id as string, { ...data, tags });
      dispatch(addNotification({ message: 'Blog post updated successfully.', type: 'success' }));
      router.push('/admin/blogs');
    } catch (error: any) {
      dispatch(addNotification({ message: error.response?.data?.message || 'Failed to update blog.', type: 'error' }));
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
        <Link
          href="/admin/blogs"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Blogs
        </Link>
        <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-nexus-text">
          Edit Blog Post
        </h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader><CardTitle>Content</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title *</label>
                  <Input {...register('title')} placeholder="Blog post title" error={errors.title?.message} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Excerpt *</label>
                  <textarea
                    {...register('excerpt')}
                    rows={3}
                    placeholder="Brief summary of the post..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-nexus-text focus:ring-2 focus:ring-primary-500 resize-none"
                  />
                  {errors.excerpt && <p className="text-red-500 text-sm mt-1">{errors.excerpt.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Content * (Markdown supported)</label>
                  <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                    <div className="flex items-center gap-1 p-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                      <button type="button" className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700"><Bold className="w-4 h-4" /></button>
                      <button type="button" className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700"><Italic className="w-4 h-4" /></button>
                      <button type="button" className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700"><Heading className="w-4 h-4" /></button>
                      <button type="button" className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700"><List className="w-4 h-4" /></button>
                      <button type="button" className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700"><Link2 className="w-4 h-4" /></button>
                      <button type="button" className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700"><Code className="w-4 h-4" /></button>
                    </div>
                    <textarea
                      {...register('content')}
                      rows={16}
                      placeholder="Write your blog content in Markdown..."
                      className="w-full px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-nexus-text focus:ring-0 border-0 resize-none"
                    />
                  </div>
                  {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content.message}</p>}
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
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                  <select
                    {...register('status')}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-nexus-text focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="DRAFT">Draft</option>
                    <option value="PENDING">Pending Review</option>
                    <option value="PUBLISHED">Published</option>
                  </select>
                </div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" {...register('isFeatured')} className="w-5 h-5 rounded border-gray-300 text-primary-500 focus:ring-primary-500" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-nexus-text">Featured Post</p>
                    <p className="text-sm text-gray-500">Show on homepage</p>
                  </div>
                </label>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Tags</CardTitle></CardHeader>
              <CardContent>
                <div className="flex gap-2 mb-3">
                  <Input value={tagInput} onChange={(e) => setTagInput(e.target.value)} placeholder="Add tag" onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())} />
                  <Button type="button" variant="outline" onClick={addTag}><Plus className="w-4 h-4" /></Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Badge key={tag} color="blue" className="flex items-center gap-1">
                      {tag}
                      <button type="button" onClick={() => removeTag(tag)}><X className="w-3 h-3" /></button>
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Cover Image</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <Input
                  {...register('coverImage')}
                  placeholder="https://example.com/cover.jpg"
                />
                <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-gray-50 dark:bg-gray-800/30">
                  {watchedCoverImage ? (
                    <img
                      src={resolveImageUrl(watchedCoverImage, watchedTitle || 'Blog cover') || watchedCoverImage}
                      alt="Cover preview"
                      className="w-full h-40 object-cover"
                    />
                  ) : (
                    <div className="h-40 flex items-center justify-center text-gray-400">
                      No cover image
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button type="button" variant="outline" className="flex-1" onClick={() => router.back()}>Cancel</Button>
              <Button type="submit" className="flex-1" isLoading={isSubmitting}>
                <Save className="w-4 h-4 mr-2" />
                Update Post
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
