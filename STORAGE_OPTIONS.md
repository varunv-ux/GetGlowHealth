# Storage Options Comparison for GetGlow

## TL;DR: Use Cloudflare R2 (Best Free Option)

---

## 🏆 **Recommended: Cloudflare R2**

### Why Cloudflare R2?
- ✅ **10 GB FREE storage** per month
- ✅ **FREE egress bandwidth** (unlimited downloads at no cost!)
- ✅ **S3-compatible API** (easy to integrate)
- ✅ **10x cheaper** than Vercel Blob after free tier ($0.015/GB vs $0.15/GB)
- ✅ **Fast global CDN**
- ✅ **No Vercel Pro plan required**

### Setup Steps

1. **Create Cloudflare Account** (free)
   - Go to https://dash.cloudflare.com/
   - Sign up for free

2. **Enable R2**
   - Navigate to R2 in dashboard
   - Create a bucket (e.g., "getglow-images")

3. **Create API Token**
   - Go to R2 > Manage R2 API Tokens
   - Create token with "Object Read & Write" permissions
   - Save: Account ID, Access Key ID, Secret Access Key

4. **Install SDK**
   ```bash
   npm install @aws-sdk/client-s3
   ```

5. **Configure Environment Variables**
   ```env
   R2_ACCOUNT_ID=your_account_id
   R2_ACCESS_KEY_ID=your_access_key
   R2_SECRET_ACCESS_KEY=your_secret_key
   R2_BUCKET_NAME=getglow-images
   R2_PUBLIC_URL=https://your-bucket.r2.cloudflarestorage.com
   ```

### Code Implementation

```typescript
// server/r2-storage.ts
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';

const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

export async function uploadImageToR2(
  buffer: Buffer,
  filename: string,
  contentType: string
): Promise<string> {
  const key = `uploads/${Date.now()}-${filename}`;
  
  await r2Client.send(
    new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME!,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    })
  );
  
  return `${process.env.R2_PUBLIC_URL}/${key}`;
}
```

### Pricing
- **Free Tier:** 10 GB storage, unlimited egress
- **After Free:** $0.015/GB/month (storage only)
- **Example:** 50GB storage = $0.60/month

---

## 🔵 Option 2: Neon PostgreSQL (Simplest, Limited Scale)

### Store Base64 in Database

**Best for:**
- Testing/development
- Low traffic apps (< 100 images)
- Quick deployment

**Free Tier:**
- 10 GB total database storage
- Includes all data (not just images)

**Implementation:**
```typescript
// Store compressed base64
const buffer = await sharp(imagePath)
  .resize(800, 800)
  .jpeg({ quality: 70 })
  .toBuffer();

const base64 = buffer.toString('base64');

await db.insert(analyses).values({
  imageData: base64, // TEXT or JSONB column
  ...
});

// Retrieve
const analysis = await db.query.analyses.findFirst({...});
const imageBuffer = Buffer.from(analysis.imageData, 'base64');
```

**Pros:**
- ✅ No additional service
- ✅ Simple implementation
- ✅ Free (within Neon limits)

**Cons:**
- ❌ Database bloat (1 MB image = 1 MB of database storage)
- ❌ Slower queries
- ❌ Not scalable
- ❌ Expensive if you exceed 10GB ($3.50/GB)

---

## 🟣 Option 3: Vercel Blob (If Already on Pro Plan)

**Only consider if:**
- Already paying for Vercel Pro ($20/month)
- Need tight Vercel integration
- Want official Vercel support

**Pricing:**
- ❌ NO free tier
- $0.15/GB storage
- $0.30/GB bandwidth
- **Example:** 50GB storage + 200GB bandwidth = $67.50/month

**Implementation:**
```bash
npm install @vercel/blob
```

```typescript
import { put } from '@vercel/blob';

const blob = await put(filename, buffer, {
  access: 'public',
});

const imageUrl = blob.url; // Store in database
```

---

## 🟢 Option 4: AWS S3 (Enterprise Grade)

**Best for:**
- High traffic production apps
- Need advanced features (versioning, lifecycle policies)
- Enterprise requirements

**Free Tier (First 12 months):**
- 5 GB storage
- 20,000 GET requests
- 2,000 PUT requests

**After Free Tier:**
- $0.023/GB storage
- $0.09/GB egress bandwidth

---

## 📊 Real-World Cost Comparison

### Scenario: 1000 images/month, 2 MB each, viewed 10 times each

| Service | Storage Cost | Bandwidth Cost | Total/Month |
|---------|--------------|----------------|-------------|
| **Cloudflare R2** | $0 (FREE) | $0 (FREE) | **$0** |
| **Neon PostgreSQL** | $0 (within 10GB) | N/A | **$0** |
| **Vercel Blob** | $0.30 | $6.00 | **$6.30** |
| **AWS S3** | $0.046 | $1.80 | **$1.85** |

### Scenario: 10,000 images/month, 2 MB each (20GB), viewed 10 times each (200GB bandwidth)

| Service | Storage Cost | Bandwidth Cost | Total/Month |
|---------|--------------|----------------|-------------|
| **Cloudflare R2** | $0.30 | $0 (FREE) | **$0.30** |
| **Neon PostgreSQL** | $35 | N/A | **$35** |
| **Vercel Blob** | $3.00 | $60.00 | **$63.00** |
| **AWS S3** | $0.46 | $18.00 | **$18.46** |

---

## 🎯 **Final Recommendation**

### For GetGlow App:

**Use Cloudflare R2** because:
1. ✅ Free for your initial usage (10GB)
2. ✅ No bandwidth charges (huge savings)
3. ✅ Easy to set up (S3-compatible)
4. ✅ Scales affordably
5. ✅ Works perfectly with Vercel

**Migration Path:**
1. Set up R2 bucket (15 minutes)
2. Update upload logic to use R2
3. Store URLs in Neon database
4. Deploy to Vercel
5. Monitor usage

---

## 🚀 Quick Start Command

```bash
# Install R2 SDK
npm install @aws-sdk/client-s3

# Add to .env
echo "R2_ACCOUNT_ID=your_account_id" >> .env
echo "R2_ACCESS_KEY_ID=your_key" >> .env
echo "R2_SECRET_ACCESS_KEY=your_secret" >> .env
echo "R2_BUCKET_NAME=getglow-images" >> .env
```

---

## 📞 Need Help Setting Up?

Let me know which option you prefer, and I can:
1. Create the storage utility functions
2. Update the upload routes
3. Configure environment variables
4. Test the integration

**My vote: Cloudflare R2** 🎉
