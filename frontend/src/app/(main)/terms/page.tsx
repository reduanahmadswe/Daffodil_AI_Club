'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FileText, UserCheck, AlertCircle, Scale, Gavel, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import Link from 'next/link';

export default function TermsPage() {
    const terms = [
        {
            icon: UserCheck,
            title: "1. Acceptance of Terms",
            content: "By accessing and using the Daffodil AI Club website and services, you accept and agree to be bound by the terms and provision of this agreement. In addition, when using these specific services, you shall be subject to any posted guidelines or rules applicable to such services."
        },
        {
            icon: FileText,
            title: "2. Membership Responsibilities",
            content: "As a member, you agree to:\n• Provide accurate and complete information during registration.\n• Maintain the confidentiality of your account credentials.\n• Use the club's resources and platforms for educational and constructive purposes only.\n• Respect fellow members and refrain from harassment or discriminatory behavior."
        },
        {
            icon: Scale,
            title: "3. Intellectual Property",
            content: "All content provided on this website, including but not limited to text, graphics, logos, images, and software, is the property of Daffodil AI Club or its content suppliers and is protected by international copyright laws. Projects shared by members remain their intellectual property, but the Club retains the right to showcase them."
        },
        {
            icon: AlertCircle,
            title: "4. Code of Conduct",
            content: "Members are expected to uphold the highest standards of integrity. Plagiarism, unauthorized data scraping, or malicious use of AI tools provided by the club will result in immediate termination of membership and potential disciplinary action as per University policy."
        },
        {
            icon: XCircle,
            title: "5. Termination",
            content: "We may terminate or suspend access to our Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms."
        },
        {
            icon: Gavel,
            title: "6. Governing Law",
            content: "These Terms shall be governed and construed in accordance with the laws of Bangladesh, without regard to its conflict of law provisions."
        }
    ];

    return (
        <>
            {/* Hero Section */}
            <section className="relative pt-40 pb-20 overflow-hidden bg-nexus-bg">
                {/* Background Orbs */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="orb orb-pink w-96 h-96 top-1/3 right-1/4" />
                    <div className="orb orb-blue w-96 h-96 bottom-1/4 left-1/3" />
                </div>

                {/* Grid Overlay */}
                <div className="absolute inset-0 grid-overlay opacity-30 pointer-events-none" />

                <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-3xl mx-auto"
                    >
                        <Badge color="blue" className="mb-6">Legal</Badge>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 text-nexus-text">
                            Terms of <span className="gradient-text">Service</span>
                        </h1>
                        <p className="text-xl text-nexus-text-secondary mb-8">
                            Please read these terms carefully before using our services. Your agreement ensures a safe environment for everyone.
                        </p>
                        <div className="text-sm text-nexus-text-muted">
                            Last Updated: January 18, 2026
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Content Section */}
            <section className="py-20 bg-nexus-bg relative">
                <div className="max-w-4xl mx-auto px-4 relative z-10">
                    <div className="space-y-8">
                        {terms.map((term, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="glass rounded-2xl p-8 border border-nexus-border hover:border-nexus-purple/30 transition-all duration-300"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="p-3 rounded-lg bg-nexus-pink/10 text-nexus-pink">
                                        <term.icon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-nexus-text mb-4">{term.title}</h2>
                                        <div className="text-nexus-text-secondary leading-relaxed whitespace-pre-line">
                                            {term.content}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}

                        <div className="text-center mt-12 pt-8 border-t border-nexus-border">
                            <p className="text-nexus-text-secondary mb-4">
                                By using this website, you agree to these terms. If you do not agree, please do not use our services.
                            </p>
                            <div className="flex justify-center gap-4">
                                <Link href="/privacy" className="text-nexus-purple hover:underline">
                                    Privacy Policy
                                </Link>
                                <span className="text-white/20">|</span>
                                <Link href="/contact" className="text-nexus-purple hover:underline">
                                    Contact Support
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
