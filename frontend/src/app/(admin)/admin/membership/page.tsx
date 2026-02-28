'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users, Clock, CheckCircle, XCircle, Search, Filter,
    Eye, ChevronLeft, ChevronRight, Loader2, UserCheck,
    UserX, AlertTriangle, Phone, CreditCard, Hash,
    TrendingUp, Shield, MoreVertical, X
} from 'lucide-react';
import { membershipApi } from '@/lib/api';
import { MembershipApplication, MembershipStats } from '@/types';
import toast from 'react-hot-toast';

type StatusFilter = 'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED';

export default function AdminMembershipPage() {
    const [applications, setApplications] = useState<MembershipApplication[]>([]);
    const [stats, setStats] = useState<MembershipStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [selectedApp, setSelectedApp] = useState<MembershipApplication | null>(null);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectReason, setRejectReason] = useState('');
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    const fetchApplications = useCallback(async () => {
        try {
            setLoading(true);
            const res = await membershipApi.getApplications({
                page,
                limit: 20,
                status: statusFilter !== 'ALL' ? statusFilter : undefined,
                search: search || undefined,
            });
            setApplications(res.data.data || []);
            setTotalPages(res.data.pagination?.totalPages || 1);
            setTotal(res.data.pagination?.total || 0);
        } catch (error: any) {
            toast.error('Failed to load applications');
        } finally {
            setLoading(false);
        }
    }, [page, statusFilter, search]);

    const fetchStats = async () => {
        try {
            const res = await membershipApi.getStats();
            setStats(res.data.data);
        } catch {
            // ignore
        }
    };

    useEffect(() => {
        fetchApplications();
        fetchStats();
    }, [fetchApplications]);

    const handleApprove = async (appId: string) => {
        setActionLoading(appId);
        try {
            await membershipApi.approve(appId);
            toast.success('Application approved!');
            fetchApplications();
            fetchStats();
            setSelectedApp(null);
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to approve');
        } finally {
            setActionLoading(null);
        }
    };

    const handleReject = async () => {
        if (!selectedApp) return;
        setActionLoading(selectedApp.id);
        try {
            await membershipApi.reject(selectedApp.id, rejectReason || undefined);
            toast.success('Application rejected');
            setShowRejectModal(false);
            setRejectReason('');
            setSelectedApp(null);
            fetchApplications();
            fetchStats();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to reject');
        } finally {
            setActionLoading(null);
        }
    };

    const statusColors: Record<string, string> = {
        PENDING: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
        APPROVED: 'bg-green-500/20 text-green-400 border-green-500/30',
        REJECTED: 'bg-red-500/20 text-red-400 border-red-500/30',
    };

    const paymentMethodColors: Record<string, string> = {
        BKASH: 'text-pink-400',
        NAGAD: 'text-orange-400',
        ROCKET: 'text-purple-400',
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-display font-bold text-nexus-text">Membership Applications</h1>
                <p className="text-nexus-text-secondary mt-1">Review and manage membership applications</p>
            </div>

            {/* Stats Cards */}
            {stats && (
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="glass rounded-xl p-4 border border-nexus-border">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                                <Users className="w-5 h-5 text-blue-400" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-nexus-text">{stats.totalApplications}</p>
                                <p className="text-xs text-nexus-text-muted">Total</p>
                            </div>
                        </div>
                    </div>
                    <div className="glass rounded-xl p-4 border border-yellow-500/30">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                                <Clock className="w-5 h-5 text-yellow-400" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-yellow-400">{stats.pending}</p>
                                <p className="text-xs text-nexus-text-muted">Pending</p>
                            </div>
                        </div>
                    </div>
                    <div className="glass rounded-xl p-4 border border-green-500/30">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                                <CheckCircle className="w-5 h-5 text-green-400" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-green-400">{stats.approved}</p>
                                <p className="text-xs text-nexus-text-muted">Approved</p>
                            </div>
                        </div>
                    </div>
                    <div className="glass rounded-xl p-4 border border-red-500/30">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                                <XCircle className="w-5 h-5 text-red-400" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-red-400">{stats.rejected}</p>
                                <p className="text-xs text-nexus-text-muted">Rejected</p>
                            </div>
                        </div>
                    </div>
                    <div className="glass rounded-xl p-4 border border-nexus-purple/30">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-nexus-purple/20 flex items-center justify-center">
                                <Shield className="w-5 h-5 text-nexus-purple" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-nexus-purple">{stats.totalMembers}</p>
                                <p className="text-xs text-nexus-text-muted">Members</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-nexus-text-muted" />
                    <input
                        type="text"
                        placeholder="Search by name, email, transaction ID..."
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-nexus-glass border border-nexus-border text-nexus-text placeholder:text-nexus-text-muted focus:outline-none focus:ring-2 focus:ring-nexus-purple/50"
                    />
                </div>
                <div className="flex gap-2">
                    {(['ALL', 'PENDING', 'APPROVED', 'REJECTED'] as StatusFilter[]).map((status) => (
                        <button
                            key={status}
                            onClick={() => { setStatusFilter(status); setPage(1); }}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${statusFilter === status
                                ? 'bg-nexus-purple text-white'
                                : 'bg-nexus-glass border border-nexus-border text-nexus-text-secondary hover:bg-nexus-purple/10'
                                }`}
                        >
                            {status === 'ALL' ? 'All' : status.charAt(0) + status.slice(1).toLowerCase()}
                        </button>
                    ))}
                </div>
            </div>

            {/* Applications Table */}
            <div className="glass rounded-2xl border border-nexus-border overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin text-nexus-purple" />
                    </div>
                ) : applications.length === 0 ? (
                    <div className="text-center py-20">
                        <Users className="w-12 h-12 text-nexus-text-muted mx-auto mb-4" />
                        <p className="text-nexus-text-secondary">No applications found</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-nexus-border bg-nexus-surface-1/50">
                                    <th className="text-left py-4 px-6 text-sm font-medium text-nexus-text-secondary">Applicant</th>
                                    <th className="text-left py-4 px-4 text-sm font-medium text-nexus-text-secondary">Student ID</th>
                                    <th className="text-left py-4 px-4 text-sm font-medium text-nexus-text-secondary">Payment</th>
                                    <th className="text-left py-4 px-4 text-sm font-medium text-nexus-text-secondary">Transaction</th>
                                    <th className="text-left py-4 px-4 text-sm font-medium text-nexus-text-secondary">Amount</th>
                                    <th className="text-left py-4 px-4 text-sm font-medium text-nexus-text-secondary">Status</th>
                                    <th className="text-left py-4 px-4 text-sm font-medium text-nexus-text-secondary">Date</th>
                                    <th className="text-right py-4 px-6 text-sm font-medium text-nexus-text-secondary">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {applications.map((app) => (
                                    <tr key={app.id} className="border-b border-nexus-border/50 hover:bg-nexus-glass/50 transition-colors">
                                        <td className="py-4 px-6">
                                            <div>
                                                <p className="font-medium text-nexus-text">{app.user?.name || 'Unknown'}</p>
                                                <p className="text-xs text-nexus-text-muted">{app.user?.email}</p>
                                                {app.user?.uniqueId && <p className="text-xs text-nexus-purple">{app.user.uniqueId}</p>}
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className="text-sm text-nexus-text">{app.user?.studentId || '-'}</span>
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className={`font-medium text-sm ${paymentMethodColors[app.paymentMethod] || 'text-nexus-text'}`}>
                                                {app.paymentMethod}
                                            </span>
                                            {app.phoneNumber && (
                                                <p className="text-xs text-nexus-text-muted mt-0.5">{app.phoneNumber}</p>
                                            )}
                                        </td>
                                        <td className="py-4 px-4">
                                            <code className="text-sm text-nexus-text bg-nexus-surface-1 px-2 py-1 rounded">{app.transactionId}</code>
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className="text-sm font-medium text-nexus-text">৳{app.amount}</span>
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${statusColors[app.status]}`}>
                                                {app.status}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className="text-sm text-nexus-text-muted">
                                                {new Date(app.createdAt).toLocaleDateString('en-US', {
                                                    month: 'short', day: 'numeric', year: 'numeric'
                                                })}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            {app.status === 'PENDING' ? (
                                                <div className="flex items-center gap-2 justify-end">
                                                    <button
                                                        onClick={() => handleApprove(app.id)}
                                                        disabled={actionLoading === app.id}
                                                        className="px-3 py-1.5 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors text-sm font-medium disabled:opacity-50 flex items-center gap-1"
                                                    >
                                                        {actionLoading === app.id ? (
                                                            <Loader2 className="w-4 h-4 animate-spin" />
                                                        ) : (
                                                            <UserCheck className="w-4 h-4" />
                                                        )}
                                                        Approve
                                                    </button>
                                                    <button
                                                        onClick={() => { setSelectedApp(app); setShowRejectModal(true); }}
                                                        className="px-3 py-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors text-sm font-medium flex items-center gap-1"
                                                    >
                                                        <UserX className="w-4 h-4" />
                                                        Reject
                                                    </button>
                                                </div>
                                            ) : (
                                                <span className="text-xs text-nexus-text-muted">
                                                    {app.reviewedAt && `Reviewed ${new Date(app.reviewedAt).toLocaleDateString()}`}
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between px-6 py-4 border-t border-nexus-border">
                        <p className="text-sm text-nexus-text-muted">
                            Showing {applications.length} of {total} applications
                        </p>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setPage(Math.max(1, page - 1))}
                                disabled={page === 1}
                                className="p-2 rounded-lg bg-nexus-glass border border-nexus-border text-nexus-text-secondary hover:bg-nexus-purple/10 disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <span className="text-sm text-nexus-text px-3">
                                Page {page} of {totalPages}
                            </span>
                            <button
                                onClick={() => setPage(Math.min(totalPages, page + 1))}
                                disabled={page === totalPages}
                                className="p-2 rounded-lg bg-nexus-glass border border-nexus-border text-nexus-text-secondary hover:bg-nexus-purple/10 disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Reject Modal */}
            <AnimatePresence>
                {showRejectModal && selectedApp && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
                        onClick={() => { setShowRejectModal(false); setSelectedApp(null); setRejectReason(''); }}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-nexus-surface-1 rounded-2xl border border-nexus-border p-6 max-w-md w-full"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-nexus-text flex items-center gap-2">
                                    <AlertTriangle className="w-5 h-5 text-red-400" />
                                    Reject Application
                                </h3>
                                <button
                                    onClick={() => { setShowRejectModal(false); setSelectedApp(null); setRejectReason(''); }}
                                    className="p-1 rounded-lg hover:bg-nexus-glass text-nexus-text-muted"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="mb-4 p-3 rounded-xl bg-nexus-glass border border-nexus-border">
                                <p className="text-sm text-nexus-text"><strong>Applicant:</strong> {selectedApp.user?.name}</p>
                                <p className="text-sm text-nexus-text-muted">{selectedApp.user?.email}</p>
                                <p className="text-sm text-nexus-text-muted mt-1">TXN: {selectedApp.transactionId}</p>
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-medium text-nexus-text mb-2">
                                    Rejection Reason (optional)
                                </label>
                                <textarea
                                    value={rejectReason}
                                    onChange={(e) => setRejectReason(e.target.value)}
                                    placeholder="e.g., Invalid transaction ID, payment not received..."
                                    rows={3}
                                    className="w-full px-4 py-3 rounded-xl bg-nexus-glass border border-nexus-border text-nexus-text placeholder:text-nexus-text-muted focus:outline-none focus:ring-2 focus:ring-red-500/50 resize-none"
                                />
                            </div>

                            <div className="flex items-center gap-3 justify-end">
                                <button
                                    onClick={() => { setShowRejectModal(false); setSelectedApp(null); setRejectReason(''); }}
                                    className="px-4 py-2 rounded-xl border border-nexus-border text-nexus-text hover:bg-nexus-glass transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleReject}
                                    disabled={actionLoading === selectedApp.id}
                                    className="px-4 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600 transition-all font-medium flex items-center gap-2 disabled:opacity-50"
                                >
                                    {actionLoading === selectedApp.id ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <UserX className="w-4 h-4" />
                                    )}
                                    Reject Application
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
