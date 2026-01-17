'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardTitle } from '@/components/ui/Card';
import { authApi } from '@/lib/api';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const [uniqueId, setUniqueId] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus('error');
        setMessage('Verification token is missing');
        return;
      }

      try {
        const response = await authApi.verifyEmail(token);
        setStatus('success');
        setMessage('Your email has been verified successfully!');
        setUniqueId(response.data.uniqueId || '');
      } catch (err: any) {
        setStatus('error');
        setMessage(err.response?.data?.message || 'Verification failed. Token may be expired.');
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-gradient-to-br from-primary-500 via-secondary-500 to-pink-500">
      <div className="absolute inset-0 pattern-grid opacity-10" />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md relative"
      >
        <Card className="text-center">
          <CardContent className="p-8">
            {status === 'loading' && (
              <>
                <div className="w-20 h-20 mx-auto mb-6 bg-primary-100 rounded-full flex items-center justify-center">
                  <Loader2 className="w-10 h-10 text-primary-600 animate-spin" />
                </div>
                <CardTitle className="text-2xl mb-4">Verifying Your Email...</CardTitle>
                <p className="text-gray-600">Please wait while we verify your email address.</p>
              </>
            )}

            {status === 'success' && (
              <>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', duration: 0.5 }}
                  className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center"
                >
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </motion.div>
                <CardTitle className="text-2xl mb-4 text-green-600">Email Verified!</CardTitle>
                <p className="text-gray-600 mb-6">{message}</p>
                
                {uniqueId && (
                  <div className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl p-6 mb-8 text-white">
                    <p className="text-sm opacity-80 mb-2">Your Unique Member ID</p>
                    <p className="text-2xl font-mono font-bold">{uniqueId}</p>
                    <p className="text-sm opacity-80 mt-2">Save this ID for future reference</p>
                  </div>
                )}

                <Link href="/login">
                  <Button variant="primary" className="w-full">
                    Continue to Login
                  </Button>
                </Link>
              </>
            )}

            {status === 'error' && (
              <>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', duration: 0.5 }}
                  className="w-20 h-20 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center"
                >
                  <XCircle className="w-10 h-10 text-red-600" />
                </motion.div>
                <CardTitle className="text-2xl mb-4 text-red-600">Verification Failed</CardTitle>
                <p className="text-gray-600 mb-8">{message}</p>
                
                <div className="space-y-3">
                  <Link href="/register">
                    <Button variant="primary" className="w-full">
                      Try Registering Again
                    </Button>
                  </Link>
                  <Link href="/contact">
                    <Button variant="outline" className="w-full">
                      Contact Support
                    </Button>
                  </Link>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
