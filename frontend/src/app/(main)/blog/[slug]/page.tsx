'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Eye,
  Heart,
  MessageSquare,
  Share2,
  Bookmark,
  Twitter,
  Linkedin,
  Facebook,
  Send
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Skeleton } from '@/components/ui/Skeleton';
import { blogsApi } from '@/lib/api';
import { useAppSelector } from '@/lib/redux/hooks';
import { Blog, Comment } from '@/types';
import { formatDate, formatRelativeTime } from '@/lib/utils';

// Mock data
const mockBlog: Blog = {
  id: '1',
  title: 'Getting Started with Neural Networks: A Comprehensive Guide',
  slug: 'getting-started-neural-networks',
  excerpt: 'Learn the fundamentals of neural networks and how they work.',
  content: `
# Introduction to Neural Networks

Neural networks are the backbone of modern artificial intelligence. In this comprehensive guide, we'll explore the fundamental concepts and how they work.

## What is a Neural Network?

A neural network is a computing system inspired by biological neural networks that constitute animal brains. These systems learn to perform tasks by considering examples, generally without being programmed with task-specific rules.

## Components of a Neural Network

### 1. Neurons (Nodes)
The basic unit of a neural network. Each neuron receives input, processes it, and produces an output.

### 2. Layers
- **Input Layer**: Receives the raw input data
- **Hidden Layers**: Process the data
- **Output Layer**: Produces the final result

### 3. Weights and Biases
Parameters that the network learns during training to make accurate predictions.

## How Neural Networks Learn

Neural networks learn through a process called backpropagation:

1. **Forward Pass**: Data flows through the network
2. **Loss Calculation**: Error is computed
3. **Backward Pass**: Gradients are calculated
4. **Update**: Weights are adjusted

## Conclusion

Neural networks are powerful tools that have revolutionized AI. With the right foundation, you can start building your own models and contribute to this exciting field!
  `,
  coverImage: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1200&h=600&fit=crop',
  category: 'Deep Learning',
  tags: ['Neural Networks', 'AI', 'Machine Learning', 'Deep Learning', 'Python'],
  authorId: '1',
  author: {
    id: '1',
    name: 'Dr. Rafiqul Islam',
    email: 'rafiq@diu.edu.bd',
  },
  status: 'PUBLISHED',
  isFeatured: true,
  views: 1250,
  likes: 89,
  publishedAt: '2024-02-15',
  createdAt: '2024-02-10',
  updatedAt: '2024-02-15',
};

const mockComments: Comment[] = [
  {
    id: '1',
    content: 'This is an excellent introduction to neural networks! Very well explained.',
    author: { id: '2', name: 'Abdullah Rahman' },
    createdAt: '2024-02-16T10:30:00Z',
    updatedAt: '2024-02-16T10:30:00Z',
  },
  {
    id: '2',
    content: 'I finally understand backpropagation. Thank you for breaking it down!',
    author: { id: '3', name: 'Fatima Akter' },
    createdAt: '2024-02-17T14:20:00Z',
    updatedAt: '2024-02-17T14:20:00Z',
  },
];

const relatedPosts = [
  { id: '2', title: 'Understanding Convolutional Neural Networks', slug: 'understanding-cnn', category: 'Deep Learning' },
  { id: '3', title: 'Introduction to TensorFlow', slug: 'intro-tensorflow', category: 'Machine Learning' },
  { id: '4', title: 'Building Your First ML Model', slug: 'first-ml-model', category: 'Machine Learning' },
];

export default function BlogDetailPage() {
  const params = useParams();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  const [blog, setBlog] = useState<Blog | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await blogsApi.getBySlug(params.slug as string);
        const blogData = response.data?.blog || response.data?.data?.blog || response.data?.data;
        if (!blogData) {
          throw new Error('Blog not found');
        }
        setBlog(blogData);
        const commentsData = response.data?.comments || response.data?.data?.comments || [];
        setComments(Array.isArray(commentsData) ? commentsData : []);
      } catch (error) {
        // Use mock data for development
        setBlog(mockBlog);
        setComments(mockComments);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [params.slug]);

  const handleLike = async () => {
    if (!isAuthenticated) return;

    try {
      if (isLiked) {
        await blogsApi.unlike(blog!.id);
        setBlog(prev => prev ? { ...prev, likes: (prev.likes || 0) - 1 } : null);
      } else {
        await blogsApi.like(blog!.id);
        setBlog(prev => prev ? { ...prev, likes: (prev.likes || 0) + 1 } : null);
      }
      setIsLiked(!isLiked);
    } catch (error) {
      console.error('Failed to update like:', error);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !isAuthenticated) return;

    setIsSubmitting(true);
    try {
      await blogsApi.addComment(blog!.id, newComment);
      const comment: Comment = {
        id: Date.now().toString(),
        content: newComment,
        author: { id: user!.id, name: user!.name },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setComments(prev => [comment, ...prev]);
      setNewComment('');
    } catch (error) {
      console.error('Failed to add comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black pt-32 pb-20">
        <div className="container-custom">
          <Skeleton className="h-8 w-32 mb-8 bg-nexus-glass" />
          <Skeleton className="h-12 w-3/4 mb-4 bg-nexus-glass" />
          <Skeleton className="h-6 w-1/4 mb-8 bg-nexus-glass" />
          <Skeleton className="h-[400px] w-full mb-8 bg-nexus-glass" />
          <div className="space-y-4">
            <Skeleton className="h-6 w-full bg-nexus-glass" />
            <Skeleton className="h-6 w-full bg-nexus-glass" />
            <Skeleton className="h-6 w-3/4 bg-nexus-glass" />
          </div>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-black pt-32 pb-20">
        <div className="container-custom text-center">
          <h1 className="text-2xl font-bold text-nexus-text mb-4">
            Post Not Found
          </h1>
          <p className="text-nexus-text-secondary mb-8">The blog post you're looking for doesn't exist.</p>
          <Link href="/blog">
            <button className="btn-nexus-primary px-6 py-3 rounded-xl">Browse Blog</button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-40 pb-20 overflow-hidden bg-black">
        {/* Background Orbs */}
        <div className="absolute inset-0">
          <div className="orb orb-blue w-96 h-96 top-1/4 left-1/4" />
          <div className="orb orb-purple w-96 h-96 bottom-1/4 right-1/4" />
        </div>

        {/* Grid Overlay */}
        <div className="absolute inset-0 grid-overlay opacity-30" />

        <div className="container-custom relative max-w-4xl mx-auto z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Back Button */}
            <Link href="/blog" className="inline-flex items-center gap-2 text-nexus-text-secondary hover:text-nexus-text mb-6 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </Link>

            {/* Category & Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge color="blue">{blog.category}</Badge>
              {blog.isFeatured && <Badge color="yellow">Featured</Badge>}
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-nexus-text mb-6">
              {blog.title}
            </h1>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-6 text-nexus-text-secondary">
              <div className="flex items-center gap-3">
                <Avatar name={blog.author.name} size="sm" />
                <span className="text-nexus-text font-medium">{blog.author.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-nexus-blue" />
                <span>{formatDate(blog.publishedAt || blog.createdAt)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-nexus-blue" />
                <span>5 min read</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Image */}
      {blog.coverImage && (
        <section className="relative bg-black">
          <div className="container-custom max-w-5xl">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-blue-900/20">
              <img
                src={blog.coverImage}
                alt={blog.title}
                className="w-full max-h-[500px] object-cover"
              />
            </div>
          </div>
        </section>
      )}

      {/* Content Section */}
      <section className="py-20 bg-black relative overflow-hidden">
        {/* Background Orbs */}
        <div className="absolute inset-0">
          <div className="orb orb-cyan w-96 h-96 top-1/3 left-1/4 opacity-20" />
        </div>

        <div className="container-custom relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="grid lg:grid-cols-12 gap-8">
              {/* Sidebar - Social Share */}
              <div className="hidden lg:block lg:col-span-1">
                <div className="sticky top-32 space-y-4">
                  <div className="flex flex-col gap-2">
                    <button
                      className={`p-3 rounded-full transition-all ${isLiked ? 'bg-red-500/10 text-red-500' : 'bg-nexus-glass text-nexus-text-secondary hover:text-nexus-text hover:bg-nexus-glass'}`}
                      onClick={handleLike}
                    >
                      <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                    </button>
                    <button className="p-3 rounded-full bg-nexus-glass text-nexus-text-secondary hover:text-nexus-text hover:bg-nexus-glass transition-all">
                      <MessageSquare className="w-5 h-5" />
                    </button>
                    <button className="p-3 rounded-full bg-nexus-glass text-nexus-text-secondary hover:text-nexus-text hover:bg-nexus-glass transition-all">
                      <Bookmark className="w-5 h-5" />
                    </button>
                    <button className="p-3 rounded-full bg-nexus-glass text-nexus-text-secondary hover:text-nexus-text hover:bg-nexus-glass transition-all">
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="lg:col-span-11">
                <div className="glass rounded-2xl p-8 md:p-12 mb-12">
                  {/* Article Content */}
                  <article className="prose prose-invert prose-lg max-w-none prose-headings:text-nexus-text prose-p:text-nexus-text-secondary prose-strong:text-nexus-text prose-a:text-nexus-blue">
                    {blog.content.split('\n').map((line, index) => {
                      if (line.startsWith('# ')) {
                        return <h1 key={index} className="text-3xl font-bold mb-6 text-nexus-text">{line.slice(2)}</h1>;
                      } else if (line.startsWith('## ')) {
                        return <h2 key={index} className="text-2xl font-bold mt-8 mb-4 text-nexus-text">{line.slice(3)}</h2>;
                      } else if (line.startsWith('### ')) {
                        return <h3 key={index} className="text-xl font-bold mt-6 mb-3 text-nexus-text">{line.slice(4)}</h3>;
                      } else if (line.startsWith('- ')) {
                        return <li key={index} className="ml-4 text-nexus-text-secondary mb-2">{line.slice(2)}</li>;
                      } else if (line.trim()) {
                        return <p key={index} className="mb-4 text-nexus-text-secondary leading-relaxed">{line}</p>;
                      }
                      return null;
                    })}
                  </article>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mt-12 pt-8 border-t border-nexus-border">
                    {Array.isArray(blog.tags) && blog.tags.map((tag: string) => (
                      <Badge key={tag} color="blue" size="sm">#{tag}</Badge>
                    ))}
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-6 mt-6 text-nexus-text-muted text-sm">
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      <span>{blog.views} views</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Heart className="w-4 h-4" />
                      <span>{blog.likes} likes</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      <span>{comments.length} comments</span>
                    </div>
                  </div>
                </div>

                {/* Author Card */}
                <div className="glass rounded-2xl p-8 mb-12 flex items-center gap-6">
                  <Avatar name={blog.author.name} size="lg" />
                  <div>
                    <h3 className="text-xl font-bold text-nexus-text mb-2">
                      {blog.author.name}
                    </h3>
                    <p className="text-nexus-text-secondary">
                      Member of Daffodil AI Club | Machine Learning Enthusiast
                    </p>
                  </div>
                </div>

                {/* Comments Section */}
                <div className="glass rounded-2xl p-8 mb-12">
                  <h3 className="text-2xl font-bold text-nexus-text mb-8 flex items-center gap-3">
                    <MessageSquare className="w-6 h-6 text-nexus-blue" />
                    Comments ({comments.length})
                  </h3>

                  {/* Comment Form */}
                  {isAuthenticated ? (
                    <form onSubmit={handleSubmitComment} className="mb-10">
                      <div className="flex gap-4">
                        <Avatar name={user?.name || ''} size="md" />
                        <div className="flex-1">
                          <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Share your thoughts..."
                            className="w-full px-4 py-3 rounded-xl border border-nexus-border bg-nexus-glass text-nexus-text placeholder:text-nexus-text-secondary resize-none focus:border-[#5B8CFF] focus:outline-none focus:ring-1 focus:ring-[#5B8CFF] transition-all"
                            rows={3}
                          />
                          <div className="flex justify-end mt-3">
                            <button
                              type="submit"
                              disabled={isSubmitting || !newComment.trim()}
                              className="btn-nexus-primary px-6 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Send className="w-4 h-4" />
                              Post Comment
                            </button>
                          </div>
                        </div>
                      </div>
                    </form>
                  ) : (
                    <div className="text-center py-8 mb-10 bg-nexus-glass rounded-xl border border-nexus-border">
                      <p className="text-nexus-text-secondary mb-4">Join the discussion by logging in</p>
                      <Link href="/login">
                        <button className="btn-nexus-primary px-6 py-2 rounded-lg">Login to Comment</button>
                      </Link>
                    </div>
                  )}

                  {/* Comments List */}
                  <div className="space-y-8">
                    {comments.map((comment) => (
                      <div key={comment.id} className="flex gap-4 group">
                        <Avatar name={comment.author.name} size="md" />
                        <div className="flex-1">
                          <div className="glass rounded-xl p-4 bg-nexus-glass border-nexus-border">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-bold text-nexus-text">
                                {comment.author.name}
                              </span>
                              <span className="text-xs text-nexus-text-muted">
                                {formatRelativeTime(comment.createdAt)}
                              </span>
                            </div>
                            <p className="text-nexus-text-secondary leading-relaxed">
                              {comment.content}
                            </p>
                          </div>
                          <div className="flex items-center gap-4 mt-2 ml-2">
                            <button className="text-xs text-nexus-text-muted hover:text-nexus-text transition-colors">Reply</button>
                            <button className="text-xs text-nexus-text-muted hover:text-nexus-text transition-colors">Like</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Related Posts */}
                <div>
                  <h3 className="text-2xl font-bold text-nexus-text mb-6">Related Articles</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    {relatedPosts.map((post) => (
                      <Link key={post.id} href={`/blog/${post.slug}`}>
                        <div className="glass p-6 rounded-2xl hover:bg-nexus-glass transition-all cursor-pointer h-full border border-nexus-border hover:border-[#5B8CFF]/50 group">
                          <Badge color="blue" size="sm" className="mb-3">
                            {post.category}
                          </Badge>
                          <h4 className="font-bold text-nexus-text group-hover:text-nexus-cyan transition-colors line-clamp-2">
                            {post.title}
                          </h4>
                          <div className="mt-4 flex items-center text-sm text-nexus-blue font-medium opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                            Read Article <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
