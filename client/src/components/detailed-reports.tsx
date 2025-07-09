import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, CheckCircle, Info, Lightbulb } from "lucide-react";
import type { Analysis } from "@shared/schema";

interface DetailedReportsProps {
  analysis: Analysis;
}

export default function DetailedReports({ analysis }: DetailedReportsProps) {
  const { analysisData } = analysis;
  const skinAnalysis = analysisData.skinAnalysis || {};
  const eyeAnalysis = analysisData.eyeAnalysis || {};
  const circulationAnalysis = analysisData.circulationAnalysis || {};

  const getStatusColor = (status: string) => {
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

  const getStatusIcon = (status: string) => {
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

  const formatStatus = (status: string) => {
    return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {/* Skin Health Card */}
      <Card className="shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h5 className="text-lg font-semibold text-dark-grey">Skin Health</h5>
            <div className="flex items-center">
              <AlertTriangle className="w-4 h-4 text-warning-orange mr-1" />
              <span className="text-sm font-medium text-warning-orange">Minor Issues</span>
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
          
          <div className="mt-4 p-3 bg-orange-50 rounded-lg">
            <p className="text-sm text-gray-700">
              <Lightbulb className="w-4 h-4 text-warning-orange mr-2 inline" />
              Consider using sunscreen daily to prevent further pigmentation.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Eye Health Card */}
      <Card className="shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h5 className="text-lg font-semibold text-dark-grey">Eye Health</h5>
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 text-success-green mr-1" />
              <span className="text-sm font-medium text-success-green">Excellent</span>
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
          </div>
          
          <div className="mt-4 p-3 bg-green-50 rounded-lg">
            <p className="text-sm text-gray-700">
              <CheckCircle className="w-4 h-4 text-success-green mr-2 inline" />
              Your eyes show excellent health indicators. Keep up the good work!
            </p>
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
              <span className="text-sm font-medium text-trust-blue">Normal</span>
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
          
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-700">
              <Info className="w-4 h-4 text-trust-blue mr-2 inline" />
              Regular exercise can further improve circulation and skin health.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
