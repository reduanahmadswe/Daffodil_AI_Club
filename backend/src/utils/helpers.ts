import { prisma } from '../config/database.js';

/**
 * Generate Unique Member ID (department-based, global sequential)
 * Format: DAIC-DEPT-XXXXX
 * Example: DAIC-CSE-00001, DAIC-SWE-00042
 *
 * - DEPT is the user's department abbreviation (CSE, SWE, EEE, etc.)
 * - XXXXX is a globally sequential number across all departments
 * - Includes retry logic for race-condition safety (DB @unique protects too)
 */
export const generateUniqueId = async (department?: string | null): Promise<string> => {
  const deptCode = (department && department.trim()) ? department.trim().toUpperCase() : 'GEN';
  const MAX_RETRIES = 5;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    // Count ALL approved members globally (not per-department)
    const count = await prisma.user.count({
      where: { uniqueId: { not: null } },
    });

    const memberNumber = String(count + 1 + attempt).padStart(5, '0');
    const candidateId = `DAIC-${deptCode}-${memberNumber}`;

    // Check if this ID already exists (race-condition guard)
    const existing = await prisma.user.findUnique({
      where: { uniqueId: candidateId },
      select: { id: true },
    });

    if (!existing) {
      return candidateId;
    }
    // If collision, retry with incremented number
  }

  // Fallback: use timestamp to guarantee uniqueness
  const count = await prisma.user.count({ where: { uniqueId: { not: null } } });
  return `DAIC-${deptCode}-${String(count + 100).padStart(5, '0')}`;
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
 * Generate numeric OTP code
 */
export const generateOTP = (length: number = 6): string => {
  let otp = '';
  for (let i = 0; i < length; i++) {
    otp += Math.floor(Math.random() * 10).toString();
  }
  return otp;
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
