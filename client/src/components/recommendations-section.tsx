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

  return (
    <Card className="shadow-lg">
      <CardContent className="p-8">
        <h4 className="text-xl font-semibold text-dark-grey mb-6">Personalized Recommendations</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Immediate Actions */}
          <div>
            <h5 className="text-lg font-medium text-dark-grey mb-4 flex items-center">
              <Clock className="w-5 h-5 text-warning-orange mr-2" />
              Immediate Actions
            </h5>
            <ul className="space-y-3">
              {immediate.map((item, index) => (
                <li key={index} className="flex items-start">
                  <div className="mr-3 mt-1">
                    {getIconElement(item.icon)}
                  </div>
                  <div>
                    <p className="font-medium text-dark-grey">{item.title}</p>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Nutritional Strategies */}
          <div>
            <h5 className="text-lg font-medium text-dark-grey mb-4 flex items-center">
              <Apple className="w-5 h-5 text-success-green mr-2" />
              Nutritional Strategies
            </h5>
            <ul className="space-y-3">
              {nutritional.map((item, index) => (
                <li key={index} className="flex items-start">
                  <div className="mr-3 mt-1">
                    {getIconElement(item.icon)}
                  </div>
                  <div>
                    <p className="font-medium text-dark-grey">{item.title}</p>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Lifestyle Adjustments */}
          <div>
            <h5 className="text-lg font-medium text-dark-grey mb-4 flex items-center">
              <Heart className="w-5 h-5 text-trust-blue mr-2" />
              Lifestyle Adjustments
            </h5>
            <ul className="space-y-3">
              {lifestyle.map((item, index) => (
                <li key={index} className="flex items-start">
                  <div className="mr-3 mt-1">
                    {getIconElement(item.icon)}
                  </div>
                  <div>
                    <p className="font-medium text-dark-grey">{item.title}</p>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Long-term Healing Strategy */}
          <div>
            <h5 className="text-lg font-medium text-dark-grey mb-4 flex items-center">
              <Calendar className="w-5 h-5 text-medical-green mr-2" />
              Long-term Healing Strategy
            </h5>
            <ul className="space-y-3">
              {longTerm.map((item, index) => (
                <li key={index} className="flex items-start">
                  <div className="mr-3 mt-1">
                    {getIconElement(item.icon)}
                  </div>
                  <div>
                    <p className="font-medium text-dark-grey">{item.title}</p>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
