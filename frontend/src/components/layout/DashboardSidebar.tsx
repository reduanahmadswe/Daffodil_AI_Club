'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  User, 
  Calendar, 
  Award, 
  Bookmark, 
  Settings, 
  CreditCard,
  FileText,
  Bell,
  LogOut,
  Shield
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks';
import { logout as logoutAction } from '@/lib/redux/slices/authSlice';
import { Avatar } from '@/components/ui/Avatar';

const sidebarLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/profile', label: 'My Profile', icon: User },
  { href: '/dashboard/events', label: 'My Events', icon: Calendar },
  { href: '/dashboard/certificates', label: 'Certificates', icon: Award },
  { href: '/dashboard/bookmarks', label: 'Bookmarks', icon: Bookmark },
  { href: '/dashboard/id-card', label: 'ID Card', icon: CreditCard },
  { href: '/dashboard/notifications', label: 'Notifications', icon: Bell },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];

export const DashboardSidebar = () => {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logoutAction());
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 glass border-r border-nexus-border flex flex-col z-40">
      {/* Logo */}
      <div className="h-16 lg:h-20 flex items-center px-6 border-b border-nexus-border">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-lg bg-nexus-gradient">
            AI
          </div>
          <span className="font-display font-bold text-lg text-nexus-text">
            AI Club
          </span>
        </Link>
      </div>

      {/* User Info */}
      {user && (
        <div className="p-4 border-b border-nexus-border">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-nexus-purple/10">
            <Avatar src={user.profileImage} name={user.name} size="md" />
            <div className="flex-1 min-w-0">
              <p className="font-semibold truncate text-nexus-text">{user.name}</p>
              {user.uniqueId ? (
                <p className="text-xs truncate text-nexus-purple">{user.uniqueId}</p>
              ) : (
                <p className="text-xs truncate text-nexus-text-secondary capitalize">{user.role.toLowerCase()}</p>
              )}
              {/* Membership Status Badge */}
              <div className="mt-1">
                {user.role === 'VISITOR' && (!user.membershipStatus || user.membershipStatus === 'NONE') && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gray-500/20 text-gray-400">
                    <Shield className="w-3 h-3" /> Visitor
                  </span>
                )}
                {user.membershipStatus === 'PENDING' && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-yellow-500/20 text-yellow-400">
                    <Shield className="w-3 h-3" /> Pending
                  </span>
                )}
                {(user.role === 'MEMBER' || user.role === 'EXECUTIVE' || user.role === 'ADMIN') && user.membershipStatus === 'ACTIVE' && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-400">
                    <Shield className="w-3 h-3" /> Member
                  </span>
                )}
                {user.membershipStatus === 'REJECTED' && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-500/20 text-red-400">
                    <Shield className="w-3 h-3" /> Rejected
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Apply for Membership CTA for Visitors */}
          {user.role === 'VISITOR' && user.membershipStatus !== 'PENDING' && (
            <Link
              href="/membership"
              className="mt-3 flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-nexus-gradient hover:opacity-90 transition-opacity shadow-glow-purple"
            >
              <Shield className="w-4 h-4" />
              Apply for Membership
            </Link>
          )}
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4">
        <div className="space-y-1">
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200',
                  isActive
                    ? 'text-white bg-nexus-gradient shadow-glow-purple'
                    : 'text-nexus-text-secondary hover:bg-nexus-purple/10 hover:text-nexus-text'
                )}
              >
                <link.icon className="w-5 h-5" />
                {link.label}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-nexus-border">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl font-medium text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </aside>
  );
};
