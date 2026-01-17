'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, 
  Search, 
  Filter, 
  Trash2, 
  Eye,
  Reply,
  Star,
  Archive,
  CheckCircle,
  Clock,
  User,
  Calendar,
  RefreshCw,
  MoreVertical,
  X
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Modal, ModalHeader, ModalBody, ModalFooter } from '@/components/ui/Modal';
import { formatRelativeTime } from '@/lib/utils';

// Mock data
const mockMessages = [
  {
    id: '1',
    name: 'Abdullah Rahman',
    email: 'abdullah@diu.edu.bd',
    subject: 'Query about Workshop Registration',
    message: 'Hello, I am interested in registering for the Machine Learning workshop. Could you please provide more details about the schedule and prerequisites? I am a 3rd year CSE student.',
    isRead: false,
    isStarred: true,
    isArchived: false,
    createdAt: '2024-03-10T09:30:00Z',
  },
  {
    id: '2',
    name: 'Fatima Akter',
    email: 'fatima@diu.edu.bd',
    subject: 'Collaboration Request',
    message: 'Our department would like to collaborate with DAIC for an upcoming AI competition. Please let us know if you are interested.',
    isRead: true,
    isStarred: false,
    isArchived: false,
    createdAt: '2024-03-09T14:20:00Z',
  },
  {
    id: '3',
    name: 'Kamal Hossain',
    email: 'kamal@example.com',
    subject: 'Membership Inquiry',
    message: 'I am a recent graduate from DIU. Can I still apply for membership in the AI Club?',
    isRead: true,
    isStarred: false,
    isArchived: false,
    createdAt: '2024-03-08T11:45:00Z',
  },
  {
    id: '4',
    name: 'Rashida Khanom',
    email: 'rashida@diu.edu.bd',
    subject: 'Speaker Invitation',
    message: 'I would like to invite a member from DAIC to speak at our department seminar about AI careers.',
    isRead: false,
    isStarred: false,
    isArchived: false,
    createdAt: '2024-03-07T16:00:00Z',
  },
  {
    id: '5',
    name: 'Mohammad Ali',
    email: 'ali@diu.edu.bd',
    subject: 'Certificate Request',
    message: 'I attended the Python workshop last month but did not receive my certificate. Could you please check?',
    isRead: true,
    isStarred: true,
    isArchived: false,
    createdAt: '2024-03-06T10:15:00Z',
  },
];

type Message = typeof mockMessages[0];

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'unread' | 'starred' | 'archived'>('all');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replyContent, setReplyContent] = useState('');

  // Filter messages
  const filteredMessages = messages.filter((message) => {
    const matchesSearch = 
      message.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.subject.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filter === 'unread') return matchesSearch && !message.isRead;
    if (filter === 'starred') return matchesSearch && message.isStarred;
    if (filter === 'archived') return matchesSearch && message.isArchived;
    return matchesSearch && !message.isArchived;
  });

  // Stats
  const stats = {
    total: messages.length,
    unread: messages.filter(m => !m.isRead).length,
    starred: messages.filter(m => m.isStarred).length,
    archived: messages.filter(m => m.isArchived).length,
  };

  const handleMarkAsRead = (id: string) => {
    setMessages(messages.map(m => m.id === id ? { ...m, isRead: true } : m));
  };

  const handleToggleStar = (id: string) => {
    setMessages(messages.map(m => m.id === id ? { ...m, isStarred: !m.isStarred } : m));
  };

  const handleArchive = (id: string) => {
    setMessages(messages.map(m => m.id === id ? { ...m, isArchived: true } : m));
    setSelectedMessage(null);
  };

  const handleDelete = (id: string) => {
    setMessages(messages.filter(m => m.id !== id));
    setSelectedMessage(null);
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
          <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">
            Messages
          </h1>
          <p className="text-gray-500">Contact form submissions and inquiries</p>
        </div>
        <Button variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-4 gap-4">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setFilter('all')}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <Mail className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
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
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.unread}</p>
                <p className="text-sm text-gray-500">Unread</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setFilter('starred')}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-yellow-100 dark:bg-yellow-900/30">
                <Star className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.starred}</p>
                <p className="text-sm text-gray-500">Starred</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setFilter('archived')}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
                <Archive className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.archived}</p>
                <p className="text-sm text-gray-500">Archived</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

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
            {['all', 'unread', 'starred', 'archived'].map((f) => (
              <Button
                key={f}
                variant={filter === f ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setFilter(f as any)}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </Button>
            ))}
          </div>

          {/* Messages */}
          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {filteredMessages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
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
                      <span className={`font-medium truncate ${!message.isRead ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>
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
                      {formatRelativeTime(message.createdAt)}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleStar(message.id);
                    }}
                    className="p-1"
                  >
                    <Star className={`w-4 h-4 ${message.isStarred ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`} />
                  </button>
                </div>
              </motion.div>
            ))}

            {filteredMessages.length === 0 && (
              <div className="text-center py-12">
                <Mail className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No messages found</p>
              </div>
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
                    onClick={() => handleToggleStar(selectedMessage.id)}
                  >
                    <Star className={`w-4 h-4 ${selectedMessage.isStarred ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleArchive(selectedMessage.id)}
                  >
                    <Archive className="w-4 h-4" />
                  </Button>
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

      {/* Reply Modal */}
      <Modal isOpen={showReplyModal} onClose={() => setShowReplyModal(false)} size="lg">
        <ModalHeader onClose={() => setShowReplyModal(false)}>
          Reply to {selectedMessage?.name}
        </ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                To
              </label>
              <Input value={selectedMessage?.email || ''} disabled />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Subject
              </label>
              <Input value={`Re: ${selectedMessage?.subject || ''}`} disabled />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Message
              </label>
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
          <Button variant="outline" onClick={() => setShowReplyModal(false)}>
            Cancel
          </Button>
          <Button onClick={() => {
            // Handle reply
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
