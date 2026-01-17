'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Award, 
  Bookmark, 
  CreditCard, 
  ArrowRight, 
  TrendingUp,
  Clock,
  Bell,
  CheckCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { useAuthStore } from '@/lib/store';

const stats = [
  { icon: Calendar, label: 'Events Attended', value: '12', color: 'bg-blue-500' },
  { icon: Award, label: 'Certificates', value: '5', color: 'bg-green-500' },
  { icon: Bookmark, label: 'Bookmarks', value: '8', color: 'bg-purple-500' },
  { icon: TrendingUp, label: 'Points Earned', value: '350', color: 'bg-orange-500' },
];

const upcomingEvents = [
  { id: 1, title: 'ML Workshop', date: 'March 15', time: '3:00 PM', type: 'Workshop' },
  { id: 2, title: 'AI Hackathon', date: 'March 25', time: '9:00 AM', type: 'Competition' },
  { id: 3, title: 'Deep Learning Session', date: 'April 5', time: '2:00 PM', type: 'Session' },
];

const recentActivity = [
  { id: 1, action: 'Registered for ML Workshop', time: '2 hours ago', icon: CheckCircle },
  { id: 2, action: 'Earned participation certificate', time: '1 day ago', icon: Award },
  { id: 3, action: 'Bookmarked AI Fundamentals', time: '2 days ago', icon: Bookmark },
];

export default function DashboardPage() {
  const { user } = useAuthStore();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white">
            Welcome back, {user?.name?.split(' ')[0]}! 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Here's what's happening with your AI Club activities
          </p>
        </div>
        <Link href="/dashboard/id-card">
          <Button variant="primary">
            <CreditCard className="w-4 h-4 mr-2" />
            View ID Card
          </Button>
        </Link>
      </div>

      {/* Member ID Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary-500 via-secondary-500 to-pink-500 p-6"
      >
        <div className="absolute inset-0 pattern-dots opacity-10" />
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Avatar src={user?.profileImage} name={user?.name || ''} size="lg" />
            <div className="text-white">
              <p className="text-sm opacity-80">Your Member ID</p>
              <p className="text-2xl font-mono font-bold">{user?.uniqueId || 'DAIC-SPRING-00001'}</p>
              <p className="text-sm opacity-80 mt-1">{user?.department} • Batch {user?.batch}</p>
            </div>
          </div>
          <Link href="/dashboard/id-card" className="hidden md:block">
            <Button className="bg-white/20 hover:bg-white/30 text-white border-white/30">
              Download ID Card
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                    <p className="text-sm text-gray-500">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Upcoming Events */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Upcoming Events</CardTitle>
              <Link href="/dashboard/events">
                <Button variant="ghost" size="sm">
                  View All
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex flex-col items-center justify-center">
                    <Calendar className="w-5 h-5 text-primary-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white">{event.title}</p>
                    <p className="text-sm text-gray-500">{event.date} at {event.time}</p>
                  </div>
                  <Badge color={event.type === 'Workshop' ? 'blue' : event.type === 'Competition' ? 'purple' : 'green'}>
                    {event.type}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Activity</CardTitle>
              <Link href="/dashboard/notifications">
                <Button variant="ghost" size="sm">
                  <Bell className="w-4 h-4 mr-1" />
                  Notifications
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center gap-4 p-4">
                  <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <activity.icon className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white">{activity.action}</p>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Shortcuts to common tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/events">
              <Button variant="outline" className="w-full h-auto py-4 flex-col gap-2">
                <Calendar className="w-6 h-6 text-primary-600" />
                <span>Browse Events</span>
              </Button>
            </Link>
            <Link href="/dashboard/certificates">
              <Button variant="outline" className="w-full h-auto py-4 flex-col gap-2">
                <Award className="w-6 h-6 text-green-600" />
                <span>My Certificates</span>
              </Button>
            </Link>
            <Link href="/dashboard/profile">
              <Button variant="outline" className="w-full h-auto py-4 flex-col gap-2">
                <CreditCard className="w-6 h-6 text-purple-600" />
                <span>Edit Profile</span>
              </Button>
            </Link>
            <Link href="/workshops">
              <Button variant="outline" className="w-full h-auto py-4 flex-col gap-2">
                <TrendingUp className="w-6 h-6 text-orange-600" />
                <span>Workshops</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
