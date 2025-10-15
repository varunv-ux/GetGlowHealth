import type { Response } from "express";
import OpenAI from "openai";
import fs from "fs";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * Streaming analysis - works on Vercel Hobby because each chunk is sent quickly
 * No timeout issues!
 */
export async function performStreamingAnalysis(
  imagePath: string,
  res: Response,
  onComplete: (analysisResult: any) => Promise<void>
) {
  try {
    // Set up SSE headers for streaming
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    });

    // Read and encode image
    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = imageBuffer.toString('base64');

    res.write(`event: progress\ndata: ${JSON.stringify({ status: "Starting analysis..." })}\n\n`);

    // Get prompt config
    const { configManager } = await import('./config/config-manager');
    const promptConfig = configManager.getActivePrompt();

    // Call OpenAI with streaming enabled
    // Note: Using gpt-4o with optimized parameters for high-quality analysis
    const stream = await openai.chat.completions.create({
      model: "gpt-4o",
      temperature: 0.4, // Lower for more consistent, factual responses (was 0.7)
      max_tokens: 6000, // Increased for comprehensive responses (was 4000)
      top_p: 0.9, // Nucleus sampling for higher quality outputs
      messages: [
        {
          role: "system",
          content: promptConfig.systemPrompt + "\n\nIMPORTANT: Ensure all JSON strings are properly escaped. Use \\\" for quotes inside strings, \\n for newlines."
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: promptConfig.analysisPrompt
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`
                // Note: "detail: high" triggers stricter content policy - removed
              }
            }
          ]
        }
      ],
      response_format: { type: "json_object" },
      stream: true  // ← KEY: Enable streaming!
    });

    let fullContent = "";
    let refusalContent = "";
    let chunkCount = 0;

    // Stream chunks to client
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || "";
      const refusal = chunk.choices[0]?.delta?.refusal || "";

      // Check for refusal (OpenAI content policy rejection)
      if (refusal) {
        refusalContent += refusal;
      }

      if (content) {
        fullContent += content;
        chunkCount++;

        // Send progress update every 10 chunks
        if (chunkCount % 10 === 0) {
          res.write(`event: progress\ndata: ${JSON.stringify({
            status: "Analyzing...",
            progress: Math.min((chunkCount / 100) * 100, 95)
          })}\n\n`);
        }
      }
    }

    // Handle refusals from OpenAI
    if (refusalContent) {
      console.error("❌ OpenAI refused the request:", refusalContent);
      res.write(`event: error\ndata: ${JSON.stringify({
        message: "Unable to analyze this image",
        details: "The AI service declined to process this request. This may occur with certain types of images or requests.",
        refusal: refusalContent
      })}\n\n`);
      res.end();
      throw new Error(`OpenAI refusal: ${refusalContent}`);
    }

    // Parse final result with better error handling
    let analysisResult;
    try {
      // Clean up the content before parsing
      const cleanedContent = fullContent.trim();
      
      // Log the content for debugging
      console.log(`📝 Received ${cleanedContent.length} characters from OpenAI`);
      console.log(`📝 First 200 chars: ${cleanedContent.substring(0, 200)}`);
      console.log(`📝 Last 200 chars: ${cleanedContent.substring(cleanedContent.length - 200)}`);
      
      analysisResult = JSON.parse(cleanedContent);
    } catch (parseError: any) {
      console.error("❌ JSON parse error:", parseError.message);
      console.error("❌ Content length:", fullContent.length);
      console.error("❌ Content preview (first 500):", fullContent.substring(0, 500));
      console.error("❌ Content preview (last 500):", fullContent.substring(fullContent.length - 500));
      
      // Try to fix incomplete JSON
      try {
        // Remove control characters and trim
        let fixedContent = fullContent.replace(/[\u0000-\u001F\u007F-\u009F]/g, '').trim();

        // Count open/close braces and brackets
        const openBraces = (fixedContent.match(/{/g) || []).length;
        const closeBraces = (fixedContent.match(/}/g) || []).length;
        const openBrackets = (fixedContent.match(/\[/g) || []).length;
        const closeBrackets = (fixedContent.match(/]/g) || []).length;

        console.log(`📊 Braces: ${openBraces} open, ${closeBraces} close | Brackets: ${openBrackets} open, ${closeBrackets} close`);

        // Try to close incomplete JSON
        for (let i = 0; i < (openBrackets - closeBrackets); i++) {
          fixedContent += ']';
        }
        for (let i = 0; i < (openBraces - closeBraces); i++) {
          fixedContent += '}';
        }

        analysisResult = JSON.parse(fixedContent);
        console.log("✅ Fixed incomplete JSON by closing missing brackets/braces");
      } catch (retryError) {
        // Send error to client
        res.write(`event: error\ndata: ${JSON.stringify({
          message: "AI response was incomplete. Try again or simplify your image.",
          details: `Response was ${fullContent.length} characters, parsing failed`
        })}\n\n`);
        res.end();
        throw new Error(`JSON parsing failed after retry: ${parseError.message}`);
      }
    }

    // Add metadata
    analysisResult.rawAnalysis = {
      model: "gpt-4o", // Valid OpenAI model
      responseTime: new Date().toISOString(),
      fullResponse: fullContent // Store complete response from OpenAI
    };

    // Send completion event
    res.write(`event: complete\ndata: ${JSON.stringify(analysisResult)}\n\n`);
    res.end();

    // Save to database (non-blocking)
    await onComplete(analysisResult);

    console.log(`✅ Streaming analysis completed, ${chunkCount} chunks`);

  } catch (error: any) {
    console.error("Streaming analysis error:", error);

    const errorMessage = error?.error?.message || error.message || 'Unknown error';

    // Send error event
    res.write(`event: error\ndata: ${JSON.stringify({
      message: `Failed to analyze: ${errorMessage}`
    })}\n\n`);
    res.end();

    throw error;
  }
}
