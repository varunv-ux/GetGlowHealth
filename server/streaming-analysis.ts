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
    const stream = await openai.chat.completions.create({
      model: "gpt-4.1",
      temperature: promptConfig.temperature,
      max_tokens: promptConfig.maxTokens,
      messages: [
        {
          role: "system",
          content: promptConfig.systemPrompt
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
              }
            }
          ]
        }
      ],
      response_format: { type: "json_object" },
      stream: true  // ← KEY: Enable streaming!
    });

    let fullContent = "";
    let chunkCount = 0;

    // Stream chunks to client
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || "";
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

    // Parse final result
    const analysisResult = JSON.parse(fullContent);

    // Add metadata
    analysisResult.rawAnalysis = {
      model: "gpt-4.1",
      responseTime: new Date().toISOString(),
      fullResponse: fullContent
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
