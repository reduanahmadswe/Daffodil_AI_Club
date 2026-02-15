'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Users, Calendar, Award, Rocket, Zap, Play, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import SplitText from '@/components/SplitText';
import FadeContent from '@/components/FadeContent';


// Animation variants
const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger = {
    visible: { transition: { staggerChildren: 0.1 } },
};

// Stats data
const stats = [
    { icon: Users, label: 'Active Members', value: '500+', color: 'purple' as const },
    { icon: Calendar, label: 'Events Organized', value: '100+', color: 'blue' as const },
    { icon: Award, label: 'Workshops', value: '50+', color: 'pink' as const },
    { icon: Rocket, label: 'Projects Completed', value: '25+', color: 'cyan' as const },
];

const statIconColors = {
    purple: 'text-nexus-purple bg-nexus-purple/10 dark:bg-nexus-purple/20',
    blue: 'text-nexus-blue bg-nexus-blue/10 dark:bg-nexus-blue/20',
    pink: 'text-nexus-pink bg-nexus-pink/10 dark:bg-nexus-pink/20',
    cyan: 'text-nexus-cyan bg-nexus-cyan/10 dark:bg-nexus-cyan/20',
};

export default function HeroSection() {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-nexus-bg">
            {/* Light Mode: Background Image (light version) */}
            <div className="absolute inset-0 z-0 dark:hidden">
                <img
                    src="/hero-background-light.png"
                    alt="Hero Background"
                    className="w-full h-full object-cover opacity-40"
                />
                {/* Soft overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-b from-nexus-bg/30 via-transparent to-nexus-bg/60" />
                {/* Bottom fade into page */}
                <div className="absolute bottom-0 inset-x-0 h-48 bg-gradient-to-t from-nexus-bg to-transparent" />
            </div>

            {/* Light Mode: Decorative gradient blobs over image */}
            <div className="absolute inset-0 z-[1] dark:hidden overflow-hidden pointer-events-none">
                <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-purple-400/20 via-violet-300/10 to-transparent blur-3xl animate-float" />
                <div className="absolute -top-20 right-0 w-[400px] h-[400px] rounded-full bg-gradient-to-bl from-blue-400/15 via-cyan-300/10 to-transparent blur-3xl animate-float" style={{ animationDelay: '2s' }} />
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-pink-300/15 via-purple-200/10 to-transparent blur-3xl animate-float" style={{ animationDelay: '4s' }} />
            </div>

            {/* Dark Mode: Background Image */}
            <div className="absolute inset-0 z-0 hidden dark:block">
                <img
                    src="/hero-background.png"
                    alt="Hero Background"
                    className="w-full h-full object-cover opacity-50"
                    style={{ objectFit: 'cover' }}
                />
            </div>

            {/* Dark Mode Overlay */}
            <div className="absolute inset-0 bg-black/60 z-0 hidden dark:block" />

            {/* Light Mode: Floating decorative elements */}
            <div className="absolute inset-0 z-[1] dark:hidden pointer-events-none">
                <motion.div
                    animate={{ y: [-10, 10, -10], rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute top-[15%] left-[10%] w-3 h-3 rounded-full bg-nexus-purple/40"
                />
                <motion.div
                    animate={{ y: [10, -10, 10], rotate: [0, -5, 5, 0] }}
                    transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute top-[25%] right-[15%] w-2 h-2 rounded-full bg-nexus-pink/40"
                />
                <motion.div
                    animate={{ y: [-15, 15, -15] }}
                    transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute top-[60%] left-[8%] w-4 h-4 rounded-full bg-nexus-cyan/30"
                />
                <motion.div
                    animate={{ y: [8, -12, 8] }}
                    transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute top-[40%] right-[8%] w-2.5 h-2.5 rounded-full bg-nexus-blue/35"
                />
                {/* Sparkle icons floating */}
                <motion.div
                    animate={{ y: [-5, 5, -5], opacity: [0.3, 0.7, 0.3] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute top-[20%] right-[25%]"
                >
                    <Sparkles className="w-5 h-5 text-nexus-purple/30" />
                </motion.div>
                <motion.div
                    animate={{ y: [5, -5, 5], opacity: [0.2, 0.6, 0.2] }}
                    transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute top-[55%] left-[20%]"
                >
                    <Sparkles className="w-4 h-4 text-nexus-pink/25" />
                </motion.div>
            </div>

            {/* Content */}
            <div className="relative container-custom py-32 z-10">
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={stagger}
                    className="max-w-4xl mx-auto text-center relative"
                >

                    <div className="relative z-10">
                        <motion.div variants={fadeInUp}>
                            <Badge color="purple" className="mb-6">
                                <Zap className="w-4 h-4 mr-1" />
                                Welcome to Daffodil AI Club
                            </Badge>
                        </motion.div>

                        <motion.div variants={fadeInUp} className="mb-6">
                            <SplitText
                                text="Explore the Future of"
                                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold block mb-2 text-nexus-text"
                                delay={30}
                                duration={0.5}
                                ease="cubic-bezier(0.22, 1, 0.36, 1)"
                                splitType="chars"
                                from={{ opacity: 0, y: 40 }}
                                to={{ opacity: 1, y: 0 }}
                                threshold={0.1}
                                rootMargin="-50px"
                                textAlign="center"
                            />
                            <SplitText
                                text="Artificial Intelligence"
                                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display block leading-normal pb-4"
                                delay={25}
                                duration={0.6}
                                ease="cubic-bezier(0.22, 1, 0.36, 1)"
                                splitType="chars"
                                from={{ opacity: 0, y: 50 }}
                                to={{ opacity: 1, y: 0 }}
                                threshold={0.1}
                                rootMargin="-50px"
                                textAlign="center"
                                gradient={true}
                            />
                        </motion.div>

                        <motion.div variants={fadeInUp} className="mb-2 relative z-10">
                            <SplitText
                                text="Join DIU's premier AI community. Learn, build, and innovate with us through workshops, hackathons, and real-world projects."
                                className="text-lg sm:text-xl max-w-2xl mx-auto font-medium text-nexus-text-secondary"
                                delay={40}
                                duration={0.4}
                                ease="cubic-bezier(0.22, 1, 0.36, 1)"
                                splitType="words"
                                from={{ opacity: 0, y: 20 }}
                                to={{ opacity: 1, y: 0 }}
                                threshold={0.1}
                                rootMargin="-50px"
                                textAlign="center"
                            />
                        </motion.div>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-10 relative z-20">
                            <FadeContent blur={true} duration={1000} delay={600}>
                                <Link href="/register">
                                    <button className="group relative px-8 py-4 rounded-xl bg-gradient-to-r from-nexus-purple to-nexus-pink text-white font-bold text-lg shadow-lg shadow-nexus-purple/25 hover:shadow-nexus-purple/40 hover:scale-105 transition-all duration-300 overflow-hidden">
                                        <span className="relative z-10 flex items-center gap-2">
                                            Get Started
                                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                        </span>
                                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                                    </button>
                                </Link>
                            </FadeContent>

                            <FadeContent blur={true} duration={1000} delay={800}>
                                <Link href="/about">
                                    <button className="group relative px-8 py-4 rounded-xl font-bold text-lg text-nexus-text border-2 border-nexus-border bg-white/60 dark:bg-nexus-glass hover:bg-white/80 dark:hover:bg-nexus-glass hover:border-nexus-purple/40 dark:hover:border-white/30 backdrop-blur-md transition-all flex items-center gap-2 overflow-hidden shadow-sm hover:shadow-md">
                                        <span className="relative z-10 flex items-center gap-2">
                                            <Play className="w-5 h-5 fill-current" />
                                            Learn More
                                        </span>
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-nexus-purple/5 dark:via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                                    </button>
                                </Link>
                            </FadeContent>
                        </div>

                        {/* Stats - Independent Animation */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.5 }}
                            className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-6 relative z-20"
                        >
                            {stats.map((stat) => (
                                <div
                                    key={stat.label}
                                    className="hero-stat-card group rounded-2xl p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-glow-pink dark:hover:shadow-glow-pink"
                                >
                                    <div className={`w-12 h-12 mx-auto mb-3 rounded-xl flex items-center justify-center transition-colors ${statIconColors[stat.color]}`}>
                                        <stat.icon className="w-6 h-6" />
                                    </div>
                                    <p className="text-3xl font-bold text-nexus-text mb-1">
                                        {stat.value}
                                    </p>
                                    <p className="text-sm font-medium text-nexus-text-muted">
                                        {stat.label}
                                    </p>
                                </div>
                            ))}
                        </motion.div>
                    </div>
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
            >
                <div className="w-6 h-10 rounded-full border-2 border-nexus-text/20 flex items-start justify-center p-2">
                    <motion.div
                        animate={{ y: [0, 12, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="w-1.5 h-3 bg-nexus-purple rounded-full"
                    />
                </div>
            </motion.div>
        </section>
    );
}
