'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye,
  Calendar,
  Clock,
  Users,
  Award,
  BookOpen,
  MoreVertical
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Modal, ModalHeader, ModalBody, ModalFooter } from '@/components/ui/Modal';
import { formatDate } from '@/lib/utils';

// Mock data
const mockWorkshops = [
  {
    id: '1',
    title: 'Complete Python for Data Science',
    slug: 'python-data-science',
    level: 'BEGINNER',
    duration: '4 weeks',
    totalHours: 24,
    sessions: 8,
    startDate: '2024-03-02',
    endDate: '2024-03-24',
    capacity: 40,
    registrations: 38,
    price: 500,
    status: 'UPCOMING',
    instructor: { name: 'Dr. Mahmudul Hasan' },
    certificate: true,
    isPublished: true,
    isFeatured: true,
  },
  {
    id: '2',
    title: 'Deep Learning with TensorFlow',
    slug: 'deep-learning-tensorflow',
    level: 'INTERMEDIATE',
    duration: '6 weeks',
    totalHours: 36,
    sessions: 12,
    startDate: '2024-03-15',
    endDate: '2024-04-26',
    capacity: 30,
    registrations: 22,
    price: 1000,
    status: 'UPCOMING',
    instructor: { name: 'Dr. Rafiqul Islam' },
    certificate: true,
    isPublished: true,
    isFeatured: false,
  },
  {
    id: '3',
    title: 'Computer Vision Masterclass',
    slug: 'computer-vision-masterclass',
    level: 'ADVANCED',
    duration: '8 weeks',
    totalHours: 48,
    sessions: 16,
    startDate: '2024-02-01',
    endDate: '2024-03-28',
    capacity: 25,
    registrations: 25,
    price: 1500,
    status: 'ONGOING',
    instructor: { name: 'Dr. Kamal Hossain' },
    certificate: true,
    isPublished: true,
    isFeatured: true,
  },
  {
    id: '4',
    title: 'NLP with Transformers',
    slug: 'nlp-transformers',
    level: 'ADVANCED',
    duration: '5 weeks',
    totalHours: 30,
    sessions: 10,
    startDate: '2024-01-10',
    endDate: '2024-02-14',
    capacity: 30,
    registrations: 28,
    price: 1200,
    status: 'COMPLETED',
    instructor: { name: 'Dr. Fatima Akter' },
    certificate: true,
    isPublished: true,
    isFeatured: false,
  },
];

type Workshop = typeof mockWorkshops[0];

const levelColors = {
  BEGINNER: 'green',
  INTERMEDIATE: 'yellow',
  ADVANCED: 'red',
} as const;

const statusColors = {
  UPCOMING: 'blue',
  ONGOING: 'green',
  COMPLETED: 'gray',
  CANCELLED: 'red',
} as const;

export default function AdminWorkshopsPage() {
  const [workshops, setWorkshops] = useState<Workshop[]>(mockWorkshops);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLevel, setFilterLevel] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [selectedWorkshop, setSelectedWorkshop] = useState<Workshop | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Filter workshops
  const filteredWorkshops = workshops.filter((workshop) => {
    const matchesSearch = workshop.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = !filterLevel || workshop.level === filterLevel;
    const matchesStatus = !filterStatus || workshop.status === filterStatus;
    return matchesSearch && matchesLevel && matchesStatus;
  });

  // Stats
  const stats = {
    total: workshops.length,
    upcoming: workshops.filter(w => w.status === 'UPCOMING').length,
    ongoing: workshops.filter(w => w.status === 'ONGOING').length,
    totalEnrollments: workshops.reduce((sum, w) => sum + w.registrations, 0),
  };

  const handleDelete = () => {
    if (selectedWorkshop) {
      setWorkshops(workshops.filter(w => w.id !== selectedWorkshop.id));
      setShowDeleteModal(false);
      setSelectedWorkshop(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-nexus-text">
            Workshops Management
          </h1>
          <p className="text-gray-500">Create and manage workshop series</p>
        </div>
        <Link href="/admin/workshops/create">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create Workshop
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <BookOpen className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-nexus-text">{stats.total}</p>
                <p className="text-sm text-gray-500">Total Workshops</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                <Calendar className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-nexus-text">{stats.upcoming}</p>
                <p className="text-sm text-gray-500">Upcoming</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                <Clock className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-nexus-text">{stats.ongoing}</p>
                <p className="text-sm text-gray-500">Ongoing</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/30">
                <Users className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-nexus-text">{stats.totalEnrollments}</p>
                <p className="text-sm text-gray-500">Total Enrollments</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search workshops..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value)}
              className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
            >
              <option value="">All Levels</option>
              <option value="BEGINNER">Beginner</option>
              <option value="INTERMEDIATE">Intermediate</option>
              <option value="ADVANCED">Advanced</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
            >
              <option value="">All Status</option>
              <option value="UPCOMING">Upcoming</option>
              <option value="ONGOING">Ongoing</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Workshop Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {filteredWorkshops.map((workshop) => (
          <motion.div
            key={workshop.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex flex-wrap gap-2 mb-2">
                        <Badge color={levelColors[workshop.level as keyof typeof levelColors] || 'gray'}>
                          {workshop.level}
                        </Badge>
                        <Badge color={statusColors[workshop.status as keyof typeof statusColors] || 'gray'}>
                          {workshop.status}
                        </Badge>
                        {workshop.certificate && (
                          <Badge color="yellow">
                            <Award className="w-3 h-3 mr-1" />
                            Certificate
                          </Badge>
                        )}
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-nexus-text">
                        {workshop.title}
                      </h3>
                    </div>
                    <div className="relative">
                      <Button variant="ghost" size="sm" className="p-2">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Info Grid */}
                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div className="flex items-center gap-2 text-gray-500">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(workshop.startDate)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500">
                      <Clock className="w-4 h-4" />
                      <span>{workshop.duration} • {workshop.totalHours}h</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500">
                      <Users className="w-4 h-4" />
                      <span>{workshop.registrations}/{workshop.capacity} enrolled</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500">
                      <BookOpen className="w-4 h-4" />
                      <span>{workshop.sessions} sessions</span>
                    </div>
                  </div>

                  {/* Instructor */}
                  <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100 dark:border-gray-800">
                    <Avatar name={workshop.instructor.name} size="sm" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-nexus-text">
                        {workshop.instructor.name}
                      </p>
                      <p className="text-sm text-gray-500">Instructor</p>
                    </div>
                  </div>

                  {/* Enrollment Progress */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-500">Enrollment</span>
                      <span className="font-medium">{Math.round((workshop.registrations / workshop.capacity) * 100)}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          workshop.registrations >= workshop.capacity ? 'bg-red-500' : 'bg-primary-500'
                        }`}
                        style={{ width: `${Math.min((workshop.registrations / workshop.capacity) * 100, 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Price & Actions */}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xl font-bold text-gray-900 dark:text-nexus-text">
                        {workshop.price === 0 ? 'Free' : `৳${workshop.price}`}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/workshops/${workshop.slug}`}>
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Link href={`/admin/workshops/${workshop.id}/edit`}>
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-red-500 hover:text-red-600"
                        onClick={() => {
                          setSelectedWorkshop(workshop);
                          setShowDeleteModal(true);
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredWorkshops.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No workshops found</p>
          </CardContent>
        </Card>
      )}

      {/* Delete Modal */}
      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} size="sm">
        <ModalHeader>
          Delete Workshop
        </ModalHeader>
        <ModalBody>
          <p className="text-gray-600 dark:text-gray-400">
            Are you sure you want to delete "{selectedWorkshop?.title}"? This action cannot be undone.
          </p>
        </ModalBody>
        <ModalFooter>
          <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="outline" className="text-red-500 border-red-500" onClick={handleDelete}>
            Delete Workshop
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
