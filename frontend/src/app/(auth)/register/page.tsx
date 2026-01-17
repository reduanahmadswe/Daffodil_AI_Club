'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, User, Phone, GraduationCap, BookOpen, ArrowLeft, UserPlus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { authApi } from '@/lib/api';

const registerSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email format')
    .refine((email) => email.endsWith('@diu.edu.bd'), {
      message: 'Must be a valid DIU email (@diu.edu.bd)',
    }),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  phone: z.string().regex(/^(\+88)?01[3-9]\d{8}$/, 'Invalid Bangladeshi phone number'),
  studentId: z.string().min(10, 'Student ID is required'),
  department: z.string().min(1, 'Department is required'),
  batch: z.string().min(1, 'Batch is required'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

const departments = [
  { value: 'CSE', label: 'Computer Science & Engineering' },
  { value: 'SWE', label: 'Software Engineering' },
  { value: 'EEE', label: 'Electrical & Electronic Engineering' },
  { value: 'ETE', label: 'Electronics & Telecommunication Engineering' },
  { value: 'MCT', label: 'Multimedia & Creative Technology' },
  { value: 'CIS', label: 'Computing & Information System' },
  { value: 'BBA', label: 'Business Administration' },
  { value: 'LLB', label: 'Law' },
  { value: 'PHARMACY', label: 'Pharmacy' },
  { value: 'OTHERS', label: 'Others' },
];

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setError('');

    try {
      await authApi.register(data);
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8" style={{ background: '#000000' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full"
        >
          <Card className="text-center">
            <CardContent className="p-8">
              <div className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
                <Mail className="w-10 h-10 text-green-600" />
              </div>
              <CardTitle className="text-2xl mb-4">Check Your Email!</CardTitle>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                We've sent a verification link to your DIU email. Please click the link to verify 
                your account and complete registration.
              </p>
              <p className="text-sm text-gray-500 mb-8">
                After verification, you'll receive your unique AI Club Member ID!
              </p>
              <Link href="/login">
                <Button variant="primary" className="w-full">
                  Go to Login
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Decorative */}
      <div className="hidden lg:flex flex-1 items-center justify-center bg-gradient-to-br from-primary-500 via-secondary-500 to-pink-500 relative overflow-hidden">
        <div className="absolute inset-0 pattern-grid opacity-10" />
        
        {/* Floating Elements */}
        <motion.div
          animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
          className="absolute top-1/4 right-1/4 w-20 h-20 bg-white/10 rounded-2xl backdrop-blur-sm"
        />
        <motion.div
          animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute bottom-1/3 left-1/4 w-32 h-32 bg-white/10 rounded-full backdrop-blur-sm"
        />
        
        <div className="relative text-center text-white p-12">
          <h2 className="text-4xl font-display font-bold mb-6">
            Join Daffodil AI Club
          </h2>
          <p className="text-xl text-white/80 max-w-md mb-8">
            Become a member and get your unique ID like:
          </p>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 inline-block">
            <p className="text-2xl font-mono font-bold">DAIC-SPRING-00142</p>
            <p className="text-sm text-white/70 mt-2">Your Unique Member ID</p>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-lg"
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
              <CardTitle className="text-2xl">Join the Club</CardTitle>
              <CardDescription>
                Create your Daffodil AI Club membership account
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {error && (
                  <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm">
                    {error}
                  </div>
                )}

                <Input
                  type="text"
                  label="Full Name"
                  placeholder="Enter your full name"
                  leftIcon={<User className="w-5 h-5" />}
                  error={errors.name?.message}
                  {...register('name')}
                />

                <Input
                  type="email"
                  label="DIU Email"
                  placeholder="yourname@diu.edu.bd"
                  leftIcon={<Mail className="w-5 h-5" />}
                  error={errors.email?.message}
                  {...register('email')}
                />

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    label="Password"
                    placeholder="Min 6 characters"
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

                  <Input
                    type={showPassword ? 'text' : 'password'}
                    label="Confirm Password"
                    placeholder="Repeat password"
                    leftIcon={<Lock className="w-5 h-5" />}
                    error={errors.confirmPassword?.message}
                    {...register('confirmPassword')}
                  />
                </div>

                <Input
                  type="tel"
                  label="Phone Number"
                  placeholder="+8801XXXXXXXXX"
                  leftIcon={<Phone className="w-5 h-5" />}
                  error={errors.phone?.message}
                  {...register('phone')}
                />

                <Input
                  type="text"
                  label="Student ID"
                  placeholder="e.g., 211-15-XXXX"
                  leftIcon={<GraduationCap className="w-5 h-5" />}
                  error={errors.studentId?.message}
                  {...register('studentId')}
                />

                <div className="grid grid-cols-2 gap-4">
                  <Select
                    label="Department"
                    error={errors.department?.message}
                    {...register('department')}
                  >
                    <option value="">Select Department</option>
                    {departments.map((dept) => (
                      <option key={dept.value} value={dept.value}>
                        {dept.label}
                      </option>
                    ))}
                  </Select>

                  <Input
                    type="text"
                    label="Batch"
                    placeholder="e.g., 54"
                    leftIcon={<BookOpen className="w-5 h-5" />}
                    error={errors.batch?.message}
                    {...register('batch')}
                  />
                </div>

                <div className="pt-2">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      required
                      className="w-4 h-4 mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-600">
                      I agree to the{' '}
                      <Link href="/terms" className="text-primary-600 hover:underline">
                        Terms & Conditions
                      </Link>{' '}
                      and{' '}
                      <Link href="/privacy" className="text-primary-600 hover:underline">
                        Privacy Policy
                      </Link>
                    </span>
                  </label>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  className="w-full"
                  isLoading={isLoading}
                >
                  <UserPlus className="w-5 h-5 mr-2" />
                  Create Account
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-gray-600">
                  Already have an account?{' '}
                  <Link href="/login" className="text-primary-600 font-medium hover:underline">
                    Sign In
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
