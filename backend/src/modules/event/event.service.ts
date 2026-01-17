import { prisma } from '../../config/database.js';
import { generateSlug } from '../../utils/helpers.js';
import { generateQRCode } from '../../utils/generators.js';
import { EventType, RegistrationStatus } from '@prisma/client';

interface CreateEventData {
  title: string;
  description: string;
  content?: string;
  image?: string;
  date: Date;
  endDate?: Date;
  time?: string;
  venue?: string;
  type?: EventType;
  capacity?: number;
  fee?: number;
  isPublished?: boolean;
  isFeatured?: boolean;
}

interface EventQuery {
  page?: number;
  limit?: number;
  type?: EventType;
  upcoming?: boolean;
  featured?: boolean;
  search?: string;
}

export class EventService {
  /**
   * Create a new event
   */
  async createEvent(data: CreateEventData) {
    let slug = generateSlug(data.title);
    
    // Ensure unique slug
    const existingSlug = await prisma.event.findUnique({ where: { slug } });
    if (existingSlug) {
      slug = `${slug}-${Date.now()}`;
    }

    const event = await prisma.event.create({
      data: {
        ...data,
        slug,
        date: new Date(data.date),
        endDate: data.endDate ? new Date(data.endDate) : null,
      },
    });

    return event;
  }

  /**
   * Get all events with filters
   */
  async getEvents(query: EventQuery) {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (query.type) {
      where.type = query.type;
    }

    if (query.upcoming) {
      where.date = { gte: new Date() };
    }

    if (query.featured) {
      where.isFeatured = true;
    }

    if (query.search) {
      where.OR = [
        { title: { contains: query.search } },
        { description: { contains: query.search } },
      ];
    }

    // Only show published events for public queries
    where.isPublished = true;

    const [events, total] = await Promise.all([
      prisma.event.findMany({
        where,
        skip,
        take: limit,
        orderBy: { date: 'desc' },
        include: {
          _count: {
            select: { registrations: true },
          },
        },
      }),
      prisma.event.count({ where }),
    ]);

    return {
      events,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get all events for admin (including unpublished)
   */
  async getAdminEvents(query: EventQuery) {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (query.type) {
      where.type = query.type;
    }

    if (query.search) {
      where.OR = [
        { title: { contains: query.search } },
        { description: { contains: query.search } },
      ];
    }

    const [events, total] = await Promise.all([
      prisma.event.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: { registrations: true, attendances: true },
          },
        },
      }),
      prisma.event.count({ where }),
    ]);

    return {
      events,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get upcoming events
   */
  async getUpcomingEvents(limit: number = 4) {
    const events = await prisma.event.findMany({
      where: {
        isPublished: true,
        date: { gte: new Date() },
      },
      take: limit,
      orderBy: { date: 'asc' },
      include: {
        _count: {
          select: { registrations: true },
        },
      },
    });

    return events;
  }

  /**
   * Get event by ID or slug
   */
  async getEvent(idOrSlug: string) {
    const event = await prisma.event.findFirst({
      where: {
        OR: [{ id: idOrSlug }, { slug: idOrSlug }],
      },
      include: {
        registrations: {
          include: {
            user: {
              select: { id: true, name: true, uniqueId: true, profileImage: true },
            },
          },
        },
        _count: {
          select: { registrations: true, attendances: true },
        },
      },
    });

    if (!event) {
      throw new Error('Event not found');
    }

    return event;
  }

  /**
   * Update event
   */
  async updateEvent(id: string, data: Partial<CreateEventData>) {
    const event = await prisma.event.update({
      where: { id },
      data: {
        ...data,
        date: data.date ? new Date(data.date) : undefined,
        endDate: data.endDate ? new Date(data.endDate) : undefined,
      },
    });

    return event;
  }

  /**
   * Delete event
   */
  async deleteEvent(id: string) {
    await prisma.event.delete({ where: { id } });
    return { message: 'Event deleted successfully' };
  }

  /**
   * Register for an event
   */
  async registerForEvent(userId: string, eventId: string) {
    // Check if event exists and is published
    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event) {
      throw new Error('Event not found');
    }

    if (!event.isPublished) {
      throw new Error('Event is not open for registration');
    }

    // Check if event date has passed
    if (new Date(event.date) < new Date()) {
      throw new Error('Event has already ended');
    }

    // Check if already registered
    const existingReg = await prisma.eventRegistration.findUnique({
      where: {
        userId_eventId: { userId, eventId },
      },
    });

    if (existingReg) {
      throw new Error('Already registered for this event');
    }

    // Check capacity
    if (event.capacity) {
      const regCount = await prisma.eventRegistration.count({
        where: { eventId, status: { not: 'CANCELLED' } },
      });

      if (regCount >= event.capacity) {
        throw new Error('Event is full');
      }
    }

    // Get user for QR code
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }

    // Generate QR code
    const qrData = JSON.stringify({
      eventId: event.id,
      userId: user.id,
      uniqueId: user.uniqueId,
      eventTitle: event.title,
    });
    const qrCode = await generateQRCode(qrData);

    // Create registration
    const registration = await prisma.eventRegistration.create({
      data: {
        userId,
        eventId,
        status: 'CONFIRMED',
        qrCode,
      },
      include: {
        event: {
          select: { id: true, title: true, date: true, venue: true },
        },
      },
    });

    // Award points
    await prisma.user.update({
      where: { id: userId },
      data: { points: { increment: 5 } },
    });

    return registration;
  }

  /**
   * Cancel event registration
   */
  async cancelRegistration(userId: string, eventId: string) {
    const registration = await prisma.eventRegistration.findUnique({
      where: {
        userId_eventId: { userId, eventId },
      },
    });

    if (!registration) {
      throw new Error('Registration not found');
    }

    await prisma.eventRegistration.update({
      where: { id: registration.id },
      data: { status: 'CANCELLED' },
    });

    return { message: 'Registration cancelled successfully' };
  }

  /**
   * Mark attendance (QR scan)
   */
  async markAttendance(eventId: string, uniqueId: string) {
    // Check if user is registered
    const user = await prisma.user.findUnique({ where: { uniqueId } });
    if (!user) {
      throw new Error('Member not found');
    }

    const registration = await prisma.eventRegistration.findUnique({
      where: {
        userId_eventId: { userId: user.id, eventId },
      },
    });

    if (!registration) {
      throw new Error('Not registered for this event');
    }

    // Check if already marked
    const existingAttendance = await prisma.eventAttendance.findUnique({
      where: {
        eventId_uniqueId: { eventId, uniqueId },
      },
    });

    if (existingAttendance) {
      throw new Error('Attendance already marked');
    }

    // Mark attendance
    const attendance = await prisma.eventAttendance.create({
      data: {
        eventId,
        uniqueId,
      },
    });

    // Update registration status
    await prisma.eventRegistration.update({
      where: { id: registration.id },
      data: { status: 'ATTENDED' },
    });

    // Award points for attendance
    await prisma.user.update({
      where: { id: user.id },
      data: { points: { increment: 10 } },
    });

    return {
      message: 'Attendance marked successfully',
      attendance,
    };
  }

  /**
   * Get user's event registrations
   */
  async getUserRegistrations(userId: string) {
    const registrations = await prisma.eventRegistration.findMany({
      where: { userId },
      include: {
        event: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return registrations;
  }

  /**
   * Get event registrations (for admin)
   */
  async getEventRegistrations(eventId: string) {
    const registrations = await prisma.eventRegistration.findMany({
      where: { eventId },
      include: {
        user: {
          select: {
            id: true,
            uniqueId: true,
            name: true,
            email: true,
            department: true,
            batch: true,
            profileImage: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return registrations;
  }
}

export const eventService = new EventService();
