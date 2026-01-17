'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings,
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  Trash2,
  Save,
  Eye,
  EyeOff
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal, ModalHeader, ModalBody, ModalFooter } from '@/components/ui/Modal';

export default function DashboardSettingsPage() {
  const [activeTab, setActiveTab] = useState('account');
  const [showPassword, setShowPassword] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const tabs = [
    { id: 'account', label: 'Account', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">
          Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <Card className="lg:col-span-1 h-fit">
          <CardContent className="p-2">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${
                    activeTab === tab.id
                      ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </nav>
          </CardContent>
        </Card>

        {/* Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Account Settings */}
          {activeTab === 'account' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription>Update your password to keep your account secure</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Current Password
                    </label>
                    <div className="relative">
                      <Input 
                        type={showPassword ? 'text' : 'password'} 
                        placeholder="Enter current password"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      New Password
                    </label>
                    <Input type="password" placeholder="Enter new password" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Confirm New Password
                    </label>
                    <Input type="password" placeholder="Confirm new password" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Email Settings</CardTitle>
                  <CardDescription>Your email address is verified and cannot be changed</CardDescription>
                </CardHeader>
                <CardContent>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email Address
                    </label>
                    <Input 
                      type="email" 
                      value="abdullah@diu.edu.bd" 
                      disabled 
                      className="bg-gray-50 dark:bg-gray-800"
                    />
                    <p className="text-sm text-gray-500 mt-2">
                      Your DIU email is linked to your account and cannot be changed.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-red-200 dark:border-red-900">
                <CardHeader>
                  <CardTitle className="text-red-600">Danger Zone</CardTitle>
                  <CardDescription>Irreversible actions for your account</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Delete Account</p>
                      <p className="text-sm text-gray-500">Permanently delete your account and all data</p>
                    </div>
                    <Button 
                      variant="destructive"
                      onClick={() => setIsDeleteModalOpen(true)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Account
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </motion.div>
          )}

          {/* Notifications Settings */}
          {activeTab === 'notifications' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Email Notifications</CardTitle>
                  <CardDescription>Choose what notifications you receive via email</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { label: 'Event reminders', desc: 'Get reminded about upcoming events you registered for' },
                    { label: 'New events', desc: 'Be notified when new events are published' },
                    { label: 'Workshop updates', desc: 'Updates about workshops you registered for' },
                    { label: 'Blog newsletters', desc: 'Weekly digest of new blog posts' },
                    { label: 'Club announcements', desc: 'Important announcements from the club' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-800 last:border-0">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{item.label}</p>
                        <p className="text-sm text-gray-500">{item.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </motion.div>
          )}

          {/* Privacy Settings */}
          {activeTab === 'privacy' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Profile Visibility</CardTitle>
                  <CardDescription>Control who can see your profile information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { label: 'Show profile to members', desc: 'Other club members can see your profile' },
                    { label: 'Show on leaderboard', desc: 'Display your name on event leaderboards' },
                    { label: 'Show attendance history', desc: 'Show your event attendance to others' },
                    { label: 'Show certificates', desc: 'Display your certificates publicly' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-800 last:border-0">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{item.label}</p>
                        <p className="text-sm text-gray-500">{item.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </motion.div>
          )}

          {/* Appearance Settings */}
          {activeTab === 'appearance' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Theme</CardTitle>
                  <CardDescription>Choose your preferred color scheme</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    {['light', 'dark', 'system'].map((theme) => (
                      <button
                        key={theme}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          theme === 'system' 
                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
                            : 'border-gray-200 dark:border-gray-700 hover:border-primary-300'
                        }`}
                      >
                        <div className={`w-full h-16 rounded-lg mb-3 ${
                          theme === 'light' ? 'bg-white border' : 
                          theme === 'dark' ? 'bg-gray-900' : 
                          'bg-gradient-to-r from-white to-gray-900'
                        }`} />
                        <p className="text-sm font-medium capitalize">{theme}</p>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Language</CardTitle>
                  <CardDescription>Choose your preferred language</CardDescription>
                </CardHeader>
                <CardContent>
                  <select className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                    <option value="en">English</option>
                    <option value="bn">বাংলা (Bengali)</option>
                  </select>
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Delete Account Modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} size="sm">
        <ModalHeader onClose={() => setIsDeleteModalOpen(false)}>
          Delete Account
        </ModalHeader>
        <ModalBody>
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <Trash2 className="w-8 h-8 text-red-600" />
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Are you sure you want to delete your account? This action is irreversible and will permanently delete:
            </p>
            <ul className="text-left text-sm text-gray-500 space-y-2 mb-4">
              <li>• Your profile and personal information</li>
              <li>• All event registrations and history</li>
              <li>• Your certificates and achievements</li>
              <li>• Your unique member ID</li>
            </ul>
            <Input type="text" placeholder="Type 'DELETE' to confirm" />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
          <Button variant="destructive">Delete My Account</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
