'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Share2, Printer, Shield, ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAppSelector } from '@/lib/redux/hooks';
import { authApi } from '@/lib/api';

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

// Modern geometric corner accents
const CornerAccent = ({ position }: { position: 'tl' | 'tr' | 'bl' | 'br' }) => {
  const transforms: Record<string, string> = {
    tl: '',
    tr: 'scale(-1, 1)',
    bl: 'scale(1, -1)',
    br: 'scale(-1, -1)',
  };
  const positions: Record<string, string> = {
    tl: 'top-0 left-0',
    tr: 'top-0 right-0',
    bl: 'bottom-0 left-0',
    br: 'bottom-0 right-0',
  };

  return (
    <svg
      className={`absolute ${positions[position]} w-20 h-20 pointer-events-none`}
      viewBox="0 0 80 80"
      fill="none"
      style={{ transform: transforms[position] }}
    >
      <path d="M0 0 L50 0 L20 25 L0 40 Z" fill="#16a34a" opacity="0.85" />
      <path d="M0 0 L28 0 L10 15 L0 22 Z" fill="#15803d" />
      <path d="M5 22 L30 5 L42 18 L18 38 Z" fill="#22c55e" opacity="0.6" />
    </svg>
  );
};

export default function IDCardPage() {
  const { user } = useAppSelector((state) => state.auth);
  const cardRef = useRef<HTMLDivElement>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);

  const isMember = user?.role === 'MEMBER' || user?.role === 'EXECUTIVE' || user?.role === 'ADMIN';
  const memberIdDisplay = user?.uniqueId || 'N/A';

  // Fetch real QR code from profile
  useEffect(() => {
    if (isMember && user?.uniqueId) {
      authApi.getProfile().then((res) => {
        if (res.data?.data?.qrCode) {
          setQrCode(res.data.data.qrCode);
        }
      }).catch(() => {});
    }
  }, [isMember, user?.uniqueId]);

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
        text: `Check out my AI Club Member ID: ${memberIdDisplay}`,
        url: window.location.href,
      });
    }
  };

  // Not a member
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
          <h1 className="text-3xl font-display font-bold text-nexus-text">Members Only</h1>
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

  const roleLabel = user?.role === 'ADMIN' ? 'Administrator' : user?.role === 'EXECUTIVE' ? 'Executive Member' : 'Member';

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-nexus-text">
          My ID Card
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Your official Daffodil AI Club membership card
        </p>
      </div>

      {/* ID Card with 3D Flip */}
      <div className="flex justify-center">
        <div
          ref={cardRef}
          className="w-full max-w-[340px] cursor-pointer select-none"
          style={{ perspective: '1200px' }}
          onMouseEnter={() => setIsFlipped(true)}
          onMouseLeave={() => setIsFlipped(false)}
          onClick={() => setIsFlipped(!isFlipped)}
        >
          <motion.div
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
            style={{ transformStyle: 'preserve-3d' }}
            className="relative w-full"
          >
            {/* ========== FRONT SIDE ========== */}
            <div
              className="relative w-full rounded-2xl overflow-hidden"
              style={{
                backfaceVisibility: 'hidden',
                aspectRatio: '0.618',
                boxShadow: '0 25px 60px rgba(0,0,0,0.15), 0 8px 20px rgba(0,0,0,0.1)',
              }}
            >
              {/* White background */}
              <div className="absolute inset-0 bg-white" />

              {/* Subtle top gradient band */}
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-green-500 via-emerald-400 to-green-600" />

              {/* Corner accents */}
              <CornerAccent position="tl" />
              <CornerAccent position="tr" />
              <CornerAccent position="bl" />
              <CornerAccent position="br" />

              {/* Content */}
              <div className="relative z-10 flex flex-col items-center h-full px-5 pt-6 pb-5">
                {/* Club header */}
                <div className="flex items-center gap-2.5 mb-5">
                  <div className="w-9 h-9 bg-gradient-to-br from-green-500 to-emerald-700 rounded-lg flex items-center justify-center shadow-md">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-800 leading-tight">Daffodil AI Club</h3>
                    <p className="text-[9px] text-gray-400 leading-tight">Daffodil International University</p>
                  </div>
                </div>

                {/* Profile photo with ring */}
                <div className="relative mb-4">
                  <div className="w-[110px] h-[110px] rounded-full p-[3px] bg-gradient-to-br from-green-400 via-emerald-500 to-green-600">
                    <div className="w-full h-full rounded-full overflow-hidden bg-gray-100">
                      {user?.profileImage ? (
                        <Image
                          src={user.profileImage}
                          alt={user.name || 'Profile'}
                          width={104}
                          height={104}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-400 to-emerald-600 text-white text-3xl font-bold">
                          {user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Name */}
                <h2 className="text-lg font-bold text-gray-900 leading-tight">{user?.name}</h2>
                <p className="text-xs text-green-600 font-semibold mt-0.5 mb-3">{roleLabel}</p>

                {/* Info grid */}
                <div className="w-full rounded-xl border border-gray-100 bg-gray-50/80 px-4 py-2.5 space-y-2 mb-3">
                  <InfoRow label="ID" value={memberIdDisplay} highlight />
                  <InfoRow label="Dept" value={user?.department || 'N/A'} />
                  <InfoRow label="Batch" value={user?.batch || 'N/A'} />
                  <InfoRow label="Email" value={user?.email || ''} truncate />
                  <InfoRow label="Phone" value={user?.phone || 'N/A'} />
                </div>

                {/* QR Code - real and large */}
                <div className="mt-auto flex flex-col items-center">
                  {qrCode ? (
                    <div className="bg-white rounded-xl p-2 shadow-sm border border-gray-100">
                      <img
                        src={qrCode}
                        alt="QR Code"
                        className="w-24 h-24"
                      />
                    </div>
                  ) : (
                    <div className="w-24 h-24 bg-gray-100 rounded-xl flex items-center justify-center">
                      <div className="w-16 h-16 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                        <span className="text-[9px] text-gray-400">QR Code</span>
                      </div>
                    </div>
                  )}
                  <p className="text-[10px] font-mono text-gray-400 mt-1.5 tracking-widest">{memberIdDisplay}</p>
                </div>
              </div>
            </div>

            {/* ========== BACK SIDE ========== */}
            <div
              className="absolute inset-0 w-full rounded-2xl overflow-hidden"
              style={{
                backfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
                aspectRatio: '0.618',
                boxShadow: '0 25px 60px rgba(0,0,0,0.15), 0 8px 20px rgba(0,0,0,0.1)',
              }}
            >
              {/* White background */}
              <div className="absolute inset-0 bg-white" />

              {/* Top gradient band */}
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-green-500 via-emerald-400 to-green-600" />

              {/* Corners */}
              <CornerAccent position="tl" />
              <CornerAccent position="tr" />
              <CornerAccent position="bl" />
              <CornerAccent position="br" />

              {/* Content */}
              <div className="relative z-10 flex flex-col items-center h-full px-6 pt-6 pb-5">
                {/* Club logo */}
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-9 h-9 bg-gradient-to-br from-green-500 to-emerald-700 rounded-lg flex items-center justify-center shadow-md">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-sm font-bold text-gray-800">Daffodil AI Club</h3>
                </div>

                {/* Divider */}
                <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-green-500 to-transparent mb-4" />

                {/* Terms title */}
                <h2 className="text-base font-extrabold text-gray-900 mb-4 tracking-wide uppercase">
                  Terms & Conditions
                </h2>

                {/* Terms content */}
                <div className="w-full text-left space-y-3 flex-1">
                  <TermItem>
                    <strong className="text-gray-700">Identification:</strong> All members must keep their ID cards
                    visible or readily available during club events to ensure proper access control
                    and identity verification.
                  </TermItem>
                  <TermItem>
                    <strong className="text-gray-700">Usage:</strong> The ID card remains the exclusive property of
                    Daffodil AI Club. It is issued for personal use only and must not be lent,
                    copied, or misused in any manner.
                  </TermItem>
                  <TermItem>
                    <strong className="text-gray-700">Validity:</strong> This card is valid only while the member
                    maintains active membership status. The club reserves the right to revoke
                    the card at any time.
                  </TermItem>
                </div>

                {/* Website */}
                <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-green-500 to-transparent mt-4 mb-3" />
                <p className="text-[11px] text-green-600 font-semibold tracking-wide">
                  www.daffodilaiclub.com
                </p>

                {/* QR + ID at bottom */}
                <div className="mt-auto flex flex-col items-center pt-3">
                  {qrCode ? (
                    <div className="bg-white rounded-xl p-1.5 shadow-sm border border-gray-100">
                      <img src={qrCode} alt="QR Code" className="w-20 h-20" />
                    </div>
                  ) : (
                    <div className="w-20 h-20 bg-gray-100 rounded-xl" />
                  )}
                  <p className="text-[10px] font-mono text-gray-400 mt-1.5 tracking-widest">{memberIdDisplay}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Flip hint */}
      <p className="text-center text-sm text-gray-500 dark:text-gray-400 animate-pulse">
        Hover or tap the card to flip it
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

      {/* About */}
      <Card>
        <CardHeader>
          <CardTitle>About Your ID Card</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-gray-600 dark:text-gray-400">
          <p>
            Your Daffodil AI Club ID card is your official membership credential.
            The QR code can be scanned at events for instant check-in and verification.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800/30">
              <h4 className="font-semibold text-green-900 dark:text-green-300 mb-2">Digital Card</h4>
              <p className="text-sm text-green-700 dark:text-green-400">
                Show your digital ID on your phone for event registration and verification.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/30">
              <h4 className="font-semibold text-emerald-900 dark:text-emerald-300 mb-2">Physical Card</h4>
              <p className="text-sm text-emerald-700 dark:text-emerald-400">
                Download the PDF and get it printed for a professional physical ID card.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Info row component
function InfoRow({ label, value, highlight, truncate }: { label: string; value: string; highlight?: boolean; truncate?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider min-w-[40px]">{label}</span>
      <span className="text-[10px] text-gray-300">|</span>
      <span
        className={`text-[11px] ${highlight ? 'font-bold text-green-600' : 'text-gray-600'} ${truncate ? 'truncate' : ''}`}
      >
        {value}
      </span>
    </div>
  );
}

// Term bullet item
function TermItem({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-2">
      <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
      <p className="text-[10px] leading-relaxed text-gray-500 text-justify">{children}</p>
    </div>
  );
}
