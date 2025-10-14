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
      const formData = new FormData();
      formData.append('image', file);
      
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
          description: `Image must be under 10MB. Your file is ${(rejection.file.size / (1024 * 1024)).toFixed(1)}MB.`,
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