# 🚀 Cloudflare R2 Setup Guide for GetGlow

## ✅ What We've Done So Far

I've set up your app to support **both** storage modes:
- **Cloudflare R2** (when configured) - for production/Vercel
- **Local filesystem** (fallback) - for development

The app will automatically detect which mode to use!

---

## 📋 Step-by-Step Setup Instructions

### Part 1: Cloudflare Account Setup (5 minutes)

#### 1. Create Cloudflare Account
- Go to: https://dash.cloudflare.com/sign-up
- Sign up with your email
- Verify your email address

#### 2. Enable R2 Storage
- Log in to Cloudflare Dashboard
- Click **"R2"** in the left sidebar (under Storage section)
- Click **"Purchase R2 Plan"**
  - Don't worry, it's FREE!
  - Free tier: 10 GB storage + unlimited bandwidth
- Accept the terms

#### 3. Create Your Storage Bucket
- Click **"Create bucket"**
- Settings:
  - **Name:** `getglow-images` (or any name you prefer)
  - **Location:** Automatic (recommended)
- Click **"Create bucket"**

#### 4. Configure Public Access (IMPORTANT!)
- Click on your bucket name (`getglow-images`)
- Go to **"Settings"** tab
- Scroll to **"Public Access"** section
- Click **"Allow Access"** or **"Connect Custom Domain"**

**Option A: R2.dev Subdomain (Easiest)**
- Click **"Allow Access"**
- You'll get a URL like: `https://pub-xxxxx.r2.dev`
- Copy this URL - you'll need it later!

**Option B: Custom Domain (Recommended for Production)**
- Click **"Connect Domain"**
- Enter your custom domain (e.g., `cdn.getglow.app`)
- Follow DNS setup instructions
- Much better for SEO and branding

#### 5. Create API Token
- Go back to **R2** > **Overview**
- Click **"Manage R2 API Tokens"** (on the right side)
- Click **"Create API Token"**
- Configuration:
  - **Token name:** `getglow-vercel` (or any name)
  - **Permissions:** Select **"Object Read & Write"**
  - **TTL:** Leave blank (no expiration)
  - **Bucket:** Select your bucket `getglow-images`
    - Or select "Apply to all buckets in this account"
- Click **"Create API Token"**

#### 6. SAVE YOUR CREDENTIALS! 🔑

You'll see a screen like this:

```
Access Key ID: abc123xyz456...
Secret Access Key: very-long-secret-key...
```

⚠️ **CRITICAL:** Copy these values NOW!
You will NOT be able to see the Secret Access Key again!

Also note your **Account ID** (shown at top of R2 page):
- It looks like: `a1b2c3d4e5f6...`

---

### Part 2: Local Development Setup

#### 1. Update Your `.env` File

Add these new environment variables to your `.env` file:

```bash
# Cloudflare R2 Storage Configuration
R2_ACCOUNT_ID=your_account_id_here
R2_ACCESS_KEY_ID=your_access_key_id_here
R2_SECRET_ACCESS_KEY=your_secret_access_key_here
R2_BUCKET_NAME=getglow-images
R2_PUBLIC_DOMAIN=pub-xxxxx.r2.dev
# ☝️ Use your actual R2.dev domain or custom domain
```

**Example with real values:**
```bash
R2_ACCOUNT_ID=a1b2c3d4e5f6789012345678
R2_ACCESS_KEY_ID=abc123xyz456def789ghi012
R2_SECRET_ACCESS_KEY=verylongsecretkeyhere123456789
R2_BUCKET_NAME=getglow-images
R2_PUBLIC_DOMAIN=pub-1234abcd.r2.dev
```

#### 2. Install Dependencies

```bash
npm install
```

This will install the `@aws-sdk/client-s3` package I added.

#### 3. Test R2 Configuration

The app will automatically detect if R2 is configured:
- ✅ **If R2 env vars are set:** Uses Cloudflare R2
- ⚠️ **If R2 env vars are missing:** Falls back to local storage

You'll see a log message when you upload:
```
📦 Storage mode: Cloudflare R2
```
or
```
📦 Storage mode: Local filesystem
```

---

### Part 3: Vercel Deployment Setup

#### 1. Add Environment Variables to Vercel

Go to your Vercel project:
- **Project Settings** > **Environment Variables**
- Add each variable:

| Variable Name | Value | Environment |
|--------------|--------|-------------|
| `R2_ACCOUNT_ID` | Your account ID | Production, Preview, Development |
| `R2_ACCESS_KEY_ID` | Your access key | Production, Preview, Development |
| `R2_SECRET_ACCESS_KEY` | Your secret key | Production, Preview, Development |
| `R2_BUCKET_NAME` | `getglow-images` | Production, Preview, Development |
| `R2_PUBLIC_DOMAIN` | Your R2 domain | Production, Preview, Development |

**IMPORTANT:** Select all three environments (Production, Preview, Development)

#### 2. Keep Existing Variables

Make sure you also have these already set:
- `DATABASE_URL` - Your Neon PostgreSQL URL
- `OPENAI_API_KEY` - Your OpenAI API key
- `SESSION_SECRET` - A random secure string
- `NODE_ENV` - Set to `production`

#### 3. Redeploy

After adding environment variables:
- Vercel will automatically redeploy
- Or manually trigger a redeploy

---

### Part 4: Testing

#### Test Locally First

1. Start your dev server:
```bash
npm run dev
```

2. Upload a test image
3. Check the console logs:
```
📦 Storage mode: Cloudflare R2
✅ Uploaded to R2: https://pub-xxxxx.r2.dev/uploads/1234567890-abc123.jpg
```

4. Verify the image URL works:
- Copy the URL from logs
- Open it in your browser
- You should see your uploaded image!

#### Test on Vercel

1. Deploy to Vercel
2. Upload a test image
3. Check Vercel logs (Runtime Logs)
4. Verify image loads

---

## 🎯 How It Works

### Automatic Detection

```typescript
// The app checks if R2 is configured
const useR2 = isR2Configured();

if (useR2) {
  // Upload to Cloudflare R2
  // Images stored in cloud
  // Fast CDN delivery
} else {
  // Save to local disk
  // Good for development
}
```

### Database Storage

In **both modes**, the database only stores:
- Image URL (string)
- File metadata (size, dimensions)
- Analysis results

**R2 Mode:**
```javascript
imageUrl: "https://pub-xxxxx.r2.dev/uploads/123456-abc.jpg"
```

**Local Mode:**
```javascript
imageUrl: "/uploads/processed_123456.jpg"
```

---

## 💰 Cost Breakdown

### Cloudflare R2 Free Tier
- ✅ 10 GB storage/month
- ✅ Unlimited egress (bandwidth)
- ✅ Class A operations: 1 million/month
- ✅ Class B operations: 10 million/month

### After Free Tier
- Storage: $0.015/GB/month
- Class A (uploads): $4.50 per million
- Class B (downloads): $0.36 per million

### Example Costs
- **1,000 images (2 MB each):** FREE (2 GB)
- **10,000 images (20 GB):** $0.15/month
- **100,000 images (200 GB):** $2.85/month

**Much cheaper than Vercel Blob!** 💰

---

## 🔧 Troubleshooting

### "R2 storage is not configured" Error

**Problem:** Environment variables not set

**Solution:**
1. Check your `.env` file has all R2 variables
2. Restart your dev server
3. Verify no typos in variable names

### "Failed to upload to R2" Error

**Problem:** Invalid credentials or bucket doesn't exist

**Solution:**
1. Double-check your credentials in Cloudflare dashboard
2. Verify bucket name matches exactly
3. Ensure API token has "Object Read & Write" permissions
4. Check if bucket exists in your R2 dashboard

### Images Don't Load (403 Forbidden)

**Problem:** Bucket is not public

**Solution:**
1. Go to your bucket in Cloudflare dashboard
2. Settings tab > Public Access
3. Click "Allow Access"
4. Update `R2_PUBLIC_DOMAIN` in your `.env`

### Images Load Slowly

**Problem:** Using wrong domain

**Solution:**
1. Use the R2.dev domain for CDN benefits
2. Or set up a custom domain with Cloudflare CDN
3. Make sure you're using `R2_PUBLIC_DOMAIN` not direct URLs

---

## 🚀 Next Steps

1. ✅ Complete Cloudflare setup (you do this)
2. ✅ Add credentials to `.env` file
3. ✅ Test locally
4. ✅ Add variables to Vercel
5. ✅ Deploy and test

---

## 📞 Need Help?

Common issues and solutions:

**"Can't create R2 bucket"**
- Make sure you enabled the R2 plan (even though it's free)
- Try a different bucket name (must be globally unique)

**"API token doesn't work"**
- Make sure you copied the full secret key
- Create a new token if you lost the secret
- Verify token permissions include your bucket

**"Images not showing after deployment"**
- Check Vercel environment variables are set
- Verify R2_PUBLIC_DOMAIN is correct
- Check bucket is public
- Look at Vercel runtime logs for errors

---

## ✨ Benefits of This Setup

✅ **Free tier:** 10 GB storage  
✅ **Unlimited bandwidth:** No egress fees  
✅ **Fast CDN:** Global edge network  
✅ **Scalable:** Pay as you grow  
✅ **Automatic fallback:** Works locally without R2  
✅ **Production ready:** Vercel + R2 = Perfect match  
✅ **Cost effective:** 10x cheaper than Vercel Blob  

---

🎉 **You're all set!** Follow the steps above and you'll have professional cloud storage running in about 15 minutes!
