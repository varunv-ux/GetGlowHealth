import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { 
  ArrowLeft, 
  Clock, 
  FileImage, 
  TrendingUp, 
  Download,
  RotateCcw,
  Eye,
  Heart,
  Droplets,
  Sparkles,
  ImageOff
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { Analysis } from "@shared/schema";

import HealthScoreCard from "@/components/health-score-card";
import FacialAnalysisDisplay from "@/components/facial-analysis-display";
import ConversationalAnalysis from "@/components/conversational-analysis";
import DetailedReports from "@/components/detailed-reports";
import DetailedAnalysisDisplay from "@/components/detailed-analysis-display";
import RecommendationsSection from "@/components/recommendations-section";
import ChatResponseDisplay from "@/components/chat-response-display";
import RawAnalysisDisplay from "@/components/raw-analysis-display";
import AnalysisChat from "@/components/analysis-chat";

export default function AnalysisPage() {
  const { id } = useParams<{ id: string }>();
  const [imageError, setImageError] = useState(false);
  
  const { data: analysis, isLoading, error } = useQuery({
    queryKey: ['/api/analysis', id],
    queryFn: async () => {
      const res = await fetch(`/api/analysis/${id}`);
      if (!res.ok) throw new Error('Failed to fetch analysis');
      return res.json() as Analysis;
    },
    enabled: !!id
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-48 w-full" />
            </div>
            <div className="space-y-6">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-48 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <Link href="/history">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to History
              </Button>
            </Link>
          </div>
          <Card className="p-8 text-center">
            <div className="text-red-500 mb-4">
              <RotateCcw className="h-12 w-12 mx-auto" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Analysis Not Found</h2>
            <p className="text-gray-600 mb-4">The requested analysis could not be found</p>
            <Link href="/history">
              <Button>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to History
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
            <Link href="/history">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to History
              </Button>
            </Link>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
              <Badge variant="outline" className="text-xs sm:text-sm">
                Overall Score: {analysis.overallScore}%
              </Badge>
              <Badge variant="secondary" className="text-xs sm:text-sm">
                {formatDistanceToNow(new Date(analysis.createdAt), { addSuffix: true })}
              </Badge>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center">
              {imageError ? (
                <ImageOff className="w-8 h-8 text-gray-400" />
              ) : (
                <img 
                  src={analysis.imageUrl} 
                  alt={analysis.fileName}
                  className="w-full h-full object-cover"
                  onError={() => setImageError(true)}
                />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">{analysis.fileName}</h1>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{formatDistanceToNow(new Date(analysis.createdAt), { addSuffix: true })}</span>
                </div>
                {analysis.analysisData?.imageProcessing && (
                  <div className="flex items-center gap-1">
                    <FileImage className="h-3 w-3" />
                    <span>{analysis.analysisData.imageProcessing.originalSize}</span>
                    {analysis.analysisData.imageProcessing.wasResized && (
                      <Badge variant="secondary" className="text-xs ml-1">
                        Optimized
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Health Scores Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
            <div className="text-center p-3 sm:p-4 bg-white rounded-lg shadow-sm">
              <div className="flex items-center justify-center gap-1 sm:gap-2 mb-2">
                <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-trust-blue" />
                <span className="text-xs sm:text-sm font-medium text-gray-600">Skin Health</span>
              </div>
              <div className="text-lg sm:text-2xl font-bold text-trust-blue">
                {analysis.skinHealth}%
              </div>
            </div>
            <div className="text-center p-3 sm:p-4 bg-white rounded-lg shadow-sm">
              <div className="flex items-center justify-center gap-1 sm:gap-2 mb-2">
                <Eye className="h-3 w-3 sm:h-4 sm:w-4 text-medical-green" />
                <span className="text-xs sm:text-sm font-medium text-gray-600">Eye Health</span>
              </div>
              <div className="text-lg sm:text-2xl font-bold text-medical-green">
                {analysis.eyeHealth}%
              </div>
            </div>
            <div className="text-center p-3 sm:p-4 bg-white rounded-lg shadow-sm">
              <div className="flex items-center justify-center gap-1 sm:gap-2 mb-2">
                <Droplets className="h-3 w-3 sm:h-4 sm:w-4 text-error-red" />
                <span className="text-xs sm:text-sm font-medium text-gray-600">Circulation</span>
              </div>
              <div className="text-lg sm:text-2xl font-bold text-error-red">
                {analysis.circulation}%
              </div>
            </div>
            <div className="text-center p-3 sm:p-4 bg-white rounded-lg shadow-sm">
              <div className="flex items-center justify-center gap-1 sm:gap-2 mb-2">
                <Heart className="h-3 w-3 sm:h-4 sm:w-4 text-purple-500" />
                <span className="text-xs sm:text-sm font-medium text-gray-600">Symmetry</span>
              </div>
              <div className="text-lg sm:text-2xl font-bold text-purple-500">
                {analysis.symmetry}%
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
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
          
          {/* AI Chat Interface */}
          <AnalysisChat analysis={analysis} />
          
          {/* Analysis Metadata */}
          <Card>
              <CardHeader>
                <CardTitle className="text-lg">Analysis Details</CardTitle>
                <CardDescription>Technical information about this analysis</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Analysis ID:</span>
                    <div className="font-mono text-xs">{analysis.id}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Created:</span>
                    <div className="text-xs">{new Date(analysis.createdAt).toLocaleString()}</div>
                  </div>
                  {analysis.originalDimensions && (
                    <div>
                      <span className="text-gray-600">Original Size:</span>
                      <div className="text-xs">{analysis.originalDimensions}</div>
                    </div>
                  )}
                  {analysis.processedDimensions && (
                    <div>
                      <span className="text-gray-600">Processed Size:</span>
                      <div className="text-xs">{analysis.processedDimensions}</div>
                    </div>
                  )}
                </div>
                
                {analysis.analysisData?.imageProcessing && (
                  <div className="pt-4 border-t">
                    <div className="text-sm text-gray-600 mb-2">Image Processing:</div>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span>Original Size:</span>
                        <span>{analysis.analysisData.imageProcessing.originalSize}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Processed Size:</span>
                        <span>{analysis.analysisData.imageProcessing.processedSize}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Compression:</span>
                        <span>{analysis.analysisData.imageProcessing.compressionRatio}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Optimized:</span>
                        <span>{analysis.analysisData.imageProcessing.wasResized ? 'Yes' : 'No'}</span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}