'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bookmark, 
  Calendar, 
  FileText,
  Folder,
  Video,
  Search,
  Trash2,
  ExternalLink,
  Filter
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';

const mockBookmarks = [
  {
    id: '1',
    type: 'blog',
    title: 'Getting Started with Neural Networks',
    description: 'A comprehensive guide to understanding neural networks...',
    url: '/blog/neural-networks',
    savedAt: '2024-02-15',
    icon: FileText,
    color: 'bg-purple-500',
  },
  {
    id: '2',
    type: 'event',
    title: 'AI Hackathon 2024',
    description: 'Annual AI hackathon with prizes worth 50,000 BDT',
    url: '/events/ai-hackathon-2024',
    savedAt: '2024-02-14',
    icon: Calendar,
    color: 'bg-blue-500',
  },
  {
    id: '3',
    type: 'project',
    title: 'Plant Disease Detection AI',
    description: 'Mobile app using computer vision for plant health',
    url: '/projects/plant-disease-detection',
    savedAt: '2024-02-10',
    icon: Folder,
    color: 'bg-green-500',
  },
  {
    id: '4',
    type: 'blog',
    title: 'Introduction to NLP with Python',
    description: 'Learn natural language processing fundamentals...',
    url: '/blog/nlp-python',
    savedAt: '2024-02-08',
    icon: FileText,
    color: 'bg-purple-500',
  },
  {
    id: '5',
    type: 'workshop',
    title: 'Deep Learning Bootcamp Recording',
    description: 'Full recording of the 3-day deep learning bootcamp',
    url: '/workshops/deep-learning-bootcamp',
    savedAt: '2024-02-01',
    icon: Video,
    color: 'bg-orange-500',
  },
];

type BookmarkType = 'all' | 'blog' | 'event' | 'project' | 'workshop';

export default function DashboardBookmarksPage() {
  const [bookmarks, setBookmarks] = useState(mockBookmarks);
  const [filter, setFilter] = useState<BookmarkType>('all');
  const [search, setSearch] = useState('');

  const filteredBookmarks = bookmarks.filter(bookmark => {
    const matchesFilter = filter === 'all' || bookmark.type === filter;
    const matchesSearch = bookmark.title.toLowerCase().includes(search.toLowerCase()) ||
      bookmark.description.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const removeBookmark = (id: string) => {
    setBookmarks(prev => prev.filter(b => b.id !== id));
  };

  const clearAll = () => {
    setBookmarks([]);
  };

  const typeLabels = {
    all: 'All',
    blog: 'Blogs',
    event: 'Events',
    project: 'Projects',
    workshop: 'Workshops',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">
            My Bookmarks
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Your saved content for later
          </p>
        </div>
        {bookmarks.length > 0 && (
          <Button variant="ghost" size="sm" onClick={clearAll} className="text-red-500 hover:text-red-600">
            <Trash2 className="w-4 h-4 mr-1" />
            Clear all
          </Button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{bookmarks.length}</p>
            <p className="text-sm text-gray-500">Total Saved</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-purple-600">{bookmarks.filter(b => b.type === 'blog').length}</p>
            <p className="text-sm text-gray-500">Blogs</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">{bookmarks.filter(b => b.type === 'event').length}</p>
            <p className="text-sm text-gray-500">Events</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-green-600">{bookmarks.filter(b => b.type === 'project').length}</p>
            <p className="text-sm text-gray-500">Projects</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-orange-600">{bookmarks.filter(b => b.type === 'workshop').length}</p>
            <p className="text-sm text-gray-500">Workshops</p>
          </CardContent>
        </Card>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 max-w-md">
          <Input
            type="search"
            placeholder="Search bookmarks..."
            leftIcon={<Search className="w-5 h-5" />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {(Object.keys(typeLabels) as BookmarkType[]).map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                filter === type
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
              }`}
            >
              {typeLabels[type]}
            </button>
          ))}
        </div>
      </div>

      {/* Bookmarks List */}
      {filteredBookmarks.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-4">
          <AnimatePresence>
            {filteredBookmarks.map((bookmark, index) => {
              const IconComponent = bookmark.icon;
              
              return (
                <motion.div
                  key={bookmark.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="hover:shadow-md transition-shadow h-full">
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        {/* Icon */}
                        <div className={`flex-shrink-0 w-12 h-12 rounded-xl ${bookmark.color} flex items-center justify-center`}>
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge color="gray" size="sm" className="capitalize">{bookmark.type}</Badge>
                          </div>
                          <Link href={bookmark.url}>
                            <h3 className="font-semibold text-gray-900 dark:text-white hover:text-primary-600 transition-colors line-clamp-1">
                              {bookmark.title}
                            </h3>
                          </Link>
                          <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                            {bookmark.description}
                          </p>
                          <p className="text-xs text-gray-400 mt-2">
                            Saved {new Date(bookmark.savedAt).toLocaleDateString()}
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-1">
                          <Link href={bookmark.url}>
                            <Button variant="ghost" size="sm" className="p-2">
                              <ExternalLink className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="p-2 text-gray-400 hover:text-red-500"
                            onClick={() => removeBookmark(bookmark.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <Bookmark className="w-12 h-12 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {search ? 'No bookmarks found' : 'No bookmarks yet'}
            </h3>
            <p className="text-gray-500 mb-6">
              {search 
                ? 'Try a different search term' 
                : 'Start saving content to access them quickly here'
              }
            </p>
            <div className="flex justify-center gap-3">
              <Link href="/blog">
                <Button variant="outline">Browse Blog</Button>
              </Link>
              <Link href="/events">
                <Button>Browse Events</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
