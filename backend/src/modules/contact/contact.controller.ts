import { Request, Response } from 'express';
import { contactService } from './contact.service.js';
import { AuthRequest } from '../../middleware/auth.middleware.js';

export class ContactController {
  /**
   * POST /api/contact
   */
  async submitContact(req: Request, res: Response) {
    try {
      const result = await contactService.submitContact(req.body);
      
      return res.status(201).json({
        success: true,
        message: 'Message sent successfully. We will get back to you soon!',
        data: result,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to send message';
      return res.status(400).json({
        success: false,
        message,
      });
    }
  }

  /**
   * GET /api/contact (Admin)
   */
  async getContacts(req: AuthRequest, res: Response) {
    try {
      const result = await contactService.getContacts(req.query);
      
      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch contacts';
      return res.status(400).json({
        success: false,
        message,
      });
    }
  }

  /**
   * PUT /api/contact/:id/read (Admin)
   */
  async markAsRead(req: AuthRequest, res: Response) {
    try {
      const result = await contactService.markAsRead(req.params.id);
      
      return res.status(200).json({
        success: true,
        message: 'Marked as read',
        data: result,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update';
      return res.status(400).json({
        success: false,
        message,
      });
    }
  }

  /**
   * DELETE /api/contact/:id (Admin)
   */
  async deleteContact(req: AuthRequest, res: Response) {
    try {
      await contactService.deleteContact(req.params.id);
      
      return res.status(200).json({
        success: true,
        message: 'Message deleted successfully',
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete';
      return res.status(400).json({
        success: false,
        message,
      });
    }
  }

  /**
   * POST /api/newsletter/subscribe
   */
  async subscribeNewsletter(req: Request, res: Response) {
    try {
      const result = await contactService.subscribeNewsletter(req.body.email);
      
      return res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to subscribe';
      return res.status(400).json({
        success: false,
        message,
      });
    }
  }

  /**
   * POST /api/newsletter/unsubscribe
   */
  async unsubscribeNewsletter(req: Request, res: Response) {
    try {
      const result = await contactService.unsubscribeNewsletter(req.body.email);
      
      return res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to unsubscribe';
      return res.status(400).json({
        success: false,
        message,
      });
    }
  }
}

export const contactController = new ContactController();
