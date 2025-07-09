import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Bot, Clock } from "lucide-react";
import type { Analysis } from "@shared/schema";

interface ChatResponseDisplayProps {
  analysis: Analysis;
}

export default function ChatResponseDisplay({ analysis }: ChatResponseDisplayProps) {
  const rawAnalysis = analysis.analysisData?.rawAnalysis;
  
  if (!rawAnalysis) {
    return null;
  }

  // Extract and format the content from the raw analysis
  const getChatContent = () => {
    try {
      const parsedResponse = JSON.parse(rawAnalysis.fullResponse);
      
      // Try to get the message content from various possible structures
      let content = null;
      
      if (parsedResponse.choices && parsedResponse.choices[0]?.message?.content) {
        content = parsedResponse.choices[0].message.content;
      } else if (parsedResponse.message && parsedResponse.message.content) {
        content = parsedResponse.message.content;
      } else if (parsedResponse.content) {
        content = parsedResponse.content;
      } else if (typeof parsedResponse === 'string') {
        content = parsedResponse;
      }
      
      // If we found content, try to parse and format it nicely
      if (content) {
        try {
          // Try to parse the content as JSON first
          const jsonContent = JSON.parse(content);
          return formatJsonToReadableText(jsonContent);
        } catch {
          // If it's not JSON, return as is
          return content;
        }
      }
      
      // If no content found, try to format the entire response
      return formatJsonToReadableText(parsedResponse);
    } catch (error) {
      console.error('Error parsing chat response:', error);
      return "Error parsing the AI response.";
    }
  };

  // Format JSON data into readable text
  const formatJsonToReadableText = (data: any): string => {
    if (!data || typeof data !== 'object') {
      return String(data || 'No content available');
    }

    let result = '';

    // Handle health analysis sections
    if (data.overallHealthAssessment) {
      result += `**Overall Health Assessment**\n`;
      result += `Overall Score: ${data.overallHealthAssessment.overallScore}/100\n`;
      result += `Summary: ${data.overallHealthAssessment.summary}\n\n`;
    }

    if (data.detailedAnalysis) {
      result += `**Detailed Analysis**\n\n`;
      
      if (data.detailedAnalysis.skinAnalysis) {
        result += `**Skin Health:**\n`;
        const skin = data.detailedAnalysis.skinAnalysis;
        if (skin.hydration) result += `• Hydration: ${skin.hydration}\n`;
        if (skin.texture) result += `• Texture: ${skin.texture}\n`;
        if (skin.pigmentation) result += `• Pigmentation: ${skin.pigmentation}\n`;
        if (skin.elasticity) result += `• Elasticity: ${skin.elasticity}\n`;
        result += '\n';
      }

      if (data.detailedAnalysis.eyeAnalysis) {
        result += `**Eye Health:**\n`;
        const eyes = data.detailedAnalysis.eyeAnalysis;
        if (eyes.underEyeCircles) result += `• Under-eye circles: ${eyes.underEyeCircles}\n`;
        if (eyes.puffiness) result += `• Puffiness: ${eyes.puffiness}\n`;
        if (eyes.brightness) result += `• Brightness: ${eyes.brightness}\n`;
        result += '\n';
      }

      if (data.detailedAnalysis.circulationAnalysis) {
        result += `**Circulation:**\n`;
        const circulation = data.detailedAnalysis.circulationAnalysis;
        if (circulation.facialFlush) result += `• Facial flush: ${circulation.facialFlush}\n`;
        if (circulation.lipColor) result += `• Lip color: ${circulation.lipColor}\n`;
        if (circulation.overallTone) result += `• Overall tone: ${circulation.overallTone}\n`;
        result += '\n';
      }
    }

    if (data.healthRisks && Array.isArray(data.healthRisks)) {
      result += `**Health Risk Assessment:**\n`;
      data.healthRisks.forEach((risk: any, index: number) => {
        result += `${index + 1}. **${risk.risk}**\n`;
        if (risk.visualEvidence) result += `   Visual evidence: ${risk.visualEvidence}\n`;
        if (risk.explanation) result += `   Explanation: ${risk.explanation}\n`;
        if (risk.actionSteps && Array.isArray(risk.actionSteps)) {
          result += `   Action steps:\n`;
          risk.actionSteps.forEach((step: string) => {
            result += `   • ${step}\n`;
          });
        }
        result += '\n';
      });
    }

    if (data.emotionalState) {
      result += `**Emotional State Assessment:**\n`;
      const emotional = data.emotionalState;
      if (emotional.suppressedEmotions) {
        result += `• Suppressed emotions: ${Array.isArray(emotional.suppressedEmotions) ? emotional.suppressedEmotions.join(', ') : emotional.suppressedEmotions}\n`;
      }
      if (emotional.stressPatterns) {
        result += `• Stress patterns: ${Array.isArray(emotional.stressPatterns) ? emotional.stressPatterns.join(', ') : emotional.stressPatterns}\n`;
      }
      if (emotional.recommendations && Array.isArray(emotional.recommendations)) {
        result += `• Recommendations:\n`;
        emotional.recommendations.forEach((rec: string) => {
          result += `  • ${rec}\n`;
        });
      }
      result += '\n';
    }

    if (data.dailyProtocol) {
      result += `**Daily Protocol:**\n`;
      const protocol = data.dailyProtocol;
      
      if (protocol.morning) {
        result += `**Morning routine:**\n`;
        protocol.morning.forEach((item: string) => result += `• ${item}\n`);
        result += '\n';
      }
      
      if (protocol.midday) {
        result += `**Midday routine:**\n`;
        protocol.midday.forEach((item: string) => result += `• ${item}\n`);
        result += '\n';
      }
      
      if (protocol.evening) {
        result += `**Evening routine:**\n`;
        protocol.evening.forEach((item: string) => result += `• ${item}\n`);
        result += '\n';
      }
      
      if (protocol.supplements) {
        result += `**Recommended supplements:**\n`;
        protocol.supplements.forEach((item: string) => result += `• ${item}\n`);
        result += '\n';
      }
    }

    if (data.recommendations) {
      result += `**Recommendations:**\n`;
      const recs = data.recommendations;
      
      Object.keys(recs).forEach((category) => {
        if (Array.isArray(recs[category])) {
          result += `\n**${category.charAt(0).toUpperCase() + category.slice(1)}:**\n`;
          recs[category].forEach((rec: any) => {
            result += `• **${rec.title}**: ${rec.description}`;
            if (rec.timeframe) result += ` (${rec.timeframe})`;
            result += '\n';
          });
        }
      });
    }

    return result || 'Comprehensive health analysis completed. Please see the detailed sections below for specific insights and recommendations.';
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const chatContent = getChatContent();

  return (
    <Card className="shadow-lg">
      <CardContent className="p-8">
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-xl font-semibold text-dark-grey flex items-center">
            <MessageSquare className="w-5 h-5 text-trust-blue mr-2" />
            AI Health Assessment
          </h4>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-trust-blue border-trust-blue">
              <Bot className="w-3 h-3 mr-1" />
              OpenAI GPT-4.1
            </Badge>
            <Badge variant="outline" className="text-gray-600">
              <Clock className="w-3 h-3 mr-1" />
              {formatTimestamp(rawAnalysis.responseTime)}
            </Badge>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-6 border border-gray-200">
          <div className="prose prose-sm max-w-none">
            <div className="text-gray-800 whitespace-pre-wrap leading-relaxed">
              {chatContent.split('\n').map((line, index) => {
                if (line.startsWith('**') && line.endsWith('**')) {
                  return (
                    <h4 key={index} className="font-semibold text-lg text-dark-grey mb-2 mt-4">
                      {line.replace(/\*\*/g, '')}
                    </h4>
                  );
                }
                if (line.startsWith('• ') || line.startsWith('   • ')) {
                  return (
                    <div key={index} className="ml-4 mb-1 text-gray-700">
                      {line}
                    </div>
                  );
                }
                if (line.match(/^\d+\./)) {
                  return (
                    <div key={index} className="font-medium text-gray-800 mb-2 mt-3">
                      {line}
                    </div>
                  );
                }
                if (line.trim() === '') {
                  return <div key={index} className="h-2"></div>;
                }
                return (
                  <div key={index} className="mb-1 text-gray-700">
                    {line}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-gray-700">
            <MessageSquare className="w-4 h-4 text-trust-blue mr-2 inline" />
            This analysis is generated by OpenAI's GPT-4.1 vision model based on your uploaded image. 
            The AI provides personalized health insights using advanced computer vision and medical knowledge.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}