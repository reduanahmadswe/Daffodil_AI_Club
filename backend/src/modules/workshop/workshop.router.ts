import { Router, Request, Response } from 'express';
import { workshopService } from './workshop.service.js';
import { authenticate, adminOrExecutive } from '../../middleware/auth.middleware.js';
import { AuthRequest } from '../../middleware/auth.middleware.js';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const { page, limit, mode } = req.query;
    const result = await workshopService.getWorkshops({
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
      mode: mode as string,
    });
    res.json({ success: true, data: result.workshops, pagination: result.pagination });
  } catch (error) {
    res.status(400).json({ success: false, message: (error as Error).message });
  }
});

router.get('/my', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const workshops = await workshopService.getUserWorkshops(req.user!.id);
    res.json({ success: true, data: workshops });
  } catch (error) {
    res.status(400).json({ success: false, message: (error as Error).message });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const workshop = await workshopService.getWorkshop(req.params.id);
    res.json({ success: true, data: workshop });
  } catch (error) {
    res.status(404).json({ success: false, message: (error as Error).message });
  }
});

router.post('/:id/register', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const registration = await workshopService.registerForWorkshop(req.user!.id, req.params.id);
    res.status(201).json({ success: true, message: 'Registered successfully', data: registration });
  } catch (error) {
    res.status(400).json({ success: false, message: (error as Error).message });
  }
});

// Admin routes
router.post('/', authenticate, adminOrExecutive, async (req: AuthRequest, res: Response) => {
  try {
    const workshop = await workshopService.createWorkshop(req.body);
    res.status(201).json({ success: true, data: workshop });
  } catch (error) {
    res.status(400).json({ success: false, message: (error as Error).message });
  }
});

router.put('/:id', authenticate, adminOrExecutive, async (req: AuthRequest, res: Response) => {
  try {
    const workshop = await workshopService.updateWorkshop(req.params.id, req.body);
    res.json({ success: true, data: workshop });
  } catch (error) {
    res.status(400).json({ success: false, message: (error as Error).message });
  }
});

router.delete('/:id', authenticate, adminOrExecutive, async (req: AuthRequest, res: Response) => {
  try {
    await workshopService.deleteWorkshop(req.params.id);
    res.json({ success: true, message: 'Workshop deleted' });
  } catch (error) {
    res.status(400).json({ success: false, message: (error as Error).message });
  }
});

router.post('/:workshopId/complete/:userId', authenticate, adminOrExecutive, async (req: AuthRequest, res: Response) => {
  try {
    const registration = await workshopService.markWorkshopComplete(req.params.userId, req.params.workshopId);
    res.json({ success: true, message: 'Marked as complete', data: registration });
  } catch (error) {
    res.status(400).json({ success: false, message: (error as Error).message });
  }
});

export default router;
