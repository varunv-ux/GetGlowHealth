import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

interface FigmaUploadSectionProps {
  onUploadComplete: (analysisId: number) => void;
}

export default function FigmaUploadSection({ onUploadComplete }: FigmaUploadSectionProps) {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const { toast } = useToast();

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Failed to upload and analyze image');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Upload Successful",
        description: "Your photo has been uploaded and analysis is starting.",
      });
      onUploadComplete(data.id);
    },
    onError: (error) => {
      toast({
        title: "Upload Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

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
  });

  if (uploadMutation.isPending) {
    return (
      <div className="bg-[#f4f4f0] h-[200px] w-full rounded-[32px] border-2 border-dashed border-[#d6d3d1] opacity-80 relative">
        <div className="flex flex-col items-center justify-center h-full px-6 py-2.5">
          <div className="w-12 h-12 mb-3 relative">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#57534d]"></div>
          </div>
          <div className="text-[16px] leading-[24px] text-[#57534d] font-ibm-plex-sans">
            Analyzing...
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
      </div>
    </div>
  );
} 