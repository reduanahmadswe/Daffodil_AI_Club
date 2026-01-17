import { prisma } from '../config/database.js';

/**
 * Generate Unique Member ID
 * Format: DAIC-SEASON-XXXXX
 * Example: DAIC-SPRING-00142
 */
export const generateUniqueId = async (): Promise<string> => {
  const now = new Date();
  const month = now.getMonth() + 1; // 0-indexed
  
  // Determine season based on month
  // Spring: Jan-Apr (1-4)
  // Summer: May-Aug (5-8)
  // Fall: Sep-Dec (9-12)
  let season: string;
  if (month >= 1 && month <= 4) {
    season = 'SPRING';
  } else if (month >= 5 && month <= 8) {
    season = 'SUMMER';
  } else {
    season = 'FALL';
  }
  
  // Get the count of members in current season
  const year = now.getFullYear();
  const seasonStart = getSeasonStartDate(season, year);
  const seasonEnd = getSeasonEndDate(season, year);
  
  const count = await prisma.user.count({
    where: {
      createdAt: {
        gte: seasonStart,
        lte: seasonEnd,
      },
    },
  });
  
  // Generate ID with padded number
  const memberNumber = String(count + 1).padStart(5, '0');
  return `DAIC-${season}-${memberNumber}`;
};

/**
 * Get season start date
 */
const getSeasonStartDate = (season: string, year: number): Date => {
  switch (season) {
    case 'SPRING':
      return new Date(year, 0, 1); // Jan 1
    case 'SUMMER':
      return new Date(year, 4, 1); // May 1
    case 'FALL':
      return new Date(year, 8, 1); // Sep 1
    default:
      return new Date(year, 0, 1);
  }
};

/**
 * Get season end date
 */
const getSeasonEndDate = (season: string, year: number): Date => {
  switch (season) {
    case 'SPRING':
      return new Date(year, 3, 30, 23, 59, 59); // Apr 30
    case 'SUMMER':
      return new Date(year, 7, 31, 23, 59, 59); // Aug 31
    case 'FALL':
      return new Date(year, 11, 31, 23, 59, 59); // Dec 31
    default:
      return new Date(year, 11, 31, 23, 59, 59);
  }
};

/**
 * Get current season name
 */
export const getCurrentSeason = (): string => {
  const month = new Date().getMonth() + 1;
  if (month >= 1 && month <= 4) return 'SPRING';
  if (month >= 5 && month <= 8) return 'SUMMER';
  return 'FALL';
};

/**
 * Validate DIU email domain
 */
export const validateDiuEmail = (email: string): boolean => {
  const allowedDomain = '@diu.edu.bd';
  return email.toLowerCase().endsWith(allowedDomain);
};

/**
 * Generate random token for email verification
 */
export const generateToken = (length: number = 32): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < length; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
};

/**
 * Generate slug from title
 */
export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

/**
 * Parse JSON safely
 */
export const safeJsonParse = <T>(json: string | null | undefined, fallback: T): T => {
  if (!json) return fallback;
  try {
    return JSON.parse(json);
  } catch {
    return fallback;
  }
};
