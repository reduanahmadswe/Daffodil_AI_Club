import { Router, Response } from 'express';
import multer from 'multer';
import { AuthRequest, authenticate, adminOrExecutive } from '../../middleware/auth.middleware.js';
import { mediaService } from './media.service.js';

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 15 * 1024 * 1024,
  },
});

router.post('/drive-image', authenticate, adminOrExecutive, upload.single('image'), async (req: AuthRequest, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Image file is required',
      });
    }

    if (!req.file.mimetype.startsWith('image/')) {
      return res.status(400).json({
        success: false,
        message: 'Only image files are allowed',
      });
    }

    const uploaded = await mediaService.uploadImageToDrive({
      buffer: req.file.buffer,
      filename: req.file.originalname,
      mimeType: req.file.mimetype,
    });

    return res.status(201).json({
      success: true,
      message: 'Image uploaded to Google Drive successfully',
      data: uploaded,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to upload image';
    return res.status(400).json({
      success: false,
      message,
    });
  }
});

router.post('/drive-pdf', authenticate, adminOrExecutive, upload.single('pdf'), async (req: AuthRequest, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'PDF file is required',
      });
    }

    if (req.file.mimetype !== 'application/pdf') {
      return res.status(400).json({
        success: false,
        message: 'Only PDF files are allowed',
      });
    }

    const uploaded = await mediaService.uploadFileToDrive({
      buffer: req.file.buffer,
      filename: req.file.originalname,
      mimeType: req.file.mimetype,
    });

    return res.status(201).json({
      success: true,
      message: 'PDF uploaded to Google Drive successfully',
      data: uploaded,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to upload PDF';
    return res.status(400).json({
      success: false,
      message,
    });
  }
});

export default router;
