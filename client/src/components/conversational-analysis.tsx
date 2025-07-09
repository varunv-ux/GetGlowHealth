import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
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

  const analysisCards = [
    {
      id: "facialFeatureBreakdown",
      title: "Facial Feature Breakdown",
      icon: <User className="w-5 h-5" />,
      color: "bg-trust-blue",
      content: conversationalAnalysis.facialFeatureBreakdown
    },
    {
      id: "visualAgeEstimator",
      title: "Visual Age Assessment",
      icon: <Clock className="w-5 h-5" />,
      color: "bg-medical-green",
      content: conversationalAnalysis.visualAgeEstimator,
      badge: ageRange
    },
    {
      id: "deficiencyDetector",
      title: "Deficiency Detector",
      icon: <Apple className="w-5 h-5" />,
      color: "bg-warning-orange",
      content: conversationalAnalysis.deficiencyDetector
    },
    {
      id: "foodIntoleranceIdentifier",
      title: "Food Intolerance Identifier",
      icon: <AlertTriangle className="w-5 h-5" />,
      color: "bg-error-red",
      content: conversationalAnalysis.foodIntoleranceIdentifier
    },
    {
      id: "healthRiskReader",
      title: "Health Risk Reader",
      icon: <Shield className="w-5 h-5" />,
      color: "bg-trust-blue",
      content: conversationalAnalysis.healthRiskReader
    },
    {
      id: "emotionalStateScanner",
      title: "Emotional State Scanner",
      icon: <Brain className="w-5 h-5" />,
      color: "bg-purple-500",
      content: conversationalAnalysis.emotionalStateScanner
    },
    {
      id: "selfHealingStrategist",
      title: "Self-Healing Strategist",
      icon: <Heart className="w-5 h-5" />,
      color: "bg-success-green",
      content: conversationalAnalysis.selfHealingStrategist
    }
  ];

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

      <Tabs defaultValue="faceAnalyst" className="w-full">
        <div className="w-full overflow-x-auto">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-7 min-w-max">
            {analysisCards.map((card) => (
              <TabsTrigger
                key={card.id}
                value={card.id}
                className="text-xs md:text-sm px-1 md:px-2 py-1 whitespace-nowrap"
              >
                <div className="flex items-center space-x-1">
                  {card.icon}
                  <span className="hidden md:inline lg:inline">{card.title.split(' ')[0]}</span>
                </div>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {analysisCards.map((card) => (
          <TabsContent key={card.id} value={card.id} className="mt-6">
            <Card className="shadow-lg border-l-4" style={{ borderLeftColor: card.color.replace('bg-', '') }}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center text-dark-grey">
                    <div className={`p-2 rounded-full ${card.color} text-white mr-3`}>
                      {card.icon}
                    </div>
                    {card.title}
                  </CardTitle>
                  {card.badge && (
                    <Badge variant="secondary" className="text-sm">
                      {card.badge}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px] pr-4">
                  {card.content ? (
                    <div className="prose prose-sm max-w-none">
                      <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {card.content}
                      </p>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-32 text-gray-500">
                      <div className="text-center">
                        <Target className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p>Analysis not available for this section</p>
                      </div>
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-semibold text-dark-grey mb-2 flex items-center">
          <Target className="w-4 h-4 mr-2 text-trust-blue" />
          How to Use This Analysis
        </h4>
        <p className="text-sm text-gray-600">
          Each tab provides a different perspective on your facial health. Start with the Face Analysis for overall insights, 
          then explore Deficiency Detection and Health Risk Assessment for actionable health improvements. 
          The Self-Healing Strategy tab offers comprehensive recommendations for long-term wellness.
        </p>
      </div>
    </div>
  );
}