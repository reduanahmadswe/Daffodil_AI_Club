# 🤖 Daffodil AI Club Website

A comprehensive full-stack website for Daffodil AI Club with unique member ID system, event management, and admin dashboard.

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC)
![Prisma](https://img.shields.io/badge/Prisma-5.0-2D3748)
![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1)

## ✨ Features

### 🎯 Member Management
- **Unique Member ID**: DAIC-SPRING/SUMMER/FALL-00142 format
- **DIU Email Verification**: Only @diu.edu.bd emails allowed
- **Digital ID Card**: QR code-based identification
- **Profile Management**: Complete member profiles

### 📅 Events & Workshops
- Event listings with registration
- Workshop series with syllabus
- Certificate generation
- Attendance tracking

### 📝 Blog & Content
- Blog posts with categories
- Rich text content
- Comments & likes
- Related posts

### 🖼️ Gallery & Projects
- Photo gallery with lightbox
- Project showcase
- Team member credits
- GitHub integration

### 🔐 Admin Dashboard
- Member management
- Event/Workshop creation
- Blog management
- Analytics & reports

## 🏗️ Project Structure

```
daffodil-ai-club/
├── backend/                    # Node.js + Express API
│   ├── src/
│   │   ├── modules/           # Feature modules
│   │   │   ├── auth/          # Authentication
│   │   │   ├── event/         # Events
│   │   │   ├── blog/          # Blog posts
│   │   │   ├── member/        # Members
│   │   │   ├── workshop/      # Workshops
│   │   │   ├── project/       # Projects
│   │   │   ├── gallery/       # Gallery
│   │   │   └── contact/       # Contact form
│   │   ├── middleware/        # Express middleware
│   │   ├── utils/             # Utility functions
│   │   └── config/            # Configuration
│   └── prisma/                # Database schema
│
└── frontend/                   # Next.js 14 App
    ├── src/
    │   ├── app/               # App Router pages
    │   │   ├── (main)/        # Public pages
    │   │   ├── (auth)/        # Login/Register
    │   │   ├── (dashboard)/   # Member dashboard
    │   │   └── (admin)/       # Admin panel
    │   ├── components/        # React components
    │   │   ├── ui/            # UI components
    │   │   └── layout/        # Layout components
    │   ├── lib/               # Utilities & API
    │   └── types/             # TypeScript types
    └── public/                # Static assets
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- MySQL 8.0+
- npm or yarn

### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your database credentials
# DATABASE_URL="mysql://user:password@localhost:3306/daic_db"
# JWT_SECRET="your-secret-key"

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed database (optional)
npx prisma db seed

# Start development server
npm run dev
```

Backend will run on http://localhost:5000

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local

# Edit .env.local
# NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Start development server
npm run dev
```

Frontend will run on http://localhost:3000

## 📱 Pages Overview

### Public Pages
| Page | Route | Description |
|------|-------|-------------|
| Home | `/` | Landing page with hero, stats, events |
| About | `/about` | Club info, timeline, team |
| Events | `/events` | Event listings |
| Event Detail | `/events/[slug]` | Individual event |
| Workshops | `/workshops` | Workshop series |
| Blog | `/blog` | Blog posts |
| Projects | `/projects` | Project showcase |
| Gallery | `/gallery` | Photo gallery |
| Contact | `/contact` | Contact form |

### Auth Pages
| Page | Route | Description |
|------|-------|-------------|
| Login | `/login` | Member login |
| Register | `/register` | New member registration |
| Verify Email | `/verify-email` | Email verification |

### Member Dashboard
| Page | Route | Description |
|------|-------|-------------|
| Dashboard | `/dashboard` | Overview |
| Profile | `/dashboard/profile` | Edit profile |
| ID Card | `/dashboard/id-card` | Digital ID card |
| My Events | `/dashboard/events` | Registered events |
| Certificates | `/dashboard/certificates` | Earned certificates |
| Settings | `/dashboard/settings` | Account settings |

### Admin Panel
| Page | Route | Description |
|------|-------|-------------|
| Dashboard | `/admin` | Admin overview |
| Members | `/admin/members` | Manage members |
| Events | `/admin/events` | Manage events |
| Blogs | `/admin/blogs` | Manage blog posts |
| Workshops | `/admin/workshops` | Manage workshops |
| Projects | `/admin/projects` | Manage projects |
| Gallery | `/admin/gallery` | Manage images |
| Messages | `/admin/messages` | Contact submissions |
| Settings | `/admin/settings` | Site settings |

## 🔑 Unique Member ID System

### Format
```
DAIC-SEMESTER-SERIAL

Examples:
- DAIC-SPRING-00001
- DAIC-SUMMER-00142
- DAIC-FALL-00089
```

### Generation Logic
1. Semester determined by registration date:
   - Spring: January - April
   - Summer: May - August
   - Fall: September - December

2. Serial number auto-increments per semester
3. Displayed on digital ID card with QR code

## 🔐 Authentication

### Email Verification
- Only @diu.edu.bd emails accepted
- 6-digit verification code sent via email
- Unique ID assigned after verification

### Role System
- **USER**: Regular member
- **EXECUTIVE**: Club executive
- **ADMIN**: Full admin access

## 🎨 Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Animations
- **Redux Toolkit** - State management
- **React Hook Form** - Form handling
- **Zod** - Schema validation
- **Lucide Icons** - Icon library

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **Prisma** - ORM
- **MySQL** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Nodemailer** - Email sending

## 📦 API Endpoints

### Authentication
```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/verify-email
POST /api/auth/resend-verification
POST /api/auth/forgot-password
POST /api/auth/reset-password
```

### Members
```
GET  /api/members
GET  /api/members/:id
PUT  /api/members/:id
```

### Events
```
GET  /api/events
GET  /api/events/:slug
POST /api/events (Admin)
PUT  /api/events/:id (Admin)
POST /api/events/:id/register
```

### Blog
```
GET  /api/blogs
GET  /api/blogs/:slug
POST /api/blogs (Admin)
PUT  /api/blogs/:id (Admin)
POST /api/blogs/:id/like
POST /api/blogs/:id/comments
```

## 🚢 Deployment

### University Server (Recommended)

1. Build applications:
```bash
# Backend
cd backend
npm run build

# Frontend
cd frontend
npm run build
```

2. Use PM2 for process management:
```bash
npm install -g pm2

# Start backend
pm2 start backend/dist/index.js --name daic-api

# Start frontend
pm2 start frontend/.next/standalone/server.js --name daic-web
```

3. Configure Nginx as reverse proxy

### Environment Variables

#### Backend (.env)
```env
DATABASE_URL="mysql://user:password@localhost:3306/daic_db"
JWT_SECRET="your-super-secret-key"
JWT_EXPIRES_IN="7d"
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
FRONTEND_URL="https://daic.diu.edu.bd"
```

#### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=https://api.daic.diu.edu.bd/api
NEXT_PUBLIC_SITE_URL=https://daic.diu.edu.bd
```

## 🚀 CI/CD Pipeline

This project includes automated deployment to Vercel using GitHub Actions.

### ✨ Features
- **Automatic Deployment**: Push to main → Auto-deploy to production
- **Preview Deployments**: Pull requests get preview URLs
- **Separate Workflows**: Backend and frontend deploy independently
- **Smart Triggers**: Only deploys when relevant files change

### 📚 Setup Guides
- **[Quick Start](SETUP_COMPLETE.md)** - Get started in 5 minutes
- **[Detailed Setup](CI_CD_SETUP.md)** - Complete step-by-step guide
- **[Visual Guide](VISUAL_GUIDE.md)** - Architecture diagrams
- **[GitHub Secrets](GITHUB_SECRETS.md)** - Quick reference

### 🔗 Live URLs
- **Backend**: https://aiclubbackend.vercel.app
- **Frontend**: (Deployed on Vercel)

### 🎯 How to Deploy
```bash
# Just push your code!
git add .
git commit -m "your changes"
git push origin main

# GitHub Actions handles the rest! 🎉
```

For detailed CI/CD setup instructions, see **[SETUP_COMPLETE.md](SETUP_COMPLETE.md)**


## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is developed for Daffodil AI Club, Daffodil International University.

## 👥 Team

- **Daffodil AI Club** - Development Team
- Daffodil International University, Dhaka, Bangladesh

---

<p align="center">Made with ❤️ by Daffodil AI Club</p>