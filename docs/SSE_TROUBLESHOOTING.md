# SSE Troubleshooting Guide

## Error: "MIME type text/html instead of text/event-stream"

This error means the SSE endpoint is returning HTML instead of proper SSE format.

### Cause 1: Database Schema Not Updated

**Symptom:**
```
EventSource's response has a MIME type ("text/html") that is not "text/event-stream"
```

**Solution:**
The `status` field doesn't exist in your database yet. Run the migration:

```bash
npm run db:push
```

When prompted, select: **"No, add the constraint without truncating"**

### Cause 2: Analysis ID Doesn't Exist

**Check in browser console:**
```
❌ SSE: ReadyState: 2 (CLOSED)
❌ SSE: URL: /api/analysis/44/stream
```

**Solution:**
The analysis with that ID doesn't exist. Either:
1. Upload a new image to get a valid analysis ID
2. Check your database to see what analysis IDs exist:
   ```sql
   SELECT id, status, created_at FROM analyses ORDER BY created_at DESC LIMIT 10;
   ```

### Cause 3: Server Not Running

**Check:**
```bash
ps aux | grep tsx | grep server/index.ts
```

**Solution:**
Start the server:
```bash
npm run dev
```

## Testing SSE Endpoint Manually

### Test with curl:
```bash
curl -N http://localhost:5000/api/analysis/1/stream
```

**Expected Output (success):**
```
data: {"id":1,"status":"pending",...}

```

**Expected Output (not found):**
```
event: error
data: {"message":"Analysis not found"}

```

### Test in Browser DevTools:

1. Open browser DevTools (F12)
2. Go to Console tab
3. Run:
```javascript
const es = new EventSource('/api/analysis/1/stream');
es.onmessage = (e) => console.log('Received:', JSON.parse(e.data));
es.onerror = (e) => console.error('Error:', e);
```

## Debugging Checklist

- [ ] Database migration applied (`npm run db:push`)
- [ ] Server is running (`npm run dev`)
- [ ] Analysis ID exists in database
- [ ] Check server logs for errors
- [ ] Check browser console for SSE logs
- [ ] Verify endpoint returns `Content-Type: text/event-stream`

## Common Issues

### Issue: Connection keeps reconnecting

**Symptoms:**
```
🔌 SSE: Connecting to /api/analysis/123/stream
❌ SSE: Connection error
🔌 SSE: Connecting to /api/analysis/123/stream
❌ SSE: Connection error
```

**Cause:** Server is sending an error but EventSource auto-reconnects

**Solution:** Check what error the server is returning:
```bash
curl -v http://localhost:5000/api/analysis/123/stream
```

### Issue: No updates received

**Symptoms:**
- SSE connects successfully
- No data ever arrives
- Analysis stuck in "processing"

**Cause:** Background analysis job may have failed

**Check server logs for:**
```
❌ Analysis failed for ID: 123
```

**Solution:** Check OpenAI API key and error logs

## How SSE Works in This App

1. Client uploads image → Server returns analysis ID
2. Client connects to `/api/analysis/{id}/stream`
3. Server immediately sends current analysis state
4. Background job processes image with OpenAI
5. When complete, server sends updated analysis via SSE
6. Client receives update and redirects to history page

## Fallback to Polling (Temporary)

If SSE continues to fail, you can temporarily revert to polling:

```typescript
// In processing-section.tsx
const { data: analysis } = useQuery<Analysis>({
  queryKey: [`/api/analysis/${analysisId}`],
  refetchInterval: 2000, // Poll every 2 seconds
  enabled: !!analysisId,
});
```

But please fix the SSE issue - polling is much less efficient!
