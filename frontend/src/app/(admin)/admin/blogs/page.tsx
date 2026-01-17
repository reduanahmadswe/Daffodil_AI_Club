'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Search, 
  Plus,
  Eye,
  Edit,
  Trash2,
  Calendar,
  User,
  MessageSquare,
  Heart,
  MoreVertical
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Avatar } from '@/components/ui/Avatar';
import { Modal, ModalHeader, ModalBody, ModalFooter } from '@/components/ui/Modal';

const mockBlogs = [
  {
    id: '1',
    title: 'Getting Started with Neural Networks',
    slug: 'getting-started-neural-networks',
    category: 'Deep Learning',
    author: { name: 'Rafiqul Islam', email: 'rafiq@diu.edu.bd' },
    status: 'PUBLISHED',
    publishedAt: '2024-02-15',
    views: 1250,
    likes: 45,
    comments: 12,
    isFeatured: true,
  },
  {
    id: '2',
    title: 'Python Libraries for Machine Learning',
    slug: 'python-libraries-ml',
    category: 'Machine Learning',
    author: { name: 'Fatima Akter', email: 'fatima@diu.edu.bd' },
    status: 'PUBLISHED',
    publishedAt: '2024-02-10',
    views: 980,
    likes: 38,
    comments: 8,
    isFeatured: false,
  },
  {
    id: '3',
    title: 'Introduction to Computer Vision',
    slug: 'intro-computer-vision',
    category: 'Computer Vision',
    author: { name: 'Mahmudul Hasan', email: 'mahmud@diu.edu.bd' },
    status: 'DRAFT',
    publishedAt: null,
    views: 0,
    likes: 0,
    comments: 0,
    isFeatured: false,
  },
  {
    id: '4',
    title: 'NLP with Transformers: A Complete Guide',
    slug: 'nlp-transformers-guide',
    category: 'NLP',
    author: { name: 'Nusrat Jahan', email: 'nusrat@diu.edu.bd' },
    status: 'REVIEW',
    publishedAt: null,
    views: 0,
    likes: 0,
    comments: 0,
    isFeatured: false,
  },
  {
    id: '5',
    title: 'AI Ethics: Building Responsible AI',
    slug: 'ai-ethics-responsible',
    category: 'AI Ethics',
    author: { name: 'Abdullah Rahman', email: 'abdullah@diu.edu.bd' },
    status: 'PUBLISHED',
    publishedAt: '2024-01-28',
    views: 2100,
    likes: 89,
    comments: 25,
    isFeatured: true,
  },
];

const statusColors = {
  PUBLISHED: 'green',
  DRAFT: 'gray',
  REVIEW: 'yellow',
  ARCHIVED: 'red',
} as const;

const categoryColors = {
  'Deep Learning': 'blue',
  'Machine Learning': 'purple',
  'Computer Vision': 'green',
  'NLP': 'orange',
  'AI Ethics': 'pink',
} as const;

export default function AdminBlogsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [selectedBlog, setSelectedBlog] = useState<typeof mockBlogs[0] | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const filteredBlogs = mockBlogs.filter(blog => {
    const matchesSearch = blog.title.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || blog.status === statusFilter;
    const matchesCategory = categoryFilter === 'All' || blog.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const categories = [...new Set(mockBlogs.map(b => b.category))];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <FileText className="w-8 h-8 text-primary-500" />
            Blog Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Create and manage blog posts and articles
          </p>
        </div>
        <Link href="/admin/blogs/create">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Post
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-gray-900 dark:text-white">45</p>
            <p className="text-sm text-gray-500">Total Posts</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-green-600">38</p>
            <p className="text-sm text-gray-500">Published</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-gray-600">5</p>
            <p className="text-sm text-gray-500">Drafts</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-blue-600">12.5K</p>
            <p className="text-sm text-gray-500">Total Views</p>
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
                placeholder="Search posts..."
                leftIcon={<Search className="w-5 h-5" />}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <select 
                className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All Status</option>
                <option value="PUBLISHED">Published</option>
                <option value="DRAFT">Draft</option>
                <option value="REVIEW">Under Review</option>
              </select>
              <select 
                className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="All">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Blogs Grid */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredBlogs.map((blog, index) => (
          <motion.div
            key={blog.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="h-full flex flex-col">
              <CardContent className="p-6 flex-1">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex gap-2 flex-wrap">
                    <Badge color={statusColors[blog.status as keyof typeof statusColors]} size="sm">
                      {blog.status}
                    </Badge>
                    {blog.isFeatured && (
                      <Badge color="yellow" size="sm">Featured</Badge>
                    )}
                  </div>
                  <Badge color={categoryColors[blog.category as keyof typeof categoryColors] || 'gray'} size="sm">
                    {blog.category}
                  </Badge>
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 line-clamp-2">
                  {blog.title}
                </h3>

                {/* Author */}
                <div className="flex items-center gap-2 mb-4">
                  <Avatar name={blog.author.name} size="xs" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">{blog.author.name}</span>
                </div>

                {/* Stats */}
                {blog.status === 'PUBLISHED' && (
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      <span>{blog.views}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className="w-4 h-4" />
                      <span>{blog.likes}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageSquare className="w-4 h-4" />
                      <span>{blog.comments}</span>
                    </div>
                  </div>
                )}

                {/* Date */}
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {blog.publishedAt 
                      ? new Date(blog.publishedAt).toLocaleDateString()
                      : 'Not published'
                    }
                  </span>
                </div>
              </CardContent>

              {/* Actions */}
              <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
                <Link href={`/blog/${blog.slug}`}>
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4 mr-1" />
                    Preview
                  </Button>
                </Link>
                <div className="flex gap-1">
                  <Link href={`/admin/blogs/${blog.id}/edit`}>
                    <Button variant="ghost" size="sm" className="p-2">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="p-2 text-red-500 hover:text-red-600"
                    onClick={() => {
                      setSelectedBlog(blog);
                      setIsDeleteModalOpen(true);
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {filteredBlogs.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="w-12 h-12 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No posts found
            </h3>
            <p className="text-gray-500 mb-6">
              {search ? 'Try a different search term' : 'Create your first blog post'}
            </p>
            <Link href="/admin/blogs/create">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Post
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} size="sm">
        <ModalHeader onClose={() => setIsDeleteModalOpen(false)}>
          Confirm Delete
        </ModalHeader>
        <ModalBody>
          <p className="text-gray-600 dark:text-gray-400">
            Are you sure you want to delete <strong>{selectedBlog?.title}</strong>? 
            This action cannot be undone.
          </p>
        </ModalBody>
        <ModalFooter>
          <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
          <Button variant="destructive" onClick={() => setIsDeleteModalOpen(false)}>Delete</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
