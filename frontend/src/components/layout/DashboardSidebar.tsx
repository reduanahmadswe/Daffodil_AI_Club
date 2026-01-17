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
  LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/lib/store';
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
  const { user, logout } = useAuthStore();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 glass border-r flex flex-col z-40" style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}>
      {/* Logo */}
      <div className="h-16 lg:h-20 flex items-center px-6 border-b" style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}>
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-lg" style={{ background: 'linear-gradient(135deg, #7B61FF, #FF4FD8)' }}>
            AI
          </div>
          <span className="font-display font-bold text-lg" style={{ color: '#FFFFFF' }}>
            AI Club
          </span>
        </Link>
      </div>

      {/* User Info */}
      {user && (
        <div className="p-4 border-b" style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}>
          <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'rgba(123, 97, 255, 0.1)' }}>
            <Avatar src={user.profileImage} name={user.name} size="md" />
            <div className="flex-1 min-w-0">
              <p className="font-semibold truncate" style={{ color: '#FFFFFF' }}>{user.name}</p>
              <p className="text-xs truncate" style={{ color: '#7B61FF' }}>{user.uniqueId}</p>
            </div>
          </div>
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
                    ? 'text-white shadow-glow-purple'
                    : 'hover:bg-[rgba(123,97,255,0.1)]'
                )}
                style={isActive ? { background: 'linear-gradient(90deg, #7B61FF, #FF4FD8)' } : { color: '#B5B5C3' }}
              >
                <link.icon className="w-5 h-5" />
                {link.label}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t" style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}>
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl font-medium text-red-400 hover:bg-red-900/20 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </aside>
  );
};
