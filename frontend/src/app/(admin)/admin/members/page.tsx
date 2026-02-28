'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { 
  Users, 
  Search, 
  Plus,
  Download,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Avatar } from '@/components/ui/Avatar';
import { Modal, ModalHeader, ModalBody, ModalFooter } from '@/components/ui/Modal';
import { adminApi } from '@/lib/api';

interface Member {
  id: string;
  uniqueId?: string | null;
  name: string;
  email: string;
  department?: string;
  batch?: string;
  role: string;
  isVerified: boolean;
  points: number;
  phone?: string;
  studentId?: string;
  createdAt: string;
}

const roleColors = {
  ADMIN: 'red',
  EXECUTIVE: 'purple',
  MEMBER: 'blue',
  VISITOR: 'gray',
} as const;

export default function AdminMembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [stats, setStats] = useState({ total: 0, verified: 0, pending: 0, executives: 0 });

  const fetchMembers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await adminApi.getMembers({ search, role: roleFilter !== 'All' ? roleFilter : undefined });
      const data = response.data;
      const membersList = data.data || data.members || data;
      if (Array.isArray(membersList)) {
        setMembers(membersList);
        // Calculate stats from data
        const total = data.total || data.pagination?.total || membersList.length;
        const verified = membersList.filter((m: Member) => m.isVerified).length;
        const pending = membersList.filter((m: Member) => !m.isVerified).length;
        const executives = membersList.filter((m: Member) => m.role === 'EXECUTIVE' || m.role === 'ADMIN').length;
        setStats({ total, verified, pending, executives });
      }
    } catch (error) {
      console.error('Failed to fetch members:', error);
    } finally {
      setLoading(false);
    }
  }, [search, roleFilter]);

  useEffect(() => {
    const debounce = setTimeout(() => fetchMembers(), 300);
    return () => clearTimeout(debounce);
  }, [fetchMembers]);

  const handleDelete = async () => {
    if (!selectedMember) return;
    setIsDeleting(true);
    try {
      await adminApi.deleteMember(selectedMember.id);
      setMembers((prev) => prev.filter((m) => m.id !== selectedMember.id));
      setIsDeleteModalOpen(false);
      setSelectedMember(null);
    } catch (error) {
      console.error('Failed to delete member:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleRoleChange = async (memberId: string, newRole: string) => {
    try {
      await adminApi.updateMemberRole(memberId, newRole);
      setMembers((prev) =>
        prev.map((m) => (m.id === memberId ? { ...m, role: newRole } : m))
      );
    } catch (error) {
      console.error('Failed to update role:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-nexus-text flex items-center gap-3">
            <Users className="w-8 h-8 text-primary-500" />
            Members Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage club members, roles, and permissions
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Link href="/admin/members/add">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Member
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-nexus-text">{stats.total}</p>
                <p className="text-sm text-gray-500">Total Members</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-nexus-text">{stats.verified}</p>
                <p className="text-sm text-gray-500">Verified</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-nexus-text">{stats.pending}</p>
                <p className="text-sm text-gray-500">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-nexus-text">{stats.executives}</p>
                <p className="text-sm text-gray-500">Executives</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters & Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                type="search"
                placeholder="Search by name, email, or ID..."
                leftIcon={<Search className="w-5 h-5" />}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <select 
                className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-nexus-text"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="All">All Roles</option>
                <option value="ADMIN">Admin</option>
                <option value="EXECUTIVE">Executive</option>
                <option value="MEMBER">Member</option>
              </select>
              <Button variant="outline" size="sm" onClick={() => fetchMembers()}>
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Members Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left p-4 font-medium text-gray-500">Member</th>
                  <th className="text-left p-4 font-medium text-gray-500">Unique ID</th>
                  <th className="text-left p-4 font-medium text-gray-500">Department</th>
                  <th className="text-left p-4 font-medium text-gray-500">Role</th>
                  <th className="text-left p-4 font-medium text-gray-500">Status</th>
                  <th className="text-left p-4 font-medium text-gray-500">Joined</th>
                  <th className="text-right p-4 font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center">
                      <Loader2 className="w-6 h-6 animate-spin text-gray-400 mx-auto" />
                      <p className="text-sm text-gray-500 mt-2">Loading members...</p>
                    </td>
                  </tr>
                ) : members.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-gray-500">
                      No members found
                    </td>
                  </tr>
                ) : (
                  members.map((member) => (
                  <tr 
                    key={member.id}
                    className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar name={member.name} size="sm" />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-nexus-text">{member.name}</p>
                          <p className="text-sm text-gray-500">{member.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <code className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 text-sm font-mono">
                        {member.uniqueId || 'N/A'}
                      </code>
                    </td>
                    <td className="p-4">
                      <span className="text-gray-900 dark:text-nexus-text">{member.department || '-'}</span>
                      {member.batch && <span className="text-gray-500 ml-1">({member.batch})</span>}
                    </td>
                    <td className="p-4">
                      <select
                        value={member.role}
                        onChange={(e) => handleRoleChange(member.id, e.target.value)}
                        className="px-2 py-1 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-nexus-text"
                      >
                        <option value="MEMBER">MEMBER</option>
                        <option value="EXECUTIVE">EXECUTIVE</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                    </td>
                    <td className="p-4">
                      <Badge color={member.isVerified ? 'green' : 'yellow'} size="sm">
                        {member.isVerified ? 'VERIFIED' : 'PENDING'}
                      </Badge>
                    </td>
                    <td className="p-4 text-gray-500">
                      {new Date(member.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-1">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="p-2"
                          onClick={() => {
                            setSelectedMember(member);
                            setIsViewModalOpen(true);
                          }}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="p-2 text-red-500 hover:text-red-600"
                          onClick={() => {
                            setSelectedMember(member);
                            setIsDeleteModalOpen(true);
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between p-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500">
              Showing {members.length} members
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled>Previous</Button>
              <Button variant="outline" size="sm">Next</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* View Member Modal */}
      <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} size="md">
        {selectedMember && (
          <>
            <ModalHeader>
              Member Details
            </ModalHeader>
            <ModalBody>
              <div className="text-center mb-6">
                <Avatar name={selectedMember.name} size="xl" className="mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-nexus-text">{selectedMember.name}</h3>
                <code className="text-sm text-primary-600 bg-primary-50 dark:bg-primary-900/30 px-2 py-1 rounded">
                  {selectedMember.uniqueId || 'No ID assigned'}
                </code>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{selectedMember.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Department</p>
                  <p className="font-medium">{selectedMember.department || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Batch</p>
                  <p className="font-medium">{selectedMember.batch || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Points</p>
                  <p className="font-medium">{selectedMember.points}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Role</p>
                  <Badge color={roleColors[selectedMember.role as keyof typeof roleColors] || 'gray'}>
                    {selectedMember.role}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <Badge color={selectedMember.isVerified ? 'green' : 'yellow'}>
                    {selectedMember.isVerified ? 'VERIFIED' : 'PENDING'}
                  </Badge>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>Close</Button>
              <Link href={`/admin/members/${selectedMember.id}`}>
                <Button>View Full Profile</Button>
              </Link>
            </ModalFooter>
          </>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} size="sm">
        <ModalHeader>
          Confirm Delete
        </ModalHeader>
        <ModalBody>
          <p className="text-gray-600 dark:text-gray-400">
            Are you sure you want to delete <strong>{selectedMember?.name}</strong>? 
            This action cannot be undone.
          </p>
        </ModalBody>
        <ModalFooter>
          <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete} isLoading={isDeleting}>Delete</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
