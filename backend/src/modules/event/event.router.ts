import { Router } from 'express';
import { eventController } from './event.controller.js';
import { authenticate, adminOrExecutive, memberOnly } from '../../middleware/auth.middleware.js';
import { validate } from '../../middleware/validation.middleware.js';
import {
  createEventValidation,
  updateEventValidation,
  eventIdValidation,
  eventQueryValidation,
} from './event.validation.js';

const router = Router();

// Public routes
router.get('/', validate(eventQueryValidation), eventController.getEvents);
router.get('/upcoming', eventController.getUpcomingEvents);
router.get('/:id', eventController.getEvent);

// Member routes
router.get('/my/registrations', authenticate, eventController.getMyRegistrations);
router.post('/:id/register', authenticate, eventController.registerForEvent);
router.delete('/:id/register', authenticate, eventController.cancelRegistration);

// Admin routes
router.get('/admin/all', authenticate, adminOrExecutive, eventController.getAdminEvents);
router.post('/', authenticate, adminOrExecutive, validate(createEventValidation), eventController.createEvent);
router.put('/:id', authenticate, adminOrExecutive, validate(updateEventValidation), eventController.updateEvent);
router.delete('/:id', authenticate, adminOrExecutive, eventController.deleteEvent);
router.post('/:id/attendance', authenticate, adminOrExecutive, eventController.markAttendance);
router.get('/:id/registrations', authenticate, adminOrExecutive, eventController.getEventRegistrations);

export default router;
