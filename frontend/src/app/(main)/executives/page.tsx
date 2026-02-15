'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/Badge';
import { MemberCard } from '@/components/MemberCard';
import { convenerPanel, advisingPanel, studentPanel } from '@/data/leadership';

export default function ExecutivesPage() {
    return (
        <>
            <section className="relative pt-40 pb-20 overflow-hidden bg-nexus-bg">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="orb orb-purple w-96 h-96 top-1/4 left-1/4" />
                    <div className="orb orb-cyan w-96 h-96 bottom-1/4 right-1/4" />
                </div>
                <div className="absolute inset-0 grid-overlay opacity-30 pointer-events-none" />

                <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-3xl mx-auto"
                    >
                        <Badge color="cyan" className="mb-6">Leadership</Badge>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 text-nexus-text">
                            Meet Our <span className="gradient-text">Executive Panel</span>
                        </h1>
                        <p className="text-xl text-nexus-text-secondary">
                            The dedicated team of faculty and students driving the vision of Daffodil AI Club.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Convener Panel */}
            <section className="py-20 bg-nexus-bg relative">
                <div className="max-w-7xl mx-auto px-4 relative z-10">
                    <div className="flex items-center gap-4 mb-16">
                        <div className="h-px bg-gradient-to-r from-transparent to-[#7B61FF]/50 flex-grow" />
                        <div className="px-6 py-2 rounded-full border border-nexus-purple/30 bg-nexus-purple/10 backdrop-blur-sm">
                            <h2 className="text-2xl font-display font-bold text-[#bfa9ff]">Convener Panel</h2>
                        </div>
                        <div className="h-px bg-gradient-to-l from-transparent to-[#7B61FF]/50 flex-grow" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
                        {convenerPanel.map((member, index) => (
                            <MemberCard key={index} member={member} type="TEACHER" />
                        ))}
                    </div>
                </div>
            </section>

            {/* Advising Panel */}
            <section className="py-20 bg-nexus-surface-1 relative">
                <div className="max-w-7xl mx-auto px-4 relative z-10">
                    <div className="flex items-center gap-4 mb-16">
                        <div className="h-px bg-gradient-to-r from-transparent to-nexus-pink/50 flex-grow" />
                        <div className="px-6 py-2 rounded-full border border-[#FF4FD8]/30 bg-nexus-pink/10 backdrop-blur-sm">
                            <h2 className="text-2xl font-display font-bold text-[#ff99e8]">Advising Panel</h2>
                        </div>
                        <div className="h-px bg-gradient-to-l from-transparent to-nexus-pink/50 flex-grow" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {advisingPanel.map((member, index) => (
                            <MemberCard key={index} member={member} type="TEACHER" />
                        ))}
                    </div>
                </div>
            </section>

            {/* Student Panel */}
            <section className="py-20 bg-nexus-bg relative">
                <div className="max-w-7xl mx-auto px-4 relative z-10">
                    <div className="flex items-center gap-4 mb-16">
                        <div className="h-px bg-gradient-to-r from-transparent to-[#6EF3FF]/50 flex-grow" />
                        <div className="px-6 py-2 rounded-full border border-[#6EF3FF]/30 bg-nexus-cyan/10 backdrop-blur-sm">
                            <h2 className="text-2xl font-display font-bold text-[#99f8ff]">Student Executive Panel</h2>
                        </div>
                        <div className="h-px bg-gradient-to-l from-transparent to-[#6EF3FF]/50 flex-grow" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {studentPanel.map((member, index) => (
                            <MemberCard key={index} member={member} type="STUDENT" />
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
