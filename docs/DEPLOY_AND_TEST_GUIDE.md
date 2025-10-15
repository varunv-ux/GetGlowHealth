# Quick Start: Deploy & Test Streaming on Vercel

## 📋 Pre-Deployment Checklist

### ✅ Code Changes (Already Done)
- [x] Streaming endpoint implemented (`/api/analysis/:id/start-streaming`)
- [x] Client updated to use streaming endpoint
- [x] Server-Sent Events (SSE) headers configured
- [x] OpenAI streaming enabled
- [x] Database status tracking added

### 🔍 Files to Review Before Deploy
1. `api/index.js` - Vercel serverless function (✅ already built)
2. `vercel.json` - Routes configuration (✅ looks good)
3. `server/streaming-analysis.ts` - Core streaming logic (✅ implemented)

---

## 🚀 Step 1: Deploy to Vercel

### Option A: Deploy via Vercel CLI
```bash
# Install Vercel CLI if you haven't
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

### Option B: Deploy via Git (Recommended)
```bash
# Add all changes
git add STREAMING_TEST_REPORT.md test-vercel-streaming.sh

# Commit
git commit -m "Add streaming implementation for Vercel timeout fix"

# Push to GitHub (triggers automatic Vercel deployment)
git push origin main
```

### Option C: Deploy via Vercel Dashboard
1. Go to https://vercel.com
2. Import your GitHub repository
3. Configure environment variables (see below)
4. Deploy

---

## ⚙️ Step 2: Configure Environment Variables

Go to Vercel Dashboard → Your Project → Settings → Environment Variables

**Required:**
```
DATABASE_URL=postgresql://...
OPENAI_API_KEY=sk-...
SESSION_SECRET=your-random-secret-key
NODE_ENV=production
```

**Optional (for R2 Storage):**
```
R2_ACCOUNT_ID=...
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
R2_BUCKET_NAME=getglow-images
R2_PUBLIC_URL=https://...
```

⚠️ **Important:** After adding env vars, trigger a new deployment!

---

## 🧪 Step 3: Test the Streaming Implementation

### Manual Test (Web Browser)

1. **Visit your Vercel URL**
   ```
   https://your-app.vercel.app
   ```

2. **Upload a face image**
   - Click the upload area
   - Select a face photo
   - Wait for upload to complete

3. **Start Analysis**
   - Click "Start Analysis" button
   - Watch the animated loader

4. **Monitor in Browser DevTools**
   - Open DevTools (F12 or Cmd+Option+I)
   - Go to **Network** tab
   - Filter by "eventsource" or look for `/start-streaming`
   - You should see:
     - Status: `200 OK`
     - Type: `eventsource` or `text/event-stream`
     - Data streaming in real-time

5. **Check Console**
   - Look for logs like:
     ```
     🔄 Polling for analysis: 123
     📊 Analysis status: processing
     ✅ Polling stopped. Final status: completed
     ```

6. **Verify Results**
   - You should be redirected to `/history` page
   - Your analysis should appear with scores

### Automated Test (Command Line)

```bash
# Replace with your actual Vercel URL
./test-vercel-streaming.sh https://your-app.vercel.app
```

Expected output:
```
🧪 GetGlow - Vercel Streaming Test Script
==========================================

Testing deployment: https://your-app.vercel.app

1️⃣  Testing API accessibility...
✅ API is accessible

2️⃣  Checking if required environment variables are set...
✅ API is functioning (env vars likely OK)

3️⃣  Testing upload endpoint...
   Creating a test image...
   Uploading test image...
✅ Upload successful! Analysis ID: 123

4️⃣  Testing streaming analysis endpoint...
   Starting streaming analysis...
   📡 Event: progress
   ✅ Analysis started
   📊 Progress: 10%
   📊 Progress: 20%
   ...
   ✅ Analysis complete! Received results.
   ⏱️  Total time: 25s
   🎯 Overall Score: 75

5️⃣  Verifying results in database...
✅ Analysis status in database: completed
✅ Results saved to database (Overall Score: 75)

==========================================
🎉 All tests passed!
```

---

## 📊 Step 4: Monitor Vercel Logs

1. Go to **Vercel Dashboard** → Your Project → **Logs**

2. **Watch for these log entries:**
   ```
   [HANDLER] POST /api/analysis/123/start-streaming
   📥 Downloading image from R2: https://...
   ✅ Downloaded to: /tmp/temp_123.jpg
   ✅ Streaming analysis completed, 156 chunks
   ```

3. **Look for errors:**
   - ❌ "Function timeout" → Streaming not working correctly
   - ❌ "OpenAI API error" → Check API key or quota
   - ❌ "Database error" → Check DATABASE_URL

---

## 🎯 Success Indicators

### ✅ Streaming is Working When You See:
1. **No timeout errors** (previously would timeout at 10s)
2. **SSE connection stays open** for 20-60 seconds
3. **Progress events** stream to client
4. **Analysis completes** and results are saved
5. **Database status** changes from `processing` → `completed`
6. **Vercel logs** show "Streaming analysis completed"

### ❌ Streaming is NOT Working If:
1. Request times out after 10 seconds
2. Error: "504 Gateway Timeout"
3. No progress events in browser console
4. Analysis status stuck at "processing"
5. Vercel logs show timeout errors

---

## 🐛 Troubleshooting

### Problem: Still getting timeouts

**Check:**
1. Is the client calling `/api/analysis/:id/start-streaming`? 
   - ✅ Yes: `client/src/pages/home.tsx` line 62
2. Are SSE headers set correctly?
   - ✅ Yes: `server/streaming-analysis.ts` line 19-23
3. Is OpenAI streaming enabled?
   - ✅ Yes: `stream: true` in API call

**Solutions:**
- Verify environment variables in Vercel
- Check Vercel function logs for specific errors
- Test OpenAI API key locally first

### Problem: Analysis starts but never completes

**Check:**
1. Database status field
   ```bash
   # Check database directly
   psql $DATABASE_URL -c "SELECT id, status, overallScore FROM analyses ORDER BY id DESC LIMIT 5;"
   ```
2. Vercel logs for errors during analysis
3. OpenAI API quota/limits

**Solutions:**
- Check if OpenAI response is valid JSON
- Verify database connection is stable
- Review error logs in detail

### Problem: Can't see streaming events

**Solutions:**
1. Use Chrome/Firefox DevTools Network tab
2. Filter by "EventSource" or "eventsource"
3. Look at raw response data
4. Check if SSE is blocked by ad-blockers

---

## 📈 Performance Metrics

### Expected Performance:
- **Upload:** ~1-3 seconds
- **Streaming Analysis:** 20-40 seconds (no timeout!)
- **Database Save:** <1 second
- **Total:** ~25-45 seconds

### vs. Old Non-Streaming:
- **Old:** Timeout at 10 seconds ❌
- **New:** Completes in 25-45 seconds ✅

---

## 🎓 Next Steps After Successful Test

1. ✅ Confirm streaming works on Vercel
2. 📝 Document any edge cases discovered
3. 🎨 Consider adding progress bar based on chunk count
4. 📊 Monitor OpenAI API usage and costs
5. 🔔 Set up Vercel alerts for errors
6. 🧪 Test with various image sizes and formats
7. 📖 Update user documentation if needed

---

## 📞 Quick Reference

**Streaming Endpoint:**
```
POST /api/analysis/:id/start-streaming
```

**Client Code:**
```typescript
// client/src/pages/home.tsx line 62
await fetch(`/api/analysis/${analysisId}/start-streaming`, {
  method: 'POST',
});
```

**Server Code:**
```typescript
// server/streaming-analysis.ts
export async function performStreamingAnalysis(...)
```

**Test Script:**
```bash
./test-vercel-streaming.sh https://your-app.vercel.app
```

---

**Last Updated:** January 2025
**Status:** 🟢 Ready for Vercel Testing
