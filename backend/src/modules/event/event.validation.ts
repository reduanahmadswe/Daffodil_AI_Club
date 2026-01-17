import { body, param, query } from 'express-validator';

export const createEventValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Event title is required')
    .isLength({ min: 3, max: 200 })
    .withMessage('Title must be between 3 and 200 characters'),

  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required'),

  body('date')
    .notEmpty()
    .withMessage('Event date is required')
    .isISO8601()
    .withMessage('Please provide a valid date'),

  body('type')
    .optional()
    .isIn(['SEMINAR', 'WORKSHOP', 'COMPETITION', 'HACKATHON', 'MEETUP', 'WEBINAR', 'CONFERENCE'])
    .withMessage('Invalid event type'),

  body('venue')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Venue must not exceed 200 characters'),

  body('capacity')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Capacity must be a positive number'),

  body('fee')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Fee must be a non-negative number'),
];

export const updateEventValidation = [
  param('id')
    .notEmpty()
    .withMessage('Event ID is required'),

  body('title')
    .optional()
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage('Title must be between 3 and 200 characters'),

  body('date')
    .optional()
    .isISO8601()
    .withMessage('Please provide a valid date'),
];

export const eventIdValidation = [
  param('id')
    .notEmpty()
    .withMessage('Event ID is required'),
];

export const eventQueryValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be between 1 and 50'),

  query('type')
    .optional()
    .isIn(['SEMINAR', 'WORKSHOP', 'COMPETITION', 'HACKATHON', 'MEETUP', 'WEBINAR', 'CONFERENCE'])
    .withMessage('Invalid event type'),
];
