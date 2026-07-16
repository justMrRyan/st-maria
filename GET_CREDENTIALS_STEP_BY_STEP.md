# How to Get Your Supabase Credentials - Step by Step

## Your Supabase Project ID

You already have this:
```
Project ID: tywipgyhoyzdyunrllgi
Project URL: https://tywipgyhoyzdyunrllgi.supabase.co
```

## Step 1: Go to Supabase Dashboard

1. Open: https://app.supabase.com
2. Sign in with your Supabase account
3. You should see your projects
4. Click on the project: `tywipgyhoyzdyunrllgi`

## Step 2: Find the Settings

1. In the left sidebar, scroll to the bottom
2. Click **Settings** (gear icon)
3. You should see a menu:
   ```
   Settings
   └─ Account
   └─ Organization
   └─ Billing
   └─ API
   └─ Database
   ```

## Step 3: Go to API Settings

1. Click **API** in the settings menu
2. You should see this section:
   ```
   Project API keys
   ├─ anon public
   ├─ service_role secret
   └─ (maybe others)
   ```

## Step 4: Copy the "anon public" Key

### Where to find it:
```
Settings > API > Project API keys

Look for: "anon public"
```

### What it looks like:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZi...
```

### How to copy:
1. Find the "anon public" row
2. Click the **copy icon** (right side of the key)
3. The key is now in your clipboard

### Where it goes:
```env
NEXT_PUBLIC_SUPABASE_ANON_KEY=paste_here_what_you_just_copied
```

## Step 5: Copy the "service_role secret" Key

### Where to find it:
```
Settings > API > Project API keys

Look for: "service_role secret"
(This one is BELOW the anon public key)
```

### What it looks like:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZi...
```

### ⚠️ IMPORTANT
- This is SECRET!
- Never share this key
- Never commit to git
- Only use on your local machine

### How to copy:
1. Find the "service_role secret" row
2. Click the **copy icon**
3. The key is now in your clipboard

### Where it goes:
```env
SUPABASE_SERVICE_ROLE_KEY=paste_here_what_you_just_copied
```

## Step 6: Copy the Project URL

### Where to find it:
```
Settings > API > Project API keys

At the TOP of the page, you'll see:
"Project URL:"
```

### What it looks like:
```
https://tywipgyhoyzdyunrllgi.supabase.co
```

### How to copy:
1. Find the "Project URL" field
2. Click the **copy icon**
3. Or select all and copy manually

### Where it goes:
```env
NEXT_PUBLIC_SUPABASE_URL=https://tywipgyhoyzdyunrllgi.supabase.co
```

## Summary: What You'll Get

After following all steps, you'll have 3 things to copy:

```env
# 1. Project URL (you already have this)
NEXT_PUBLIC_SUPABASE_URL=https://tywipgyhoyzdyunrllgi.supabase.co

# 2. Anon public key (from Settings > API)
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...copied_from_dashboard

# 3. Service role key (from Settings > API)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...copied_from_dashboard

# 4. Your email (you decide)
NEXT_PUBLIC_OWNER_EMAIL=your@email.com
```

## Visual Guide - Where Everything Is

```
Supabase Dashboard
│
├─ Your Project (tywipgyhoyzdyunrllgi)
│  │
│  └─ Settings (bottom left)
│     │
│     └─ API (in the menu)
│        │
│        └─ Project API keys
│           │
│           ├─ Project URL ← Copy this to NEXT_PUBLIC_SUPABASE_URL
│           │
│           ├─ anon public ← Copy this to NEXT_PUBLIC_SUPABASE_ANON_KEY
│           │
│           └─ service_role secret ← Copy this to SUPABASE_SERVICE_ROLE_KEY
```

## Quick Verification

After copying, make sure:

✅ **NEXT_PUBLIC_SUPABASE_URL**
- Starts with: `https://tywipgyhoyzdyunrllgi.supabase.co`
- No extra spaces

✅ **NEXT_PUBLIC_SUPABASE_ANON_KEY**
- Starts with: `eyJ`
- Very long string (200+ characters)
- No extra spaces

✅ **SUPABASE_SERVICE_ROLE_KEY**
- Starts with: `eyJ`
- Very long string (200+ characters)
- No extra spaces

❌ **If you see:**
- `[object Object]` - Something went wrong
- `undefined` - Key not found
- `process.env.` - Copy-paste error
- Extra spaces - Remove them

## Create .env.local

Once you have all 3 keys:

```bash
# In your project root (same level as package.json)
cp .env .env.local
```

Then edit `.env.local` and paste:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tywipgyhoyzdyunrllgi.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...paste_key_here
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...paste_key_here
NEXT_PUBLIC_OWNER_EMAIL=your@email.com
```

## Next: Test Connection

After saving .env.local:

```bash
# Restart dev server
pnpm dev
```

Visit http://localhost:3000

If you see the home page (not an error), you're connected! ✅

## Stuck?

- Make sure .env.local is in the root directory (same level as package.json)
- Make sure keys are copied completely (no truncation)
- Restart dev server after creating .env.local
- Check SUPABASE_DEBUG.md for connection issues

