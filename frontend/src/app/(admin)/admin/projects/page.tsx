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
  Github,
  ExternalLink,
  Code,
  Users,
  Calendar,
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
const mockProjects = [
  {
    id: '1',
    title: 'AI-Powered Chatbot for University',
    slug: 'ai-chatbot-university',
    shortDescription: 'An intelligent chatbot for university queries',
    category: 'NLP',
    status: 'COMPLETED',
    technologies: ['Python', 'TensorFlow', 'FastAPI', 'React'],
    githubUrl: 'https://github.com/daic/chatbot',
    liveUrl: 'https://chatbot.daic.edu.bd',
    teamMembers: [
      { id: '1', name: 'Abdullah Rahman', role: 'Lead' },
      { id: '2', name: 'Fatima Akter', role: 'ML Engineer' },
    ],
    startDate: '2023-09-01',
    endDate: '2024-02-28',
    isFeatured: true,
    isPublished: true,
  },
  {
    id: '2',
    title: 'Object Detection System',
    slug: 'object-detection-system',
    shortDescription: 'Real-time object detection using YOLO',
    category: 'Computer Vision',
    status: 'IN_PROGRESS',
    technologies: ['Python', 'PyTorch', 'OpenCV', 'YOLO'],
    githubUrl: 'https://github.com/daic/object-detection',
    liveUrl: null,
    teamMembers: [
      { id: '3', name: 'Kamal Hossain', role: 'Lead' },
      { id: '4', name: 'Rashida Khanom', role: 'Developer' },
    ],
    startDate: '2024-01-15',
    endDate: null,
    isFeatured: true,
    isPublished: true,
  },
  {
    id: '3',
    title: 'Sentiment Analysis Dashboard',
    slug: 'sentiment-analysis-dashboard',
    shortDescription: 'Analyze social media sentiment in Bengali',
    category: 'NLP',
    status: 'PLANNING',
    technologies: ['Python', 'BERT', 'Flask', 'Vue.js'],
    githubUrl: null,
    liveUrl: null,
    teamMembers: [
      { id: '5', name: 'Mohammad Ali', role: 'Lead' },
    ],
    startDate: '2024-03-01',
    endDate: null,
    isFeatured: false,
    isPublished: false,
  },
  {
    id: '4',
    title: 'Predictive Analytics for Student Performance',
    slug: 'student-performance-prediction',
    shortDescription: 'ML model to predict student academic performance',
    category: 'Machine Learning',
    status: 'COMPLETED',
    technologies: ['Python', 'Scikit-learn', 'Pandas', 'Streamlit'],
    githubUrl: 'https://github.com/daic/student-prediction',
    liveUrl: 'https://predict.daic.edu.bd',
    teamMembers: [
      { id: '6', name: 'Nusrat Jahan', role: 'Lead' },
      { id: '7', name: 'Imran Hossain', role: 'Data Analyst' },
    ],
    startDate: '2023-06-01',
    endDate: '2023-11-30',
    isFeatured: false,
    isPublished: true,
  },
];

type Project = typeof mockProjects[0];

const categoryColors = {
  'Machine Learning': 'blue',
  'Deep Learning': 'purple',
  'NLP': 'green',
  'Computer Vision': 'orange',
  'Web Application': 'pink',
} as const;

const statusColors = {
  PLANNING: 'yellow',
  IN_PROGRESS: 'blue',
  COMPLETED: 'green',
  ON_HOLD: 'orange',
} as const;

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Filter projects
  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !filterCategory || project.category === filterCategory;
    const matchesStatus = !filterStatus || project.status === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Stats
  const stats = {
    total: projects.length,
    inProgress: projects.filter(p => p.status === 'IN_PROGRESS').length,
    completed: projects.filter(p => p.status === 'COMPLETED').length,
    totalMembers: new Set(projects.flatMap(p => p.teamMembers.map(m => m.id))).size,
  };

  const handleDelete = () => {
    if (selectedProject) {
      setProjects(projects.filter(p => p.id !== selectedProject.id));
      setShowDeleteModal(false);
      setSelectedProject(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">
            Projects Management
          </h1>
          <p className="text-gray-500">Manage club projects and collaborations</p>
        </div>
        <Link href="/admin/projects/create">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <Code className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
                <p className="text-sm text-gray-500">Total Projects</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-yellow-100 dark:bg-yellow-900/30">
                <Calendar className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.inProgress}</p>
                <p className="text-sm text-gray-500">In Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                <Code className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.completed}</p>
                <p className="text-sm text-gray-500">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalMembers}</p>
                <p className="text-sm text-gray-500">Contributors</p>
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
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
            >
              <option value="">All Categories</option>
              <option value="Machine Learning">Machine Learning</option>
              <option value="Deep Learning">Deep Learning</option>
              <option value="NLP">NLP</option>
              <option value="Computer Vision">Computer Vision</option>
              <option value="Web Application">Web Application</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
            >
              <option value="">All Status</option>
              <option value="PLANNING">Planning</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
              <option value="ON_HOLD">On Hold</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Projects Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800">
                  <th className="text-left p-4 font-medium text-gray-500">Project</th>
                  <th className="text-left p-4 font-medium text-gray-500">Category</th>
                  <th className="text-left p-4 font-medium text-gray-500">Status</th>
                  <th className="text-left p-4 font-medium text-gray-500">Team</th>
                  <th className="text-left p-4 font-medium text-gray-500">Links</th>
                  <th className="text-left p-4 font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProjects.map((project) => (
                  <tr 
                    key={project.id}
                    className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  >
                    <td className="p-4">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {project.title}
                        </p>
                        <p className="text-sm text-gray-500 max-w-xs truncate">
                          {project.shortDescription}
                        </p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {project.technologies.slice(0, 3).map((tech) => (
                            <span 
                              key={tech}
                              className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded"
                            >
                              {tech}
                            </span>
                          ))}
                          {project.technologies.length > 3 && (
                            <span className="text-xs text-gray-500">
                              +{project.technologies.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge color={categoryColors[project.category as keyof typeof categoryColors] || 'gray'}>
                        {project.category}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <Badge color={statusColors[project.status as keyof typeof statusColors] || 'gray'}>
                        {project.status.replace('_', ' ')}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex -space-x-2">
                        {project.teamMembers.slice(0, 3).map((member) => (
                          <Avatar 
                            key={member.id}
                            name={member.name}
                            size="sm"
                            className="border-2 border-white dark:border-gray-900"
                          />
                        ))}
                        {project.teamMembers.length > 3 && (
                          <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-medium border-2 border-white dark:border-gray-900">
                            +{project.teamMembers.length - 3}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        {project.githubUrl && (
                          <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                            <Button variant="ghost" size="sm" className="p-2">
                              <Github className="w-4 h-4" />
                            </Button>
                          </a>
                        )}
                        {project.liveUrl && (
                          <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                            <Button variant="ghost" size="sm" className="p-2">
                              <ExternalLink className="w-4 h-4" />
                            </Button>
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-1">
                        <Link href={`/projects/${project.slug}`}>
                          <Button variant="ghost" size="sm" className="p-2">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Link href={`/admin/projects/${project.id}/edit`}>
                          <Button variant="ghost" size="sm" className="p-2">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="p-2 text-red-500 hover:text-red-600"
                          onClick={() => {
                            setSelectedProject(project);
                            setShowDeleteModal(true);
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredProjects.length === 0 && (
            <div className="text-center py-12">
              <Code className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No projects found</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Modal */}
      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} size="sm">
        <ModalHeader>
          Delete Project
        </ModalHeader>
        <ModalBody>
          <p className="text-gray-600 dark:text-gray-400">
            Are you sure you want to delete "{selectedProject?.title}"? This action cannot be undone.
          </p>
        </ModalBody>
        <ModalFooter>
          <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="outline" className="text-red-500 border-red-500" onClick={handleDelete}>
            Delete Project
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
