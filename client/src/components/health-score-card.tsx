import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { Analysis } from "@shared/schema";

interface HealthScoreCardProps {
  analysis: Analysis;
}

export default function HealthScoreCard({ analysis }: HealthScoreCardProps) {
  const { overallScore, skinHealth, eyeHealth, circulation, symmetry } = analysis;
  
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-medical-green';
    if (score >= 80) return 'text-success-green';
    if (score >= 70) return 'text-warning-orange';
    return 'text-red-500';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'Excellent';
    if (score >= 80) return 'Good';
    if (score >= 70) return 'Fair';
    return 'Poor';
  };

  const getProgressColor = (score: number) => {
    if (score >= 90) return 'bg-medical-green';
    if (score >= 80) return 'bg-success-green';
    if (score >= 70) return 'bg-warning-orange';
    return 'bg-red-500';
  };

  // Calculate stroke offset for circular progress
  const circumference = 2 * Math.PI * 40;
  const strokeOffset = circumference - (overallScore / 100) * circumference;

  return (
    <Card className="shadow-lg">
      <CardContent className="p-6">
        <h4 className="text-lg font-semibold text-dark-grey mb-4">Overall Health Score</h4>
        
        {/* Circular Progress */}
        <div className="flex items-center justify-center mb-6">
          <div className="relative w-32 h-32">
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
              <circle 
                cx="50" 
                cy="50" 
                r="40" 
                stroke="#E5E7EB" 
                strokeWidth="8" 
                fill="none"
              />
              <circle 
                cx="50" 
                cy="50" 
                r="40" 
                stroke="#4CAF50" 
                strokeWidth="8" 
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={strokeOffset}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <span className={`text-3xl font-bold ${getScoreColor(overallScore)}`}>
                {overallScore}
              </span>
              <span className="text-sm text-gray-600">{getScoreLabel(overallScore)}</span>
            </div>
          </div>
        </div>
        
        {/* Health Metrics */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Skin Health</span>
            <div className="flex items-center gap-2">
              <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`h-2 rounded-full transition-all duration-1000 ${getProgressColor(skinHealth)}`}
                  style={{ width: `${skinHealth}%` }}
                />
              </div>
              <span className="text-sm font-medium text-dark-grey w-10">{skinHealth}%</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Eye Health</span>
            <div className="flex items-center gap-2">
              <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`h-2 rounded-full transition-all duration-1000 ${getProgressColor(eyeHealth)}`}
                  style={{ width: `${eyeHealth}%` }}
                />
              </div>
              <span className="text-sm font-medium text-dark-grey w-10">{eyeHealth}%</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Circulation</span>
            <div className="flex items-center gap-2">
              <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`h-2 rounded-full transition-all duration-1000 ${getProgressColor(circulation)}`}
                  style={{ width: `${circulation}%` }}
                />
              </div>
              <span className="text-sm font-medium text-dark-grey w-10">{circulation}%</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Symmetry</span>
            <div className="flex items-center gap-2">
              <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`h-2 rounded-full transition-all duration-1000 ${getProgressColor(symmetry)}`}
                  style={{ width: `${symmetry}%` }}
                />
              </div>
              <span className="text-sm font-medium text-dark-grey w-10">{symmetry}%</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
