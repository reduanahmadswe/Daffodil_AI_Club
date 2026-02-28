import { Request, Response } from 'express';
import { eventService } from './event.service.js';
import { AuthRequest } from '../../middleware/auth.middleware.js';

// Transform Prisma event to frontend-friendly format
function transformEvent(event: any) {
  if (!event) return event;
  const { date, capacity, _count, ...rest } = event;
  return {
    ...rest,
    date,
    startDate: date,
    capacity,
    maxParticipants: capacity,
    registeredCount: _count?.registrations ?? 0,
    _count,
  };
}

export class EventController {
  /**
   * POST /api/events
   */
  async createEvent(req: AuthRequest, res: Response) {
    try {
      const event = await eventService.createEvent(req.body);
      
      return res.status(201).json({
        success: true,
        message: 'Event created successfully',
        data: transformEvent(event),
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create event';
      return res.status(400).json({
        success: false,
        message,
      });
    }
  }

  /**
   * GET /api/events
   */
  async getEvents(req: Request, res: Response) {
    try {
      const { page, limit, type, upcoming, featured, search } = req.query;
      
      const result = await eventService.getEvents({
        page: page ? parseInt(page as string) : undefined,
        limit: limit ? parseInt(limit as string) : undefined,
        type: type as any,
        upcoming: upcoming === 'true',
        featured: featured === 'true',
        search: search as string,
      });
      
      return res.status(200).json({
        success: true,
        data: result.events.map(transformEvent),
        pagination: result.pagination,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch events';
      return res.status(400).json({
        success: false,
        message,
      });
    }
  }

  /**
   * GET /api/events/admin
   */
  async getAdminEvents(req: AuthRequest, res: Response) {
    try {
      const { page, limit, type, search } = req.query;
      
      const result = await eventService.getAdminEvents({
        page: page ? parseInt(page as string) : undefined,
        limit: limit ? parseInt(limit as string) : undefined,
        type: type as any,
        search: search as string,
      });
      
      return res.status(200).json({
        success: true,
        data: result.events.map(transformEvent),
        pagination: result.pagination,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch events';
      return res.status(400).json({
        success: false,
        message,
      });
    }
  }

  /**
   * GET /api/events/upcoming
   */
  async getUpcomingEvents(req: Request, res: Response) {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 4;
      const events = await eventService.getUpcomingEvents(limit);
      
      return res.status(200).json({
        success: true,
        data: events.map(transformEvent),
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch events';
      return res.status(400).json({
        success: false,
        message,
      });
    }
  }

  /**
   * GET /api/events/:id
   */
  async getEvent(req: Request, res: Response) {
    try {
      const event = await eventService.getEvent(req.params.id);
      
      return res.status(200).json({
        success: true,
        data: transformEvent(event),
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Event not found';
      return res.status(404).json({
        success: false,
        message,
      });
    }
  }

  /**
   * PUT /api/events/:id
   */
  async updateEvent(req: AuthRequest, res: Response) {
    try {
      const event = await eventService.updateEvent(req.params.id, req.body);
      
      return res.status(200).json({
        success: true,
        message: 'Event updated successfully',
        data: transformEvent(event),
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update event';
      return res.status(400).json({
        success: false,
        message,
      });
    }
  }

  /**
   * DELETE /api/events/:id
   */
  async deleteEvent(req: AuthRequest, res: Response) {
    try {
      await eventService.deleteEvent(req.params.id);
      
      return res.status(200).json({
        success: true,
        message: 'Event deleted successfully',
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete event';
      return res.status(400).json({
        success: false,
        message,
      });
    }
  }

  /**
   * POST /api/events/:id/register
   */
  async registerForEvent(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required',
        });
      }

      const registration = await eventService.registerForEvent(req.user.id, req.params.id);
      
      return res.status(201).json({
        success: true,
        message: 'Registration successful',
        data: registration,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Registration failed';
      return res.status(400).json({
        success: false,
        message,
      });
    }
  }

  /**
   * DELETE /api/events/:id/register
   */
  async cancelRegistration(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required',
        });
      }

      const result = await eventService.cancelRegistration(req.user.id, req.params.id);
      
      return res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Cancellation failed';
      return res.status(400).json({
        success: false,
        message,
      });
    }
  }

  /**
   * POST /api/events/:id/attendance
   */
  async markAttendance(req: AuthRequest, res: Response) {
    try {
      const { uniqueId } = req.body;
      
      if (!uniqueId) {
        return res.status(400).json({
          success: false,
          message: 'Member ID is required',
        });
      }

      const result = await eventService.markAttendance(req.params.id, uniqueId);
      
      return res.status(200).json({
        success: true,
        message: result.message,
        data: result.attendance,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to mark attendance';
      return res.status(400).json({
        success: false,
        message,
      });
    }
  }

  /**
   * GET /api/events/my-registrations
   */
  async getMyRegistrations(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required',
        });
      }

      const registrations = await eventService.getUserRegistrations(req.user.id);
      
      return res.status(200).json({
        success: true,
        data: registrations,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch registrations';
      return res.status(400).json({
        success: false,
        message,
      });
    }
  }

  /**
   * GET /api/events/:id/registrations
   */
  async getEventRegistrations(req: AuthRequest, res: Response) {
    try {
      const registrations = await eventService.getEventRegistrations(req.params.id);
      
      return res.status(200).json({
        success: true,
        data: registrations,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch registrations';
      return res.status(400).json({
        success: false,
        message,
      });
    }
  }
}

export const eventController = new EventController();
