'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Mail, 
  Search, 
  Trash2, 
  Reply,
  Star,
  Archive,
  Clock,
  User,
  Calendar,
  RefreshCw,
  Loader2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Modal, ModalHeader, ModalBody, ModalFooter } from '@/components/ui/Modal';
import { adminApi } from '@/lib/api';

interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  isStarred?: boolean;
  isArchived?: boolean;
  createdAt: string;
}

function formatTimeAgo(dateStr: string) {
  const now = new Date();
  const date = new Date(dateStr);
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return date.toLocaleDateString();
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replyContent, setReplyContent] = useState('');

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    try {
      const response = await adminApi.getMessages({ search: searchQuery });
      const data = response.data;
      const list = data.data || data.messages || data.contacts || data;
      if (Array.isArray(list)) {
        setMessages(list);
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    } finally {
      setLoading(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    const debounce = setTimeout(() => fetchMessages(), 300);
    return () => clearTimeout(debounce);
  }, [fetchMessages]);

  const filteredMessages = messages.filter((message) => {
    if (filter === 'unread') return !message.isRead;
    if (filter === 'read') return message.isRead;
    return true;
  });

  const stats = {
    total: messages.length,
    unread: messages.filter(m => !m.isRead).length,
    read: messages.filter(m => m.isRead).length,
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await adminApi.markMessageAsRead(id);
      setMessages(prev => prev.map(m => m.id === id ? { ...m, isRead: true } : m));
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await adminApi.deleteMessage(id);
      setMessages(prev => prev.filter(m => m.id !== id));
      if (selectedMessage?.id === id) setSelectedMessage(null);
    } catch (error) {
      console.error('Failed to delete message:', error);
    }
  };

  const handleViewMessage = (message: Message) => {
    setSelectedMessage(message);
    if (!message.isRead) {
      handleMarkAsRead(message.id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-nexus-text">
            Messages
          </h1>
          <p className="text-gray-500">Contact form submissions and inquiries</p>
        </div>
        <Button variant="outline" onClick={() => fetchMessages()}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-3 gap-4">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setFilter('all')}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <Mail className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-nexus-text">{stats.total}</p>
                <p className="text-sm text-gray-500">Total</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setFilter('unread')}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30">
                <Clock className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-nexus-text">{stats.unread}</p>
                <p className="text-sm text-gray-500">Unread</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setFilter('read')}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                <Mail className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-nexus-text">{stats.read}</p>
                <p className="text-sm text-gray-500">Read</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      ) : (
        <div className="grid lg:grid-cols-5 gap-6">
          {/* Message List */}
          <div className="lg:col-span-2 space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search messages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2">
              {(['all', 'unread', 'read'] as const).map((f) => (
                <Button
                  key={f}
                  variant={filter === f ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setFilter(f)}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                  {f === 'unread' && stats.unread > 0 && (
                    <Badge color="red" size="sm" className="ml-1">{stats.unread}</Badge>
                  )}
                </Button>
              ))}
            </div>

            {/* Messages */}
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {filteredMessages.length === 0 ? (
                <div className="text-center py-12">
                  <Mail className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No messages found</p>
                </div>
              ) : (
                filteredMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`p-4 rounded-xl cursor-pointer transition-all ${
                      selectedMessage?.id === message.id
                        ? 'bg-primary-50 dark:bg-primary-900/20 border-2 border-primary-500'
                        : 'bg-white dark:bg-gray-800 hover:shadow-md border border-transparent'
                    } ${!message.isRead ? 'border-l-4 border-l-primary-500' : ''}`}
                    onClick={() => handleViewMessage(message)}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`font-medium truncate ${!message.isRead ? 'text-gray-900 dark:text-nexus-text' : 'text-gray-600 dark:text-gray-400'}`}>
                            {message.name}
                          </span>
                          {!message.isRead && (
                            <span className="w-2 h-2 rounded-full bg-primary-500" />
                          )}
                        </div>
                        <p className={`text-sm truncate ${!message.isRead ? 'font-medium text-gray-800 dark:text-gray-200' : 'text-gray-600 dark:text-gray-400'}`}>
                          {message.subject}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatTimeAgo(message.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Message Detail */}
          <div className="lg:col-span-3">
            {selectedMessage ? (
              <Card className="h-full">
                <CardHeader className="flex flex-row items-start justify-between">
                  <div>
                    <CardTitle>{selectedMessage.subject}</CardTitle>
                    <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                      <User className="w-4 h-4" />
                      <span>{selectedMessage.name}</span>
                      <span>•</span>
                      <span>{selectedMessage.email}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(selectedMessage.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-600"
                      onClick={() => handleDelete(selectedMessage.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="prose dark:prose-invert max-w-none mb-6">
                    <p className="whitespace-pre-wrap">{selectedMessage.message}</p>
                  </div>

                  <div className="border-t border-gray-100 dark:border-gray-800 pt-6">
                    <Button onClick={() => setShowReplyModal(true)}>
                      <Reply className="w-4 h-4 mr-2" />
                      Reply to {selectedMessage.name}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="h-full flex items-center justify-center">
                <div className="text-center py-12">
                  <Mail className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Select a message to view</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      )}

      {/* Reply Modal */}
      <Modal isOpen={showReplyModal} onClose={() => setShowReplyModal(false)} size="lg">
        <ModalHeader>
          Reply to {selectedMessage?.name}
        </ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">To</label>
              <Input value={selectedMessage?.email || ''} disabled />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subject</label>
              <Input value={`Re: ${selectedMessage?.subject || ''}`} disabled />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Message</label>
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                rows={8}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500 resize-none"
                placeholder="Write your reply..."
              />
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="outline" onClick={() => setShowReplyModal(false)}>Cancel</Button>
          <Button onClick={() => {
            setShowReplyModal(false);
            setReplyContent('');
          }}>
            Send Reply
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
