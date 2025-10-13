import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { nanoid } from 'nanoid';
import path from 'path';

// Initialize R2 client
let r2Client: S3Client | null = null;

function getR2Client(): S3Client {
  if (!r2Client) {
    // Check if R2 is configured
    if (!process.env.R2_ACCOUNT_ID || !process.env.R2_ACCESS_KEY_ID || !process.env.R2_SECRET_ACCESS_KEY) {
      throw new Error('R2 storage is not configured. Please set R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, and R2_SECRET_ACCESS_KEY in your environment variables.');
    }

    r2Client = new S3Client({
      region: 'auto',
      endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
      },
    });
  }
  return r2Client;
}

export interface UploadResult {
  url: string;
  key: string;
  size: number;
}

/**
 * Upload a file to Cloudflare R2
 * @param buffer - File buffer to upload
 * @param originalFilename - Original filename (used for extension)
 * @param contentType - MIME type (e.g., 'image/jpeg')
 * @returns Upload result with URL and key
 */
export async function uploadToR2(
  buffer: Buffer,
  originalFilename: string,
  contentType: string = 'image/jpeg'
): Promise<UploadResult> {
  try {
    const client = getR2Client();
    const bucketName = process.env.R2_BUCKET_NAME || 'getglow-images';
    
    // Generate unique filename
    const ext = path.extname(originalFilename);
    const uniqueId = nanoid(16);
    const key = `uploads/${Date.now()}-${uniqueId}${ext}`;
    
    // Upload to R2
    await client.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        Body: buffer,
        ContentType: contentType,
        // Make publicly accessible
        // Note: You'll need to configure bucket public access in Cloudflare dashboard
      })
    );
    
    // Construct public URL
    // Option 1: Using R2 public domain (if configured)
    let url: string;
    if (process.env.R2_PUBLIC_DOMAIN) {
      url = `https://${process.env.R2_PUBLIC_DOMAIN}/${key}`;
    } else {
      // Option 2: Using custom domain (recommended for production)
      // You'll configure this in Cloudflare dashboard
      url = `https://${bucketName}.r2.cloudflarestorage.com/${key}`;
    }
    
    console.log(`✅ Uploaded to R2: ${key} (${(buffer.length / 1024).toFixed(2)} KB)`);
    
    return {
      url,
      key,
      size: buffer.length,
    };
  } catch (error) {
    console.error('❌ R2 upload error:', error);
    throw new Error(`Failed to upload to R2: ${error.message}`);
  }
}

/**
 * Delete a file from R2
 * @param key - The file key in R2
 */
export async function deleteFromR2(key: string): Promise<void> {
  try {
    const client = getR2Client();
    const bucketName = process.env.R2_BUCKET_NAME || 'getglow-images';
    
    await client.send(
      new DeleteObjectCommand({
        Bucket: bucketName,
        Key: key,
      })
    );
    
    console.log(`🗑️  Deleted from R2: ${key}`);
  } catch (error) {
    console.error('❌ R2 delete error:', error);
    throw new Error(`Failed to delete from R2: ${error.message}`);
  }
}

/**
 * Check if R2 is properly configured
 */
export function isR2Configured(): boolean {
  return !!(
    process.env.R2_ACCOUNT_ID &&
    process.env.R2_ACCESS_KEY_ID &&
    process.env.R2_SECRET_ACCESS_KEY
  );
}

/**
 * Get MIME type from filename
 */
export function getMimeType(filename: string): string {
  const ext = path.extname(filename).toLowerCase();
  const mimeTypes: Record<string, string> = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.webp': 'image/webp',
    '.gif': 'image/gif',
  };
  return mimeTypes[ext] || 'application/octet-stream';
}
