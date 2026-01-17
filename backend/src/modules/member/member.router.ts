import { Router } from 'express';
import { memberService } from './member.service.js';
import { authenticate, adminOnly, adminOrExecutive } from '../../middleware/auth.middleware.js';
import { AuthRequest } from '../../middleware/auth.middleware.js';
import { Response, Request } from 'express';

const router = Router();

// Get members directory
router.get('/', async (req: Request, res: Response) => {
  try {
    const { page, limit, department, batch, search } = req.query;
    const result = await memberService.getMembers({
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
      department: department as string,
      batch: batch as string,
      search: search as string,
    });
    res.json({ success: true, data: result.members, pagination: result.pagination });
  } catch (error) {
    res.status(400).json({ success: false, message: (error as Error).message });
  }
});

// Get leaderboard
router.get('/leaderboard', async (req: Request, res: Response) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const members = await memberService.getLeaderboard(limit);
    res.json({ success: true, data: members });
  } catch (error) {
    res.status(400).json({ success: false, message: (error as Error).message });
  }
});

// Get executives
router.get('/executives', async (req: Request, res: Response) => {
  try {
    const executives = await memberService.getExecutives();
    res.json({ success: true, data: executives });
  } catch (error) {
    res.status(400).json({ success: false, message: (error as Error).message });
  }
});

// Get statistics
router.get('/stats', async (req: Request, res: Response) => {
  try {
    const stats = await memberService.getStatistics();
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(400).json({ success: false, message: (error as Error).message });
  }
});

// Get single member
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const member = await memberService.getMember(req.params.id);
    res.json({ success: true, data: member });
  } catch (error) {
    res.status(404).json({ success: false, message: (error as Error).message });
  }
});

// Admin: Update member role
router.patch('/:id/role', authenticate, adminOnly, async (req: AuthRequest, res: Response) => {
  try {
    const { role } = req.body;
    const member = await memberService.updateMemberRole(req.params.id, role);
    res.json({ success: true, message: 'Role updated', data: member });
  } catch (error) {
    res.status(400).json({ success: false, message: (error as Error).message });
  }
});

// Admin: Manage executives
router.post('/executives', authenticate, adminOrExecutive, async (req: AuthRequest, res: Response) => {
  try {
    const executive = await memberService.createExecutive(req.body);
    res.status(201).json({ success: true, data: executive });
  } catch (error) {
    res.status(400).json({ success: false, message: (error as Error).message });
  }
});

router.put('/executives/:id', authenticate, adminOrExecutive, async (req: AuthRequest, res: Response) => {
  try {
    const executive = await memberService.updateExecutive(req.params.id, req.body);
    res.json({ success: true, data: executive });
  } catch (error) {
    res.status(400).json({ success: false, message: (error as Error).message });
  }
});

router.delete('/executives/:id', authenticate, adminOrExecutive, async (req: AuthRequest, res: Response) => {
  try {
    await memberService.deleteExecutive(req.params.id);
    res.json({ success: true, message: 'Executive removed' });
  } catch (error) {
    res.status(400).json({ success: false, message: (error as Error).message });
  }
});

export default router;
