import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
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
  Calendar,
  Target
} from "lucide-react";
import type { Analysis } from "@shared/schema";

interface DetailedAnalysisDisplayProps {
  analysis: Analysis;
}

export default function DetailedAnalysisDisplay({ analysis }: DetailedAnalysisDisplayProps) {
  const analysisData = analysis.analysisData || {};
  const facialZones = analysisData.facialZoneAnalysis || {};
  const deficiencies = analysisData.deficiencyAnalysis || [];
  const foodIntolerances = analysisData.foodIntolerances || [];
  const healthRisks = analysisData.healthRisks || [];
  const emotionalState = analysisData.emotionalState || {};
  const dailyProtocol = analysisData.dailyProtocol || {};
  const recommendations = analysis.recommendations || {};

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
        <CardContent>
          <Tabs defaultValue="facial-zones" className="w-full">
            <div className="w-full overflow-x-auto scrollbar-hide">
              <TabsList className="flex w-max md:grid md:w-full md:grid-cols-4 lg:grid-cols-7 mb-4">
                <TabsTrigger value="facial-zones" className="text-xs md:text-sm whitespace-nowrap px-2 md:px-3 py-2 flex-shrink-0">Facial Zones</TabsTrigger>
                <TabsTrigger value="deficiencies" className="text-xs md:text-sm whitespace-nowrap px-2 md:px-3 py-2 flex-shrink-0">Deficiencies</TabsTrigger>
                <TabsTrigger value="intolerances" className="text-xs md:text-sm whitespace-nowrap px-2 md:px-3 py-2 flex-shrink-0">Food Issues</TabsTrigger>
                <TabsTrigger value="health-risks" className="text-xs md:text-sm whitespace-nowrap px-2 md:px-3 py-2 flex-shrink-0">Health Risks</TabsTrigger>
                <TabsTrigger value="emotional" className="text-xs md:text-sm whitespace-nowrap px-2 md:px-3 py-2 flex-shrink-0">Emotional</TabsTrigger>
                <TabsTrigger value="protocol" className="text-xs md:text-sm whitespace-nowrap px-2 md:px-3 py-2 flex-shrink-0">Protocol</TabsTrigger>
                <TabsTrigger value="recommendations" className="text-xs md:text-sm whitespace-nowrap px-2 md:px-3 py-2 flex-shrink-0">Personal Recommendations</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="facial-zones" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(facialZones).map(([zone, analysis]) => (
                  <Card key={zone} className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <User className="w-4 h-4 text-trust-blue" />
                      <h3 className="font-semibold capitalize">{zone}</h3>
                    </div>
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
            </TabsContent>

            <TabsContent value="deficiencies" className="space-y-4">
              <div className="space-y-3">
                {deficiencies.map((deficiency, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Pill className="w-4 h-4 text-medical-green" />
                        <h3 className="font-semibold">{deficiency.deficiency}</h3>
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
            </TabsContent>

            <TabsContent value="intolerances" className="space-y-4">
              <div className="space-y-3">
                {foodIntolerances.map((intolerance, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Utensils className="w-4 h-4 text-warning-orange" />
                        <h3 className="font-semibold capitalize">{intolerance.type}</h3>
                      </div>
                      <Badge className={getLikelihoodColor(intolerance.likelihood)}>
                        {intolerance.likelihood} likelihood
                      </Badge>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium text-gray-600">Visual Markers:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {intolerance.visualMarkers.map((marker, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {marker}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Next Steps:</span>
                        <p className="text-trust-blue">{intolerance.nextSteps}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="health-risks" className="space-y-4">
              <div className="space-y-3">
                {healthRisks.map((risk, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Shield className="w-4 h-4 text-error-red" />
                      <h3 className="font-semibold">{risk.risk}</h3>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium text-gray-600">Visual Evidence:</span>
                        <p className="text-gray-800">{risk.visualEvidence}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Explanation:</span>
                        <p className="text-gray-800">{risk.explanation}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Action Steps:</span>
                        <ul className="list-disc list-inside text-trust-blue space-y-1">
                          {risk.actionSteps.map((step, i) => (
                            <li key={i}>{step}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="emotional" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Brain className="w-4 h-4 text-purple-500" />
                    <h3 className="font-semibold">Suppressed Emotions</h3>
                  </div>
                  <div className="space-y-2">
                    {emotionalState.suppressedEmotions?.map((emotion, index) => (
                      <Badge key={index} variant="outline" className="mr-2">
                        {emotion}
                      </Badge>
                    ))}
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Zap className="w-4 h-4 text-yellow-500" />
                    <h3 className="font-semibold">Stress Patterns</h3>
                  </div>
                  <div className="space-y-2">
                    {emotionalState.stressPatterns?.map((pattern, index) => (
                      <Badge key={index} variant="outline" className="mr-2">
                        {pattern}
                      </Badge>
                    ))}
                  </div>
                </Card>
              </div>

              <Card className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Heart className="w-4 h-4 text-success-green" />
                  <h3 className="font-semibold">Recommendations</h3>
                </div>
                <ul className="space-y-2 text-sm">
                  {emotionalState.recommendations?.map((rec, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-success-green rounded-full mt-2 flex-shrink-0"></div>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </TabsContent>

            <TabsContent value="protocol" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-4 h-4 text-trust-blue" />
                    <h3 className="font-semibold">Morning Routine</h3>
                  </div>
                  <ul className="space-y-1 text-sm">
                    {dailyProtocol.morning?.map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-trust-blue rounded-full mt-2 flex-shrink-0"></div>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Activity className="w-4 h-4 text-medical-green" />
                    <h3 className="font-semibold">Mid-Day Optimization</h3>
                  </div>
                  <ul className="space-y-1 text-sm">
                    {dailyProtocol.midday?.map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-medical-green rounded-full mt-2 flex-shrink-0"></div>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Moon className="w-4 h-4 text-purple-500" />
                    <h3 className="font-semibold">Evening Wind-Down</h3>
                  </div>
                  <ul className="space-y-1 text-sm">
                    {dailyProtocol.evening?.map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Heart className="w-4 h-4 text-success-green" />
                    <h3 className="font-semibold">Weekly Practices</h3>
                  </div>
                  <ul className="space-y-1 text-sm">
                    {dailyProtocol.weekly?.map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-success-green rounded-full mt-2 flex-shrink-0"></div>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Apple className="w-4 h-4 text-warning-orange" />
                    <h3 className="font-semibold">Reset Foods</h3>
                  </div>
                  <div className="space-y-1">
                    {dailyProtocol.resetFoods?.map((food, index) => (
                      <Badge key={index} variant="outline" className="mr-1 mb-1">
                        {food}
                      </Badge>
                    ))}
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Pill className="w-4 h-4 text-medical-green" />
                    <h3 className="font-semibold">Supplements</h3>
                  </div>
                  <div className="space-y-1">
                    {dailyProtocol.supplements?.map((supplement, index) => (
                      <Badge key={index} variant="outline" className="mr-1 mb-1">
                        {supplement}
                      </Badge>
                    ))}
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Brain className="w-4 h-4 text-purple-500" />
                    <h3 className="font-semibold">Mindset Shifts</h3>
                  </div>
                  <div className="space-y-1">
                    {dailyProtocol.mindsetShifts?.map((shift, index) => (
                      <Badge key={index} variant="outline" className="mr-1 mb-1">
                        {shift}
                      </Badge>
                    ))}
                  </div>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="recommendations" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Immediate Actions */}
                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Clock className="w-4 h-4 text-warning-orange" />
                    <h3 className="font-semibold">Immediate Actions</h3>
                  </div>
                  <div className="space-y-3">
                    {recommendations.immediate?.map((item, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-warning-orange rounded-full mt-2 flex-shrink-0"></div>
                        <div>
                          <p className="font-medium text-sm">{item.title}</p>
                          <p className="text-xs text-gray-600">{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Nutritional Strategies */}
                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Apple className="w-4 h-4 text-success-green" />
                    <h3 className="font-semibold">Nutritional Strategies</h3>
                  </div>
                  <div className="space-y-3">
                    {recommendations.nutritional?.map((item, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-success-green rounded-full mt-2 flex-shrink-0"></div>
                        <div>
                          <p className="font-medium text-sm">{item.title}</p>
                          <p className="text-xs text-gray-600">{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Lifestyle Adjustments */}
                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Heart className="w-4 h-4 text-trust-blue" />
                    <h3 className="font-semibold">Lifestyle Adjustments</h3>
                  </div>
                  <div className="space-y-3">
                    {recommendations.lifestyle?.map((item, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-trust-blue rounded-full mt-2 flex-shrink-0"></div>
                        <div>
                          <p className="font-medium text-sm">{item.title}</p>
                          <p className="text-xs text-gray-600">{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Long-term Healing Strategy */}
                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Target className="w-4 h-4 text-medical-green" />
                    <h3 className="font-semibold">Long-term Healing Strategy</h3>
                  </div>
                  <div className="space-y-3">
                    {recommendations.longTerm?.map((item, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-medical-green rounded-full mt-2 flex-shrink-0"></div>
                        <div>
                          <p className="font-medium text-sm">{item.title}</p>
                          <p className="text-xs text-gray-600">{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}