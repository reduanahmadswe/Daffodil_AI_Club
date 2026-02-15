'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, Database, Globe, Mail } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

export default function PrivacyPolicyPage() {
    const sections = [
        {
            icon: Database,
            title: "1. Information We Collect",
            content: "We collect information you provide directly to us when you register for membership, sign up for events, or contact us. This may include your name, student ID, email address, phone number, and department details. We also automatically collect certain technical data when you visit our website, such as your IP address and browser type."
        },
        {
            icon: Eye,
            title: "2. How We Use Your Information",
            content: "We use the information we collect to: \n• Process your membership and event registrations.\n• Send you technical updates, security alerts, and support messages.\n• Respond to your comments, questions, and requests.\n• Monitor and analyze trends, usage, and activities in connection with our services."
        },
        {
            icon: Lock,
            title: "3. Data Security",
            content: "We take reasonable measures to help protect information about you from loss, theft, misuse, and unauthorized access, disclosure, alteration, and destruction. We use industry-standard encryption to protect your data during transmission and storage."
        },
        {
            icon: Globe,
            title: "4. Third-Party Links",
            content: "Our website may contain links to third-party websites. One clicked, these links will take you away from our site. We are not responsible for the privacy practices of other sites and encourage you to read their privacy statements."
        },
        {
            icon: Shield,
            title: "5. Your Rights",
            content: "As a member of the Daffodil AI Club, you have the right to access, correct, or delete your personal information. If you wish to exercise these rights, please contact our administrative team."
        }
    ];

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

                <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-3xl mx-auto"
                    >
                        <Badge color="green" className="mb-6">Legal</Badge>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 text-nexus-text">
                            Privacy <span className="gradient-text">Policy</span>
                        </h1>
                        <p className="text-xl text-nexus-text-secondary mb-8">
                            We are committed to protecting your privacy and ensuring transparency in how we handle your data.
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
                        {sections.map((section, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="glass rounded-2xl p-8 border border-nexus-border hover:border-nexus-purple/30 transition-all duration-300"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="p-3 rounded-lg bg-nexus-purple/10 text-nexus-purple">
                                        <section.icon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-nexus-text mb-4">{section.title}</h2>
                                        <div className="text-nexus-text-secondary leading-relaxed whitespace-pre-line">
                                            {section.content}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}

                        {/* Contact Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="glass rounded-2xl p-8 border border-nexus-purple/30 bg-gradient-to-br from-nexus-purple/10 to-transparent flex items-center justify-between gap-6"
                        >
                            <div>
                                <h2 className="text-xl font-bold text-nexus-text mb-2">Have questions about our data practices?</h2>
                                <p className="text-nexus-text-secondary">Contact our support team for clarification.</p>
                            </div>
                            <a href="mailto:support@daffodil.ai" className="p-4 rounded-full bg-nexus-purple text-nexus-text hover:bg-nexus-cyan/80 hover:text-black transition-all">
                                <Mail className="w-6 h-6" />
                            </a>
                        </motion.div>
                    </div>
                </div>
            </section>
        </>
    );
}
