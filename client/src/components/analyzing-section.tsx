import { useEffect, useState } from "react";

interface AnalyzingSectionProps {
  imageUrl: string;
  onStop?: () => void;
}

const analysisSteps = [
  "Analyzing facial features...",
  "Detecting patterns...",
  "Evaluating skin health...",
  "Assessing eye vitality...",
  "Checking circulation markers...",
  "Analyzing symmetry...",
  "Identifying deficiencies...",
  "Finding food intolerances...",
  "Detecting health risks...",
  "Reading emotional state...",
  "Defining daily routine...",
  "Creating supplement plan...",
  "Building nutritional guide...",
  "Adding finishing touches...",
  "Generating final report..."
];

export default function AnalyzingSection({ imageUrl, onStop }: AnalyzingSectionProps) {
  const [currentStep, setCurrentStep] = useState(0);
  
  useEffect(() => {
    // Change step every 4 seconds
    const timer = setInterval(() => {
      setCurrentStep(prev => (prev + 1) % analysisSteps.length);
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-[#f4f4f0] h-[200px] w-full rounded-[32px] relative">
      <div className="flex flex-col items-center justify-center h-full px-6 gap-6">
        <div className="flex flex-col gap-2 items-center text-center w-full">
          <div className="text-[24px] leading-[32px] text-[#79716b] font-ibm-plex-sans transition-opacity duration-500">
            {analysisSteps[currentStep]}
          </div>
          <div className="text-[12px] leading-[16px] text-[#79716b] font-ibm-plex-sans">
            estimated time 60 secs
          </div>
        </div>
        
        {onStop && (
          <button
            onClick={onStop}
            className="bg-white flex flex-row gap-2.5 items-center justify-center px-3 py-2 rounded-xl hover:bg-[#f5f5f4] transition-colors w-[120px]"
          >
            <div className="text-[14px] leading-[20px] text-[#79716b] font-ibm-plex-sans">
              Stop
            </div>
          </button>
        )}
      </div>
    </div>
  );
}
