import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Shield, UserCheck, History, Home as HomeIcon, BarChart3, LogOut, User } from "lucide-react";
import { Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import UploadSection from "@/components/upload-section";
import ProcessingSection from "@/components/processing-section";
import ResultsSection from "@/components/results-section";
import type { Analysis } from "@shared/schema";

export default function Home() {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState<'upload' | 'processing' | 'results'>('upload');
  const [analysisId, setAnalysisId] = useState<number | null>(null);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  
  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  const handleUploadComplete = (id: number) => {
    setAnalysisId(id);
    setCurrentStep('processing');
  };

  const handleAnalysisComplete = (analysisData: Analysis) => {
    setAnalysis(analysisData);
    setCurrentStep('results');
  };

  const handleNewAnalysis = () => {
    setCurrentStep('upload');
    setAnalysisId(null);
    setAnalysis(null);
  };

  return (
    <div className="min-h-screen bg-clean-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <UserCheck className="text-medical-green w-8 h-8 mr-3" />
              <h1 className="text-xl font-bold text-dark-grey">FaceHealth Pro</h1>
            </div>
            <nav className="hidden md:flex space-x-6">
              <Link href="/">
                <Button variant="ghost" className="flex items-center gap-2 text-dark-grey hover:text-medical-green transition-colors">
                  <HomeIcon className="w-4 h-4" />
                  <span>Analysis</span>
                </Button>
              </Link>
              <Link href="/history">
                <Button variant="ghost" className="flex items-center gap-2 text-dark-grey hover:text-medical-green transition-colors">
                  <History className="w-4 h-4" />
                  <span>History</span>
                </Button>
              </Link>
            </nav>
            <div className="flex items-center space-x-4">
              {user && (
                <div className="flex items-center space-x-3">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={user.profileImageUrl} alt={user.firstName || 'User'} />
                    <AvatarFallback>
                      {user.firstName?.charAt(0) || user.email?.charAt(0) || <User className="w-4 h-4" />}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-gray-700 hidden md:inline">
                    {user.firstName || user.email}
                  </span>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={handleLogout}
                    className="text-gray-600 hover:text-red-600 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                  </Button>
                </div>
              )}
              <div className="flex items-center space-x-2">
                <Shield className="text-trust-blue w-4 h-4" />
                <span className="text-sm text-gray-600">HIPAA Compliant</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-dark-grey mb-4">AI-Powered Facial Health Analysis</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Upload your photo and receive comprehensive health insights based on advanced facial feature analysis and medical research.
          </p>
        </div>

        {/* Dynamic Content Based on Step */}
        {currentStep === 'upload' && (
          <UploadSection onUploadComplete={handleUploadComplete} />
        )}

        {currentStep === 'processing' && analysisId && (
          <ProcessingSection 
            analysisId={analysisId} 
            onAnalysisComplete={handleAnalysisComplete}
          />
        )}

        {currentStep === 'results' && analysis && (
          <ResultsSection 
            analysis={analysis} 
            onNewAnalysis={handleNewAnalysis}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <UserCheck className="text-medical-green w-6 h-6 mr-2" />
                <span className="font-bold text-dark-grey">FaceHealth Pro</span>
              </div>
              <p className="text-sm text-gray-600">Advanced AI-powered facial health analysis for better wellness insights.</p>
            </div>
            
            <div>
              <h6 className="font-semibold text-dark-grey mb-3">Features</h6>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-medical-green transition-colors">AI Analysis</a></li>
                <li><a href="#" className="hover:text-medical-green transition-colors">Health Reports</a></li>
                <li><a href="#" className="hover:text-medical-green transition-colors">Recommendations</a></li>
                <li><a href="#" className="hover:text-medical-green transition-colors">Progress Tracking</a></li>
              </ul>
            </div>
            
            <div>
              <h6 className="font-semibold text-dark-grey mb-3">Support</h6>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-medical-green transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-medical-green transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-medical-green transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-medical-green transition-colors">Terms of Service</a></li>
              </ul>
            </div>
            
            <div>
              <h6 className="font-semibold text-dark-grey mb-3">Compliance</h6>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <Shield className="text-trust-blue w-4 h-4 mr-2" />
                  <span>HIPAA Compliant</span>
                </div>
                <div className="flex items-center">
                  <Shield className="text-trust-blue w-4 h-4 mr-2" />
                  <span>FDA Guidelines</span>
                </div>
                <div className="flex items-center">
                  <Shield className="text-trust-blue w-4 h-4 mr-2" />
                  <span>SOC 2 Certified</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-200 mt-8 pt-8 text-center text-sm text-gray-600">
            <p>&copy; 2024 FaceHealth Pro. All rights reserved. This tool provides general health insights and should not replace professional medical advice.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
