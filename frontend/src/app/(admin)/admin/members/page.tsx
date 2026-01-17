'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Users, 
  Search, 
  Plus,
  MoreVertical,
  Filter,
  Download,
  Mail,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Avatar } from '@/components/ui/Avatar';
import { Modal, ModalHeader, ModalBody, ModalFooter } from '@/components/ui/Modal';

const mockMembers = [
  { 
    id: '1', 
    uniqueId: 'DAIC-SPRING-00142',
    name: 'Abdullah Rahman', 
    email: 'abdullah@diu.edu.bd', 
    department: 'CSE',
    batch: '48',
    status: 'ACTIVE',
    role: 'MEMBER',
    joinedAt: '2024-01-15',
    eventsAttended: 5
  },
  { 
    id: '2', 
    uniqueId: 'DAIC-SPRING-00143',
    name: 'Fatima Begum', 
    email: 'fatima@diu.edu.bd', 
    department: 'SWE',
    batch: '49',
    status: 'ACTIVE',
    role: 'EXECUTIVE',
    joinedAt: '2024-01-18',
    eventsAttended: 8
  },
  { 
    id: '3', 
    uniqueId: 'DAIC-FALL-00089',
    name: 'Mahmudul Hasan', 
    email: 'mahmud@diu.edu.bd', 
    department: 'CSE',
    batch: '47',
    status: 'ACTIVE',
    role: 'MEMBER',
    joinedAt: '2023-09-10',
    eventsAttended: 12
  },
  { 
    id: '4', 
    uniqueId: 'DAIC-SUMMER-00034',
    name: 'Tasnim Akhter', 
    email: 'tasnim@diu.edu.bd', 
    department: 'EEE',
    batch: '50',
    status: 'PENDING',
    role: 'MEMBER',
    joinedAt: '2024-02-01',
    eventsAttended: 0
  },
  { 
    id: '5', 
    uniqueId: 'DAIC-SPRING-00001',
    name: 'Rafiqul Islam', 
    email: 'rafiq@diu.edu.bd', 
    department: 'CSE',
    batch: '45',
    status: 'ACTIVE',
    role: 'ADMIN',
    joinedAt: '2023-01-01',
    eventsAttended: 25
  },
];

const statusColors = {
  ACTIVE: 'green',
  PENDING: 'yellow',
  SUSPENDED: 'red',
} as const;

const roleColors = {
  ADMIN: 'red',
  EXECUTIVE: 'purple',
  MEMBER: 'blue',
} as const;

export default function AdminMembersPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [roleFilter, setRoleFilter] = useState('All');
  const [selectedMember, setSelectedMember] = useState<typeof mockMembers[0] | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const filteredMembers = mockMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(search.toLowerCase()) ||
      member.email.toLowerCase().includes(search.toLowerCase()) ||
      member.uniqueId.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || member.status === statusFilter;
    const matchesRole = roleFilter === 'All' || member.role === roleFilter;
    return matchesSearch && matchesStatus && matchesRole;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white flex items-center gap-3">
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
                <p className="text-2xl font-bold text-gray-900 dark:text-white">523</p>
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
                <p className="text-2xl font-bold text-gray-900 dark:text-white">498</p>
                <p className="text-sm text-gray-500">Active</p>
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
                <p className="text-2xl font-bold text-gray-900 dark:text-white">18</p>
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
                <p className="text-2xl font-bold text-gray-900 dark:text-white">12</p>
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
                className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="PENDING">Pending</option>
                <option value="SUSPENDED">Suspended</option>
              </select>
              <select 
                className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="All">All Roles</option>
                <option value="ADMIN">Admin</option>
                <option value="EXECUTIVE">Executive</option>
                <option value="MEMBER">Member</option>
              </select>
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
                {filteredMembers.map((member) => (
                  <motion.tr 
                    key={member.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar name={member.name} size="sm" />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{member.name}</p>
                          <p className="text-sm text-gray-500">{member.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <code className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 text-sm font-mono">
                        {member.uniqueId}
                      </code>
                    </td>
                    <td className="p-4">
                      <span className="text-gray-900 dark:text-white">{member.department}</span>
                      <span className="text-gray-500 ml-1">({member.batch})</span>
                    </td>
                    <td className="p-4">
                      <Badge color={roleColors[member.role as keyof typeof roleColors]} size="sm">
                        {member.role}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <Badge color={statusColors[member.status as keyof typeof statusColors]} size="sm">
                        {member.status}
                      </Badge>
                    </td>
                    <td className="p-4 text-gray-500">
                      {new Date(member.joinedAt).toLocaleDateString()}
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
                        <Link href={`/admin/members/${member.id}/edit`}>
                          <Button variant="ghost" size="sm" className="p-2">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </Link>
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
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between p-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500">
              Showing {filteredMembers.length} of {mockMembers.length} members
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
            <ModalHeader onClose={() => setIsViewModalOpen(false)}>
              Member Details
            </ModalHeader>
            <ModalBody>
              <div className="text-center mb-6">
                <Avatar name={selectedMember.name} size="xl" className="mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{selectedMember.name}</h3>
                <code className="text-sm text-primary-600 bg-primary-50 dark:bg-primary-900/30 px-2 py-1 rounded">
                  {selectedMember.uniqueId}
                </code>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{selectedMember.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Department</p>
                  <p className="font-medium">{selectedMember.department}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Batch</p>
                  <p className="font-medium">{selectedMember.batch}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Events Attended</p>
                  <p className="font-medium">{selectedMember.eventsAttended}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Role</p>
                  <Badge color={roleColors[selectedMember.role as keyof typeof roleColors]}>
                    {selectedMember.role}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <Badge color={statusColors[selectedMember.status as keyof typeof statusColors]}>
                    {selectedMember.status}
                  </Badge>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>Close</Button>
              <Link href={`/admin/members/${selectedMember.id}/edit`}>
                <Button>Edit Member</Button>
              </Link>
            </ModalFooter>
          </>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} size="sm">
        <ModalHeader onClose={() => setIsDeleteModalOpen(false)}>
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
          <Button variant="destructive" onClick={() => setIsDeleteModalOpen(false)}>Delete</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
