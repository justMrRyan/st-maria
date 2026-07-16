# Setup Checklist - Email/Password Authentication

Use this checklist to complete your setup step-by-step.

## ✅ Preparation (5 minutes)

- [ ] Have Supabase account (supabase.com)
- [ ] Have your Supabase project open
- [ ] Have text editor ready to edit .env.local
- [ ] Have browser ready for testing

## 🔑 Get Credentials (5 minutes)

Follow **GET_CREDENTIALS_STEP_BY_STEP.md** to collect:

- [ ] **Project URL**
  - From: Supabase > Settings > API
  - Format: `https://your-project.supabase.co`
  - Save as: `NEXT_PUBLIC_SUPABASE_URL`

- [ ] **Anon Public Key**
  - From: Supabase > Settings > API > "anon public"
  - Format: `eyJhbGc...` (very long)
  - Save as: `NEXT_PUBLIC_SUPABASE_ANON_KEY`

- [ ] **Service Role Key**
  - From: Supabase > Settings > API > "service_role secret"
  - Format: `eyJhbGc...` (very long)
  - Save as: `SUPABASE_SERVICE_ROLE_KEY`
  - ⚠️ Keep this SECRET!

## 🔧 Environment Setup (2 minutes)

- [ ] In project root, copy file:
  ```bash
  cp .env .env.local
  ```

- [ ] Edit `.env.local` and paste:
  ```env
  NEXT_PUBLIC_SUPABASE_URL=https://...
  NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
  SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
  NEXT_PUBLIC_OWNER_EMAIL=your@email.com
  ```

- [ ] Verify .env.local:
  - [ ] No extra spaces
  - [ ] Keys start with `eyJ`
  - [ ] All values filled in
  - [ ] Saved successfully

## 📊 Database Setup (3 minutes)

- [ ] Open Supabase > SQL Editor
- [ ] Click "New Query"
- [ ] Open `database/schema.sql` file
- [ ] Copy ALL SQL code
- [ ] Paste into Supabase editor
- [ ] Click "Run" button
- [ ] Check: No errors (should succeed)
- [ ] Verify tables created:
  - [ ] `projects` table exists
  - [ ] `messages` table exists

## 💾 Storage Setup (2 minutes)

- [ ] Go to Supabase > Storage > Buckets
- [ ] Click "New Bucket"
- [ ] Enter name: `MERYAMSWILEM`
- [ ] Uncheck: "Private bucket" (must be PUBLIC)
- [ ] Click "Create"
- [ ] Verify bucket:
  - [ ] `MERYAMSWILEM` appears in list
  - [ ] Shows as "Public"

## 🚀 Dev Server (2 minutes)

- [ ] Stop any running dev server (Ctrl+C)
- [ ] Terminal command:
  ```bash
  pnpm dev
  ```
- [ ] Wait for: "ready - started server on 0.0.0.0:3000"
- [ ] No red errors in terminal

## 🧪 Test Login (5 minutes)

- [ ] Open browser: http://localhost:3000
- [ ] Home page loads (no errors)
- [ ] Click "Login" button (top right)
- [ ] See login form with:
  - [ ] Email input field
  - [ ] Password input field
  - [ ] "Create Account" / "Sign In" buttons

### Test 1: Create Account
- [ ] Click "Create Account"
- [ ] Enter email: your@email.com (must match NEXT_PUBLIC_OWNER_EMAIL)
- [ ] Enter password: TestPassword123!
- [ ] Click "Create Account"
- [ ] See success message
- [ ] Redirected to dashboard
- [ ] URL shows: http://localhost:3000/dashboard

### Test 2: Dashboard Access
- [ ] You're now on dashboard
- [ ] See navigation bar with: Dashboard, Projects, Messages, Settings
- [ ] See "Logout" button
- [ ] No errors in browser console

### Test 3: Create Project
- [ ] Click "Projects" in navigation
- [ ] Click "New Project" button
- [ ] Fill in form:
  - [ ] Title: "Test Project"
  - [ ] Description: "A test interior design project"
  - [ ] Category: "Living Room"
  - [ ] Date: Today
  - [ ] Upload images (at least 1)
- [ ] Click "Create"
- [ ] Success message appears
- [ ] Back at projects page

### Test 4: View Public Gallery
- [ ] Click "Meryam Swilem" logo (top left)
- [ ] Go back to home page
- [ ] See project in Netflix-style gallery
- [ ] Can see project thumbnail
- [ ] Can click to view details

### Test 5: Sign Out
- [ ] Go to dashboard
- [ ] Click "Logout" button
- [ ] Redirected to home page
- [ ] Try accessing /dashboard
- [ ] Redirected to /login
- [ ] ✅ Access control works!

## 🎉 All Done!

If all checkboxes are marked:

```
✅ Environment configured
✅ Database created
✅ Storage bucket created
✅ Dev server running
✅ Login works
✅ Dashboard accessible
✅ Projects can be created
✅ Gallery works
✅ Sign out works
```

**You're ready to deploy!** 🚀

## If Something Fails

1. Check which step failed
2. Look at the relevant guide:
   - Credentials issue → **GET_CREDENTIALS_STEP_BY_STEP.md**
   - Connection issue → **SUPABASE_DEBUG.md**
   - Setup issue → **QUICK_SETUP_EMAIL_PASSWORD.md**
   - Technical issue → **EMAIL_PASSWORD_AUTH_GUIDE.md**

3. Read the troubleshooting section
4. Restart dev server: `pnpm dev`
5. Try again

## Support Files

Quick reference if you need help:

| Issue | Read This |
|-------|-----------|
| Can't find credentials | GET_CREDENTIALS_STEP_BY_STEP.md |
| Connection errors | SUPABASE_DEBUG.md |
| Login not working | EMAIL_PASSWORD_AUTH_GUIDE.md |
| Setup steps | QUICK_SETUP_EMAIL_PASSWORD.md |
| Technical details | AUTH_CHANGES_SUMMARY.md |
| All guides | README_AUTH_UPDATE.md |

---

**Time to complete: 20-30 minutes**

Start with: **GET_CREDENTIALS_STEP_BY_STEP.md**

Good luck! 🎨✨
