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

  async getNewsletterPosts(query?: { page?: number; limit?: number }) {
    const page = query?.page || 1;
    const limit = query?.limit || 20;
    const skip = (page - 1) * limit;

    const [posts, total] = await Promise.all([
      prisma.newsletterPost.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.newsletterPost.count(),
    ]);

    return {
      posts,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async getNewsletterPostById(id: string) {
    const post = await prisma.newsletterPost.findUnique({ where: { id } });
    if (!post) throw new Error('Newsletter not found');
    return post;
  }

  async deleteNewsletterPost(id: string) {
    await prisma.newsletterPost.delete({ where: { id } });
    return { message: 'Newsletter deleted' };
  }

  async sendNewsletterEmail(subject: string, description: string, coverImage?: string, pdfUrl?: string, pdfName?: string) {
    const subscribers = await prisma.newsletter.findMany({
      where: { isActive: true },
    });

    // Build newsletter HTML
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Segoe UI', sans-serif; background: #f4f4f4; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; }
          .header { background: linear-gradient(135deg, #6366f1, #8b5cf6); padding: 30px; text-align: center; }
          .header h1 { color: white; margin: 0; font-size: 24px; }
          .cover-img { width: 100%; max-height: 300px; object-fit: cover; display: block; }
          .content { padding: 30px; }
          .content h2 { color: #1e1b4b; margin: 0 0 15px; }
          .content p { color: #374151; line-height: 1.6; }
          .pdf-card { background: #f0f0ff; padding: 16px 20px; border-radius: 10px; border-left: 4px solid #6366f1; margin: 20px 0; }
          .pdf-card a { color: #6366f1; font-weight: 600; text-decoration: none; }
          .btn { display: inline-block; background: #6366f1; color: white; padding: 12px 28px; text-decoration: none; border-radius: 8px; margin: 10px 0; font-weight: 600; }
          .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 13px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📰 Daffodil AI Club Newsletter</h1>
          </div>
          ${coverImage ? `<img src="${coverImage}" alt="${subject}" class="cover-img" />` : ''}
          <div class="content">
            <h2>${subject}</h2>
            <p>${description.replace(/\n/g, '<br/>')}</p>
            ${pdfUrl ? `
              <div class="pdf-card">
                📎 <strong>Attachment:</strong> ${pdfName || 'Newsletter.pdf'}<br/>
                <a href="${pdfUrl}" target="_blank" style="margin-top: 8px; display: inline-block;">📥 Download / View PDF</a>
              </div>
            ` : ''}
          </div>
          <div class="footer">
            <p>Daffodil AI Club - Daffodil International University</p>
            <p style="font-size: 11px; color: #999;">You're receiving this because you subscribed to our newsletter.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    let sent = 0;
    for (const sub of subscribers) {
      const success = await sendEmail({
        to: sub.email,
        subject: `📰 ${subject}`,
        html,
      });
      if (success) sent++;
    }

    // Save newsletter post to DB
    const post = await prisma.newsletterPost.create({
      data: {
        subject,
        description,
        coverImage: coverImage || null,
        pdfUrl: pdfUrl || null,
        pdfName: pdfName || null,
        sentCount: sent,
        totalCount: subscribers.length,
      },
    });

    return { message: `Newsletter sent to ${sent} of ${subscribers.length} subscribers`, sent, total: subscribers.length, postId: post.id };
  }
}

export const contactService = new ContactService();
