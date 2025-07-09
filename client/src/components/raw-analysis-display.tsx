import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Code, Clock, Zap } from "lucide-react";
import type { Analysis } from "@shared/schema";

interface RawAnalysisDisplayProps {
  analysis: Analysis;
}

export default function RawAnalysisDisplay({ analysis }: RawAnalysisDisplayProps) {
  const rawAnalysis = analysis.analysisData?.rawAnalysis;
  
  if (!rawAnalysis) {
    return null;
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <Card className="shadow-lg">
      <CardContent className="p-8">
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-xl font-semibold text-dark-grey flex items-center">
            <Code className="w-5 h-5 text-trust-blue mr-2" />
            Raw AI Analysis
          </h4>
          <Badge variant="outline" className="text-trust-blue border-trust-blue">
            OpenAI GPT-4o
          </Badge>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="flex items-center space-x-2">
            <Zap className="w-4 h-4 text-success-green" />
            <span className="text-sm text-gray-600">Model:</span>
            <span className="text-sm font-medium">{rawAnalysis.model}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-warning-orange" />
            <span className="text-sm text-gray-600">Analyzed:</span>
            <span className="text-sm font-medium">{formatTimestamp(rawAnalysis.responseTime)}</span>
          </div>
          
          {rawAnalysis.usage && (
            <div className="flex items-center space-x-2">
              <Code className="w-4 h-4 text-trust-blue" />
              <span className="text-sm text-gray-600">Tokens:</span>
              <span className="text-sm font-medium">{rawAnalysis.usage.total_tokens}</span>
            </div>
          )}
        </div>

        <div className="bg-gray-50 rounded-lg p-4 border">
          <h5 className="text-sm font-medium text-gray-700 mb-3">Complete OpenAI Response:</h5>
          <pre className="text-xs text-gray-600 whitespace-pre-wrap overflow-x-auto max-h-96 overflow-y-auto">
            {JSON.stringify(JSON.parse(rawAnalysis.fullResponse), null, 2)}
          </pre>
        </div>
        
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-gray-700">
            <Code className="w-4 h-4 text-trust-blue mr-2 inline" />
            This raw analysis shows the complete, unfiltered response from OpenAI's GPT-4o vision model. 
            No mock or placeholder data is used - all insights come directly from AI analysis of your image.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}