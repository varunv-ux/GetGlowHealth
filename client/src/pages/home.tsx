import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User, ChevronDown } from "lucide-react";
import { Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import FigmaUploadSection from "@/components/figma-upload-section";
import ProcessingSection from "@/components/processing-section";
import ResultsSection from "@/components/results-section";
import type { Analysis } from "@shared/schema";

interface User {
  firstName?: string;
  email?: string;
  profileImageUrl?: string;
}

export default function Home() {
  const { user } = useAuth();
  const typedUser = user as User | undefined;
  const [currentStep, setCurrentStep] = useState<'upload' | 'processing' | 'results'>('upload');
  const [analysisId, setAnalysisId] = useState<number | null>(null);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  
  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  const handleUploadComplete = (id: number) => {
    setAnalysisId(id);
    setCurrentStep('processing');
  };

  const handleAnalysisComplete = (analysisData: Analysis) => {
    setAnalysis(analysisData);
    setCurrentStep('results');
  };

  const handleNewAnalysis = () => {
    setCurrentStep('upload');
    setAnalysisId(null);
    setAnalysis(null);
  };

  if (currentStep === 'processing' && analysisId) {
    return (
      <ProcessingSection 
        analysisId={analysisId} 
        onAnalysisComplete={handleAnalysisComplete}
      />
    );
  }

  if (currentStep === 'results' && analysis) {
    return (
      <ResultsSection 
        analysis={analysis} 
        onNewAnalysis={handleNewAnalysis}
      />
    );
  }

  return (
    <div 
      className="bg-white flex flex-col min-h-screen rounded-[32px] overflow-hidden"
      style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
    >
      {/* Header */}
      <div className="h-[66px] w-full relative">
        <div className="flex flex-row items-center h-full">
          <div className="flex flex-row items-center justify-between px-6 py-3 w-full h-[66px]">
            {/* Logo */}
            <div className="flex flex-row gap-2 items-center justify-center">
              <div className="text-[24px] font-bold leading-[28px] text-[#0c0a09] font-es-rebond">
                GetGlow
              </div>
            </div>
            
            {/* Navigation - Centered */}
            <div className="absolute left-1/2 top-3 -translate-x-1/2 flex flex-row gap-3 items-center justify-start">
              <div className="flex flex-col gap-2.5 items-start justify-start p-[3px] rounded-2xl border border-[#f5f5f4]">
                <div className="flex flex-row items-center justify-start rounded-xl">
                  <div className="bg-[#f5f5f4] flex flex-row gap-2.5 items-center justify-center px-3 py-2 rounded-xl">
                                         <div className="text-[14px] leading-[20px] text-[#0c0a09] font-ibm-plex-sans">
                       Analyze
                     </div>
                  </div>
                  <Link href="/history">
                    <div className="flex flex-row gap-2.5 items-center justify-center px-3 py-2 rounded-xl cursor-pointer hover:bg-[#f5f5f4]">
                                             <div className="text-[14px] leading-[20px] text-[#a6a09b] font-ibm-plex-sans">
                         Reports
                       </div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Right side - Upgrade + Profile */}
            <div className="flex flex-row gap-4 h-10 items-center justify-end">
              {/* Upgrade Button */}
              <div className="bg-[#f4f4f0] flex flex-row gap-0.5 h-10 items-center justify-start pl-2 pr-3 py-1 rounded-2xl opacity-80">
                <div className="w-6 h-6 flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 2L10 6H14L11 9L12 14L8 11L4 14L5 9L2 6H6L8 2Z" fill="#57534d"/>
                  </svg>
                </div>
                                 <div className="text-[12px] leading-[20px] text-[#57534d] font-ibm-plex-sans">
                   Upgrade
                 </div>
              </div>
              
                             {/* Profile */}
               {typedUser && (
                 <DropdownMenu>
                   <DropdownMenuTrigger asChild>
                     <div className="w-10 h-10 cursor-pointer">
                       <Avatar className="w-full h-full">
                         <AvatarImage src={typedUser.profileImageUrl} alt={typedUser.firstName || 'User'} />
                         <AvatarFallback className="bg-[#f4f4f0] text-[#57534d]">
                           {typedUser.firstName?.charAt(0) || typedUser.email?.charAt(0) || <User className="w-4 h-4" />}
                         </AvatarFallback>
                       </Avatar>
                     </div>
                   </DropdownMenuTrigger>
                   <DropdownMenuContent align="end" className="w-48">
                     <DropdownMenuLabel>
                       <div className="flex flex-col space-y-1">
                         <p className="text-sm font-medium leading-none">
                           {typedUser.firstName || 'User'}
                         </p>
                         <p className="text-xs leading-none text-muted-foreground">
                           {typedUser.email}
                         </p>
                       </div>
                     </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={handleLogout}
                      className="text-red-600 focus:text-red-600 focus:bg-red-50"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 w-full">
        <div className="flex flex-col items-center justify-center h-full">
                     <div className="flex flex-col gap-10 items-center justify-center px-4 sm:px-8 md:px-16 lg:px-[411px] py-8 sm:py-16 md:py-24 lg:py-[180px] w-full h-full">
                         <div className="flex flex-col gap-8 items-center justify-start p-[20px] w-full max-w-[393px]">
              {/* Content Container */}
              <div className="w-full">
                <div className="flex flex-col items-center">
                  <div className="flex flex-col gap-4 items-center justify-start px-6 py-0 w-full">
                                         {/* Face Video */}
                     <div className="w-[200px] h-[200px] relative overflow-hidden rounded-full">
                       <video
                         autoPlay
                         loop
                         muted
                         playsInline
                         className="w-full h-full object-cover"
                       >
                         <source src="/Facevideo.mp4" type="video/mp4" />
                         <img
                           alt="AI Face Analysis"
                           className="w-full h-full object-cover"
                           src="/face-analysis-video.png"
                         />
                       </video>
                     </div>
                    
                                         {/* Title */}
                     <div className="text-[28px] leading-[32px] text-center text-black font-semibold whitespace-nowrap font-es-rebond">
                       AI powered facial
                     </div>
                     <div className="text-[28px] leading-[32px] text-center text-black font-semibold whitespace-nowrap -mt-1 font-es-rebond">
                       health analysis
                     </div>
                     
                     {/* Description */}
                     <div className="text-[16px] leading-[24px] text-center text-[#79716b] max-w-[350px] font-ibm-plex-sans">
                       Get comprehensive health insights, recommendations to improve your health
                     </div>
                  </div>
                </div>
              </div>
              
              {/* Button Container */}
              <div className="flex flex-col gap-6 items-center justify-start w-full">
                                 {/* Upload Button */}
                 <div className="flex flex-row gap-4 items-start justify-start w-full">
                   <FigmaUploadSection onUploadComplete={handleUploadComplete} />
                 </div>
                
                                 {/* Photo Guidelines Button */}
                 <div className="bg-white flex flex-row gap-2 items-center justify-center px-3 py-2 rounded-2xl border border-[#f5f5f4]">
                   <div className="text-[12px] leading-[16px] text-[#a6a09b] font-ibm-plex-sans">
                     Photo guidelines
                   </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
