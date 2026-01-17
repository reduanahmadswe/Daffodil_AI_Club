'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  ArrowLeft,
  Github,
  ExternalLink,
  Calendar,
  Users,
  Tag,
  Star,
  GitFork,
  Code,
  FileCode,
  BookOpen,
  Play
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Skeleton } from '@/components/ui/Skeleton';
import { projectsApi } from '@/lib/api';
import { Project } from '@/types';
import { formatDate } from '@/lib/utils';

// Mock data
const mockProject: Project = {
  id: '1',
  title: 'AI-Powered Chatbot for University',
  slug: 'ai-chatbot-university',
  description: `
# AI-Powered Chatbot for University

This project is a comprehensive AI-powered chatbot designed specifically for university environments. Built using state-of-the-art Natural Language Processing (NLP) techniques, it helps students and faculty get instant answers to common questions.

## Features

- **Natural Language Understanding**: Uses BERT-based models for understanding user queries
- **Context Awareness**: Maintains conversation context for follow-up questions
- **Multi-domain Knowledge**: Covers academics, admissions, events, and campus facilities
- **24/7 Availability**: Always ready to assist students
- **Multi-language Support**: Supports both Bengali and English

## Architecture

The system consists of three main components:

1. **Frontend**: React-based chat interface with real-time messaging
2. **Backend**: FastAPI server handling API requests and model inference
3. **ML Pipeline**: TensorFlow/PyTorch models for intent classification and entity extraction

## Technical Details

- **Model**: Fine-tuned BERT for intent classification
- **Framework**: TensorFlow 2.x / PyTorch
- **Backend**: Python FastAPI
- **Database**: PostgreSQL for conversation logs
- **Deployment**: Docker + Kubernetes

## Results

- 95% accuracy on intent classification
- Average response time: 200ms
- Successfully deployed and serving 5000+ daily queries

## Future Improvements

- Voice input/output support
- Integration with university ERP
- Mobile app development
  `,
  shortDescription: 'An intelligent chatbot that helps students with university-related queries using NLP.',
  category: 'NLP',
  status: 'COMPLETED',
  technologies: ['Python', 'TensorFlow', 'FastAPI', 'React', 'PostgreSQL', 'Docker'],
  coverImage: undefined,
  githubUrl: 'https://github.com/daffodil-ai-club/university-chatbot',
  liveUrl: 'https://chatbot.daic.edu.bd',
  demoUrl: 'https://demo.daic.edu.bd/chatbot',
  teamMembers: [
    { id: '1', name: 'Abdullah Rahman', role: 'Team Lead', profileImage: undefined },
    { id: '2', name: 'Fatima Akter', role: 'ML Engineer', profileImage: undefined },
    { id: '3', name: 'Kamal Hossain', role: 'Backend Developer', profileImage: undefined },
    { id: '4', name: 'Rashida Khanom', role: 'Frontend Developer', profileImage: undefined },
  ],
  startDate: '2023-09-01',
  endDate: '2024-02-28',
  isFeatured: true,
  isPublished: true,
  createdAt: '2023-09-01',
  updatedAt: '2024-02-28',
};

const categoryColors = {
  'Machine Learning': 'blue',
  'Deep Learning': 'purple',
  'NLP': 'green',
  'Computer Vision': 'orange',
  'Web Application': 'pink',
  'Robotics': 'cyan',
} as const;

const statusColors = {
  PLANNING: 'yellow',
  IN_PROGRESS: 'blue',
  COMPLETED: 'green',
  ON_HOLD: 'orange',
} as const;

export default function ProjectDetailPage() {
  const params = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await projectsApi.getBySlug(params.slug as string);
        setProject(response.data.data.project);
      } catch (error) {
        // Use mock data for development
        setProject(mockProject);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [params.slug]);

  if (loading) {
    return (
      <div className="container-custom py-32">
        <Skeleton className="h-8 w-32 mb-8" />
        <Skeleton className="h-12 w-3/4 mb-4" />
        <Skeleton className="h-6 w-1/4 mb-8" />
        <Skeleton className="h-[300px] w-full mb-8" />
        <div className="space-y-4">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-3/4" />
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="container-custom py-32 text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Project Not Found
        </h1>
        <p className="text-gray-500 mb-8">The project you're looking for doesn't exist.</p>
        <Link href="/projects">
          <Button>Browse Projects</Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 hero-gradient" />
        <div className="absolute inset-0 pattern-grid opacity-10" />
        
        <div className="container-custom relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Back Button */}
            <Link href="/projects" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6">
              <ArrowLeft className="w-4 h-4" />
              Back to Projects
            </Link>

            {/* Category & Status */}
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge color={categoryColors[project.category as keyof typeof categoryColors] || 'gray'}>
                {project.category}
              </Badge>
              <Badge color={statusColors[project.status as keyof typeof statusColors] || 'gray'}>
                {project.status.replace('_', ' ')}
              </Badge>
              {project.isFeatured && <Badge color="yellow">Featured</Badge>}
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-6">
              {project.title}
            </h1>

            {/* Short Description */}
            <p className="text-lg text-white/80 mb-8 max-w-3xl">
              {project.shortDescription}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4">
              {project.githubUrl && (
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
                    <Github className="w-5 h-5 mr-2" />
                    View on GitHub
                  </Button>
                </a>
              )}
              {project.liveUrl && (
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                  <Button className="bg-white text-primary-600 hover:bg-white/90">
                    <ExternalLink className="w-5 h-5 mr-2" />
                    View Live
                  </Button>
                </a>
              )}
              {project.demoUrl && (
                <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
                    <Play className="w-5 h-5 mr-2" />
                    Demo
                  </Button>
                </a>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12 bg-gray-50 dark:bg-gray-900">
        <div className="container-custom">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Project Description */}
              <Card>
                <CardHeader>
                  <CardTitle>About This Project</CardTitle>
                </CardHeader>
                <CardContent>
                  <article className="prose dark:prose-invert prose-lg max-w-none">
                    {project.description?.split('\n').map((line, index) => {
                      if (line.startsWith('# ')) {
                        return <h1 key={index}>{line.slice(2)}</h1>;
                      } else if (line.startsWith('## ')) {
                        return <h2 key={index}>{line.slice(3)}</h2>;
                      } else if (line.startsWith('### ')) {
                        return <h3 key={index}>{line.slice(4)}</h3>;
                      } else if (line.startsWith('- ')) {
                        return <li key={index}>{line.slice(2)}</li>;
                      } else if (line.trim()) {
                        return <p key={index}>{line}</p>;
                      }
                      return null;
                    })}
                  </article>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Project Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Project Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary-100 dark:bg-primary-900/30">
                      <Calendar className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Timeline</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {formatDate(project.startDate)} - {project.endDate ? formatDate(project.endDate) : 'Ongoing'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                      <Tag className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Category</p>
                      <p className="font-medium text-gray-900 dark:text-white">{project.category}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                      <Users className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Team Size</p>
                      <p className="font-medium text-gray-900 dark:text-white">{project.teamMembers?.length || 0} Members</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Technologies */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="w-5 h-5" />
                    Technologies
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <Badge key={tech} color="gray" size="sm">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Team Members */}
              {project.teamMembers && project.teamMembers.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      Team
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {project.teamMembers.map((member) => (
                        <div key={member.id} className="flex items-center gap-3">
                          <Avatar name={member.name} size="sm" />
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {member.name}
                            </p>
                            <p className="text-sm text-gray-500">{member.role}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* GitHub Stats */}
              {project.githubUrl && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Github className="w-5 h-5" />
                      Repository
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-6 text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4" />
                        <span>128</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <GitFork className="w-4 h-4" />
                        <span>34</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FileCode className="w-4 h-4" />
                        <span>Python</span>
                      </div>
                    </div>
                    <a 
                      href={project.githubUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="mt-4 block"
                    >
                      <Button variant="outline" size="sm" className="w-full">
                        View Repository
                      </Button>
                    </a>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
