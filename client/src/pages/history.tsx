import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { useState } from "react";
import type { Analysis } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";
import AIChatPanel from "@/components/ai-chat-panel";

// ChatSparkle icon component from Figma
interface ChatSparkleProps {
  size?: "16" | "20" | "24" | "28" | "32" | "48";
  theme?: "Regular" | "Filled";
}

function ChatSparkle({ size = "20", theme = "Regular" }: ChatSparkleProps) {
  return (
    <div className="relative size-full">
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="block max-w-none size-full"
      >
        <path
          d="M10 2L12.09 6.26L17 8L12.09 9.74L10 14L7.91 9.74L3 8L7.91 6.26L10 2Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
          fill={theme === "Filled" ? "currentColor" : "none"}
        />
        <path
          d="M14 3L15.5 5.5L18 7L15.5 8.5L14 11L12.5 8.5L10 7L12.5 5.5L14 3Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
          fill={theme === "Filled" ? "currentColor" : "none"}
        />
      </svg>
    </div>
  );
}

export default function HistoryPage() {
  const [activeTab, setActiveTab] = useState("summary");
  const [selectedAnalysisId, setSelectedAnalysisId] = useState<number | null>(null);
  const [showAIChat, setShowAIChat] = useState(false);
  
  const { data: analyses, isLoading, error } = useQuery({
    queryKey: ['/api/history'],
    queryFn: async () => {
      const res = await fetch('/api/history');
      if (!res.ok) {
        throw new Error('Failed to fetch history');
      }
      return res.json();
    }
  });

  const { data: selectedAnalysis } = useQuery({
    queryKey: ['/api/analysis', selectedAnalysisId],
    queryFn: async () => {
      if (!selectedAnalysisId) return null;
      const res = await fetch(`/api/analysis/${selectedAnalysisId}`);
      if (!res.ok) {
        throw new Error('Failed to fetch analysis');
      }
      return res.json();
    },
    enabled: !!selectedAnalysisId
  });

  // Auto-select first analysis if none selected
  if (analyses && analyses.length > 0 && !selectedAnalysisId) {
    setSelectedAnalysisId(analyses[0].id);
  }

  const tabs = [
    { id: "summary", label: "Summary" },
    { id: "face-analysis", label: "Face analysis" },
    { id: "health-risk", label: "Health risk" },
    { id: "food-intolerance", label: "Food intolerance" },
    { id: "nutrient-deficiencies", label: "Nutrient Deficiencies" },
    { id: "routine", label: "Routine" },
    { id: "recommendations", label: "Recommendations" },
    { id: "admin", label: "Admin" }
  ];

  if (isLoading) {
    return (
      <div className="bg-white min-h-screen">
        <div className="h-16 border-b border-[#f5f5f4] flex items-center justify-center">
          <div className="text-[24px] font-bold font-es-rebond text-[#0c0a09]">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white box-border flex flex-col min-h-screen overflow-clip rounded-[32px]">
      {/* Header */}
      <div className="h-[66px] w-full">
        <div className="flex flex-row items-center size-full">
          <div className="box-border flex flex-row h-[66px] items-center justify-between px-6 py-3 w-full">
            {/* Logo */}
            <div className="flex flex-row gap-2 items-center justify-center">
              <div className="text-[24px] font-bold leading-[28px] text-[#0c0a09] font-es-rebond">
                GetGlow
              </div>
            </div>

            {/* Profile Avatar */}
            <div className="flex flex-row gap-4 h-10 items-center justify-end">
              <div className="size-10">
                <div className="w-10 h-10 bg-[#f5f5f4] rounded-full"></div>
              </div>
            </div>

            {/* Navigation Container - Centered */}
            <div className="absolute flex flex-row gap-3 items-center justify-start left-1/2 top-3 -translate-x-1/2">
              <div className="flex flex-col gap-2.5 items-start justify-start p-[3px] rounded-2xl border border-[#f5f5f4]">
                <div className="flex flex-row gap-0.5 items-center justify-start rounded-xl">
                  <Link href="/">
                    <div className="bg-white flex flex-row gap-2.5 items-center justify-center px-3 py-2 rounded-xl cursor-pointer hover:bg-[#f5f5f4]">
                      <div className="text-[14px] leading-[20px] text-[#a6a09b] font-ibm-plex-sans">
                        Analyze
                      </div>
                    </div>
                  </Link>
                  <div className="bg-[#f5f5f4] flex flex-row gap-2.5 items-center justify-center px-3 py-2 rounded-xl">
                    <div className="text-[14px] leading-[20px] text-[#0c0a09] font-ibm-plex-sans">
                      Reports
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-[#f4f4f0] rounded-[32px] min-h-0">
        <div className="flex flex-col items-center justify-start size-full">
          <div className="flex flex-col gap-5 items-center justify-start p-[20px] size-full">
            <div className="flex-1 flex flex-row gap-5 items-start justify-center min-h-0 w-full">
              
              {/* Left Sidebar - Reports List */}
              <div className="bg-white h-full max-w-[393px] min-w-[360px] rounded-3xl">
                <div className="max-w-inherit min-w-inherit overflow-clip size-full">
                  <div className="flex flex-col gap-6 items-start justify-start max-w-inherit min-w-inherit p-[20px] size-full">
                    
                    {/* Sidebar Header */}
                    <div className="flex flex-row items-center justify-between w-full">
                      <div className="text-[24px] font-bold leading-[28px] text-[#0c0a09] font-es-rebond">
                        Reports
                      </div>
                      <div 
                        className="bg-[#f4f4f0] flex flex-row gap-2.5 h-12 items-center justify-center px-4 py-2 rounded-[20px] cursor-pointer hover:bg-[#e7e5e4]"
                        onClick={() => setShowAIChat(!showAIChat)}
                      >
                        <div className="size-5">
                          <ChatSparkle size="20" />
                        </div>
                        <div className="text-[14px] leading-[24px] text-[#0c0a09] font-medium font-ibm-plex-sans">
                          Ask GlowAI
                        </div>
                      </div>
                    </div>

                    {/* Reports List */}
                    <div className="flex flex-col gap-6 items-start justify-start w-full">
                      <div className="flex flex-col gap-3 items-start justify-start w-full">
                                                 {analyses?.map((analysis: any, index: number) => (
                          <div
                            key={analysis.id}
                            className={`bg-white rounded-3xl w-full cursor-pointer hover:shadow-sm transition-shadow ${
                              selectedAnalysisId === analysis.id 
                                ? 'border border-[#0c0a09]' 
                                : 'border border-[#e7e5e4]'
                            }`}
                            onClick={() => setSelectedAnalysisId(analysis.id)}
                          >
                            <div className="overflow-clip size-full">
                              <div className="flex flex-col gap-2.5 items-start justify-start p-[8px] w-full">
                                <div className="flex flex-row gap-4 items-center justify-start w-full">
                                  <div className="flex flex-row gap-4 flex-1 items-center justify-start min-h-0 min-w-0">
                                    
                                    {/* Image */}
                                    <div 
                                      className="bg-[#f5f5f4] rounded-2xl size-[100px] bg-cover bg-center"
                                      style={{
                                        backgroundImage: analysis.imageUrl ? `url('${analysis.imageUrl}')` : 'none'
                                      }}
                                    />
                                    
                                    {/* Details */}
                                    <div className="flex flex-col gap-1 flex-1 items-start justify-start min-h-0 min-w-0">
                                      <div className="text-[16px] leading-[20px] text-[#0c0a09] font-medium font-inter w-full">
                                        Analysis #{analysis.id}
                                      </div>
                                                                             <div className="text-[12px] leading-[16px] text-[#57534d] font-normal font-inter w-full text-ellipsis overflow-hidden whitespace-nowrap">
                                         Health condition: {analysis.overallScore ? 
                                           (analysis.overallScore >= 80 ? 'Excellent' :
                                            analysis.overallScore >= 60 ? 'Good' : 'Fair') : 'Unknown'
                                         }
                                      </div>
                                      <div className="text-[12px] leading-[16px] text-[#57534d] font-normal font-inter w-full">
                                        {formatDistanceToNow(new Date(analysis.createdAt), { addSuffix: true })}
                                      </div>
                                    </div>
                                  </div>
                                  
                                  {/* More Button */}
                                  <div className="flex flex-row gap-3 items-start justify-start opacity-80">
                                    <div className="flex flex-row gap-2.5 items-center justify-start overflow-clip p-[10px] rounded-xl">
                                      <div className="size-5">
                                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                          <circle cx="10" cy="4" r="1.5" fill="currentColor"/>
                                          <circle cx="10" cy="10" r="1.5" fill="currentColor"/>
                                          <circle cx="10" cy="16" r="1.5" fill="currentColor"/>
                                        </svg>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Content Area */}
              <div className="bg-white flex flex-col flex-1 h-full items-center justify-start max-w-[1000px] min-w-[504px] overflow-clip rounded-3xl">
                
                {/* Tabs Container */}
                <div className="w-full">
                  <div className="size-full">
                    <div className="flex flex-col gap-2.5 items-start justify-start pb-4 pt-6 px-5 w-full">
                      <div className="flex flex-row gap-3 items-center justify-start overflow-x-auto">
                        {tabs.map((tab) => (
                          <div
                            key={tab.id}
                            className={`flex flex-row gap-2.5 items-center justify-center px-3 py-2 rounded-xl cursor-pointer whitespace-nowrap ${
                              activeTab === tab.id
                                ? 'bg-[#0c0a09] text-white'
                                : 'bg-[#f4f4f0] text-[#79716b] hover:bg-[#e7e5e4]'
                            }`}
                            onClick={() => setActiveTab(tab.id)}
                          >
                            <div className="text-[14px] leading-[20px] font-ibm-plex-sans">
                              {tab.label}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content Area */}
                <div className="w-full flex-1 min-h-0">
                  <div className="size-full">
                    <div className="flex flex-col gap-5 items-stretch justify-start px-5 py-0 w-full h-full overflow-y-auto">
                      {selectedAnalysis && (
                        <>
                          {activeTab === "summary" && <SummaryTab analysis={selectedAnalysis} />}
                          {activeTab === "face-analysis" && <FaceAnalysisTab analysis={selectedAnalysis} />}
                          {activeTab === "health-risk" && <HealthRiskTab analysis={selectedAnalysis} />}
                          {activeTab === "food-intolerance" && <FoodIntoleranceTab analysis={selectedAnalysis} />}
                          {activeTab === "nutrient-deficiencies" && <NutrientDeficienciesTab analysis={selectedAnalysis} />}
                          {activeTab === "routine" && <RoutineTab analysis={selectedAnalysis} />}
                          {activeTab === "recommendations" && <RecommendationsTab analysis={selectedAnalysis} />}
                          {activeTab === "admin" && <AdminTab analysis={selectedAnalysis} />}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Chat Panel */}
              {showAIChat && selectedAnalysis && (
                <AIChatPanel 
                  analysis={selectedAnalysis} 
                  onClose={() => setShowAIChat(false)}
                />
              )}
            </div>
          </div>
          </div>
        </div>
      </div>
    );
  }

// Tab Components
function SummaryTab({ analysis }: { analysis: any }) {
  const healthScore = analysis.overallScore || 72;
  const estimatedAge = analysis.estimatedAge || analysis.ageRange || "Unknown";
  const conversationalAnalysis = analysis.analysisData?.conversationalAnalysis || {};
  
  // Use conversational analysis data if available
  const summaryText = conversationalAnalysis.facialFeatureBreakdown || 
    conversationalAnalysis.visualAgeEstimator || 
    "Comprehensive health analysis based on facial features and visual cues.";
  
    return (
    <div className="space-y-5 pb-5">
      {/* Estimated Age */}
      <div className="bg-[#f9f9f6] rounded-3xl w-full">
        <div className="flex flex-col gap-4 items-start justify-start p-[16px] w-full">
          <div className="text-[20px] font-semibold leading-[28px] text-[#0c0a09] w-full font-ibm-plex-serif">
            Estimated Age: {estimatedAge}
          </div>
        </div>
      </div>

      {/* Overall Health Score */}
      <div className="bg-[#f9f9f6] rounded-3xl w-full">
        <div className="flex flex-col items-center size-full">
          <div className="flex flex-col gap-4 items-center justify-start p-[16px] w-full">
            <div className="text-[20px] font-semibold leading-[28px] text-[#0c0a09] w-full font-ibm-plex-serif">
              Overall health score
            </div>
            <div className="flex flex-row gap-6 items-start justify-start w-full">
              
              {/* Circular Progress */}
              <div className="size-[120px] relative">
                <svg className="size-full -rotate-90" viewBox="0 0 120 120">
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    stroke="#e7e5e4"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    stroke="#4aab4d"
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={`${(healthScore / 100) * 314.16} 314.16`}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-[40px] leading-[44px] font-medium text-[#0c0a09] font-ibm-plex-sans">
                    {healthScore}
                  </div>
                  <div className="text-[14px] leading-[20px] text-[#0c0a09] font-medium font-ibm-plex-sans">
                    Fair
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="bg-[#e7e5e4] self-stretch w-px" />

              {/* Health Metrics */}
              <div className="flex flex-col gap-3 items-start justify-start w-[300px]">
                {[
                  { label: "Skin health", value: analysis.skinHealth || 72, color: "#cc9c08" },
                  { label: "Eye health", value: analysis.eyeHealth || 72, color: "#cc9c08" },
                  { label: "Circulation", value: analysis.circulation || 72, color: "#cc4908" },
                  { label: "Symmetry", value: analysis.symmetry || 72, color: "#4aab4d" }
                ].map((metric) => (
                  <div key={metric.label} className="flex flex-row items-center justify-between w-full">
                    <div className="text-[14px] leading-[20px] text-[#57534d] font-ibm-plex-sans">
                      {metric.label}
                    </div>
                    <div className="flex flex-row gap-4 items-center justify-start">
                      <div className="bg-[#e7e5e4] h-2 overflow-clip rounded-[100px] w-[124px] relative">
                        <div 
                          className="absolute h-2 left-0 rounded-[100px] top-0"
                          style={{ 
                            backgroundColor: metric.color,
                            width: `${(metric.value / 100) * 124}px`
                          }}
                        />
                      </div>
                      <div className="text-[14px] leading-[20px] text-[#57534d] text-right w-10 font-ibm-plex-sans">
                        {metric.value}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Analysis */}
      <div className="bg-[#f9f9f6] rounded-3xl w-full">
        <div className="flex flex-col gap-4 items-start justify-start p-[16px] w-full">
          <div className="text-[20px] font-semibold leading-[28px] text-[#0c0a09] w-full font-ibm-plex-serif">
            Analysis
          </div>
          <div className="flex flex-col gap-2 items-start justify-start text-[#57534d] w-full">
            <div className="text-[14px] leading-[20px] w-full font-ibm-plex-sans">
              <span className="font-semibold">Facial Feature Breakdown:</span>
              <span className="whitespace-pre-wrap"> {conversationalAnalysis.facialFeatureBreakdown || "Detailed facial analysis not available."}</span>
            </div>
            <div className="text-[14px] leading-[20px] w-full font-ibm-plex-sans">
              <span className="font-semibold">Visual Age Estimator:</span>
              <span className="whitespace-pre-wrap"> {conversationalAnalysis.visualAgeEstimator || "Age estimation analysis not available."}</span>
            </div>
            <div className="text-[14px] leading-[20px] w-full font-ibm-plex-sans">
              <span className="font-semibold">Deficiency Detector:</span>
              <span className="whitespace-pre-wrap"> {conversationalAnalysis.deficiencyDetector || "Deficiency analysis not available."}</span>
            </div>
            <div className="text-[14px] leading-[20px] w-full font-ibm-plex-sans">
              <span className="font-semibold">Food Intolerance Identifier:</span>
              <span className="whitespace-pre-wrap"> {conversationalAnalysis.foodIntoleranceIdentifier || "Food intolerance analysis not available."}</span>
            </div>
            <div className="text-[14px] leading-[20px] w-full font-ibm-plex-sans">
              <span className="font-semibold">Health Risk Reader:</span>
              <span className="whitespace-pre-wrap"> {conversationalAnalysis.healthRiskReader || "Health risk analysis not available."}</span>
            </div>
            <div className="text-[14px] leading-[20px] w-full font-ibm-plex-sans">
              <span className="font-semibold">Emotional State Scanner:</span>
              <span className="whitespace-pre-wrap"> {conversationalAnalysis.emotionalStateScanner || "Emotional state analysis not available."}</span>
            </div>
            <div className="text-[14px] leading-[20px] w-full font-ibm-plex-sans">
              <span className="font-semibold">Self-Healing Strategist:</span>
              <span className="whitespace-pre-wrap"> {conversationalAnalysis.selfHealingStrategist || "Self-healing recommendations not available."}</span>
            </div>
            {conversationalAnalysis.wellnessStrategist && (
              <div className="text-[14px] leading-[20px] w-full font-ibm-plex-sans">
                <span className="font-semibold">Wellness Strategist:</span>
                <span className="whitespace-pre-wrap"> {conversationalAnalysis.wellnessStrategist}</span>
              </div>
            )}
          </div>
        </div>
        </div>
      </div>
    );
  }

function FaceAnalysisTab({ analysis }: { analysis: any }) {
  const faceAnalysis = analysis.analysisData?.facialZoneAnalysis || {};
  const conversationalAnalysis = analysis.analysisData?.conversationalAnalysis || {};
  
  // All possible facial zones as defined in the OpenAI prompt
  const facialZones = ['forehead', 'eyes', 'nose', 'cheeks', 'lips', 'jawline', 'chin', 'neck'];

  return (
    <div className="space-y-5 pb-5">
      {/* Show conversational face analysis if available */}
      {conversationalAnalysis.facialFeatureBreakdown && (
        <div className="bg-[#f9f9f6] rounded-3xl w-full">
          <div className="flex flex-col gap-4 items-start justify-start p-[16px] w-full">
            <div className="text-[20px] font-semibold leading-[28px] text-[#0c0a09] w-full font-ibm-plex-serif">
              Comprehensive Facial Analysis
            </div>
            <div className="text-[14px] leading-[20px] text-[#57534d] w-full font-ibm-plex-sans whitespace-pre-wrap">
              {conversationalAnalysis.facialFeatureBreakdown}
            </div>
          </div>
        </div>
      )}

      {/* Dynamic facial zones from structured data */}
      {facialZones.map((zone) => {
        const zoneData = faceAnalysis[zone];
        if (!zoneData) return null;
        
        return (
          <div key={zone} className="bg-[#f9f9f6] rounded-3xl w-full">
            <div className="flex flex-col gap-4 items-start justify-start p-[16px] w-full">
              <div className="text-[20px] font-semibold leading-[28px] text-[#0c0a09] w-full font-ibm-plex-serif">
                {zone.charAt(0).toUpperCase() + zone.slice(1)}
              </div>
              <div className="flex flex-col gap-2 items-start justify-start w-full">
                {zoneData.observation && (
                  <div className="text-[14px] leading-[20px] text-[#57534d] w-full font-ibm-plex-sans">
                    <span className="font-semibold">Observation:</span>
                    <span> {zoneData.observation}</span>
                  </div>
                )}
                {zoneData.interpretation && (
                  <div className="text-[14px] leading-[20px] text-[#57534d] w-full font-ibm-plex-sans">
                    <span className="font-semibold">Interpretation:</span>
                    <span> {zoneData.interpretation}</span>
                  </div>
                )}
                {zoneData.suggestedAction && (
                  <div className="text-[14px] leading-[20px] text-[#57534d] w-full font-ibm-plex-sans">
                    <span className="font-semibold">Suggested action:</span>
                    <span> {zoneData.suggestedAction}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
      
      {/* Fallback message if no structured data */}
      {Object.keys(faceAnalysis).length === 0 && !conversationalAnalysis.facialFeatureBreakdown && (
        <div className="bg-[#f9f9f6] rounded-3xl w-full">
          <div className="flex flex-col gap-4 items-start justify-start p-[16px] w-full">
            <div className="text-[20px] font-semibold leading-[28px] text-[#0c0a09] w-full font-ibm-plex-serif">
              Face Analysis
            </div>
            <div className="text-[14px] leading-[20px] text-[#57534d] w-full font-ibm-plex-sans">
              Face analysis data is not available for this report.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function HealthRiskTab({ analysis }: { analysis: any }) {
  const healthRisks = analysis.analysisData?.healthRisks || [];
  const emotionalState = analysis.analysisData?.emotionalState || {};
  const conversationalAnalysis = analysis.analysisData?.conversationalAnalysis || {};
  
  return (
    <div className="space-y-5 pb-5">
      {/* Show conversational health risk analysis if available */}
      {conversationalAnalysis.healthRiskReader && (
        <div className="bg-[#f9f9f6] rounded-3xl w-full">
          <div className="flex flex-col gap-4 items-start justify-start p-[16px] w-full">
            <div className="text-[20px] font-semibold leading-[28px] text-[#0c0a09] w-full font-ibm-plex-serif">
              Comprehensive Health Risk Analysis
            </div>
            <div className="text-[14px] leading-[20px] text-[#57534d] w-full font-ibm-plex-sans whitespace-pre-wrap">
              {conversationalAnalysis.healthRiskReader}
            </div>
          </div>
                      </div>
      )}

      {/* Show emotional state analysis if available */}
      {conversationalAnalysis.emotionalStateScanner && (
        <div className="bg-[#f9f9f6] rounded-3xl w-full">
          <div className="flex flex-col gap-4 items-start justify-start p-[16px] w-full">
            <div className="text-[20px] font-semibold leading-[28px] text-[#0c0a09] w-full font-ibm-plex-serif">
              Emotional State & Stress Patterns
            </div>
            <div className="text-[14px] leading-[20px] text-[#57534d] w-full font-ibm-plex-sans whitespace-pre-wrap">
              {conversationalAnalysis.emotionalStateScanner}
            </div>
          </div>
                    </div>
      )}

      {/* Structured emotional state data */}
      {emotionalState.suppressedEmotions && emotionalState.suppressedEmotions.length > 0 && (
        <div className="bg-[#f9f9f6] rounded-3xl w-full">
          <div className="flex flex-col gap-4 items-start justify-start p-[16px] w-full">
            <div className="text-[20px] font-semibold leading-[28px] text-[#0c0a09] w-full font-ibm-plex-serif">
              Emotional Patterns
            </div>
            <div className="flex flex-col gap-2 items-start justify-start w-full">
              {emotionalState.suppressedEmotions.length > 0 && (
                <div className="text-[14px] leading-[20px] text-[#57534d] w-full font-ibm-plex-sans">
                  <span className="font-bold">Suppressed Emotions:</span>
                  <span> {emotionalState.suppressedEmotions.join(", ")}</span>
                </div>
              )}
              {emotionalState.stressPatterns && emotionalState.stressPatterns.length > 0 && (
                <div className="text-[14px] leading-[20px] text-[#57534d] w-full font-ibm-plex-sans">
                  <span className="font-bold">Stress Patterns:</span>
                  <span> {emotionalState.stressPatterns.join(", ")}</span>
                </div>
              )}
              {emotionalState.recommendations && emotionalState.recommendations.length > 0 && (
                <div className="text-[14px] leading-[20px] text-[#57534d] w-full font-ibm-plex-sans">
                  <span className="font-bold">Emotional Healing Recommendations:</span>
                  <ul className="list-disc ml-5 mt-1">
                    {emotionalState.recommendations.map((rec: any, index: number) => (
                      <li key={index}>{rec}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Structured health risk data */}
      {healthRisks.map((risk: any, index: number) => (
        <div key={index} className="bg-[#f9f9f6] rounded-3xl w-full">
          <div className="flex flex-col gap-4 items-start justify-start p-[16px] w-full">
            <div className="text-[20px] font-semibold leading-[28px] text-[#0c0a09] w-full font-ibm-plex-serif">
              {risk.risk}
            </div>
            <div className="flex flex-col gap-2 items-start justify-start w-full">
              <div className="text-[14px] leading-[20px] text-[#57534d] w-full font-ibm-plex-sans">
                <span className="font-bold">Visual Evidence:</span>
                <span> {risk.visualEvidence}</span>
              </div>
              <div className="text-[14px] leading-[20px] text-[#57534d] w-full font-ibm-plex-sans">
                <span className="font-bold">Explanation:</span>
                <span> {risk.explanation}</span>
              </div>
              <div className="flex flex-col gap-1 items-start justify-start w-full">
                <div className="text-[14px] leading-[20px] text-[#57534d] font-bold w-full font-ibm-plex-sans">
                  Action Steps:
                </div>
                <div className="text-[14px] leading-[20px] text-[#57534d] w-full font-ibm-plex-sans">
                  <ul className="list-disc ml-5">
                    {(risk.actionSteps || []).map((step: any, stepIndex: number) => (
                      <li key={stepIndex}>{step}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Fallback if no health risk data */}
      {healthRisks.length === 0 && !conversationalAnalysis.healthRiskReader && !conversationalAnalysis.emotionalStateScanner && (!emotionalState.suppressedEmotions || emotionalState.suppressedEmotions.length === 0) && (
        <div className="bg-[#f9f9f6] rounded-3xl w-full">
          <div className="flex flex-col gap-4 items-start justify-start p-[16px] w-full">
            <div className="text-[20px] font-semibold leading-[28px] text-[#0c0a09] w-full font-ibm-plex-serif">
              Health Risk Assessment
            </div>
            <div className="text-[14px] leading-[20px] text-[#57534d] w-full font-ibm-plex-sans">
              No health risk analysis available for this report.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FoodIntoleranceTab({ analysis }: { analysis: any }) {
  const foodIntolerances = analysis.analysisData?.foodIntolerances || [];
  const conversationalAnalysis = analysis.analysisData?.conversationalAnalysis || {};
  
  return (
    <div className="space-y-5 pb-5">
      {/* Show conversational food intolerance analysis if available */}
      {conversationalAnalysis.foodIntoleranceIdentifier && (
        <div className="bg-[#f9f9f6] rounded-3xl w-full">
          <div className="flex flex-col gap-4 items-start justify-start p-[16px] w-full">
            <div className="text-[20px] font-semibold leading-[28px] text-[#0c0a09] w-full font-ibm-plex-serif">
              Comprehensive Food Intolerance Analysis
            </div>
            <div className="text-[14px] leading-[20px] text-[#57534d] w-full font-ibm-plex-sans whitespace-pre-wrap">
              {conversationalAnalysis.foodIntoleranceIdentifier}
            </div>
          </div>
        </div>
      )}

      {/* Structured food intolerance data */}
      {foodIntolerances.map((intolerance: any, index: number) => (
        <div key={index} className="bg-[#f9f9f6] rounded-3xl w-full">
          <div className="flex flex-col gap-4 items-start justify-start p-[16px] w-full">
            <div className="text-[20px] font-semibold leading-[28px] text-[#0c0a09] w-full font-ibm-plex-serif">
              {intolerance.type} intolerance
            </div>
            <div className="flex flex-col gap-2 items-start justify-start w-full">
              <div className="text-[14px] leading-[20px] text-[#57534d] w-full font-ibm-plex-sans">
                <span className="font-bold">Visual Markers:</span>
                <span> {intolerance.visualMarkers?.join(", ") || "Not specified"}</span>
              </div>
              <div className="text-[14px] leading-[20px] text-[#57534d] w-full font-ibm-plex-sans">
                <span className="font-bold">Likelihood:</span>
                <span> {intolerance.likelihood}</span>
              </div>
              <div className="text-[14px] leading-[20px] text-[#57534d] w-full font-ibm-plex-sans">
                <span className="font-bold">Next Steps:</span>
                <span> {intolerance.nextSteps}</span>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Fallback if no food intolerance data */}
      {foodIntolerances.length === 0 && !conversationalAnalysis.foodIntoleranceIdentifier && (
        <div className="bg-[#f9f9f6] rounded-3xl w-full">
          <div className="flex flex-col gap-4 items-start justify-start p-[16px] w-full">
            <div className="text-[20px] font-semibold leading-[28px] text-[#0c0a09] w-full font-ibm-plex-serif">
              Food Intolerances
            </div>
            <div className="text-[14px] leading-[20px] text-[#57534d] w-full font-ibm-plex-sans">
              No food intolerance analysis available for this report.
            </div>
                      </div>
                    </div>
      )}
    </div>
  );
}

function NutrientDeficienciesTab({ analysis }: { analysis: any }) {
  const deficiencies = analysis.analysisData?.deficiencyAnalysis || [];
  const conversationalAnalysis = analysis.analysisData?.conversationalAnalysis || {};
  
  return (
    <div className="space-y-5 pb-5">
      {/* Show conversational deficiency analysis if available */}
      {conversationalAnalysis.deficiencyDetector && (
        <div className="bg-[#f9f9f6] rounded-3xl w-full">
          <div className="flex flex-col gap-4 items-start justify-start p-[16px] w-full">
            <div className="text-[20px] font-semibold leading-[28px] text-[#0c0a09] w-full font-ibm-plex-serif">
              Comprehensive Deficiency Analysis
            </div>
            <div className="text-[14px] leading-[20px] text-[#57534d] w-full font-ibm-plex-sans whitespace-pre-wrap">
              {conversationalAnalysis.deficiencyDetector}
            </div>
          </div>
        </div>
      )}

      {/* Structured deficiency data */}
      {deficiencies.map((deficiency: any, index: number) => (
        <div key={index} className="bg-[#f9f9f6] rounded-3xl w-full">
          <div className="flex flex-col gap-4 items-start justify-start p-[16px] w-full">
            <div className="text-[20px] font-semibold leading-[28px] text-[#0c0a09] w-full font-ibm-plex-serif">
              {deficiency.deficiency} deficiency
            </div>
            <div className="flex flex-col gap-2 items-start justify-start w-full">
              <div className="text-[14px] leading-[20px] text-[#57534d] w-full font-ibm-plex-sans">
                <span className="font-bold">Visual Cue:</span>
                <span> {deficiency.visualCue}</span>
              </div>
              <div className="text-[14px] leading-[20px] text-[#57534d] w-full font-ibm-plex-sans">
                <span className="font-bold">Severity:</span>
                <span> {deficiency.severity}</span>
              </div>
              <div className="text-[14px] leading-[20px] text-[#57534d] w-full font-ibm-plex-sans">
                <span className="font-bold">Likely Symptom:</span>
                <span> {deficiency.likelySymptom}</span>
              </div>
              <div className="text-[14px] leading-[20px] text-[#57534d] w-full font-ibm-plex-sans">
                <span className="font-bold">Recommendation:</span>
                <span> {deficiency.recommendation}</span>
              </div>
            </div>
                          </div>
                        </div>
      ))}

      {/* Fallback if no deficiency data */}
      {deficiencies.length === 0 && !conversationalAnalysis.deficiencyDetector && (
        <div className="bg-[#f9f9f6] rounded-3xl w-full">
          <div className="flex flex-col gap-4 items-start justify-start p-[16px] w-full">
            <div className="text-[20px] font-semibold leading-[28px] text-[#0c0a09] w-full font-ibm-plex-serif">
              Nutrient Deficiencies
            </div>
            <div className="text-[14px] leading-[20px] text-[#57534d] w-full font-ibm-plex-sans">
              No nutrient deficiency analysis available for this report.
            </div>
                        </div>
                      </div>
      )}
    </div>
  );
}

function RoutineTab({ analysis }: { analysis: any }) {
  const dailyProtocol = analysis.analysisData?.dailyProtocol || {};
  const conversationalAnalysis = analysis.analysisData?.conversationalAnalysis || {};
  
  return (
    <div className="space-y-5 pb-5">
      {/* Show conversational self-healing strategist if available */}
      {conversationalAnalysis.selfHealingStrategist && (
        <div className="bg-[#f9f9f6] rounded-3xl w-full">
          <div className="flex flex-col gap-4 items-start justify-start p-[16px] w-full">
            <div className="text-[20px] font-semibold leading-[28px] text-[#0c0a09] w-full font-ibm-plex-serif">
              Self-Healing Protocol
            </div>
            <div className="text-[14px] leading-[20px] text-[#57534d] w-full font-ibm-plex-sans whitespace-pre-wrap">
              {conversationalAnalysis.selfHealingStrategist}
            </div>
          </div>
        </div>
      )}

      {/* Morning */}
      {dailyProtocol.morning && dailyProtocol.morning.length > 0 && (
        <div className="bg-[#f9f9f6] rounded-3xl w-full">
          <div className="flex flex-col gap-4 items-start justify-start p-[16px] w-full">
            <div className="text-[20px] font-semibold leading-[28px] text-[#0c0a09] w-full font-ibm-plex-serif">
              Morning Routine
            </div>
            <div className="text-[14px] leading-[20px] text-[#57534d] w-full font-ibm-plex-sans">
              <ul className="list-disc ml-5">
                {dailyProtocol.morning.map((item: any, index: number) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Midday */}
      {dailyProtocol.midday && dailyProtocol.midday.length > 0 && (
        <div className="bg-[#f9f9f6] rounded-3xl w-full">
          <div className="flex flex-col gap-4 items-start justify-start p-[16px] w-full">
            <div className="text-[20px] font-semibold leading-[28px] text-[#0c0a09] w-full font-ibm-plex-serif">
              Midday Routine
            </div>
            <div className="text-[14px] leading-[20px] text-[#57534d] w-full font-ibm-plex-sans">
              <ul className="list-disc ml-5">
                {dailyProtocol.midday.map((item: any, index: number) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Evening */}
      {dailyProtocol.evening && dailyProtocol.evening.length > 0 && (
        <div className="bg-[#f9f9f6] rounded-3xl w-full">
          <div className="flex flex-col gap-4 items-start justify-start p-[16px] w-full">
            <div className="text-[20px] font-semibold leading-[28px] text-[#0c0a09] w-full font-ibm-plex-serif">
              Evening Routine
            </div>
            <div className="text-[14px] leading-[20px] text-[#57534d] w-full font-ibm-plex-sans">
              <ul className="list-disc ml-5">
                {dailyProtocol.evening.map((item: any, index: number) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
                          </div>
                          </div>
                        </div>
      )}

      {/* Weekly */}
      {dailyProtocol.weekly && dailyProtocol.weekly.length > 0 && (
        <div className="bg-[#f9f9f6] rounded-3xl w-full">
          <div className="flex flex-col gap-4 items-start justify-start p-[16px] w-full">
            <div className="text-[20px] font-semibold leading-[28px] text-[#0c0a09] w-full font-ibm-plex-serif">
              Weekly Practices
            </div>
            <div className="text-[14px] leading-[20px] text-[#57534d] w-full font-ibm-plex-sans">
              <ul className="list-disc ml-5">
                {dailyProtocol.weekly.map((item: any, index: number) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
                          </div>
                          </div>
                        </div>
      )}

      {/* Reset Foods */}
      {dailyProtocol.resetFoods && dailyProtocol.resetFoods.length > 0 && (
        <div className="bg-[#f9f9f6] rounded-3xl w-full">
          <div className="flex flex-col gap-4 items-start justify-start p-[16px] w-full">
            <div className="text-[20px] font-semibold leading-[28px] text-[#0c0a09] w-full font-ibm-plex-serif">
              Reset Foods
            </div>
            <div className="text-[14px] leading-[20px] text-[#57534d] w-full font-ibm-plex-sans">
              <ul className="list-disc ml-5">
                {dailyProtocol.resetFoods.map((item: any, index: number) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
                          </div>
                          </div>
                        </div>
      )}

      {/* Supplements */}
      {dailyProtocol.supplements && dailyProtocol.supplements.length > 0 && (
        <div className="bg-[#f9f9f6] rounded-3xl w-full">
          <div className="flex flex-col gap-4 items-start justify-start p-[16px] w-full">
            <div className="text-[20px] font-semibold leading-[28px] text-[#0c0a09] w-full font-ibm-plex-serif">
              Recommended Supplements
                          </div>
            <div className="text-[14px] leading-[20px] text-[#57534d] w-full font-ibm-plex-sans">
              <ul className="list-disc ml-5">
                {dailyProtocol.supplements.map((item: any, index: number) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
                          </div>
                        </div>
                      </div>
      )}

      {/* Mindset Shifts */}
      {dailyProtocol.mindsetShifts && dailyProtocol.mindsetShifts.length > 0 && (
        <div className="bg-[#f9f9f6] rounded-3xl w-full">
          <div className="flex flex-col gap-4 items-start justify-start p-[16px] w-full">
            <div className="text-[20px] font-semibold leading-[28px] text-[#0c0a09] w-full font-ibm-plex-serif">
              Mindset Shifts
            </div>
            <div className="text-[14px] leading-[20px] text-[#57534d] w-full font-ibm-plex-sans">
              <ul className="list-disc ml-5">
                {dailyProtocol.mindsetShifts.map((item: any, index: number) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Fallback if no data */}
      {!conversationalAnalysis.selfHealingStrategist && Object.keys(dailyProtocol).length === 0 && (
        <div className="bg-[#f9f9f6] rounded-3xl w-full">
          <div className="flex flex-col gap-4 items-start justify-start p-[16px] w-full">
            <div className="text-[20px] font-semibold leading-[28px] text-[#0c0a09] w-full font-ibm-plex-serif">
              Daily Routine
            </div>
            <div className="text-[14px] leading-[20px] text-[#57534d] w-full font-ibm-plex-sans">
              Routine recommendations are not available for this report.
            </div>
          </div>
                        </div>
                      )}
                    </div>
  );
}

function RecommendationsTab({ analysis }: { analysis: any }) {
  const recommendations = analysis.recommendations || {};
  const conversationalAnalysis = analysis.analysisData?.conversationalAnalysis || {};
  
  // All possible recommendation categories
  const categoryLabels: { [key: string]: string } = {
    immediate: "Immediate Actions",
    nutritional: "Nutritional Recommendations", 
    lifestyle: "Lifestyle Changes",
    longTerm: "Long-term Goals",
    supplements: "Supplement Recommendations",
    mindset: "Mindset & Mental Health",
    skincare: "Skincare Recommendations",
    sleep: "Sleep Optimization",
    stress: "Stress Management"
  };
  
  return (
    <div className="space-y-5 pb-5">
      {/* Show conversational wellness strategist if available */}
      {conversationalAnalysis.wellnessStrategist && (
        <div className="bg-[#f9f9f6] rounded-3xl w-full">
          <div className="flex flex-col gap-4 items-start justify-start p-[16px] w-full">
            <div className="text-[20px] font-semibold leading-[28px] text-[#0c0a09] w-full font-ibm-plex-serif">
              Comprehensive Wellness Strategy
            </div>
            <div className="text-[14px] leading-[20px] text-[#57534d] w-full font-ibm-plex-sans whitespace-pre-wrap">
              {conversationalAnalysis.wellnessStrategist}
            </div>
          </div>
        </div>
      )}

      {/* Dynamic recommendation categories */}
      {Object.entries(recommendations).map(([category, items]) => {
        if (!items || !Array.isArray(items) || items.length === 0) return null;
        
        return (
          <div key={category} className="bg-[#f9f9f6] rounded-3xl w-full">
            <div className="flex flex-col gap-4 items-start justify-start p-[16px] w-full">
              <div className="text-[20px] font-semibold leading-[28px] text-[#0c0a09] w-full font-ibm-plex-serif">
                {categoryLabels[category] || category.charAt(0).toUpperCase() + category.slice(1)}
              </div>
              <div className="space-y-2">
                {items.map((rec: any, index: number) => (
                  <div key={index} className="text-[14px] leading-[20px] text-[#57534d] w-full font-ibm-plex-sans">
                    {rec.title ? (
                      <>
                        <span className="font-bold">{rec.title}:</span>
                        <span> {rec.description || rec.timeframe || rec.icon || ''}</span>
                      </>
                    ) : (
                      <span>{typeof rec === 'string' ? rec : rec.description || JSON.stringify(rec)}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })}

      {/* Fallback if no recommendations */}
      {Object.keys(recommendations).length === 0 && !conversationalAnalysis.wellnessStrategist && (
        <div className="bg-[#f9f9f6] rounded-3xl w-full">
          <div className="flex flex-col gap-4 items-start justify-start p-[16px] w-full">
            <div className="text-[20px] font-semibold leading-[28px] text-[#0c0a09] w-full font-ibm-plex-serif">
              Recommendations
            </div>
            <div className="text-[14px] leading-[20px] text-[#57534d] w-full font-ibm-plex-sans">
              Recommendations are not available for this report.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function AdminTab({ analysis }: { analysis: any }) {
  const [copySuccess, setCopySuccess] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(analysis, null, 2));
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  // Helper function to format data for readable display
  const formatReadableData = (data: any) => {
    const sections = [];
    
    // Basic Info
    sections.push({
      title: "Basic Analysis Info",
      content: [
        `Analysis ID: ${data.id}`,
        `Overall Score: ${data.overallScore}%`,
        `Skin Health: ${data.skinHealth}%`,
        `Eye Health: ${data.eyeHealth}%`,
        `Circulation: ${data.circulation}%`,
        `Symmetry: ${data.symmetry}%`,
        `Estimated Age: ${data.estimatedAge || data.ageRange || 'Not available'}`,
        `Created: ${new Date(data.createdAt).toLocaleString()}`
      ]
    });

    // Conversational Analysis
    if (data.analysisData?.conversationalAnalysis) {
      const conv = data.analysisData.conversationalAnalysis;
      Object.keys(conv).forEach(key => {
        sections.push({
          title: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1'),
          content: [conv[key]]
        });
      });
    }

    // Facial Zone Analysis
    if (data.analysisData?.facialZoneAnalysis) {
      const zones = data.analysisData.facialZoneAnalysis;
      Object.keys(zones).forEach(zone => {
        if (zones[zone]) {
          sections.push({
            title: `${zone.charAt(0).toUpperCase() + zone.slice(1)} Analysis`,
            content: [
              `Observation: ${zones[zone].observation || 'N/A'}`,
              `Interpretation: ${zones[zone].interpretation || 'N/A'}`,
              `Suggested Action: ${zones[zone].suggestedAction || 'N/A'}`
            ]
          });
        }
      });
    }

    // Health Risks
    if (data.analysisData?.healthRisks) {
      data.analysisData.healthRisks.forEach((risk: any, index: number) => {
        sections.push({
          title: `Health Risk ${index + 1}: ${risk.risk}`,
          content: [
            `Visual Evidence: ${risk.visualEvidence}`,
            `Explanation: ${risk.explanation}`,
            `Action Steps: ${risk.actionSteps?.join(', ') || 'None'}`
          ]
        });
      });
    }

    // Deficiency Analysis
    if (data.analysisData?.deficiencyAnalysis) {
      data.analysisData.deficiencyAnalysis.forEach((def: any, index: number) => {
        sections.push({
          title: `Deficiency ${index + 1}: ${def.deficiency}`,
          content: [
            `Visual Cue: ${def.visualCue}`,
            `Severity: ${def.severity}`,
            `Likely Symptom: ${def.likelySymptom}`,
            `Recommendation: ${def.recommendation}`
          ]
        });
      });
    }

    // Food Intolerances
    if (data.analysisData?.foodIntolerances) {
      data.analysisData.foodIntolerances.forEach((intol: any, index: number) => {
        sections.push({
          title: `Food Intolerance ${index + 1}: ${intol.type}`,
          content: [
            `Visual Markers: ${intol.visualMarkers?.join(', ') || 'None'}`,
            `Likelihood: ${intol.likelihood}`,
            `Next Steps: ${intol.nextSteps}`
          ]
        });
      });
    }

    // Recommendations
    if (data.recommendations) {
      Object.keys(data.recommendations).forEach(category => {
        if (data.recommendations[category] && Array.isArray(data.recommendations[category])) {
          sections.push({
            title: `${category.charAt(0).toUpperCase() + category.slice(1)} Recommendations`,
            content: data.recommendations[category].map((rec: any) => 
              `${rec.title}: ${rec.description} (${rec.timeframe})`
            )
          });
        }
      });
    }

    return sections;
  };

  const readableData = formatReadableData(analysis);

  return (
    <div className="space-y-5 pb-5">
      {/* Raw JSON Data */}
      <div className="bg-[#f9f9f6] rounded-3xl w-full">
        <div className="flex flex-col gap-4 items-start justify-start p-[16px] w-full">
          <div className="flex flex-row items-center justify-between w-full">
            <div className="text-[20px] font-semibold leading-[28px] text-[#0c0a09] font-ibm-plex-serif">
              Raw API Data (JSON)
            </div>
            <button
              onClick={copyToClipboard}
              className={`px-4 py-2 rounded-lg text-[14px] font-medium transition-colors ${
                copySuccess 
                  ? 'bg-green-100 text-green-800 border border-green-200' 
                  : 'bg-[#0c0a09] text-white hover:bg-[#57534d]'
              }`}
            >
              {copySuccess ? 'Copied!' : 'Copy JSON'}
            </button>
          </div>
          <div className="w-full max-h-[400px] overflow-auto">
            <pre className="text-[12px] leading-[16px] text-[#57534d] bg-white p-4 rounded-xl border font-mono whitespace-pre-wrap">
              {JSON.stringify(analysis, null, 2)}
            </pre>
          </div>
        </div>
      </div>

      {/* Cleaned Up Readable Format */}
      <div className="bg-[#f9f9f6] rounded-3xl w-full">
        <div className="flex flex-col gap-4 items-start justify-start p-[16px] w-full">
          <div className="text-[20px] font-semibold leading-[28px] text-[#0c0a09] w-full font-ibm-plex-serif">
            Cleaned Up Analysis Data
          </div>
          <div className="w-full space-y-4">
            {readableData.map((section, index) => (
              <div key={index} className="bg-white p-4 rounded-xl border">
                <h3 className="text-[16px] font-semibold leading-[24px] text-[#0c0a09] mb-2 font-ibm-plex-sans">
                  {section.title}
                </h3>
                <div className="space-y-1">
                  {section.content.map((item, itemIndex) => (
                    <div key={itemIndex} className="text-[14px] leading-[20px] text-[#57534d] font-ibm-plex-sans">
                      • {item}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}