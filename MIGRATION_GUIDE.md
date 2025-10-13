# Migration Guide: Polling to SSE + State Management Fixes

## Overview
This migration fixes three critical issues:
1. ✅ Replaced inefficient polling with Server-Sent Events (SSE)
2. ✅ Added proper database status field with indexes
3. ✅ Fixed state management to use URL parameters

## Database Changes

### New Fields Added to `analyses` Table:
- `status` (varchar) - 'pending', 'processing', 'completed', 'failed'
- `errorMessage` (text) - Error details if analysis fails
- `processingStartedAt` (timestamp) - When processing began
- `processingCompletedAt` (timestamp) - When processing finished

### New Indexes Added:
- `idx_analyses_user_id` - On userId field
- `idx_analyses_status` - On status field
- `idx_analyses_created_at` - On createdAt field
- `idx_analyses_user_created` - Compound index on (userId, createdAt)

### Default Values:
- All score fields now default to 0
- `analysisData` and `recommendations` default to {}
- `status` defaults to 'pending'

## How to Apply Database Changes

### Option 1: Automated Migration (Recommended)
```bash
npm run db:push
```

When prompted about the `users_email_unique` constraint, select:
**"No, add the constraint without truncating the table"**

### Option 2: Manual SQL Migration
If automated migration fails, run this SQL directly:

```sql
-- Add new columns to analyses table
ALTER TABLE analyses
  ADD COLUMN status VARCHAR(20) NOT NULL DEFAULT 'pending',
  ADD COLUMN error_message TEXT,
  ADD COLUMN processing_started_at TIMESTAMP,
  ADD COLUMN processing_completed_at TIMESTAMP;

-- Update existing records to 'completed' if they have scores
UPDATE analyses
SET status = 'completed',
    processing_completed_at = created_at
WHERE overall_score > 0;

-- Add default values to existing score columns
ALTER TABLE analyses
  ALTER COLUMN overall_score SET DEFAULT 0,
  ALTER COLUMN skin_health SET DEFAULT 0,
  ALTER COLUMN eye_health SET DEFAULT 0,
  ALTER COLUMN circulation SET DEFAULT 0,
  ALTER COLUMN symmetry SET DEFAULT 0;

-- Update JSONB columns to have empty object defaults
ALTER TABLE analyses
  ALTER COLUMN analysis_data SET DEFAULT '{}'::jsonb,
  ALTER COLUMN recommendations SET DEFAULT '{}'::jsonb;

-- Create indexes for better query performance
CREATE INDEX idx_analyses_user_id ON analyses(user_id);
CREATE INDEX idx_analyses_status ON analyses(status);
CREATE INDEX idx_analyses_created_at ON analyses(created_at);
CREATE INDEX idx_analyses_user_created ON analyses(user_id, created_at);

-- Add unique constraint to users email if not exists
ALTER TABLE users ADD CONSTRAINT users_email_unique UNIQUE (email);
```

## What Changed

### Server-Side Changes

#### 1. New SSE Manager (`server/sse-manager.ts`)
- Manages Server-Sent Event connections
- Pushes real-time updates to clients
- Automatically cleans up connections

#### 2. Updated Routes (`server/routes.ts`)
- Added `/api/analysis/:id/stream` endpoint for SSE
- Analysis creation now uses `status: 'pending'`
- Background processing updates status to 'processing' → 'completed' or 'failed'
- Proper error handling with status updates
- Automatic cleanup of temporary files

#### 3. Better Error Handling
- Failed analyses marked with `status: 'failed'`
- Error messages saved to `errorMessage` field
- SSE notifications sent on both success and failure
- Temp files cleaned up even on errors

### Client-Side Changes

#### 1. New SSE Hook (`client/src/hooks/useSSE.ts`)
- Custom React hook for SSE connections
- Handles connection lifecycle
- Auto-reconnection on errors
- Clean disconnect on unmount

#### 2. Updated ProcessingSection (`client/src/components/processing-section.tsx`)
**Before:**
```typescript
const { data: analysis } = useQuery({
  queryKey: [`/api/analysis/${analysisId}`],
  refetchInterval: 1000, // ❌ Polls every second!
  enabled: !!analysisId,
});

if (analysis && analysis.overallScore > 0) {
  // Navigate when complete
}
```

**After:**
```typescript
const { data: analysis, error } = useSSE<Analysis>({
  url: `/api/analysis/${analysisId}/stream`, // ✅ Real-time updates
  enabled: !!analysisId,
});

if (analysis && analysis.status === 'completed') {
  // Navigate when complete
}
```

#### 3. Updated Home Page (`client/src/pages/home.tsx`)
**Before:**
```typescript
const [currentStep, setCurrentStep] = useState('upload'); // ❌ Local state
const [analysisId, setAnalysisId] = useState(null);

const handleUploadComplete = (id) => {
  setAnalysisId(id);
  setCurrentStep('processing');
};
```

**After:**
```typescript
const search = useSearch(); // ✅ URL-based state
const params = new URLSearchParams(search);
const analysisId = params.get('analysisId');

const handleUploadComplete = (id) => {
  setLocation(`/?analysisId=${id}`); // Updates URL
};
```

#### 4. Updated History Page (`client/src/pages/history.tsx`)
- Now shows status badges: 'Processing...', 'Pending...', 'Analysis Failed'
- Uses `analysis.status` instead of `analysis.overallScore > 0`

## Benefits

### 1. Performance Improvements
**Before:**
- 1 database query per second per user
- 100 concurrent users = 100 queries/second
- Constant CPU usage even when idle

**After:**
- Single SSE connection per user
- Database queried only on state changes
- Near-zero overhead when idle

### 2. Better User Experience
**Before:**
- 1 second delay before updates appear
- No error feedback
- State lost on page refresh

**After:**
- Instant updates via SSE
- Clear error messages shown
- Deep linkable URLs with state

### 3. Reliability
**Before:**
- Failed analyses stuck forever with `overallScore: 0`
- No way to distinguish pending from failed
- Temp files never cleaned up

**After:**
- Explicit status tracking
- Error messages saved and displayed
- Automatic cleanup on success or failure

## Testing

### Test SSE Connection
1. Start the server: `npm run dev`
2. Upload an image
3. Watch browser console for SSE messages:
   ```
   🔌 SSE: Connecting to /api/analysis/123/stream
   ✅ SSE: Connected
   📨 SSE: Received data: {status: 'processing'}
   📨 SSE: Received data: {status: 'completed', ...}
   ```

### Test State Persistence
1. Upload an image
2. Copy the URL (e.g., `http://localhost:5000/?analysisId=123`)
3. Refresh the page
4. Should still show processing status ✅

### Test Error Handling
1. Remove OpenAI API key temporarily
2. Upload an image
3. Should show "Analysis failed" message ✅

## Rollback Plan

If you need to rollback:

1. Restore previous files:
```bash
git checkout HEAD~1 client/src/components/processing-section.tsx
git checkout HEAD~1 client/src/pages/home.tsx
git checkout HEAD~1 server/routes.ts
git checkout HEAD~1 shared/schema.ts
```

2. Remove new files:
```bash
rm server/sse-manager.ts
rm client/src/hooks/useSSE.ts
```

3. Run database rollback:
```sql
ALTER TABLE analyses
  DROP COLUMN status,
  DROP COLUMN error_message,
  DROP COLUMN processing_started_at,
  DROP COLUMN processing_completed_at;

DROP INDEX IF EXISTS idx_analyses_user_id;
DROP INDEX IF EXISTS idx_analyses_status;
DROP INDEX IF EXISTS idx_analyses_created_at;
DROP INDEX IF EXISTS idx_analyses_user_created;
```

## Next Steps (Optional Enhancements)

1. **Add Rate Limiting**
   ```bash
   npm install express-rate-limit
   ```

2. **Add Redis for SSE Scaling**
   ```bash
   npm install ioredis
   ```

3. **Add Retry Logic**
   ```bash
   npm install cockatiel
   ```

4. **Add Monitoring**
   ```bash
   npm install pino prom-client
   ```

## Troubleshooting

### SSE Connection Issues
**Symptom:** "Failed to create event stream" error

**Solution:** Check that the server is running and the analysis ID exists

### Database Migration Fails
**Symptom:** Error adding unique constraint

**Solution:** Run manual SQL migration (see Option 2 above)

### Analysis Stuck in "Processing"
**Symptom:** Status never changes to completed

**Solution:** Check server logs for OpenAI API errors

## Support

For issues or questions:
1. Check server logs: `npm run dev`
2. Check browser console for SSE messages
3. Verify database schema matches expected structure
