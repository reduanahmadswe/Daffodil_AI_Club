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
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <Link
            href="/"
            className="inline-flex items-center text-gray-600 hover:text-primary-600 mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>

          <Card>
            <CardHeader className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center text-white font-bold text-2xl">
                AI
              </div>
              <CardTitle className="text-2xl">Welcome Back!</CardTitle>
              <CardDescription>
                Sign in to your Daffodil AI Club account
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {error && (
                  <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm">
                    {error}
                  </div>
                )}

                <Input
                  type="email"
                  label="DIU Email"
                  placeholder="yourname@diu.edu.bd"
                  leftIcon={<Mail className="w-5 h-5" />}
                  error={errors.email?.message}
                  {...register('email')}
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
                      className="text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  }
                  error={errors.password?.message}
                  {...register('password')}
                />

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-600">Remember me</span>
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-sm text-primary-600 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  className="w-full"
                  isLoading={isLoading}
                >
                  <LogIn className="w-5 h-5 mr-2" />
                  Sign In
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-gray-600">
                  Don't have an account?{' '}
                  <Link href="/register" className="text-primary-600 font-medium hover:underline">
                    Join the Club
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Right Side - Decorative */}
      <div className="hidden lg:flex flex-1 items-center justify-center bg-gradient-to-br from-primary-500 via-secondary-500 to-pink-500 relative overflow-hidden">
        <div className="absolute inset-0 pattern-grid opacity-10" />
        
        {/* Floating Elements */}
        <motion.div
          animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
          className="absolute top-1/4 left-1/4 w-20 h-20 bg-white/10 rounded-2xl backdrop-blur-sm"
        />
        <motion.div
          animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-1/3 right-1/4 w-32 h-32 bg-white/10 rounded-full backdrop-blur-sm"
        />
        
        <div className="relative text-center text-white p-12">
          <h2 className="text-4xl font-display font-bold mb-6">
            Daffodil AI Club
          </h2>
          <p className="text-xl text-white/80 max-w-md">
            Login to access your personalized dashboard, view your events, and download your AI Club ID card.
          </p>
        </div>
      </div>
    </div>
  );
}
