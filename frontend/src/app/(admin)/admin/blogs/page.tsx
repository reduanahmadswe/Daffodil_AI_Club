'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  FileText,
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  Calendar,
  MessageSquare,
  Heart,
  Loader2,
  RefreshCw,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Avatar } from '@/components/ui/Avatar';
import { Modal, ModalHeader, ModalBody, ModalFooter } from '@/components/ui/Modal';
import { adminApi } from '@/lib/api';

interface Blog {
  id: string;
  title: string;
  slug: string;
  category?: string;
  author?: { name: string; email: string };
  status: string;
  publishedAt?: string;
  views?: number;
  likes?: number;
  _count?: { comments: number; likes: number };
  createdAt: string;
}

const statusColors: Record<string, string> = {
  PUBLISHED: 'green',
  DRAFT: 'gray',
  PENDING: 'yellow',
  REJECTED: 'red',
};

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchBlogs = useCallback(async () => {
    setLoading(true);
    try {
      const response = await adminApi.getBlogs({ search, status: statusFilter !== 'All' ? statusFilter : undefined });
      const data = response.data;
      const blogsList = data.data || data.blogs || data;
      if (Array.isArray(blogsList)) {
        setBlogs(blogsList);
      }
    } catch (error) {
      console.error('Failed to fetch blogs:', error);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => {
    const debounce = setTimeout(() => fetchBlogs(), 300);
    return () => clearTimeout(debounce);
  }, [fetchBlogs]);

  const handleDelete = async () => {
    if (!selectedBlog) return;
    setIsDeleting(true);
    try {
      await adminApi.deleteBlog(selectedBlog.id);
      setBlogs((prev) => prev.filter((b) => b.id !== selectedBlog.id));
      setIsDeleteModalOpen(false);
      setSelectedBlog(null);
    } catch (error) {
      console.error('Failed to delete blog:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleApprove = async (blogId: string) => {
    try {
      await adminApi.approveBlog(blogId);
      setBlogs((prev) =>
        prev.map((b) => (b.id === blogId ? { ...b, status: 'PUBLISHED' } : b))
      );
    } catch (error) {
      console.error('Failed to approve blog:', error);
    }
  };

  const handleReject = async (blogId: string) => {
    try {
      await adminApi.rejectBlog(blogId);
      setBlogs((prev) =>
        prev.map((b) => (b.id === blogId ? { ...b, status: 'REJECTED' } : b))
      );
    } catch (error) {
      console.error('Failed to reject blog:', error);
    }
  };

  const stats = {
    total: blogs.length,
    published: blogs.filter((b) => b.status === 'PUBLISHED').length,
    drafts: blogs.filter((b) => b.status === 'DRAFT').length,
    pending: blogs.filter((b) => b.status === 'PENDING').length,
    totalViews: blogs.reduce((acc, b) => acc + (b.views || 0), 0),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-nexus-text flex items-center gap-3">
            <FileText className="w-8 h-8 text-primary-500" />
            Blog Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage blog posts and articles
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => fetchBlogs()}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Link href="/admin/blogs/create">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Write Blog
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-gray-900 dark:text-nexus-text">{stats.total}</p>
            <p className="text-sm text-gray-500">Total Posts</p>
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
            <p className="text-3xl font-bold text-gray-600">{stats.drafts}</p>
            <p className="text-sm text-gray-500">Drafts</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
            <p className="text-sm text-gray-500">Pending Review</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-blue-600">{stats.totalViews.toLocaleString()}</p>
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
                className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-nexus-text"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All Status</option>
                <option value="PUBLISHED">Published</option>
                <option value="DRAFT">Draft</option>
                <option value="PENDING">Pending</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Blogs Grid */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      ) : blogs.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="w-12 h-12 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-nexus-text mb-2">
              No posts found
            </h3>
            <p className="text-gray-500">
              {search ? 'Try a different search term' : 'No blog posts yet'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {blogs.map((blog, index) => (
            <div key={blog.id}>
              <Card className="h-full flex flex-col">
                <CardContent className="p-6 flex-1">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <Badge color={(statusColors[blog.status] || 'gray') as any} size="sm">
                      {blog.status}
                    </Badge>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-nexus-text mb-3 line-clamp-2">
                    {blog.title}
                  </h3>

                  {/* Author */}
                  {blog.author && (
                    <div className="flex items-center gap-2 mb-4">
                      <Avatar name={blog.author.name} size="xs" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">{blog.author.name}</span>
                    </div>
                  )}

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      <span>{blog.views || 0}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className="w-4 h-4" />
                      <span>{blog._count?.likes || blog.likes || 0}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageSquare className="w-4 h-4" />
                      <span>{blog._count?.comments || 0}</span>
                    </div>
                  </div>

                  {/* Date */}
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                  </div>
                </CardContent>

                {/* Actions */}
                <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
                  <div className="flex gap-1">
                    {blog.status === 'PENDING' && (
                      <>
                        <Button variant="ghost" size="sm" className="text-green-500" onClick={() => handleApprove(blog.id)}>
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Approve
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-500" onClick={() => handleReject(blog.id)}>
                          <XCircle className="w-4 h-4 mr-1" />
                          Reject
                        </Button>
                      </>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <Link href={`/blog/${blog.slug || blog.id}`}>
                      <Button variant="ghost" size="sm" className="p-2">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </Link>
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
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} size="sm">
        <ModalHeader>
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
          <Button variant="danger" onClick={handleDelete} isLoading={isDeleting}>Delete</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
