'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Video, Code, Database, ExternalLink, GraduationCap, ChevronRight, Bookmark } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

interface Resource {
    id: string;
    title: string;
    description: string;
    type: 'COURSE' | 'BOOK' | 'TUTORIAL' | 'DATASET' | 'TOOL';
    level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
    url: string;
    provider: string;
    image?: string;
    tags: string[];
}

const resources: Resource[] = [
    {
        id: '1',
        title: 'Machine Learning by Andrew Ng',
        description: 'The absolute best starting point for ML. Covers broadly the most important ML concepts and algorithms.',
        type: 'COURSE',
        level: 'BEGINNER',
        url: 'https://www.coursera.org/specializations/machine-learning-introduction',
        provider: 'Coursera (Stanford)',
        image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800&h=450&fit=crop',
        tags: ['ML', 'Python', 'Fundamentals']
    },
    {
        id: '2',
        title: 'Deep Learning Specialization',
        description: 'Master Deep Learning, and break into AI. Learn the foundations of Deep Learning, understand how to build neural networks.',
        type: 'COURSE',
        level: 'INTERMEDIATE',
        url: 'https://www.coursera.org/specializations/deep-learning',
        provider: 'DeepLearning.AI',
        image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&h=450&fit=crop',
        tags: ['Deep Learning', 'Neural Networks']
    },
    {
        id: '3',
        title: 'Fast.ai - Practical Deep Learning',
        description: 'A free course designed to make deep learning accessible to everyone. Top-down approach to getting results quickly.',
        type: 'COURSE',
        level: 'BEGINNER',
        url: 'https://course.fast.ai/',
        provider: 'Fast.ai',
        image: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800&h=450&fit=crop',
        tags: ['PyTorch', 'Practical']
    },
    {
        id: '4',
        title: 'Hugging Face Course',
        description: 'This course will teach you about natural language processing (NLP) using libraries from the Hugging Face ecosystem.',
        type: 'TUTORIAL',
        level: 'INTERMEDIATE',
        url: 'https://huggingface.co/course/chapter1/1',
        provider: 'Hugging Face',
        image: 'https://images.unsplash.com/photo-1485796826113-174aa68fd81b?w=800&h=450&fit=crop',
        tags: ['NLP', 'Transformers']
    },
    {
        id: '5',
        title: 'Kaggle Datasets',
        description: 'Find datasets for your next project. Kaggle has thousands of public datasets to explore and analyze.',
        type: 'DATASET',
        level: 'BEGINNER',
        url: 'https://www.kaggle.com/datasets',
        provider: 'Kaggle',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=450&fit=crop',
        tags: ['Data Science', 'Practice']
    },
    {
        id: '6',
        title: 'CS231n: Convolutional Neural Networks',
        description: 'Stanford\'s famous course on Computer Vision. Deep dive into visual recognition tasks.',
        type: 'COURSE',
        level: 'ADVANCED',
        url: 'http://cs231n.stanford.edu/',
        provider: 'Stanford University',
        image: 'https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=800&h=450&fit=crop',
        tags: ['Computer Vision', 'Deep Learning']
    }
];

const categories = ['All', 'COURSE', 'BOOK', 'TUTORIAL', 'DATASET'];

export default function ResourcesPage() {
    const [activeCategory, setActiveCategory] = useState('All');

    const filteredResources = activeCategory === 'All'
        ? resources
        : resources.filter(res => res.type === activeCategory);

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'COURSE': return <GraduationCap className="w-4 h-4" />;
            case 'BOOK': return <BookOpen className="w-4 h-4" />;
            case 'TUTORIAL': return <Video className="w-4 h-4" />;
            case 'DATASET': return <Database className="w-4 h-4" />;
            case 'TOOL': return <Code className="w-4 h-4" />;
            default: return <BookOpen className="w-4 h-4" />;
        }
    };

    const getLevelColor = (level: string) => {
        switch (level) {
            case 'BEGINNER': return 'green';
            case 'INTERMEDIATE': return 'blue';
            case 'ADVANCED': return 'red';
            default: return 'gray';
        }
    };

    return (
        <>
            {/* Hero Section */}
            <section className="relative pt-40 pb-20 overflow-hidden bg-nexus-bg">
                {/* Background Orbs */}
                <div className="absolute inset-0">
                    <div className="orb orb-cyan w-96 h-96 top-1/4 left-1/4" />
                    <div className="orb orb-blue w-96 h-96 bottom-1/4 right-1/4" />
                </div>

                {/* Grid Overlay */}
                <div className="absolute inset-0 grid-overlay opacity-30" />

                <div className="container-custom relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-3xl mx-auto"
                    >
                        <Badge color="cyan" className="mb-6">Learning Hub</Badge>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 text-nexus-text">
                            Master <span className="gradient-text">Artificial Intelligence</span>
                        </h1>
                        <p className="text-xl text-nexus-text-secondary">
                            Curated resources to help you start your journey or advance your skills in AI, Machine Learning, and Data Science.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Filters */}
            <section className="bg-nexus-bg py-4 sticky top-20 z-40 border-b border-nexus-border backdrop-blur-md bg-black/80">
                <div className="container-custom">
                    <div className="flex flex-wrap justify-center gap-2">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${activeCategory === cat
                                        ? 'bg-gradient-to-r from-[#6EF3FF] to-[#5B8CFF] text-black shadow-glow-cyan'
                                        : 'bg-nexus-glass text-nexus-text-secondary hover:bg-nexus-glass hover:text-nexus-text border border-nexus-border'
                                    }`}
                            >
                                {cat === 'All' ? 'All Resources' : cat.charAt(0) + cat.slice(1).toLowerCase() + 's'}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Resources Grid */}
            <section className="py-20 bg-nexus-bg relative min-h-screen">
                <div className="container-custom relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredResources.map((resource, index) => (
                            <motion.div
                                key={resource.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="group glass rounded-2xl overflow-hidden border border-nexus-border hover:border-[#6EF3FF]/30 transition-all hover:transform hover:-translate-y-1"
                            >
                                <div className="relative h-48 overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                                    <img
                                        src={resource.image}
                                        alt={resource.title}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute bottom-4 left-4 z-20 flex gap-2">
                                        <Badge color={getLevelColor(resource.level)} size="sm">
                                            {resource.level}
                                        </Badge>
                                    </div>
                                </div>

                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-2 text-nexus-blue text-xs font-bold uppercase tracking-wider">
                                            {getTypeIcon(resource.type)}
                                            <span>{resource.type}</span>
                                        </div>
                                        <span className="text-nexus-text-muted text-xs">{resource.provider}</span>
                                    </div>

                                    <h3 className="text-xl font-bold text-nexus-text mb-3 group-hover:text-nexus-cyan transition-colors leading-tight">
                                        {resource.title}
                                    </h3>

                                    <p className="text-nexus-text-secondary text-sm mb-6 line-clamp-2 leading-relaxed">
                                        {resource.description}
                                    </p>

                                    {/* Tags */}
                                    <div className="flex flex-wrap gap-2 mb-6">
                                        {resource.tags.map(tag => (
                                            <span key={tag} className="px-2 py-1 rounded bg-nexus-glass text-nexus-text-muted text-xs border border-nexus-border">
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>

                                    <a
                                        href={resource.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-between w-full px-4 py-3 rounded-xl bg-nexus-glass hover:bg-nexus-cyan/10 hover:text-nexus-cyan text-nexus-text transition-all group/btn border border-nexus-border hover:border-[#6EF3FF]/30"
                                    >
                                        <span className="font-medium text-sm">Start Learning</span>
                                        <ExternalLink className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                    </a>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {filteredResources.length === 0 && (
                        <div className="text-center py-20">
                            <div className="w-16 h-16 bg-nexus-glass rounded-full flex items-center justify-center mx-auto mb-4">
                                <Bookmark className="w-8 h-8 text-nexus-text-secondary" />
                            </div>
                            <h3 className="text-xl font-bold text-nexus-text mb-2">No resources found</h3>
                            <p className="text-nexus-text-secondary">Try adjusting your filters to find what you're looking for.</p>
                        </div>
                    )}
                </div>
            </section>
        </>
    );
}
