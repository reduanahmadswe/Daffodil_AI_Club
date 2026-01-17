'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Users, Calendar, Award, Rocket, Zap, Play } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import SplitText from '@/components/SplitText';

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
    { icon: Users, label: 'Active Members', value: '500+' },
    { icon: Calendar, label: 'Events Organized', value: '100+' },
    { icon: Award, label: 'Workshops', value: '50+' },
    { icon: Rocket, label: 'Projects Completed', value: '25+' },
];

export default function HeroSection() {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{ background: '#000000' }}>
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <img
                    src="/hero-background.png"
                    alt="Hero Background"
                    className="w-full h-full object-cover opacity-50"
                    style={{ objectFit: 'cover' }}
                />
            </div>

            {/* Dark Overlay for better text readability - increased opacity */}
            <div className="absolute inset-0 bg-black/60 z-0" />

            {/* Content */}
            <div className="relative container-custom py-32 z-10">
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={stagger}
                    className="max-w-4xl mx-auto text-center"
                >
                    <motion.div variants={fadeInUp}>
                        <Badge color="purple" className="mb-6">
                            <Zap className="w-4 h-4 mr-1" />
                            Welcome to Daffodil AI Club
                        </Badge>
                    </motion.div>

                    <motion.div variants={fadeInUp} className="mb-6">
                        <SplitText
                            text="Explore the Future of"
                            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold block mb-2"
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
                            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display block"
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

                    <motion.div variants={fadeInUp} className="mb-8">
                        <SplitText
                            text="Join DIU's premier AI community. Learn, build, and innovate with us through workshops, hackathons, and real-world projects."
                            className="text-lg sm:text-xl max-w-2xl mx-auto font-medium"
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

                    <motion.div
                        variants={fadeInUp}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                        <Link href="/register">
                            <button className="btn-nexus-primary px-8 py-4 rounded-xl font-semibold text-base flex items-center gap-2">
                                Get Started
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        </Link>
                        <Link href="/about">
                            <button className="btn-nexus-secondary px-8 py-4 rounded-xl font-semibold text-base flex items-center gap-2">
                                <Play className="w-5 h-5" />
                                Learn More
                            </button>
                        </Link>
                    </motion.div>

                    {/* Stats */}
                    <motion.div
                        variants={fadeInUp}
                        className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6"
                    >
                        {stats.map((stat) => (
                            <div
                                key={stat.label}
                                className="glass rounded-2xl p-6 text-center transition-all duration-300 hover:shadow-glow-pink"
                                style={{
                                    background: 'rgba(0, 0, 0, 0.5)',
                                    backdropFilter: 'blur(10px)',
                                    border: '1px solid rgba(255, 255, 255, 0.1)'
                                }}
                            >
                                <stat.icon className="w-8 h-8 mx-auto mb-2" style={{ color: '#7B61FF' }} />
                                <p
                                    className="text-3xl font-bold"
                                    style={{
                                        color: '#FFFFFF',
                                        textShadow: '0 2px 8px rgba(0, 0, 0, 0.8)',
                                        fontWeight: 800
                                    }}
                                >
                                    {stat.value}
                                </p>
                                <p
                                    className="text-sm font-medium"
                                    style={{
                                        color: '#D0D0D0',
                                        textShadow: '0 1px 4px rgba(0, 0, 0, 0.6)'
                                    }}
                                >
                                    {stat.label}
                                </p>
                            </div>
                        ))}
                    </motion.div>
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
            >
                <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-2">
                    <motion.div
                        animate={{ y: [0, 12, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="w-1.5 h-3 bg-white rounded-full"
                    />
                </div>
            </motion.div>
        </section>
    );
}
