'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowRight, Search, Tag, Clock } from 'lucide-react';
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

  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-40 pb-20 overflow-hidden bg-black">
        {/* Background Orbs */}
        <div className="absolute inset-0">
          <div className="orb orb-blue w-96 h-96 top-1/4 left-1/4" />
          <div className="orb orb-cyan w-96 h-96 bottom-1/4 right-1/4" />
        </div>

        {/* Grid Overlay */}
        <div className="absolute inset-0 grid-overlay opacity-30" />

        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <Badge color="blue" className="mb-6">Blog</Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 text-white">
              AI <span className="gradient-text">Insights</span>
            </h1>
            <p className="text-xl text-[#B5B5C3]">
              Explore articles, tutorials, and insights about AI and machine learning
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-black relative overflow-hidden border-b border-white/10">
        {/* Subtle Orb */}
        <div className="absolute inset-0">
          <div className="orb orb-purple w-64 h-64 top-1/2 right-1/4 opacity-30" />
        </div>

        <div className="container-custom relative z-10">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="w-full md:w-96">
              <Input
                type="search"
                placeholder="Search articles..."
                leftIcon={<Search className="w-5 h-5" />}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${category === cat
                      ? 'bg-gradient-to-r from-[#5B8CFF] to-[#6EF3FF] text-white shadow-glow-blue'
                      : 'bg-white/5 text-[#B5B5C3] hover:bg-white/10 hover:text-white'
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-20 bg-black relative overflow-hidden">
        {/* Background Orbs */}
        <div className="absolute inset-0">
          <div className="orb orb-cyan w-96 h-96 top-1/3 left-1/4" />
          <div className="orb orb-purple w-96 h-96 bottom-1/3 right-1/3" />
        </div>

        {/* Grid Overlay */}
        <div className="absolute inset-0 grid-overlay opacity-20" />

        <div className="container-custom relative z-10">
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="glass rounded-2xl overflow-hidden">
                  <Skeleton className="h-48 rounded-none" />
                  <div className="p-6">
                    <Skeleton className="h-6 w-3/4 mb-3" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredBlogs.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBlogs.map((blog, index) => (
                <motion.div
                  key={blog.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link href={`/blog/${blog.slug}`}>
                    <div className="glass rounded-2xl overflow-hidden hover:shadow-glow-blue transition-all duration-300 h-full flex flex-col cursor-pointer group">
                      {/* Blog Image */}
                      <div className="aspect-video bg-gradient-to-br from-[#5B8CFF] to-[#6EF3FF] relative overflow-hidden">
                        {blog.image && (
                          <img
                            src={blog.image}
                            alt={blog.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        )}
                        <div className="absolute top-4 left-4">
                          {blog.tags && blog.tags.length > 0 && (
                            <Badge color="blue">
                              {blog.tags[0]}
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="p-6 flex-1 flex flex-col">
                        <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-[#6EF3FF] transition-colors">
                          {blog.title}
                        </h3>
                        <p className="text-[#B5B5C3] mb-4 line-clamp-3 flex-1">
                          {blog.excerpt}
                        </p>

                        {/* Blog Meta */}
                        <div className="space-y-3 pt-4 border-t border-white/10">
                          <div className="flex items-center gap-4 text-sm text-[#8A8A9E]">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4 text-[#6EF3FF]" />
                              <span>{formatDate(blog.createdAt)}</span>
                            </div>
                            {blog.readTime && (
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4 text-[#6EF3FF]" />
                                <span>{blog.readTime}</span>
                              </div>
                            )}
                          </div>

                          {/* Author */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Avatar name={blog.author?.name || 'Author'} size="sm" />
                              <span className="text-sm text-white">{blog.author?.name || 'Anonymous'}</span>
                            </div>
                            <ArrowRight className="w-5 h-5 text-[#6EF3FF] group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <Tag className="w-16 h-16 mx-auto text-[#6EF3FF] mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                No articles found
              </h3>
              <p className="text-[#B5B5C3]">
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
    month: 'short',
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
    excerpt: 'Learn the fundamentals of machine learning and start your journey into AI development.',
    image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=450&fit=crop',
    tags: ['Machine Learning', 'Beginners'],
    author: { id: '1', name: 'Rafiqul Islam', email: '' },
    isPublished: true,
    readTime: '8 min',
    createdAt: '2024-03-15T00:00:00Z',
    updatedAt: '2024-03-15T00:00:00Z',
  },
  {
    id: '2',
    title: 'Deep Learning Architectures Explained',
    slug: 'deep-learning-architectures',
    content: '',
    excerpt: 'A comprehensive guide to understanding different neural network architectures.',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=450&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1516110833967-0b5716ca1387?w=800&h=450&fit=crop',
    tags: ['NLP', 'Sentiment Analysis'],
    author: { id: '3', name: 'Kamal Hossain', email: '' },
    isPublished: true,
    readTime: '10 min',
    createdAt: '2024-03-01T00:00:00Z',
    updatedAt: '2024-03-01T00:00:00Z',
  },
  {
    id: '4',
    title: 'Computer Vision: From Theory to Practice',
    slug: 'computer-vision-guide',
    content: '',
    excerpt: 'Explore computer vision concepts and build real-world image recognition applications.',
    image: 'https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=800&h=450&fit=crop',
    tags: ['Computer Vision', 'Image Processing'],
    author: { id: '4', name: 'Ahmed Khan', email: '' },
    isPublished: true,
    readTime: '15 min',
    createdAt: '2024-02-28T00:00:00Z',
    updatedAt: '2024-02-28T00:00:00Z',
  },
  {
    id: '5',
    title: 'Reinforcement Learning: Teaching Machines to Learn',
    slug: 'reinforcement-learning-intro',
    content: '',
    excerpt: 'An introduction to reinforcement learning and how machines learn through trial and error.',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=450&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800&h=450&fit=crop',
    tags: ['Machine Learning', 'Deployment', 'Docker'],
    author: { id: '1', name: 'Rafiqul Islam', email: '' },
    isPublished: true,
    readTime: '11 min',
    createdAt: '2024-02-20T00:00:00Z',
    updatedAt: '2024-02-20T00:00:00Z',
  },
];
