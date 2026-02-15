'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import {
  ArrowLeft,
  Mail,
  Phone,
  GraduationCap,
  Hash,
  Shield,
  Award,
  Calendar,
  CheckCircle,
  XCircle,
  Loader2,
  Save
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { membersApi } from '@/lib/api';
import { useAppDispatch } from '@/lib/redux/hooks';
import { addNotification } from '@/lib/redux/slices/notificationSlice';

const roleColors = {
  ADMIN: 'red',
  EXECUTIVE: 'purple',
  MEMBER: 'blue',
  VISITOR: 'gray',
} as const;

const roleOptions = ['VISITOR', 'MEMBER', 'EXECUTIVE', 'ADMIN'];

interface MemberDetail {
  id: string;
  uniqueId: string;
  name: string;
  email: string;
  phone?: string;
  department?: string;
  batch?: string;
  studentId?: string;
  profileImage?: string;
  role: string;
  isVerified: boolean;
  points: number;
  createdAt: string;
  updatedAt?: string;
}

export default function MemberDetailPage() {
  const router = useRouter();
  const params = useParams();
  const dispatch = useAppDispatch();
  const [member, setMember] = useState<MemberDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState('');
  const [isUpdatingRole, setIsUpdatingRole] = useState(false);

  useEffect(() => {
    const fetchMember = async () => {
      try {
        const response = await membersApi.getById(params.id as string);
        const data = response.data.data || response.data;
        setMember(data);
        setSelectedRole(data.role);
      } catch (error) {
        dispatch(addNotification({ message: 'Failed to load member details', type: 'error' }));
        router.push('/admin/members');
      } finally {
        setIsLoading(false);
      }
    };
    if (params.id) fetchMember();
  }, [params.id, dispatch, router]);

  const handleRoleUpdate = async () => {
    if (!member || selectedRole === member.role) return;
    setIsUpdatingRole(true);
    try {
      await membersApi.updateRole(member.id, selectedRole);
      setMember({ ...member, role: selectedRole });
      dispatch(addNotification({ message: `Role updated to ${selectedRole}`, type: 'success' }));
    } catch (error: any) {
      dispatch(addNotification({ message: error.response?.data?.message || 'Failed to update role', type: 'error' }));
      setSelectedRole(member.role);
    } finally {
      setIsUpdatingRole(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    );
  }

  if (!member) return null;

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/members" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 mb-4">
          <ArrowLeft className="w-4 h-4" />
          Back to Members
        </Link>
        <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-nexus-text">Member Details</h1>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <Avatar
                src={member.profileImage}
                alt={member.name}
                size="xl"
              />
              <h2 className="mt-4 text-xl font-bold text-gray-900 dark:text-nexus-text">{member.name}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">{member.uniqueId}</p>
              <div className="mt-3 flex items-center gap-2">
                <Badge color={roleColors[member.role as keyof typeof roleColors] || 'gray'}>{member.role}</Badge>
                {member.isVerified ? (
                  <Badge color="green" className="flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Verified</Badge>
                ) : (
                  <Badge color="yellow" className="flex items-center gap-1"><XCircle className="w-3 h-3" /> Unverified</Badge>
                )}
              </div>
              <div className="mt-4 flex items-center gap-2 text-primary-500">
                <Award className="w-5 h-5" />
                <span className="text-lg font-bold">{member.points}</span>
                <span className="text-sm text-gray-500">points</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Info Cards */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader><CardTitle>Contact Information</CardTitle></CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-nexus-text">{member.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Phone</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-nexus-text">{member.phone || 'Not provided'}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Academic Information</CardTitle></CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                  <GraduationCap className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Department</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-nexus-text">{member.department || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Batch</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-nexus-text">{member.batch || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                  <Hash className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Student ID</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-nexus-text">{member.studentId || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle><Shield className="w-5 h-5 inline mr-2" />Role Management</CardTitle></CardHeader>
            <CardContent>
              <div className="flex items-end gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Change Role</label>
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-nexus-text focus:ring-2 focus:ring-primary-500"
                  >
                    {roleOptions.map((role) => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </div>
                <Button
                  onClick={handleRoleUpdate}
                  disabled={selectedRole === member.role}
                  isLoading={isUpdatingRole}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Update Role
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Timestamps</CardTitle></CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                  <p className="text-xs text-gray-500">Joined</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-nexus-text">
                    {new Date(member.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
                {member.updatedAt && (
                  <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                    <p className="text-xs text-gray-500">Last Updated</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-nexus-text">
                      {new Date(member.updatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
