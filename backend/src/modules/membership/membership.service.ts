import { prisma } from '../../config/database.js';
import { sendEmail } from '../../utils/email.js';
import { env } from '../../config/env.js';
import { generateUniqueId } from '../../utils/helpers.js';

interface ApplyData {
  userId: string;
  paymentMethod: 'BKASH' | 'NAGAD' | 'ROCKET';
  transactionId: string;
  amount: number;
  phoneNumber?: string;
}

interface ApplicationQuery {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}

export class MembershipService {
  /**
   * Submit a membership application
   */
  async apply(data: ApplyData) {
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: data.userId },
      select: { id: true, name: true, email: true, role: true, membershipStatus: true },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Already a member or higher
    if (user.role === 'MEMBER' || user.role === 'EXECUTIVE' || user.role === 'ADMIN') {
      throw new Error('You are already a club member');
    }

    // Check if there's already a pending application
    if (user.membershipStatus === 'PENDING') {
      throw new Error('You already have a pending membership application');
    }

    // Check if already active
    if (user.membershipStatus === 'ACTIVE') {
      throw new Error('Your membership is already active');
    }

    // Check for duplicate transaction ID
    const existingTxn = await prisma.membershipApplication.findFirst({
      where: { transactionId: data.transactionId },
    });

    if (existingTxn) {
      throw new Error('This transaction ID has already been used');
    }

    // Create application
    const application = await prisma.membershipApplication.create({
      data: {
        userId: data.userId,
        paymentMethod: data.paymentMethod,
        transactionId: data.transactionId,
        amount: data.amount,
        phoneNumber: data.phoneNumber,
      },
    });

    // Update user's membership status to PENDING
    await prisma.user.update({
      where: { id: data.userId },
      data: { membershipStatus: 'PENDING' },
    });

    // Send confirmation email
    await sendEmail({
      to: user.email,
      subject: 'Membership Application Received - Daffodil AI Club',
      html: membershipEmailTemplates.applicationReceived(user.name, data.transactionId, data.paymentMethod),
    });

    return {
      application,
      message: 'Membership application submitted successfully. You will be notified once it is reviewed.',
    };
  }

  /**
   * Get current user's membership status & application history
   */
  async getMyStatus(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        role: true,
        membershipStatus: true,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const applications = await prisma.membershipApplication.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return {
      role: user.role,
      membershipStatus: user.membershipStatus,
      applications,
    };
  }

  /**
   * Get all membership applications (admin)
   */
  async getApplications(query: ApplicationQuery) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (query.status && query.status !== 'ALL') {
      where.status = query.status;
    }

    if (query.search) {
      where.OR = [
        { transactionId: { contains: query.search } },
        { phoneNumber: { contains: query.search } },
        { user: { name: { contains: query.search } } },
        { user: { email: { contains: query.search } } },
        { user: { uniqueId: { contains: query.search } } },
      ];
    }

    const [applications, total] = await Promise.all([
      prisma.membershipApplication.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              uniqueId: true,
              name: true,
              email: true,
              phone: true,
              department: true,
              batch: true,
              studentId: true,
              profileImage: true,
              role: true,
              membershipStatus: true,
            },
          },
        },
      }),
      prisma.membershipApplication.count({ where }),
    ]);

    return {
      applications,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get a single application by ID (admin)
   */
  async getApplicationById(id: string) {
    const application = await prisma.membershipApplication.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            uniqueId: true,
            name: true,
            email: true,
            phone: true,
            department: true,
            batch: true,
            studentId: true,
            profileImage: true,
            role: true,
            membershipStatus: true,
          },
        },
      },
    });

    if (!application) {
      throw new Error('Application not found');
    }

    return application;
  }

  /**
   * Approve a membership application (admin)
   */
  async approveApplication(applicationId: string, reviewerId: string) {
    const application = await prisma.membershipApplication.findUnique({
      where: { id: applicationId },
      include: {
        user: {
          select: { id: true, name: true, email: true, uniqueId: true, department: true },
        },
      },
    });

    if (!application) {
      throw new Error('Application not found');
    }

    if (application.status !== 'PENDING') {
      throw new Error('This application has already been reviewed');
    }

    // Update application status
    await prisma.membershipApplication.update({
      where: { id: applicationId },
      data: {
        status: 'APPROVED',
        reviewedBy: reviewerId,
        reviewedAt: new Date(),
      },
    });

    // Generate department-based unique member ID for the newly approved member
    const uniqueId = await generateUniqueId(application.user.department);

    // Upgrade user role to MEMBER, set membership as ACTIVE, and assign uniqueId
    await prisma.user.update({
      where: { id: application.userId },
      data: {
        role: 'MEMBER',
        membershipStatus: 'ACTIVE',
        uniqueId,
      },
    });

    // Send approval email with their new member ID
    await sendEmail({
      to: application.user.email,
      subject: 'Membership Approved! Welcome to Daffodil AI Club 🎉',
      html: membershipEmailTemplates.applicationApproved(
        application.user.name,
        uniqueId
      ),
    });

    return { message: 'Application approved successfully' };
  }

  /**
   * Reject a membership application (admin)
   */
  async rejectApplication(applicationId: string, reviewerId: string, reason?: string) {
    const application = await prisma.membershipApplication.findUnique({
      where: { id: applicationId },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    if (!application) {
      throw new Error('Application not found');
    }

    if (application.status !== 'PENDING') {
      throw new Error('This application has already been reviewed');
    }

    // Update application status
    await prisma.membershipApplication.update({
      where: { id: applicationId },
      data: {
        status: 'REJECTED',
        rejectionReason: reason || 'Application rejected by admin',
        reviewedBy: reviewerId,
        reviewedAt: new Date(),
      },
    });

    // Update user membership status to REJECTED (they can re-apply)
    await prisma.user.update({
      where: { id: application.userId },
      data: {
        membershipStatus: 'REJECTED',
      },
    });

    // Send rejection email
    await sendEmail({
      to: application.user.email,
      subject: 'Membership Application Update - Daffodil AI Club',
      html: membershipEmailTemplates.applicationRejected(
        application.user.name,
        reason || 'Your application could not be approved at this time.'
      ),
    });

    return { message: 'Application rejected' };
  }

  /**
   * Get membership stats (admin dashboard)
   */
  async getStats() {
    const [totalApplications, pending, approved, rejected, totalMembers] = await Promise.all([
      prisma.membershipApplication.count(),
      prisma.membershipApplication.count({ where: { status: 'PENDING' } }),
      prisma.membershipApplication.count({ where: { status: 'APPROVED' } }),
      prisma.membershipApplication.count({ where: { status: 'REJECTED' } }),
      prisma.user.count({ where: { role: { in: ['MEMBER', 'EXECUTIVE', 'ADMIN'] } } }),
    ]);

    return {
      totalApplications,
      pending,
      approved,
      rejected,
      totalMembers,
    };
  }

  /**
   * Direct membership approval (admin can make someone a member directly)
   */
  async directApprove(userId: string, reviewerId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, uniqueId: true, department: true, role: true },
    });

    if (!user) {
      throw new Error('User not found');
    }

    if (user.role === 'MEMBER' || user.role === 'EXECUTIVE' || user.role === 'ADMIN') {
      throw new Error('User is already a member or higher');
    }

    // Generate department-based unique member ID for the directly approved member
    const uniqueId = await generateUniqueId(user.department);

    await prisma.user.update({
      where: { id: userId },
      data: {
        role: 'MEMBER',
        membershipStatus: 'ACTIVE',
        uniqueId,
      },
    });

    // Send email notification with their new member ID
    await sendEmail({
      to: user.email,
      subject: 'You are now a member of Daffodil AI Club! 🎉',
      html: membershipEmailTemplates.applicationApproved(user.name, uniqueId),
    });

    return { message: `${user.name} has been made a member directly` };
  }
}

// Membership Email Templates
const membershipEmailTemplates = {
  applicationReceived: (name: string, transactionId: string, paymentMethod: string) => `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Segoe UI', sans-serif; background: #f4f4f4; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; }
        .header { background: linear-gradient(135deg, #6366f1, #8b5cf6); padding: 30px; text-align: center; }
        .header h1 { color: white; margin: 0; font-size: 22px; }
        .content { padding: 30px; }
        .info-card { background: #f8f9fa; padding: 16px; border-radius: 8px; border-left: 4px solid #6366f1; margin: 16px 0; }
        .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 13px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📋 Membership Application Received</h1>
        </div>
        <div class="content">
          <h2>Hi ${name},</h2>
          <p>We have received your membership application for Daffodil AI Club. Our team will review your payment and application shortly.</p>
          <div class="info-card">
            <p><strong>Payment Method:</strong> ${paymentMethod}</p>
            <p><strong>Transaction ID:</strong> ${transactionId}</p>
            <p><strong>Status:</strong> ⏳ Under Review</p>
          </div>
          <p>You will receive an email notification once your application is approved. This usually takes 1-2 business days.</p>
        </div>
        <div class="footer">
          <p>Daffodil AI Club - Daffodil International University</p>
        </div>
      </div>
    </body>
    </html>
  `,

  applicationApproved: (name: string, uniqueId: string) => `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Segoe UI', sans-serif; background: #f4f4f4; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; }
        .header { background: linear-gradient(135deg, #10b981, #059669); padding: 30px; text-align: center; }
        .header h1 { color: white; margin: 0; font-size: 22px; }
        .content { padding: 30px; }
        .id-card { background: linear-gradient(135deg, #1e1b4b, #312e81); padding: 20px; border-radius: 10px; color: white; text-align: center; margin: 20px 0; }
        .id-card h3 { margin: 0 0 10px; font-size: 14px; opacity: 0.8; }
        .id-card .id { font-size: 24px; font-weight: bold; letter-spacing: 2px; }
        .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 13px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Membership Approved!</h1>
        </div>
        <div class="content">
          <h2>Congratulations, ${name}!</h2>
          <p>Your membership application for Daffodil AI Club has been <strong>approved</strong>! You are now an official club member.</p>
          <div class="id-card">
            <h3>YOUR MEMBER ID</h3>
            <div class="id">${uniqueId}</div>
          </div>
          <p>As a member, you now have access to:</p>
          <ul>
            <li>All club events and workshops</li>
            <li>Member-exclusive resources and materials</li>
            <li>Digital ID Card</li>
            <li>Certificates and badges</li>
            <li>Points and leaderboard system</li>
          </ul>
          <p>Visit your dashboard to check your membership details and ID card!</p>
        </div>
        <div class="footer">
          <p>Daffodil AI Club - Daffodil International University</p>
        </div>
      </div>
    </body>
    </html>
  `,

  applicationRejected: (name: string, reason: string) => `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Segoe UI', sans-serif; background: #f4f4f4; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; }
        .header { background: linear-gradient(135deg, #ef4444, #dc2626); padding: 30px; text-align: center; }
        .header h1 { color: white; margin: 0; font-size: 22px; }
        .content { padding: 30px; }
        .reason-box { background: #fef2f2; padding: 16px; border-radius: 8px; border-left: 4px solid #ef4444; margin: 16px 0; }
        .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 13px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Membership Application Update</h1>
        </div>
        <div class="content">
          <h2>Hi ${name},</h2>
          <p>Unfortunately, your membership application for Daffodil AI Club could not be approved at this time.</p>
          <div class="reason-box">
            <p><strong>Reason:</strong> ${reason}</p>
          </div>
          <p>You can submit a new application with the correct information. If you have any questions, please contact us.</p>
        </div>
        <div class="footer">
          <p>Daffodil AI Club - Daffodil International University</p>
        </div>
      </div>
    </body>
    </html>
  `,
};
