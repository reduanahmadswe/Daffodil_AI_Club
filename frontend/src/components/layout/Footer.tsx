'use client';

import React from 'react';
import Link from 'next/link';
import { Facebook, Twitter, Linkedin, Github, Youtube, Mail, Phone, MapPin } from 'lucide-react';

const footerLinks = {
  quickLinks: [
    { href: '/about', label: 'About Us' },
    { href: '/events', label: 'Events' },
    { href: '/projects', label: 'Projects' },
    { href: '/blog', label: 'Blog' },
    { href: '/gallery', label: 'Gallery' },
  ],
  resources: [
    { href: '/membership', label: 'Join Club' },
    { href: '/executives', label: 'Executive Panel' },
    { href: '/newsletter', label: 'Newsletter' },
    { href: '/resources', label: 'Learning Resources' },
    { href: '/faq', label: 'FAQ' },
    { href: '/contact', label: 'Contact Us' },
  ],
};

const socialLinks = [
  { href: 'https://facebook.com', icon: Facebook, label: 'Facebook' },
  { href: 'https://twitter.com', icon: Twitter, label: 'Twitter' },
  { href: 'https://linkedin.com', icon: Linkedin, label: 'LinkedIn' },
  { href: 'https://github.com', icon: Github, label: 'GitHub' },
  { href: 'https://youtube.com', icon: Youtube, label: 'YouTube' },
];

export const Footer = () => {
  return (
    <footer className="bg-nexus-surface-1 text-nexus-text-secondary">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-lg bg-nexus-gradient">
                AI
              </div>
              <span className="font-display font-bold text-xl text-nexus-text">
                Daffodil AI Club
              </span>
            </Link>
            <p className="text-nexus-text-muted mb-6">
              Empowering students with AI knowledge and skills through hands-on learning, workshops, and collaborative projects.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 bg-nexus-glass text-nexus-text-muted hover:bg-nexus-gradient hover:text-white"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4 text-nexus-text">Quick Links</h3>
            <ul className="space-y-3">
              {footerLinks.quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-nexus-text-muted hover:text-nexus-purple transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold mb-4 text-nexus-text">Resources</h3>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-nexus-text-muted hover:text-nexus-purple transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold mb-4 text-nexus-text">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5 text-nexus-purple" />
                <span className="text-nexus-text-muted">
                  Daffodil International University<br />
                  Ashulia, Savar, Dhaka-1341
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 flex-shrink-0 text-nexus-purple" />
                <a href="mailto:aiclub@diu.edu.bd" className="text-nexus-text-muted hover:text-nexus-purple transition-colors">
                  aiclub@diu.edu.bd
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 flex-shrink-0 text-nexus-purple" />
                <a href="tel:+8801234567890" className="text-nexus-text-muted hover:text-nexus-purple transition-colors">
                  +880 1234-567890
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-nexus-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 w-full">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <p className="text-sm text-nexus-text-muted">
                © {new Date().getFullYear()} Daffodil AI Club. All rights reserved.
              </p>
              <span className="hidden md:inline text-nexus-border">|</span>
              <p className="text-sm text-nexus-text-muted">
                Developed by{' '}
                <a
                  href="https://reduanahmadswe.site"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium gradient-text hover:opacity-80 transition-opacity"
                >
                  Reduan Ahmad
                </a>
              </p>
            </div>

            <div className="flex items-center gap-6 text-sm">
              <Link href="/privacy" className="text-nexus-text-muted hover:text-nexus-text-secondary transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-nexus-text-muted hover:text-nexus-text-secondary transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
