'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, LogIn, ArrowLeft } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { authApi } from '@/lib/api';
import { useAuthStore } from '@/lib/store';

const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email format')
    .refine((email) => email.endsWith('@diu.edu.bd'), {
      message: 'Must be a valid DIU email (@diu.edu.bd)',
    }),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError('');

    try {
      const response = await authApi.login(data);
      login(response.data.user, response.data.token);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-nexus-bg relative overflow-hidden py-12 px-4 sm:px-6 lg:px-8">
      {/* Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="orb orb-purple w-[600px] h-[600px] top-[-10%] left-[-10%] opacity-40 blur-[100px] animate-pulse-slow" />
        <div className="orb orb-cyan w-[600px] h-[600px] bottom-[-10%] right-[-10%] opacity-40 blur-[100px] animate-pulse-slow delay-1000" />
      </div>

      {/* Grid Overlay */}
      <div className="absolute inset-0 grid-overlay opacity-20 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <Link
          href="/"
          className="inline-flex items-center mb-8 text-nexus-text-secondary hover:text-nexus-purple transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        <div className="glass rounded-3xl p-8 border border-nexus-border shadow-2xl shadow-purple-500/10 backdrop-blur-xl bg-nexus-bg/40">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-purple-500/20 bg-nexus-gradient">
              AI
            </div>
            <h2 className="text-3xl font-display font-bold text-nexus-text mb-2">Welcome Back!</h2>
            <p className="text-nexus-text-secondary">
              Sign in to your Daffodil AI Club account
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-200 text-sm flex items-center gap-2"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                {error}
              </motion.div>
            )}

            <div className="space-y-4">
              <Input
                type="email"
                label="DIU Email"
                placeholder="yourname@diu.edu.bd"
                leftIcon={<Mail className="w-5 h-5" />}
                error={errors.email?.message}
                {...register('email')}
                className="bg-nexus-glass border-nexus-border focus:border-nexus-purple/50 hover:border-nexus-border transition-all"
              />

              <Input
                type={showPassword ? 'text' : 'password'}
                label="Password"
                placeholder="Enter your password"
                leftIcon={<Lock className="w-5 h-5" />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-nexus-text transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                }
                error={errors.password?.message}
                {...register('password')}
                className="bg-nexus-glass border-nexus-border focus:border-nexus-purple/50 hover:border-nexus-border transition-all"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-nexus-border bg-nexus-glass text-nexus-purple focus:ring-[#7B61FF] focus:ring-offset-0"
                />
                <span className="text-sm text-nexus-text-secondary group-hover:text-nexus-text transition-colors">Remember me</span>
              </label>
              <Link
                href="/forgot-password"
                className="text-sm text-nexus-purple hover:text-nexus-pink transition-colors font-medium"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              variant="ghost"
              className="w-full h-12 text-base font-semibold border border-nexus-border bg-transparent text-nexus-text hover:bg-nexus-glass hover:border-white/40 hover:scale-[1.01] transition-all relative overflow-hidden group shadow-none"
              isLoading={isLoading}
            >
              <span className="flex items-center gap-2">
                <LogIn className="w-5 h-5" />
                Sign In
              </span>
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-nexus-border text-center">
            <p className="text-nexus-text-secondary">
              Don't have an account?{' '}
              <Link href="/register" className="text-nexus-text hover:text-nexus-cyan font-medium transition-colors hover:underline decoration-[#6EF3FF]/30">
                Join the Club
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
