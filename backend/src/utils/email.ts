import nodemailer from 'nodemailer';
import { env } from '../config/env.js';

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: false,
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  },
});

interface EmailAttachment {
  filename: string;
  path?: string;
  content?: Buffer;
  contentType?: string;
}

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  attachments?: EmailAttachment[];
}

export const sendEmail = async (options: EmailOptions): Promise<boolean> => {
  try {
    await transporter.sendMail({
      from: env.EMAIL_FROM,
      to: options.to,
      subject: options.subject,
      html: options.html,
      attachments: options.attachments,
    });
    return true;
  } catch (error) {
    console.error('Email send error:', error);
    return false;
  }
};

// Email Templates
export const emailTemplates = {
  otpVerification: (name: string, otp: string) => `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Segoe UI', sans-serif; background: #f4f4f4; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; }
        .header { background: linear-gradient(135deg, #6366f1, #8b5cf6); padding: 30px; text-align: center; }
        .header h1 { color: white; margin: 0; }
        .content { padding: 30px; }
        .otp-box { background: #f8f9fa; border: 2px dashed #6366f1; border-radius: 12px; padding: 24px; text-align: center; margin: 24px 0; }
        .otp-code { font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #6366f1; font-family: 'Courier New', monospace; }
        .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🤖 Daffodil AI Club</h1>
        </div>
        <div class="content">
          <h2>Welcome, ${name}! 🎉</h2>
          <p>Thank you for registering with Daffodil AI Club. Use the OTP code below to verify your email address:</p>
          <div class="otp-box">
            <div class="otp-code">${otp}</div>
          </div>
          <p style="color: #666; font-size: 14px;">This code will expire in <strong>10 minutes</strong>.</p>
          <p style="color: #666; font-size: 14px;">If you didn't create an account, please ignore this email.</p>
        </div>
        <div class="footer">
          <p>Daffodil AI Club - Daffodil International University</p>
        </div>
      </div>
    </body>
    </html>
  `,

  verification: (name: string, verifyUrl: string) => `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Segoe UI', sans-serif; background: #f4f4f4; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; }
        .header { background: linear-gradient(135deg, #6366f1, #8b5cf6); padding: 30px; text-align: center; }
        .header h1 { color: white; margin: 0; }
        .content { padding: 30px; }
        .btn { display: inline-block; background: #6366f1; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🤖 Daffodil AI Club</h1>
        </div>
        <div class="content">
          <h2>Welcome, ${name}! 🎉</h2>
          <p>Thank you for registering with Daffodil AI Club. Please verify your email to complete your registration.</p>
          <a href="${verifyUrl}" class="btn">Verify Email</a>
          <p>If the button doesn't work, copy this link:</p>
          <p style="word-break: break-all; color: #6366f1;">${verifyUrl}</p>
          <p>This link expires in 24 hours.</p>
        </div>
        <div class="footer">
          <p>Daffodil AI Club - Daffodil International University</p>
        </div>
      </div>
    </body>
    </html>
  `,

  welcome: (name: string) => `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Segoe UI', sans-serif; background: #f4f4f4; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; }
        .header { background: linear-gradient(135deg, #6366f1, #8b5cf6); padding: 30px; text-align: center; }
        .header h1 { color: white; margin: 0; }
        .content { padding: 30px; }
        .info-card { background: linear-gradient(135deg, #1e1b4b, #312e81); padding: 20px; border-radius: 10px; color: white; text-align: center; margin: 20px 0; }
        .info-card p { margin: 8px 0; font-size: 15px; opacity: 0.9; }
        .info-card .highlight { font-size: 18px; font-weight: bold; opacity: 1; }
        .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🤖 Welcome to Daffodil AI Club!</h1>
        </div>
        <div class="content">
          <h2>Congratulations, ${name}! 🎉</h2>
          <p>Your email has been verified successfully. Welcome to the Daffodil AI Club community!</p>
          <div class="info-card">
            <p class="highlight">Want to become an official club member?</p>
            <p>Apply for membership from your dashboard to get your unique Member ID, digital ID card, and access to exclusive benefits!</p>
          </div>
          <p>As a verified user, you can:</p>
          <ul>
            <li>Browse upcoming events & workshops</li>
            <li>Explore club resources</li>
            <li>Apply for club membership</li>
            <li>Stay connected with the AI community</li>
          </ul>
          <p>Visit your dashboard to get started!</p>
        </div>
        <div class="footer">
          <p>Daffodil AI Club - Daffodil International University</p>
        </div>
      </div>
    </body>
    </html>
  `,

  resetPassword: (name: string, resetUrl: string) => `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Segoe UI', sans-serif; background: #f4f4f4; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; }
        .header { background: linear-gradient(135deg, #6366f1, #8b5cf6); padding: 30px; text-align: center; }
        .header h1 { color: white; margin: 0; }
        .content { padding: 30px; }
        .btn { display: inline-block; background: #6366f1; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔐 Password Reset</h1>
        </div>
        <div class="content">
          <h2>Hi ${name},</h2>
          <p>We received a request to reset your password. Click the button below to create a new password:</p>
          <a href="${resetUrl}" class="btn">Reset Password</a>
          <p>If you didn't request this, please ignore this email.</p>
          <p>This link expires in 1 hour.</p>
        </div>
        <div class="footer">
          <p>Daffodil AI Club - Daffodil International University</p>
        </div>
      </div>
    </body>
    </html>
  `,

  eventReminder: (name: string, eventTitle: string, eventDate: string, eventVenue: string) => `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Segoe UI', sans-serif; background: #f4f4f4; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; }
        .header { background: linear-gradient(135deg, #6366f1, #8b5cf6); padding: 30px; text-align: center; }
        .header h1 { color: white; margin: 0; }
        .content { padding: 30px; }
        .event-card { background: #f8f9fa; padding: 20px; border-radius: 10px; border-left: 4px solid #6366f1; margin: 20px 0; }
        .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📅 Event Reminder</h1>
        </div>
        <div class="content">
          <h2>Hi ${name},</h2>
          <p>This is a reminder for your upcoming event:</p>
          <div class="event-card">
            <h3 style="margin: 0 0 10px; color: #6366f1;">${eventTitle}</h3>
            <p><strong>📅 Date:</strong> ${eventDate}</p>
            <p><strong>📍 Venue:</strong> ${eventVenue}</p>
          </div>
          <p>Don't forget to bring your Member ID for attendance!</p>
        </div>
        <div class="footer">
          <p>Daffodil AI Club - Daffodil International University</p>
        </div>
      </div>
    </body>
    </html>
  `,
};
