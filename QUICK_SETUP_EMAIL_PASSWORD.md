# Quick Setup - Email/Password Authentication

## 5 Simple Steps

### Step 1: Get Supabase Credentials (2 min)

```
1. Go to https://app.supabase.com
2. Select your project: tywipgyhoyzdyunrllgi
3. Click Settings > API
4. Copy Project URL
5. Copy "anon public" key
6. Copy "service_role secret" key
```

### Step 2: Create .env.local (1 min)

```bash
cp .env .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://tywipgyhoyzdyunrllgi.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...PASTE_ANON_KEY_HERE
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...PASTE_SERVICE_ROLE_KEY_HERE
NEXT_PUBLIC_OWNER_EMAIL=your_email@example.com
```

### Step 3: Create Database Tables (2 min)

```
1. Go to Supabase > SQL Editor
2. Click "New Query"
3. Open database/schema.sql
4. Copy ALL the SQL
5. Paste into SQL Editor
6. Click "Run"
```

### Step 4: Create Storage Bucket (1 min)

```
1. Go to Supabase > Storage
2. Click "New Bucket"
3. Name: MERYAMSWILEM
4. UNCHECK "Private bucket"
5. Click "Create"
```

### Step 5: Start Dev Server (1 min)

```bash
pnpm dev
```

Visit http://localhost:3000

## Test It

1. Click "Login" button
2. Click "Create Account"
3. Enter your email and password
4. You're logged in! ✅

## Troubleshooting

### "Supabase URL is required"
- Check `.env.local` exists
- Restart: `pnpm dev`

### "Invalid login credentials"
- Make sure you created account first
- Check email/password spelling

### "Cannot access dashboard"
- Your email must match `NEXT_PUBLIC_OWNER_EMAIL` in .env.local
- Update .env.local if needed
- Restart: `pnpm dev`

### "Cannot upload images"
- Check storage bucket exists (MERYAMSWILEM)
- Make sure it's PUBLIC (not private)

## That's It!

Your app is ready to use. Go to http://localhost:3000

For more help: See `EMAIL_PASSWORD_AUTH_GUIDE.md`

