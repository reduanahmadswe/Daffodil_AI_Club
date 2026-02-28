import { prisma } from '../../config/database.js';
import { generateSlug } from '../../utils/helpers.js';

function sanitizeSyllabus(value: any): string | null {
  if (value === null || value === undefined) return null;
  if (Array.isArray(value)) return value.length > 0 ? JSON.stringify(value) : null;
  if (typeof value === 'string') return value.trim() || null;
  return JSON.stringify(value);
}

export class WorkshopService {
  async createWorkshop(data: any) {
    let slug = generateSlug(data.title);
    const existingSlug = await prisma.workshop.findUnique({ where: { slug } });
    if (existingSlug) {
      slug = `${slug}-${Date.now()}`;
    }

    const workshop = await prisma.workshop.create({
      data: {
        ...data,
        slug,
        syllabus: sanitizeSyllabus(data.syllabus),
        startDate: new Date(data.startDate),
        endDate: data.endDate ? new Date(data.endDate) : null,
      },
    });

    return workshop;
  }

  async getWorkshops(query: any) {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const where: any = { isPublished: true };

    if (query.mode) {
      where.mode = query.mode;
    }

    const [workshops, total] = await Promise.all([
      prisma.workshop.findMany({
        where,
        skip,
        take: limit,
        orderBy: { startDate: 'desc' },
        include: {
          _count: { select: { registrations: true } },
        },
      }),
      prisma.workshop.count({ where }),
    ]);

    return {
      workshops,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async getWorkshop(idOrSlug: string) {
    const workshop = await prisma.workshop.findFirst({
      where: {
        OR: [{ id: idOrSlug }, { slug: idOrSlug }],
      },
      include: {
        _count: { select: { registrations: true } },
      },
    });

    if (!workshop) {
      throw new Error('Workshop not found');
    }

    return workshop;
  }

  async updateWorkshop(id: string, data: any) {
    const workshop = await prisma.workshop.update({
      where: { id },
      data: {
        ...data,
        syllabus: data.syllabus !== undefined ? sanitizeSyllabus(data.syllabus) : undefined,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        endDate: data.endDate ? new Date(data.endDate) : undefined,
      },
    });

    return workshop;
  }

  async deleteWorkshop(id: string) {
    await prisma.workshop.delete({ where: { id } });
    return { message: 'Workshop deleted' };
  }

  async registerForWorkshop(userId: string, workshopId: string) {
    const workshop = await prisma.workshop.findUnique({ where: { id: workshopId } });
    if (!workshop) {
      throw new Error('Workshop not found');
    }

    const existingReg = await prisma.workshopRegistration.findUnique({
      where: { userId_workshopId: { userId, workshopId } },
    });

    if (existingReg) {
      throw new Error('Already registered');
    }

    if (workshop.capacity) {
      const regCount = await prisma.workshopRegistration.count({
        where: { workshopId, status: { not: 'CANCELLED' } },
      });
      if (regCount >= workshop.capacity) {
        throw new Error('Workshop is full');
      }
    }

    const registration = await prisma.workshopRegistration.create({
      data: {
        userId,
        workshopId,
        status: workshop.fee > 0 ? 'PENDING' : 'CONFIRMED',
        paymentStatus: workshop.fee > 0 ? 'UNPAID' : 'PAID',
      },
      include: { workshop: true },
    });

    await prisma.user.update({
      where: { id: userId },
      data: { points: { increment: 5 } },
    });

    return registration;
  }

  async getUserWorkshops(userId: string) {
    const registrations = await prisma.workshopRegistration.findMany({
      where: { userId },
      include: { workshop: true },
      orderBy: { createdAt: 'desc' },
    });

    return registrations;
  }

  async markWorkshopComplete(userId: string, workshopId: string) {
    const registration = await prisma.workshopRegistration.update({
      where: { userId_workshopId: { userId, workshopId } },
      data: { completionStatus: 'COMPLETED' },
    });

    // Award completion points
    await prisma.user.update({
      where: { id: userId },
      data: { points: { increment: 30 } },
    });

    return registration;
  }
}

export const workshopService = new WorkshopService();
