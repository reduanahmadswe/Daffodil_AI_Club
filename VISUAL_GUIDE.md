# 🎯 CI/CD Pipeline - Visual Guide

## 📊 Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     DEVELOPER WORKFLOW                          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ git push
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         GITHUB                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              GitHub Actions (CI/CD)                      │  │
│  │                                                          │  │
│  │  ┌────────────────┐         ┌────────────────┐         │  │
│  │  │   Backend      │         │   Frontend     │         │  │
│  │  │   Workflow     │         │   Workflow     │         │  │
│  │  │                │         │                │         │  │
│  │  │ 1. Install     │         │ 1. Install     │         │  │
│  │  │ 2. Prisma Gen  │         │ 2. Build       │         │  │
│  │  │ 3. Build       │         │ 3. Deploy      │         │  │
│  │  │ 4. Deploy      │         │                │         │  │
│  │  └────────┬───────┘         └────────┬───────┘         │  │
│  └───────────┼──────────────────────────┼─────────────────┘  │
└──────────────┼──────────────────────────┼────────────────────┘
               │                          │
               │ Deploy                   │ Deploy
               ▼                          ▼
┌──────────────────────┐      ┌──────────────────────┐
│   VERCEL (Backend)   │      │  VERCEL (Frontend)   │
│                      │      │                      │
│  aiclubbackend       │◄─────┤  (Your Frontend)     │
│  .vercel.app         │ API  │  .vercel.app         │
│                      │      │                      │
│  ┌────────────────┐  │      │  ┌────────────────┐  │
│  │  Express API   │  │      │  │   Next.js App  │  │
│  │  + Prisma      │  │      │  │                │  │
│  └────────┬───────┘  │      │  └────────────────┘  │
└───────────┼──────────┘      └──────────────────────┘
            │
            │ Database
            ▼
┌──────────────────────┐
│   PostgreSQL DB      │
│   (Your Database)    │
└──────────────────────┘
```

## 🔄 Deployment Flow

### When You Push to Main:

```
1. Developer
   │
   ├─ Write Code
   ├─ git add .
   ├─ git commit -m "message"
   └─ git push origin main
          │
          ▼
2. GitHub
   │
   ├─ Receives Push
   ├─ Triggers GitHub Actions
   └─ Runs Workflows
          │
          ▼
3. GitHub Actions
   │
   ├─ Checkout Code
   ├─ Setup Node.js
   ├─ Install Dependencies
   ├─ Run Tests (if any)
   ├─ Build Project
   └─ Deploy to Vercel
          │
          ▼
4. Vercel
   │
   ├─ Receives Deployment
   ├─ Builds Application
   ├─ Runs Serverless Functions
   └─ Makes Live
          │
          ▼
5. Production
   │
   └─ ✅ Your App is Live!
```

## 📁 File Structure

```
Daffodil_AI_Club/
│
├── .github/
│   └── workflows/
│       ├── deploy-backend.yml    ← Backend CI/CD
│       └── deploy-frontend.yml   ← Frontend CI/CD
│
├── backend/
│   ├── .vercel/
│   │   └── project.json         ← Vercel Project Config
│   ├── api/
│   │   └── index.ts             ← Serverless Entry Point
│   ├── src/
│   │   ├── app.ts               ← Express App
│   │   ├── config/
│   │   │   └── database.ts      ← Prisma Client
│   │   └── modules/             ← API Routes
│   ├── prisma/
│   │   └── schema.prisma        ← Database Schema
│   ├── package.json             ← Dependencies + Scripts
│   ├── vercel.json              ← Vercel Config
│   └── tsconfig.json            ← TypeScript Config
│
├── frontend/
│   ├── .vercel/
│   │   └── project.json         ← Vercel Project Config
│   ├── src/
│   │   ├── app/                 ← Next.js Pages
│   │   └── components/          ← React Components
│   ├── package.json             ← Dependencies + Scripts
│   ├── vercel.json              ← Vercel Config
│   └── next.config.js           ← Next.js Config
│
├── CI_CD_SETUP.md               ← Detailed Setup Guide
├── GITHUB_SECRETS.md            ← Quick Reference
├── SETUP_COMPLETE.md            ← Summary
└── setup-cicd.ps1               ← Helper Script
```

## 🔐 GitHub Secrets Setup

### Step-by-Step Visual:

```
1. Go to GitHub Repository
   https://github.com/reduanahmadswe/Daffodil_AI_Club
   
   ↓

2. Click "Settings" Tab
   
   ↓

3. Click "Secrets and variables" → "Actions"
   
   ↓

4. Click "New repository secret"
   
   ↓

5. Add Each Secret:
   
   ┌─────────────────────────────────────────┐
   │ Name:  VERCEL_TOKEN                     │
   │ Value: [Your Vercel Token]              │
   │        Get from:                        │
   │        https://vercel.com/account/tokens│
   └─────────────────────────────────────────┘
   
   ┌─────────────────────────────────────────┐
   │ Name:  VERCEL_ORG_ID                    │
   │ Value: team_W677X2QW5NgORaMDpDKZcZJQ    │
   └─────────────────────────────────────────┘
   
   ┌─────────────────────────────────────────┐
   │ Name:  VERCEL_BACKEND_PROJECT_ID        │
   │ Value: prj_NMD2Be3AfWS31hpxHrsQBfuFo3L6 │
   └─────────────────────────────────────────┘
   
   ┌─────────────────────────────────────────┐
   │ Name:  VERCEL_FRONTEND_PROJECT_ID       │
   │ Value: prj_IhHSL9TkLoG6ZLCK2vpOakF5CJ1i │
   └─────────────────────────────────────────┘
   
   ┌─────────────────────────────────────────┐
   │ Name:  NEXT_PUBLIC_API_URL              │
   │ Value: https://aiclubbackend.vercel.app │
   └─────────────────────────────────────────┘
```

## 🚦 Workflow Triggers

### Backend Workflow Triggers:
```
✅ Push to main/master
   AND
   Files changed in backend/ folder

✅ Pull Request
   AND
   Files changed in backend/ folder

❌ Changes only in frontend/ → Backend doesn't deploy
```

### Frontend Workflow Triggers:
```
✅ Push to main/master
   AND
   Files changed in frontend/ folder

✅ Pull Request
   AND
   Files changed in frontend/ folder

❌ Changes only in backend/ → Frontend doesn't deploy
```

## 📊 Deployment Timeline

```
Time    Action
─────────────────────────────────────────────────
0:00    You push code to GitHub
0:05    GitHub Actions starts
0:10    Dependencies installed
0:30    Project built
0:45    Tests run (if any)
1:00    Deployment to Vercel starts
1:30    Vercel builds application
2:00    ✅ Live in Production!
```

## 🎯 Environment Variables

### Backend (Vercel Dashboard):
```
┌─────────────────────────────────────────┐
│ DATABASE_URL                            │
│ JWT_SECRET                              │
│ JWT_EXPIRES_IN                          │
│ FRONTEND_URL                            │
│ EMAIL_HOST                              │
│ EMAIL_PORT                              │
│ EMAIL_USER                              │
│ EMAIL_PASSWORD                          │
│ NODE_ENV = production                   │
└─────────────────────────────────────────┘
```

### Frontend (Vercel Dashboard):
```
┌─────────────────────────────────────────┐
│ NEXT_PUBLIC_API_URL                     │
│ = https://aiclubbackend.vercel.app      │
└─────────────────────────────────────────┘
```

## 🔍 Monitoring Deployments

### GitHub Actions:
```
https://github.com/reduanahmadswe/Daffodil_AI_Club/actions

View:
- Workflow runs
- Build logs
- Deployment status
- Error messages
```

### Vercel Dashboard:
```
Backend:  https://vercel.com/reduan-ahmads-projects/aiclubbackend
Frontend: https://vercel.com/reduan-ahmads-projects/[frontend-name]

View:
- Deployment history
- Runtime logs
- Analytics
- Environment variables
```

## 🎨 Branch Strategy

```
main/master (Production)
    │
    ├─ feature/new-feature (Preview)
    │  └─ Creates preview deployment
    │
    ├─ fix/bug-fix (Preview)
    │  └─ Creates preview deployment
    │
    └─ develop (Preview)
       └─ Creates preview deployment

Merge to main → Production Deployment
```

## ✅ Success Indicators

### Successful Deployment:
```
✅ Green checkmark in GitHub Actions
✅ No errors in workflow logs
✅ Vercel shows "Ready" status
✅ Application accessible at URL
✅ Health check returns 200 OK
```

### Failed Deployment:
```
❌ Red X in GitHub Actions
❌ Error messages in logs
❌ Vercel shows "Error" status
❌ Application not accessible
❌ Check logs for details
```

## 🆘 Quick Troubleshooting

```
Problem: Workflow doesn't run
Solution: Check if files in correct folder changed

Problem: Build fails
Solution: Check GitHub Actions logs

Problem: Deployment fails
Solution: Check Vercel logs

Problem: App crashes
Solution: Check environment variables

Problem: Database error
Solution: Check DATABASE_URL in Vercel
```

## 🎓 Next Steps After Setup

1. ✅ Add GitHub Secrets
2. ✅ Set Vercel Environment Variables
3. ✅ Push code to test
4. ✅ Monitor deployment
5. ✅ Verify app is live
6. ✅ Test all features
7. ✅ Share with team!

---

**Ready to deploy?** Just push your code! 🚀
