import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, CheckCircle, Info, Lightbulb, Calendar, Apple, Brain, Heart, Shield } from "lucide-react";
import type { Analysis } from "@shared/schema";

interface DetailedReportsProps {
  analysis: Analysis;
}

export default function DetailedReports({ analysis }: DetailedReportsProps) {
  const { analysisData } = analysis;
  const skinAnalysis = analysisData.skinAnalysis || {};
  const eyeAnalysis = analysisData.eyeAnalysis || {};
  const circulationAnalysis = analysisData.circulationAnalysis || {};
  const nutritionalInsights = analysisData.nutritionalInsights || {};
  const emotionalStateReading = analysisData.emotionalStateReading || {};
  const healthRiskAssessment = analysisData.healthRiskAssessment || {};
  const intoleranceSignals = analysisData.intoleranceSignals || {};
  const estimatedAge = analysisData.estimatedAge;

  const getStatusColor = (status: string | undefined) => {
    if (!status) return 'text-gray-500';
    switch (status) {
      case 'excellent':
      case 'perfect':
      case 'high':
      case 'healthy':
      case 'smooth':
      case 'good':
      case 'minimal':
      case 'none':
      case 'normal':
      case 'even':
        return 'text-success-green';
      case 'minor_spots':
      case 'minor_issues':
        return 'text-warning-orange';
      default:
        return 'text-trust-blue';
    }
  };

  const getStatusIcon = (status: string | undefined) => {
    if (!status) return <Info className="w-4 h-4 text-gray-500" />;
    switch (status) {
      case 'excellent':
      case 'perfect':
      case 'high':
      case 'healthy':
      case 'smooth':
      case 'good':
      case 'minimal':
      case 'none':
      case 'normal':
      case 'even':
        return <CheckCircle className="w-4 h-4 text-success-green" />;
      case 'minor_spots':
      case 'minor_issues':
        return <AlertTriangle className="w-4 h-4 text-warning-orange" />;
      default:
        return <Info className="w-4 h-4 text-trust-blue" />;
    }
  };

  const formatStatus = (status: string | undefined) => {
    if (!status) return 'N/A';
    return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {/* Age Analysis Card */}
      <Card className="shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h5 className="text-lg font-semibold text-dark-grey flex items-center">
              <Calendar className="w-5 h-5 text-trust-blue mr-2" />
              Age Analysis
            </h5>
            <div className="text-2xl font-bold text-trust-blue">
              {estimatedAge || 'N/A'}
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="text-sm text-gray-600 mb-2">Aging Signs Detected:</div>
            {skinAnalysis.agingSignsDetected?.map((sign, index) => (
              <div key={index} className="flex items-center">
                <Info className="w-3 h-3 text-warning-orange mr-2" />
                <span className="text-sm">{sign}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Skin Health Card */}
      <Card className="shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h5 className="text-lg font-semibold text-dark-grey">Skin Health</h5>
            <div className="flex items-center">
              <AlertTriangle className="w-4 h-4 text-warning-orange mr-1" />
              <span className="text-sm font-medium text-warning-orange">Analysis</span>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Hydration Level</span>
              <span className={`text-sm font-medium ${getStatusColor(skinAnalysis.hydration)}`}>
                {formatStatus(skinAnalysis.hydration)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Pigmentation</span>
              <span className={`text-sm font-medium ${getStatusColor(skinAnalysis.pigmentation)}`}>
                {formatStatus(skinAnalysis.pigmentation)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Texture</span>
              <span className={`text-sm font-medium ${getStatusColor(skinAnalysis.texture)}`}>
                {formatStatus(skinAnalysis.texture)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Elasticity</span>
              <span className={`text-sm font-medium ${getStatusColor(skinAnalysis.elasticity)}`}>
                {formatStatus(skinAnalysis.elasticity)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Eye Health Card */}
      <Card className="shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h5 className="text-lg font-semibold text-dark-grey">Eye Health</h5>
            <div className="flex items-center">
              <Info className="w-4 h-4 text-trust-blue mr-1" />
              <span className="text-sm font-medium text-trust-blue">Analysis</span>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Under-eye Circles</span>
              <span className={`text-sm font-medium ${getStatusColor(eyeAnalysis.underEyeCircles)}`}>
                {formatStatus(eyeAnalysis.underEyeCircles)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Puffiness</span>
              <span className={`text-sm font-medium ${getStatusColor(eyeAnalysis.puffiness)}`}>
                {formatStatus(eyeAnalysis.puffiness)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Brightness</span>
              <span className={`text-sm font-medium ${getStatusColor(eyeAnalysis.brightness)}`}>
                {formatStatus(eyeAnalysis.brightness)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Symmetry</span>
              <span className={`text-sm font-medium ${getStatusColor(eyeAnalysis.symmetry)}`}>
                {formatStatus(eyeAnalysis.symmetry)}
              </span>
            </div>
            {eyeAnalysis.fatigueSignals && eyeAnalysis.fatigueSignals.length > 0 && (
              <div className="mt-3">
                <div className="text-sm text-gray-600 mb-2">Fatigue Signals:</div>
                {eyeAnalysis.fatigueSignals.map((signal, index) => (
                  <div key={index} className="flex items-center">
                    <Info className="w-3 h-3 text-warning-orange mr-2" />
                    <span className="text-sm">{signal}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Nutritional Insights Card */}
      <Card className="shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h5 className="text-lg font-semibold text-dark-grey flex items-center">
              <Apple className="w-5 h-5 text-success-green mr-2" />
              Nutritional Insights
            </h5>
          </div>
          
          <div className="space-y-3">
            <div className="text-sm text-gray-600 mb-2">Possible Deficiencies:</div>
            {nutritionalInsights.possibleDeficiencies?.map((deficiency, index) => (
              <div key={index} className="flex items-center">
                <AlertTriangle className="w-3 h-3 text-warning-orange mr-2" />
                <span className="text-sm">{deficiency}</span>
              </div>
            ))}
            <div className="text-sm text-gray-600 mb-2 mt-3">Healing Foods:</div>
            {nutritionalInsights.healingFoods?.map((food, index) => (
              <div key={index} className="flex items-center">
                <CheckCircle className="w-3 h-3 text-success-green mr-2" />
                <span className="text-sm">{food}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Emotional State Card */}
      <Card className="shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h5 className="text-lg font-semibold text-dark-grey flex items-center">
              <Brain className="w-5 h-5 text-trust-blue mr-2" />
              Emotional State
            </h5>
          </div>
          
          <div className="space-y-3">
            <div className="text-sm text-gray-600 mb-2">Stress Patterns:</div>
            {emotionalStateReading.stressPatterns?.map((pattern, index) => (
              <div key={index} className="flex items-center">
                <Info className="w-3 h-3 text-warning-orange mr-2" />
                <span className="text-sm">{pattern}</span>
              </div>
            ))}
            <div className="text-sm text-gray-600 mb-2 mt-3">Tension Areas:</div>
            {emotionalStateReading.tensionAreas?.map((area, index) => (
              <div key={index} className="flex items-center">
                <AlertTriangle className="w-3 h-3 text-warning-orange mr-2" />
                <span className="text-sm">{area}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Health Risk Assessment Card */}
      <Card className="shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h5 className="text-lg font-semibold text-dark-grey flex items-center">
              <Shield className="w-5 h-5 text-medical-green mr-2" />
              Health Risk Assessment
            </h5>
          </div>
          
          <div className="space-y-3">
            <div className="text-sm text-gray-600 mb-2">Hormonal Indicators:</div>
            {healthRiskAssessment.hormonalIndicators?.map((indicator, index) => (
              <div key={index} className="flex items-center">
                <Info className="w-3 h-3 text-trust-blue mr-2" />
                <span className="text-sm">{indicator}</span>
              </div>
            ))}
            <div className="text-sm text-gray-600 mb-2 mt-3">Sleep Quality Clues:</div>
            {healthRiskAssessment.sleepQualityClues?.map((clue, index) => (
              <div key={index} className="flex items-center">
                <AlertTriangle className="w-3 h-3 text-warning-orange mr-2" />
                <span className="text-sm">{clue}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Circulation Card */}
      <Card className="shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h5 className="text-lg font-semibold text-dark-grey">Circulation</h5>
            <div className="flex items-center">
              <Info className="w-4 h-4 text-trust-blue mr-1" />
              <span className="text-sm font-medium text-trust-blue">Analysis</span>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Facial Flush</span>
              <span className={`text-sm font-medium ${getStatusColor(circulationAnalysis.facialFlush)}`}>
                {formatStatus(circulationAnalysis.facialFlush)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Lip Color</span>
              <span className={`text-sm font-medium ${getStatusColor(circulationAnalysis.lipColor)}`}>
                {formatStatus(circulationAnalysis.lipColor)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Capillary Health</span>
              <span className={`text-sm font-medium ${getStatusColor(circulationAnalysis.capillaryHealth)}`}>
                {formatStatus(circulationAnalysis.capillaryHealth)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Overall Tone</span>
              <span className={`text-sm font-medium ${getStatusColor(circulationAnalysis.overallTone)}`}>
                {formatStatus(circulationAnalysis.overallTone)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
