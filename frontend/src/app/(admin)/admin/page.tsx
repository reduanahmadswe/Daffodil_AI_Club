'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Users, 
  Calendar, 
  FileText, 
  Image, 
  MessageSquare,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  UserPlus,
  Activity,
  Loader2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { membersApi, eventsApi, blogsApi, contactApi } from '@/lib/api';

interface DashboardStats {
  totalMembers: number;
  activeEvents: number;
  totalBlogs: number;
  totalMessages: number;
}

interface RecentMember {
  id: string;
  name: string;
  email: string;
  department?: string;
  createdAt: string;
}

interface RecentMessage {
  id: string;
  name: string;
  subject: string;
  message: string;
  createdAt: string;
}

const quickActions = [
  { icon: Calendar, label: 'Create Event', href: '/admin/events', color: 'from-blue-500 to-blue-600' },
  { icon: FileText, label: 'Write Blog', href: '/admin/blogs', color: 'from-purple-500 to-purple-600' },
  { icon: Users, label: 'Manage Members', href: '/admin/members', color: 'from-green-500 to-green-600' },
  { icon: Image, label: 'Gallery', href: '/admin/gallery', color: 'from-orange-500 to-orange-600' },
];

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hours ago`;
  if (diffDays < 30) return `${diffDays} days ago`;
  return date.toLocaleDateString();
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalMembers: 0,
    activeEvents: 0,
    totalBlogs: 0,
    totalMessages: 0,
  });
  const [recentMembers, setRecentMembers] = useState<RecentMember[]>([]);
  const [recentMessages, setRecentMessages] = useState<RecentMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [membersRes, eventsRes, blogsRes, messagesRes] = await Promise.allSettled([
          membersApi.getAll({ limit: 4, sort: 'createdAt', order: 'desc' }),
          eventsApi.getAll({ limit: 100 }),
          blogsApi.getAll({ limit: 100 }),
          contactApi.getAll({ limit: 3, sort: 'createdAt', order: 'desc' }),
        ]);

        // Extract members
        if (membersRes.status === 'fulfilled') {
          const membersData = membersRes.value.data;
          const members = membersData.data || membersData.members || membersData;
          if (Array.isArray(members)) {
            setRecentMembers(members.slice(0, 4));
          }
          setStats((prev) => ({
            ...prev,
            totalMembers: membersData.total || membersData.pagination?.total || members.length || 0,
          }));
        }

        // Extract events count
        if (eventsRes.status === 'fulfilled') {
          const eventsData = eventsRes.value.data;
          const events = eventsData.data || eventsData.events || eventsData;
          const activeCount = Array.isArray(events) 
            ? events.filter((e: any) => e.isPublished).length 
            : eventsData.total || 0;
          setStats((prev) => ({ ...prev, activeEvents: activeCount }));
        }

        // Extract blogs count
        if (blogsRes.status === 'fulfilled') {
          const blogsData = blogsRes.value.data;
          const blogs = blogsData.data || blogsData.blogs || blogsData;
          setStats((prev) => ({
            ...prev,
            totalBlogs: blogsData.total || blogsData.pagination?.total || (Array.isArray(blogs) ? blogs.length : 0),
          }));
        }

        // Extract messages
        if (messagesRes.status === 'fulfilled') {
          const messagesData = messagesRes.value.data;
          const messages = messagesData.data || messagesData.messages || messagesData;
          if (Array.isArray(messages)) {
            setRecentMessages(messages.slice(0, 3));
          }
          setStats((prev) => ({
            ...prev,
            totalMessages: messagesData.total || messagesData.pagination?.total || (Array.isArray(messages) ? messages.length : 0),
          }));
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const statCards = [
    { icon: Users, label: 'Total Members', value: stats.totalMembers.toString(), color: 'bg-blue-500' },
    { icon: Calendar, label: 'Active Events', value: stats.activeEvents.toString(), color: 'bg-green-500' },
    { icon: FileText, label: 'Blog Posts', value: stats.totalBlogs.toString(), color: 'bg-purple-500' },
    { icon: MessageSquare, label: 'Messages', value: stats.totalMessages.toString(), color: 'bg-orange-500' },
  ];
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-nexus-text">
          Admin Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Overview of club activities and management
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <div key={stat.label}>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="mt-4">
                  {loading ? (
                    <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                  ) : (
                    <p className="text-3xl font-bold text-gray-900 dark:text-nexus-text">{stat.value}</p>
                  )}
                  <p className="text-sm text-gray-500">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Shortcuts to common administrative tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action) => (
              <Link key={action.label} href={action.href}>
                <div className={`p-4 rounded-xl bg-gradient-to-br ${action.color} text-nexus-text text-center hover:opacity-90 transition-opacity cursor-pointer`}>
                  <action.icon className="w-8 h-8 mx-auto mb-2" />
                  <span className="font-medium">{action.label}</span>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Content Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Members */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-green-500" />
                New Members
              </CardTitle>
              <Link href="/admin/members">
                <Button variant="ghost" size="sm">View All</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {loading ? (
                <div className="p-8 text-center">
                  <Loader2 className="w-6 h-6 animate-spin text-gray-400 mx-auto" />
                </div>
              ) : recentMembers.length === 0 ? (
                <div className="p-8 text-center text-gray-500">No members yet</div>
              ) : (
                recentMembers.map((member) => (
                  <div key={member.id || member.email} className="flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <Avatar name={member.name} size="md" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 dark:text-nexus-text truncate">{member.name}</p>
                      <p className="text-sm text-gray-500 truncate">{member.email}</p>
                    </div>
                    <div className="text-right">
                      {member.department && <Badge color="blue" size="sm">{member.department}</Badge>}
                      <p className="text-xs text-gray-500 mt-1">{formatTimeAgo(member.createdAt)}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Messages */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-purple-500" />
                Recent Messages
              </CardTitle>
              <Link href="/admin/messages">
                <Button variant="ghost" size="sm">View All</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {loading ? (
                <div className="p-8 text-center">
                  <Loader2 className="w-6 h-6 animate-spin text-gray-400 mx-auto" />
                </div>
              ) : recentMessages.length === 0 ? (
                <div className="p-8 text-center text-gray-500">No messages yet</div>
              ) : (
                recentMessages.map((message) => (
                  <div key={message.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium text-gray-900 dark:text-nexus-text">{message.name}</p>
                      <span className="text-xs text-gray-500">{formatTimeAgo(message.createdAt)}</span>
                    </div>
                    <p className="text-sm font-medium text-primary-600 mb-1">{message.subject}</p>
                    <p className="text-sm text-gray-500 line-clamp-1">{message.message}</p>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity Chart Placeholder */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-500" />
                Activity Overview
              </CardTitle>
              <CardDescription>Member registrations and event attendance this month</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm">Week</Button>
              <Button variant="outline" size="sm">Month</Button>
              <Button variant="ghost" size="sm">Year</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-xl">
            <p className="text-gray-500">Activity Chart Visualization</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
