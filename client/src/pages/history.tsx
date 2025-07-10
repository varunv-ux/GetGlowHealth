import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  Shield,
  UserCheck,
  Home as HomeIcon,
  ChevronDown,
  ImageOff,
  Brain,
  Activity,
  AlertTriangle,
  Utensils,
  Smile,
  Zap,
  Settings,
  Code,
  Database
} from "lucide-react";
import { Link } from "wouter";
import { formatDistanceToNow } from "date-fns";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { useState } from "react";
import type { Analysis } from "@shared/schema";

export default function HistoryPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});
  
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
    <div className="min-h-screen bg-clean-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14">
            <div className="flex items-center">
              <UserCheck className="text-medical-green w-6 h-6 sm:w-8 sm:h-8 mr-2 sm:mr-3" />
              <h1 className="text-lg sm:text-xl font-bold text-dark-grey">FaceHealth Pro</h1>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-6">
              <Link href="/" className="flex items-center gap-2 text-dark-grey hover:text-medical-green transition-colors px-3 py-2 rounded-md text-sm font-medium">
                <HomeIcon className="w-4 h-4" />
                <span>Analysis</span>
              </Link>
              <Link href="/history" className="flex items-center gap-2 text-medical-green px-3 py-2 rounded-md text-sm font-medium">
                <History className="w-4 h-4" />
                <span>History</span>
              </Link>
            </nav>
            
            {/* Mobile Navigation + Profile */}
            <div className="flex items-center space-x-2">
              {user && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center space-x-2 p-2">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={user.profileImageUrl} alt={user.firstName || 'User'} />
                        <AvatarFallback>
                          {user.firstName?.charAt(0) || user.email?.charAt(0) || <User className="w-4 h-4" />}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-gray-700 hidden sm:inline max-w-24 truncate">
                        {user.firstName || user.email}
                      </span>
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {user.firstName || 'User'}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    
                    {/* Mobile Navigation Items */}
                    <div className="md:hidden">
                      <Link href="/">
                        <DropdownMenuItem>
                          <HomeIcon className="w-4 h-4 mr-2" />
                          Analysis
                        </DropdownMenuItem>
                      </Link>
                      <Link href="/history">
                        <DropdownMenuItem>
                          <History className="w-4 h-4 mr-2" />
                          History
                        </DropdownMenuItem>
                      </Link>
                      <DropdownMenuSeparator />
                    </div>
                    
                    <DropdownMenuItem>
                      <Shield className="w-4 h-4 mr-2" />
                      HIPAA Compliant
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={handleLogout}
                      className="text-red-600 focus:text-red-600 focus:bg-red-50"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Page Header */}
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
                <CardContent className="p-0">
                  <div className="flex">
                    {/* Left sidebar with image and basic info */}
                    <div className="w-72 bg-gray-50 p-6 border-r">
                      <div className="w-full h-48 bg-gray-100 rounded-lg overflow-hidden mb-4 flex items-center justify-center">
                        {imageErrors[analysis.id] ? (
                          <ImageOff className="w-12 h-12 text-gray-400" />
                        ) : (
                          <img 
                            src={analysis.imageUrl} 
                            alt={analysis.fileName}
                            className="w-full h-full object-cover"
                            onError={() => setImageErrors(prev => ({ ...prev, [analysis.id]: true }))}
                          />
                        )}
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <h3 className="font-medium text-gray-900 mb-1">{analysis.fileName}</h3>
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Clock className="h-3 w-3" />
                            <span>{formatDistanceToNow(new Date(analysis.createdAt), { addSuffix: true })}</span>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Health condition:</span>
                            <Badge variant="outline" className="text-xs">
                              {analysis.overallScore >= 80 ? 'Excellent' : 
                               analysis.overallScore >= 60 ? 'Good' : 
                               analysis.overallScore >= 40 ? 'Fair' : 'Poor'}
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-500">
                            {formatDistanceToNow(new Date(analysis.createdAt), { addSuffix: true })}
                          </div>
                        </div>
                        
                        <Link href={`/analysis/${analysis.id}`}>
                          <Button size="sm" variant="outline" className="w-full">
                            <Eye className="h-3 w-3 mr-1" />
                            View Full Analysis
                          </Button>
                        </Link>
                      </div>
                    </div>

                    {/* Right content with tabs */}
                    <div className="flex-1">
                      <Tabs defaultValue="summary" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                          <TabsTrigger value="summary">Summary</TabsTrigger>
                          <TabsTrigger value="admin">Admin</TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="summary" className="p-6">
                          {/* Overall Health Score */}
                          <div className="mb-6">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="text-lg font-semibold">Overall Health Score</h4>
                              <Badge variant="secondary" className="text-lg px-3 py-1">
                                {analysis.overallScore}%
                              </Badge>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-medical-green h-2 rounded-full transition-all duration-300"
                                style={{ width: `${analysis.overallScore}%` }}
                              />
                            </div>
                          </div>

                          {/* Health Scores Grid */}
                          <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="bg-blue-50 p-4 rounded-lg">
                              <div className="flex items-center gap-2 mb-2">
                                <Sparkles className="h-4 w-4 text-trust-blue" />
                                <span className="text-sm font-medium">Skin Health</span>
                              </div>
                              <div className="text-2xl font-bold text-trust-blue">{analysis.skinHealth}%</div>
                            </div>
                            <div className="bg-green-50 p-4 rounded-lg">
                              <div className="flex items-center gap-2 mb-2">
                                <Eye className="h-4 w-4 text-medical-green" />
                                <span className="text-sm font-medium">Eye Health</span>
                              </div>
                              <div className="text-2xl font-bold text-medical-green">{analysis.eyeHealth}%</div>
                            </div>
                            <div className="bg-red-50 p-4 rounded-lg">
                              <div className="flex items-center gap-2 mb-2">
                                <Droplets className="h-4 w-4 text-error-red" />
                                <span className="text-sm font-medium">Circulation</span>
                              </div>
                              <div className="text-2xl font-bold text-error-red">{analysis.circulation}%</div>
                            </div>
                            <div className="bg-purple-50 p-4 rounded-lg">
                              <div className="flex items-center gap-2 mb-2">
                                <Heart className="h-4 w-4 text-purple-500" />
                                <span className="text-sm font-medium">Symmetry</span>
                              </div>
                              <div className="text-2xl font-bold text-purple-500">{analysis.symmetry}%</div>
                            </div>
                          </div>

                          {/* Analysis Sections */}
                          <div className="space-y-4">
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <div className="flex items-center gap-2 mb-2">
                                <Brain className="h-4 w-4 text-gray-600" />
                                <span className="font-medium">Facial Feature Breakdown</span>
                              </div>
                              <p className="text-sm text-gray-600">
                                {analysis.analysisData?.facialFeatures || 'Comprehensive analysis of facial structure and symmetry patterns.'}
                              </p>
                            </div>
                            
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <div className="flex items-center gap-2 mb-2">
                                <Activity className="h-4 w-4 text-gray-600" />
                                <span className="font-medium">Visual Age Assessment</span>
                              </div>
                              <p className="text-sm text-gray-600">
                                {analysis.analysisData?.visualAge || 'Analysis of skin texture, elasticity, and age-related indicators.'}
                              </p>
                            </div>
                            
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <div className="flex items-center gap-2 mb-2">
                                <AlertTriangle className="h-4 w-4 text-gray-600" />
                                <span className="font-medium">Deficiency Detection</span>
                              </div>
                              <p className="text-sm text-gray-600">
                                {analysis.analysisData?.deficiencies || 'Identification of potential nutritional deficiencies based on visible indicators.'}
                              </p>
                            </div>
                            
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <div className="flex items-center gap-2 mb-2">
                                <Utensils className="h-4 w-4 text-gray-600" />
                                <span className="font-medium">Food Intolerance</span>
                              </div>
                              <p className="text-sm text-gray-600">
                                {analysis.analysisData?.foodIntolerance || 'Assessment of potential food sensitivities based on facial indicators.'}
                              </p>
                            </div>
                            
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <div className="flex items-center gap-2 mb-2">
                                <AlertTriangle className="h-4 w-4 text-gray-600" />
                                <span className="font-medium">Health Risk</span>
                              </div>
                              <p className="text-sm text-gray-600">
                                {analysis.analysisData?.healthRisk || 'Evaluation of potential health risks based on facial analysis.'}
                              </p>
                            </div>
                            
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <div className="flex items-center gap-2 mb-2">
                                <Smile className="h-4 w-4 text-gray-600" />
                                <span className="font-medium">Emotional State</span>
                              </div>
                              <p className="text-sm text-gray-600">
                                {analysis.analysisData?.emotionalState || 'Analysis of emotional indicators and stress patterns.'}
                              </p>
                            </div>
                            
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <div className="flex items-center gap-2 mb-2">
                                <Zap className="h-4 w-4 text-gray-600" />
                                <span className="font-medium">Self Healing</span>
                              </div>
                              <p className="text-sm text-gray-600">
                                {analysis.analysisData?.selfHealing || 'Recommendations for natural healing and recovery processes.'}
                              </p>
                            </div>
                          </div>
                        </TabsContent>
                        
                        <TabsContent value="admin" className="p-6">
                          <div className="space-y-6">
                            <div>
                              <div className="flex items-center gap-2 mb-3">
                                <Code className="h-4 w-4 text-gray-600" />
                                <h4 className="font-medium">AI Health Assessment</h4>
                              </div>
                              <div className="bg-gray-50 p-4 rounded-lg text-sm">
                                <pre className="whitespace-pre-wrap text-gray-700">
                                  {analysis.analysisData?.aiAssessment || 'No AI assessment data available.'}
                                </pre>
                              </div>
                            </div>
                            
                            <div>
                              <div className="flex items-center gap-2 mb-3">
                                <Database className="h-4 w-4 text-gray-600" />
                                <h4 className="font-medium">Raw AI Analysis</h4>
                              </div>
                              <div className="bg-gray-50 p-4 rounded-lg text-sm max-h-60 overflow-y-auto">
                                <pre className="whitespace-pre-wrap text-gray-700">
                                  {JSON.stringify(analysis.analysisData, null, 2)}
                                </pre>
                              </div>
                            </div>
                            
                            <div>
                              <div className="flex items-center gap-2 mb-3">
                                <Settings className="h-4 w-4 text-gray-600" />
                                <h4 className="font-medium">Analysis Details</h4>
                              </div>
                              <div className="bg-gray-50 p-4 rounded-lg text-sm space-y-2">
                                <div><strong>Analysis ID:</strong> {analysis.id}</div>
                                <div><strong>User ID:</strong> {analysis.userId}</div>
                                <div><strong>Created:</strong> {new Date(analysis.createdAt).toLocaleString()}</div>
                                <div><strong>Image URL:</strong> {analysis.imageUrl}</div>
                                <div><strong>File Name:</strong> {analysis.fileName}</div>
                                <div><strong>File Size:</strong> {analysis.fileSize} bytes</div>
                                <div><strong>Processed Size:</strong> {analysis.processedSize} bytes</div>
                                {analysis.analysisData?.imageProcessing && (
                                  <>
                                    <div><strong>Original Dimensions:</strong> {analysis.analysisData.imageProcessing.originalDimensions}</div>
                                    <div><strong>Processed Dimensions:</strong> {analysis.analysisData.imageProcessing.processedDimensions}</div>
                                    <div><strong>Was Resized:</strong> {analysis.analysisData.imageProcessing.wasResized ? 'Yes' : 'No'}</div>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </TabsContent>
                      </Tabs>
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
      </main>
    </div>
  );
}