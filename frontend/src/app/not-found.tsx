'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, AlertTriangle } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen w-full bg-nexus-bg flex flex-col items-center justify-center relative overflow-hidden">
            {/* Background Orbs */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="orb orb-purple w-[30rem] h-[30rem] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-20" />
                <div className="orb orb-blue w-96 h-96 top-1/4 left-1/4 opacity-10" />
            </div>

            {/* Grid Overlay */}
            <div className="absolute inset-0 grid-overlay opacity-20 pointer-events-none" />

            {/* Content */}
            <div className="relative z-10 text-center px-4 max-w-2xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="relative inline-block">
                        <h1 className="text-[10rem] md:text-[12rem] font-display font-bold leading-none select-none mix-blend-screen bg-clip-text text-transparent bg-gradient-to-r from-nexus-purple via-[#FF4FD8] to-[#6EF3FF] blur-sm absolute inset-0 animate-pulse">
                            404
                        </h1>
                        <h1 className="text-[10rem] md:text-[12rem] font-display font-bold text-nexus-text relative leading-none select-none">
                            404
                        </h1>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-nexus-glass border border-nexus-border text-nexus-pink mb-6">
                        <AlertTriangle className="w-5 h-5" />
                        <span className="font-bold tracking-wide">SYSTEM ERROR</span>
                    </div>

                    <h2 className="text-3xl md:text-4xl font-bold text-nexus-text mb-4">
                        Reality Not Found
                    </h2>
                    <p className="text-xl text-nexus-text-secondary mb-8 leading-relaxed">
                        The page you are looking for seems to have been lost in a neural network hallucination or does not exist in this timeline.
                    </p>

                    <Link
                        href="/"
                        className="btn-nexus-primary inline-flex items-center gap-2 px-8 py-4 rounded-xl text-lg font-bold hover:scale-105 transition-transform"
                    >
                        <Home className="w-5 h-5" />
                        Return Level 0 (Home)
                    </Link>
                </motion.div>
            </div>

            {/* Footer Text */}
            <div className="absolute bottom-8 text-nexus-text-muted text-sm">
                Daffodil AI Club • Error Code: 404_PAGE_MISSING
            </div>
        </div>
    );
}
