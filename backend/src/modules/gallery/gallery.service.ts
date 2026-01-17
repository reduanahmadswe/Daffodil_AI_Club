import { prisma } from '../../config/database.js';

export class GalleryService {
  async getImages(query: any) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (query.year) {
      where.year = parseInt(query.year);
    }

    if (query.eventName) {
      where.eventName = { contains: query.eventName };
    }

    if (query.category) {
      where.category = query.category;
    }

    const [images, total] = await Promise.all([
      prisma.gallery.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.gallery.count({ where }),
    ]);

    return {
      images,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async uploadImage(data: any) {
    const image = await prisma.gallery.create({
      data: {
        title: data.title,
        image: data.image,
        eventId: data.eventId,
        eventName: data.eventName,
        category: data.category,
        year: data.year || new Date().getFullYear(),
        order: data.order || 0,
      },
    });

    return image;
  }

  async uploadMultipleImages(images: any[]) {
    const created = await prisma.gallery.createMany({
      data: images.map((img) => ({
        title: img.title,
        image: img.image,
        eventId: img.eventId,
        eventName: img.eventName,
        category: img.category,
        year: img.year || new Date().getFullYear(),
        order: img.order || 0,
      })),
    });

    return { count: created.count };
  }

  async deleteImage(id: string) {
    await prisma.gallery.delete({ where: { id } });
    return { message: 'Image deleted' };
  }

  async getYears() {
    const years = await prisma.gallery.groupBy({
      by: ['year'],
      orderBy: { year: 'desc' },
    });

    return years.map((y) => y.year).filter(Boolean);
  }

  async getEventNames() {
    const events = await prisma.gallery.groupBy({
      by: ['eventName'],
      where: { eventName: { not: null } },
    });

    return events.map((e) => e.eventName).filter(Boolean);
  }
}

export const galleryService = new GalleryService();
