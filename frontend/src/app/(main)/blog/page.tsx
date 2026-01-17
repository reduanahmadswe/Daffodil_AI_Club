'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowRight, Search, Tag, Clock } from 'lucide-react';
import { Card, CardContent, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Avatar } from '@/components/ui/Avatar';
import { Skeleton } from '@/components/ui/Skeleton';
import { blogsApi } from '@/lib/api';
import { Blog } from '@/types';

const categories = ['All', 'AI', 'Machine Learning', 'Deep Learning', 'NLP', 'Computer Vision', 'Tutorials'];

export default function BlogPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await blogsApi.getAll({ category: category !== 'All' ? category : undefined });
        setBlogs(response.data.blogs || mockBlogs);
      } catch (error) {
        setBlogs(mockBlogs);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [category]);

  const filteredBlogs = blogs.filter(blog => 
    blog.title.toLowerCase().includes(search.toLowerCase()) ||
    blog.excerpt?.toLowerCase().includes(search.toLowerCase())
  );

  const featuredBlog = filteredBlogs.find(blog => blog.isFeatured) || filteredBlogs[0];
  const regularBlogs = filteredBlogs.filter(blog => blog.id !== featuredBlog?.id);

  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 hero-gradient" />
        <div className="absolute inset-0 pattern-grid opacity-10" />
        
        <div className="container-custom relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-white max-w-3xl mx-auto"
          >
            <Badge color="white" className="bg-white/20 text-white mb-6">Blog</Badge>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">
              AI Insights & Articles
            </h1>
            <p className="text-xl text-white/80">
              Stay updated with the latest in AI, tutorials, and insights from our community
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search & Filter */}
      <section className="py-8 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-16 lg:top-20 z-30">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="w-full md:w-96">
              <Input
                type="search"
                placeholder="Search articles..."
                leftIcon={<Search className="w-5 h-5" />}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap gap-2 overflow-x-auto scrollbar-hide">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                    category === cat
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Blog Content */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container-custom">
          {loading ? (
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Skeleton className="h-96 rounded-2xl" />
              </div>
              <div className="space-y-6">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-32 rounded-xl" />
                ))}
              </div>
            </div>
          ) : filteredBlogs.length > 0 ? (
            <>
              {/* Featured Post */}
              {featuredBlog && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-12"
                >
                  <Card className="overflow-hidden card-hover">
                    <div className="grid lg:grid-cols-2">
                      <div className="aspect-video lg:aspect-auto bg-gradient-to-br from-primary-400 to-secondary-400 relative">
                        <Badge color="yellow" className="absolute top-4 left-4">
                          Featured
                        </Badge>
                      </div>
                      <CardContent className="p-8 flex flex-col justify-center">
                        <div className="flex flex-wrap gap-2 mb-4">
                          {featuredBlog.tags?.slice(0, 3).map((tag) => (
                            <Badge key={tag} color="blue" size="sm">{tag}</Badge>
                          ))}
                        </div>
                        <CardTitle className="text-2xl mb-4">{featuredBlog.title}</CardTitle>
                        <CardDescription className="mb-6 line-clamp-3">
                          {featuredBlog.excerpt}
                        </CardDescription>
                        <div className="flex items-center gap-4 mb-6">
                          <Avatar name={featuredBlog.author?.name || 'Author'} size="sm" />
                          <div className="text-sm">
                            <p className="font-medium text-gray-900 dark:text-white">
                              {featuredBlog.author?.name || 'Club Member'}
                            </p>
                            <p className="text-gray-500 flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {formatDate(featuredBlog.publishedAt || featuredBlog.createdAt)}
                            </p>
                          </div>
                        </div>
                        <Link href={`/blog/${featuredBlog.slug}`}>
                          <Button variant="primary">
                            Read Article
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        </Link>
                      </CardContent>
                    </div>
                  </Card>
                </motion.div>
              )}

              {/* Blog Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {regularBlogs.map((blog, index) => (
                  <motion.div
                    key={blog.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="overflow-hidden card-hover h-full flex flex-col">
                      <div className="aspect-video bg-gradient-to-br from-primary-400 to-secondary-400 relative">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Tag className="w-12 h-12 text-white/30" />
                        </div>
                      </div>
                      <CardContent className="p-6 flex-1 flex flex-col">
                        <div className="flex flex-wrap gap-2 mb-3">
                          {blog.tags?.slice(0, 2).map((tag) => (
                            <Badge key={tag} color="blue" size="sm">{tag}</Badge>
                          ))}
                        </div>
                        <CardTitle className="text-lg mb-2 line-clamp-2">{blog.title}</CardTitle>
                        <CardDescription className="mb-4 line-clamp-2 flex-1">
                          {blog.excerpt}
                        </CardDescription>
                        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
                          <div className="flex items-center gap-2">
                            <Avatar name={blog.author?.name || 'Author'} size="xs" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {blog.author?.name || 'Club Member'}
                            </span>
                          </div>
                          <span className="text-sm text-gray-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {blog.readTime || '5 min'}
                          </span>
                        </div>
                        <Link href={`/blog/${blog.slug}`} className="mt-4">
                          <Button variant="ghost" size="sm" className="w-full">
                            Read More
                            <ArrowRight className="w-4 h-4 ml-1" />
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Load More */}
              <div className="text-center mt-12">
                <Button variant="outline" size="lg">
                  Load More Articles
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <Tag className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No articles found
              </h3>
              <p className="text-gray-500">
                {search ? 'Try a different search term' : 'Check back later for new articles'}
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

// Mock data
const mockBlogs: Blog[] = [
  {
    id: '1',
    title: 'Getting Started with Machine Learning: A Beginner\'s Guide',
    slug: 'getting-started-ml',
    content: '',
    excerpt: 'A comprehensive introduction to machine learning concepts, algorithms, and practical applications for beginners.',
    tags: ['Machine Learning', 'Beginner', 'Tutorial'],
    author: { id: '1', name: 'Rafiqul Islam', email: '' },
    isFeatured: true,
    isPublished: true,
    readTime: '8 min',
    createdAt: '2024-03-10T00:00:00Z',
    updatedAt: '2024-03-10T00:00:00Z',
  },
  {
    id: '2',
    title: 'Understanding Neural Networks: From Basics to Deep Learning',
    slug: 'understanding-neural-networks',
    content: '',
    excerpt: 'Explore the fundamentals of neural networks and how they form the foundation of deep learning.',
    tags: ['Deep Learning', 'Neural Networks'],
    author: { id: '2', name: 'Fatima Akter', email: '' },
    isPublished: true,
    readTime: '12 min',
    createdAt: '2024-03-08T00:00:00Z',
    updatedAt: '2024-03-08T00:00:00Z',
  },
  {
    id: '3',
    title: 'NLP in Practice: Building a Sentiment Analysis Model',
    slug: 'nlp-sentiment-analysis',
    content: '',
    excerpt: 'Learn how to build a sentiment analysis model using Natural Language Processing techniques.',
    tags: ['NLP', 'Tutorial', 'Python'],
    author: { id: '3', name: 'Kamal Hossain', email: '' },
    isPublished: true,
    readTime: '10 min',
    createdAt: '2024-03-05T00:00:00Z',
    updatedAt: '2024-03-05T00:00:00Z',
  },
  {
    id: '4',
    title: 'Computer Vision: Object Detection with YOLO',
    slug: 'object-detection-yolo',
    content: '',
    excerpt: 'A hands-on guide to implementing real-time object detection using the YOLO algorithm.',
    tags: ['Computer Vision', 'YOLO', 'Tutorial'],
    author: { id: '4', name: 'Ahmed Khan', email: '' },
    isPublished: true,
    readTime: '15 min',
    createdAt: '2024-03-01T00:00:00Z',
    updatedAt: '2024-03-01T00:00:00Z',
  },
  {
    id: '5',
    title: 'Introduction to Reinforcement Learning',
    slug: 'intro-reinforcement-learning',
    content: '',
    excerpt: 'Discover the basics of reinforcement learning and how agents learn through interaction.',
    tags: ['AI', 'Reinforcement Learning'],
    author: { id: '5', name: 'Nusrat Jahan', email: '' },
    isPublished: true,
    readTime: '7 min',
    createdAt: '2024-02-25T00:00:00Z',
    updatedAt: '2024-02-25T00:00:00Z',
  },
  {
    id: '6',
    title: 'Deploying ML Models with Flask and Docker',
    slug: 'deploying-ml-models',
    content: '',
    excerpt: 'Learn how to deploy your machine learning models as REST APIs using Flask and Docker.',
    tags: ['Machine Learning', 'Deployment', 'Docker'],
    author: { id: '1', name: 'Rafiqul Islam', email: '' },
    isPublished: true,
    readTime: '11 min',
    createdAt: '2024-02-20T00:00:00Z',
    updatedAt: '2024-02-20T00:00:00Z',
  },
];
