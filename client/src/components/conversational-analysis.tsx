import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Clock, 
  Apple, 
  AlertTriangle, 
  Shield, 
  Brain, 
  Heart,
  Target,
  MessageSquare
} from "lucide-react";
import type { Analysis } from "@shared/schema";

interface ConversationalAnalysisProps {
  analysis: Analysis;
}

export default function ConversationalAnalysis({ analysis }: ConversationalAnalysisProps) {
  const conversationalAnalysis = analysis.analysisData?.conversationalAnalysis || {};
  const estimatedAge = analysis.analysisData?.estimatedAge || analysis.estimatedAge;
  const ageRange = analysis.analysisData?.ageRange || `${estimatedAge}-${estimatedAge + 5} years`;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-dark-grey flex items-center">
          <MessageSquare className="w-6 h-6 mr-3 text-trust-blue" />
          Comprehensive Health Analysis
        </h3>
        <Badge variant="outline" className="text-sm">
          AI-Powered Assessment
        </Badge>
      </div>

      <div className="space-y-6">
        {/* Facial Analysis Section */}
        <Card className="shadow-lg border-l-4 border-l-blue-500">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-dark-grey">
              <div className="p-2 rounded-full bg-trust-blue text-white mr-3">
                <User className="w-5 h-5" />
              </div>
              Facial Analysis
              {ageRange && (
                <Badge variant="secondary" className="text-sm ml-auto">
                  {ageRange}
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Facial Feature Breakdown */}
              {conversationalAnalysis.facialFeatureBreakdown && (
                <div>
                  <h4 className="text-lg font-semibold text-dark-grey mb-3 flex items-center">
                    <User className="w-5 h-5 text-trust-blue mr-2" />
                    Facial Feature Breakdown
                  </h4>
                  <div className="prose prose-sm max-w-none">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {conversationalAnalysis.facialFeatureBreakdown}
                    </p>
                  </div>
                </div>
              )}
              
              {/* Visual Age Assessment */}
              {conversationalAnalysis.visualAgeEstimator && (
                <div>
                  <h4 className="text-lg font-semibold text-dark-grey mb-3 flex items-center">
                    <Clock className="w-5 h-5 text-medical-green mr-2" />
                    Visual Age Assessment
                  </h4>
                  <div className="prose prose-sm max-w-none">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {conversationalAnalysis.visualAgeEstimator}
                    </p>
                  </div>
                </div>
              )}
              
              {/* Deficiency Detection */}
              {conversationalAnalysis.deficiencyDetector && (
                <div>
                  <h4 className="text-lg font-semibold text-dark-grey mb-3 flex items-center">
                    <Apple className="w-5 h-5 text-warning-orange mr-2" />
                    Deficiency Detection
                  </h4>
                  <div className="prose prose-sm max-w-none">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {conversationalAnalysis.deficiencyDetector}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Food Intolerance Section */}
        {conversationalAnalysis.foodIntoleranceIdentifier && (
          <Card className="shadow-lg border-l-4 border-l-red-500">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-dark-grey">
                <div className="p-2 rounded-full bg-error-red text-white mr-3">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                Food Intolerance Identifier
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {conversationalAnalysis.foodIntoleranceIdentifier}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Health Risk Section */}
        {conversationalAnalysis.healthRiskReader && (
          <Card className="shadow-lg border-l-4 border-l-blue-500">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-dark-grey">
                <div className="p-2 rounded-full bg-trust-blue text-white mr-3">
                  <Shield className="w-5 h-5" />
                </div>
                Health Risk Reader
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {conversationalAnalysis.healthRiskReader}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Emotional State Section */}
        {conversationalAnalysis.emotionalStateScanner && (
          <Card className="shadow-lg border-l-4 border-l-purple-500">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-dark-grey">
                <div className="p-2 rounded-full bg-purple-500 text-white mr-3">
                  <Brain className="w-5 h-5" />
                </div>
                Emotional State Scanner
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {conversationalAnalysis.emotionalStateScanner}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Self-Healing Section */}
        {conversationalAnalysis.selfHealingStrategist && (
          <Card className="shadow-lg border-l-4 border-l-green-500">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-dark-grey">
                <div className="p-2 rounded-full bg-success-green text-white mr-3">
                  <Heart className="w-5 h-5" />
                </div>
                Self-Healing Strategist
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {conversationalAnalysis.selfHealingStrategist}
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-semibold text-dark-grey mb-2 flex items-center">
          <Target className="w-4 h-4 mr-2 text-trust-blue" />
          How to Use This Analysis
        </h4>
        <p className="text-sm text-gray-600">
          This comprehensive analysis provides a complete view of your facial health in one unified report. 
          Start with the Facial Analysis for overall insights, review Food Intolerance and Health Risk assessments 
          for immediate health improvements, and follow the Self-Healing Strategy for long-term wellness optimization.
        </p>
      </div>
    </div>
  );
}