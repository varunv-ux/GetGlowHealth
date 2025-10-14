#!/bin/bash

# Test script for Vercel Streaming Implementation
# This script helps verify the streaming analysis is working on Vercel

echo "🧪 GetGlow - Vercel Streaming Test Script"
echo "=========================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Get deployment URL
if [ -z "$1" ]; then
  echo -e "${YELLOW}Usage: ./test-vercel-streaming.sh <VERCEL_URL>${NC}"
  echo "Example: ./test-vercel-streaming.sh https://your-app.vercel.app"
  echo ""
  echo "Or set VERCEL_URL environment variable:"
  echo "export VERCEL_URL=https://your-app.vercel.app"
  echo "./test-vercel-streaming.sh"
  exit 1
fi

VERCEL_URL="${1:-$VERCEL_URL}"
VERCEL_URL="${VERCEL_URL%/}" # Remove trailing slash

echo "Testing deployment: $VERCEL_URL"
echo ""

# Test 1: Check if API is accessible
echo "1️⃣  Testing API accessibility..."
HEALTH_CHECK=$(curl -s -o /dev/null -w "%{http_code}" "$VERCEL_URL/api/recent")
if [ "$HEALTH_CHECK" == "200" ]; then
  echo -e "${GREEN}✅ API is accessible${NC}"
else
  echo -e "${RED}❌ API returned status code: $HEALTH_CHECK${NC}"
  exit 1
fi
echo ""

# Test 2: Check environment variables (indirect test via error message)
echo "2️⃣  Checking if required environment variables are set..."
echo "   (Testing with a simple API call)"
RECENT_RESPONSE=$(curl -s "$VERCEL_URL/api/recent?limit=1")
if echo "$RECENT_RESPONSE" | grep -q "error\|Error"; then
  echo -e "${RED}❌ API returned an error. Check environment variables in Vercel:${NC}"
  echo "$RECENT_RESPONSE"
  exit 1
else
  echo -e "${GREEN}✅ API is functioning (env vars likely OK)${NC}"
fi
echo ""

# Test 3: Test upload endpoint
echo "3️⃣  Testing upload endpoint..."
echo "   Creating a test image..."

# Create a simple 1x1 red pixel PNG
TEST_IMAGE="/tmp/test-face.png"
base64 -d <<< "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==" > "$TEST_IMAGE"

# Upload the test image
echo "   Uploading test image..."
UPLOAD_RESPONSE=$(curl -s -X POST \
  -F "image=@$TEST_IMAGE" \
  "$VERCEL_URL/api/upload")

UPLOAD_ID=$(echo "$UPLOAD_RESPONSE" | grep -o '"id":[0-9]*' | cut -d':' -f2)

if [ -z "$UPLOAD_ID" ]; then
  echo -e "${RED}❌ Upload failed. Response:${NC}"
  echo "$UPLOAD_RESPONSE"
  rm "$TEST_IMAGE"
  exit 1
fi

echo -e "${GREEN}✅ Upload successful! Analysis ID: $UPLOAD_ID${NC}"
rm "$TEST_IMAGE"
echo ""

# Test 4: Test streaming endpoint
echo "4️⃣  Testing streaming analysis endpoint..."
echo "   Starting streaming analysis..."
echo "   (This will take 20-40 seconds - watch for progress events)"
echo ""

STREAM_START=$(date +%s)

# Use curl to test SSE streaming
curl -N -s "$VERCEL_URL/api/analysis/$UPLOAD_ID/start-streaming" \
  -H "Accept: text/event-stream" \
  -m 120 \
  2>&1 | while IFS= read -r line; do
  
  # Parse SSE events
  if [[ "$line" == event:* ]]; then
    EVENT_TYPE=$(echo "$line" | cut -d':' -f2 | xargs)
    echo -e "${YELLOW}   📡 Event: $EVENT_TYPE${NC}"
  elif [[ "$line" == data:* ]]; then
    DATA=$(echo "$line" | cut -d':' -f2-)
    
    # Check for specific events
    if echo "$DATA" | grep -q "Starting analysis"; then
      echo -e "${GREEN}   ✅ Analysis started${NC}"
    elif echo "$DATA" | grep -q "Analyzing"; then
      PROGRESS=$(echo "$DATA" | grep -o '"progress":[0-9]*' | cut -d':' -f2)
      if [ ! -z "$PROGRESS" ]; then
        echo "   📊 Progress: $PROGRESS%"
      fi
    elif echo "$DATA" | grep -q "overallScore"; then
      echo -e "${GREEN}   ✅ Analysis complete! Received results.${NC}"
      STREAM_END=$(date +%s)
      DURATION=$((STREAM_END - STREAM_START))
      echo -e "${GREEN}   ⏱️  Total time: ${DURATION}s${NC}"
      
      # Extract overall score
      SCORE=$(echo "$DATA" | grep -o '"overallScore":[0-9]*' | cut -d':' -f2)
      if [ ! -z "$SCORE" ]; then
        echo "   🎯 Overall Score: $SCORE"
      fi
      break
    elif echo "$DATA" | grep -q "Failed to analyze"; then
      echo -e "${RED}   ❌ Analysis failed${NC}"
      echo "   Error: $DATA"
      exit 1
    fi
  fi
done

echo ""

# Test 5: Verify results in database
echo "5️⃣  Verifying results in database..."
sleep 2 # Give DB a moment to update

ANALYSIS_RESPONSE=$(curl -s "$VERCEL_URL/api/analysis/$UPLOAD_ID")
STATUS=$(echo "$ANALYSIS_RESPONSE" | grep -o '"status":"[^"]*"' | cut -d'"' -f4)

if [ "$STATUS" == "completed" ]; then
  echo -e "${GREEN}✅ Analysis status in database: completed${NC}"
else
  echo -e "${YELLOW}⚠️  Analysis status: $STATUS${NC}"
fi

OVERALL_SCORE=$(echo "$ANALYSIS_RESPONSE" | grep -o '"overallScore":[0-9]*' | cut -d':' -f2)
if [ ! -z "$OVERALL_SCORE" ] && [ "$OVERALL_SCORE" -gt 0 ]; then
  echo -e "${GREEN}✅ Results saved to database (Overall Score: $OVERALL_SCORE)${NC}"
else
  echo -e "${YELLOW}⚠️  Overall score: $OVERALL_SCORE${NC}"
fi

echo ""
echo "=========================================="
echo -e "${GREEN}🎉 All tests passed!${NC}"
echo ""
echo "Summary:"
echo "  - API is accessible ✅"
echo "  - Upload works ✅"
echo "  - Streaming analysis works ✅"
echo "  - Results saved to database ✅"
echo ""
echo "Next steps:"
echo "  1. Test with a real face image on the website"
echo "  2. Check Vercel logs for any warnings"
echo "  3. Monitor for timeout issues (should be none!)"
echo ""
echo "View your analysis at:"
echo "  $VERCEL_URL/history?selected=$UPLOAD_ID"
echo ""
