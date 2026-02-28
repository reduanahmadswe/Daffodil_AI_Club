import { Router, Request, Response } from 'express';
import { MembershipService } from './membership.service.js';
import { authenticate, adminOrExecutive, AuthRequest } from '../../middleware/auth.middleware.js';

const router = Router();
const membershipService = new MembershipService();

// ============ PUBLIC / AUTH ROUTES ============

/**
 * POST /api/membership/apply
 * Submit membership application (authenticated users only)
 */
router.post('/apply', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { paymentMethod, transactionId, amount, phoneNumber } = req.body;

    if (!paymentMethod || !transactionId) {
      return res.status(400).json({
        success: false,
        message: 'Payment method and transaction ID are required',
      });
    }

    if (!['BKASH', 'NAGAD', 'ROCKET'].includes(paymentMethod)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment method. Must be BKASH, NAGAD, or ROCKET',
      });
    }

    const result = await membershipService.apply({
      userId: req.user!.id,
      paymentMethod,
      transactionId,
      amount: amount || 0,
      phoneNumber,
    });

    res.status(201).json({
      success: true,
      message: result.message,
      data: result.application,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

/**
 * GET /api/membership/my-status
 * Get current user's membership status and application history
 */
router.get('/my-status', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const result = await membershipService.getMyStatus(req.user!.id);
    res.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// ============ ADMIN ROUTES ============

/**
 * GET /api/membership/applications
 * Get all membership applications (admin/executive)
 */
router.get('/applications', authenticate, adminOrExecutive, async (req: Request, res: Response) => {
  try {
    const { page, limit, status, search } = req.query;
    const result = await membershipService.getApplications({
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
      status: status as string,
      search: search as string,
    });

    res.json({
      success: true,
      data: result.applications,
      pagination: result.pagination,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

/**
 * GET /api/membership/applications/:id
 * Get a single application (admin/executive)
 */
router.get('/applications/:id', authenticate, adminOrExecutive, async (req: Request, res: Response) => {
  try {
    const application = await membershipService.getApplicationById(req.params.id);
    res.json({
      success: true,
      data: application,
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
});

/**
 * POST /api/membership/applications/:id/approve
 * Approve a membership application (admin/executive)
 */
router.post('/applications/:id/approve', authenticate, adminOrExecutive, async (req: AuthRequest, res: Response) => {
  try {
    const result = await membershipService.approveApplication(req.params.id, req.user!.id);
    res.json({
      success: true,
      message: result.message,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

/**
 * POST /api/membership/applications/:id/reject
 * Reject a membership application (admin/executive)
 */
router.post('/applications/:id/reject', authenticate, adminOrExecutive, async (req: AuthRequest, res: Response) => {
  try {
    const { reason } = req.body;
    const result = await membershipService.rejectApplication(req.params.id, req.user!.id, reason);
    res.json({
      success: true,
      message: result.message,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

/**
 * GET /api/membership/stats
 * Get membership stats (admin/executive)
 */
router.get('/stats', authenticate, adminOrExecutive, async (req: Request, res: Response) => {
  try {
    const stats = await membershipService.getStats();
    res.json({
      success: true,
      data: stats,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

/**
 * POST /api/membership/direct-approve/:userId
 * Directly make a user a member (admin/executive)
 */
router.post('/direct-approve/:userId', authenticate, adminOrExecutive, async (req: AuthRequest, res: Response) => {
  try {
    const result = await membershipService.directApprove(req.params.userId, req.user!.id);
    res.json({
      success: true,
      message: result.message,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;
