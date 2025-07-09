import { Card, CardContent } from "@/components/ui/card";
import type { Analysis } from "@shared/schema";

interface FacialAnalysisDisplayProps {
  analysis: Analysis;
}

export default function FacialAnalysisDisplay({ analysis }: FacialAnalysisDisplayProps) {
  const markers = analysis.analysisData.facialMarkers || [];
  
  const getMarkerColor = (status: string) => {
    switch (status) {
      case 'excellent':
        return 'bg-medical-green';
      case 'good':
        return 'bg-success-green';
      case 'minor_issues':
        return 'bg-warning-orange';
      default:
        return 'bg-trust-blue';
    }
  };

  return (
    <Card className="shadow-lg">
      <CardContent className="p-6">
        <h4 className="text-lg font-semibold text-dark-grey mb-4">Facial Feature Analysis</h4>
        <div className="relative bg-gray-100 rounded-lg aspect-square flex items-center justify-center">
          <img 
            src={analysis.imageUrl} 
            alt="Analysis subject" 
            className="w-full h-full object-cover rounded-lg"
          />
          
          {/* Facial Markers Overlay */}
          <div className="absolute inset-0">
            {markers.map((marker, index) => (
              <div
                key={index}
                className={`absolute w-3 h-3 rounded-full border-2 border-white shadow-lg ${getMarkerColor(marker.status)}`}
                style={{
                  left: `${marker.x}%`,
                  top: `${marker.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
              />
            ))}
          </div>
        </div>
        
        {/* Marker Legend */}
        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-medical-green rounded-full mr-2"></div>
            <span className="text-gray-600">Excellent</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-success-green rounded-full mr-2"></div>
            <span className="text-gray-600">Good</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-warning-orange rounded-full mr-2"></div>
            <span className="text-gray-600">Minor Issues</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-trust-blue rounded-full mr-2"></div>
            <span className="text-gray-600">Normal</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
