# Vercel Deployment Guide for GetGlow

## 🚀 Quick Start

### Prerequisites
- Vercel account (free tier works for testing)
- GitHub repository connected to Vercel
- Environment variables configured

### Deployment Steps

1. **Install Vercel CLI** (optional)
   ```bash
   npm i -g vercel
   ```

2. **Configure Environment Variables in Vercel Dashboard**
   - Go to your project settings
   - Add the following environment variables:
     - `DATABASE_URL` - Your Neon PostgreSQL connection string
     - `OPENAI_API_KEY` - Your OpenAI API key
     - `SESSION_SECRET` - Random secure string (generate new one)
     - `NODE_ENV` - Set to "production"

3. **Deploy**
   ```bash
   vercel
   ```
   Or push to GitHub (if connected)

---

## ⚠️ Critical Changes Required

### 1. File Storage Migration 🚨 PRIORITY

**Current Issue:** `/uploads` directory is ephemeral on Vercel

**Solution Options:**

#### Option A: Vercel Blob Storage (Recommended)
```bash
npm install @vercel/blob
```

**Implementation Steps:**
1. Enable Vercel Blob in project settings
2. Replace local file system storage with Blob API
3. Update image serving logic

**Benefits:**
- ✅ Official Vercel integration
- ✅ Automatic CDN distribution
- ✅ Pay-as-you-go pricing
- ✅ Simple API

**Pricing:** Free tier: 100 GB-months, then $0.15/GB-month

#### Option B: AWS S3 / Cloudflare R2
```bash
npm install @aws-sdk/client-s3
```

**Benefits:**
- ✅ More control
- ✅ Potentially cheaper at scale
- ✅ Industry standard

#### Option C: Database Storage (Not Recommended)
Store base64 images in PostgreSQL
- ❌ Expensive storage
- ❌ Slow queries
- ❌ Large database size

---

### 2. API Routes Restructuring

**Current:** Monolithic Express server in `/server`
**Needed:** Serverless functions in `/api`

**Migration Pattern:**
```
/server/routes.ts → Multiple /api/*.ts files
```

**Example Structure:**
```
/api/
  analyze.ts       - Image upload & analysis
  chat.ts          - AI chat endpoint
  history.ts       - User history
  auth/
    user.ts        - Get user info
    login.ts       - Login endpoint
    logout.ts      - Logout endpoint
  config/
    prompt.ts      - Prompt configuration
```

---

### 3. Authentication Strategy

**Current:** Replit Auth (won't work on Vercel)

**Options for Vercel:**

#### Option A: NextAuth.js / Auth.js (Recommended)
```bash
npm install next-auth
```
- ✅ Industry standard
- ✅ Multiple providers (Google, GitHub, Email)
- ✅ Well documented

#### Option B: Clerk
```bash
npm install @clerk/clerk-react
```
- ✅ Easy to use
- ✅ Beautiful UI
- ✅ Free tier available

#### Option C: Custom JWT Auth
- Keep PostgreSQL session storage
- Implement JWT-based authentication
- More work but full control

---

### 4. Database Considerations

**Current Setup:** ✅ Neon Database (works with Vercel)
**Action Required:** ✅ None - keep using Neon

**Best Practices:**
- Use connection pooling
- Consider Neon's serverless driver for better cold starts
- Monitor connection limits

---

### 5. Build Configuration

Update `package.json` scripts:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "vercel-build": "npm run build"
  }
}
```

---

## 🎯 Recommended Migration Path

### Phase 1: Minimal Changes (Quick Deploy)
1. ✅ Create `vercel.json` configuration
2. ✅ Keep existing file storage (test only)
3. ✅ Deploy as-is to see what breaks
4. ⚠️ Note: Uploads won't persist

### Phase 2: File Storage Migration
1. Set up Vercel Blob Storage
2. Update image upload logic
3. Update image serving logic
4. Test thoroughly

### Phase 3: Authentication
1. Choose auth provider (NextAuth.js recommended)
2. Implement new auth flow
3. Migrate user sessions
4. Update protected routes

### Phase 4: API Optimization
1. Split monolithic routes into serverless functions
2. Optimize cold start times
3. Add edge caching where possible
4. Monitor performance

---

## 📊 Cost Estimation

### Vercel Costs (Pro Plan - $20/month)
- Bandwidth: 1TB included
- Builds: Unlimited
- Serverless Function Execution: 1000GB-hours
- Edge Functions: 500k requests

### Additional Costs
- **Vercel Blob Storage:** ~$5-20/month (depends on usage)
- **Neon Database:** Free tier available, Pro starts at $19/month
- **OpenAI API:** ~$0.01-0.02 per analysis (varies by usage)

**Estimated Total:** $25-60/month for moderate traffic

---

## 🚦 Deployment Checklist

### Pre-Deployment
- [ ] Rotate all exposed API keys
- [ ] Set up Vercel Blob Storage
- [ ] Migrate file upload logic
- [ ] Choose authentication strategy
- [ ] Test build process locally
- [ ] Configure environment variables in Vercel
- [ ] Set up custom domain (optional)

### During Deployment
- [ ] Deploy to Vercel preview
- [ ] Test all endpoints
- [ ] Verify file uploads work
- [ ] Test authentication flow
- [ ] Check OpenAI integration
- [ ] Monitor function execution times

### Post-Deployment
- [ ] Set up monitoring (Vercel Analytics)
- [ ] Configure error tracking (Sentry)
- [ ] Set up billing alerts
- [ ] Test from different regions
- [ ] Monitor cold start times
- [ ] Optimize as needed

---

## 🔧 Alternative: Keep Current Architecture

If you want to avoid major refactoring:

### Deploy to a VPS/PaaS instead:
1. **Railway.app** - Similar to Replit, better for long-running servers
2. **Render.com** - Free tier available, persistent disk
3. **DigitalOcean App Platform** - $5/month starter
4. **Fly.io** - Good for full-stack apps

These platforms support your current architecture without changes.

---

## 📞 Need Help?

**Quick wins:**
- Vercel Blob Storage is the easiest file storage solution
- NextAuth.js is the most popular auth solution
- Keep Neon Database (already compatible)

**Common Issues:**
- Function timeouts: Upgrade to Pro plan (60s timeout)
- File persistence: Must use external storage
- Cold starts: Optimize bundle size, use edge functions

---

## 🎬 Next Steps

1. Decide: Vercel (serverless) vs VPS (traditional server)?
2. If Vercel: Start with Vercel Blob Storage migration
3. Test deployment on Vercel preview
4. Choose authentication strategy
5. Optimize and monitor

Let me know which path you want to take, and I can help you implement it!
