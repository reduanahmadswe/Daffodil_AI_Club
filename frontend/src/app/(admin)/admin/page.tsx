'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
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
  Activity
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';

const stats = [
  { 
    icon: Users, 
    label: 'Total Members', 
    value: '523', 
    change: '+12%',
    trend: 'up',
    color: 'bg-blue-500'
  },
  { 
    icon: Calendar, 
    label: 'Active Events', 
    value: '8', 
    change: '+3',
    trend: 'up',
    color: 'bg-green-500'
  },
  { 
    icon: FileText, 
    label: 'Blog Posts', 
    value: '45', 
    change: '+5',
    trend: 'up',
    color: 'bg-purple-500'
  },
  { 
    icon: Eye, 
    label: 'Website Visits', 
    value: '12.5K', 
    change: '+18%',
    trend: 'up',
    color: 'bg-orange-500'
  },
];

const recentMembers = [
  { name: 'Abdullah Rahman', email: 'abdullah@diu.edu.bd', date: '2 hours ago', department: 'CSE' },
  { name: 'Fatima Begum', email: 'fatima@diu.edu.bd', date: '5 hours ago', department: 'SWE' },
  { name: 'Mahmudul Hasan', email: 'mahmud@diu.edu.bd', date: '1 day ago', department: 'CSE' },
  { name: 'Tasnim Akhter', email: 'tasnim@diu.edu.bd', date: '1 day ago', department: 'EEE' },
];

const recentMessages = [
  { name: 'John Doe', subject: 'Membership Query', message: 'I want to know about the membership process...', date: '1 hour ago' },
  { name: 'Jane Smith', subject: 'Event Collaboration', message: 'We would like to collaborate on an AI event...', date: '3 hours ago' },
  { name: 'Bob Wilson', subject: 'Workshop Feedback', message: 'The ML workshop was excellent...', date: '1 day ago' },
];

const quickActions = [
  { icon: Calendar, label: 'Create Event', href: '/admin/events/create', color: 'from-blue-500 to-blue-600' },
  { icon: FileText, label: 'Write Blog', href: '/admin/blogs/create', color: 'from-purple-500 to-purple-600' },
  { icon: Users, label: 'Add Member', href: '/admin/members/add', color: 'from-green-500 to-green-600' },
  { icon: Image, label: 'Upload Photo', href: '/admin/gallery/upload', color: 'from-orange-500 to-orange-600' },
];

export default function AdminDashboard() {
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
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center`}>
                    <stat.icon className="w-6 h-6 text-nexus-text" />
                  </div>
                  <Badge 
                    color={stat.trend === 'up' ? 'green' : 'red'} 
                    size="sm"
                    className="flex items-center gap-1"
                  >
                    {stat.trend === 'up' ? (
                      <ArrowUpRight className="w-3 h-3" />
                    ) : (
                      <ArrowDownRight className="w-3 h-3" />
                    )}
                    {stat.change}
                  </Badge>
                </div>
                <div className="mt-4">
                  <p className="text-3xl font-bold text-gray-900 dark:text-nexus-text">{stat.value}</p>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
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
              {recentMembers.map((member) => (
                <div key={member.email} className="flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <Avatar name={member.name} size="md" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 dark:text-nexus-text truncate">{member.name}</p>
                    <p className="text-sm text-gray-500 truncate">{member.email}</p>
                  </div>
                  <div className="text-right">
                    <Badge color="blue" size="sm">{member.department}</Badge>
                    <p className="text-xs text-gray-500 mt-1">{member.date}</p>
                  </div>
                </div>
              ))}
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
              {recentMessages.map((message, index) => (
                <div key={index} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-gray-900 dark:text-nexus-text">{message.name}</p>
                    <span className="text-xs text-gray-500">{message.date}</span>
                  </div>
                  <p className="text-sm font-medium text-primary-600 mb-1">{message.subject}</p>
                  <p className="text-sm text-gray-500 line-clamp-1">{message.message}</p>
                </div>
              ))}
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
