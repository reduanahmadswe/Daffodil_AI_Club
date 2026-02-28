import { Router, Request, Response } from 'express';
import { contactService } from './contact.service.js';
import { authenticate, adminOrExecutive } from '../../middleware/auth.middleware.js';
import { AuthRequest } from '../../middleware/auth.middleware.js';

const router = Router();

// Public routes
router.post('/', async (req: Request, res: Response) => {
  try {
    const contact = await contactService.submitContact(req.body);
    res.status(201).json({ success: true, message: 'Message sent successfully', data: contact });
  } catch (error) {
    res.status(400).json({ success: false, message: (error as Error).message });
  }
});

router.post('/newsletter/subscribe', async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const result = await contactService.subscribeNewsletter(email);
    res.json({ success: true, message: result.message });
  } catch (error) {
    res.status(400).json({ success: false, message: (error as Error).message });
  }
});

router.post('/newsletter/unsubscribe', async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const result = await contactService.unsubscribeNewsletter(email);
    res.json({ success: true, message: result.message });
  } catch (error) {
    res.status(400).json({ success: false, message: (error as Error).message });
  }
});

// Admin routes
router.get('/', authenticate, adminOrExecutive, async (req: AuthRequest, res: Response) => {
  try {
    const { page, limit, unread } = req.query;
    const result = await contactService.getContacts({
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
      unread: unread as string,
    });
    res.json({
      success: true,
      data: result.contacts,
      unreadCount: result.unreadCount,
      pagination: result.pagination,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: (error as Error).message });
  }
});

router.patch('/:id/read', authenticate, adminOrExecutive, async (req: AuthRequest, res: Response) => {
  try {
    const contact = await contactService.markAsRead(req.params.id);
    res.json({ success: true, data: contact });
  } catch (error) {
    res.status(400).json({ success: false, message: (error as Error).message });
  }
});

router.delete('/:id', authenticate, adminOrExecutive, async (req: AuthRequest, res: Response) => {
  try {
    await contactService.deleteContact(req.params.id);
    res.json({ success: true, message: 'Deleted' });
  } catch (error) {
    res.status(400).json({ success: false, message: (error as Error).message });
  }
});

router.get('/newsletter/subscribers', authenticate, adminOrExecutive, async (req: AuthRequest, res: Response) => {
  try {
    const subscribers = await contactService.getNewsletterSubscribers();
    res.json({ success: true, data: subscribers });
  } catch (error) {
    res.status(400).json({ success: false, message: (error as Error).message });
  }
});

router.post('/newsletter/send', authenticate, adminOrExecutive, async (req: AuthRequest, res: Response) => {
  try {
    const { subject, description, coverImage, pdfUrl, pdfName } = req.body;
    if (!subject || !description) {
      return res.status(400).json({ success: false, message: 'Subject and description are required' });
    }
    const result = await contactService.sendNewsletterEmail(subject, description, coverImage, pdfUrl, pdfName);
    res.json({ success: true, message: result.message, data: { sent: result.sent, total: result.total } });
  } catch (error) {
    res.status(400).json({ success: false, message: (error as Error).message });
  }
});

// Public: list all newsletter posts
router.get('/newsletter/posts', async (req: Request, res: Response) => {
  try {
    const { page, limit } = req.query;
    const result = await contactService.getNewsletterPosts({
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
    });
    res.json({ success: true, data: result.posts, pagination: result.pagination });
  } catch (error) {
    res.status(400).json({ success: false, message: (error as Error).message });
  }
});

// Public: get single newsletter post
router.get('/newsletter/posts/:id', async (req: Request, res: Response) => {
  try {
    const post = await contactService.getNewsletterPostById(req.params.id);
    res.json({ success: true, data: post });
  } catch (error) {
    res.status(404).json({ success: false, message: (error as Error).message });
  }
});

// Admin: delete newsletter post
router.delete('/newsletter/posts/:id', authenticate, adminOrExecutive, async (req: AuthRequest, res: Response) => {
  try {
    const result = await contactService.deleteNewsletterPost(req.params.id);
    res.json({ success: true, message: result.message });
  } catch (error) {
    res.status(400).json({ success: false, message: (error as Error).message });
  }
});

export default router;
