import { Router, Request, Response } from 'express';
import { galleryService } from './gallery.service.js';
import { authenticate, adminOrExecutive } from '../../middleware/auth.middleware.js';
import { AuthRequest } from '../../middleware/auth.middleware.js';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const { page, limit, year, eventName, category } = req.query;
    const result = await galleryService.getImages({
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
      year: year as string,
      eventName: eventName as string,
      category: category as string,
    });
    res.json({ success: true, data: result.images, pagination: result.pagination });
  } catch (error) {
    res.status(400).json({ success: false, message: (error as Error).message });
  }
});

router.get('/years', async (req: Request, res: Response) => {
  try {
    const years = await galleryService.getYears();
    res.json({ success: true, data: years });
  } catch (error) {
    res.status(400).json({ success: false, message: (error as Error).message });
  }
});

router.get('/events', async (req: Request, res: Response) => {
  try {
    const events = await galleryService.getEventNames();
    res.json({ success: true, data: events });
  } catch (error) {
    res.status(400).json({ success: false, message: (error as Error).message });
  }
});

router.post('/', authenticate, adminOrExecutive, async (req: AuthRequest, res: Response) => {
  try {
    const image = await galleryService.uploadImage(req.body);
    res.status(201).json({ success: true, data: image });
  } catch (error) {
    res.status(400).json({ success: false, message: (error as Error).message });
  }
});

router.post('/bulk', authenticate, adminOrExecutive, async (req: AuthRequest, res: Response) => {
  try {
    const { images } = req.body;
    const result = await galleryService.uploadMultipleImages(images);
    res.status(201).json({ success: true, message: `${result.count} images uploaded` });
  } catch (error) {
    res.status(400).json({ success: false, message: (error as Error).message });
  }
});

router.delete('/:id', authenticate, adminOrExecutive, async (req: AuthRequest, res: Response) => {
  try {
    await galleryService.deleteImage(req.params.id);
    res.json({ success: true, message: 'Image deleted' });
  } catch (error) {
    res.status(400).json({ success: false, message: (error as Error).message });
  }
});

export default router;
