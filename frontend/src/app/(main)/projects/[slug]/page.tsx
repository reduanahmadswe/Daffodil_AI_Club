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
  Play
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Skeleton } from '@/components/ui/Skeleton';
import { projectsApi } from '@/lib/api';
import { Project } from '@/types';
import { formatDate } from '@/lib/utils';

// Mock data
const mockProject: Project = {
  id: '1',
  authorId: '1',
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
  image: 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=1200&h=600&fit=crop',
  githubUrl: 'https://github.com/daffodil-ai-club/university-chatbot',
  liveUrl: 'https://chatbot.daic.edu.bd',
  demoUrl: 'https://demo.daic.edu.bd/chatbot',
  teamMembers: [
    { id: '1', name: 'Abdullah Rahman', role: 'Team Lead' },
    { id: '2', name: 'Fatima Akter', role: 'ML Engineer' },
    { id: '3', name: 'Kamal Hossain', role: 'Backend Developer' },
    { id: '4', name: 'Rashida Khanom', role: 'Frontend Developer' },
  ],
  startDate: '2023-09-01',
  endDate: '2024-02-28',
  isPublished: true,
  isFeatured: true,
  featured: true,
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
      <div className="min-h-screen bg-black pt-32 pb-20">
        <div className="container-custom">
          <Skeleton className="h-8 w-32 mb-8 bg-nexus-glass" />
          <Skeleton className="h-12 w-3/4 mb-4 bg-nexus-glass" />
          <Skeleton className="h-6 w-1/4 mb-8 bg-nexus-glass" />
          <Skeleton className="h-[300px] w-full mb-8 bg-nexus-glass" />
          <div className="space-y-4">
            <Skeleton className="h-6 w-full bg-nexus-glass" />
            <Skeleton className="h-6 w-full bg-nexus-glass" />
            <Skeleton className="h-6 w-3/4 bg-nexus-glass" />
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-black pt-32 pb-20">
        <div className="container-custom text-center">
          <h1 className="text-2xl font-bold text-nexus-text mb-4">
            Project Not Found
          </h1>
          <p className="text-nexus-text-secondary mb-8">The project you're looking for doesn't exist.</p>
          <Link href="/projects">
            <button className="btn-nexus-primary px-6 py-3 rounded-xl">Browse Projects</button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-40 pb-20 overflow-hidden bg-black">
        {/* Background Orbs */}
        <div className="absolute inset-0">
          <div className="orb orb-pink w-96 h-96 top-1/4 left-1/4" />
          <div className="orb orb-purple w-96 h-96 bottom-1/4 right-1/4" />
        </div>

        {/* Grid Overlay */}
        <div className="absolute inset-0 grid-overlay opacity-30" />

        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Back Button */}
            <Link href="/projects" className="inline-flex items-center gap-2 text-nexus-text-secondary hover:text-nexus-text mb-6 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back to Projects
            </Link>

            {/* Category & Status */}
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge color={categoryColors[project.category as keyof typeof categoryColors] || 'gray'}>
                {project.category}
              </Badge>
              {project.status && (
                <Badge color={statusColors[project.status as keyof typeof statusColors] || 'gray'}>
                  {project.status.replace('_', ' ')}
                </Badge>
              )}
              {project.featured && <Badge color="yellow">Featured</Badge>}
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-nexus-text mb-6">
              {project.title}
            </h1>

            {/* Short Description */}
            <p className="text-lg text-nexus-text-secondary mb-8 max-w-3xl">
              {project.shortDescription}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4">
              {project.githubUrl && (
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                  <button className="px-6 py-3 rounded-xl bg-nexus-glass border border-nexus-border text-nexus-text hover:bg-nexus-glass transition-all flex items-center gap-2">
                    <Github className="w-5 h-5" />
                    View on GitHub
                  </button>
                </a>
              )}
              {project.liveUrl && (
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                  <button className="btn-nexus-primary px-6 py-3 rounded-xl flex items-center gap-2">
                    <ExternalLink className="w-5 h-5" />
                    View Live
                  </button>
                </a>
              )}
              {project.demoUrl && (
                <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                  <button className="px-6 py-3 rounded-xl bg-nexus-glass border border-nexus-border text-nexus-text hover:bg-nexus-glass transition-all flex items-center gap-2">
                    <Play className="w-5 h-5" />
                    Demo
                  </button>
                </a>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Project Image */}
      {project.image && (
        <section className="relative bg-black">
          <div className="container-custom">
            <div className="relative rounded-2xl overflow-hidden">
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-[400px] object-cover"
              />
            </div>
          </div>
        </section>
      )}

      {/* Content Section */}
      <section className="py-20 bg-black relative overflow-hidden">
        {/* Background Orbs */}
        <div className="absolute inset-0">
          <div className="orb orb-cyan w-96 h-96 top-1/3 left-1/4" />
          <div className="orb orb-blue w-96 h-96 bottom-1/3 right-1/3" />
        </div>

        {/* Grid Overlay */}
        <div className="absolute inset-0 grid-overlay opacity-20" />

        <div className="container-custom relative z-10">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Project Description */}
              <div className="glass rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-nexus-text mb-6">About This Project</h2>
                <article className="prose prose-invert prose-lg max-w-none">
                  {project.description?.split('\n').map((line, index) => {
                    if (line.startsWith('# ')) {
                      return <h1 key={index} className="text-nexus-text">{line.slice(2)}</h1>;
                    } else if (line.startsWith('## ')) {
                      return <h2 key={index} className="text-nexus-text">{line.slice(3)}</h2>;
                    } else if (line.startsWith('### ')) {
                      return <h3 key={index} className="text-nexus-text">{line.slice(4)}</h3>;
                    } else if (line.startsWith('- ')) {
                      return <li key={index} className="text-nexus-text-secondary">{line.slice(2)}</li>;
                    } else if (line.trim()) {
                      return <p key={index} className="text-nexus-text-secondary">{line}</p>;
                    }
                    return null;
                  })}
                </article>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Project Info */}
              <div className="glass rounded-2xl p-6">
                <h3 className="text-xl font-bold text-nexus-text mb-6">Project Info</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-nexus-purple/20">
                      <Calendar className="w-5 h-5 text-nexus-purple" />
                    </div>
                    <div>
                      <p className="text-sm text-nexus-text-muted">Timeline</p>
                      <p className="font-medium text-nexus-text text-sm">
                        {project.startDate ? formatDate(project.startDate) : 'N/A'} - {project.endDate ? formatDate(project.endDate) : 'Ongoing'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-nexus-cyan/20">
                      <Tag className="w-5 h-5 text-nexus-cyan" />
                    </div>
                    <div>
                      <p className="text-sm text-nexus-text-muted">Category</p>
                      <p className="font-medium text-nexus-text">{project.category}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-nexus-pink/20">
                      <Users className="w-5 h-5 text-nexus-pink" />
                    </div>
                    <div>
                      <p className="text-sm text-nexus-text-muted">Team Size</p>
                      <p className="font-medium text-nexus-text">{project.teamMembers?.length || 0} Members</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Technologies */}
              <div className="glass rounded-2xl p-6">
                <h3 className="text-xl font-bold text-nexus-text mb-4 flex items-center gap-2">
                  <Code className="w-5 h-5 text-nexus-purple" />
                  Technologies
                </h3>
                <div className="flex flex-wrap gap-2">
                  {Array.isArray(project.technologies) && project.technologies.map((tech: string) => (
                    <Badge key={tech} color="purple" size="sm">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Team Members */}
              {project.teamMembers && project.teamMembers.length > 0 && (
                <div className="glass rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-nexus-text mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5 text-nexus-pink" />
                    Team
                  </h3>
                  <div className="space-y-4">
                    {Array.isArray(project.teamMembers) && project.teamMembers.map((member: any) => (
                      <div key={member.id} className="flex items-center gap-3">
                        <Avatar name={member.name} size="sm" />
                        <div>
                          <p className="font-medium text-nexus-text">
                            {member.name}
                          </p>
                          <p className="text-sm text-nexus-text-muted">{member.role}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* GitHub Stats */}
              {project.githubUrl && (
                <div className="glass rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-nexus-text mb-4 flex items-center gap-2">
                    <Github className="w-5 h-5" />
                    Repository
                  </h3>
                  <div className="flex items-center gap-6 text-nexus-text-secondary mb-4">
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
                  >
                    <button className="w-full px-4 py-2 rounded-lg bg-nexus-glass hover:bg-nexus-glass text-nexus-text transition-all border border-nexus-border">
                      View Repository
                    </button>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
