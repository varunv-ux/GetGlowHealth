import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  Clock, 
  AlertTriangle, 
  Apple, 
  Shield, 
  Brain, 
  Heart,
  Eye,
  Droplets,
  Sparkles,
  Activity,
  Pill,
  Utensils,
  Moon,
  Zap,
  Target,
  MessageSquare
} from "lucide-react";
import type { Analysis } from "@shared/schema";

interface DetailedAnalysisDisplayProps {
  analysis: Analysis;
}

export default function DetailedAnalysisDisplay({ analysis }: DetailedAnalysisDisplayProps) {
  const analysisData = analysis.analysisData || {};
  const conversationalAnalysis = analysisData.conversationalAnalysis || {};
  const facialZones = analysisData.facialZoneAnalysis || {};
  const deficiencies = analysisData.deficiencyAnalysis || [];
  const foodIntolerances = analysisData.foodIntolerances || [];
  const healthRisks = analysisData.healthRisks || [];
  const emotionalState = analysisData.emotionalState || {};
  const dailyProtocol = analysisData.dailyProtocol || {};
  const estimatedAge = analysisData.estimatedAge || analysis.estimatedAge;
  const ageRange = analysisData.ageRange || `${estimatedAge}-${estimatedAge + 5} years`;

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-500';
      case 'moderate': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getLikelihoodColor = (likelihood: string) => {
    switch (likelihood) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'moderate': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-trust-blue" />
            Comprehensive Analysis Report
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          
          {/* Facial Feature Analysis */}
          {conversationalAnalysis.facialFeatureBreakdown && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-trust-blue" />
                <h3 className="text-lg font-semibold">Facial Feature Analysis</h3>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-gray-800 leading-relaxed">{conversationalAnalysis.facialFeatureBreakdown}</p>
              </div>
            </div>
          )}

          {/* Age Assessment */}
          {conversationalAnalysis.visualAgeEstimator && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-medical-green" />
                <h3 className="text-lg font-semibold">Visual Age Assessment</h3>
                <Badge variant="outline" className="ml-auto">{ageRange}</Badge>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-gray-800 leading-relaxed">{conversationalAnalysis.visualAgeEstimator}</p>
              </div>
            </div>
          )}

          {/* Facial Zone Analysis */}
          {Object.keys(facialZones).length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-trust-blue" />
                <h3 className="text-lg font-semibold">Facial Zone Analysis</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(facialZones).map(([zone, analysis]) => (
                  <Card key={zone} className="p-4">
                    <h4 className="font-semibold capitalize text-trust-blue mb-3">{zone}</h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium text-gray-600">Observation:</span>
                        <p className="text-gray-800">{analysis.observation}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Interpretation:</span>
                        <p className="text-gray-800">{analysis.interpretation}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Suggested Action:</span>
                        <p className="text-trust-blue">{analysis.suggestedAction}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Deficiency Analysis */}
          {conversationalAnalysis.deficiencyDetector && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Apple className="w-5 h-5 text-warning-orange" />
                <h3 className="text-lg font-semibold">Deficiency Analysis</h3>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <p className="text-gray-800 leading-relaxed">{conversationalAnalysis.deficiencyDetector}</p>
              </div>
              {deficiencies.length > 0 && (
                <div className="space-y-3">
                  {deficiencies.map((deficiency, index) => (
                    <Card key={index} className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Pill className="w-4 h-4 text-medical-green" />
                          <h4 className="font-semibold">{deficiency.deficiency}</h4>
                        </div>
                        <Badge className={`${getSeverityColor(deficiency.severity)} text-white`}>
                          {deficiency.severity}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                        <div>
                          <span className="font-medium text-gray-600">Visual Cue:</span>
                          <p className="text-gray-800">{deficiency.visualCue}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">Likely Symptom:</span>
                          <p className="text-gray-800">{deficiency.likelySymptom}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">Recommendation:</span>
                          <p className="text-trust-blue">{deficiency.recommendation}</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Food Intolerance Analysis */}
          {conversationalAnalysis.foodIntoleranceIdentifier && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-error-red" />
                <h3 className="text-lg font-semibold">Food Intolerance Analysis</h3>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <p className="text-gray-800 leading-relaxed">{conversationalAnalysis.foodIntoleranceIdentifier}</p>
              </div>
              {foodIntolerances.length > 0 && (
                <div className="space-y-3">
                  {foodIntolerances.map((intolerance, index) => (
                    <Card key={index} className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Utensils className="w-4 h-4 text-warning-orange" />
                          <h4 className="font-semibold capitalize">{intolerance.type}</h4>
                        </div>
                        <Badge className={getLikelihoodColor(intolerance.likelihood)}>
                          {intolerance.likelihood} likelihood
                        </Badge>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="font-medium text-gray-600">Indicators:</span>
                          <p className="text-gray-800">{intolerance.indicators}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">Recommendation:</span>
                          <p className="text-trust-blue">{intolerance.recommendation}</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Health Risk Analysis */}
          {conversationalAnalysis.healthRiskReader && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-trust-blue" />
                <h3 className="text-lg font-semibold">Health Risk Assessment</h3>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-gray-800 leading-relaxed">{conversationalAnalysis.healthRiskReader}</p>
              </div>
              {healthRisks.length > 0 && (
                <div className="space-y-3">
                  {healthRisks.map((risk, index) => (
                    <Card key={index} className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Shield className="w-4 h-4 text-error-red" />
                          <h4 className="font-semibold">{risk.risk}</h4>
                        </div>
                        <Badge className={getLikelihoodColor(risk.likelihood)}>
                          {risk.likelihood} risk
                        </Badge>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="font-medium text-gray-600">Signs:</span>
                          <p className="text-gray-800">{risk.signs}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">Prevention:</span>
                          <p className="text-trust-blue">{risk.prevention}</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Emotional State Analysis */}
          {conversationalAnalysis.emotionalStateScanner && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-500" />
                <h3 className="text-lg font-semibold">Emotional State Analysis</h3>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-gray-800 leading-relaxed">{conversationalAnalysis.emotionalStateScanner}</p>
              </div>
              {emotionalState.primaryMood && (
                <Card className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-purple-600 mb-2">Primary Mood</h4>
                      <p className="text-gray-800">{emotionalState.primaryMood}</p>
                    </div>
                    {emotionalState.stressLevel && (
                      <div>
                        <h4 className="font-semibold text-purple-600 mb-2">Stress Level</h4>
                        <div className="flex items-center gap-2">
                          <Progress value={emotionalState.stressLevel} className="flex-1" />
                          <span className="text-sm text-gray-600">{emotionalState.stressLevel}%</span>
                        </div>
                      </div>
                    )}
                  </div>
                  {emotionalState.recommendation && (
                    <div className="mt-4 pt-4 border-t">
                      <h4 className="font-semibold text-purple-600 mb-2">Recommendation</h4>
                      <p className="text-gray-800">{emotionalState.recommendation}</p>
                    </div>
                  )}
                </Card>
              )}
            </div>
          )}

          {/* Self-Healing Protocol */}
          {conversationalAnalysis.selfHealingStrategist && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-success-green" />
                <h3 className="text-lg font-semibold">Self-Healing Protocol</h3>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-gray-800 leading-relaxed">{conversationalAnalysis.selfHealingStrategist}</p>
              </div>
              {dailyProtocol.morning && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Zap className="w-4 h-4 text-warning-orange" />
                      <h4 className="font-semibold">Morning Routine</h4>
                    </div>
                    <p className="text-sm text-gray-800">{dailyProtocol.morning}</p>
                  </Card>
                  <Card className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Activity className="w-4 h-4 text-trust-blue" />
                      <h4 className="font-semibold">Afternoon Activities</h4>
                    </div>
                    <p className="text-sm text-gray-800">{dailyProtocol.afternoon}</p>
                  </Card>
                  <Card className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Moon className="w-4 h-4 text-purple-500" />
                      <h4 className="font-semibold">Evening Routine</h4>
                    </div>
                    <p className="text-sm text-gray-800">{dailyProtocol.evening}</p>
                  </Card>
                </div>
              )}
            </div>
          )}

        </CardContent>
      </Card>
    </div>
  );
}