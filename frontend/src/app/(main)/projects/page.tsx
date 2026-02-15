'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Folder,
  Github,
  ExternalLink,
  Users,
  Calendar,
  Search,
  ArrowRight,
  Code,
  Star
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Avatar } from '@/components/ui/Avatar';
import { Skeleton } from '@/components/ui/Skeleton';
import FadeContent from '@/components/FadeContent';
import { projectsApi } from '@/lib/api';
import { Project } from '@/types';

const categories = ['All', 'Machine Learning', 'Deep Learning', 'NLP', 'Computer Vision', 'Web App'];
const statuses = ['All', 'In Progress', 'Completed'];

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('All');
  const [status, setStatus] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await projectsApi.getAll({
          category: category !== 'All' ? category : undefined,
          status: status !== 'All' ? status : undefined
        });
        setProjects(response.data.projects || mockProjects);
      } catch (error) {
        setProjects(mockProjects);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [category, status]);

  const filteredProjects = projects.filter(project =>
    project.title.toLowerCase().includes(search.toLowerCase()) ||
    project.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-40 pb-20 overflow-hidden bg-nexus-bg">
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
            className="text-center max-w-3xl mx-auto"
          >
            <Badge color="pink" className="mb-6">Projects</Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 text-nexus-text">
              Our AI <span className="gradient-text">Projects</span>
            </h1>
            <p className="text-xl text-nexus-text-secondary">
              Explore innovative AI projects built by our talented club members
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-nexus-bg relative overflow-hidden border-b border-nexus-border">
        {/* Subtle Orb */}
        <div className="absolute inset-0">
          <div className="orb orb-blue w-64 h-64 top-1/2 right-1/4 opacity-30" />
        </div>

        <div className="container-custom relative z-10">
          <div className="flex flex-col gap-4">
            {/* Search */}
            <div className="w-full md:w-96">
              <Input
                type="search"
                placeholder="Search projects..."
                leftIcon={<Search className="w-5 h-5" />}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${category === cat
                    ? 'bg-gradient-to-r from-nexus-purple to-nexus-pink text-nexus-text shadow-glow-purple'
                    : 'bg-nexus-glass text-nexus-text-secondary hover:bg-nexus-glass hover:text-nexus-text'
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Status Filters */}
            <div className="flex gap-2">
              {statuses.map((stat) => (
                <button
                  key={stat}
                  onClick={() => setStatus(stat)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${status === stat
                    ? 'bg-gradient-to-r from-[#FF4FD8] to-[#7B61FF] text-nexus-text shadow-glow-pink'
                    : 'bg-nexus-glass text-nexus-text-secondary hover:bg-nexus-glass hover:text-nexus-text'
                    }`}
                >
                  {stat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-20 bg-nexus-bg relative overflow-hidden">
        {/* Background Orbs */}
        <div className="absolute inset-0">
          <div className="orb orb-purple w-96 h-96 top-1/3 left-1/4" />
          <div className="orb orb-cyan w-96 h-96 bottom-1/3 right-1/3" />
        </div>

        {/* Grid Overlay */}
        <div className="absolute inset-0 grid-overlay opacity-20" />

        <div className="container-custom relative z-10">
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="glass rounded-2xl overflow-hidden">
                  <Skeleton className="h-48 rounded-none" />
                  <div className="p-6">
                    <Skeleton className="h-6 w-3/4 mb-3" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredProjects.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="glass rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-pink-500/10 transition-all duration-300 h-full flex flex-col border border-nexus-border">
                    {/* Project Image */}
                    <div className="aspect-video bg-gradient-to-br from-[#FF4FD8] to-[#7B61FF] relative overflow-hidden">
                      {project.image && (
                        <img
                          src={project.image}
                          alt={project.title}
                          className="w-full h-full object-cover"
                        />
                      )}
                      <div className="absolute top-4 left-4 flex gap-2">
                        {project.status && (
                          <Badge color={project.status === 'COMPLETED' ? 'green' : 'blue'}>
                            {project.status}
                          </Badge>
                        )}
                      </div>
                      {project.featured && (
                        <div className="absolute top-4 right-4">
                          <Badge color="yellow">
                            <Star className="w-3 h-3 mr-1" />
                            Featured
                          </Badge>
                        </div>
                      )}
                    </div>

                    <div className="p-6 flex-1 flex flex-col">
                      <div className="mb-3">
                        <Badge color="purple" size="sm">{project.category}</Badge>
                      </div>

                      <h3 className="text-xl font-bold text-nexus-text mb-3 line-clamp-2">{project.title}</h3>
                      <p className="text-nexus-text-secondary mb-4 line-clamp-3 flex-1">
                        {project.description}
                      </p>

                      {/* Project Details */}
                      <div className="space-y-2 text-sm text-nexus-text-muted mb-4">
                        {project.technologies && (
                          <div className="flex flex-wrap gap-1">
                            {Array.isArray(project.technologies) && project.technologies.slice(0, 3).map((tech: string, i: number) => (
                              <span key={i} className="px-2 py-1 rounded bg-nexus-glass text-xs text-nexus-text-secondary">
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}
                        {project.teamMembers && project.teamMembers.length > 0 && (
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-nexus-pink" />
                            <span>{project.teamMembers.length} members</span>
                          </div>
                        )}
                      </div>

                      {/* Links */}
                      <div className="flex gap-2 pt-4 border-t border-nexus-border">
                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1"
                          >
                            <button className="w-full px-4 py-3 rounded-xl border border-nexus-border bg-nexus-glass text-sm font-medium text-nexus-text transition-all hover:bg-nexus-glass hover:border-nexus-border flex items-center justify-center gap-2">
                              <Github className="w-4 h-4" />
                              Code
                            </button>
                          </a>
                        )}
                        <Link href={`/projects/${project.slug}`} className="flex-1">
                          <FadeContent blur={true} duration={500} delay={200}>
                            <button className="group relative w-full overflow-hidden rounded-xl border border-nexus-border bg-transparent px-4 py-3 font-semibold text-nexus-text transition-all hover:bg-nexus-glass hover:border-white/40 hover:scale-[1.01] flex items-center justify-center gap-2">
                              Details
                              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                            </button>
                          </FadeContent>
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <Folder className="w-16 h-16 mx-auto text-nexus-pink mb-4" />
              <h3 className="text-xl font-semibold text-nexus-text mb-2">
                No projects found
              </h3>
              <p className="text-nexus-text-secondary">
                {search ? 'Try a different search term' : 'Check back later for new projects'}
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

// Mock data
const mockProjects: Project[] = [
  {
    id: '1',
    authorId: '1',
    title: 'AI-Powered Plant Disease Detection',
    slug: 'plant-disease-detection',
    description: 'Mobile app that uses computer vision to identify plant diseases from leaf images.',
    category: 'COMPUTER_VISION',
    image: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=800&h=450&fit=crop',
    technologies: ['TensorFlow', 'Python', 'React Native', 'OpenCV'],
    githubUrl: 'https://github.com',
    status: 'COMPLETED',
    isPublished: true,
    isFeatured: true,
    featured: true,
    teamMembers: [
      { id: '1', name: 'Rafiqul Islam', email: '' },
      { id: '2', name: 'Fatima Akter', email: '' },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    authorId: '2',
    title: 'Sentiment Analysis Dashboard',
    slug: 'sentiment-analysis',
    description: 'Real-time sentiment analysis tool for social media monitoring and brand reputation management.',
    category: 'NLP',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=450&fit=crop',
    technologies: ['BERT', 'Flask', 'React', 'MongoDB'],
    githubUrl: 'https://github.com',
    demoUrl: 'https://demo.com',
    status: 'IN_PROGRESS',
    isPublished: true,
    isFeatured: false,
    teamMembers: [
      { id: '3', name: 'Kamal Hossain', email: '' },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    authorId: '3',
    title: 'Smart Traffic Management System',
    slug: 'smart-traffic',
    description: 'AI system for optimizing traffic flow using real-time vehicle detection and prediction.',
    category: 'COMPUTER_VISION',
    image: 'https://images.unsplash.com/photo-1508614999368-9260051292e5?w=800&h=450&fit=crop',
    technologies: ['YOLO', 'Python', 'TensorFlow', 'OpenCV'],
    githubUrl: 'https://github.com',
    status: 'COMPLETED',
    isPublished: true,
    isFeatured: false,
    teamMembers: [
      { id: '4', name: 'Ahmed Khan', email: '' },
      { id: '5', name: 'Nusrat Jahan', email: '' },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '4',
    authorId: '4',
    title: 'AI Study Assistant Chatbot',
    slug: 'study-assistant',
    description: 'Intelligent chatbot to help students with study materials, Q&A, and personalized learning paths.',
    category: 'NLP',
    image: 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=800&h=450&fit=crop',
    technologies: ['GPT-3', 'LangChain', 'Next.js', 'PostgreSQL'],
    githubUrl: 'https://github.com',
    demoUrl: 'https://demo.com',
    status: 'IN_PROGRESS',
    isPublished: true,
    isFeatured: true,
    featured: true,
    teamMembers: [
      { id: '2', name: 'Fatima Akter', email: '' },
      { id: '5', name: 'Nusrat Jahan', email: '' },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '5',
    authorId: '5',
    title: 'Predictive Maintenance ML Model',
    slug: 'predictive-maintenance',
    description: 'Machine learning model to predict equipment failure in manufacturing.',
    category: 'AI_ML',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=450&fit=crop',
    technologies: ['Scikit-learn', 'Pandas', 'Python', 'Docker'],
    githubUrl: 'https://github.com',
    status: 'COMPLETED',
    isPublished: true,
    isFeatured: false,
    teamMembers: [
      { id: '6', name: 'Mahmudul Hasan', email: '' },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '6',
    authorId: '6',
    title: 'Face Recognition Attendance System',
    slug: 'face-recognition-attendance',
    description: 'Automated attendance system using facial recognition for educational institutions.',
    category: 'COMPUTER_VISION',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=450&fit=crop',
    technologies: ['Face Recognition', 'OpenCV', 'Flask', 'SQLite'],
    githubUrl: 'https://github.com',
    status: 'COMPLETED',
    isPublished: true,
    isFeatured: false,
    teamMembers: [
      { id: '1', name: 'Rafiqul Islam', email: '' },
      { id: '3', name: 'Kamal Hossain', email: '' },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];
