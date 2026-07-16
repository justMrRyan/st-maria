# Migration: OAuth (Coflow) → Email/Password Authentication

## Summary of Changes

The authentication system has been completely changed from **Coflow OAuth** to **Supabase Email/Password** authentication. This is simpler to set up and requires no external OAuth provider.

## What Changed

### Removed ❌
- Coflow OAuth integration
- `/api/auth/coflow/callback` endpoint
- All Coflow environment variables
- Complex OAuth flow

### Added ✅
- Simple email/password login form
- Sign up functionality
- Supabase Auth integration
- Better error messages
- Simplified session management

## Migration Checklist

### For Developers

- [x] Remove Coflow OAuth callback route
- [x] Update login page to use email/password form
- [x] Update auth utilities to use Supabase Auth
- [x] Remove Coflow OAuth environment variables
- [x] Update .env.example with new variables
- [x] Add EMAIL_PASSWORD_AUTH_GUIDE.md
- [x] Update SUPABASE_DEBUG.md
- [x] Create OAUTH_TO_EMAIL_PASSWORD_MIGRATION.md (this file)

### For Users

1. **Update .env.local**
   ```bash
   # Remove these:
   # NEXT_PUBLIC_COFLOW_CLIENT_ID
   # COFLOW_CLIENT_SECRET
   # COFLOW_CALLBACK_URL

   # Change:
   OWNER_EMAIL=...
   # To:
   NEXT_PUBLIC_OWNER_EMAIL=...

   # Keep these (same as before):
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   SUPABASE_SERVICE_ROLE_KEY=...
   ```

2. **No Database Changes Needed**
   - Schema is the same
   - Tables are the same
   - Just run existing `database/schema.sql`

3. **Test Login**
   - Go to http://localhost:3000/login
   - Create account with your email
   - Sign in
   - Access dashboard

## New Environment Variables

### Before (OAuth)
```env
NEXT_PUBLIC_COFLOW_CLIENT_ID=...
COFLOW_CLIENT_SECRET=...
COFLOW_CALLBACK_URL=...
OWNER_EMAIL=...
```

### After (Email/Password)
```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
NEXT_PUBLIC_OWNER_EMAIL=...
```

## Technical Changes

### File Changes

| File | Change | Reason |
|------|--------|--------|
| `lib/auth.ts` | Replaced OAuth functions with `signInWithEmail()`, `signUpWithEmail()` | New auth method |
| `app/login/route.ts` | Complete rewrite with email/password form | No OAuth needed |
| `.env.example` | Removed Coflow, added Supabase details | New configuration |
| `/app/api/auth/coflow/callback/route.ts` | Deleted | No longer needed |
| `/app/api/auth/logout/route.ts` | Updated to use Supabase auth | OAuth → Email/password |

### Function Changes

**Before:**
```typescript
export function getCoflowAuthUrl(): string { ... }
```

**After:**
```typescript
export async function signInWithEmail(email: string, password: string) { ... }
export async function signUpWithEmail(email: string, password: string) { ... }
export async function signOut() { ... }
```

## Login Flow Comparison

### Old Flow (OAuth)
```
User → Click "Sign In with Coflow"
     → Redirect to Coflow provider
     → User logs in at Coflow
     → Redirect back to /api/auth/coflow/callback
     → Verify OAuth code
     → Create session
```

### New Flow (Email/Password)
```
User → Enter email + password
     → Click "Sign In"
     → Validate with Supabase Auth
     → Create session
     → Redirect to dashboard
```

## Benefits

✅ **Simpler** - No OAuth provider needed
✅ **Faster** - Less redirects, no OAuth handshake
✅ **Flexible** - Use any email, not tied to Coflow
✅ **Cleaner** - Less code, fewer dependencies
✅ **Safer** - No OAuth credentials to manage
✅ **Easier to Debug** - Direct email/password validation

## Breaking Changes

⚠️ **Important**: Users must **create new accounts**

If you had Coflow-based authentication:
1. New accounts must be created using email/password
2. Old OAuth sessions won't work
3. This is intentional (different auth system)

## Troubleshooting

### "My old OAuth session doesn't work"
This is expected. Users need to:
1. Visit /login
2. Create new account with email/password
3. Sign in

### "I want to keep the same email/password approach"
Good news! The system now uses email/password, which is simpler than OAuth.

### "I need OAuth back"
See `OAUTH_TO_EMAIL_PASSWORD_MIGRATION_REVERT.md` (not created - contact developer if needed)

## What Stayed the Same

✅ Database schema (projects, messages tables)
✅ Dashboard UI and functionality  
✅ Storage bucket setup
✅ Project management features
✅ Message handling
✅ RLS policies
✅ API endpoints (except OAuth callback)

## Next Steps

1. **Read**: EMAIL_PASSWORD_AUTH_GUIDE.md
2. **Update**: .env.local with new variables
3. **Create**: Database tables from schema.sql
4. **Test**: Login and create projects
5. **Deploy**: Update Vercel env vars

## Support

For help, check:
- `EMAIL_PASSWORD_AUTH_GUIDE.md` - Setup and usage
- `SUPABASE_DEBUG.md` - Connection issues
- `.env.example` - Configuration reference
- Inline code comments - Implementation details

