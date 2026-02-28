'use client';

import React, { useEffect, useState, useRef, useCallback, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Loader2, Mail, RefreshCw, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { authApi } from '@/lib/api';
import { useAppDispatch } from '@/lib/redux/hooks';
import { login as loginAction } from '@/lib/redux/slices/authSlice';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  const dispatch = useAppDispatch();
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isResending, setIsResending] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Start resend cooldown on mount
  useEffect(() => {
    setResendCooldown(60);
  }, []);

  // Countdown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  // Focus first input on mount
  useEffect(() => {
    if (email) {
      setTimeout(() => inputRefs.current[0]?.focus(), 300);
    }
  }, [email]);

  const handleChange = useCallback((index: number, value: string) => {
    // Only allow digits
    const digit = value.replace(/\D/g, '').slice(-1);
    
    setOtp(prev => {
      const newOtp = [...prev];
      newOtp[index] = digit;
      return newOtp;
    });

    // Auto-focus next input
    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  }, []);

  const handleKeyDown = useCallback((index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }, [otp]);

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pastedData.length > 0) {
      const newOtp = [...otp];
      for (let i = 0; i < 6; i++) {
        newOtp[i] = pastedData[i] || '';
      }
      setOtp(newOtp);
      // Focus the next empty or last input
      const focusIndex = Math.min(pastedData.length, 5);
      inputRefs.current[focusIndex]?.focus();
    }
  }, [otp]);

  const handleVerify = async () => {
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      setStatus('error');
      setMessage('Please enter the complete 6-digit OTP');
      return;
    }

    setStatus('loading');
    setMessage('');

    try {
      const response = await authApi.verifyEmail(email, otpCode);
      const data = response.data.data || response.data;

      // Auto-login: store token + user in Redux
      if (data?.token && data?.user) {
        dispatch(loginAction({ user: data.user, token: data.token }));
      }

      setStatus('success');
      setMessage('Your email has been verified successfully!');
    } catch (err: any) {
      setStatus('error');
      setMessage(err.response?.data?.message || 'Verification failed. Please try again.');
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0 || isResending) return;

    setIsResending(true);
    try {
      await authApi.resendVerification(email);
      setResendCooldown(60);
      setOtp(['', '', '', '', '', '']);
      setStatus('idle');
      setMessage('');
      inputRefs.current[0]?.focus();
    } catch (err: any) {
      setMessage(err.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setIsResending(false);
    }
  };

  // Auto-submit when all 6 digits are entered
  useEffect(() => {
    const otpCode = otp.join('');
    if (otpCode.length === 6 && status !== 'loading' && status !== 'success') {
      handleVerify();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otp]);

  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-nexus-bg relative overflow-hidden p-4">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="orb orb-purple w-[600px] h-[600px] top-[-10%] left-[-10%] opacity-30 blur-[100px] animate-pulse-slow" />
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md relative z-10"
        >
          <div className="glass rounded-3xl p-8 border border-nexus-border shadow-2xl backdrop-blur-xl bg-black/40 text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/20">
              <XCircle className="w-10 h-10 text-red-400" />
            </div>
            <h2 className="text-2xl font-bold text-nexus-text mb-4">Missing Email</h2>
            <p className="text-nexus-text-secondary mb-6">
              Please register first to receive your verification code.
            </p>
            <Link href="/register">
              <Button variant="ghost" className="w-full h-12 border border-nexus-border bg-transparent text-nexus-text hover:bg-nexus-glass transition-all">
                Go to Register
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-nexus-bg relative overflow-hidden p-4">
      {/* Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="orb orb-purple w-[600px] h-[600px] top-[-10%] left-[-10%] opacity-30 blur-[100px] animate-pulse-slow" />
        <div className="orb orb-cyan w-[600px] h-[600px] bottom-[-10%] right-[-10%] opacity-30 blur-[100px] animate-pulse-slow delay-1000" />
      </div>
      <div className="absolute inset-0 grid-overlay opacity-20 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <Link
          href="/register"
          className="inline-flex items-center mb-6 text-nexus-text-secondary hover:text-nexus-purple transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Register
        </Link>

        <div className="glass rounded-3xl p-8 border border-nexus-border shadow-2xl shadow-purple-500/10 backdrop-blur-xl bg-black/40">
          {status === 'success' ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', duration: 0.5 }}
                className="w-20 h-20 mx-auto mb-6 bg-green-500/10 rounded-full flex items-center justify-center border border-green-500/20 shadow-glow-green"
              >
                <CheckCircle className="w-10 h-10 text-green-400" />
              </motion.div>
              <h2 className="text-2xl font-bold text-green-400 mb-4">Email Verified!</h2>
              <p className="text-nexus-text-secondary mb-6">{message}</p>

              <Button
                onClick={() => window.location.href = '/dashboard'}
                variant="ghost"
                className="w-full h-12 text-base font-semibold border border-green-500/30 bg-green-500/10 text-green-400 hover:bg-green-500/20 hover:border-green-500/50 transition-all"
              >
                Go to Dashboard
              </Button>
            </motion.div>
          ) : (
            <>
              {/* Header */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 mx-auto mb-6 bg-nexus-purple/10 rounded-2xl flex items-center justify-center border border-nexus-purple/20">
                  <Mail className="w-8 h-8 text-nexus-purple" />
                </div>
                <h2 className="text-2xl font-bold text-nexus-text mb-2">Verify Your Email</h2>
                <p className="text-nexus-text-secondary text-sm">
                  We sent a 6-digit code to
                </p>
                <p className="text-nexus-purple font-medium mt-1">{email}</p>
              </div>

              {/* OTP Input Boxes */}
              <div className="flex justify-center gap-3 mb-6" onPaste={handlePaste}>
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => { inputRefs.current[index] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className={`w-12 h-14 text-center text-2xl font-bold rounded-xl border-2 transition-all duration-200 bg-nexus-glass text-nexus-text outline-none
                      ${status === 'error' 
                        ? 'border-red-500/50 focus:border-red-500' 
                        : 'border-nexus-border focus:border-nexus-purple hover:border-nexus-border/80'
                      }
                      focus:ring-2 focus:ring-nexus-purple/20
                    `}
                    disabled={status === 'loading'}
                  />
                ))}
              </div>

              {/* Error Message */}
              {status === 'error' && message && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm text-center flex items-center justify-center gap-2"
                >
                  <XCircle className="w-4 h-4 flex-shrink-0" />
                  {message}
                </motion.div>
              )}

              {/* Loading state */}
              {status === 'loading' && (
                <div className="flex items-center justify-center gap-2 mb-4 text-nexus-text-secondary">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Verifying...</span>
                </div>
              )}

              {/* Verify Button */}
              <Button
                variant="ghost"
                className="w-full h-12 text-base font-semibold border border-nexus-border bg-transparent text-nexus-text hover:bg-nexus-glass hover:border-white/40 transition-all mb-6"
                onClick={handleVerify}
                disabled={status === 'loading' || otp.join('').length !== 6}
              >
                {status === 'loading' ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  'Verify Email'
                )}
              </Button>

              {/* Resend Section */}
              <div className="text-center pt-4 border-t border-nexus-border">
                <p className="text-nexus-text-muted text-sm mb-3">Didn't receive the code?</p>
                {resendCooldown > 0 ? (
                  <p className="text-nexus-text-secondary text-sm">
                    Resend in <span className="text-nexus-purple font-medium">{resendCooldown}s</span>
                  </p>
                ) : (
                  <button
                    onClick={handleResend}
                    disabled={isResending}
                    className="inline-flex items-center gap-2 text-nexus-purple hover:text-nexus-cyan transition-colors text-sm font-medium disabled:opacity-50"
                  >
                    {isResending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <RefreshCw className="w-4 h-4" />
                    )}
                    Resend OTP
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-nexus-bg">
        <div className="w-16 h-16 bg-nexus-glass rounded-full flex items-center justify-center border border-nexus-border">
          <Loader2 className="w-8 h-8 text-nexus-purple animate-spin" />
        </div>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}
