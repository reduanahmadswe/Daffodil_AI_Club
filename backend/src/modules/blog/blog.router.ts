import { Router } from 'express';
import { blogService } from './blog.service.js';
import { authenticate, adminOrExecutive } from '../../middleware/auth.middleware.js';
import { AuthRequest } from '../../middleware/auth.middleware.js';
import { Response, Request } from 'express';

const router = Router();

// Get published blogs
router.get('/', async (req: Request, res: Response) => {
  try {
    const { page, limit, category, search } = req.query;
    const result = await blogService.getBlogs({
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
      category: category as string,
      search: search as string,
    });
    res.json({ success: true, data: result.blogs, pagination: result.pagination });
  } catch (error) {
    res.status(400).json({ success: false, message: (error as Error).message });
  }
});

// Get single blog
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const blog = await blogService.getBlog(req.params.id);
    res.json({ success: true, data: blog });
  } catch (error) {
    res.status(404).json({ success: false, message: (error as Error).message });
  }
});

// Get my blogs
router.get('/my/posts', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const blogs = await blogService.getUserBlogs(req.user!.id);
    res.json({ success: true, data: blogs });
  } catch (error) {
    res.status(400).json({ success: false, message: (error as Error).message });
  }
});

// Create blog
router.post('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const blog = await blogService.createBlog({
      ...req.body,
      authorId: req.user!.id,
    });
    res.status(201).json({ success: true, message: 'Blog submitted for review', data: blog });
  } catch (error) {
    res.status(400).json({ success: false, message: (error as Error).message });
  }
});

// Update blog
router.put('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const isAdmin = ['ADMIN', 'EXECUTIVE'].includes(req.user!.role);
    const blog = await blogService.updateBlog(req.params.id, req.user!.id, isAdmin, req.body);
    res.json({ success: true, message: 'Blog updated', data: blog });
  } catch (error) {
    res.status(400).json({ success: false, message: (error as Error).message });
  }
});

// Delete blog
router.delete('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const isAdmin = ['ADMIN', 'EXECUTIVE'].includes(req.user!.role);
    await blogService.deleteBlog(req.params.id, req.user!.id, isAdmin);
    res.json({ success: true, message: 'Blog deleted' });
  } catch (error) {
    res.status(400).json({ success: false, message: (error as Error).message });
  }
});

// Admin: Get all blogs
router.get('/admin/all', authenticate, adminOrExecutive, async (req: AuthRequest, res: Response) => {
  try {
    const { page, limit, status } = req.query;
    const result = await blogService.getAdminBlogs({
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
      status: status as any,
    });
    res.json({ success: true, data: result.blogs, pagination: result.pagination });
  } catch (error) {
    res.status(400).json({ success: false, message: (error as Error).message });
  }
});

// Admin: Approve blog
router.post('/:id/approve', authenticate, adminOrExecutive, async (req: AuthRequest, res: Response) => {
  try {
    const blog = await blogService.approveBlog(req.params.id);
    res.json({ success: true, message: 'Blog approved', data: blog });
  } catch (error) {
    res.status(400).json({ success: false, message: (error as Error).message });
  }
});

// Admin: Reject blog
router.post('/:id/reject', authenticate, adminOrExecutive, async (req: AuthRequest, res: Response) => {
  try {
    const blog = await blogService.rejectBlog(req.params.id);
    res.json({ success: true, message: 'Blog rejected', data: blog });
  } catch (error) {
    res.status(400).json({ success: false, message: (error as Error).message });
  }
});

export default router;
