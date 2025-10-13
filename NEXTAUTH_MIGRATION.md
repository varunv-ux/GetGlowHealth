# NextAuth Migration Guide

This project has been migrated from Replit Auth to NextAuth.js for better flexibility and Vercel deployment support.

## What Changed

### ✅ Removed
- `server/replitAuth.ts` - Replit-specific authentication
- Replit Auth dependencies (openid-client, passport)
- `REPLIT_DOMAINS`, `REPL_ID`, `ISSUER_URL` environment variables

### ✅ Added
- `server/nextAuth.ts` - NextAuth.js configuration
- NextAuth.js with Drizzle adapter
- Support for Google, GitHub OAuth providers
- Optional email magic link authentication
- New database tables: `accounts`, `verification_tokens`
- Updated `users` table with NextAuth-compatible fields

## Environment Variables

### Required
```env
DATABASE_URL=your-postgres-connection-string
SESSION_SECRET=random-secret-for-sessions
NEXTAUTH_SECRET=random-secret-for-nextauth
NEXTAUTH_URL=http://localhost:5000
OPENAI_API_KEY=your-openai-key
```

### Optional OAuth Providers
```env
# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# GitHub OAuth  
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# Email (magic link)
EMAIL_SERVER=smtp://user:pass@smtp.example.com:587
EMAIL_FROM=noreply@yourdomain.com
```

## Setting Up OAuth Providers

### Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Go to Credentials → Create OAuth 2.0 Client ID
5. Add authorized redirect URI: `https://yourdomain.com/api/auth/callback/google`
6. Copy Client ID and Secret to `.env`

### GitHub OAuth
1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Create new OAuth App
3. Set Authorization callback URL: `https://yourdomain.com/api/auth/callback/github`
4. Copy Client ID and generate Client Secret
5. Add to `.env`

## Development vs Production

### Development (Local)
- Uses `server/localAuth.ts`
- Auto-creates a local user (no login needed)
- Email: `dev@localhost.com`
- User ID: `local-dev-user`

### Production (Vercel)
- Uses `server/nextAuth.ts`
- Real authentication with configured providers
- Supports Google, GitHub, Email login
- Session management with JWT

## Deployment to Vercel

### 1. Add Environment Variables to Vercel
```bash
# Required
DATABASE_URL=your-neon-postgres-url
NEXTAUTH_SECRET=generate-with-openssl-rand-base64-32
NEXTAUTH_URL=https://your-vercel-app.vercel.app
OPENAI_API_KEY=your-key

# Optional OAuth (at least one recommended)
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...
```

### 2. Update OAuth Callback URLs
For each OAuth provider, add your Vercel domain:
- Google: `https://your-app.vercel.app/api/auth/callback/google`
- GitHub: `https://your-app.vercel.app/api/auth/callback/github`

### 3. Deploy
```bash
vercel --prod
```

## Database Schema

The migration added NextAuth-compatible tables:

```sql
-- New tables
accounts (userId, provider, providerAccountId, tokens...)
verification_tokens (identifier, token, expires)

-- Updated users table
users (
  id, email, emailVerified, name, image,
  -- Legacy fields for backward compatibility
  firstName, lastName, profileImageUrl,
  createdAt, updatedAt
)
```

## API Endpoints

### Authentication
- `GET /api/auth/signin` - Sign in page
- `GET /api/auth/signout` - Sign out
- `GET /api/auth/session` - Get current session
- `POST /api/auth/callback/:provider` - OAuth callback

### User
- `GET /api/auth/user` - Get current user (protected)

## Testing Locally

1. Set `NODE_ENV=development` in `.env`
2. Run `npm run dev`
3. You'll be auto-logged in as `local-dev-user`
4. No OAuth setup needed for development

## Migration Checklist

- [x] Installed NextAuth.js and adapter
- [x] Created NextAuth configuration
- [x] Updated database schema
- [x] Removed Replit Auth code
- [x] Updated environment variables
- [ ] Configure at least one OAuth provider for production
- [ ] Test authentication flow
- [ ] Deploy to Vercel
- [ ] Update OAuth callback URLs in provider settings

## Troubleshooting

### "NEXTAUTH_SECRET not set"
Generate a secret: `openssl rand -base64 32`
Add to `.env`: `NEXTAUTH_SECRET=your-generated-secret`

### "No provider configured"
At least one OAuth provider must be configured for production.
Add Google or GitHub credentials to `.env`

### "Callback URL mismatch"
Ensure OAuth provider callback URLs match:
`https://your-domain.com/api/auth/callback/[provider]`

### Database connection errors
Verify `DATABASE_URL` is correct and Neon database is accessible
Check that migrations have been applied: `npx drizzle-kit push`

## Support

- [NextAuth.js Documentation](https://next-auth.js.org)
- [Drizzle ORM Documentation](https://orm.drizzle.team)
- [Neon Database Documentation](https://neon.tech/docs)
