# 🚀 Quick Reference - GitHub Secrets

Add these secrets to your GitHub repository:
**URL**: https://github.com/reduanahmadswe/Daffodil_AI_Club/settings/secrets/actions

## Required Secrets:

### 1. VERCEL_TOKEN
- **Get from**: https://vercel.com/account/tokens
- **How**: Click "Create Token" → Name it "GitHub Actions" → Copy the token

### 2. VERCEL_ORG_ID
```
team_W677X2QW5NgORaMDpDKZcZJQ
```

### 3. VERCEL_BACKEND_PROJECT_ID
```
prj_NMD2Be3AfWS31hpxHrsQBfuFo3L6
```

### 4. VERCEL_FRONTEND_PROJECT_ID
```
prj_IhHSL9TkLoG6ZLCK2vpOakF5CJ1i
```

### 5. NEXT_PUBLIC_API_URL
```
https://aiclubbackend.vercel.app
```

---

## 📝 Quick Steps:

1. ✅ Go to GitHub Secrets page (link above)
2. ✅ Click "New repository secret"
3. ✅ Add each secret one by one
4. ✅ Commit and push your code
5. ✅ Watch the magic happen in the Actions tab!

---

## 🧪 Test Your Setup:

```bash
# Make a small change
echo "# CI/CD Test" >> README.md

# Commit and push
git add .
git commit -m "test: CI/CD pipeline"
git push origin main

# Check deployment status
# Go to: https://github.com/reduanahmadswe/Daffodil_AI_Club/actions
```

---

## 🎯 What Happens After Push:

1. **GitHub Actions** detects your push
2. **Workflow runs** (build & test)
3. **Auto-deploys** to Vercel
4. **Live in seconds!** 🚀

Backend: https://aiclubbackend.vercel.app
Frontend: (will be assigned by Vercel)

---

For detailed setup instructions, see: **CI_CD_SETUP.md**
