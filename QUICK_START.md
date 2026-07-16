# 🚀 Quick Start Guide (5-10 minutes)

## 1️⃣ Copy Environment Template
```bash
cp .env .env.local
```

## 2️⃣ Get Supabase Credentials

Go to https://supabase.com:
1. Create project
2. Settings > API
3. Copy and paste into `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_url_here
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key_here
   SUPABASE_SERVICE_ROLE_KEY=your_key_here
   ```

## 3️⃣ Create Database Tables

In Supabase SQL Editor, paste this:
```sql
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

CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT now()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "projects_public" ON projects FOR SELECT USING (true);
CREATE POLICY "projects_owner" ON projects FOR INSERT,UPDATE,DELETE 
  USING (auth.jwt() ->> 'email' = 'your_email@example.com');

CREATE POLICY "messages_public_create" ON messages FOR INSERT USING (true);
CREATE POLICY "messages_owner" ON messages FOR SELECT,UPDATE,DELETE 
  USING (auth.jwt() ->> 'email' = 'your_email@example.com');
```

## 4️⃣ Create Storage Bucket

In Supabase Storage:
1. Click "New Bucket"
2. Name: `MERYAMSWILEM`
3. Uncheck "Private bucket"
4. Create

## 5️⃣ Get Coflow OAuth Credentials

Register your app with Coflow:
- Get `Client ID` and `Client Secret`
- Set callback to: `http://localhost:3000/api/auth/coflow/callback`

Add to `.env.local`:
```
NEXT_PUBLIC_COFLOW_CLIENT_ID=your_id_here
COFLOW_CLIENT_SECRET=your_secret_here
COFLOW_CALLBACK_URL=http://localhost:3000/api/auth/coflow/callback
OWNER_EMAIL=your_email@example.com
```

## 6️⃣ Run Locally
```bash
pnpm install
pnpm dev
```

Visit: http://localhost:3000

## 7️⃣ Test It

- [ ] Home page loads ✓
- [ ] Try contact form
- [ ] Visit `/dashboard` → login redirects you
- [ ] Create a project after login
- [ ] See it on home page
- [ ] View project details

## 📋 Key URLs

| Page | URL |
|------|-----|
| Home/Gallery | `/` |
| Contact | `/contact` |
| Project Detail | `/projects/[id]` |
| Dashboard | `/dashboard` |
| Projects Mgmt | `/dashboard/projects` |
| Messages | `/dashboard/messages` |
| Settings | `/dashboard/settings` |
| Login | `/login` |

## 🔧 Most Common Tasks

### Add Your Brand Name
Find all "Meryam Swilem" and replace with your name

### Change Colors
Edit `app/globals.css` CSS variables section

### Change Categories
Edit `lib/constants.ts` - `PROJECT_CATEGORIES` array

### Change Logo/Icon
Replace files in `/public` directory

## ⚠️ Important Reminders

- ✅ `.env.local` is NOT committed to git (security)
- ✅ Service role key must NEVER be exposed
- ✅ Coflow secret must NEVER be exposed
- ✅ RLS policies must use YOUR email
- ✅ Storage bucket must be PUBLIC for images

## 🆘 If Something Breaks

1. **"supabaseUrl is required"** → Check `.env.local` exists
2. **"Not authenticated"** → Check Coflow credentials
3. **Images not uploading** → Check bucket is PUBLIC
4. **Database errors** → Check tables were created
5. **Can't access dashboard** → Check email matches OWNER_EMAIL

## 📚 Full Documentation

- Detailed setup: `SETUP_GUIDE.md`
- Feature overview: `PROJECT_SUMMARY.md`
- Technical notes: `IMPLEMENTATION_NOTES.md`
- Full docs: `README.md`

## 🚀 Deploy to Vercel

1. Push code to GitHub
2. Go to vercel.com
3. Create new project
4. Add same env variables
5. Deploy!

---

**You're all set!** 🎉

Questions? Check the documentation files above.
