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
  // Engineering (FSIT)
  { value: 'CSE', label: 'Computer Science and Engineering' },
  { value: 'SWE', label: 'Software Engineering' },
  { value: 'CIS', label: 'Computing and Information System' },
  { value: 'MCT', label: 'Multimedia & Creative Technology' },
  { value: 'ICE', label: 'Information and Communication Engineering' },
  { value: 'EEE', label: 'Electrical and Electronic Engineering' },
  { value: 'TE', label: 'Textile Engineering' },
  { value: 'CE', label: 'Civil Engineering' },
  { value: 'ARCH', label: 'Architecture' },
  { value: 'ESDM', label: 'Environmental Science and Disaster Management' },
  { value: 'ITM', label: 'Information Technology & Management' },
  { value: 'RME', label: 'Robotics and Mechatronics Engineering' }, // From text
  { value: 'ICTE', label: 'ICT Education' }, // From text

  // Business (FBE)
  { value: 'DBA', label: 'Business Administration' },
  { value: 'ACC', label: 'Accounting' },
  { value: 'MKT', label: 'Marketing' },
  { value: 'F&B', label: 'Finance & Banking' },
  { value: 'MGT', label: 'Management' },
  { value: 'THM', label: 'Tourism & Hospitality Management' },
  { value: 'RE', label: 'Real Estate' },
  { value: 'IE', label: 'Innovation & Entrepreneurship' },

  // Allied Health (FAHS)
  { value: 'PHARM', label: 'Pharmacy' },
  { value: 'NFE', label: 'Nutrition and Food Engineering' },
  { value: 'PH', label: 'Public Health' },
  { value: 'GEB', label: 'Genetic Engineering and Biotechnology' },
  { value: 'PESS', label: 'Physical Education & Sports Science' },
  { value: 'AGRI', label: 'Agricultural Science' },

  // Humanities & Social Science (FHSS)
  { value: 'ENG', label: 'English' },
  { value: 'LAW', label: 'Law' },
  { value: 'JMC', label: 'Journalism, Media and Communication' },
  { value: 'DS', label: 'Development Studies' },
  { value: 'ISLM', label: 'Information Science and Library Management' },

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
      <div className="min-h-screen flex items-center justify-center bg-nexus-bg relative overflow-hidden py-12 px-4 sm:px-6 lg:px-8">
        {/* Background Orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="orb orb-green w-[600px] h-[600px] top-[-10%] left-[-10%] opacity-30 blur-[100px] animate-pulse-slow" />
          <div className="orb orb-cyan w-[600px] h-[600px] bottom-[-10%] right-[-10%] opacity-30 blur-[100px] animate-pulse-slow delay-1000" />
        </div>

        {/* Grid Overlay */}
        <div className="absolute inset-0 grid-overlay opacity-20 pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full relative z-10"
        >
          <div className="glass rounded-3xl p-8 border border-nexus-border shadow-2xl shadow-green-500/10 backdrop-blur-xl bg-black/40 text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-green-500/10 rounded-full flex items-center justify-center border border-green-500/20 shadow-glow-green">
              <Mail className="w-10 h-10 text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-nexus-text mb-4">Check Your Email!</h2>
            <p className="text-nexus-text-secondary mb-6">
              We've sent a verification link to your DIU email. Please click the link to verify
              your account and complete registration.
            </p>
            <div className="p-4 rounded-xl bg-nexus-glass border border-nexus-border mb-8">
              <p className="text-sm text-nexus-text-muted">
                After verification, you'll receive your unique AI Club Member ID!
              </p>
            </div>
            <Link href="/login" className="block w-full">
              <Button
                variant="ghost"
                className="w-full h-12 text-base font-semibold border border-green-500/30 bg-green-500/10 text-green-400 hover:bg-green-500/20 hover:border-green-500/50 transition-all"
              >
                Go to Login
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-nexus-bg relative overflow-hidden py-12 px-4 sm:px-6 lg:px-8">
      {/* Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="orb orb-purple w-[800px] h-[800px] top-[-20%] right-[-20%] opacity-30 blur-[100px] animate-pulse-slow" />
        <div className="orb orb-blue w-[800px] h-[800px] bottom-[-20%] left-[-20%] opacity-30 blur-[100px] animate-pulse-slow delay-1000" />
      </div>

      {/* Grid Overlay */}
      <div className="absolute inset-0 grid-overlay opacity-20 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl relative z-10"
      >
        <Link
          href="/"
          className="inline-flex items-center mb-8 text-nexus-text-secondary hover:text-nexus-purple transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        <div className="glass rounded-3xl p-8 md:p-10 border border-nexus-border shadow-2xl shadow-purple-500/10 backdrop-blur-xl bg-nexus-bg/40">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-purple-500/20 bg-nexus-gradient">
              AI
            </div>
            <h2 className="text-3xl font-display font-bold text-nexus-text mb-2">Join the Club</h2>
            <p className="text-nexus-text-secondary">
              Create your Daffodil AI Club membership account
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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

            <div className="grid md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <Input
                  type="text"
                  label="Full Name"
                  placeholder="Enter your full name"
                  leftIcon={<User className="w-5 h-5" />}
                  error={errors.name?.message}
                  {...register('name')}
                  className="bg-nexus-glass border-nexus-border focus:border-nexus-purple/50 hover:border-nexus-border transition-all"
                />
              </div>

              <div className="md:col-span-2">
                <Input
                  type="email"
                  label="DIU Email"
                  placeholder="yourname@diu.edu.bd"
                  leftIcon={<Mail className="w-5 h-5" />}
                  error={errors.email?.message}
                  {...register('email')}
                  className="bg-nexus-glass border-nexus-border focus:border-nexus-purple/50 hover:border-nexus-border transition-all"
                />
              </div>

              <Input
                type={showPassword ? 'text' : 'password'}
                label="Password"
                placeholder="Min 6 characters"
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

              <Input
                type={showPassword ? 'text' : 'password'}
                label="Confirm Password"
                placeholder="Repeat password"
                leftIcon={<Lock className="w-5 h-5" />}
                error={errors.confirmPassword?.message}
                {...register('confirmPassword')}
                className="bg-nexus-glass border-nexus-border focus:border-nexus-purple/50 hover:border-nexus-border transition-all"
              />

              <div className="md:col-span-2">
                <Input
                  type="tel"
                  label="Phone Number"
                  placeholder="+8801XXXXXXXXX"
                  leftIcon={<Phone className="w-5 h-5" />}
                  error={errors.phone?.message}
                  {...register('phone')}
                  className="bg-nexus-glass border-nexus-border focus:border-nexus-purple/50 hover:border-nexus-border transition-all"
                />
              </div>

              <div className="md:col-span-2">
                <Input
                  type="text"
                  label="Student ID"
                  placeholder="e.g., 211-15-XXXX"
                  leftIcon={<GraduationCap className="w-5 h-5" />}
                  error={errors.studentId?.message}
                  {...register('studentId')}
                  className="bg-nexus-glass border-nexus-border focus:border-nexus-purple/50 hover:border-nexus-border transition-all"
                />
              </div>

              <Select
                label="Department"
                error={errors.department?.message}
                {...register('department')}
                options={[
                  { value: '', label: 'Select Department' },
                  ...departments
                ]}
                className="bg-nexus-glass border-nexus-border focus:border-nexus-purple/50 hover:border-nexus-border transition-all text-nexus-text"
              />

              <Input
                type="text"
                label="Batch"
                placeholder="e.g., 54"
                leftIcon={<BookOpen className="w-5 h-5" />}
                error={errors.batch?.message}
                {...register('batch')}
                className="bg-nexus-glass border-nexus-border focus:border-nexus-purple/50 hover:border-nexus-border transition-all"
              />
            </div>

            <div className="pt-2">
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  required
                  className="w-4 h-4 mt-1 rounded border-nexus-border bg-nexus-glass text-nexus-purple focus:ring-[#7B61FF] focus:ring-offset-0"
                />
                <span className="text-sm text-nexus-text-secondary group-hover:text-nexus-text transition-colors">
                  I agree to the{' '}
                  <Link href="/terms" className="text-nexus-purple hover:text-nexus-pink hover:underline transition-colors">
                    Terms & Conditions
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="text-nexus-purple hover:text-nexus-pink hover:underline transition-colors">
                    Privacy Policy
                  </Link>
                </span>
              </label>
            </div>

            <Button
              type="submit"
              variant="ghost"
              className="w-full h-12 text-base font-semibold border border-nexus-border bg-transparent text-nexus-text hover:bg-nexus-glass hover:border-white/40 hover:scale-[1.01] transition-all relative overflow-hidden group shadow-none"
              isLoading={isLoading}
            >
              <span className="flex items-center gap-2">
                <UserPlus className="w-5 h-5" />
                Create Account
              </span>
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-nexus-border text-center">
            <p className="text-nexus-text-secondary">
              Already have an account?{' '}
              <Link href="/login" className="text-nexus-text hover:text-nexus-cyan font-medium transition-colors hover:underline decoration-[#6EF3FF]/30">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
