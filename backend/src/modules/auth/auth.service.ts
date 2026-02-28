import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import sharp from 'sharp';
import { prisma } from '../../config/database.js';
import { env } from '../../config/env.js';
import { generateToken, generateOTP, validateDiuEmail } from '../../utils/helpers.js';
import { sendEmail, emailTemplates } from '../../utils/email.js';
import { generateQRCode } from '../../utils/generators.js';
import { mediaService } from '../media/media.service.js';

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

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 12);

    // Generate 6-digit OTP with 10 minute expiry
    const otp = generateOTP(6);
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Create user (no uniqueId — assigned on membership approval)
    const user = await prisma.user.create({
      data: {
        email: data.email.toLowerCase(),
        password: hashedPassword,
        name: data.name,
        phone: data.phone,
        department: data.department,
        batch: data.batch,
        studentId: data.studentId,
        verifyToken: otp,
        otpExpiresAt,
        role: 'VISITOR',
        membershipStatus: 'NONE',
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    // Send OTP verification email
    await sendEmail({
      to: user.email,
      subject: 'Your Daffodil AI Club Verification Code',
      html: emailTemplates.otpVerification(user.name, otp),
    });

    return {
      user,
      message: 'Registration successful. Please check your email for the OTP code.',
    };
  }

  /**
   * Verify email with OTP
   */
  async verifyEmail(email: string, otp: string) {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      throw new Error('User not found');
    }

    if (user.isVerified) {
      throw new Error('Email already verified');
    }

    if (!user.verifyToken || user.verifyToken !== otp) {
      throw new Error('Invalid OTP code');
    }

    if (!user.otpExpiresAt || user.otpExpiresAt < new Date()) {
      throw new Error('OTP has expired. Please request a new one.');
    }

    // Update user as verified
    const verifiedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        verifyToken: null,
        otpExpiresAt: null,
      },
    });

    // Send welcome email (no member ID yet — that comes after membership approval)
    await sendEmail({
      to: user.email,
      subject: 'Welcome to Daffodil AI Club! 🎉',
      html: emailTemplates.welcome(user.name),
    });

    // Generate JWT token for auto-login after verification
    const token = jwt.sign(
      {
        id: verifiedUser.id,
        uniqueId: verifiedUser.uniqueId,
        email: verifiedUser.email,
        role: verifiedUser.role,
      },
      env.JWT_SECRET as string,
      { expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'] }
    );

    return {
      message: 'Email verified successfully. Welcome to Daffodil AI Club!',
      token,
      user: {
        id: verifiedUser.id,
        uniqueId: verifiedUser.uniqueId,
        email: verifiedUser.email,
        name: verifiedUser.name,
        role: verifiedUser.role,
        membershipStatus: verifiedUser.membershipStatus,
        profileImage: verifiedUser.profileImage,
        points: verifiedUser.points,
      },
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
        membershipStatus: user.membershipStatus,
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
        membershipStatus: true,
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
            certificates: true,
          },
        },
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Generate QR code for member ID (only if user has one)
    const qrCode = user.uniqueId ? await generateQRCode(user.uniqueId) : null;

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
        studentId: true,
        department: true,
        batch: true,
        profileImage: true,
        role: true,
        membershipStatus: true,
        points: true,
        isVerified: true,
        createdAt: true,
      },
    });

    return user;
  }

  /**
   * Compress image to target size (50KB) using sharp
   * Strategy: Use WebP format for best quality-to-size ratio,
   * reduce dimensions gradually while keeping quality HIGH
   */
  private async compressImage(buffer: Buffer, targetSizeKB: number = 50): Promise<{ buffer: Buffer; mimeType: string; ext: string }> {
    const targetBytes = targetSizeKB * 1024;

    // Get original image metadata
    const metadata = await sharp(buffer).metadata();
    const originalWidth = metadata.width || 800;

    // Step 1: Try WebP at high quality with progressively smaller sizes
    // WebP gives much better quality-to-size ratio than JPEG
    const dimensions = [
      Math.min(originalWidth, 600),
      Math.min(originalWidth, 500),
      Math.min(originalWidth, 400),
      Math.min(originalWidth, 350),
      Math.min(originalWidth, 300),
      Math.min(originalWidth, 250),
    ];

    for (const width of dimensions) {
      // Try high quality first (90), then slightly lower (80, 75)
      for (const quality of [90, 82, 75]) {
        const compressed = await sharp(buffer)
          .resize(width, width, { fit: 'inside', withoutEnlargement: true })
          .webp({ quality, effort: 6 })
          .toBuffer();

        if (compressed.length <= targetBytes) {
          return { buffer: compressed, mimeType: 'image/webp', ext: 'webp' };
        }
      }
    }

    // Fallback: smallest dimension with moderate quality WebP
    const fallback = await sharp(buffer)
      .resize(200, 200, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 70, effort: 6 })
      .toBuffer();

    return { buffer: fallback, mimeType: 'image/webp', ext: 'webp' };
  }

  /**
   * Upload profile image - compress and save to Google Drive
   */
  async uploadProfileImage(userId: string, file: { buffer: Buffer; originalname: string; mimetype: string }) {
    // Compress image to <= 50KB while preserving quality
    const compressed = await this.compressImage(file.buffer);

    // Generate a unique filename
    const filename = `profile-${userId}-${Date.now()}.${compressed.ext}`;

    // Upload to Google Drive
    const driveResult = await mediaService.uploadImageToDrive({
      buffer: compressed.buffer,
      filename,
      mimeType: compressed.mimeType,
    });

    // Use Google Drive thumbnail URL for fast loading
    const profileImageUrl = `https://drive.google.com/thumbnail?id=${driveResult.id}&sz=w400`;

    // Update user's profileImage in database
    const user = await prisma.user.update({
      where: { id: userId },
      data: { profileImage: profileImageUrl },
      select: {
        id: true,
        uniqueId: true,
        email: true,
        name: true,
        phone: true,
        studentId: true,
        department: true,
        batch: true,
        profileImage: true,
        role: true,
        membershipStatus: true,
        points: true,
        isVerified: true,
        createdAt: true,
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

    // Generate new OTP with 10 minute expiry
    const otp = generateOTP(6);
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.user.update({
      where: { id: user.id },
      data: { verifyToken: otp, otpExpiresAt },
    });

    // Send OTP verification email
    await sendEmail({
      to: user.email,
      subject: 'Your Daffodil AI Club Verification Code',
      html: emailTemplates.otpVerification(user.name, otp),
    });

    return { message: 'A new OTP has been sent to your email' };
  }
}

export const authService = new AuthService();
