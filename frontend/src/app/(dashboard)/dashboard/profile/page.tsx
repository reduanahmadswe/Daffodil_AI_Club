'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Phone,
  GraduationCap,
  BookOpen,
  Camera,
  Save,
  Loader2
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Textarea, Select } from '@/components/ui/Input';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks';
import { updateUser as updateUserAction } from '@/lib/redux/slices/authSlice';
import { authApi } from '@/lib/api';

const departments = [
  { value: 'CSE', label: 'Computer Science & Engineering' },
  { value: 'SWE', label: 'Software Engineering' },
  { value: 'EEE', label: 'Electrical & Electronic Engineering' },
  { value: 'ETE', label: 'Electronics & Telecommunication Engineering' },
  { value: 'MCT', label: 'Multimedia & Creative Technology' },
  { value: 'CIS', label: 'Computing & Information System' },
  { value: 'BBA', label: 'Business Administration' },
];

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: user?.name || '',
      phone: user?.phone || '',
      department: user?.department || '',
      batch: user?.batch || '',
      bio: user?.bio || '',
    }
  });

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await authApi.updateProfile(data);
      dispatch(updateUserAction(response.data));
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update profile' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white">
          My Profile
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Manage your account information and preferences
        </p>
      </div>

      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card variant="gradient" className="overflow-visible">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="relative">
                <Avatar
                  src={user?.profileImage}
                  name={user?.name || ''}
                  size="xl"
                  className="w-32 h-32 text-4xl"
                />
                <button className="absolute bottom-0 right-0 w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-primary-700 transition-colors">
                  <Camera className="w-5 h-5" />
                </button>
              </div>
              <div className="text-center md:text-left text-white">
                <h2 className="text-2xl font-bold">{user?.name}</h2>
                <p className="text-white/80">{user?.email}</p>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mt-3">
                  <Badge color="white" className="bg-white/20 text-white">
                    {user?.uniqueId}
                  </Badge>
                  <Badge color="green" className="bg-white/20 text-white">
                    {user?.membershipStatus || 'Active'}
                  </Badge>
                  <Badge color="blue" className="bg-white/20 text-white">
                    {user?.role}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Profile Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Update your personal details</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {message.text && (
                <div className={`p-4 rounded-lg ${message.type === 'success'
                  ? 'bg-green-50 text-green-600 dark:bg-green-900/20'
                  : 'bg-red-50 text-red-600 dark:bg-red-900/20'
                  }`}>
                  {message.text}
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-6">
                <Input
                  type="text"
                  label="Full Name"
                  placeholder="Your full name"
                  leftIcon={<User className="w-5 h-5" />}
                  error={errors.name?.message}
                  {...register('name', { required: 'Name is required' })}
                />

                <Input
                  type="email"
                  label="Email"
                  value={user?.email || ''}
                  leftIcon={<Mail className="w-5 h-5" />}
                  disabled
                  className="bg-gray-50"
                />

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
                  value={user?.studentId || ''}
                  leftIcon={<GraduationCap className="w-5 h-5" />}
                  disabled
                  className="bg-gray-50"
                />

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

              <Textarea
                label="Bio"
                placeholder="Tell us about yourself..."
                rows={4}
                {...register('bio')}
              />

              <div className="flex justify-end">
                <Button type="submit" variant="primary" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      {/* Account Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>Your membership details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800">
                <p className="text-sm text-gray-500 mb-1">Member ID</p>
                <p className="font-mono font-bold text-primary-600">{user?.uniqueId}</p>
              </div>
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800">
                <p className="text-sm text-gray-500 mb-1">Membership Status</p>
                <p className="font-bold text-green-600">{user?.membershipStatus || 'Active'}</p>
              </div>
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800">
                <p className="text-sm text-gray-500 mb-1">Member Since</p>
                <p className="font-bold text-gray-900 dark:text-white">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric', month: 'long', day: 'numeric'
                  } as const) : 'N/A'}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800">
                <p className="text-sm text-gray-500 mb-1">Role</p>
                <p className="font-bold text-gray-900 dark:text-white">{user?.role}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
