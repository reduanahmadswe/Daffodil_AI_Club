'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  Calendar,
  MessageSquare,
  Award,
  Users,
  Megaphone,
  Check,
  Trash2,
  Settings,
  Filter
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

const mockNotifications = [
  {
    id: '1',
    type: 'event',
    title: 'Event Reminder',
    message: 'Machine Learning Workshop starts in 2 hours',
    timestamp: '2 hours ago',
    isRead: false,
    icon: Calendar,
    color: 'bg-blue-500',
  },
  {
    id: '2',
    type: 'announcement',
    title: 'Club Announcement',
    message: 'Registration open for AI Hackathon 2024',
    timestamp: '5 hours ago',
    isRead: false,
    icon: Megaphone,
    color: 'bg-purple-500',
  },
  {
    id: '3',
    type: 'certificate',
    title: 'Certificate Issued',
    message: 'Your certificate for Python Workshop is ready',
    timestamp: '1 day ago',
    isRead: true,
    icon: Award,
    color: 'bg-green-500',
  },
  {
    id: '4',
    type: 'comment',
    title: 'New Comment',
    message: 'Someone commented on your blog post',
    timestamp: '2 days ago',
    isRead: true,
    icon: MessageSquare,
    color: 'bg-orange-500',
  },
  {
    id: '5',
    type: 'member',
    title: 'Welcome to DAIC!',
    message: 'Your membership has been confirmed. Your ID: DAIC-SPRING-00142',
    timestamp: '1 week ago',
    isRead: true,
    icon: Users,
    color: 'bg-pink-500',
  },
];

type NotificationType = 'all' | 'event' | 'announcement' | 'certificate' | 'comment';

export default function DashboardNotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [filter, setFilter] = useState<NotificationType>('all');

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const filteredNotifications = notifications.filter(n =>
    filter === 'all' || n.type === filter
  );

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white flex items-center gap-2">
            Notifications
            {unreadCount > 0 && (
              <Badge color="red" className="ml-2">{unreadCount} new</Badge>
            )}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Stay updated with club activities
          </p>
        </div>
        <div className="flex gap-2">
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={markAllAsRead}>
              <Check className="w-4 h-4 mr-1" />
              Mark all read
            </Button>
          )}
          {notifications.length > 0 && (
            <Button variant="ghost" size="sm" onClick={clearAll} className="text-red-500 hover:text-red-600">
              <Trash2 className="w-4 h-4 mr-1" />
              Clear all
            </Button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide">
        {[
          { value: 'all', label: 'All' },
          { value: 'event', label: 'Events' },
          { value: 'announcement', label: 'Announcements' },
          { value: 'certificate', label: 'Certificates' },
          { value: 'comment', label: 'Comments' },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value as NotificationType)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${filter === tab.value
                ? 'bg-primary-500 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <Card>
        <CardContent className="p-0">
          {filteredNotifications.length > 0 ? (
            <AnimatePresence>
              <div className="divide-y divide-gray-100 dark:divide-gray-800">
                {filteredNotifications.map((notification, index) => {
                  const IconComponent = notification.icon;

                  return (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.05 }}
                      className={`flex items-start gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${!notification.isRead ? 'bg-primary-50/50 dark:bg-primary-900/10' : ''
                        }`}
                    >
                      {/* Icon */}
                      <div className={`flex-shrink-0 w-10 h-10 rounded-full ${notification.color} flex items-center justify-center`}>
                        <IconComponent className="w-5 h-5 text-white" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium text-gray-900 dark:text-white">
                            {notification.title}
                          </p>
                          {!notification.isRead && (
                            <span className="w-2 h-2 rounded-full bg-primary-500" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-500">{notification.timestamp}</p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1">
                        {!notification.isRead && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="p-2"
                            onClick={() => markAsRead(notification.id)}
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-2 text-gray-400 hover:text-red-500"
                          onClick={() => deleteNotification(notification.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </AnimatePresence>
          ) : (
            <div className="p-12 text-center">
              <Bell className="w-12 h-12 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No notifications
              </h3>
              <p className="text-gray-500">
                {filter !== 'all'
                  ? 'No notifications in this category'
                  : "You're all caught up!"
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Notification Settings Link */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Settings className="w-5 h-5 text-gray-500" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Notification Settings</p>
                <p className="text-sm text-gray-500">Configure what notifications you receive</p>
              </div>
            </div>
            <Link href="/dashboard/settings">
              <Button variant="outline" size="sm">Manage</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
