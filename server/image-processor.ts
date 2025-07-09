import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

export interface ImageProcessingResult {
  processedPath: string;
  originalSize: number;
  processedSize: number;
  originalDimensions: string;
  processedDimensions: string;
  wasResized: boolean;
}

export interface ImageProcessingOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: 'jpeg' | 'png' | 'webp';
  maxFileSize?: number; // in bytes
}

const DEFAULT_OPTIONS: ImageProcessingOptions = {
  maxWidth: 1200,
  maxHeight: 1200,
  quality: 85,
  format: 'jpeg',
  maxFileSize: 2 * 1024 * 1024 // 2MB
};

export async function processImage(
  inputPath: string,
  outputPath: string,
  options: ImageProcessingOptions = {}
): Promise<ImageProcessingResult> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  
  // Get original file stats
  const originalStats = fs.statSync(inputPath);
  const originalSize = originalStats.size;
  
  // Get original image metadata
  const originalMetadata = await sharp(inputPath).metadata();
  const originalDimensions = `${originalMetadata.width}x${originalMetadata.height}`;
  
  // Check if resizing is needed
  const needsResize = (
    originalSize > opts.maxFileSize! ||
    originalMetadata.width! > opts.maxWidth! ||
    originalMetadata.height! > opts.maxHeight!
  );
  
  if (!needsResize) {
    // No processing needed, just copy the file
    fs.copyFileSync(inputPath, outputPath);
    return {
      processedPath: outputPath,
      originalSize,
      processedSize: originalSize,
      originalDimensions,
      processedDimensions: originalDimensions,
      wasResized: false
    };
  }
  
  // Process the image
  const processedImage = sharp(inputPath)
    .resize(opts.maxWidth, opts.maxHeight, {
      fit: 'inside',
      withoutEnlargement: true
    });
  
  // Convert to specified format with quality
  switch (opts.format) {
    case 'jpeg':
      processedImage.jpeg({ quality: opts.quality });
      break;
    case 'png':
      processedImage.png({ quality: opts.quality });
      break;
    case 'webp':
      processedImage.webp({ quality: opts.quality });
      break;
  }
  
  // Save processed image
  await processedImage.toFile(outputPath);
  
  // Get processed image metadata
  const processedMetadata = await sharp(outputPath).metadata();
  const processedStats = fs.statSync(outputPath);
  const processedDimensions = `${processedMetadata.width}x${processedMetadata.height}`;
  
  return {
    processedPath: outputPath,
    originalSize,
    processedSize: processedStats.size,
    originalDimensions,
    processedDimensions,
    wasResized: true
  };
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function getImageFormat(filename: string): 'jpeg' | 'png' | 'webp' {
  const ext = path.extname(filename).toLowerCase();
  switch (ext) {
    case '.png':
      return 'png';
    case '.webp':
      return 'webp';
    case '.jpg':
    case '.jpeg':
    default:
      return 'jpeg';
  }
}