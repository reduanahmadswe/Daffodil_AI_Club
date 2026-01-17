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
  Link as LinkIcon,
  Send
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Input } from '@/components/ui/Input';
import { Skeleton } from '@/components/ui/Skeleton';
import { blogsApi } from '@/lib/api';
import { useAuthStore } from '@/lib/store';
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

## Types of Neural Networks

- **Feedforward Neural Networks (FNN)**
- **Convolutional Neural Networks (CNN)**
- **Recurrent Neural Networks (RNN)**
- **Transformer Networks**

## Getting Started

To begin your journey with neural networks, I recommend:

1. Learn Python programming
2. Understand linear algebra basics
3. Study calculus fundamentals
4. Practice with TensorFlow or PyTorch

## Conclusion

Neural networks are powerful tools that have revolutionized AI. With the right foundation, you can start building your own models and contribute to this exciting field!
  `,
  coverImage: undefined,
  category: 'Deep Learning',
  tags: ['Neural Networks', 'AI', 'Machine Learning', 'Deep Learning', 'Python'],
  author: {
    id: '1',
    name: 'Dr. Rafiqul Islam',
    email: 'rafiq@diu.edu.bd',
    profileImage: undefined,
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
    author: { id: '2', name: 'Abdullah Rahman', profileImage: undefined },
    createdAt: '2024-02-16T10:30:00Z',
    updatedAt: '2024-02-16T10:30:00Z',
  },
  {
    id: '2',
    content: 'I finally understand backpropagation. Thank you for breaking it down!',
    author: { id: '3', name: 'Fatima Akter', profileImage: undefined },
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
  const { isAuthenticated, user } = useAuthStore();
  
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
        setBlog(response.data.data.blog);
        setComments(response.data.data.comments || []);
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
        setBlog(prev => prev ? { ...prev, likes: prev.likes - 1 } : null);
      } else {
        await blogsApi.like(blog!.id);
        setBlog(prev => prev ? { ...prev, likes: prev.likes + 1 } : null);
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
      // Add comment to local state
      const comment: Comment = {
        id: Date.now().toString(),
        content: newComment,
        author: { id: user!.id, name: user!.name, profileImage: user!.profileImage },
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
      <div className="container-custom py-32">
        <Skeleton className="h-8 w-32 mb-8" />
        <Skeleton className="h-12 w-3/4 mb-4" />
        <Skeleton className="h-6 w-1/4 mb-8" />
        <Skeleton className="h-[400px] w-full mb-8" />
        <div className="space-y-4">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-3/4" />
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="container-custom py-32 text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Post Not Found
        </h1>
        <p className="text-gray-500 mb-8">The blog post you're looking for doesn't exist.</p>
        <Link href="/blog">
          <Button>Browse Blog</Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 hero-gradient" />
        <div className="absolute inset-0 pattern-grid opacity-10" />
        
        <div className="container-custom relative max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Back Button */}
            <Link href="/blog" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6">
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </Link>

            {/* Category & Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge color="blue">{blog.category}</Badge>
              {blog.isFeatured && <Badge color="yellow">Featured</Badge>}
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-6">
              {blog.title}
            </h1>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-6 text-white/80">
              <div className="flex items-center gap-3">
                <Avatar name={blog.author.name} size="sm" />
                <span>{blog.author.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(blog.publishedAt || blog.createdAt)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>5 min read</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12 bg-gray-50 dark:bg-gray-900">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="grid lg:grid-cols-12 gap-8">
              {/* Sidebar - Social Share */}
              <div className="hidden lg:block lg:col-span-1">
                <div className="sticky top-24 space-y-3">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className={`p-3 ${isLiked ? 'text-red-500' : ''}`}
                    onClick={handleLike}
                  >
                    <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                  </Button>
                  <Button variant="ghost" size="sm" className="p-3">
                    <MessageSquare className="w-5 h-5" />
                  </Button>
                  <Button variant="ghost" size="sm" className="p-3">
                    <Bookmark className="w-5 h-5" />
                  </Button>
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                    <Button variant="ghost" size="sm" className="p-3">
                      <Twitter className="w-5 h-5" />
                    </Button>
                    <Button variant="ghost" size="sm" className="p-3">
                      <Linkedin className="w-5 h-5" />
                    </Button>
                    <Button variant="ghost" size="sm" className="p-3">
                      <Facebook className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="lg:col-span-11">
                <Card>
                  <CardContent className="p-8">
                    {/* Article Content */}
                    <article className="prose dark:prose-invert prose-lg max-w-none">
                      {blog.content.split('\n').map((line, index) => {
                        if (line.startsWith('# ')) {
                          return <h1 key={index}>{line.slice(2)}</h1>;
                        } else if (line.startsWith('## ')) {
                          return <h2 key={index}>{line.slice(3)}</h2>;
                        } else if (line.startsWith('### ')) {
                          return <h3 key={index}>{line.slice(4)}</h3>;
                        } else if (line.startsWith('- ')) {
                          return <li key={index}>{line.slice(2)}</li>;
                        } else if (line.trim()) {
                          return <p key={index}>{line}</p>;
                        }
                        return null;
                      })}
                    </article>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mt-8 pt-8 border-t border-gray-100 dark:border-gray-800">
                      {blog.tags.map((tag) => (
                        <Badge key={tag} color="gray" size="sm">#{tag}</Badge>
                      ))}
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-6 mt-6 text-gray-500">
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
                  </CardContent>
                </Card>

                {/* Author Card */}
                <Card className="mt-8">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <Avatar name={blog.author.name} size="lg" />
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {blog.author.name}
                        </h3>
                        <p className="text-gray-500">
                          Member of Daffodil AI Club
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Comments Section */}
                <Card className="mt-8">
                  <CardHeader>
                    <CardTitle>Comments ({comments.length})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {/* Comment Form */}
                    {isAuthenticated ? (
                      <form onSubmit={handleSubmitComment} className="mb-8">
                        <div className="flex gap-3">
                          <Avatar name={user?.name || ''} size="sm" />
                          <div className="flex-1">
                            <textarea
                              value={newComment}
                              onChange={(e) => setNewComment(e.target.value)}
                              placeholder="Write a comment..."
                              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 resize-none"
                              rows={3}
                            />
                            <div className="flex justify-end mt-2">
                              <Button type="submit" isLoading={isSubmitting}>
                                <Send className="w-4 h-4 mr-2" />
                                Post Comment
                              </Button>
                            </div>
                          </div>
                        </div>
                      </form>
                    ) : (
                      <div className="text-center py-4 mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl">
                        <p className="text-gray-500 mb-2">Login to leave a comment</p>
                        <Link href="/login">
                          <Button size="sm">Login</Button>
                        </Link>
                      </div>
                    )}

                    {/* Comments List */}
                    <div className="space-y-6">
                      {comments.map((comment) => (
                        <div key={comment.id} className="flex gap-3">
                          <Avatar name={comment.author.name} size="sm" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-gray-900 dark:text-white">
                                {comment.author.name}
                              </span>
                              <span className="text-sm text-gray-500">
                                {formatRelativeTime(comment.createdAt)}
                              </span>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400">
                              {comment.content}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Related Posts */}
                <Card className="mt-8">
                  <CardHeader>
                    <CardTitle>Related Posts</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {relatedPosts.map((post) => (
                        <Link key={post.id} href={`/blog/${post.slug}`}>
                          <div className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                            <div>
                              <h4 className="font-medium text-gray-900 dark:text-white">
                                {post.title}
                              </h4>
                              <Badge color="gray" size="sm" className="mt-1">
                                {post.category}
                              </Badge>
                            </div>
                            <ArrowLeft className="w-4 h-4 rotate-180" />
                          </div>
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
