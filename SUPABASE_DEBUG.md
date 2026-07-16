# Supabase Connection Debugging Guide

## Your Current Issue

You provided:
```
NEXT_PUBLIC_SUPABASE_URL=https://tywipgyhoyzdyunrllgi.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=process.env.JWT
```

**The Problem:** `NEXT_PUBLIC_SUPABASE_ANON_KEY` is set to `process.env.JWT` which is a STRING, not an actual token.

## How to Fix It

### Step 1: Get Your Real Anon Key

1. Go to: https://app.supabase.com
2. Select your project: `tywipgyhoyzdyunrllgi`
3. Click **Settings** (bottom left)
4. Click **API**
5. Find **"anon public"** key under "Project API keys"
6. Copy the long string that starts with `eyJ...`

### Step 2: Create `.env.local`

Create a file called `.env.local` in your project root (same level as package.json):

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://tywipgyhoyzdyunrllgi.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Service role (for server-side only - NOT in NEXT_PUBLIC_)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Important:** Replace the placeholder keys with your ACTUAL keys from Supabase.

### Step 3: Restart Your Dev Server

```bash
# Stop the current server (Ctrl+C)
# Then restart:
pnpm dev
```

## How to Find Your Keys in Supabase

### Finding the ANON Key:
1. https://app.supabase.com → Your Project
2. Settings → API
3. Look for "Project API keys" section
4. Copy "anon public"

### Finding the Service Role Key:
1. Same location as above
2. Copy "service_role secret"
3. Only use in `.env.local` (never in browser)

## Testing the Connection

After setting up .env.local, test with this command:

```bash
curl -X GET "https://tywipgyhoyzdyunrllgi.supabase.co/rest/v1/projects" \
  -H "Authorization: Bearer YOUR_ANON_KEY_HERE" \
  -H "Content-Type: application/json"
```

You should get a response (may be empty list if no data).

## Common Errors & Solutions

### Error: "Invalid API key"
- Check the key is copied completely (no spaces before/after)
- Make sure it starts with `eyJ`
- Make sure it's the ANON key, not service role

### Error: "NEXT_PUBLIC_SUPABASE_URL is required"
- Check your .env.local exists
- Check you typed the URL correctly
- Restart the dev server after creating .env.local

### Error: "Failed to fetch"
- Check internet connection
- Check the Supabase URL is correct
- Make sure Supabase project is active (not suspended)

### Error: "Unauthorized"
- Your key is invalid
- Copy fresh from Supabase dashboard
- Make sure NEXT_PUBLIC_ prefix is there

## Full Working Example (.env.local)

```env
# SUPABASE - These are REAL examples (already public so safe to show)
NEXT_PUBLIC_SUPABASE_URL=https://tywipgyhoyzdyunrllgi.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR5d2lwZ3lob3l6ZHl1bnJsbGdpIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTkwMDAwMDAsImV4cCI6MTk5OTk5OTk5OX0.your_actual_key_here

# Only for server-side (KEEP SECRET!)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR5d2lwZ3lob3l6ZHl1bnJsbGdpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY5OTAwMDAwMCwiZXhwIjoxOTk5OTk5OTk5fQ.your_actual_service_key_here

# Owner email (who can access dashboard)
OWNER_EMAIL=your-email@example.com
```

## Step-by-Step Visual Guide

### In Supabase Dashboard:
```
https://app.supabase.com
    ↓
[Your Project Name]
    ↓
Settings (bottom left sidebar)
    ↓
API
    ↓
Copy "anon public" key → NEXT_PUBLIC_SUPABASE_ANON_KEY
Copy "service_role" key → SUPABASE_SERVICE_ROLE_KEY
```

## Verify Everything Works

After setting up .env.local correctly:

1. Restart dev server: `pnpm dev`
2. Visit: http://localhost:3000
3. You should see the home page load
4. Check browser console (F12) for any errors
5. Try clicking "Login" - you should see the login form

If you still see errors, check the server terminal output for more info.

## Still Having Issues?

If you still can't connect:

1. Double-check the URL matches exactly: `https://tywipgyhoyzdyunrllgi.supabase.co`
2. Verify the key starts with `eyJ` (base64 encoded JWT)
3. Make sure .env.local is in the root directory (same level as package.json)
4. Try restarting your computer (clears any cached env vars)
5. Check Supabase project is not suspended
6. Make sure you're logged into Supabase with correct account

