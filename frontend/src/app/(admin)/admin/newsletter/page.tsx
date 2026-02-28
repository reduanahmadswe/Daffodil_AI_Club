'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Mail,
  Send,
  Users,
  FileText,
  Plus,
  Loader2,
  RefreshCw,
  Upload,
  X,
  CheckCircle2,
  AlertCircle,
  FileUp,
  Trash2,
  Calendar,
  Download,
  Newspaper,
  ExternalLink,
  ImagePlus,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Modal, ModalHeader, ModalBody, ModalFooter } from '@/components/ui/Modal';
import { newsletterApi, mediaApi } from '@/lib/api';

interface Subscriber {
  id: string;
  email: string;
  isActive: boolean;
  createdAt: string;
}

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

export default function AdminNewsletterPage() {
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loadingSubscribers, setLoadingSubscribers] = useState(true);

  // PDF upload state
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfUploading, setPdfUploading] = useState(false);
  const [pdfUploaded, setPdfUploaded] = useState<{ url: string; name: string } | null>(null);
  const [pdfError, setPdfError] = useState('');
  const pdfInputRef = useRef<HTMLInputElement>(null);

  // Cover image upload state
  const [coverImageUploading, setCoverImageUploading] = useState(false);
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null);
  const [coverImageError, setCoverImageError] = useState('');
  const coverImageInputRef = useRef<HTMLInputElement>(null);

  // Send state
  const [isSending, setIsSending] = useState(false);
  const [sendResult, setSendResult] = useState<{ success: boolean; message: string } | null>(null);

  // Newsletter history
  const [posts, setPosts] = useState<NewsletterPost[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchSubscribers = useCallback(async () => {
    setLoadingSubscribers(true);
    try {
      const res = await newsletterApi.getSubscribers();
      const data = res.data?.data || res.data || [];
      if (Array.isArray(data)) {
        setSubscribers(data);
      }
    } catch (error) {
      console.error('Failed to fetch subscribers:', error);
    } finally {
      setLoadingSubscribers(false);
    }
  }, []);

  const fetchPosts = useCallback(async () => {
    setLoadingPosts(true);
    try {
      const res = await newsletterApi.getPosts({ limit: 50 });
      const data = res.data?.data || [];
      if (Array.isArray(data)) setPosts(data);
    } catch (error) {
      console.error('Failed to fetch newsletter posts:', error);
    } finally {
      setLoadingPosts(false);
    }
  }, []);

  useEffect(() => {
    fetchSubscribers();
    fetchPosts();
  }, [fetchSubscribers, fetchPosts]);

  // Handle PDF file selection
  const handlePdfSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setPdfError('Only PDF files are allowed');
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      setPdfError('File size must be under 15MB');
      return;
    }

    setPdfFile(file);
    setPdfError('');
    setPdfUploaded(null);

    // Upload to Google Drive immediately
    setPdfUploading(true);
    try {
      const res = await mediaApi.uploadDrivePdf(file);
      const driveData = res.data?.data;
      if (driveData?.viewUrl) {
        setPdfUploaded({ url: driveData.viewUrl, name: file.name });
      } else {
        throw new Error('No URL returned');
      }
    } catch (err: any) {
      setPdfError(err?.response?.data?.message || err?.message || 'PDF upload failed');
      setPdfFile(null);
    } finally {
      setPdfUploading(false);
    }
  };

  const removePdf = () => {
    setPdfFile(null);
    setPdfUploaded(null);
    setPdfError('');
    if (pdfInputRef.current) pdfInputRef.current.value = '';
  };

  // Handle cover image selection
  const handleCoverImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setCoverImageError('Only image files are allowed');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setCoverImageError('Image must be under 10MB');
      return;
    }

    setCoverImageError('');
    setCoverImageUploading(true);
    try {
      const res = await mediaApi.uploadDriveImage(file);
      const driveData = res.data?.data;
      if (driveData?.openUrl || driveData?.viewUrl) {
        setCoverImageUrl(driveData.openUrl || driveData.viewUrl);
      } else {
        throw new Error('No URL returned');
      }
    } catch (err: any) {
      setCoverImageError(err?.response?.data?.message || err?.message || 'Image upload failed');
    } finally {
      setCoverImageUploading(false);
    }
  };

  const removeCoverImage = () => {
    setCoverImageUrl(null);
    setCoverImageError('');
    if (coverImageInputRef.current) coverImageInputRef.current.value = '';
  };

  // Send newsletter
  const handleSend = async () => {
    if (!subject.trim() || !description.trim()) {
      setSendResult({ success: false, message: 'Subject and description are required' });
      return;
    }

    setIsSending(true);
    setSendResult(null);

    try {
      const payload: any = {
        subject: subject.trim(),
        description: description.trim(),
      };

      if (pdfUploaded) {
        payload.pdfUrl = pdfUploaded.url;
        payload.pdfName = pdfUploaded.name;
      }

      if (coverImageUrl) {
        payload.coverImage = coverImageUrl;
      }

      const res = await newsletterApi.send(payload);
      const msg = res.data?.message || 'Newsletter sent successfully';
      setSendResult({ success: true, message: msg });

      // Refresh posts list
      fetchPosts();

      // Reset form after success
      setTimeout(() => {
        setSubject('');
        setDescription('');
        removePdf();
        removeCoverImage();
        setIsComposeOpen(false);
        setSendResult(null);
      }, 2500);
    } catch (err: any) {
      setSendResult({
        success: false,
        message: err?.response?.data?.message || err?.message || 'Failed to send newsletter',
      });
    } finally {
      setIsSending(false);
    }
  };

  const closeCompose = () => {
    if (isSending) return;
    setIsComposeOpen(false);
    setSendResult(null);
  };

  const handleDeletePost = async (id: string) => {
    if (!confirm('Delete this newsletter? It will be removed from the website.')) return;
    setDeletingId(id);
    try {
      await newsletterApi.deletePost(id);
      setPosts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error('Failed to delete newsletter:', err);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-nexus-text">
            Newsletter
          </h1>
          <p className="text-gray-500">Send newsletters with PDF attachments to all subscribers</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => { fetchSubscribers(); fetchPosts(); }}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={() => setIsComposeOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Compose Newsletter
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                {loadingSubscribers ? (
                  <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                ) : (
                  <p className="text-2xl font-bold text-gray-900 dark:text-nexus-text">{subscribers.length}</p>
                )}
                <p className="text-sm text-gray-500">Active Subscribers</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                <Mail className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-nexus-text">
                  {subscribers.length > 0 ? 'Ready' : 'No subscribers'}
                </p>
                <p className="text-sm text-gray-500">Email Status</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                <Newspaper className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                {loadingPosts ? (
                  <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                ) : (
                  <p className="text-2xl font-bold text-gray-900 dark:text-nexus-text">{posts.length}</p>
                )}
                <p className="text-sm text-gray-500">Published Newsletters</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Subscribers List */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-nexus-text mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-primary-500" />
            Subscribers ({subscribers.length})
          </h2>

          {loadingSubscribers ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
            </div>
          ) : subscribers.length === 0 ? (
            <div className="text-center py-8">
              <Mail className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No subscribers yet</p>
            </div>
          ) : (
            <div className="max-h-[400px] overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="text-left py-2 px-3 text-gray-500 font-medium">#</th>
                    <th className="text-left py-2 px-3 text-gray-500 font-medium">Email</th>
                    <th className="text-left py-2 px-3 text-gray-500 font-medium">Subscribed</th>
                    <th className="text-left py-2 px-3 text-gray-500 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {subscribers.map((sub, i) => (
                    <tr key={sub.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="py-2.5 px-3 text-gray-400">{i + 1}</td>
                      <td className="py-2.5 px-3 text-gray-900 dark:text-nexus-text font-medium">{sub.email}</td>
                      <td className="py-2.5 px-3 text-gray-500">
                        {new Date(sub.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-2.5 px-3">
                        <Badge color={sub.isActive ? 'green' : 'red'} size="sm">
                          {sub.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sent Newsletters History */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-nexus-text mb-4 flex items-center gap-2">
            <Newspaper className="w-5 h-5 text-primary-500" />
            Published Newsletters ({posts.length})
          </h2>

          {loadingPosts ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-8">
              <Newspaper className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No newsletters sent yet</p>
              <p className="text-sm text-gray-400 mt-1">Compose your first newsletter above</p>
            </div>
          ) : (
            <div className="space-y-3">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="flex items-start gap-4 p-4 rounded-xl border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30 shrink-0">
                    {post.coverImage ? (
                      <img
                        src={post.coverImage.includes('drive.google.com') ? `/api/drive-image?id=${post.coverImage.match(/[-\w]{25,}/)?.[0]}` : post.coverImage}
                        alt=""
                        title=""
                        className="w-10 h-10 rounded object-cover"
                      />
                    ) : (
                      <FileText className="w-5 h-5 text-purple-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 dark:text-nexus-text truncate">{post.subject}</h3>
                    <p className="text-sm text-gray-500 line-clamp-2 mt-1 break-words">{post.description}</p>
                    <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" />
                        Sent to {post.sentCount} / {post.totalCount}
                      </span>
                      {post.pdfUrl && (
                        <a
                          href={post.pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-primary-500 hover:underline"
                        >
                          <Download className="w-3.5 h-3.5" />
                          PDF
                        </a>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeletePost(post.id)}
                    disabled={deletingId === post.id}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors shrink-0"
                  >
                    {deletingId === post.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Compose Modal */}
      <Modal isOpen={isComposeOpen} onClose={closeCompose} size="lg">
        <ModalHeader>
          <div className="flex items-center gap-2">
            <Send className="w-5 h-5 text-primary-500" />
            Compose Newsletter
          </div>
        </ModalHeader>
        <ModalBody>
          <div className="space-y-5">
            {/* Subject */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Subject *
              </label>
              <Input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Newsletter subject line..."
                disabled={isSending}
              />
            </div>

            {/* Cover Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Cover Image (optional)
              </label>

              <input
                ref={coverImageInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleCoverImageSelect}
              />

              {!coverImageUrl && !coverImageUploading && (
                <div
                  className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-4 text-center cursor-pointer hover:border-primary-400 hover:bg-primary-50/5 transition-all"
                  onClick={() => coverImageInputRef.current?.click()}
                >
                  <ImagePlus className="w-7 h-7 mx-auto text-gray-400 mb-1.5" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Click to upload cover image
                  </p>
                </div>
              )}

              {coverImageUploading && (
                <div className="flex items-center gap-3 p-4 rounded-xl border border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20">
                  <Loader2 className="w-5 h-5 animate-spin text-blue-500 shrink-0" />
                  <p className="text-sm text-gray-500">Uploading image to Google Drive...</p>
                </div>
              )}

              {coverImageUrl && !coverImageUploading && (
                <div className="relative rounded-xl overflow-hidden border border-green-200 dark:border-green-800">
                  <img
                    src={coverImageUrl.includes('drive.google.com') ? `/api/drive-image?id=${coverImageUrl.match(/[-\w]{25,}/)?.[0]}` : coverImageUrl}
                    alt="Cover"
                    className="w-full h-40 object-cover"
                    title=""
                  />
                  {!isSending && (
                    <button
                      onClick={removeCoverImage}
                      className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
                    >
                      <X className="w-4 h-4 text-white" />
                    </button>
                  )}
                </div>
              )}

              {coverImageError && (
                <div className="flex items-center gap-2 mt-2 text-sm text-red-500">
                  <AlertCircle className="w-4 h-4" />
                  {coverImageError}
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Description / Content *
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={8}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-nexus-text focus:ring-2 focus:ring-primary-500 resize-none"
                placeholder="Write your newsletter content here... This will be included in the email body."
                disabled={isSending}
              />
            </div>

            {/* PDF Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                PDF Attachment (optional)
              </label>

              <input
                ref={pdfInputRef}
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={handlePdfSelect}
              />

              {!pdfFile && !pdfUploaded && (
                <div
                  className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-6 text-center cursor-pointer hover:border-primary-400 hover:bg-primary-50/5 transition-all"
                  onClick={() => pdfInputRef.current?.click()}
                >
                  <FileUp className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Click to upload PDF <span className="text-gray-400">(max 15MB)</span>
                  </p>
                </div>
              )}

              {/* Uploading state */}
              {pdfUploading && (
                <div className="flex items-center gap-3 p-4 rounded-xl border border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20">
                  <Loader2 className="w-5 h-5 animate-spin text-blue-500 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{pdfFile?.name}</p>
                    <p className="text-xs text-gray-500">Uploading to Google Drive...</p>
                  </div>
                </div>
              )}

              {/* Uploaded state */}
              {pdfUploaded && !pdfUploading && (
                <div className="flex items-center gap-3 p-4 rounded-xl border border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20">
                  <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{pdfUploaded.name}</p>
                    <a
                      href={pdfUploaded.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary-500 hover:underline"
                    >
                      View on Google Drive
                    </a>
                  </div>
                  {!isSending && (
                    <button
                      onClick={removePdf}
                      className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"
                    >
                      <X className="w-4 h-4 text-gray-400" />
                    </button>
                  )}
                </div>
              )}

              {/* Error state */}
              {pdfError && (
                <div className="flex items-center gap-2 mt-2 text-sm text-red-500">
                  <AlertCircle className="w-4 h-4" />
                  {pdfError}
                </div>
              )}
            </div>

            {/* Send result message */}
            {sendResult && (
              <div
                className={`flex items-center gap-2 p-3 rounded-lg text-sm ${
                  sendResult.success
                    ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                    : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                }`}
              >
                {sendResult.success ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0" />
                )}
                {sendResult.message}
              </div>
            )}

            {/* Info */}
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 text-xs text-gray-500">
              <p>
                This newsletter will be published on the website and emailed to <strong className="text-gray-700 dark:text-gray-300">{subscribers.length}</strong> active subscriber{subscribers.length !== 1 ? 's' : ''}.
                {pdfUploaded && ' The PDF link will be included.'}
              </p>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="outline" onClick={closeCompose} disabled={isSending}>
            Cancel
          </Button>
          <Button
            onClick={handleSend}
            disabled={!subject.trim() || !description.trim() || isSending || pdfUploading || coverImageUploading}
            isLoading={isSending}
          >
            <Send className="w-4 h-4 mr-2" />
            Publish & Send
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
