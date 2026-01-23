'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, User, LogOut, LayoutDashboard, Moon, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks';
import { logout as logoutAction } from '@/lib/redux/slices/authSlice';
import { setTheme } from '@/lib/redux/slices/themeSlice';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import FadeContent from '@/components/FadeContent';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/events', label: 'Events' },
  { href: '/workshops', label: 'Workshops' },
  { href: '/projects', label: 'Projects' },
  { href: '/blog', label: 'Blog' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/contact', label: 'Contact' },
];

export const Navbar = () => {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const { theme } = useAppSelector((state) => state.theme);
  const [isScrolled, setIsScrolled] = useState(false);

  const handleLogout = () => {
    dispatch(logoutAction());
  };

  const handleSetTheme = (newTheme: 'light' | 'dark' | 'system') => {
    dispatch(setTheme(newTheme));
  };
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Apply theme
  useEffect(() => {
    const root = window.document.documentElement;
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const activeTheme = theme === 'system' ? systemTheme : theme;

    root.classList.remove('light', 'dark');
    root.classList.add(activeTheme);
  }, [theme]);

  const toggleTheme = () => {
    handleSetTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'glass shadow-glow-purple bg-black/95 backdrop-blur-xl'
          : 'bg-black/80 backdrop-blur-md'
      )}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg border border-white/10">
              <img
                src="/daiclogo.jpg"
                alt="DAIC Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <span className={cn(
              'font-display font-bold text-xl transition-colors',
              isScrolled ? 'text-white' : 'text-white'
            )}>
              Daffodil AI Club
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                  pathname === link.href
                    ? 'gradient-text font-bold'
                    : isScrolled
                      ? 'text-[#B5B5C3] hover:text-[#7B61FF]'
                      : 'text-white/90 hover:text-white hover:bg-[rgba(255,255,255,0.1)]'
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={cn(
                'p-2 rounded-lg transition-colors',
                isScrolled
                  ? 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                  : 'text-white/90 hover:bg-white/10'
              )}
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Auth Section */}
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <Avatar src={user.profileImage} name={user.name} size="sm" />
                  <ChevronDown className={cn(
                    'w-4 h-4 transition-transform',
                    isProfileOpen && 'rotate-180',
                    isScrolled ? 'text-gray-700 dark:text-gray-300' : 'text-white'
                  )} />
                </button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
                    >
                      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                        <p className="font-semibold text-gray-900 dark:text-white">{user.name}</p>
                        <p className="text-sm text-primary-600">{user.uniqueId}</p>
                      </div>
                      <div className="p-2">
                        <Link
                          href="/dashboard"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                          <LayoutDashboard className="w-4 h-4" />
                          Dashboard
                        </Link>
                        <Link
                          href="/dashboard/profile"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                          <User className="w-4 h-4" />
                          Profile
                        </Link>
                        {['ADMIN', 'EXECUTIVE'].includes(user.role) && (
                          <Link
                            href="/admin"
                            onClick={() => setIsProfileOpen(false)}
                            className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                          >
                            <LayoutDashboard className="w-4 h-4" />
                            Admin Panel
                          </Link>
                        )}
                        <button
                          onClick={() => {
                            handleLogout();
                            setIsProfileOpen(false);
                          }}
                          className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <FadeContent blur={true} duration={800} ease="ease-out" initialOpacity={0} delay={200}>
                  <Link href="/login">
                    <Button variant={isScrolled ? 'ghost' : 'outline'} size="sm">
                      Login
                    </Button>
                  </Link>
                </FadeContent>
                <FadeContent blur={true} duration={800} ease="ease-out" initialOpacity={0} delay={400}>
                  <Link href="/register">
                    <Button variant="primary" size="sm">
                      Join Club
                    </Button>
                  </Link>
                </FadeContent>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={cn(
                'lg:hidden p-2 rounded-lg transition-colors',
                isScrolled
                  ? 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                  : 'text-white hover:bg-white/10'
              )}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    'block px-4 py-3 rounded-lg font-medium transition-colors',
                    pathname === link.href
                      ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                  )}
                >
                  {link.label}
                </Link>
              ))}
              {!isAuthenticated && (
                <div className="pt-4 flex flex-col gap-2">
                  <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full">Login</Button>
                  </Link>
                  <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="primary" className="w-full">Join Club</Button>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
