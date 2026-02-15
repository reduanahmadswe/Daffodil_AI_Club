'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Save,
  Image,
  Plus,
  X,
  Bold,
  Italic,
  List,
  Link as LinkIcon,
  Eye
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
import { slugify } from '@/lib/utils';

const blogSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  excerpt: z.string().min(20, 'Excerpt must be at least 20 characters').max(200, 'Excerpt must be less than 200 characters'),
  content: z.string().min(100, 'Content must be at least 100 characters'),
  category: z.string().min(1, 'Category is required'),
  status: z.enum(['DRAFT', 'REVIEW', 'PUBLISHED']).default('DRAFT'),
  isFeatured: z.boolean().default(false),
});

type BlogFormData = z.infer<typeof blogSchema>;

const categories = [
  'Machine Learning',
  'Deep Learning',
  'Natural Language Processing',
  'Computer Vision',
  'Data Science',
  'Python',
  'TensorFlow',
  'PyTorch',
  'Tutorial',
  'News',
  'Research',
];

export default function CreateBlogPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<BlogFormData>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      status: 'DRAFT',
      isFeatured: false,
    },
  });

  const watchedContent = watch('content');
  const watchedTitle = watch('title');

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
      const blogData = {
        ...data,
        slug: slugify(data.title),
        tags,
      };

      await blogsApi.create(blogData);
      dispatch(addNotification({
        message: data.status === 'PUBLISHED'
          ? 'Your blog post has been published.'
          : 'Your blog post has been saved as draft.',
        type: 'success'
      }));
      router.push('/admin/blogs');
    } catch (error: any) {
      dispatch(addNotification({
        message: error.response?.data?.message || 'Failed to create post',
        type: 'error'
      }));
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
            href="/admin/blogs"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog Posts
          </Link>
          <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-nexus-text">
            Create New Blog Post
          </h1>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={() => setShowPreview(!showPreview)}
        >
          <Eye className="w-4 h-4 mr-2" />
          {showPreview ? 'Edit' : 'Preview'}
        </Button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {showPreview ? (
              /* Preview Mode */
              <Card>
                <CardContent className="p-8">
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-nexus-text mb-4">
                    {watchedTitle || 'Untitled Post'}
                  </h1>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {tags.map((tag) => (
                      <Badge key={tag} color="blue">#{tag}</Badge>
                    ))}
                  </div>
                  <div className="prose dark:prose-invert max-w-none">
                    {watchedContent?.split('\n').map((line, i) => (
                      <p key={i}>{line || <br />}</p>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : (
              /* Edit Mode */
              <>
                {/* Title & Excerpt */}
                <Card>
                  <CardHeader>
                    <CardTitle>Post Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Title *
                      </label>
                      <Input
                        {...register('title')}
                        placeholder="Enter post title"
                        error={errors.title?.message}
                      />
                      {watchedTitle && (
                        <p className="text-sm text-gray-500 mt-1">
                          Slug: {slugify(watchedTitle)}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Excerpt *
                      </label>
                      <textarea
                        {...register('excerpt')}
                        rows={2}
                        placeholder="Brief summary of the post..."
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500 resize-none"
                      />
                      {errors.excerpt && (
                        <p className="text-red-500 text-sm mt-1">{errors.excerpt.message}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Content Editor */}
                <Card>
                  <CardHeader>
                    <CardTitle>Content *</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {/* Toolbar */}
                    <div className="flex items-center gap-1 p-2 border-b border-gray-200 dark:border-gray-700 mb-2">
                      <Button type="button" variant="ghost" size="sm" className="p-2">
                        <Bold className="w-4 h-4" />
                      </Button>
                      <Button type="button" variant="ghost" size="sm" className="p-2">
                        <Italic className="w-4 h-4" />
                      </Button>
                      <Button type="button" variant="ghost" size="sm" className="p-2">
                        <List className="w-4 h-4" />
                      </Button>
                      <Button type="button" variant="ghost" size="sm" className="p-2">
                        <LinkIcon className="w-4 h-4" />
                      </Button>
                      <Button type="button" variant="ghost" size="sm" className="p-2">
                        <Image className="w-4 h-4" />
                      </Button>
                    </div>

                    <textarea
                      {...register('content')}
                      rows={20}
                      placeholder="Write your content here... (Markdown supported)"
                      className="w-full px-4 py-3 rounded-xl border-0 bg-transparent focus:ring-0 resize-none font-mono text-sm"
                    />
                    {errors.content && (
                      <p className="text-red-500 text-sm mt-1">{errors.content.message}</p>
                    )}
                  </CardContent>
                </Card>

                {/* Tags */}
                <Card>
                  <CardHeader>
                    <CardTitle>Tags</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2 mb-3">
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
                        <Badge key={tag} color="blue" className="flex items-center gap-1 py-1 px-3">
                          {tag}
                          <button type="button" onClick={() => removeTag(tag)} className="ml-1">
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                      {tags.length === 0 && (
                        <p className="text-gray-500 text-sm">No tags added yet</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Publish Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Publish Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Status
                  </label>
                  <select
                    {...register('status')}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="DRAFT">Draft</option>
                    <option value="REVIEW">In Review</option>
                    <option value="PUBLISHED">Published</option>
                  </select>
                </div>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register('isFeatured')}
                    className="w-5 h-5 rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                  />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-nexus-text">Featured Post</p>
                    <p className="text-sm text-gray-500">Show on homepage</p>
                  </div>
                </label>
              </CardContent>
            </Card>

            {/* Category */}
            <Card>
              <CardHeader>
                <CardTitle>Category *</CardTitle>
              </CardHeader>
              <CardContent>
                <select
                  {...register('category')}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                {errors.category && (
                  <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
                )}
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
            <div className="space-y-3">
              <Button
                type="submit"
                className="w-full"
                isLoading={isSubmitting}
              >
                <Save className="w-4 h-4 mr-2" />
                Save Post
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
