# Interior Design Portfolio Website

A full-stack portfolio website for interior designer Meryam Swilem with a Netflix-style project gallery, contact form, and owner dashboard for managing projects and messages.

## Features

### Public Pages
- **Home/Portfolio Gallery**: Netflix-style project gallery with category filtering
- **Project Details**: Individual project pages with image galleries, descriptions, and details
- **Contact Form**: Contact form to submit inquiries (stored in database)

### Protected Dashboard (Owner Only)
- **Projects Management**: Create, edit, and delete projects with multi-image uploads
- **Image Upload**: Upload images directly to Supabase Storage
- **Messages Inbox**: View and manage contact form submissions with email copy functionality
- **Settings**: View account information and dashboard settings

## Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS, shadcn/ui
- **Database**: Supabase PostgreSQL with Row-Level Security (RLS)
- **Storage**: Supabase Storage (MERYAMSWILEM bucket)
- **Authentication**: Coflow OAuth (external provider)
- **Validation**: React Hook Form + Zod
- **Notifications**: Sonner (toast notifications)

## Prerequisites

1. **Supabase Account**: Create a project at [supabase.com](https://supabase.com)
2. **Coflow OAuth Setup**: Register your application for OAuth (if using Coflow)
3. **Node.js**: v18+ installed on your machine

## Quick Setup

### 1. Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env .env.local
```

Edit `.env.local` with your:
- Supabase URL and keys
- Coflow OAuth credentials
- Owner email (for access control)

### 2. Database Setup

In your Supabase SQL Editor, run these commands to create the tables:

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

-- Enable RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Projects RLS Policies
CREATE POLICY "projects_are_public" ON projects FOR SELECT USING (true);
CREATE POLICY "projects_insert_owner" ON projects FOR INSERT 
  WITH CHECK (auth.jwt() ->> 'email' = env::text('OWNER_EMAIL'));
CREATE POLICY "projects_update_owner" ON projects FOR UPDATE
  USING (auth.jwt() ->> 'email' = env::text('OWNER_EMAIL'));
CREATE POLICY "projects_delete_owner" ON projects FOR DELETE
  USING (auth.jwt() ->> 'email' = env::text('OWNER_EMAIL'));

-- Messages RLS Policies
CREATE POLICY "messages_insert_public" ON messages FOR INSERT WITH CHECK (true);
CREATE POLICY "messages_select_owner" ON messages FOR SELECT
  USING (auth.jwt() ->> 'email' = env::text('OWNER_EMAIL'));
CREATE POLICY "messages_update_owner" ON messages FOR UPDATE
  USING (auth.jwt() ->> 'email' = env::text('OWNER_EMAIL'));
CREATE POLICY "messages_delete_owner" ON messages FOR DELETE
  USING (auth.jwt() ->> 'email' = env::text('OWNER_EMAIL'));
```

### 3. Storage Bucket Setup

1. Go to **Supabase Dashboard > Storage > Buckets**
2. Click **"New Bucket"**
3. Name: `MERYAMSWILEM`
4. Uncheck **"Private bucket"** (to make images publicly accessible)
5. Click **Create bucket**

### 4. Install Dependencies

```bash
pnpm install
# or
npm install
# or
yarn install
```

### 5. Run Development Server

```bash
pnpm dev
# or
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Project Structure

```
app/
├── route.ts                          # Home/Portfolio gallery
├── contact/
│   └── route.ts                      # Contact form page
├── projects/[id]/
│   └── route.ts                      # Project detail page
├── dashboard/
│   ├── layout.tsx                    # Protected dashboard layout
│   ├── route.ts                      # Dashboard home
│   ├── projects/
│   │   ├── route.ts                  # Projects management
│   │   ├── new/route.ts              # Create project
│   │   └── [id]/edit/route.ts        # Edit project
│   ├── messages/route.ts             # Messages inbox
│   └── settings/route.ts             # Settings page
├── api/
│   ├── auth/
│   │   ├── coflow/callback/route.ts  # Coflow OAuth callback
│   │   └── logout/route.ts           # Logout endpoint
│   ├── projects/
│   │   ├── route.ts                  # GET/POST projects
│   │   └── [id]/route.ts             # GET/PUT/DELETE single project
│   ├── messages/
│   │   ├── route.ts                  # GET/POST messages
│   │   └── [id]/route.ts             # PATCH/DELETE message
│   └── upload/route.ts               # Image upload to Supabase Storage
│
components/
├── ProjectCard.tsx                   # Individual project card
├── ProjectGallery.tsx                # Gallery grid with filtering
├── ContactForm.tsx                   # Contact form component
├── ProjectForm.tsx                   # Create/edit project form
├── ImageUpload.tsx                   # Image upload component
├── MessagesTable.tsx                 # Messages table
├── DashboardNav.tsx                  # Dashboard navigation
└── ProtectedRoute.tsx                # Auth protection wrapper

lib/
├── auth.ts                           # Authentication utilities
├── constants.ts                      # App constants
└── supabase/
    ├── client.ts                     # Supabase client (browser)
    └── server.ts                     # Supabase server (admin)

types/
└── index.ts                          # TypeScript types
```

## Key Features Explained

### Authentication Flow

1. User visits `/dashboard` → redirected to `/login`
2. Clicks "Sign In with Coflow" → redirected to Coflow OAuth
3. After authentication → callback to `/api/auth/coflow/callback`
4. Server verifies email matches `OWNER_EMAIL` environment variable
5. If match → session created, user redirected to dashboard
6. If no match → redirected to `/unauthorized`

### Image Upload

1. Owner uploads images in project form → `/api/upload`
2. Images stored in Supabase Storage (`MERYAMSWILEM` bucket)
3. Public URL returned and stored in project
4. Frontend displays images from public URLs

### Contact Messages

1. Visitor submits contact form → `POST /api/messages`
2. Message stored in `messages` table
3. Owner views in dashboard → `/dashboard/messages`
4. Owner can mark as read/unread or delete
5. To reply: click email to copy, use own email client

### Row-Level Security (RLS)

- **Projects**: Public read, owner-only write
- **Messages**: Public create, owner-only read/update/delete
- All access controlled via `OWNER_EMAIL` environment variable

## Authentication with Coflow

The app uses external Coflow OAuth. You need to:

1. Register your app at your Coflow provider
2. Get `Client ID` and `Client Secret`
3. Set callback URL to: `{YOUR_DOMAIN}/api/auth/coflow/callback`
4. Add credentials to `.env.local`

### If Using Different OAuth Provider

To use a different OAuth provider (Google, GitHub, etc.):

1. Update the OAuth URL in `app/login/route.ts`
2. Update the token exchange in `app/api/auth/coflow/callback/route.ts`
3. Update environment variable names as needed
4. Follow the provider's documentation

## API Routes

### Projects
- `GET /api/projects` - Fetch all projects (public)
- `GET /api/projects/[id]` - Fetch single project (public)
- `POST /api/projects` - Create project (owner only)
- `PUT /api/projects/[id]` - Update project (owner only)
- `DELETE /api/projects/[id]` - Delete project (owner only)

### Messages
- `GET /api/messages` - Fetch all messages (owner only)
- `POST /api/messages` - Submit contact form (public)
- `PATCH /api/messages/[id]` - Mark read/update (owner only)
- `DELETE /api/messages/[id]` - Delete message (owner only)

### Auth
- `GET /api/auth/coflow/callback` - Coflow OAuth callback
- `POST /api/auth/logout` - Logout

### Upload
- `POST /api/upload` - Upload image to Supabase Storage (owner only)

## Styling

The app uses:
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Pre-built components (Button, Input, etc.)
- **Design System**: 3-5 colors, 2 font families (system fonts for performance)

Customize theme in `app/globals.css`.

## Deployment to Vercel

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Add environment variables from `.env.local`
   - Click "Deploy"

3. **Update OAuth Callback URLs**
   - Update `COFLOW_CALLBACK_URL` to your production domain
   - Update Coflow app settings to allow your production domain

## Troubleshooting

### "Not authenticated" error
- Check that Coflow is properly configured in `.env.local`
- Ensure `OWNER_EMAIL` matches your Coflow account email
- Clear browser localStorage and try again

### Images not uploading
- Verify Supabase Storage bucket `MERYAMSWILEM` exists
- Ensure bucket is public (not private)
- Check Supabase service role key has storage permissions

### Database queries failing
- Verify tables were created in Supabase
- Check RLS policies are correctly set
- Ensure service role key is being used for admin operations

### OAuth callback not working
- Verify callback URL matches exactly in Coflow settings
- Check `COFLOW_CLIENT_ID` and `COFLOW_CLIENT_SECRET` are correct
- Look at server logs for specific error

## Need Help?

- **Supabase Docs**: https://supabase.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **shadcn/ui**: https://ui.shadcn.com

## License

This project is private and created for Meryam Swilem Interior Design.
