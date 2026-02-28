'use client';

import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Share2, Printer, Shield, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAppSelector } from '@/lib/redux/hooks';

const departments: Record<string, string> = {
  CSE: 'Computer Science & Engineering',
  SWE: 'Software Engineering',
  EEE: 'Electrical & Electronic Engineering',
  ETE: 'Electronics & Telecommunication Engineering',
  MCT: 'Multimedia & Creative Technology',
  CIS: 'Computing & Information System',
  BBA: 'Business Administration',
  ACC: 'Accounting & Information Systems',
};

// SVG corner decorations (green geometric shapes matching the reference)
const TopLeftDecor = () => (
  <svg className="absolute top-0 left-0 w-24 h-24" viewBox="0 0 100 100" fill="none">
    <path d="M0 0 L60 0 L30 30 L0 50 Z" fill="#4CAF50" opacity="0.9" />
    <path d="M0 0 L35 0 L15 20 L0 30 Z" fill="#2E7D32" opacity="0.95" />
    <path d="M10 30 L40 10 L50 25 L25 45 Z" fill="#66BB6A" opacity="0.7" />
  </svg>
);

const TopRightDecor = () => (
  <svg className="absolute top-0 right-0 w-24 h-24" viewBox="0 0 100 100" fill="none">
    <path d="M100 0 L40 0 L70 30 L100 50 Z" fill="#4CAF50" opacity="0.9" />
    <path d="M100 0 L65 0 L85 20 L100 30 Z" fill="#2E7D32" opacity="0.95" />
    <path d="M90 30 L60 10 L50 25 L75 45 Z" fill="#66BB6A" opacity="0.7" />
  </svg>
);

const BottomLeftDecor = () => (
  <svg className="absolute bottom-0 left-0 w-24 h-24" viewBox="0 0 100 100" fill="none">
    <path d="M0 100 L60 100 L30 70 L0 50 Z" fill="#4CAF50" opacity="0.9" />
    <path d="M0 100 L35 100 L15 80 L0 70 Z" fill="#2E7D32" opacity="0.95" />
    <path d="M10 70 L40 90 L50 75 L25 55 Z" fill="#66BB6A" opacity="0.7" />
  </svg>
);

const BottomRightDecor = () => (
  <svg className="absolute bottom-0 right-0 w-24 h-24" viewBox="0 0 100 100" fill="none">
    <path d="M100 100 L40 100 L70 70 L100 50 Z" fill="#4CAF50" opacity="0.9" />
    <path d="M100 100 L65 100 L85 80 L100 70 Z" fill="#2E7D32" opacity="0.95" />
    <path d="M90 70 L60 90 L50 75 L75 55 Z" fill="#66BB6A" opacity="0.7" />
  </svg>
);

// Dotted circle pattern behind avatar
const DottedCircle = () => (
  <svg className="absolute w-40 h-40 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2" viewBox="0 0 160 160" fill="none">
    {Array.from({ length: 8 }).map((_, row) =>
      Array.from({ length: 8 }).map((_, col) => {
        const x = 10 + col * 20;
        const y = 10 + row * 20;
        const dist = Math.sqrt((x - 80) ** 2 + (y - 80) ** 2);
        if (dist > 70 || dist < 20) return null;
        return (
          <circle
            key={`${row}-${col}`}
            cx={x}
            cy={y}
            r="3"
            fill="#E0E0E0"
            opacity={0.5}
          />
        );
      })
    )}
  </svg>
);

// Simple barcode SVG
const Barcode = ({ code }: { code: string }) => {
  // Generate pseudo-random bar widths from the code
  const bars: number[] = [];
  for (let i = 0; i < code.length; i++) {
    const charCode = code.charCodeAt(i);
    bars.push(charCode % 2 === 0 ? 2 : 1);
    bars.push(1);
    bars.push(charCode % 3 === 0 ? 3 : 1);
    bars.push(1);
  }

  let x = 0;
  return (
    <div className="flex flex-col items-center gap-1">
      <svg width="180" height="40" viewBox={`0 0 ${bars.reduce((a, b) => a + b, 0) + 10} 40`}>
        {bars.map((w, i) => {
          const barX = x + 5;
          x += w;
          return i % 2 === 0 ? (
            <rect key={i} x={barX} y="2" width={w} height="36" fill="#1a1a1a" />
          ) : null;
        })}
      </svg>
      <p className="text-xs font-mono text-gray-600 tracking-wider">ID {code}</p>
    </div>
  );
};

export default function IDCardPage() {
  const { user } = useAppSelector((state) => state.auth);
  const cardRef = useRef<HTMLDivElement>(null);
  const [isFlipped, setIsFlipped] = useState(false);

  const isMember = user?.role === 'MEMBER' || user?.role === 'EXECUTIVE' || user?.role === 'ADMIN';

  const handleDownload = () => {
    alert('Downloading ID Card PDF...');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'My Daffodil AI Club ID',
        text: `Check out my AI Club Member ID: ${user?.uniqueId || 'N/A'}`,
        url: window.location.href,
      });
    }
  };

  const deptFullName = user?.department ? (departments[user.department] || user.department) : 'N/A';
  const memberIdDisplay = user?.uniqueId || 'N/A';

  // If not a member, show restricted message
  if (!isMember) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="w-20 h-20 rounded-2xl bg-nexus-purple/10 border border-nexus-purple/30 flex items-center justify-center mx-auto">
            <Shield className="w-10 h-10 text-nexus-purple" />
          </div>
          <h1 className="text-3xl font-display font-bold text-nexus-text">
            Members Only
          </h1>
          <p className="text-nexus-text-secondary max-w-md mx-auto">
            The ID Card is available exclusively for club members. Apply for membership to get your digital ID card.
          </p>
          <Link href="/membership">
            <Button variant="primary" className="inline-flex items-center gap-2">
              Apply for Membership <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-nexus-text">
          My ID Card
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Your official Daffodil AI Club membership card — hover to see the back
        </p>
      </div>

      {/* ID Card with Flip Animation */}
      <div className="flex justify-center">
        <div
          ref={cardRef}
          className="w-full max-w-sm cursor-pointer"
          style={{ perspective: '1200px' }}
          onMouseEnter={() => setIsFlipped(true)}
          onMouseLeave={() => setIsFlipped(false)}
          onClick={() => setIsFlipped(!isFlipped)}
        >
          <motion.div
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
            style={{ transformStyle: 'preserve-3d' }}
            className="relative w-full"
          >
            {/* ===== FRONT SIDE ===== */}
            <div
              className="relative w-full rounded-2xl overflow-hidden shadow-2xl"
              style={{ backfaceVisibility: 'hidden', aspectRatio: '2.1/3.4' }}
            >
              <div className="absolute inset-0 bg-white" />

              {/* Green corner decorations */}
              <TopLeftDecor />
              <TopRightDecor />
              <BottomLeftDecor />
              <BottomRightDecor />

              {/* Content */}
              <div className="relative z-10 flex flex-col items-center h-full px-6 py-8">
                {/* Club Logo & Name */}
                <div className="flex flex-col items-center mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-700 rounded-lg flex items-center justify-center text-white font-bold text-sm mb-1.5">
                    AI
                  </div>
                  <h3 className="text-base font-bold text-gray-800">Daffodil AI Club</h3>
                  <p className="text-[10px] text-gray-500">Daffodil International University</p>
                </div>

                {/* Dotted pattern + Profile Image */}
                <div className="relative w-32 h-32 mb-4">
                  <DottedCircle />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-28 h-28 rounded-full border-[3px] border-green-500 overflow-hidden bg-gray-100">
                      {user?.profileImage ? (
                        <Image
                          src={user.profileImage}
                          alt={user.name || 'Profile'}
                          width={112}
                          height={112}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-400 to-green-600 text-white text-3xl font-bold">
                          {user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Name & Role */}
                <h2 className="text-xl font-bold text-gray-900 mb-0.5">{user?.name}</h2>
                <p className="text-sm text-green-700 font-medium mb-4">
                  {user?.role === 'ADMIN' ? 'Admin' : user?.role === 'EXECUTIVE' ? 'Executive' : 'Member'}
                  {user?.department ? ` • ${user.department}` : ''}
                </p>

                {/* Info Box */}
                <div className="w-full bg-gray-50 rounded-xl px-5 py-3 mb-4 space-y-1.5 border border-gray-100">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-gray-500 min-w-[52px]">Email</span>
                    <span className="text-xs text-gray-400">:</span>
                    <span className="text-xs text-gray-700 truncate">{user?.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-gray-500 min-w-[52px]">Phone</span>
                    <span className="text-xs text-gray-400">:</span>
                    <span className="text-xs text-gray-700">{user?.phone || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-gray-500 min-w-[52px]">Batch</span>
                    <span className="text-xs text-gray-400">:</span>
                    <span className="text-xs text-gray-700">{user?.batch || 'N/A'}</span>
                  </div>
                </div>

                {/* Barcode + ID */}
                <div className="mt-auto">
                  <Barcode code={memberIdDisplay} />
                </div>
              </div>
            </div>

            {/* ===== BACK SIDE ===== */}
            <div
              className="absolute inset-0 w-full rounded-2xl overflow-hidden shadow-2xl"
              style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', aspectRatio: '2.1/3.4' }}
            >
              <div className="absolute inset-0 bg-white" />

              {/* Green corner decorations */}
              <TopLeftDecor />
              <TopRightDecor />
              <BottomLeftDecor />
              <BottomRightDecor />

              {/* Content */}
              <div className="relative z-10 flex flex-col items-center h-full px-6 py-8">
                {/* Club Logo & Name */}
                <div className="flex flex-col items-center mb-5">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-700 rounded-lg flex items-center justify-center text-white font-bold text-sm mb-1.5">
                    AI
                  </div>
                  <h3 className="text-base font-bold text-gray-800">Daffodil AI Club</h3>
                </div>

                {/* Terms & Conditions */}
                <h2 className="text-lg font-extrabold text-gray-900 mb-5 tracking-wide uppercase">
                  Terms & Conditions
                </h2>

                <div className="w-full text-left space-y-4 mb-6 flex-1">
                  <div className="flex gap-2.5">
                    <span className="text-green-600 font-bold mt-0.5 text-sm">•</span>
                    <p className="text-[11px] leading-relaxed text-gray-600 text-justify">
                      <strong>Identification:</strong> All members must keep their ID cards visible or 
                      readily available while on university premises during club events to ensure 
                      proper access control and identity verification.
                    </p>
                  </div>
                  <div className="flex gap-2.5">
                    <span className="text-green-600 font-bold mt-0.5 text-sm">•</span>
                    <p className="text-[11px] leading-relaxed text-gray-600 text-justify">
                      <strong>Usage:</strong> The ID card remains the exclusive property of Daffodil AI Club. 
                      It is issued for personal use only and must not be lent, copied, or misused 
                      in any manner.
                    </p>
                  </div>
                  <div className="flex gap-2.5">
                    <span className="text-green-600 font-bold mt-0.5 text-sm">•</span>
                    <p className="text-[11px] leading-relaxed text-gray-600 text-justify">
                      <strong>Validity:</strong> This card is valid only while the member maintains active 
                      membership status. The club reserves the right to revoke the card at any time.
                    </p>
                  </div>
                </div>

                {/* Website */}
                <p className="text-xs text-green-700 font-semibold mb-4">
                  www.daffodilaiclub.com
                </p>

                {/* Barcode + ID */}
                <div className="mt-auto">
                  <Barcode code={memberIdDisplay} />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Flip hint */}
      <p className="text-center text-sm text-gray-500 dark:text-gray-400">
        Hover over the card or click to flip it
      </p>

      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Card Actions</CardTitle>
          <CardDescription>Download, print, or share your ID card</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="primary" onClick={handleDownload} className="w-full">
              <Download className="w-5 h-5 mr-2" />
              Download PDF
            </Button>
            <Button variant="outline" onClick={handlePrint} className="w-full">
              <Printer className="w-5 h-5 mr-2" />
              Print Card
            </Button>
            <Button variant="outline" onClick={handleShare} className="w-full">
              <Share2 className="w-5 h-5 mr-2" />
              Share
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>About Your ID Card</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-gray-600 dark:text-gray-400">
          <p>
            Your Daffodil AI Club ID card serves as your official membership credential.
            Present this card at events for quick check-in and identity verification.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-green-50 dark:bg-green-900/20">
              <h4 className="font-semibold text-green-900 dark:text-green-300 mb-2">Digital Card</h4>
              <p className="text-sm text-green-700 dark:text-green-400">
                Show your digital ID on your phone for event registration and verification.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20">
              <h4 className="font-semibold text-emerald-900 dark:text-emerald-300 mb-2">Physical Card</h4>
              <p className="text-sm text-emerald-700 dark:text-emerald-400">
                Print the PDF and laminate it for a durable physical ID card.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
