import { body } from 'express-validator';
import { env } from '../../config/env.js';

export const registerValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),

  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email')
    .custom((value) => {
      if (!value.toLowerCase().endsWith(env.ALLOWED_EMAIL_DOMAIN)) {
        throw new Error(`Only ${env.ALLOWED_EMAIL_DOMAIN} emails are allowed`);
      }
      return true;
    }),

  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
    .matches(/\d/)
    .withMessage('Password must contain at least one number'),

  body('phone')
    .optional()
    .matches(/^01[3-9]\d{8}$/)
    .withMessage('Please provide a valid Bangladeshi phone number'),

  body('department')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Department must not exceed 100 characters'),

  body('batch')
    .optional()
    .trim()
    .isLength({ max: 20 })
    .withMessage('Batch must not exceed 20 characters'),

  body('studentId')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Student ID must not exceed 50 characters'),
];

export const loginValidation = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email'),

  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

export const forgotPasswordValidation = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email'),
];

export const resetPasswordValidation = [
  body('token')
    .notEmpty()
    .withMessage('Reset token is required'),

  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
    .matches(/\d/)
    .withMessage('Password must contain at least one number'),
];

export const changePasswordValidation = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),

  body('newPassword')
    .notEmpty()
    .withMessage('New password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
    .matches(/\d/)
    .withMessage('Password must contain at least one number'),
];

export const updateProfileValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),

  body('phone')
    .optional()
    .matches(/^01[3-9]\d{8}$/)
    .withMessage('Please provide a valid Bangladeshi phone number'),

  body('department')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Department must not exceed 100 characters'),

  body('batch')
    .optional()
    .trim()
    .isLength({ max: 20 })
    .withMessage('Batch must not exceed 20 characters'),
];
