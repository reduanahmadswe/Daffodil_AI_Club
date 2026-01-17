'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Users, Calendar, Award, Rocket, Zap, Play } from 'lucide-react';
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

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-10 relative z-20">
                            <FadeContent blur={true} duration={1000} delay={600}>
                                <Link href="/register">
                                    <button className="group relative px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-lg shadow-lg shadow-blue-500/25 hover:shadow-blue-500/50 hover:scale-105 transition-all duration-300 overflow-hidden">
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
                                    <button className="group relative px-8 py-4 rounded-xl font-bold text-lg text-white border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/30 backdrop-blur-md transition-all flex items-center gap-2 overflow-hidden">
                                        <span className="relative z-10 flex items-center gap-2">
                                            <Play className="w-5 h-5 fill-current" />
                                            Learn More
                                        </span>
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
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
                                    className="glass rounded-2xl p-6 text-center transition-all duration-300 hover:shadow-glow-pink hover:-translate-y-1"
                                    style={{
                                        background: 'rgba(0, 0, 0, 0.4)',
                                        backdropFilter: 'blur(10px)',
                                        border: '1px solid rgba(255, 255, 255, 0.05)'
                                    }}
                                >
                                    <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-[#7B61FF]/20 transition-colors">
                                        <stat.icon className="w-6 h-6 text-[#7B61FF]" />
                                    </div>
                                    <p className="text-3xl font-bold text-white mb-1">
                                        {stat.value}
                                    </p>
                                    <p className="text-sm font-medium text-gray-400">
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
