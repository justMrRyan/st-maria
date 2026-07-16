# Complete Setup Guide

This guide will walk you through setting up the entire interior design portfolio website step-by-step.

## Step 1: Supabase Setup

### 1.1 Create a Supabase Project
1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click **"New Project"**
3. Enter a project name (e.g., "interior-design-portfolio")
4. Create a strong password for the database
5. Select your region (closest to your users)
6. Click **"Create new project"** (wait 1-2 minutes for setup)

### 1.2 Get Your Credentials
1. Go to **Settings > API**
2. Copy and save these values:
   - **Project URL**: `https://your-project.supabase.co`
   - **Anon Key**: Starts with `eyJ...` (safe to expose)
   - **Service Role Key**: Starts with `eyJ...` (KEEP SECRET)

These go into your `.env.local` file as:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

### 1.3 Create Database Tables

1. In Supabase, go to **SQL Editor**
2. Click **"New Query"**
3. Copy and paste this SQL:

```sql
-- Create projects table
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  date DATE NOT NULL,
  images JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Create messages table
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Projects - Everyone can read, owner can write
CREATE POLICY "projects_public_read" ON projects FOR SELECT USING (true);
CREATE POLICY "projects_owner_create" ON projects FOR INSERT 
  WITH CHECK (auth.jwt() ->> 'email' = 'your_email@example.com');
CREATE POLICY "projects_owner_update" ON projects FOR UPDATE
  USING (auth.jwt() ->> 'email' = 'your_email@example.com');
CREATE POLICY "projects_owner_delete" ON projects FOR DELETE
  USING (auth.jwt() ->> 'email' = 'your_email@example.com');

-- Messages - Public can create, owner can read/update/delete
CREATE POLICY "messages_public_create" ON messages FOR INSERT WITH CHECK (true);
CREATE POLICY "messages_owner_read" ON messages FOR SELECT
  USING (auth.jwt() ->> 'email' = 'your_email@example.com');
CREATE POLICY "messages_owner_update" ON messages FOR UPDATE
  USING (auth.jwt() ->> 'email' = 'your_email@example.com');
CREATE POLICY "messages_owner_delete" ON messages FOR DELETE
  USING (auth.jwt() ->> 'email' = 'your_email@example.com');
```

4. Replace `your_email@example.com` with your actual email address
5. Click **"Run"**

### 1.4 Create Storage Bucket

1. Go to **Storage > Buckets**
2. Click **"New Bucket"**
3. Name: `MERYAMSWILEM`
4. Make sure **"Private bucket"** is UNCHECKED (we want public access to images)
5. Click **"Create bucket"**

## Step 2: Coflow OAuth Setup

If you're using Coflow as your OAuth provider:

### 2.1 Create Coflow App

1. Go to your Coflow provider's dashboard
2. Click **"Create New App"** or **"New OAuth Application"**
3. App name: "Interior Design Portfolio"
4. Callback URL: `http://localhost:3000/api/auth/coflow/callback` (for development)

### 2.2 Get OAuth Credentials

After creating the app, you'll receive:
- **Client ID**: Copy this value
- **Client Secret**: Copy this value (keep it secret!)

These go into `.env.local` as:
```
NEXT_PUBLIC_COFLOW_CLIENT_ID=your_client_id
COFLOW_CLIENT_SECRET=your_client_secret
COFLOW_CALLBACK_URL=http://localhost:3000/api/auth/coflow/callback
```

## Step 3: Local Setup

### 3.1 Clone/Download Project

If you have the project files, navigate to the project directory:

```bash
cd /path/to/interior-design-portfolio
```

### 3.2 Create Environment Variables

1. Copy the example file:
   ```bash
   cp .env .env.local
   ```

2. Edit `.env.local` and fill in:
   ```
   # Supabase (from Step 1.2)
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
   SUPABASE_SERVICE_ROLE_KEY=eyJ...

   # Coflow OAuth (from Step 2.2)
   NEXT_PUBLIC_COFLOW_CLIENT_ID=your_client_id
   COFLOW_CLIENT_SECRET=your_client_secret
   COFLOW_CALLBACK_URL=http://localhost:3000/api/auth/coflow/callback

   # Your email (must match your Coflow account email)
   OWNER_EMAIL=your_email@example.com

   # App URLs
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   NEXT_PUBLIC_STORAGE_BUCKET=MERYAMSWILEM
   ```

### 3.3 Install Dependencies

```bash
pnpm install
# or npm install / yarn install / bun install
```

### 3.4 Run Development Server

```bash
pnpm dev
# or npm run dev
```

You should see:
```
  ▲ Next.js 16
  - ready started server on 0.0.0.0:3000, url: http://localhost:3000
```

## Step 4: Test the Application

### 4.1 Test Public Pages

1. Visit **http://localhost:3000** - You should see the home page
2. Click **"Get in Touch"** - You should see the contact form
3. Try submitting a test message (doesn't require auth)
4. Visit **http://localhost:3000/contact** - Contact page should load

### 4.2 Test Dashboard (Protected)

1. Visit **http://localhost:3000/dashboard**
2. You should be redirected to login page
3. Click **"Sign In with Coflow"**
4. Complete Coflow authentication with your email
5. You should be redirected to the dashboard

### 4.3 Test Project Management

1. In dashboard, click **"Projects"** or **"Manage Projects"**
2. Click **"+ New Project"** button
3. Fill in the form:
   - Title: "Test Project"
   - Category: "Kitchen"
   - Date: Today's date
   - Description: "This is a test project"
4. Click **"Upload Image"** and select an image file
5. Click **"Create Project"**
6. Project should appear on the home page gallery

### 4.4 Test Messages

1. Go back to home page (http://localhost:3000)
2. Click **"Get in Touch"**
3. Fill in the contact form with test data
4. Click **"Send Message"**
5. You should see a success message
6. Go to dashboard **"Messages"**
7. Your test message should appear in the table

## Step 5: Customize for Production

### 5.1 Update Callback URLs

When you deploy to production:

1. Update your Coflow app settings:
   - Change callback URL from `http://localhost:3000/...` to `https://yourdomain.com/api/auth/coflow/callback`

2. Update `.env.local`:
   ```
   NEXT_PUBLIC_APP_URL=https://yourdomain.com
   COFLOW_CALLBACK_URL=https://yourdomain.com/api/auth/coflow/callback
   ```

### 5.2 Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click **"New Project"**
4. Select your repository
5. Add environment variables from `.env.local`
6. Click **"Deploy"**

## Common Issues & Solutions

### Issue: "OAuth client not found"
**Solution**: Check that `COFLOW_CLIENT_ID` and `COFLOW_CLIENT_SECRET` match your Coflow app settings exactly.

### Issue: "Authentication failed"
**Solution**: 
- Verify your email matches `OWNER_EMAIL` in `.env.local`
- Check Coflow account email matches
- Clear browser cache and try again

### Issue: Images not uploading
**Solution**:
- Verify bucket `MERYAMSWILEM` exists in Supabase Storage
- Make sure it's PUBLIC (not private)
- Check image file size (max 5MB)
- Check image format (JPEG, PNG, WebP only)

### Issue: Messages not appearing
**Solution**:
- Check that `messages` table was created
- Verify RLS policies are set correctly
- Check browser console for errors (F12)

### Issue: "Error fetching projects"
**Solution**:
- Verify `NEXT_PUBLIC_SUPABASE_URL` is correct
- Check `NEXT_PUBLIC_SUPABASE_ANON_KEY` is correct
- Verify `projects` table was created
- Check RLS policy for public SELECT

## Next Steps

1. **Customize Design**: Edit `app/globals.css` and Tailwind theme
2. **Add Your Content**: Update project descriptions and add real images
3. **Test Everything**: Try all features in development
4. **Deploy**: Push to GitHub and deploy to Vercel
5. **Monitor**: Check Vercel logs and Supabase activity

## Support

If you encounter issues:

1. Check the README.md for detailed information
2. Review the specific setup section above
3. Check Supabase logs (Supabase Dashboard > Logs)
4. Check Vercel logs (Vercel Dashboard > Logs)
5. Look at browser console (F12 > Console tab)

Good luck! 🎉
