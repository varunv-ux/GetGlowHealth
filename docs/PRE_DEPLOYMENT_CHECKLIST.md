# Pre-Deployment Verification Checklist

## ✅ Code Verification

- [x] **Streaming endpoint exists**
  - File: `server/streaming-analysis.ts`
  - Endpoint: `/api/analysis/:id/start-streaming`

- [x] **Client calls streaming endpoint**
  - File: `client/src/pages/home.tsx` (line 62)
  - File: `client/src/components/upload-section.tsx` (line 36)

- [x] **SSE headers configured**
  - `Content-Type: text/event-stream`
  - `Cache-Control: no-cache`
  - `Connection: keep-alive`

- [x] **OpenAI streaming enabled**
  - Parameter: `stream: true`
  - Model: `gpt-4.1`

- [x] **Build successful**
  - `npm run build` completes without errors
  - `api/index.js` generated for Vercel

- [x] **Works on localhost**
  - According to user report ✅

---

## 🔧 Vercel Configuration

### Environment Variables to Set:

#### Required:
- [ ] `DATABASE_URL` - PostgreSQL connection string
- [ ] `OPENAI_API_KEY` - OpenAI API key (sk-...)
- [ ] `SESSION_SECRET` - Random secret for sessions
- [ ] `NODE_ENV` - Set to "production"

#### Optional (R2 Storage):
- [ ] `R2_ACCOUNT_ID`
- [ ] `R2_ACCESS_KEY_ID`
- [ ] `R2_SECRET_ACCESS_KEY`
- [ ] `R2_BUCKET_NAME`
- [ ] `R2_PUBLIC_URL` or `R2_PUBLIC_DOMAIN`

### Vercel Project Settings:
- [ ] Build Command: `npm run build`
- [ ] Output Directory: `dist/public`
- [ ] Install Command: `npm install`
- [ ] Framework Preset: None (custom)

---

## 🚀 Deployment Steps

### Step 1: Commit and Push
```bash
# Stage documentation files
git add STREAMING_TEST_REPORT.md \
        DEPLOY_AND_TEST_GUIDE.md \
        STREAMING_ARCHITECTURE.md \
        READY_TO_TEST.md \
        test-vercel-streaming.sh \
        PRE_DEPLOYMENT_CHECKLIST.md

# Commit
git commit -m "Add streaming implementation and testing documentation"

# Push to trigger Vercel deployment
git push origin main
```

### Step 2: Wait for Deployment
- [ ] Check Vercel dashboard
- [ ] Wait for build to complete
- [ ] Note the deployment URL

### Step 3: Verify Environment Variables
- [ ] Go to Vercel Dashboard → Settings → Environment Variables
- [ ] Verify all required variables are set
- [ ] If missing, add them and redeploy

---

## 🧪 Testing Checklist

### Manual Browser Test:
1. [ ] Visit Vercel URL
2. [ ] Upload test image (face photo)
3. [ ] Click "Start Analysis"
4. [ ] Watch animated loader (should not timeout)
5. [ ] Wait 20-40 seconds
6. [ ] Verify redirect to /history
7. [ ] Check results are displayed

### Browser DevTools Test:
1. [ ] Open DevTools (F12)
2. [ ] Go to Network tab
3. [ ] Filter by "eventsource" or look for `/start-streaming`
4. [ ] Verify:
   - [ ] Status: 200 OK
   - [ ] Type: text/event-stream
   - [ ] Connection stays open 20-40s
   - [ ] Events stream in

### Console Test:
1. [ ] Open Console tab
2. [ ] Look for polling logs:
   - [ ] "🔄 Polling for analysis: X"
   - [ ] "📊 Analysis status: processing"
   - [ ] "✅ Polling stopped. Final status: completed"
3. [ ] No error messages

### Automated Test:
```bash
# Replace with your Vercel URL
./test-vercel-streaming.sh https://your-app.vercel.app
```

Expected results:
- [ ] All 5 tests pass
- [ ] No timeout errors
- [ ] Analysis completes
- [ ] Results saved to database

### Vercel Logs Test:
1. [ ] Go to Vercel Dashboard → Logs
2. [ ] Watch for:
   - [ ] `[HANDLER] POST /api/analysis/:id/start-streaming`
   - [ ] `📥 Downloading image from R2`
   - [ ] `✅ Streaming analysis completed, X chunks`
3. [ ] No timeout errors
4. [ ] No "Function Invocation Failed" errors

---

## 🎯 Success Criteria

### ✅ Deployment Successful When:
- [ ] No build errors in Vercel
- [ ] Deployment shows "Ready" status
- [ ] Environment variables are set
- [ ] Site loads at Vercel URL

### ✅ Streaming Working When:
- [ ] Analysis completes in 20-40 seconds
- [ ] No "504 Gateway Timeout" errors
- [ ] SSE connection stays open
- [ ] Progress events visible
- [ ] Results saved to database
- [ ] User redirected to history page

### ✅ Production Ready When:
- [ ] Manual test succeeds
- [ ] Automated test succeeds
- [ ] Vercel logs show no errors
- [ ] Multiple images tested successfully
- [ ] Database updates correctly

---

## 🐛 Common Issues & Solutions

### Issue: Build fails on Vercel
**Check:**
- [ ] `package.json` scripts are correct
- [ ] All dependencies are in package.json
- [ ] No TypeScript errors

### Issue: "Environment variable not set"
**Solution:**
- [ ] Go to Vercel → Settings → Environment Variables
- [ ] Add missing variables
- [ ] Redeploy

### Issue: Still timing out
**Check:**
- [ ] Client is calling `/start-streaming` (not `/start`)
- [ ] SSE headers are correct
- [ ] OpenAI `stream: true` is set
- [ ] Check Vercel logs for specific error

### Issue: Analysis never completes
**Check:**
- [ ] Database status field
- [ ] OpenAI API quota/limits
- [ ] Vercel logs for errors
- [ ] Check if response is valid JSON

---

## 📊 Expected Performance

| Metric | Target |
|--------|--------|
| Upload Time | 1-3 seconds |
| Streaming Analysis | 20-40 seconds |
| Database Save | <1 second |
| **Total** | **~25-45 seconds** |
| Timeout Risk | **0% (was 100%)** |

---

## 📝 Post-Deployment Tasks

After successful test:
- [ ] Mark this checklist complete
- [ ] Document any issues encountered
- [ ] Update READY_TO_TEST.md with results
- [ ] Share Vercel URL for team testing
- [ ] Monitor first few production uses
- [ ] Set up Vercel alerts (optional)

---

## 🎉 Ready to Deploy?

If all items above are checked or verified:

```bash
# Final command to deploy
git push origin main
```

Then watch Vercel dashboard and test with the checklist! 🚀

---

**Last Updated:** January 2025
**Status:** 🟡 Awaiting Deployment
