import { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

interface FigmaUploadSectionProps {
  onUploadComplete: (analysisId: number, imageUrl: string) => void;
}

export default function FigmaUploadSection({ onUploadComplete }: FigmaUploadSectionProps) {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [loadingText, setLoadingText] = useState("Uploading image...");
  const { toast } = useToast();

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      // Compress image if it's larger than 4MB (Vercel limit on Hobby plan)
      let fileToUpload = file;
      const maxSize = 4 * 1024 * 1024; // 4MB
      
      if (file.size > maxSize) {
        setLoadingText("Compressing image...");
        
        // Create a canvas to compress the image
        const img = new Image();
        const reader = new FileReader();
        
        fileToUpload = await new Promise<File>((resolve, reject) => {
          reader.onload = (e) => {
            img.onload = () => {
              const canvas = document.createElement('canvas');
              let width = img.width;
              let height = img.height;
              
              // Scale down if too large
              const maxDimension = 2048;
              if (width > maxDimension || height > maxDimension) {
                if (width > height) {
                  height = (height / width) * maxDimension;
                  width = maxDimension;
                } else {
                  width = (width / height) * maxDimension;
                  height = maxDimension;
                }
              }
              
              canvas.width = width;
              canvas.height = height;
              
              const ctx = canvas.getContext('2d');
              if (!ctx) {
                reject(new Error('Failed to get canvas context'));
                return;
              }
              
              ctx.drawImage(img, 0, 0, width, height);
              
              // Try different quality levels until under size limit
              let quality = 0.8;
              const tryCompress = () => {
                canvas.toBlob(
                  (blob) => {
                    if (!blob) {
                      reject(new Error('Failed to compress image'));
                      return;
                    }
                    
                    // If still too large and quality can be reduced, try again
                    if (blob.size > maxSize && quality > 0.3) {
                      quality -= 0.1;
                      tryCompress();
                      return;
                    }
                    
                    const compressedFile = new File([blob], file.name, {
                      type: 'image/jpeg',
                      lastModified: Date.now(),
                    });
                    resolve(compressedFile);
                  },
                  'image/jpeg',
                  quality
                );
              };
              
              tryCompress();
            };
            
            img.onerror = () => reject(new Error('Failed to load image'));
            img.src = e.target?.result as string;
          };
          
          reader.onerror = () => reject(new Error('Failed to read file'));
          reader.readAsDataURL(file);
        });
        
        setLoadingText("Uploading image...");
      }
      
      const formData = new FormData();
      formData.append('image', fileToUpload);
      
      // Step 1: Upload image
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Failed to upload image');
      }
      
      const uploadData = await response.json();
      
      // Step 2: Start streaming analysis immediately
      const analysisResponse = await fetch(`/api/analysis/${uploadData.id}/start-streaming`, {
        method: 'POST',
      });
      
      if (!analysisResponse.ok) {
        throw new Error('Failed to start analysis');
      }
      
      return uploadData;
    },
    onSuccess: (data) => {
      toast({
        title: "Upload Successful",
        description: "Your photo has been uploaded and analysis is starting.",
      });
      onUploadComplete(data.id, data.imageUrl);
    },
    onError: (error) => {
      toast({
        title: "Upload Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (uploadMutation.isPending) {
      // Progressive loading text - each step happens once
      setLoadingText("Uploading image...");
      
      const timer1 = setTimeout(() => setLoadingText("Processing image..."), 800);
      const timer2 = setTimeout(() => setLoadingText("Starting analysis..."), 1600);
      
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
  }, [uploadMutation.isPending]);

  // Handle paste from clipboard
  useEffect(() => {
    const handlePaste = async (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        
        // Check if the item is an image
        if (item.type.indexOf('image') !== -1) {
          e.preventDefault();
          const blob = item.getAsFile();
          
          if (blob) {
            // Convert blob to File with a proper name
            const file = new File([blob], `pasted-image-${Date.now()}.png`, {
              type: blob.type,
            });
            
            setUploadedFile(file);
            uploadMutation.mutate(file);
          }
          break;
        }
      }
    };

    // Add paste event listener
    window.addEventListener('paste', handlePaste);
    
    return () => {
      window.removeEventListener('paste', handlePaste);
    };
  }, [uploadMutation]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setUploadedFile(file);
      // Auto upload when file is selected
      uploadMutation.mutate(file);
    }
  }, [uploadMutation]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp'],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: false,
    onDropRejected: (fileRejections) => {
      const rejection = fileRejections[0];
      if (rejection?.errors[0]?.code === 'file-too-large') {
        toast({
          title: "File Too Large",
          description: `Image must be under 10MB. Your file is ${(rejection.file.size / (1024 * 1024)).toFixed(1)}MB. Large files will be automatically compressed.`,
          variant: "destructive",
        });
      } else if (rejection?.errors[0]?.code === 'file-invalid-type') {
        toast({
          title: "Invalid File Type",
          description: "Please upload a JPG, PNG, or WebP image.",
          variant: "destructive",
        });
      }
    },
  });

  if (uploadMutation.isPending) {
    return (
      <div className="bg-[#f4f4f0] h-[200px] w-full rounded-[32px] border-2 border-dashed border-[#d6d3d1] opacity-80 relative">
        <div className="flex flex-col items-center justify-center h-full px-6 py-2.5">
          <div className="w-12 h-12 mb-3 relative">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#57534d]"></div>
          </div>
          <div className="text-[16px] leading-[24px] text-[#57534d] font-ibm-plex-sans">
            {loadingText}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      {...getRootProps()}
      className={`bg-[#f4f4f0] h-[200px] w-full rounded-[32px] border-2 border-dashed border-[#d6d3d1] opacity-80 relative cursor-pointer transition-colors ${
        isDragActive ? 'opacity-100 border-[#57534d]' : 'hover:opacity-100'
      }`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center h-full px-6 py-2.5">
        <div className="w-12 h-12 mb-3 relative flex items-center justify-center">
          <img 
            src="/upload-image.svg" 
            alt="Upload" 
            className="w-12 h-12"
            style={{ filter: 'brightness(0) saturate(100%) invert(36%) sepia(7%) saturate(629%) hue-rotate(16deg) brightness(95%) contrast(91%)' }}
          />
        </div>
        <div className="text-[16px] leading-[24px] text-[#57534d] font-ibm-plex-sans">
          Upload Photo
        </div>
        <div className="text-[12px] leading-[18px] text-[#57534d]/60 font-ibm-plex-sans mt-1">
          or paste from clipboard (⌘V) • Max 10MB
        </div>
      </div>
    </div>
  );
} 