import { prisma } from '../../config/database.js';
import { sendEmail } from '../../utils/email.js';

export class ContactService {
  async submitContact(data: any) {
    const contact = await prisma.contact.create({
      data: {
        name: data.name,
        email: data.email,
        subject: data.subject,
        message: data.message,
      },
    });

    return contact;
  }

  async getContacts(query: any) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (query.unread === 'true') {
      where.isRead = false;
    }

    const [contacts, total, unreadCount] = await Promise.all([
      prisma.contact.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.contact.count({ where }),
      prisma.contact.count({ where: { isRead: false } }),
    ]);

    return {
      contacts,
      unreadCount,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async markAsRead(id: string) {
    const contact = await prisma.contact.update({
      where: { id },
      data: { isRead: true },
    });

    return contact;
  }

  async deleteContact(id: string) {
    await prisma.contact.delete({ where: { id } });
    return { message: 'Contact message deleted' };
  }

  async subscribeNewsletter(email: string) {
    const existing = await prisma.newsletter.findUnique({ where: { email } });

    if (existing) {
      if (existing.isActive) {
        throw new Error('Already subscribed');
      }
      await prisma.newsletter.update({
        where: { email },
        data: { isActive: true },
      });
      return { message: 'Subscription reactivated' };
    }

    await prisma.newsletter.create({
      data: { email },
    });

    return { message: 'Subscribed successfully' };
  }

  async unsubscribeNewsletter(email: string) {
    const subscriber = await prisma.newsletter.findUnique({ where: { email } });

    if (!subscriber) {
      throw new Error('Email not found');
    }

    await prisma.newsletter.update({
      where: { email },
      data: { isActive: false },
    });

    return { message: 'Unsubscribed successfully' };
  }

  async getNewsletterSubscribers() {
    const subscribers = await prisma.newsletter.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });

    return subscribers;
  }

  async sendNewsletterEmail(subject: string, html: string) {
    const subscribers = await prisma.newsletter.findMany({
      where: { isActive: true },
    });

    let sent = 0;
    for (const sub of subscribers) {
      const success = await sendEmail({
        to: sub.email,
        subject,
        html,
      });
      if (success) sent++;
    }

    return { message: `Email sent to ${sent} subscribers` };
  }
}

export const contactService = new ContactService();
