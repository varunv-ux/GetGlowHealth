import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { Check, RotateCcw, ClipboardList } from "lucide-react";
import type { Analysis } from "@shared/schema";

interface ProcessingSectionProps {
  analysisId: number;
  onAnalysisComplete: (analysis: Analysis) => void;
}

export default function ProcessingSection({ analysisId, onAnalysisComplete }: ProcessingSectionProps) {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const { data: analysis, isLoading, error } = useQuery({
    queryKey: [`/api/analysis/${analysisId}`],
    refetchInterval: 1000,
    enabled: !!analysisId,
  });

  useEffect(() => {
    if (analysis) {
      // Complete the progress animation
      setProgress(100);
      setCurrentStep(3);
      
      // Delay before showing results
      setTimeout(() => {
        onAnalysisComplete(analysis);
      }, 2000);
    }
  }, [analysis, onAnalysisComplete]);

  useEffect(() => {
    // Simulate progress animation
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev;
        return prev + Math.random() * 10;
      });
    }, 500);

    // Update steps
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= 2) return prev;
        return prev + 1;
      });
    }, 2000);

    return () => {
      clearInterval(interval);
      clearInterval(stepInterval);
    };
  }, []);

  const steps = [
    {
      title: "Image Processing",
      description: "Enhancing image quality and detecting facial features",
      icon: Check,
    },
    {
      title: "AI Analysis",
      description: "Analyzing facial features for health indicators",
      icon: RotateCcw,
    },
    {
      title: "Report Generation",
      description: "Compiling comprehensive health insights",
      icon: ClipboardList,
    },
  ];

  if (error) {
    return (
      <Card className="shadow-lg mb-12">
        <CardContent className="p-8">
          <div className="text-center text-red-600">
            <p className="text-lg font-semibold mb-2">Analysis Error</p>
            <p className="text-sm">There was an error processing your image. Please try again.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg mb-12">
      <CardContent className="p-8">
        <h3 className="text-xl font-semibold text-dark-grey mb-6">Analyzing Your Photo</h3>
        
        <div className="space-y-6">
          {steps.map((step, index) => {
            const isActive = currentStep === index;
            const isCompleted = currentStep > index;
            const IconComponent = step.icon;
            
            return (
              <div key={index} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-4 ${
                  isCompleted 
                    ? 'bg-medical-green' 
                    : isActive 
                      ? 'bg-trust-blue' 
                      : 'bg-gray-300'
                }`}>
                  {isCompleted ? (
                    <Check className="w-4 h-4 text-white" />
                  ) : isActive ? (
                    <IconComponent className={`w-4 h-4 text-white ${isActive ? 'animate-spin' : ''}`} />
                  ) : (
                    <IconComponent className="w-4 h-4 text-gray-600" />
                  )}
                </div>
                <div className="flex-1">
                  <h4 className={`font-medium ${isCompleted || isActive ? 'text-dark-grey' : 'text-gray-500'}`}>
                    {step.title}
                  </h4>
                  <p className={`text-sm ${isCompleted || isActive ? 'text-gray-600' : 'text-gray-400'}`}>
                    {step.description}
                  </p>
                  {isActive && index === 1 && (
                    <div className="mt-2">
                      <Progress value={progress} className="h-2" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
