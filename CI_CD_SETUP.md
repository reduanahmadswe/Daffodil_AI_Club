# CI/CD Pipeline Setup Guide

This guide will help you set up automatic deployment to Vercel whenever you push code to GitHub.

## 🚀 Overview

- **Backend**: Automatically deploys to Vercel when you push changes to the `backend/` folder
- **Frontend**: Automatically deploys to Vercel when you push changes to the `frontend/` folder
- **Branch Strategy**: 
  - Push to `main` or `master` → Production deployment
  - Pull Request → Preview deployment

## 📋 Prerequisites

1. GitHub repository: ✅ (Already set up at https://github.com/reduanahmadswe/Daffodil_AI_Club)
2. Vercel account
3. Both projects deployed to Vercel (Backend and Frontend)

## 🔧 Setup Steps

### Step 1: Get Vercel Credentials

#### 1.1 Get Vercel Token
1. Go to https://vercel.com/account/tokens
2. Click "Create Token"
3. Name it "GitHub Actions CI/CD"
4. Copy the token (you'll need this for GitHub Secrets)

#### 1.2 Get Vercel Organization ID
Run this command in your terminal:
```bash
cd backend
vercel link
```
This will create a `.vercel/project.json` file. Open it and copy the `orgId`.

Or you can find it at: https://vercel.com/account
- Click on your profile → Settings → General → Your Organization ID

#### 1.3 Get Backend Project ID
```bash
cd backend
cat .vercel/project.json
```
Copy the `projectId` value.

#### 1.4 Get Frontend Project ID
```bash
cd frontend
vercel link  # If not already linked
cat .vercel/project.json
```
Copy the `projectId` value.

### Step 2: Add GitHub Secrets

1. Go to your GitHub repository: https://github.com/reduanahmadswe/Daffodil_AI_Club
2. Click on **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret** and add the following secrets:

| Secret Name | Value | Description |
|-------------|-------|-------------|
| `VERCEL_TOKEN` | Your Vercel token from Step 1.1 | Allows GitHub to deploy to Vercel |
| `VERCEL_ORG_ID` | Your org ID from Step 1.2 | Your Vercel organization ID |
| `VERCEL_BACKEND_PROJECT_ID` | Backend project ID from Step 1.3 | Backend project identifier |
| `VERCEL_FRONTEND_PROJECT_ID` | Frontend project ID from Step 1.4 | Frontend project identifier |
| `NEXT_PUBLIC_API_URL` | `https://aiclubbackend.vercel.app` | Backend API URL for frontend |

### Step 3: Add Vercel Environment Variables

#### For Backend:
1. Go to https://vercel.com/reduan-ahmads-projects/aiclubbackend/settings/environment-variables
2. Add all your environment variables from `.env`:
   - `DATABASE_URL` - Your PostgreSQL connection string
   - `JWT_SECRET` - Your JWT secret
   - `JWT_EXPIRES_IN` - JWT expiration time
   - `FRONTEND_URL` - Your frontend URL (will be `https://your-frontend.vercel.app`)
   - `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASSWORD` - Email config
   - `NODE_ENV` - Set to `production`

#### For Frontend:
1. Go to your frontend project settings on Vercel
2. Add environment variables:
   - `NEXT_PUBLIC_API_URL` - `https://aiclubbackend.vercel.app`
   - Any other environment variables your frontend needs

### Step 4: Test the Pipeline

1. Make a small change to your backend or frontend code
2. Commit and push:
```bash
git add .
git commit -m "test: CI/CD pipeline"
git push origin main
```

3. Go to your GitHub repository → **Actions** tab
4. You should see the workflow running
5. Once complete, your changes will be live on Vercel!

## 📁 Project Structure

```
Daffodil_AI_Club/
├── .github/
│   └── workflows/
│       ├── deploy-backend.yml   # Backend CI/CD workflow
│       └── deploy-frontend.yml  # Frontend CI/CD workflow
├── backend/
│   ├── .vercel/
│   │   └── project.json        # Vercel project config
│   ├── api/
│   ├── src/
│   ├── vercel.json             # Vercel deployment config
│   └── package.json
└── frontend/
    ├── .vercel/
    │   └── project.json        # Vercel project config
    ├── src/
    ├── vercel.json             # Vercel deployment config
    └── package.json
```

## 🔄 How It Works

### Backend Deployment Flow:
1. You push code to GitHub (main/master branch)
2. GitHub Actions detects changes in `backend/` folder
3. Workflow runs:
   - Installs dependencies
   - Generates Prisma Client
   - Builds the project
   - Deploys to Vercel
4. Your backend is live at: https://aiclubbackend.vercel.app

### Frontend Deployment Flow:
1. You push code to GitHub (main/master branch)
2. GitHub Actions detects changes in `frontend/` folder
3. Workflow runs:
   - Installs dependencies
   - Builds Next.js app
   - Deploys to Vercel
4. Your frontend is live at: https://your-frontend.vercel.app

## 🎯 Deployment Triggers

### Automatic Deployment (Production):
- Push to `main` or `master` branch
- Only deploys if files in respective folder changed

### Preview Deployment:
- Create a Pull Request
- Vercel creates a preview URL for testing

## 🛠️ Useful Commands

### Check workflow status:
```bash
# View recent workflow runs
gh run list

# View specific workflow logs
gh run view <run-id>
```

### Manual deployment (if needed):
```bash
# Backend
cd backend
vercel --prod

# Frontend
cd frontend
vercel --prod
```

### View deployment logs:
```bash
vercel logs <deployment-url>
```

## 🐛 Troubleshooting

### Workflow fails with "VERCEL_TOKEN not found"
- Make sure you added all GitHub Secrets correctly
- Secret names are case-sensitive

### Prisma Client error
- Ensure `DATABASE_URL` is set in Vercel environment variables
- Check that `prisma generate` runs in the workflow

### Build fails
- Check the GitHub Actions logs for specific errors
- Ensure all dependencies are in `package.json`
- Verify environment variables are set correctly

### Frontend can't connect to backend
- Check `NEXT_PUBLIC_API_URL` is set correctly
- Verify CORS settings in backend allow your frontend URL

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Prisma on Vercel](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel)

## ✅ Checklist

- [ ] Vercel token created
- [ ] Organization ID obtained
- [ ] Backend project ID obtained
- [ ] Frontend project ID obtained
- [ ] All GitHub Secrets added
- [ ] Backend environment variables set in Vercel
- [ ] Frontend environment variables set in Vercel
- [ ] Test deployment successful
- [ ] Backend accessible at production URL
- [ ] Frontend accessible at production URL
- [ ] Frontend can communicate with backend

## 🎉 Success!

Once everything is set up, you can simply:
```bash
git add .
git commit -m "your changes"
git push
```

And your application will automatically deploy! 🚀
