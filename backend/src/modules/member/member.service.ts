import { prisma } from '../../config/database.js';
import { Role } from '@prisma/client';

interface MemberQuery {
  page?: number;
  limit?: number;
  department?: string;
  batch?: string;
  role?: Role;
  search?: string;
}

export class MemberService {
  async getMembers(query: MemberQuery) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = { isVerified: true };

    if (query.department) {
      where.department = query.department;
    }

    if (query.batch) {
      where.batch = query.batch;
    }

    if (query.role) {
      where.role = query.role;
    }

    if (query.search) {
      where.OR = [
        { name: { contains: query.search } },
        { uniqueId: { contains: query.search } },
        { department: { contains: query.search } },
      ];
    }

    const [members, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { points: 'desc' },
        select: {
          id: true,
          uniqueId: true,
          name: true,
          department: true,
          batch: true,
          profileImage: true,
          role: true,
          points: true,
          createdAt: true,
          badges: {
            include: { badge: true },
          },
        },
      }),
      prisma.user.count({ where }),
    ]);

    return {
      members,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async getLeaderboard(limit: number = 10) {
    const members = await prisma.user.findMany({
      where: { isVerified: true },
      take: limit,
      orderBy: { points: 'desc' },
      select: {
        id: true,
        uniqueId: true,
        name: true,
        department: true,
        profileImage: true,
        points: true,
        badges: {
          include: { badge: true },
        },
      },
    });

    return members;
  }

  async getMember(idOrUniqueId: string) {
    const member = await prisma.user.findFirst({
      where: {
        OR: [{ id: idOrUniqueId }, { uniqueId: idOrUniqueId }],
        isVerified: true,
      },
      select: {
        id: true,
        uniqueId: true,
        name: true,
        department: true,
        batch: true,
        profileImage: true,
        role: true,
        points: true,
        createdAt: true,
        badges: {
          include: { badge: true },
        },
        _count: {
          select: {
            blogs: { where: { status: 'PUBLISHED' } },
            projects: { where: { isPublished: true } },
            eventRegistrations: true,
          },
        },
      },
    });

    if (!member) {
      throw new Error('Member not found');
    }

    return member;
  }

  async updateMemberRole(userId: string, role: Role) {
    const member = await prisma.user.update({
      where: { id: userId },
      data: { role },
      select: {
        id: true,
        uniqueId: true,
        name: true,
        email: true,
        role: true,
      },
    });

    return member;
  }

  async getExecutives() {
    const executives = await prisma.executive.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    });

    return executives;
  }

  async createExecutive(data: any) {
    const executive = await prisma.executive.create({ data });
    return executive;
  }

  async updateExecutive(id: string, data: any) {
    const executive = await prisma.executive.update({
      where: { id },
      data,
    });
    return executive;
  }

  async deleteExecutive(id: string) {
    await prisma.executive.delete({ where: { id } });
    return { message: 'Executive removed' };
  }

  async getStatistics() {
    const [
      totalMembers,
      totalEvents,
      totalBlogs,
      totalProjects,
    ] = await Promise.all([
      prisma.user.count({ where: { isVerified: true } }),
      prisma.event.count({ where: { isPublished: true } }),
      prisma.blog.count({ where: { status: 'PUBLISHED' } }),
      prisma.project.count({ where: { isPublished: true } }),
    ]);

    return {
      totalMembers,
      totalEvents,
      totalBlogs,
      totalProjects,
    };
  }
}

export const memberService = new MemberService();
