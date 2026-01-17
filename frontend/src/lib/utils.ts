import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date, options?: Intl.DateTimeFormatOptions): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  });
}

export function formatDateTime(date: string | Date): string {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function timeAgo(date: string | Date): string {
  const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);

  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
    second: 1,
  };

  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInUnit);
    if (interval >= 1) {
      return `${interval} ${unit}${interval > 1 ? 's' : ''} ago`;
    }
  }

  return 'Just now';
}

export const formatRelativeTime = timeAgo;

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export function parseJsonSafe<T>(json: string | null | undefined, fallback: T): T {
  if (!json) return fallback;
  try {
    return JSON.parse(json);
  } catch {
    return fallback;
  }
}

export const eventTypeColors: Record<string, string> = {
  SEMINAR: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  WORKSHOP: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
  COMPETITION: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
  HACKATHON: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  MEETUP: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  WEBINAR: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300',
  CONFERENCE: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
};

export const projectCategoryColors: Record<string, string> = {
  AI_ML: 'bg-indigo-100 text-indigo-800',
  DEEP_LEARNING: 'bg-purple-100 text-purple-800',
  NLP: 'bg-blue-100 text-blue-800',
  COMPUTER_VISION: 'bg-cyan-100 text-cyan-800',
  DATA_SCIENCE: 'bg-green-100 text-green-800',
  ROBOTICS: 'bg-orange-100 text-orange-800',
  IOT: 'bg-yellow-100 text-yellow-800',
  RESEARCH: 'bg-pink-100 text-pink-800',
  OTHER: 'bg-gray-100 text-gray-800',
};
