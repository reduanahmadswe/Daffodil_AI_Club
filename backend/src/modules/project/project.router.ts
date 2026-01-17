import { Router, Request, Response } from 'express';
import { projectService } from './project.service.js';
import { authenticate, adminOrExecutive } from '../../middleware/auth.middleware.js';
import { AuthRequest } from '../../middleware/auth.middleware.js';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const { page, limit, category, search } = req.query;
    const result = await projectService.getProjects({
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
      category: category as string,
      search: search as string,
    });
    res.json({ success: true, data: result.projects, pagination: result.pagination });
  } catch (error) {
    res.status(400).json({ success: false, message: (error as Error).message });
  }
});

router.get('/featured', async (req: Request, res: Response) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 6;
    const projects = await projectService.getFeaturedProjects(limit);
    res.json({ success: true, data: projects });
  } catch (error) {
    res.status(400).json({ success: false, message: (error as Error).message });
  }
});

router.get('/my', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const projects = await projectService.getUserProjects(req.user!.id);
    res.json({ success: true, data: projects });
  } catch (error) {
    res.status(400).json({ success: false, message: (error as Error).message });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const project = await projectService.getProject(req.params.id);
    res.json({ success: true, data: project });
  } catch (error) {
    res.status(404).json({ success: false, message: (error as Error).message });
  }
});

router.post('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const project = await projectService.createProject({
      ...req.body,
      authorId: req.user!.id,
    });
    res.status(201).json({ success: true, message: 'Project submitted', data: project });
  } catch (error) {
    res.status(400).json({ success: false, message: (error as Error).message });
  }
});

router.put('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const isAdmin = ['ADMIN', 'EXECUTIVE'].includes(req.user!.role);
    const project = await projectService.updateProject(req.params.id, req.user!.id, isAdmin, req.body);
    res.json({ success: true, data: project });
  } catch (error) {
    res.status(400).json({ success: false, message: (error as Error).message });
  }
});

router.delete('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const isAdmin = ['ADMIN', 'EXECUTIVE'].includes(req.user!.role);
    await projectService.deleteProject(req.params.id, req.user!.id, isAdmin);
    res.json({ success: true, message: 'Project deleted' });
  } catch (error) {
    res.status(400).json({ success: false, message: (error as Error).message });
  }
});

router.post('/:id/approve', authenticate, adminOrExecutive, async (req: AuthRequest, res: Response) => {
  try {
    const project = await projectService.approveProject(req.params.id);
    res.json({ success: true, message: 'Project approved', data: project });
  } catch (error) {
    res.status(400).json({ success: false, message: (error as Error).message });
  }
});

export default router;
