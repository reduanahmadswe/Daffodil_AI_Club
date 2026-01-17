import { prisma } from '../../config/database.js';
import { generateSlug } from '../../utils/helpers.js';
import { BlogStatus } from '@prisma/client';

interface CreateBlogData {
  title: string;
  excerpt?: string;
  content: string;
  coverImage?: string;
  category?: string;
  tags?: string[];
  authorId: string;
}

interface BlogQuery {
  page?: number;
  limit?: number;
  category?: string;
  status?: BlogStatus;
  authorId?: string;
  search?: string;
}

export class BlogService {
  async createBlog(data: CreateBlogData) {
    let slug = generateSlug(data.title);
    
    const existingSlug = await prisma.blog.findUnique({ where: { slug } });
    if (existingSlug) {
      slug = `${slug}-${Date.now()}`;
    }

    const blog = await prisma.blog.create({
      data: {
        title: data.title,
        slug,
        excerpt: data.excerpt,
        content: data.content,
        coverImage: data.coverImage,
        category: data.category,
        tags: data.tags ? JSON.stringify(data.tags) : null,
        authorId: data.authorId,
        status: 'PENDING',
      },
      include: {
        author: {
          select: { id: true, name: true, uniqueId: true, profileImage: true },
        },
      },
    });

    // Award points for blog submission
    await prisma.user.update({
      where: { id: data.authorId },
      data: { points: { increment: 10 } },
    });

    return blog;
  }

  async getBlogs(query: BlogQuery) {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const where: any = { status: 'PUBLISHED' };

    if (query.category) {
      where.category = query.category;
    }

    if (query.search) {
      where.OR = [
        { title: { contains: query.search } },
        { content: { contains: query.search } },
      ];
    }

    const [blogs, total] = await Promise.all([
      prisma.blog.findMany({
        where,
        skip,
        take: limit,
        orderBy: { publishedAt: 'desc' },
        include: {
          author: {
            select: { id: true, name: true, uniqueId: true, profileImage: true },
          },
        },
      }),
      prisma.blog.count({ where }),
    ]);

    return {
      blogs,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async getAdminBlogs(query: BlogQuery) {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (query.status) {
      where.status = query.status;
    }

    const [blogs, total] = await Promise.all([
      prisma.blog.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          author: {
            select: { id: true, name: true, email: true, uniqueId: true },
          },
        },
      }),
      prisma.blog.count({ where }),
    ]);

    return {
      blogs,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async getBlog(idOrSlug: string) {
    const blog = await prisma.blog.findFirst({
      where: {
        OR: [{ id: idOrSlug }, { slug: idOrSlug }],
      },
      include: {
        author: {
          select: { id: true, name: true, uniqueId: true, profileImage: true, department: true },
        },
      },
    });

    if (!blog) {
      throw new Error('Blog not found');
    }

    // Increment views
    await prisma.blog.update({
      where: { id: blog.id },
      data: { views: { increment: 1 } },
    });

    return blog;
  }

  async getUserBlogs(userId: string) {
    const blogs = await prisma.blog.findMany({
      where: { authorId: userId },
      orderBy: { createdAt: 'desc' },
    });

    return blogs;
  }

  async updateBlog(id: string, userId: string, isAdmin: boolean, data: Partial<CreateBlogData>) {
    const blog = await prisma.blog.findUnique({ where: { id } });

    if (!blog) {
      throw new Error('Blog not found');
    }

    if (!isAdmin && blog.authorId !== userId) {
      throw new Error('Not authorized to update this blog');
    }

    const updated = await prisma.blog.update({
      where: { id },
      data: {
        title: data.title,
        excerpt: data.excerpt,
        content: data.content,
        coverImage: data.coverImage,
        category: data.category,
        tags: data.tags ? JSON.stringify(data.tags) : undefined,
        status: isAdmin ? undefined : 'PENDING', // Reset to pending on edit
      },
    });

    return updated;
  }

  async approveBlog(id: string) {
    const blog = await prisma.blog.update({
      where: { id },
      data: {
        status: 'PUBLISHED',
        publishedAt: new Date(),
      },
    });

    // Award points for approved blog
    await prisma.user.update({
      where: { id: blog.authorId },
      data: { points: { increment: 20 } },
    });

    return blog;
  }

  async rejectBlog(id: string) {
    const blog = await prisma.blog.update({
      where: { id },
      data: { status: 'REJECTED' },
    });

    return blog;
  }

  async deleteBlog(id: string, userId: string, isAdmin: boolean) {
    const blog = await prisma.blog.findUnique({ where: { id } });

    if (!blog) {
      throw new Error('Blog not found');
    }

    if (!isAdmin && blog.authorId !== userId) {
      throw new Error('Not authorized to delete this blog');
    }

    await prisma.blog.delete({ where: { id } });
    return { message: 'Blog deleted successfully' };
  }
}

export const blogService = new BlogService();
