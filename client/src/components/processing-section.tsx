import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import type { Analysis } from "@shared/schema";
import { useSSE } from "@/hooks/useSSE";

interface ProcessingSectionProps {
  analysisId: number;
  onAnalysisComplete: (analysis: Analysis) => void;
}

export default function ProcessingSection({ analysisId, onAnalysisComplete }: ProcessingSectionProps) {
  const [loadingText, setLoadingText] = useState("Analyzing your photo...");
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  // Use SSE instead of polling
  const { data: analysis, error } = useSSE<Analysis>({
    url: `/api/analysis/${analysisId}/stream`,
    enabled: !!analysisId,
    onMessage: (data) => {
      console.log('Received analysis update:', data.status);
    }
  });

  useEffect(() => {
    // Check if analysis is complete
    if (analysis && analysis.status === 'completed') {
      // Navigate to the specific report once analysis is complete
      queryClient.invalidateQueries({ queryKey: ['/api/history'] });
      setLocation(`/history?selected=${analysisId}`);
    }
  }, [analysis, analysisId, setLocation, queryClient]);

  useEffect(() => {
    // Progressive text - each step happens once in sequence
    setLoadingText("Analyzing your photo...");
    
    const timer1 = setTimeout(() => setLoadingText("Running health analysis..."), 3000);
    const timer2 = setTimeout(() => setLoadingText("Detecting patterns..."), 6000);
    const timer3 = setTimeout(() => setLoadingText("Generating insights..."), 9000);
    const timer4 = setTimeout(() => setLoadingText("Adding finishing touches..."), 12000);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, []);

  // Show error if analysis failed or SSE connection failed
  if (error || (analysis && analysis.status === 'failed')) {
    return (
      <div className="bg-[#f4f4f0] h-[200px] w-full rounded-[32px] border-2 border-dashed border-[#d6d3d1] opacity-80 relative">
        <div className="flex flex-col items-center justify-center h-full px-6 py-2.5">
          <div className="text-[16px] leading-[24px] text-red-600 font-ibm-plex-sans">
            Analysis failed. {analysis?.errorMessage || 'Please try again.'}
          </div>
        </div>
      </div>
    );
  }
  
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
