'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, Briefcase, Award, GraduationCap, Copy } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { useNotificationStore } from '@/lib/store';

// Types
interface Member {
    name: string;
    position: string;
    email: string;
    phone?: string;
    image?: string;
    department?: string;
    id?: string;
    bloodGroup?: string;
}

// Data
const convenerPanel: Member[] = [
    {
        name: "Professor Dr. Fernaz Narin Nur",
        position: "Convener",
        email: "fernaz.cse@diu.edu.bd",
        phone: "01886411541",
        department: "CSE",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&h=800&fit=crop"
    },
    {
        name: "Associate Professor Dr. Md. Akhtaruzzaman",
        position: "Co-Convener",
        email: "akhtaruzzaman.cse@diu.edu.bd",
        phone: "01754823989",
        department: "CSE",
        image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&h=800&fit=crop"
    },
    {
        name: "Assistant Professor Mr. Md. Hasanuzzaman Dipu",
        position: "Co-Convener",
        email: "dipu.cse@diu.edu.bd",
        phone: "01725568350",
        department: "CSE",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&h=800&fit=crop"
    }
];

const advisingPanel: Member[] = [
    { name: "Professor Dr. Md. Fokhray Hossain", position: "Advisor", email: "drfokhray@daffodilvarsity.edu.bd", phone: "01713493250", image: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=800&h=800&fit=crop" },
    { name: "Professor Dr. Sheak Rashed Haider Noori", position: "Advisor", email: "drnoori@daffodilvarsity.edu.bd", phone: "01847140016", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=800&fit=crop" },
    { name: "Professor Dr. S. M. Aminul Haque", position: "Advisor", email: "aminul.cse@daffodilvarsity.edu.bd", phone: "01847140129", image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800&h=800&fit=crop" },
    { name: "Associate Professor Ms. Nazmun Nessa Moon", position: "Advisor", email: "moon@daffodilvarsity.edu.bd", phone: "01798145670", image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=800&h=800&fit=crop" },
    { name: "Associate Professor Dr. Arif Mahmud", position: "Advisor", email: "arif.cse@diu.edu.bd", phone: "01896034252", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&h=800&fit=crop" },
    { name: "Associate Professor Dr. Abdus Sattar", position: "Advisor", email: "abdus.cse@diu.edu.bd", phone: "01818392800", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&h=800&fit=crop" },
    { name: "Assistant Professor Dr. Md Alamgir Kabir", position: "Advisor", email: "kabir.cse@diu.edu.bd", phone: "01723034458", image: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=800&h=800&fit=crop" },
    { name: "Assistant Professor Samia Nawshin", position: "Advisor", email: "samia@daffodilvarsity.edu.bd", phone: "01915638046", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&h=800&fit=crop" },
    { name: "Lecturer Mr. Mehadi Hasan", position: "Advisor", email: "mehadihasan.cse@diu.edu.bd", phone: "01521579271", image: "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=800&h=800&fit=crop" },
    { name: "Lecturer Mr. Shahariar Sarkar", position: "Advisor", email: "shahariar.cse@diu.edu.bd", phone: "01624943334", image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&h=800&fit=crop" },
    { name: "Lecturer Ms. Sayeda Parvin", position: "Advisor", email: "sayeda.cse@diu.edu.bd", phone: "01318522709", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&h=800&fit=crop" },
    { name: "Lecturer Ms. Liza Akter", position: "Advisor", email: "liza.cse@diu.edu.bd", phone: "01776477976", image: "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=800&h=800&fit=crop" },
    { name: "Lecturer Ms. Shreya Nag Riya", position: "Advisor", email: "riya.cse@diu.edu.bd", phone: "01982908767", image: "https://images.unsplash.com/photo-1601288496920-b6154fe3626a?w=800&h=800&fit=crop" },
    { name: "Lecturer Mr. Anup Kumar Modak", position: "Advisor", email: "anupkumar.cse@diu.edu.bd", phone: "01874066015", image: "https://images.unsplash.com/photo-1618077360395-f3068be8e001?w=800&h=800&fit=crop" },
    { name: "Lecturer Ms. Pallabi Biswas", position: "Advisor", email: "pallabibiswas.cse@diu.edu.bd", phone: "01993984424", image: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&h=800&fit=crop" },
    { name: "Mezbaul Islam Zion", position: "Advisor", email: "zion.cse@diu.edu.bd", phone: "01750458479", image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=800&h=800&fit=crop" }
];

const studentPanel: Member[] = [
    // President
    { name: "Md. Rony", position: "President", email: "rony15-4967@diu.edu.bd", phone: "01890190638", department: "CSE", id: "221-15-4967", bloodGroup: "B+", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&h=800&fit=crop" },

    // Vice President
    { name: "Md Mobashir Hasan", position: "Vice President", email: "hasan15-5405@diu.edu.bd", phone: "01986981820", department: "CSE", id: "221-15-5405", bloodGroup: "O+", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&h=800&fit=crop" },

    // General Secretary
    { name: "Abid Khan", position: "General Secretary", email: "khan15-4894@diu.edu.bd", phone: "01825929393", department: "CSE", id: "221-15-4894", bloodGroup: "O+", image: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=800&h=800&fit=crop" },

    // Joint Secretaries
    { name: "Md Mehedi Hasan Nayeem", position: "Joint Secretary", email: "nayeem15-5049@diu.edu.bd", phone: "01711311861", department: "CSE", id: "221-15-5049", bloodGroup: "A+", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=800&fit=crop" },

    // Organizing
    { name: "Md. Latifur Rahman Rafi", position: "Organizing Secretary", email: "latifur23105101451@diu.edu.bd", phone: "01856862093", department: "CSE", id: "0242310005101451", bloodGroup: "A+", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&h=800&fit=crop" },
    { name: "Md Minhajul Islam", position: "Joint Organizing Secretary", email: "islam2305101257@diu.edu.bd", phone: "01715904240", department: "CSE", id: "0242310005101257", bloodGroup: "O+", image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800&h=800&fit=crop" },

    // Treasurer
    { name: "Md Abdur Rahman Roky", position: "Treasurer", email: "roky15-4972@diu.edu.bd", phone: "01706-959630", department: "CSE", id: "221-15-4972", bloodGroup: "B+", image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800&h=800&fit=crop" },

    // Communication
    { name: "Md. Kholilur Rahman Rabby", position: "Communication Secretary", email: "rabby15-4973@diu.edu.bd", phone: "01719019635", department: "CSE", id: "221-15-4973", bloodGroup: "O+", image: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=800&h=800&fit=crop" },
    { name: "Anmay Paul Arpan", position: "Assistant Communication Secretary", email: "arpan2305101696@diu.edu.bd", phone: "01725590258", department: "CSE", id: "232-15-696", bloodGroup: "O+", image: "https://images.unsplash.com/photo-1531384441138-2736e62e0919?w=800&h=800&fit=crop" },

    // Press & Publication
    { name: "Md Muhasin Ali", position: "Press Secretary", email: "muhasin15-4739@diu.edu.bd", phone: "01707745849", department: "CSE", id: "221-15-4739", bloodGroup: "O+", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&h=800&fit=crop" },
    { name: "Esrat Anam Kamy", position: "Assistant Publication Secretary", email: "anam241-15-445@diu.edu.bd", phone: "01970455551", department: "CSE", id: "241-15-445", bloodGroup: "A+", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&h=800&fit=crop" },
    { name: "MD Rezwan Ahmed Rayhan", position: "Assistant Publication Secretary", email: "rayhan241-15-901@diu.edu.bd", phone: "01937729128", department: "CSE", id: "241-15-901", bloodGroup: "B+", image: "https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?w=800&h=800&fit=crop" },
    { name: "Maria Rahman Momo", position: "Assistant Press Secretary", email: "rahman241-15-359@diu.edu.bd", phone: "01405041959", department: "CSE", id: "241-15-359", bloodGroup: "B+", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&h=800&fit=crop" },
    { name: "Kazi Hafijur Rahman Rifad", position: "Assistant Press Secretary", email: "rifad22205101873@diu.edu.bd", phone: "01851247137", department: "CSE", id: "0242220005101873", bloodGroup: "A+", image: "https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?w=800&h=800&fit=crop" },
    { name: "Asma Tabassum Nabila", position: "Assistant Media Secretary", email: "tabassum241-15-800@diu.edu.bd", phone: "01719415535", department: "CSE", id: "241-15-800", bloodGroup: "O+", image: "https://images.unsplash.com/photo-1548142813-c348350df52b?w=800&h=800&fit=crop" },

    // Leads & Heads
    { name: "Tamim Hossain", position: "Head of Executive", email: "hossain2305191034@diu.edu.bd", phone: "01789509447", department: "ITM", id: "232-51-034", bloodGroup: "A+", image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&h=800&fit=crop" },
    { name: "Shafayat Yeamin Jian", position: "Lead Executive", email: "yeamin241-15-679@diu.edu.bd", phone: "01601721676", department: "CSE", id: "0242410005101679", bloodGroup: "A+", image: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=800&h=800&fit=crop" },
    { name: "Yeasin Arafat", position: "Lead Executive", email: "yeasin241-35-126@diu.edu.bd", phone: "01746163645", department: "SWE", id: "241-35-126", bloodGroup: "O+", image: "https://images.unsplash.com/photo-1522075469751-3a3694c60e9e?w=800&h=800&fit=crop" },
    { name: "Md.Mahathir Islam", position: "Lead Executive", email: "251-15-821@diu.edu.bd", phone: "01731724838", department: "CSE", id: "251-15-821", bloodGroup: "O+", image: "https://images.unsplash.com/photo-1517502886367-e0fa6f72f052?w=800&h=800&fit=crop" },
    { name: "Shamim Faysal", position: "Lead Executive", email: "faysal241-15-016@diu.edu.bd", phone: "01798722061", department: "CSE", id: "241-15-016", bloodGroup: "O+", image: "https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=800&h=800&fit=crop" },

    // Designers & Developers
    { name: "Mohammad Robiul Islam", position: "Lead Creative Designer", email: "robiul241-35-321@diu.edu.bd", phone: "01518694904", department: "SWE", id: "241-35-321", bloodGroup: "A+", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=800&fit=crop" },
    { name: "Reduan Ahmad", position: "Web Developer", email: "ahmad2305341016@diu.edu.bd", phone: "+8801538363737", department: "SWE", id: "232-35-016", bloodGroup: "A+", image: "https://images.unsplash.com/photo-1557862921-37829c790f19?w=800&h=800&fit=crop" },
    { name: "MD Robiul islam", position: "Creative Designer", email: "251-40-007@diu.edu.bd", phone: "01750970358", department: "MCT", id: "251-40-007", bloodGroup: "Ab+", image: "https://images.unsplash.com/photo-1542596768-5d1d21f1cfde?w=800&h=800&fit=crop" },
    { name: "Tarif Hasan Samin", position: "Digital Content Creator", email: "251-15-003@diu.edu.bd", phone: "01788209907", department: "CSE", id: "251-15-003", bloodGroup: "O+", image: "https://images.unsplash.com/photo-1522075469751-3a3694c60e9e?w=800&h=800&fit=crop" },

    // Assistant General Secretaries
    { name: "Tapon Paul", position: "Assistant General Secretary", email: "paul15-5086@diu.edu.bd", phone: "01864327175", department: "CSE", id: "221-15-5086", bloodGroup: "O+", image: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=800&h=800&fit=crop" },
    { name: "Md Muntaqim Meherab", position: "Assistant General Secretary", email: "meherab2305101354@diu.edu.bd", phone: "01704452423", department: "CSE", id: "232-15-354", bloodGroup: "A+", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&h=800&fit=crop" },
    { name: "Shifat Mahmud Tonmoy", position: "Assistant General Secretary", email: "tonmoy15-6058@diu.edu.bd", phone: "01687959536", department: "CSE", id: "221-15-6058", bloodGroup: "B+", image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800&h=800&fit=crop" },
];

const MemberCard = ({ member, type }: { member: Member, type: 'TEACHER' | 'STUDENT' }) => {
    const { addNotification } = useNotificationStore();

    const handleCopyEmail = () => {
        navigator.clipboard.writeText(member.email);
        addNotification('Email copied to clipboard', 'success');
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
                        {/* Blood group removed as requested */}
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
                        <div className="flex items-center gap-2 text-sm text-[#8A8A9E] mb-4 bg-white/5 px-3 py-1 rounded-full border border-white/5">
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
                            className="p-2 rounded-lg bg-white/5 border border-white/10 text-[#B5B5C3] hover:text-white hover:bg-white/10 hover:border-white/20 transition-all group/btn relative"
                            title={member.email}
                        >
                            <Mail className="w-4 h-4" />
                            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-black border border-white/20 rounded opacity-0 group-hover/btn:opacity-100 whitespace-nowrap pointer-events-none transition-opacity">
                                {member.email}
                            </span>
                        </button>

                        {member.phone && (
                            <a
                                href={`tel:${member.phone}`}
                                className="p-2 rounded-lg bg-white/5 border border-white/10 text-[#B5B5C3] hover:text-white hover:bg-white/10 hover:border-white/20 transition-all"
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

export default function ExecutivesPage() {
    return (
        <>
            <section className="relative pt-40 pb-20 overflow-hidden bg-black">
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
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 text-white">
                            Meet Our <span className="gradient-text">Executive Panel</span>
                        </h1>
                        <p className="text-xl text-[#B5B5C3]">
                            The dedicated team of faculty and students driving the vision of Daffodil AI Club.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Convener Panel */}
            <section className="py-20 bg-black relative">
                <div className="max-w-7xl mx-auto px-4 relative z-10">
                    <div className="flex items-center gap-4 mb-16">
                        <div className="h-px bg-gradient-to-r from-transparent to-[#7B61FF]/50 flex-grow" />
                        <div className="px-6 py-2 rounded-full border border-[#7B61FF]/30 bg-[#7B61FF]/10 backdrop-blur-sm">
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
            <section className="py-20 bg-[#0B0B12] relative">
                <div className="max-w-7xl mx-auto px-4 relative z-10">
                    <div className="flex items-center gap-4 mb-16">
                        <div className="h-px bg-gradient-to-r from-transparent to-[#FF4FD8]/50 flex-grow" />
                        <div className="px-6 py-2 rounded-full border border-[#FF4FD8]/30 bg-[#FF4FD8]/10 backdrop-blur-sm">
                            <h2 className="text-2xl font-display font-bold text-[#ff99e8]">Advising Panel</h2>
                        </div>
                        <div className="h-px bg-gradient-to-l from-transparent to-[#FF4FD8]/50 flex-grow" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {advisingPanel.map((member, index) => (
                            <MemberCard key={index} member={member} type="TEACHER" />
                        ))}
                    </div>
                </div>
            </section>

            {/* Student Panel */}
            <section className="py-20 bg-black relative">
                <div className="max-w-7xl mx-auto px-4 relative z-10">
                    <div className="flex items-center gap-4 mb-16">
                        <div className="h-px bg-gradient-to-r from-transparent to-[#6EF3FF]/50 flex-grow" />
                        <div className="px-6 py-2 rounded-full border border-[#6EF3FF]/30 bg-[#6EF3FF]/10 backdrop-blur-sm">
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
