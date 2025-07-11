import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Share2, Camera } from "lucide-react";
import FacialAnalysisDisplay from "./facial-analysis-display";
import HealthScoreCard from "./health-score-card";
import ConversationalAnalysis from "./conversational-analysis";
import DetailedReports from "./detailed-reports";
import DetailedAnalysisDisplay from "./detailed-analysis-display";
import RecommendationsSection from "./recommendations-section";
import ChatResponseDisplay from "./chat-response-display";
import RawAnalysisDisplay from "./raw-analysis-display";

import type { Analysis } from "@shared/schema";

interface ResultsSectionProps {
  analysis: Analysis;
  onNewAnalysis: () => void;
}

export default function ResultsSection({ analysis, onNewAnalysis }: ResultsSectionProps) {
  const handleDownloadReport = () => {
    // TODO: Implement PDF report generation
    console.log('Download report for analysis:', analysis.id);
  };

  const handleShareWithDoctor = () => {
    // TODO: Implement sharing functionality
    console.log('Share analysis with doctor:', analysis.id);
  };

  return (
    <div className="space-y-8">
      <h3 className="text-2xl font-bold text-dark-grey">Analysis Results</h3>
      
      {/* Facial Analysis Display */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <FacialAnalysisDisplay analysis={analysis} />
        <HealthScoreCard analysis={analysis} />
      </div>
      
      {/* Conversational Analysis */}
      <ConversationalAnalysis analysis={analysis} />
      
      {/* Detailed Analysis Display */}
      <DetailedAnalysisDisplay analysis={analysis} />
      
      {/* Detailed Reports */}
      <DetailedReports analysis={analysis} />
      
      {/* Recommendations */}
      <RecommendationsSection analysis={analysis} />
      
      {/* Chat Response Display */}
      <ChatResponseDisplay analysis={analysis} />
      
      {/* Raw AI Analysis */}
      <RawAnalysisDisplay analysis={analysis} />
      

      
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button 
          onClick={handleDownloadReport}
          className="bg-medical-green hover:bg-green-600 text-white px-8 py-3"
        >
          <Download className="w-4 h-4 mr-2" />
          Download Report
        </Button>
        <Button 
          onClick={handleShareWithDoctor}
          className="bg-trust-blue hover:bg-blue-600 text-white px-8 py-3"
        >
          <Share2 className="w-4 h-4 mr-2" />
          Share with Doctor
        </Button>
        <Button 
          onClick={onNewAnalysis}
          variant="outline"
          className="border-gray-300 text-dark-grey px-8 py-3"
        >
          <Camera className="w-4 h-4 mr-2" />
          Analyze New Photo
        </Button>
      </div>
    </div>
  );
}
