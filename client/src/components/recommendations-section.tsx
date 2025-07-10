import { Card, CardContent } from "@/components/ui/card";
import { Clock, Calendar, Apple, Heart } from "lucide-react";
import type { Analysis } from "@shared/schema";

interface RecommendationsSectionProps {
  analysis: Analysis;
}

export default function RecommendationsSection({ analysis }: RecommendationsSectionProps) {
  const { recommendations } = analysis;
  const immediate = recommendations.immediate || [];
  const nutritional = recommendations.nutritional || [];
  const lifestyle = recommendations.lifestyle || [];
  const longTerm = recommendations.longTerm || [];

  const getIconElement = (iconClass: string) => {
    // Map Font Awesome classes to Lucide icons
    const iconMap: { [key: string]: JSX.Element } = {
      'fas fa-sun': <span className="text-warning-orange">☀️</span>,
      'fas fa-tint': <span className="text-trust-blue">💧</span>,
      'fas fa-bed': <span className="text-medical-green">🛏️</span>,
      'fas fa-apple-alt': <span className="text-success-green">🍎</span>,
      'fas fa-running': <span className="text-trust-blue">🏃</span>,
      'fas fa-user-md': <span className="text-medical-green">👨‍⚕️</span>,
    };
    
    return iconMap[iconClass] || <span className="text-gray-500">•</span>;
  };

  return null;
}
