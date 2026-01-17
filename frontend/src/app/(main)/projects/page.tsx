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
import { Card, CardContent, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Avatar } from '@/components/ui/Avatar';
import { Skeleton } from '@/components/ui/Skeleton';
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
        const response = await projectsApi.getAll();
        setProjects(response.data.projects || mockProjects);
      } catch (error) {
        setProjects(mockProjects);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(search.toLowerCase()) ||
      project.description?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'All' || project.category === category;
    const matchesStatus = status === 'All' || project.status === status;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 hero-gradient" />
        <div className="absolute inset-0 pattern-grid opacity-10" />
        
        <div className="container-custom relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-white max-w-3xl mx-auto"
          >
            <Badge color="white" className="bg-white/20 text-white mb-6">Projects</Badge>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">
              Our AI Projects
            </h1>
            <p className="text-xl text-white/80">
              Explore innovative AI projects built by our club members
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-16 lg:top-20 z-30">
        <div className="container-custom">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="w-full lg:w-96">
              <Input
                type="search"
                placeholder="Search projects..."
                leftIcon={<Search className="w-5 h-5" />}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap gap-4">
              {/* Category Filter */}
              <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                      category === cat
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container-custom">
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="h-48 rounded-none" />
                  <CardContent className="p-6">
                    <Skeleton className="h-6 w-3/4 mb-3" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-2/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredProjects.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="overflow-hidden card-hover h-full flex flex-col">
                    {/* Project Image */}
                    <div className="aspect-video bg-gradient-to-br from-primary-400 to-secondary-400 relative">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Folder className="w-16 h-16 text-white/30" />
                      </div>
                      <div className="absolute top-4 left-4 flex gap-2">
                        <Badge color={project.status === 'Completed' ? 'green' : 'blue'}>
                          {project.status}
                        </Badge>
                      </div>
                      {project.isFeatured && (
                        <Badge color="yellow" className="absolute top-4 right-4">
                          <Star className="w-3 h-3 mr-1" />
                          Featured
                        </Badge>
                      )}
                    </div>

                    <CardContent className="p-6 flex-1 flex flex-col">
                      <Badge color="gray" size="sm" className="w-fit mb-3">{project.category}</Badge>
                      <CardTitle className="mb-3 line-clamp-2">{project.title}</CardTitle>
                      <CardDescription className="mb-4 line-clamp-2 flex-1">
                        {project.description}
                      </CardDescription>

                      {/* Technologies */}
                      <div className="flex flex-wrap gap-1 mb-4">
                        {project.technologies?.slice(0, 4).map((tech) => (
                          <span
                            key={tech}
                            className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded text-gray-600 dark:text-gray-400"
                          >
                            {tech}
                          </span>
                        ))}
                        {(project.technologies?.length || 0) > 4 && (
                          <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded text-gray-600 dark:text-gray-400">
                            +{project.technologies!.length - 4}
                          </span>
                        )}
                      </div>

                      {/* Team */}
                      <div className="flex items-center justify-between py-3 border-t border-gray-100 dark:border-gray-800">
                        <div className="flex -space-x-2">
                          {project.teamMembers?.slice(0, 3).map((member, i) => (
                            <Avatar key={i} name={member.name} size="xs" className="border-2 border-white dark:border-gray-900" />
                          ))}
                          {(project.teamMembers?.length || 0) > 3 && (
                            <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs border-2 border-white dark:border-gray-900">
                              +{project.teamMembers!.length - 3}
                            </div>
                          )}
                        </div>
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
                      </div>

                      {/* CTA */}
                      <Link href={`/projects/${project.slug}`} className="mt-4">
                        <Button variant="outline" className="w-full">
                          View Project
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <Folder className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No projects found
              </h3>
              <p className="text-gray-500">
                {search ? 'Try a different search term' : 'Check back later for new projects'}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-secondary-600">
        <div className="container-custom">
          <div className="text-center text-white max-w-2xl mx-auto">
            <h2 className="text-3xl font-display font-bold mb-4">
              Have a Project Idea?
            </h2>
            <p className="text-white/80 mb-8">
              We're always looking for innovative AI projects. If you have an idea, 
              join our club and start building with us!
            </p>
            <Link href="/register">
              <Button className="bg-white text-primary-600 hover:bg-white/90">
                Join & Submit Your Idea
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

// Mock data
const mockProjects: Project[] = [
  {
    id: '1',
    title: 'AI-Powered Plant Disease Detection',
    slug: 'plant-disease-detection',
    description: 'Mobile app that uses computer vision to identify plant diseases from leaf images.',
    category: 'Computer Vision',
    technologies: ['Python', 'TensorFlow', 'Flutter', 'FastAPI'],
    githubUrl: 'https://github.com',
    liveUrl: 'https://example.com',
    status: 'Completed',
    isFeatured: true,
    teamMembers: [
      { id: '1', name: 'Rafiqul Islam', email: '' },
      { id: '2', name: 'Fatima Akter', email: '' },
      { id: '3', name: 'Kamal Hossain', email: '' },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Bangla Sentiment Analysis Tool',
    slug: 'bangla-sentiment',
    description: 'NLP tool for analyzing sentiment in Bangla text from social media and news.',
    category: 'NLP',
    technologies: ['Python', 'PyTorch', 'Hugging Face', 'Streamlit'],
    githubUrl: 'https://github.com',
    status: 'Completed',
    teamMembers: [
      { id: '4', name: 'Ahmed Khan', email: '' },
      { id: '5', name: 'Nusrat Jahan', email: '' },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Smart Traffic Management System',
    slug: 'smart-traffic',
    description: 'AI system for optimizing traffic flow using real-time vehicle detection and prediction.',
    category: 'Computer Vision',
    technologies: ['Python', 'YOLO', 'OpenCV', 'React'],
    status: 'In Progress',
    isFeatured: true,
    teamMembers: [
      { id: '1', name: 'Rafiqul Islam', email: '' },
      { id: '6', name: 'Mahmudul Hasan', email: '' },
      { id: '7', name: 'Sabrina Rahman', email: '' },
      { id: '8', name: 'Tasnim Akhter', email: '' },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '4',
    title: 'AI Chatbot for University FAQ',
    slug: 'uni-chatbot',
    description: 'Intelligent chatbot that answers common questions about DIU using NLP.',
    category: 'NLP',
    technologies: ['Python', 'Rasa', 'Next.js', 'PostgreSQL'],
    githubUrl: 'https://github.com',
    liveUrl: 'https://example.com',
    status: 'Completed',
    teamMembers: [
      { id: '2', name: 'Fatima Akter', email: '' },
      { id: '5', name: 'Nusrat Jahan', email: '' },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '5',
    title: 'Predictive Maintenance ML Model',
    slug: 'predictive-maintenance',
    description: 'Machine learning model to predict equipment failure in manufacturing.',
    category: 'Machine Learning',
    technologies: ['Python', 'scikit-learn', 'Pandas', 'Flask'],
    status: 'In Progress',
    teamMembers: [
      { id: '3', name: 'Kamal Hossain', email: '' },
      { id: '4', name: 'Ahmed Khan', email: '' },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '6',
    title: 'Handwritten Digit Recognition',
    slug: 'digit-recognition',
    description: 'Deep learning model for recognizing handwritten Bangla digits.',
    category: 'Deep Learning',
    technologies: ['Python', 'TensorFlow', 'Keras', 'Flask'],
    githubUrl: 'https://github.com',
    status: 'Completed',
    teamMembers: [
      { id: '6', name: 'Mahmudul Hasan', email: '' },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];
