'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Newspaper,
  Calendar,
  FileText,
  Download,
  Users,
  Mail,
  Loader2,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Skeleton } from '@/components/ui/Skeleton';
import FadeContent from '@/components/FadeContent';
import { newsletterApi, contactApi } from '@/lib/api';
import { resolveImageUrl } from '@/lib/utils';

interface NewsletterPost {
  id: string;
  subject: string;
  description: string;
  coverImage: string | null;
  pdfUrl: string | null;
  pdfName: string | null;
  sentCount: number;
  totalCount: number;
  createdAt: string;
}

export default function NewsletterPage() {
  const [posts, setPosts] = useState<NewsletterPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [email, setEmail] = useState('');
  const [subscribing, setSubscribing] = useState(false);
  const [subMessage, setSubMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetchPosts();
  }, [page]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await newsletterApi.getPosts({ page, limit: 9 });
      const data = res.data?.data || [];
      setPosts(Array.isArray(data) ? data : []);
      if (res.data?.pagination) {
        setTotalPages(res.data.pagination.totalPages || 1);
      }
    } catch (error) {
      console.error('Failed to fetch newsletters:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setSubscribing(true);
    setSubMessage(null);

    try {
      await contactApi.subscribeNewsletter(email.trim());
      setSubMessage({ type: 'success', text: 'Subscribed successfully! You\'ll receive our newsletters.' });
      setEmail('');
    } catch (err: any) {
      setSubMessage({
        type: 'error',
        text: err?.response?.data?.message || 'Failed to subscribe. Please try again.',
      });
    } finally {
      setSubscribing(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-40 pb-20 overflow-hidden bg-nexus-bg">
        <div className="absolute inset-0">
          <div className="orb orb-purple w-96 h-96 top-1/4 left-1/4" />
          <div className="orb orb-blue w-96 h-96 bottom-1/4 right-1/4" />
        </div>
        <div className="absolute inset-0 grid-overlay opacity-30" />

        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <Badge color="purple" className="mb-6">Newsletter</Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 text-nexus-text">
              Our <span className="gradient-text">Newsletters</span>
            </h1>
            <p className="text-xl text-nexus-text-secondary">
              Stay updated with the latest news, events, and insights from Daffodil AI Club
            </p>
          </motion.div>
        </div>
      </section>

      {/* Subscribe Section */}
      <section className="py-10 bg-nexus-bg relative overflow-hidden border-b border-nexus-border">
        <div className="absolute inset-0">
          <div className="orb orb-cyan w-64 h-64 top-1/2 right-1/4 opacity-30" />
        </div>
        <div className="container-custom relative z-10">
          <div className="max-w-xl mx-auto text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Mail className="w-5 h-5 text-primary-500" />
              <h2 className="text-lg font-semibold text-nexus-text">Subscribe to Newsletter</h2>
            </div>
            <p className="text-sm text-nexus-text-secondary mb-4">
              Get newsletters delivered straight to your inbox
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="flex-1"
              />
              <Button type="submit" disabled={subscribing} isLoading={subscribing}>
                Subscribe
              </Button>
            </form>
            {subMessage && (
              <p className={`text-sm mt-2 ${subMessage.type === 'success' ? 'text-green-500' : 'text-red-500'}`}>
                {subMessage.text}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Newsletter Posts */}
      <section className="py-16 bg-nexus-bg relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="orb orb-blue w-80 h-80 top-1/3 left-1/4 opacity-20" />
          <div className="orb orb-purple w-64 h-64 bottom-1/4 right-1/3 opacity-20" />
        </div>

        <div className="container-custom relative z-10">
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <Skeleton className="h-5 w-3/4 mb-3" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-2/3 mb-4" />
                    <Skeleton className="h-8 w-1/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-16">
              <Newspaper className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-nexus-text mb-2">No newsletters yet</h3>
              <p className="text-nexus-text-secondary">
                We haven&apos;t published any newsletters yet. Subscribe above to be the first to know!
              </p>
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post, index) => {
                  const isExpanded = expandedId === post.id;
                  const descLines = post.description.split('\n');
                  const isLong = post.description.length > 200;

                  return (
                    <FadeContent key={post.id} delay={index * 0.05}>
                      <Card className="h-full hover:shadow-lg transition-shadow duration-300 group overflow-hidden">
                        {/* Cover Image */}
                        {post.coverImage && (
                          <div className="w-full h-48 overflow-hidden">
                            <img
                              src={resolveImageUrl(post.coverImage, post.subject) || post.coverImage}
                              alt=""
                              title=""
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          </div>
                        )}
                        <CardContent className={`p-6 flex flex-col ${post.coverImage ? '' : 'h-full'}`}>
                          {/* Date & Badge */}
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-1.5 text-sm text-nexus-text-secondary">
                              <Calendar className="w-4 h-4" />
                              {formatDate(post.createdAt)}
                            </div>
                            {post.pdfUrl && (
                              <Badge color="purple" size="sm">
                                <FileText className="w-3 h-3 mr-1" />
                                PDF
                              </Badge>
                            )}
                          </div>

                          {/* Subject */}
                          <h3 className="text-lg font-semibold text-nexus-text mb-3 line-clamp-2 group-hover:text-primary-500 transition-colors">
                            {post.subject}
                          </h3>

                          {/* Description */}
                          <div className="flex-1 mb-4">
                            <p className="text-sm text-nexus-text-secondary leading-relaxed break-words whitespace-pre-line">
                              {isExpanded || !isLong
                                ? post.description
                                : post.description.slice(0, 200) + '...'}
                            </p>
                            {isLong && (
                              <button
                                onClick={() => setExpandedId(isExpanded ? null : post.id)}
                                className="text-xs text-primary-500 hover:underline mt-1"
                              >
                                {isExpanded ? 'Show less' : 'Read more'}
                              </button>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-2 mt-auto pt-3 border-t border-nexus-border">
                            {post.pdfUrl && (
                              <a
                                href={post.pdfUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-500 hover:text-primary-600 transition-colors"
                              >
                                <Download className="w-4 h-4" />
                                Download PDF
                              </a>
                            )}
                            <div className="ml-auto flex items-center gap-1 text-xs text-nexus-text-secondary">
                              <Users className="w-3.5 h-3.5" />
                              Sent to {post.sentCount}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </FadeContent>
                  );
                })}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-10">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Previous
                  </Button>
                  <span className="text-sm text-nexus-text-secondary">
                    Page {page} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}
