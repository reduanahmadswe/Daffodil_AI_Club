'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, GraduationCap } from 'lucide-react';
import { useAppDispatch } from '@/lib/redux/hooks';
import { addNotification } from '@/lib/redux/slices/notificationSlice';
import { Member } from '@/data/leadership';

export const MemberCard = ({ member, type }: { member: Member, type: 'TEACHER' | 'STUDENT' }) => {
    const dispatch = useAppDispatch();

    const handleCopyEmail = () => {
        navigator.clipboard.writeText(member.email);
        dispatch(addNotification({ message: 'Email copied to clipboard', type: 'success' }));
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -10 }}
            className="group relative h-full"
        >
            <div className={`
        relative h-full flex flex-col items-center
        rounded-2xl overflow-hidden
        ${type === 'TEACHER'
                    ? 'bg-[#0B0B12]/80 border border-purple-500/10 hover:border-purple-500/40 shadow-glow-purple/20'
                    : 'bg-black/80 border border-[#6EF3FF]/10 hover:border-[#6EF3FF]/40 shadow-glow-blue/20'
                }
        backdrop-blur-xl transition-all duration-300
      `}>
                {/* Top Image Section */}
                <div className="relative w-full aspect-[4/3] overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10 opacity-60 group-hover:opacity-40 transition-opacity" />
                    <img
                        src={member.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=random`}
                        alt={member.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    {/* Badge Overlay */}
                    <div className="absolute top-4 right-4 z-20">
                    </div>
                </div>

                {/* Content Section */}
                <div className="relative w-full p-6 flex flex-col flex-grow items-center text-center -mt-12 z-20">
                    <div className="mb-4 flex justify-center w-full px-4">
                        <span className={`
              inline-block px-4 py-1.5 rounded-full text-xs font-bold tracking-wide backdrop-blur-md border shadow-lg
              whitespace-normal text-center leading-tight max-w-full
              ${type === 'TEACHER'
                                ? 'bg-purple-500/10 border-purple-500/30 text-purple-200'
                                : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-200'
                            }
            `}>
                            {member.position}
                        </span>
                    </div>

                    {/* Name & Dept */}
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-[#B5B5C3] transition-all">
                        {member.name}
                    </h3>

                    {type === 'STUDENT' && (
                        <div className="flex items-center gap-2 text-sm text-[#8A8A9E] mb-4 bg-white/5 px-3 py-1 rounded-full border border-nexus-border">
                            <GraduationCap className="w-3.5 h-3.5" />
                            <span>{member.department} {member.id ? `• ${member.id}` : ''}</span>
                        </div>
                    )}

                    {/* Divider */}
                    <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-4" />

                    {/* Contact Actions */}
                    <div className="flex items-center gap-3 mt-auto">
                        <button
                            onClick={handleCopyEmail}
                            className="p-2 rounded-lg bg-white/5 border border-white/10 text-[#B5B5C3] hover:text-white hover:bg-white/10 hover:border-nexus-border transition-all group/btn relative"
                            title={member.email}
                        >
                            <Mail className="w-4 h-4" />
                            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-black border border-nexus-border rounded opacity-0 group-hover/btn:opacity-100 whitespace-nowrap pointer-events-none transition-opacity">
                                {member.email}
                            </span>
                        </button>

                        {member.phone && (
                            <a
                                href={`tel:${member.phone}`}
                                className="p-2 rounded-lg bg-white/5 border border-white/10 text-[#B5B5C3] hover:text-white hover:bg-white/10 hover:border-nexus-border transition-all"
                                title={member.phone}
                            >
                                <Phone className="w-4 h-4" />
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
