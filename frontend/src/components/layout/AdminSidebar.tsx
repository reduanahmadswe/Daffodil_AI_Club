'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  FileText, 
  Image, 
  Settings, 
  Award,
  Folder,
  MessageSquare,
  Mail,
  BarChart,
  Bell,
  LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/lib/store';
import { Avatar } from '@/components/ui/Avatar';

const adminLinks = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard },
  { href: '/admin/members', label: 'Members', icon: Users },
  { href: '/admin/events', label: 'Events', icon: Calendar },
  { href: '/admin/workshops', label: 'Workshops', icon: Award },
  { href: '/admin/projects', label: 'Projects', icon: Folder },
  { href: '/admin/blogs', label: 'Blog Posts', icon: FileText },
  { href: '/admin/gallery', label: 'Gallery', icon: Image },
  { href: '/admin/messages', label: 'Messages', icon: MessageSquare },
  { href: '/admin/newsletter', label: 'Newsletter', icon: Mail },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export const AdminSidebar = () => {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 flex flex-col z-40 bg-nexus-surface-1">
      {/* Logo */}
      <div className="h-16 lg:h-20 flex items-center px-6 border-b border-nexus-border">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-lg bg-nexus-gradient">
            AI
          </div>
          <div>
            <span className="font-display font-bold text-lg block text-nexus-text">AI Club</span>
            <span className="text-xs text-nexus-purple">Admin Panel</span>
          </div>
        </Link>
      </div>

      {/* User Info */}
      {user && (
        <div className="p-4 border-b border-nexus-border">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-nexus-purple/10">
            <Avatar src={user.profileImage} name={user.name} size="md" />
            <div className="flex-1 min-w-0">
              <p className="font-semibold truncate text-nexus-text">{user.name}</p>
              <p className="text-xs truncate text-nexus-purple">{user.role}</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4">
        <div className="space-y-1">
          {adminLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== '/admin' && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200',
                  isActive
                    ? 'text-white bg-nexus-gradient shadow-glow-purple'
                    : 'text-nexus-text-muted hover:bg-nexus-purple/10 hover:text-nexus-text'
                )}
              >
                <link.icon className="w-5 h-5" />
                {link.label}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Back to Dashboard & Logout */}
      <div className="p-4 border-t border-nexus-border space-y-1">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl font-medium transition-colors text-nexus-text-muted hover:bg-nexus-purple/10 hover:text-nexus-text"
        >
          <LayoutDashboard className="w-5 h-5" />
          Back to Dashboard
        </Link>
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl font-medium text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </aside>
  );
};
