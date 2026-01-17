import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../../config/database.js';
import { env } from '../../config/env.js';
import { generateUniqueId, generateToken, validateDiuEmail } from '../../utils/helpers.js';
import { sendEmail, emailTemplates } from '../../utils/email.js';
import { generateQRCode } from '../../utils/generators.js';

interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  department?: string;
  batch?: string;
  studentId?: string;
}

interface LoginData {
  email: string;
  password: string;
}

export class AuthService {
  /**
   * Register new member
   */
  async register(data: RegisterData) {
    // Validate DIU email
    if (!validateDiuEmail(data.email)) {
      throw new Error(`Only ${env.ALLOWED_EMAIL_DOMAIN} emails are allowed`);
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email.toLowerCase() },
    });

    if (existingUser) {
      throw new Error('Email already registered');
    }

    // Generate unique member ID
    const uniqueId = await generateUniqueId();

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 12);

    // Generate verification token
    const verifyToken = generateToken(32);

    // Create user
    const user = await prisma.user.create({
      data: {
        uniqueId,
        email: data.email.toLowerCase(),
        password: hashedPassword,
        name: data.name,
        phone: data.phone,
        department: data.department,
        batch: data.batch,
        studentId: data.studentId,
        verifyToken,
        role: 'MEMBER',
      },
      select: {
        id: true,
        uniqueId: true,
        email: true,
        name: true,
        role: true,
      },
    });

    // Send verification email
    const verifyUrl = `${env.FRONTEND_URL}/verify-email?token=${verifyToken}`;
    await sendEmail({
      to: user.email,
      subject: 'Verify your Daffodil AI Club account',
      html: emailTemplates.verification(user.name, verifyUrl),
    });

    return {
      user,
      message: 'Registration successful. Please check your email to verify your account.',
    };
  }

  /**
   * Verify email
   */
  async verifyEmail(token: string) {
    const user = await prisma.user.findFirst({
      where: { verifyToken: token },
    });

    if (!user) {
      throw new Error('Invalid or expired verification token');
    }

    // Update user as verified
    await prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        verifyToken: null,
      },
    });

    // Send welcome email
    await sendEmail({
      to: user.email,
      subject: 'Welcome to Daffodil AI Club! 🎉',
      html: emailTemplates.welcome(user.name, user.uniqueId),
    });

    return {
      message: 'Email verified successfully. Welcome to Daffodil AI Club!',
      uniqueId: user.uniqueId,
    };
  }

  /**
   * Login user
   */
  async login(data: LoginData) {
    const user = await prisma.user.findUnique({
      where: { email: data.email.toLowerCase() },
    });

    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Check password
    const isValidPassword = await bcrypt.compare(data.password, user.password);
    if (!isValidPassword) {
      throw new Error('Invalid email or password');
    }

    // Check if verified
    if (!user.isVerified) {
      throw new Error('Please verify your email first');
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user.id,
        uniqueId: user.uniqueId,
        email: user.email,
        role: user.role,
      },
      env.JWT_SECRET as string,
      { expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'] }
    );

    return {
      token,
      user: {
        id: user.id,
        uniqueId: user.uniqueId,
        email: user.email,
        name: user.name,
        role: user.role,
        profileImage: user.profileImage,
        points: user.points,
      },
    };
  }

  /**
   * Get current user profile
   */
  async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        uniqueId: true,
        email: true,
        name: true,
        phone: true,
        department: true,
        batch: true,
        studentId: true,
        profileImage: true,
        role: true,
        points: true,
        isVerified: true,
        createdAt: true,
        badges: {
          include: {
            badge: true,
          },
        },
        _count: {
          select: {
            blogs: true,
            projects: true,
            eventRegistrations: true,
            workshopRegistrations: true,
            certificates: true,
          },
        },
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Generate QR code for member ID
    const qrCode = await generateQRCode(user.uniqueId);

    return {
      ...user,
      qrCode,
    };
  }

  /**
   * Update user profile
   */
  async updateProfile(userId: string, data: Partial<RegisterData>) {
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        name: data.name,
        phone: data.phone,
        department: data.department,
        batch: data.batch,
      },
      select: {
        id: true,
        uniqueId: true,
        email: true,
        name: true,
        phone: true,
        department: true,
        batch: true,
        profileImage: true,
        role: true,
      },
    });

    return user;
  }

  /**
   * Request password reset
   */
  async forgotPassword(email: string) {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      // Don't reveal if email exists
      return { message: 'If the email exists, you will receive a password reset link.' };
    }

    // Generate reset token
    const resetToken = generateToken(32);
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    });

    // Send reset email
    const resetUrl = `${env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    await sendEmail({
      to: user.email,
      subject: 'Reset your Daffodil AI Club password',
      html: emailTemplates.resetPassword(user.name, resetUrl),
    });

    return { message: 'If the email exists, you will receive a password reset link.' };
  }

  /**
   * Reset password with token
   */
  async resetPassword(token: string, newPassword: string) {
    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      throw new Error('Invalid or expired reset token');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    return { message: 'Password reset successful. You can now login with your new password.' };
  }

  /**
   * Change password (for logged in users)
   */
  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const isValidPassword = await bcrypt.compare(currentPassword, user.password);
    if (!isValidPassword) {
      throw new Error('Current password is incorrect');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return { message: 'Password changed successfully' };
  }

  /**
   * Resend verification email
   */
  async resendVerification(email: string) {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      throw new Error('User not found');
    }

    if (user.isVerified) {
      throw new Error('Email already verified');
    }

    // Generate new token
    const verifyToken = generateToken(32);

    await prisma.user.update({
      where: { id: user.id },
      data: { verifyToken },
    });

    // Send verification email
    const verifyUrl = `${env.FRONTEND_URL}/verify-email?token=${verifyToken}`;
    await sendEmail({
      to: user.email,
      subject: 'Verify your Daffodil AI Club account',
      html: emailTemplates.verification(user.name, verifyUrl),
    });

    return { message: 'Verification email sent' };
  }
}

export const authService = new AuthService();
