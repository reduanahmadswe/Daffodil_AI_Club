'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { CheckCircle, Users, Zap, Brain, Rocket, Trophy, Star } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { useAppSelector } from '@/lib/redux/hooks';

const benefits = [
    {
        icon: Brain,
        title: "Skill Development",
        description: "Access exclusive workshops, bootcamps, and seminars to master AI, ML, and Data Science."
    },
    {
        icon: Users,
        title: "Networking",
        description: "Connect with like-minded peers, alumni, and industry experts in the field of Artificial Intelligence."
    },
    {
        icon: Rocket,
        title: "Project Collaboration",
        description: "Work on real-world projects, participate in hackathons, and build a strong portfolio."
    },
    {
        icon: Trophy,
        title: "Competition Support",
        description: "Get mentorship and resources to participate in national and international AI competitions."
    },
    {
        icon: Zap,
        title: "Leadership Opportunities",
        description: "Become an executive member and lead initiatives that shape the future of the club."
    },
    {
        icon: Star,
        title: "Exclusive Resources",
        description: "Gain access to premium learning materials, datasets, and research papers."
    }
];

export default function MembershipPage() {
    const { isAuthenticated, user } = useAppSelector((state) => state.auth);

    return (
        <>
            {/* Hero Section */}
            <section className="relative pt-40 pb-20 overflow-hidden bg-nexus-bg">
                {/* Background Orbs */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="orb orb-purple w-96 h-96 top-1/4 left-1/4" />
                    <div className="orb orb-cyan w-96 h-96 bottom-1/4 right-1/4" />
                </div>

                {/* Grid Overlay */}
                <div className="absolute inset-0 grid-overlay opacity-30 pointer-events-none" />

                <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-3xl mx-auto"
                    >
                        <Badge color="purple" className="mb-6">Membership</Badge>
                        <h1 className="text-4xl md:text-5xl lg:text-7xl font-display font-bold mb-6 text-nexus-text">
                            Join the <span className="gradient-text">AI Revolution</span>
                        </h1>
                        <p className="text-xl text-nexus-text-secondary mb-8">
                            Become a part of the most vibrant tech community at Daffodil International University. Unlock your potential in Artificial Intelligence.
                        </p>

                        {!isAuthenticated ? (
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link href="/register" className="btn-nexus-primary px-8 py-4 rounded-xl text-lg font-bold flex items-center justify-center gap-2">
                                    Apply for Membership
                                </Link>
                                <Link href="/about" className="px-8 py-4 rounded-xl border border-nexus-border text-nexus-text hover:bg-nexus-glass transition-all flex items-center justify-center font-medium">
                                    Learn More
                                </Link>
                            </div>
                        ) : (
                            <div className="glass inline-flex items-center gap-2 px-6 py-3 rounded-full border border-green-500/30 bg-green-500/10 text-green-400">
                                <CheckCircle className="w-5 h-5" />
                                <span className="font-bold">You are already a member!</span>
                            </div>
                        )}
                    </motion.div>
                </div>
            </section>

            {/* Why Join Section */}
            <section className="py-20 bg-nexus-bg relative">
                <div className="max-w-7xl mx-auto px-4 relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-display font-bold text-nexus-text mb-4">Why Join Us?</h2>
                        <p className="text-nexus-text-secondary max-w-2xl mx-auto">
                            Membership opens doors to endless opportunities for learning, growth, and collaboration.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {benefits.map((benefit, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="group p-8 rounded-2xl bg-nexus-glass border border-nexus-border hover:border-nexus-purple/50 hover:bg-white/[0.07] transition-all duration-300 relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-nexus-purple/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                <div className="relative z-10">
                                    <div className="w-14 h-14 rounded-xl bg-nexus-glass border border-nexus-border flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                        <benefit.icon className="w-7 h-7 text-nexus-purple group-hover:text-nexus-text transition-colors" />
                                    </div>

                                    <h3 className="text-xl font-bold text-nexus-text mb-3 group-hover:text-nexus-purple transition-colors">
                                        {benefit.title}
                                    </h3>
                                    <p className="text-nexus-text-secondary leading-relaxed">
                                        {benefit.description}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Membership Plan */}
            <section className="py-20 bg-nexus-surface-1 relative overflow-hidden">
                {/* Decorative Grid */}
                <div className="absolute top-0 w-full h-px bg-gradient-to-r from-transparent via-[#7B61FF]/30 to-transparent" />
                <div className="absolute inset-0 grid-overlay opacity-20 pointer-events-none" />

                <div className="max-w-7xl mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto glass rounded-3xl p-8 md:p-12 border border-nexus-purple/30 shadow-glow-purple relative overflow-hidden">

                        <div className="absolute -top-24 -right-24 w-64 h-64 bg-nexus-purple/20 rounded-full blur-3xl" />
                        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-nexus-pink/20 rounded-full blur-3xl" />

                        <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
                            <div>
                                <Badge color="green" className="mb-4">Free Access</Badge>
                                <h2 className="text-3xl md:text-4xl font-bold text-nexus-text mb-4">
                                    General Student Membership
                                </h2>
                                <p className="text-nexus-text-secondary text-lg mb-6 max-w-lg">
                                    Free for all current Daffodil International University students. Join our community and start your AI journey today.
                                </p>
                                <ul className="space-y-3">
                                    {['Access to all public workshops', 'Participation in hackathons', 'Join community discussions', 'Monthly newsletter'].map((item, i) => (
                                        <li key={i} className="flex items-center gap-3 text-nexus-text/90">
                                            <CheckCircle className="w-5 h-5 text-green-400" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="flex-shrink-0">
                                <div className="text-center md:text-right">
                                    <p className="text-sm text-nexus-text-secondary uppercase tracking-wider font-bold mb-2">Membership Fee</p>
                                    <div className="text-5xl font-display font-bold text-nexus-text mb-2">৳0</div>
                                    <p className="text-nexus-text-muted mb-6">/ semester</p>

                                    {!isAuthenticated ? (
                                        <Link href="/register" className="btn-nexus-primary px-8 py-4 rounded-xl w-full md:w-auto inline-flex justify-center items-center gap-2">
                                            Register Now
                                        </Link>
                                    ) : (
                                        <button className="px-8 py-4 rounded-xl bg-nexus-glass border border-nexus-border text-nexus-text cursor-default opacity-80 w-full md:w-auto">
                                            Already Joined
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ CTA */}
            <section className="py-20 bg-nexus-bg text-center">
                <div className="max-w-3xl mx-auto px-4">
                    <h2 className="text-2xl font-bold text-nexus-text mb-4">Have Questions?</h2>
                    <p className="text-nexus-text-secondary mb-8">
                        Check out our FAQ section or contact us directly if you need any assistance regarding membership.
                    </p>
                    <div className="flex gap-4 justify-center">
                        <Link href="/faq" className="px-6 py-3 rounded-xl bg-nexus-glass hover:bg-nexus-glass border border-nexus-border text-nexus-text transition-all">
                            Read FAQ
                        </Link>
                        <Link href="/contact" className="px-6 py-3 rounded-xl bg-nexus-glass hover:bg-nexus-glass border border-nexus-border text-nexus-text transition-all">
                            Contact Us
                        </Link>
                    </div>
                </div>
            </section>
        </>
    );
}
