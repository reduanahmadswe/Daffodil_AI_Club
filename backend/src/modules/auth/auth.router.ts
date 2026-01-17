import { Router } from 'express';
import { authController } from './auth.controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';
import { validate } from '../../middleware/validation.middleware.js';
import {
  registerValidation,
  loginValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
  changePasswordValidation,
  updateProfileValidation,
} from './auth.validation.js';

const router = Router();

// Public routes
router.post('/register', validate(registerValidation), authController.register);
router.post('/login', validate(loginValidation), authController.login);
router.post('/verify-email', authController.verifyEmail);
router.post('/forgot-password', validate(forgotPasswordValidation), authController.forgotPassword);
router.post('/reset-password', validate(resetPasswordValidation), authController.resetPassword);
router.post('/resend-verification', authController.resendVerification);

// Protected routes
router.get('/profile', authenticate, authController.getProfile);
router.put('/profile', authenticate, validate(updateProfileValidation), authController.updateProfile);
router.post('/change-password', authenticate, validate(changePasswordValidation), authController.changePassword);

export default router;
