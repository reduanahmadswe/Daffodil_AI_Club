'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
    CheckCircle, Users, Zap, Brain, Rocket, Trophy, Star,
    Smartphone, ArrowRight, Clock, XCircle,
    AlertCircle, Send, Loader2, Shield
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks';
import { updateUser } from '@/lib/redux/slices/authSlice';
import { membershipApi } from '@/lib/api';
import { MembershipApplication, MembershipStatusResponse } from '@/types';
import toast from 'react-hot-toast';

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

const paymentMethods = [
    {
        id: 'BKASH',
        name: 'bKash',
        number: '01XXXXXXXXX',
        color: 'from-pink-500 to-rose-600',
        bgColor: 'bg-pink-500/10 border-pink-500/30',
        textColor: 'text-pink-400',
    },
    {
        id: 'NAGAD',
        name: 'Nagad',
        number: '01XXXXXXXXX',
        color: 'from-orange-500 to-amber-600',
        bgColor: 'bg-orange-500/10 border-orange-500/30',
        textColor: 'text-orange-400',
    },
    {
        id: 'ROCKET',
        name: 'Rocket',
        number: '01XXXXXXXXX',
        color: 'from-purple-500 to-violet-600',
        bgColor: 'bg-purple-500/10 border-purple-500/30',
        textColor: 'text-purple-400',
    },
];

const MEMBERSHIP_FEE = 100;

export default function MembershipPage() {
    const { isAuthenticated, user } = useAppSelector((state) => state.auth);
    const dispatch = useAppDispatch();

    const formSectionRef = useRef<HTMLDivElement>(null);

    const [showForm, setShowForm] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState('');
    const [transactionId, setTransactionId] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [membershipData, setMembershipData] = useState<MembershipStatusResponse | null>(null);
    const [loadingStatus, setLoadingStatus] = useState(false);

    useEffect(() => {
        if (isAuthenticated) {
            fetchMembershipStatus();
        }
    }, [isAuthenticated]);

    const fetchMembershipStatus = async () => {
        try {
            setLoadingStatus(true);
            const res = await membershipApi.getMyStatus();
            setMembershipData(res.data.data);
        } catch {
            // User might be new
        } finally {
            setLoadingStatus(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedPayment) {
            toast.error('Please select a payment method');
            return;
        }
        if (!transactionId.trim()) {
            toast.error('Please enter your Transaction ID');
            return;
        }

        setIsSubmitting(true);
        try {
            await membershipApi.apply({
                paymentMethod: selectedPayment,
                transactionId: transactionId.trim(),
                amount: MEMBERSHIP_FEE,
                phoneNumber: phoneNumber.trim() || undefined,
            });

            toast.success('Application submitted successfully!');
            dispatch(updateUser({ membershipStatus: 'PENDING' }));
            setShowForm(false);
            setTransactionId('');
            setPhoneNumber('');
            setSelectedPayment('');
            fetchMembershipStatus();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to submit application');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleApplyClick = () => {
        setShowForm(true);
        setTimeout(() => {
            formSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    };

    const isMember = user?.role === 'MEMBER' || user?.role === 'EXECUTIVE' || user?.role === 'ADMIN';
    const isPending = user?.membershipStatus === 'PENDING' || membershipData?.membershipStatus === 'PENDING';
    const isRejected = user?.membershipStatus === 'REJECTED' || membershipData?.membershipStatus === 'REJECTED';

    const renderStatusBanner = () => {
        if (!isAuthenticated) return null;

        if (isMember) {
            return (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass inline-flex items-center gap-2 px-6 py-3 rounded-full border border-green-500/30 bg-green-500/10 text-green-400"
                >
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-bold">You are a club member!</span>
                </motion.div>
            );
        }

        if (isPending) {
            return (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass inline-flex items-center gap-2 px-6 py-3 rounded-full border border-yellow-500/30 bg-yellow-500/10 text-yellow-400"
                >
                    <Clock className="w-5 h-5" />
                    <span className="font-bold">Your application is under review</span>
                </motion.div>
            );
        }

        if (isRejected) {
            return (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center gap-3"
                >
                    <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-red-500/30 bg-red-500/10 text-red-400">
                        <XCircle className="w-5 h-5" />
                        <span className="font-bold">Your previous application was rejected</span>
                    </div>
                    <button
                        onClick={handleApplyClick}
                        className="btn-nexus-primary px-8 py-3 rounded-xl font-bold flex items-center gap-2"
                    >
                        Reapply for Membership <ArrowRight className="w-4 h-4" />
                    </button>
                </motion.div>
            );
        }

        return null;
    };

    return (
        <>
            {/* Hero Section */}
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
                        <Badge color="purple" className="mb-6">Membership</Badge>
                        <h1 className="text-4xl md:text-5xl lg:text-7xl font-display font-bold mb-6 text-nexus-text">
                            Join the <span className="gradient-text">AI Revolution</span>
                        </h1>
                        <p className="text-xl text-nexus-text-secondary mb-8">
                            Become a part of the most vibrant tech community at Daffodil International University. Unlock your potential in Artificial Intelligence.
                        </p>

                        {renderStatusBanner()}

                        {!isAuthenticated && (
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link href="/register" className="btn-nexus-primary px-8 py-4 rounded-xl text-lg font-bold flex items-center justify-center gap-2">
                                    Register First <ArrowRight className="w-5 h-5" />
                                </Link>
                                <Link href="/about" className="px-8 py-4 rounded-xl border border-nexus-border text-nexus-text hover:bg-nexus-glass transition-all flex items-center justify-center font-medium">
                                    Learn More
                                </Link>
                            </div>
                        )}

                        {isAuthenticated && !isMember && !isPending && !isRejected && (
                            <button
                                onClick={handleApplyClick}
                                className="btn-nexus-primary px-8 py-4 rounded-xl text-lg font-bold inline-flex items-center gap-2"
                            >
                                Apply for Membership <ArrowRight className="w-5 h-5" />
                            </button>
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

            {/* Membership Plan & Application Form */}
            <section ref={formSectionRef} className="py-20 bg-nexus-surface-1 relative overflow-hidden scroll-mt-20">
                <div className="absolute top-0 w-full h-px bg-gradient-to-r from-transparent via-[#7B61FF]/30 to-transparent" />
                <div className="absolute inset-0 grid-overlay opacity-20 pointer-events-none" />

                <div className="max-w-7xl mx-auto px-4 relative z-10">
                    <AnimatePresence mode="wait">
                        {showForm && isAuthenticated && !isMember && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="max-w-4xl mx-auto"
                            >
                                <div className="text-center mb-10">
                                    <h2 className="text-3xl md:text-4xl font-display font-bold text-nexus-text mb-4">
                                        Complete Your Application
                                    </h2>
                                    <p className="text-nexus-text-secondary max-w-xl mx-auto">
                                        Pay the membership fee using any of the methods below and submit your transaction details.
                                    </p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-8">
                                    {/* Step 1: Payment Method */}
                                    <div className="glass rounded-2xl p-6 md:p-8 border border-nexus-border">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="w-8 h-8 rounded-full bg-nexus-purple/20 flex items-center justify-center text-nexus-purple font-bold text-sm">1</div>
                                            <h3 className="text-xl font-bold text-nexus-text">Select Payment Method</h3>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            {paymentMethods.map((method) => (
                                                <button
                                                    key={method.id}
                                                    type="button"
                                                    onClick={() => setSelectedPayment(method.id)}
                                                    className={`p-6 rounded-xl border-2 transition-all duration-200 text-left ${selectedPayment === method.id
                                                        ? `${method.bgColor} border-opacity-100 scale-[1.02]`
                                                        : 'border-nexus-border hover:border-nexus-purple/30 bg-nexus-glass'
                                                        }`}
                                                >
                                                    <div className="flex items-center gap-3 mb-3">
                                                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${method.color} flex items-center justify-center`}>
                                                            <Smartphone className="w-5 h-5 text-white" />
                                                        </div>
                                                        <span className="font-bold text-nexus-text text-lg">{method.name}</span>
                                                    </div>
                                                    <p className="text-sm text-nexus-text-secondary mb-1">Send to:</p>
                                                    <p className={`font-mono font-bold text-lg ${method.textColor}`}>{method.number}</p>
                                                    <p className="text-sm text-nexus-text-muted mt-2">Amount: <span className="font-bold text-nexus-text">৳{MEMBERSHIP_FEE}</span></p>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Step 2: Transaction Details */}
                                    <div className="glass rounded-2xl p-6 md:p-8 border border-nexus-border">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="w-8 h-8 rounded-full bg-nexus-purple/20 flex items-center justify-center text-nexus-purple font-bold text-sm">2</div>
                                            <h3 className="text-xl font-bold text-nexus-text">Enter Transaction Details</h3>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-nexus-text mb-2">
                                                    Transaction ID <span className="text-red-400">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    value={transactionId}
                                                    onChange={(e) => setTransactionId(e.target.value)}
                                                    placeholder="e.g., TXN123456789"
                                                    className="w-full px-4 py-3 rounded-xl bg-nexus-surface-1 border border-nexus-border text-nexus-text placeholder:text-nexus-text-muted focus:outline-none focus:ring-2 focus:ring-nexus-purple/50 focus:border-nexus-purple transition-all"
                                                    required
                                                />
                                                <p className="text-xs text-nexus-text-muted mt-1">Enter the transaction ID from your payment receipt</p>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-nexus-text mb-2">
                                                    Sender Phone Number
                                                </label>
                                                <input
                                                    type="text"
                                                    value={phoneNumber}
                                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                                    placeholder="01XXXXXXXXX"
                                                    className="w-full px-4 py-3 rounded-xl bg-nexus-surface-1 border border-nexus-border text-nexus-text placeholder:text-nexus-text-muted focus:outline-none focus:ring-2 focus:ring-nexus-purple/50 focus:border-nexus-purple transition-all"
                                                />
                                                <p className="text-xs text-nexus-text-muted mt-1">The phone number you sent the payment from (optional)</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Info Box */}
                                    <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                                        <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                                        <div className="text-sm text-blue-300">
                                            <p className="font-medium mb-1">Important Notes:</p>
                                            <ul className="list-disc list-inside space-y-1 text-blue-300/80">
                                                <li>Make sure to send the exact amount of <strong>৳{MEMBERSHIP_FEE}</strong></li>
                                                <li>Double-check the transaction ID before submitting</li>
                                                <li>Your application will be reviewed within 1-2 business days</li>
                                                <li>This is a <strong>one-time lifetime membership fee</strong></li>
                                            </ul>
                                        </div>
                                    </div>

                                    {/* Submit */}
                                    <div className="flex items-center gap-4 justify-end">
                                        <button
                                            type="button"
                                            onClick={() => setShowForm(false)}
                                            className="px-6 py-3 rounded-xl border border-nexus-border text-nexus-text hover:bg-nexus-glass transition-all"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isSubmitting || !selectedPayment || !transactionId.trim()}
                                            className="btn-nexus-primary px-8 py-3 rounded-xl font-bold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                    Submitting...
                                                </>
                                            ) : (
                                                <>
                                                    <Send className="w-5 h-5" />
                                                    Submit Application
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Default Plan Card */}
                    {!showForm && (
                        <div className="max-w-4xl mx-auto glass rounded-3xl p-8 md:p-12 border border-nexus-purple/30 shadow-glow-purple relative overflow-hidden">
                            <div className="absolute -top-24 -right-24 w-64 h-64 bg-nexus-purple/20 rounded-full blur-3xl" />
                            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-nexus-pink/20 rounded-full blur-3xl" />

                            <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
                                <div>
                                    <Badge color="green" className="mb-4">Lifetime Membership</Badge>
                                    <h2 className="text-3xl md:text-4xl font-bold text-nexus-text mb-4">
                                        Club Membership
                                    </h2>
                                    <p className="text-nexus-text-secondary text-lg mb-6 max-w-lg">
                                        One-time fee for lifetime membership. Get full access to all club activities, resources, and your digital ID card.
                                    </p>
                                    <ul className="space-y-3">
                                        {[
                                            'Access to all workshops & events',
                                            'Digital Member ID Card',
                                            'Certificates & Badges',
                                            'Project collaboration',
                                            'Monthly newsletter',
                                            'Leaderboard & points system',
                                        ].map((item, i) => (
                                            <li key={i} className="flex items-center gap-3 text-nexus-text/90">
                                                <CheckCircle className="w-5 h-5 text-green-400" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="flex-shrink-0">
                                    <div className="text-center md:text-right">
                                        <p className="text-sm text-nexus-text-secondary uppercase tracking-wider font-bold mb-2">One-Time Fee</p>
                                        <div className="text-5xl font-display font-bold text-nexus-text mb-2">৳{MEMBERSHIP_FEE}</div>
                                        <p className="text-nexus-text-muted mb-6">lifetime</p>

                                        {!isAuthenticated ? (
                                            <Link href="/register" className="btn-nexus-primary px-8 py-4 rounded-xl w-full md:w-auto inline-flex justify-center items-center gap-2">
                                                Register First
                                            </Link>
                                        ) : isMember ? (
                                            <div className="px-8 py-4 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400 font-bold">
                                                <CheckCircle className="w-5 h-5 inline mr-2" />
                                                Active Member
                                            </div>
                                        ) : isPending ? (
                                            <div className="px-8 py-4 rounded-xl bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 font-bold">
                                                <Clock className="w-5 h-5 inline mr-2" />
                                                Under Review
                                            </div>
                                        ) : (
                                            <button
                                                onClick={handleApplyClick}
                                                className="btn-nexus-primary px-8 py-4 rounded-xl w-full md:w-auto inline-flex justify-center items-center gap-2"
                                            >
                                                Apply Now <ArrowRight className="w-5 h-5" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* Application History */}
            {isAuthenticated && membershipData && membershipData.applications.length > 0 && (
                <section className="py-16 bg-nexus-bg relative">
                    <div className="max-w-4xl mx-auto px-4">
                        <h2 className="text-2xl font-bold text-nexus-text mb-8 flex items-center gap-3">
                            <Shield className="w-6 h-6 text-nexus-purple" />
                            Your Application History
                        </h2>

                        <div className="space-y-4">
                            {membershipData.applications.map((app: MembershipApplication) => (
                                <div
                                    key={app.id}
                                    className="glass rounded-xl p-5 border border-nexus-border flex flex-col sm:flex-row sm:items-center gap-4"
                                >
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${app.status === 'APPROVED'
                                                ? 'bg-green-500/20 text-green-400'
                                                : app.status === 'REJECTED'
                                                    ? 'bg-red-500/20 text-red-400'
                                                    : 'bg-yellow-500/20 text-yellow-400'
                                                }`}>
                                                {app.status}
                                            </span>
                                            <span className="text-sm text-nexus-text-muted">
                                                {new Date(app.createdAt).toLocaleDateString('en-US', {
                                                    year: 'numeric', month: 'short', day: 'numeric'
                                                })}
                                            </span>
                                        </div>
                                        <p className="text-nexus-text text-sm">
                                            <strong>Method:</strong> {app.paymentMethod} &bull; <strong>TXN:</strong> {app.transactionId} &bull; <strong>Amount:</strong> ৳{app.amount}
                                        </p>
                                        {app.rejectionReason && (
                                            <p className="text-red-400 text-sm mt-1">
                                                <strong>Reason:</strong> {app.rejectionReason}
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex-shrink-0">
                                        {app.status === 'APPROVED' && <CheckCircle className="w-8 h-8 text-green-400" />}
                                        {app.status === 'REJECTED' && <XCircle className="w-8 h-8 text-red-400" />}
                                        {app.status === 'PENDING' && <Clock className="w-8 h-8 text-yellow-400" />}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

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
