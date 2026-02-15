'use client';

import React, { useState } from 'react';
import {
  Mail,
  Send,
  Users,
  FileText,
  Clock,
  Plus,
  Eye,
  Trash2,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Modal, ModalHeader, ModalBody, ModalFooter } from '@/components/ui/Modal';

export default function AdminNewsletterPage() {
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');

  const stats = {
    subscribers: 0,
    sent: 0,
    drafts: 0,
    scheduled: 0,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-nexus-text">
            Newsletter
          </h1>
          <p className="text-gray-500">Create and send newsletters to subscribers</p>
        </div>
        <Button onClick={() => setIsComposeOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Compose Newsletter
        </Button>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-nexus-text">{stats.subscribers}</p>
                <p className="text-sm text-gray-500">Subscribers</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                <Send className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-nexus-text">{stats.sent}</p>
                <p className="text-sm text-gray-500">Sent</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-yellow-100 dark:bg-yellow-900/30">
                <FileText className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-nexus-text">{stats.drafts}</p>
                <p className="text-sm text-gray-500">Drafts</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                <Clock className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-nexus-text">{stats.scheduled}</p>
                <p className="text-sm text-gray-500">Scheduled</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Empty State */}
      <Card>
        <CardContent className="py-16 text-center">
          <Mail className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-nexus-text mb-2">
            No newsletters yet
          </h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            Start engaging with your subscribers by creating your first newsletter.
          </p>
          <Button onClick={() => setIsComposeOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create First Newsletter
          </Button>
        </CardContent>
      </Card>

      {/* Compose Modal */}
      <Modal isOpen={isComposeOpen} onClose={() => setIsComposeOpen(false)} size="lg">
        <ModalHeader>Compose Newsletter</ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subject</label>
              <Input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Newsletter subject line..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Content</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={12}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-nexus-text focus:ring-2 focus:ring-primary-500 resize-none"
                placeholder="Write your newsletter content..."
              />
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="outline" onClick={() => setIsComposeOpen(false)}>Save Draft</Button>
          <Button>
            <Send className="w-4 h-4 mr-2" />
            Send Newsletter
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
