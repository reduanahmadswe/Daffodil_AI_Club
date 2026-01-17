import { prisma } from '../../config/database.js';
import { generateSlug } from '../../utils/helpers.js';

export class ProjectService {
  async createProject(data: any) {
    let slug = generateSlug(data.title);
    const existingSlug = await prisma.project.findUnique({ where: { slug } });
    if (existingSlug) {
      slug = `${slug}-${Date.now()}`;
    }

    const project = await prisma.project.create({
      data: {
        ...data,
        slug,
        technologies: data.technologies ? JSON.stringify(data.technologies) : null,
        teamMembers: data.teamMembers ? JSON.stringify(data.teamMembers) : null,
      },
      include: {
        author: {
          select: { id: true, name: true, uniqueId: true, profileImage: true },
        },
      },
    });

    // Award points
    await prisma.user.update({
      where: { id: data.authorId },
      data: { points: { increment: 15 } },
    });

    return project;
  }

  async getProjects(query: any) {
    const page = query.page || 1;
    const limit = query.limit || 12;
    const skip = (page - 1) * limit;

    const where: any = { isPublished: true };

    if (query.category) {
      where.category = query.category;
    }

    if (query.search) {
      where.OR = [
        { title: { contains: query.search } },
        { description: { contains: query.search } },
      ];
    }

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          author: {
            select: { id: true, name: true, uniqueId: true, profileImage: true },
          },
        },
      }),
      prisma.project.count({ where }),
    ]);

    return {
      projects,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async getProject(idOrSlug: string) {
    const project = await prisma.project.findFirst({
      where: {
        OR: [{ id: idOrSlug }, { slug: idOrSlug }],
      },
      include: {
        author: {
          select: { id: true, name: true, uniqueId: true, profileImage: true, department: true },
        },
      },
    });

    if (!project) {
      throw new Error('Project not found');
    }

    return project;
  }

  async getUserProjects(userId: string) {
    const projects = await prisma.project.findMany({
      where: { authorId: userId },
      orderBy: { createdAt: 'desc' },
    });

    return projects;
  }

  async updateProject(id: string, userId: string, isAdmin: boolean, data: any) {
    const project = await prisma.project.findUnique({ where: { id } });

    if (!project) {
      throw new Error('Project not found');
    }

    if (!isAdmin && project.authorId !== userId) {
      throw new Error('Not authorized');
    }

    const updated = await prisma.project.update({
      where: { id },
      data: {
        ...data,
        technologies: data.technologies ? JSON.stringify(data.technologies) : undefined,
        teamMembers: data.teamMembers ? JSON.stringify(data.teamMembers) : undefined,
      },
    });

    return updated;
  }

  async deleteProject(id: string, userId: string, isAdmin: boolean) {
    const project = await prisma.project.findUnique({ where: { id } });

    if (!project) {
      throw new Error('Project not found');
    }

    if (!isAdmin && project.authorId !== userId) {
      throw new Error('Not authorized');
    }

    await prisma.project.delete({ where: { id } });
    return { message: 'Project deleted' };
  }

  async approveProject(id: string) {
    const project = await prisma.project.update({
      where: { id },
      data: { isPublished: true },
    });

    await prisma.user.update({
      where: { id: project.authorId },
      data: { points: { increment: 25 } },
    });

    return project;
  }

  async getFeaturedProjects(limit: number = 6) {
    const projects = await prisma.project.findMany({
      where: { isPublished: true, isFeatured: true },
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: { id: true, name: true, uniqueId: true, profileImage: true },
        },
      },
    });

    return projects;
  }
}

export const projectService = new ProjectService();
