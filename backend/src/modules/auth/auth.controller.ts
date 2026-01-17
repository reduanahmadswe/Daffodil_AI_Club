import { Request, Response } from 'express';
import { authService } from './auth.service.js';
import { AuthRequest } from '../../middleware/auth.middleware.js';

export class AuthController {
  /**
   * POST /api/auth/register
   */
  async register(req: Request, res: Response) {
    try {
      const result = await authService.register(req.body);
      
      return res.status(201).json({
        success: true,
        message: result.message,
        data: result.user,
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
   * POST /api/auth/verify-email
   */
  async verifyEmail(req: Request, res: Response) {
    try {
      const { token } = req.body;
      
      if (!token) {
        return res.status(400).json({
          success: false,
          message: 'Verification token is required',
        });
      }

      const result = await authService.verifyEmail(token);
      
      return res.status(200).json({
        success: true,
        message: result.message,
        data: { uniqueId: result.uniqueId },
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Verification failed';
      return res.status(400).json({
        success: false,
        message,
      });
    }
  }

  /**
   * POST /api/auth/login
   */
  async login(req: Request, res: Response) {
    try {
      const result = await authService.login(req.body);
      
      return res.status(200).json({
        success: true,
        message: 'Login successful',
        data: result,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed';
      return res.status(401).json({
        success: false,
        message,
      });
    }
  }

  /**
   * GET /api/auth/profile
   */
  async getProfile(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required',
        });
      }

      const user = await authService.getProfile(req.user.id);
      
      return res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to get profile';
      return res.status(400).json({
        success: false,
        message,
      });
    }
  }

  /**
   * PUT /api/auth/profile
   */
  async updateProfile(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required',
        });
      }

      const user = await authService.updateProfile(req.user.id, req.body);
      
      return res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: user,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update profile';
      return res.status(400).json({
        success: false,
        message,
      });
    }
  }

  /**
   * POST /api/auth/forgot-password
   */
  async forgotPassword(req: Request, res: Response) {
    try {
      const { email } = req.body;
      const result = await authService.forgotPassword(email);
      
      return res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Request failed';
      return res.status(400).json({
        success: false,
        message,
      });
    }
  }

  /**
   * POST /api/auth/reset-password
   */
  async resetPassword(req: Request, res: Response) {
    try {
      const { token, password } = req.body;
      const result = await authService.resetPassword(token, password);
      
      return res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Reset failed';
      return res.status(400).json({
        success: false,
        message,
      });
    }
  }

  /**
   * POST /api/auth/change-password
   */
  async changePassword(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required',
        });
      }

      const { currentPassword, newPassword } = req.body;
      const result = await authService.changePassword(req.user.id, currentPassword, newPassword);
      
      return res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Password change failed';
      return res.status(400).json({
        success: false,
        message,
      });
    }
  }

  /**
   * POST /api/auth/resend-verification
   */
  async resendVerification(req: Request, res: Response) {
    try {
      const { email } = req.body;
      const result = await authService.resendVerification(email);
      
      return res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to resend verification';
      return res.status(400).json({
        success: false,
        message,
      });
    }
  }
}

export const authController = new AuthController();
