'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, MessageCircle, HelpCircle, UserPlus, Calendar, Code, Mail } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';

interface FAQ {
    question: string;
    answer: string;
    category: 'GENERAL' | 'MEMBERSHIP' | 'EVENTS' | 'TECHNICAL';
}

const faqs: FAQ[] = [
    // General
    {
        question: "What is the Daffodil AI Club?",
        answer: "The Daffodil AI Club is a student-led organization at Daffodil International University dedicated to fostering a community of Artificial Intelligence enthusiasts. We organize workshops, seminars, hackathons, and collaborative projects to help students learn and grow in the field of AI.",
        category: 'GENERAL'
    },
    {
        question: "Who can join the club?",
        answer: "Any student from Daffodil International University, regardless of their department or background, is welcome to join! We believe AI is for everyone, from Computer Science majors to Business students interested in data analytics.",
        category: 'GENERAL'
    },
    {
        question: "Where is the club office located?",
        answer: "Our main office is located in the AB-4 Building, Ground Floor, Room 102 at the Daffodil Smart City campus. Feel free to drop by during our office hours!",
        category: 'GENERAL'
    },
    {
        question: "How can I contact the executive committee?",
        answer: "You can reach out to us via the 'Contact Us' page on this website, or email us directly at aiclub@diu.edu.bd. We are also active on our social media channels.",
        category: 'GENERAL'
    },

    // Membership
    {
        question: "How do I become a member?",
        answer: "You can register for membership through our website by clicking the 'Join Club' button. You'll need to create an account and fill out a brief profile. Membership is free for all current DIU students.",
        category: 'MEMBERSHIP'
    },
    {
        question: "Is there a membership fee?",
        answer: "Currently, general membership is free. However, some specialized workshops or certification programs may have a small fee to cover materials and resources.",
        category: 'MEMBERSHIP'
    },
    {
        question: "What are the benefits of being a member?",
        answer: "Members get priority access to workshops, exclusive networking events with industry professionals, mentorship for projects, and the opportunity to participate in internal hackathons. Active members can also apply for executive positions.",
        category: 'MEMBERSHIP'
    },
    {
        question: "Is membership valid for the whole duration of my degree?",
        answer: "Yes, once you register, your membership is valid as long as you are a student at DIU. You may need to renew it annually to keep your information up to date, but there is no fee.",
        category: 'MEMBERSHIP'
    },

    // Events
    {
        question: "Do I need prior knowledge to attend workshops?",
        answer: "Most of our introductory workshops are designed for beginners and assume no prior knowledge. For advanced sessions, we list prerequisites clearly on the event page. We encourage you to attend and learn regardless of your skill level!",
        category: 'EVENTS'
    },
    {
        question: "Are events recorded?",
        answer: "Yes, we try to record most of our technical sessions and seminars. You can find recordings and slides in the 'Learning Resources' section of our website or on our YouTube channel.",
        category: 'EVENTS'
    },
    {
        question: "Do you provide certificates for workshops?",
        answer: "Yes, we provide digital certificates of participation for most of our major workshops and seminars. For bootcamps, you may receive a certificate of completion after finishing the final project.",
        category: 'EVENTS'
    },
    {
        question: "How do I register for an event?",
        answer: "Simply go to the 'Events' page, click on the event you are interested in, and hit the 'Register Now' button. You'll receive a confirmation email with all the details.",
        category: 'EVENTS'
    },

    // Technical
    {
        question: "What programming languages do you focus on?",
        answer: "We primarily focus on Python as it is the industry standard for AI and Machine Learning. However, we also explore tools and libraries in R, C++, and JavaScript (TensorFlow.js) depending on the topic.",
        category: 'TECHNICAL'
    },
    {
        question: "Can I showcase my own project?",
        answer: "Absolutely! We regularly host 'Project Showcases' and hackathons where members can present their work. You can also submit your project through the 'Projects' section of our website to be featured in our gallery.",
        category: 'TECHNICAL'
    },
    {
        question: "Do you provide mentorship for research papers?",
        answer: "Yes, our senior members and faculty advisors offer mentorship for research projects. If you have a solid idea, reach out to the Research Wing of our club for guidance on publishing papers.",
        category: 'TECHNICAL'
    },
    {
        question: "I am a complete beginner, where should I start?",
        answer: "Welcome! We recommend starting with our 'Intro to Python' and 'ML 101' workshops. You can also check out the 'Beginner' section in our Learning Resources page for curated tutorials.",
        category: 'TECHNICAL'
    }
];

const categories = [
    { id: 'GENERAL', label: 'General Info', icon: HelpCircle },
    { id: 'MEMBERSHIP', label: 'Membership', icon: UserPlus },
    { id: 'EVENTS', label: 'Events & Workshops', icon: Calendar },
    { id: 'TECHNICAL', label: 'Technical & Projects', icon: Code },
];

export default function FAQPage() {
    const [activeCategory, setActiveCategory] = useState('GENERAL');
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const filteredFaqs = faqs.filter(faq => faq.category === activeCategory);

    return (
        <>
            {/* Hero Section */}
            <section className="relative pt-40 pb-20 overflow-hidden bg-nexus-bg">
                {/* Background Orbs */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="orb orb-purple w-96 h-96 top-1/4 left-1/4" />
                    <div className="orb orb-pink w-96 h-96 bottom-1/4 right-1/4" />
                </div>

                {/* Grid Overlay */}
                <div className="absolute inset-0 grid-overlay opacity-30 pointer-events-none" />

                <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-3xl mx-auto"
                    >
                        <Badge color="purple" className="mb-6">FAQ</Badge>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 text-nexus-text">
                            Frequently Asked <span className="gradient-text">Questions</span>
                        </h1>
                        <p className="text-xl text-nexus-text-secondary">
                            Everything you need to know about the club, membership, and our activities.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-20 bg-nexus-bg relative min-h-screen">
                <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
                    <div className="flex flex-col lg:flex-row gap-12">

                        {/* Sidebar Categories */}
                        <div className="lg:w-1/3 space-y-4 flex-shrink-0">
                            <h3 className="text-nexus-text font-bold mb-6 px-4">Categories</h3>
                            <div className="space-y-2 flex flex-col">
                                {categories.map((cat) => (
                                    <button
                                        key={cat.id}
                                        onClick={() => {
                                            setActiveCategory(cat.id);
                                            setOpenIndex(null);
                                        }}
                                        className={`w-full flex items-center gap-4 px-6 py-4 rounded-xl transition-all ${activeCategory === cat.id
                                            ? 'bg-gradient-to-r from-nexus-purple/20 to-nexus-pink/20 border border-nexus-purple/50 text-nexus-text'
                                            : 'bg-nexus-glass border border-nexus-border text-nexus-text-secondary hover:bg-nexus-glass hover:text-nexus-text'
                                            }`}
                                    >
                                        <div className={`p-2 rounded-lg flex-shrink-0 ${activeCategory === cat.id ? 'bg-nexus-purple text-nexus-text' : 'bg-nexus-glass text-nexus-text-muted'}`}>
                                            <cat.icon className="w-5 h-5" />
                                        </div>
                                        <span className="font-medium text-lg text-left">{cat.label}</span>
                                    </button>
                                ))}
                            </div>

                            {/* Contact Card */}
                            <div className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-nexus-purple/10 to-nexus-pink/10 border border-nexus-purple/20 text-center sticky top-24">
                                <MessageCircle className="w-10 h-10 text-nexus-purple mx-auto mb-4" />
                                <h4 className="text-nexus-text font-bold mb-2">Still have questions?</h4>
                                <p className="text-nexus-text-secondary text-sm mb-6">Can't find the answer you're looking for? Please check with our support team.</p>
                                <Link href="/contact" className="btn-nexus-primary w-full py-3 rounded-xl flex items-center justify-center gap-2">
                                    <Mail className="w-4 h-4" />
                                    Contact Support
                                </Link>
                            </div>
                        </div>

                        {/* Questions Accordion */}
                        <div className="lg:w-2/3 flex-grow min-w-0">
                            <div className="sticky top-24">
                                <h3 className="text-2xl font-bold text-nexus-text mb-8 flex items-center gap-3">
                                    {categories.find(c => c.id === activeCategory)?.icon &&
                                        React.createElement(categories.find(c => c.id === activeCategory)!.icon, { className: "w-6 h-6 text-nexus-purple" })}
                                    {categories.find(c => c.id === activeCategory)?.label}
                                </h3>

                                <div className="space-y-4">
                                    {filteredFaqs.map((faq, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className={`group rounded-2xl border transition-all duration-300 overflow-hidden ${openIndex === index
                                                ? 'bg-nexus-glass border-nexus-purple/50 shadow-glow-purple'
                                                : 'bg-nexus-glass border-nexus-border hover:border-nexus-border'
                                                }`}
                                        >
                                            <button
                                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                                className="w-full px-6 md:px-8 py-6 flex items-center justify-between gap-6 text-left"
                                            >
                                                <span className={`text-lg font-medium transition-colors ${openIndex === index ? 'text-nexus-text' : 'text-nexus-text-secondary group-hover:text-nexus-text'
                                                    }`}>
                                                    {faq.question}
                                                </span>
                                                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${openIndex === index ? 'bg-nexus-purple text-nexus-text rotate-180' : 'bg-nexus-glass text-nexus-text-muted group-hover:text-nexus-text'
                                                    }`}>
                                                    {openIndex === index ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                                                </div>
                                            </button>

                                            <AnimatePresence>
                                                {openIndex === index && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: 'auto', opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        transition={{ duration: 0.3 }}
                                                    >
                                                        <div className="px-6 md:px-8 pb-8 pt-0 text-nexus-text-secondary leading-relaxed border-t border-nexus-border mt-2">
                                                            {faq.answer}
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>
        </>
    );
}
