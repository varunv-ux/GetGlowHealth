import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  History, 
  Eye, 
  Heart, 
  Droplets, 
  Sparkles, 
  Clock, 
  FileImage,
  TrendingUp,
  Download,
  RotateCcw,
  LogOut,
  User,
  Shield
} from "lucide-react";
import { Link } from "wouter";
import { formatDistanceToNow } from "date-fns";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import type { Analysis } from "@shared/schema";

export default function HistoryPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const { data: analyses, isLoading, error } = useQuery({
    queryKey: ['/api/history'],
    queryFn: async () => {
      const res = await fetch('/api/history');
      if (!res.ok) {
        if (res.status === 401) {
          throw new Error('401: Unauthorized');
        }
        throw new Error('Failed to fetch history');
      }
      return res.json() as Analysis[];
    }
  });

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  // Handle unauthorized errors
  if (error && isUnauthorizedError(error)) {
    toast({
      title: "Unauthorized",
      description: "You are logged out. Logging in again...",
      variant: "destructive",
    });
    setTimeout(() => {
      window.location.href = "/api/login";
    }, 500);
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>
          <div className="grid gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="p-6">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-20 w-20 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-32" />
                    <div className="flex gap-2">
                      <Skeleton className="h-6 w-16" />
                      <Skeleton className="h-6 w-16" />
                      <Skeleton className="h-6 w-16" />
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-6">
        <div className="max-w-6xl mx-auto">
          <Card className="p-8 text-center">
            <div className="text-red-500 mb-4">
              <RotateCcw className="h-12 w-12 mx-auto" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Failed to Load History</h2>
            <p className="text-gray-600 mb-4">Unable to retrieve analysis history</p>
            <Button onClick={() => window.location.reload()}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-trust-blue rounded-lg">
              <History className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Analysis History</h1>
              <p className="text-gray-600">Review your previous facial health analyses</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <FileImage className="h-4 w-4" />
              <span>{analyses?.length || 0} analyses</span>
            </div>
            <div className="flex items-center gap-1">
              <TrendingUp className="h-4 w-4" />
              <span>Sorted by newest first</span>
            </div>
          </div>
        </div>

        {/* Analysis History */}
        {!analyses || analyses.length === 0 ? (
          <Card className="p-8 text-center">
            <div className="text-gray-400 mb-4">
              <History className="h-12 w-12 mx-auto" />
            </div>
            <h2 className="text-xl font-semibold mb-2">No Analysis History</h2>
            <p className="text-gray-600 mb-4">You haven't performed any facial health analyses yet</p>
            <Link href="/">
              <Button>
                <Sparkles className="h-4 w-4 mr-2" />
                Start Your First Analysis
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-6">
            {analyses.map((analysis) => (
              <Card key={analysis.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-6">
                    {/* Analysis Image */}
                    <div className="flex-shrink-0">
                      <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden">
                        <img 
                          src={analysis.imageUrl} 
                          alt={analysis.fileName}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTkgMTJDOS41NTIyOSAxMiAxMCAxMS41NTIzIDEwIDExQzEwIDEwLjQ0NzcgOS41NTIyOSAxMCA5IDEwQzguNDQ3NzEgMTAgOCAxMC40NDc3IDggMTFDOCAxMS41NTIzIDguNDQ3NzEgMTIgOSAxMloiIGZpbGw9IiM5Q0EzQUYiLz4KPHBhdGggZD0iTTE1IDEyQzE1LjU1MjMgMTIgMTYgMTEuNTUyMyAxNiAxMUMxNiAxMC40NDc3IDE1LjU1MjMgMTAgMTUgMTBDMTQuNDQ3NyAxMCAxNCAxMC40NDc3IDE0IDExQzE0IDExLjU1MjMgMTQuNDQ3NyAxMiAxNSAxMloiIGZpbGw9IiM5Q0EzQUYiLz4KPHBhdGggZD0iTTEyIDE2QzE0LjIwOTEgMTYgMTYgMTQuMjA5MSAxNiAxMkMxNiA5Ljc5MDg2IDE0LjIwOTEgOCAxMiA4QzkuNzkwODYgOCA4IDkuNzkwODYgOCAxMkM4IDE0LjIwOTEgOS43OTA4NiAxNiAxMiAxNloiIHN0cm9rZT0iIzlDQTNBRiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPC9zdmc+';
                          }}
                        />
                      </div>
                    </div>

                    {/* Analysis Details */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {analysis.fileName}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Clock className="h-3 w-3" />
                            <span>{formatDistanceToNow(new Date(analysis.createdAt), { addSuffix: true })}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            Overall Score: {analysis.overallScore}%
                          </Badge>
                          <Link href={`/analysis/${analysis.id}`}>
                            <Button size="sm" variant="outline">
                              <Eye className="h-3 w-3 mr-1" />
                              View Details
                            </Button>
                          </Link>
                        </div>
                      </div>

                      {/* Health Scores */}
                      <div className="grid grid-cols-4 gap-4 mb-4">
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 mb-1">
                            <Sparkles className="h-3 w-3 text-trust-blue" />
                            <span className="text-xs text-gray-600">Skin</span>
                          </div>
                          <div className="text-sm font-medium text-trust-blue">
                            {analysis.skinHealth}%
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 mb-1">
                            <Eye className="h-3 w-3 text-medical-green" />
                            <span className="text-xs text-gray-600">Eyes</span>
                          </div>
                          <div className="text-sm font-medium text-medical-green">
                            {analysis.eyeHealth}%
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 mb-1">
                            <Droplets className="h-3 w-3 text-error-red" />
                            <span className="text-xs text-gray-600">Circulation</span>
                          </div>
                          <div className="text-sm font-medium text-error-red">
                            {analysis.circulation}%
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 mb-1">
                            <Heart className="h-3 w-3 text-purple-500" />
                            <span className="text-xs text-gray-600">Symmetry</span>
                          </div>
                          <div className="text-sm font-medium text-purple-500">
                            {analysis.symmetry}%
                          </div>
                        </div>
                      </div>

                      {/* File Information */}
                      {analysis.analysisData?.imageProcessing && (
                        <div className="flex items-center gap-4 text-xs text-gray-500 pt-2 border-t">
                          <span>
                            Size: {analysis.analysisData.imageProcessing.originalSize}
                            {analysis.analysisData.imageProcessing.wasResized && 
                              ` → ${analysis.analysisData.imageProcessing.processedSize}`}
                          </span>
                          <span>
                            Dimensions: {analysis.originalDimensions}
                            {analysis.processedDimensions && analysis.processedDimensions !== analysis.originalDimensions && 
                              ` → ${analysis.processedDimensions}`}
                          </span>
                          {analysis.analysisData.imageProcessing.wasResized && (
                            <Badge variant="secondary" className="text-xs">
                              Optimized
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Back to Home */}
        <div className="mt-8 text-center">
          <Link href="/">
            <Button variant="outline" size="lg">
              <Sparkles className="h-4 w-4 mr-2" />
              Perform New Analysis
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}