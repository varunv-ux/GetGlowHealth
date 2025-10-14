import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { CloudUpload, Check, Lock, ShieldQuestion, Trash2, Award } from "lucide-react";

interface UploadSectionProps {
  onUploadComplete: (analysisId: number, imageUrl: string) => void;
}

export default function UploadSection({ onUploadComplete }: UploadSectionProps) {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const { toast } = useToast();

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('image', file);

      // Step 1: Upload image to get ID
      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload image');
      }

      const uploadData = await uploadResponse.json();

      // Step 2: Start analysis
      const analysisResponse = await fetch(`/api/analysis/${uploadData.id}/start`, {
        method: 'POST',
        credentials: 'include',
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

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setUploadedFile(file);
    }
  }, []);

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

  const handleUpload = () => {
    if (uploadedFile) {
      uploadMutation.mutate(uploadedFile);
    }
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
      <Card className="shadow-lg">
        <CardContent className="p-8">
          <h3 className="text-xl font-semibold text-dark-grey mb-6">Upload Your Photo</h3>
          
          {!uploadedFile ? (
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragActive 
                  ? 'border-medical-green bg-green-50' 
                  : 'border-gray-300 hover:border-medical-green'
              }`}
            >
              <input {...getInputProps()} />
              <CloudUpload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-lg font-medium text-dark-grey mb-2">
                {isDragActive ? 'Drop your photo here' : 'Drop your photo here or click to browse'}
              </p>
              <p className="text-sm text-gray-500 mb-4">Supports JPG, PNG, WEBP (max 10MB)</p>
              <Button className="bg-medical-green hover:bg-green-600 text-white">
                Choose File
              </Button>
            </div>
          ) : (
            <div className="border-2 border-green-300 bg-green-50 rounded-lg p-8 text-center">
              <Check className="w-16 h-16 text-medical-green mx-auto mb-4" />
              <p className="text-lg font-medium text-dark-grey mb-2">Photo uploaded successfully!</p>
              <p className="text-sm text-gray-600 mb-4">{uploadedFile.name}</p>
              <div className="flex gap-4 justify-center">
                <Button 
                  onClick={handleUpload}
                  disabled={uploadMutation.isPending}
                  className="bg-medical-green hover:bg-green-600 text-white"
                >
                  {uploadMutation.isPending ? 'Analyzing...' : 'Start Analysis'}
                </Button>
                <Button 
                  onClick={handleRemoveFile}
                  variant="outline"
                  className="border-gray-300"
                >
                  Remove
                </Button>
              </div>
            </div>
          )}

          {/* Upload Guidelines */}
          <div className="mt-6 bg-blue-50 rounded-lg p-4">
            <h4 className="font-medium text-trust-blue mb-2">Photo Guidelines</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li className="flex items-center">
                <Check className="w-4 h-4 text-success-green mr-2" />
                Front-facing, well-lit photo
              </li>
              <li className="flex items-center">
                <Check className="w-4 h-4 text-success-green mr-2" />
                Clear view of entire face
              </li>
              <li className="flex items-center">
                <Check className="w-4 h-4 text-success-green mr-2" />
                Neutral expression preferred
              </li>
              <li className="flex items-center">
                <Check className="w-4 h-4 text-success-green mr-2" />
                No sunglasses or face coverings
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Security Info */}
      <Card className="shadow-lg">
        <CardContent className="p-8">
          <h3 className="text-xl font-semibold text-dark-grey mb-6">Privacy & Security</h3>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Lock className="text-trust-blue w-5 h-5 mt-1" />
              <div>
                <h4 className="font-medium text-dark-grey">End-to-End Encryption</h4>
                <p className="text-sm text-gray-600">Your photos are encrypted during upload and analysis</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <ShieldQuestion className="text-trust-blue w-5 h-5 mt-1" />
              <div>
                <h4 className="font-medium text-dark-grey">HIPAA Compliant</h4>
                <p className="text-sm text-gray-600">Full compliance with healthcare privacy standards</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <Trash2 className="text-trust-blue w-5 h-5 mt-1" />
              <div>
                <h4 className="font-medium text-dark-grey">Auto-Delete</h4>
                <p className="text-sm text-gray-600">Photos automatically deleted after 24 hours</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <Award className="text-trust-blue w-5 h-5 mt-1" />
              <div>
                <h4 className="font-medium text-dark-grey">FDA Compliant</h4>
                <p className="text-sm text-gray-600">Analysis methods meet FDA guidelines</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
