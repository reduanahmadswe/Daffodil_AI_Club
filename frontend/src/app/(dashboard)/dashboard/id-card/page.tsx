'use client';

import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Download, Share2, QrCode, Printer } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { useAuthStore } from '@/lib/store';

export default function IDCardPage() {
  const { user } = useAuthStore();
  const cardRef = useRef<HTMLDivElement>(null);

  const handleDownload = () => {
    // In a real app, this would call the backend API to generate PDF
    alert('Downloading ID Card PDF...');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'My Daffodil AI Club ID',
        text: `Check out my AI Club Member ID: ${user?.uniqueId}`,
        url: window.location.href,
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white">
          My ID Card
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Your official Daffodil AI Club membership card
        </p>
      </div>

      {/* ID Card Preview */}
      <div className="flex justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          ref={cardRef}
          className="w-full max-w-md"
        >
          {/* Front of Card */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-600 via-secondary-600 to-pink-600 p-1 shadow-2xl">
            <div className="relative bg-gray-900 rounded-xl p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center text-white font-bold text-xl">
                    AI
                  </div>
                  <div>
                    <h3 className="text-white font-bold">Daffodil AI Club</h3>
                    <p className="text-xs text-gray-400">Daffodil International University</p>
                  </div>
                </div>
                <Badge color="green" size="sm">Member</Badge>
              </div>

              {/* Profile Section */}
              <div className="flex gap-4 mb-6">
                <Avatar
                  src={user?.profileImage}
                  name={user?.name || ''}
                  size="lg"
                  className="w-24 h-24 border-4 border-primary-500"
                />
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-white">{user?.name}</h2>
                  <p className="text-gray-400 text-sm">{user?.department}</p>
                  <p className="text-gray-400 text-sm">Batch: {user?.batch}</p>
                  <p className="text-gray-400 text-sm">ID: {user?.studentId}</p>
                </div>
              </div>

              {/* Member ID */}
              <div className="bg-gradient-to-r from-primary-500/20 to-secondary-500/20 rounded-xl p-4 mb-4">
                <p className="text-xs text-gray-400 mb-1">MEMBER ID</p>
                <p className="text-2xl font-mono font-bold text-white tracking-wider">
                  {user?.uniqueId || 'DAIC-SPRING-00001'}
                </p>
              </div>

              {/* QR Code Placeholder */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400">Valid Since</p>
                  <p className="text-sm text-white">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      year: 'numeric'
                    } as const) : 'N/A'}
                  </p>
                </div>
                <div className="w-20 h-20 bg-white rounded-lg flex items-center justify-center">
                  <QrCode className="w-16 h-16 text-gray-900" />
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-500/20 to-transparent rounded-bl-full" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-secondary-500/20 to-transparent rounded-tr-full" />
            </div>
          </div>
        </motion.div>
      </div>

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
            The QR code on your card can be scanned at events for quick check-in.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20">
              <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">Digital Card</h4>
              <p className="text-sm text-blue-700 dark:text-blue-400">
                Show your digital ID on your phone for event registration and verification.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-900/20">
              <h4 className="font-semibold text-purple-900 dark:text-purple-300 mb-2">Physical Card</h4>
              <p className="text-sm text-purple-700 dark:text-purple-400">
                Print the PDF and laminate it for a durable physical ID card.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
