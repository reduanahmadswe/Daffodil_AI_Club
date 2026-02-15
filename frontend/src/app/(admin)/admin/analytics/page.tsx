'use client';

import React from 'react';
import {
  BarChart3,
  Users,
  Eye,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Activity,
  Globe,
  Clock
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';

export default function AdminAnalyticsPage() {
  const overviewStats = [
    { label: 'Total Page Views', value: '0', change: '+0%', up: true, icon: Eye },
    { label: 'Active Members', value: '0', change: '+0%', up: true, icon: Users },
    { label: 'New Signups', value: '0', change: '+0%', up: true, icon: TrendingUp },
    { label: 'Events Hosted', value: '0', change: '+0%', up: true, icon: Calendar },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-nexus-text">
          Analytics
        </h1>
        <p className="text-gray-500">Track platform engagement and growth metrics</p>
      </div>

      {/* Overview Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {overviewStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-lg bg-primary-100 dark:bg-primary-900/30">
                    <Icon className="w-5 h-5 text-primary-600" />
                  </div>
                  <span className={`flex items-center text-sm font-medium ${stat.up ? 'text-green-600' : 'text-red-500'}`}>
                    {stat.change}
                    {stat.up ? <ArrowUpRight className="w-4 h-4 ml-1" /> : <ArrowDownRight className="w-4 h-4 ml-1" />}
                  </span>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-nexus-text">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts placeholder */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-nexus-text mb-4">
              Traffic Overview
            </h3>
            <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl">
              <div className="text-center">
                <Activity className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-400 text-sm">Traffic chart will appear here</p>
                <p className="text-gray-400 text-xs mt-1">Integrate with analytics service</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-nexus-text mb-4">
              Member Growth
            </h3>
            <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl">
              <div className="text-center">
                <Users className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-400 text-sm">Growth chart will appear here</p>
                <p className="text-gray-400 text-xs mt-1">Data from member signups</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity + Top Pages */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-nexus-text mb-4">
              Recent Activity
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-center py-8 text-gray-400">
                <Clock className="w-5 h-5 mr-2" />
                <span className="text-sm">No recent activity to display</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-nexus-text mb-4">
              Top Pages
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-center py-8 text-gray-400">
                <Globe className="w-5 h-5 mr-2" />
                <span className="text-sm">No page data available</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
