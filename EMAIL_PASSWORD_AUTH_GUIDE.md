# Email/Password Authentication Setup Guide

## Overview

The app now uses **Supabase Auth with email and password** instead of OAuth. This is simpler to set up and use.

## How It Works

1. **User Creates Account**: Visit `/login` and click "Create Account"
2. **User Signs Up**: Enter email and password, account is created in Supabase Auth
3. **User Signs In**: Use email and password to log in
4. **Session Management**: Session is stored in browser localStorage
5. **Access Control**: Only users with email matching `NEXT_PUBLIC_OWNER_EMAIL` can access dashboard

## Setup Instructions

### Step 1: Get Supabase Credentials

1. Go to https://app.supabase.com
2. Select your project (or create one)
3. Click **Settings** (bottom left)
4. Click **API**
5. Copy these values:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role secret** → `SUPABASE_SERVICE_ROLE_KEY`

### Step 2: Create .env.local

```bash
cp .env .env.local
```

Edit `.env.local` and fill in:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...your-key-here
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...your-key-here
NEXT_PUBLIC_OWNER_EMAIL=your@email.com
```

### Step 3: Create Database Tables

1. Go to your Supabase project
2. Click **SQL Editor**
3. Click **New Query**
4. Copy the entire contents of `database/schema.sql`
5. Paste it into the editor
6. Click **Run**
7. Done! Tables are created

### Step 4: Create Storage Bucket

1. Go to Supabase > **Storage**
2. Click **New Bucket**
3. Name: `MERYAMSWILEM`
4. **Uncheck** "Private bucket" (make it public)
5. Click **Create**

### Step 5: Enable Supabase Auth

1. Go to Supabase > **Authentication**
2. Click **Settings**
3. Under "Providers", make sure **Email** is enabled
4. That's it! Email auth is enabled by default

### Step 6: Restart Dev Server

```bash
# Stop current server (Ctrl+C)
pnpm dev
```

## Testing the App

### Test 1: Create Account

1. Visit http://localhost:3000/login
2. Click "Create Account"
3. Enter email: `your@email.com` (must match `NEXT_PUBLIC_OWNER_EMAIL`)
4. Enter password: anything (e.g., `Test123!`)
5. Click "Create Account"
6. You should be redirected to dashboard

### Test 2: Sign In

1. Visit http://localhost:3000/login
2. Enter email and password
3. Click "Sign In"
4. You should be redirected to dashboard

### Test 3: Create Project (Owner Only)

1. In dashboard, click "Projects"
2. Click "New Project"
3. Fill in form:
   - Title: "My First Project"
   - Description: "A beautiful interior design"
   - Category: "Living Room"
   - Date: Today
   - Images: Upload 2-3 images
4. Click "Create"
5. Project should appear in the gallery

### Test 4: View Public Gallery

1. Visit http://localhost:3000
2. You should see the project in the Netflix-style gallery
3. Click on project to see details

### Test 5: Sign Out

1. In dashboard, click "Logout"
2. You should be redirected to home page
3. Try accessing /dashboard - should redirect to login

## Common Errors & Solutions

### Error: "Supabase URL is required"

**Problem**: Environment variable not loaded

**Solution**:
1. Check `.env.local` exists in project root (same level as `package.json`)
2. Restart dev server: `pnpm dev`
3. Make sure URL is correct: `https://your-project.supabase.co`

### Error: "Invalid login credentials"

**Problem**: Email/password is wrong

**Solution**:
1. Verify you created the account first (click "Create Account")
2. Make sure password is correct
3. Check for extra spaces in email

### Error: "User already exists"

**Problem**: Email is already registered

**Solution**:
1. Go to Supabase > Authentication > Users
2. Delete the user (or use different email)
3. Create account again

### Error: "Cannot access dashboard"

**Problem**: Your email doesn't match `NEXT_PUBLIC_OWNER_EMAIL`

**Solution**:
1. Sign out
2. Update `.env.local` with the email you signed up with
3. Restart dev server: `pnpm dev`
4. Sign in again

### Error: "Cannot upload images"

**Problem**: Storage bucket doesn't exist or is private

**Solution**:
1. Go to Supabase > Storage > Buckets
2. Check if `MERYAMSWILEM` bucket exists
3. If not, create it (see Step 4 above)
4. If it exists but is private, delete and recreate as public

### Error: "Network request failed"

**Problem**: Can't connect to Supabase

**Solution**:
1. Check internet connection
2. Verify Supabase project is active (not suspended)
3. Check the URL is correct: `https://your-project.supabase.co`
4. Check anon key starts with `eyJ`

## Debugging Tips

### Check Console for Errors

1. Open browser DevTools (F12)
2. Click "Console" tab
3. Look for red error messages
4. Copy the error and search online

### Test Supabase Connection

Open browser console and run:

```javascript
const { createClient } = await import('@supabase/supabase-js');
const supabase = createClient(
  'https://your-project.supabase.co',
  'your-anon-key'
);
const { data } = await supabase.auth.getSession();
console.log(data);
```

Should return session data if connected properly.

### Check Network Requests

1. Open DevTools > Network tab
2. Try to sign in
3. Look for requests to `supabase.co`
4. Click on each request and check Response tab
5. Look for error messages

## How Authentication Works (Technical)

1. User enters email/password on login page
2. `signInWithEmail()` is called from `lib/auth.ts`
3. Credentials sent to Supabase Auth API
4. If valid, Supabase returns session
5. Session is stored in localStorage as `meryam_session`
6. Session includes: email, isOwner (boolean), expiresAt
7. `ProtectedRoute` component checks if user is owner
8. Only owner can access /dashboard routes

## File Structure

```
app/
├── login/route.ts                 # Login form (email/password)
├── api/auth/
│   ├── logout/route.ts           # Logout endpoint
│   └── coflow/callback/route.ts  # ❌ DELETED (no longer needed)
├── dashboard/
│   ├── route.ts                  # Owner dashboard
│   ├── projects/route.ts         # Project management
│   ├── messages/route.ts         # Messages inbox
│   └── settings/route.ts         # Settings page

lib/
├── auth.ts                        # Authentication functions
│   ├── signInWithEmail()
│   ├── signUpWithEmail()
│   ├── signOut()
│   ├── getSession()
│   └── isOwner()
├── supabase/
│   ├── client.ts                 # Supabase client (browser)
│   └── server.ts                 # Supabase client (server)
```

## Next Steps

1. **Customize styling**: Edit `app/globals.css` and component files
2. **Add more projects**: Use dashboard to create projects
3. **Test with friends**: Share home page URL
4. **Deploy**: Deploy to Vercel (add env vars to Vercel project)

## Support

- Check `SUPABASE_DEBUG.md` for connection issues
- Check `.env.example` for configuration reference
- Check `database/schema.sql` for database setup
- Read inline code comments for implementation details

